const searchYahoo = async () => {
  try {
    const res = await fetch(`https://query2.finance.yahoo.com/v1/finance/search?q=LTIM&quotesCount=10&newsCount=0`, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
      }
    });
    const data = await res.json();
    console.log('Search LTIM:', JSON.stringify(data.quotes.map(q => ({ symbol: q.symbol, shortname: q.shortname, exchange: q.exchange })), null, 2));
  } catch (e) {
    console.log('Search err:', e.message);
  }

  try {
    const res = await fetch(`https://query2.finance.yahoo.com/v1/finance/search?q=Mindtree&quotesCount=10&newsCount=0`, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
      }
    });
    const data = await res.json();
    console.log('Search Mindtree:', JSON.stringify(data.quotes.map(q => ({ symbol: q.symbol, shortname: q.shortname, exchange: q.exchange })), null, 2));
  } catch (e) {
    console.log('Search Mindtree err:', e.message);
  }
};

searchYahoo();
