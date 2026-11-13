export default async function handler(req, res) {
  // Set CORS headers
  res.setHeader('Access-Control-Allow-Credentials', true);
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
  res.setHeader(
    'Access-Control-Allow-Headers',
    'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version'
  );

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  const STOCKS = ['LTIM', 'RELIANCE', 'TCS', 'HDFCBANK', 'INFY', 'ITC', 'SBIN'];
  const quotes = {};

  try {
    // 1. Fetch individual stocks via Groww live endpoint
    await Promise.allSettled(
      STOCKS.map(async (sym) => {
        try {
          const r = await fetch(
            `https://groww.in/v1/api/stocks_data/v1/tr_live_prices/exchange/NSE/segment/CASH/${sym}/latest`,
            {
              headers: {
                'User-Agent':
                  'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36',
                Accept: 'application/json',
              },
            }
          );
          if (r.ok) {
            const d = await r.json();
            quotes[sym] = {
              price: d.ltp || d.close,
              close: d.close || d.ltp,
              open: d.open || d.ltp,
              high: d.high || d.ltp,
              low: d.low || d.ltp,
              yearHigh: d.yearHighPrice,
              yearLow: d.yearLowPrice,
              dayChange: d.dayChange,
              dayChangePerc: d.dayChangePerc,
            };
          }
        } catch (e) {
          // ignore individual error
        }
      })
    );

    // 2. Fetch indices via Yahoo Finance chart API
    const INDICES = [
      { key: 'NIFTY 50', sym: '%5ENSEI' },
      { key: 'SENSEX', sym: '%5EBSESN' },
    ];

    await Promise.allSettled(
      INDICES.map(async ({ key, sym }) => {
        try {
          const r = await fetch(
            `https://query1.finance.yahoo.com/v8/finance/chart/${sym}?interval=1d`,
            {
              headers: {
                'User-Agent':
                  'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36',
              },
            }
          );
          if (r.ok) {
            const d = await r.json();
            const meta = d.chart?.result?.[0]?.meta;
            if (meta) {
              const price = meta.regularMarketPrice;
              const close = meta.chartPreviousClose || meta.previousClose || price;
              quotes[key] = {
                price,
                close,
                open: meta.regularMarketDayOpen || price,
                high: meta.regularMarketDayHigh || price,
                low: meta.regularMarketDayLow || price,
              };
            }
          }
        } catch (e) {
          // ignore
        }
      })
    );

    // Cache header for 3 seconds on edge
    res.setHeader('Cache-Control', 's-maxage=3, stale-while-revalidate=10');
    res.status(200).json({
      success: true,
      source: 'LIVE_NSE_BSE_VERCEL',
      timestamp: new Date().toISOString(),
      quotes,
    });
  } catch (err) {
    res.status(500).json({ error: err.message, success: false });
  }
}
