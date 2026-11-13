import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

function liveMarketPlugin() {
  let cache = {
    timestamp: 0,
    data: null,
  };

  const STOCKS = ['LTIM', 'RELIANCE', 'TCS', 'HDFCBANK', 'INFY', 'ITC', 'SBIN'];

  async function fetchLiveQuotes() {
    const now = Date.now();
    // Cache for 3 seconds to avoid spamming external services
    if (cache.data && now - cache.timestamp < 3000) {
      return cache.data;
    }

    const quotes = {};

    // 1. Fetch individual stocks via Groww live endpoint
    await Promise.allSettled(
      STOCKS.map(async (sym) => {
        try {
          const res = await fetch(
            `https://groww.in/v1/api/stocks_data/v1/tr_live_prices/exchange/NSE/segment/CASH/${sym}/latest`,
            {
              headers: {
                'User-Agent':
                  'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36',
                Accept: 'application/json',
              },
            }
          );
          if (res.ok) {
            const d = await res.json();
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
          const res = await fetch(
            `https://query1.finance.yahoo.com/v8/finance/chart/${sym}?interval=1d`,
            {
              headers: {
                'User-Agent':
                  'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36',
              },
            }
          );
          if (res.ok) {
            const d = await res.json();
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

    cache = {
      timestamp: now,
      data: {
        success: true,
        source: 'LIVE_NSE_BSE',
        timestamp: new Date().toISOString(),
        quotes,
      },
    };

    return cache.data;
  }

  const handler = async (req, res, next) => {
    if (req.url && req.url.startsWith('/api/market-quotes')) {
      try {
        const data = await fetchLiveQuotes();
        res.setHeader('Content-Type', 'application/json');
        res.setHeader('Access-Control-Allow-Origin', '*');
        res.end(JSON.stringify(data));
      } catch (err) {
        res.statusCode = 500;
        res.end(JSON.stringify({ error: err.message }));
      }
      return;
    }
    next();
  };

  return {
    name: 'live-market-data-middleware',
    configureServer(server) {
      server.middlewares.use(handler);
    },
    configurePreviewServer(server) {
      server.middlewares.use(handler);
    },
  };
}

export default defineConfig({
  plugins: [react(), liveMarketPlugin()],
  resolve: {
    alias: {
      // Setup aliases if needed
    }
  }
});
