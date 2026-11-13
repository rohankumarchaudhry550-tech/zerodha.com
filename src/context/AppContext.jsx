import React, { createContext, useState, useEffect } from 'react';

export const AppContext = createContext();

const initialHoldings = [
  { symbol: 'LTIM', name: 'LTIMindtree Limited', qty: 89, buyPrice: 3580.0, currentPrice: 4504.00 }
];

const initialMutualFunds = [
  { id: 'sbi-bluechip', name: 'SBI Bluechip Fund Direct Growth', category: 'Equity - Large Cap', nav: 72.85, return3y: '18.4%', logo: '🔵' },
  { id: 'hdfc-midcap', name: 'HDFC Mid-Cap Opportunities Direct Growth', category: 'Equity - Mid Cap', nav: 145.20, return3y: '26.8%', logo: '🔴' },
  { id: 'icici-prudential', name: 'ICICI Prudential Technology Direct Growth', category: 'Equity - Sectoral', nav: 185.60, return3y: '14.2%', logo: '🟠' },
  { id: 'parag-parikh', name: 'Parag Parikh Flexi Cap Direct Growth', category: 'Equity - Flexi Cap', nav: 68.40, return3y: '22.5%', logo: '🟢' }
];

export const basePrices = {
  LTIM: 4504.00,     // Prev Close NSE
  RELIANCE: 1335.40, // Prev Close NSE
  TCS: 2472.10,      // Prev Close NSE
  HDFCBANK: 806.60,  // Prev Close NSE
  INFY: 1155.00,     // Prev Close NSE
  ITC: 285.00,       // Prev Close NSE
  SBIN: 1061.20,     // Prev Close NSE
  NIFTY50: 25044.70, // Prev Close NSE
  SENSEX: 81106.60   // Prev Close BSE
};

export const stockStats = {
  LTIM: { high52: 6429.50, low52: 3802.00, open: 4580.00, high: 4655.00, low: 4486.50, volume: 1245000, name: 'LTIMindtree Limited', lotSize: 1 },
  RELIANCE: { high52: 1611.80, low52: 1152.20, open: 1332.00, high: 1342.50, low: 1330.90, volume: 4950210, name: 'Reliance Industries Limited', lotSize: 1 },
  TCS: { high52: 3350.00, low52: 1976.80, open: 2440.00, high: 2472.00, low: 2422.50, volume: 1845300, name: 'Tata Consultancy Services', lotSize: 1 },
  HDFCBANK: { high52: 1017.50, low52: 669.20, open: 804.00, high: 815.00, low: 798.65, volume: 6890400, name: 'HDFC Bank Limited', lotSize: 1 },
  INFY: { high52: 1728.00, low52: 980.40, open: 1154.00, high: 1154.80, low: 1134.80, volume: 3210400, name: 'Infosys Limited', lotSize: 1 },
  ITC: { high52: 412.00, low52: 252.80, open: 288.00, high: 290.25, low: 283.65, volume: 5612000, name: 'ITC Limited', lotSize: 1 },
  SBIN: { high52: 1234.70, low52: 933.90, open: 1062.00, high: 1089.00, low: 1058.50, volume: 4120300, name: 'State Bank of India', lotSize: 1 },
  NIFTY50: { high52: 26277.35, low52: 21281.45, open: 25150.00, high: 25340.00, low: 25020.00, volume: 0, name: 'Nifty 50 Index', lotSize: 50 },
  SENSEX: { high52: 85978.25, low52: 70001.20, open: 81400.00, high: 82050.00, low: 81000.00, volume: 0, name: 'BSE SENSEX Index', lotSize: 10 }
};

const initialStockPrices = {
  LTIM: 4504.00,
  RELIANCE: 1339.70,
  TCS: 2442.40,
  HDFCBANK: 812.30,
  INFY: 1151.20,
  ITC: 284.05,
  SBIN: 1086.50,
  NIFTY50: 25299.35,
  SENSEX: 81911.01
};

export const AppProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState({
    name: 'Rohan Kumar Chaudhry',
    email: 'Rohankumarchaudhry@lltinfotech.com',
    userId: 'RO8910'
  });

  const [margin, setMargin] = useState(124500.75); // wallet balance
  const [holdings, setHoldings] = useState(initialHoldings);
  const [orders, setOrders] = useState([
    { id: 'ORD001', symbol: 'LTIM', type: 'BUY', product: 'CNC', qty: 89, price: 3580.0, status: 'COMPLETE', time: '09:15:24 AM' }
  ]);
  const [positions, setPositions] = useState([
    { symbol: 'LTIM', type: 'CNC', qty: 89, buyPrice: 3580.0, currentPrice: 4504.00 }
  ]);
  const [mutualFunds, setMutualFunds] = useState(initialMutualFunds);
  const [mfHoldings, setMfHoldings] = useState([
    { fundId: 'sbi-bluechip', name: 'SBI Bluechip Fund Direct Growth', amountInvested: 15000, currentNav: 72.85, units: 205.9 }
  ]);
  
  // KYC / Signup State
  const [kyc, setKyc] = useState({
    pan: '',
    panName: '',
    aadhaar: '',
    verified: false,
    otpSent: false,
    otpVerified: false,
    ipvCompleted: false,
    bankLinked: false,
    bankName: '',
    bankAccount: '',
    eSignCompleted: false,
    currentStep: 1 // Start at step 1 for fresh onboarding
  });

  // Support tickets
  const [tickets, setTickets] = useState([
    { id: 'TKT891', subject: 'Kite login biometric issue', status: 'CLOSED', date: '2026-06-18' },
    { id: 'TKT902', subject: 'Margin allocation details request', status: 'OPEN', date: '2026-06-21' }
  ]);

  // Real-time stock prices & tick engine
  const [stockPrices, setStockPrices] = useState(initialStockPrices);
  const [marketStats, setMarketStats] = useState(stockStats);
  const [liveMarketConnected, setLiveMarketConnected] = useState(false);
  const [lastMarketUpdate, setLastMarketUpdate] = useState(null);

  // Direct Live Market Data Connector (NSE/BSE)
  useEffect(() => {
    let isMounted = true;
    const fetchMarketFeed = async () => {
      try {
        const res = await fetch('/api/market-quotes');
        if (res.ok) {
          const contentType = res.headers.get('content-type') || '';
          if (contentType.includes('application/json')) {
            const data = await res.json();
            if (data && data.quotes && isMounted) {
              setLiveMarketConnected(true);
              setLastMarketUpdate(new Date());

              // Synchronize live prices from actual market
              setStockPrices(prev => {
                const updated = { ...prev };
                if (data.quotes.LTIM?.price) updated.LTIM = data.quotes.LTIM.price;
                if (data.quotes.RELIANCE?.price) updated.RELIANCE = data.quotes.RELIANCE.price;
                if (data.quotes.TCS?.price) updated.TCS = data.quotes.TCS.price;
                if (data.quotes.HDFCBANK?.price) updated.HDFCBANK = data.quotes.HDFCBANK.price;
                if (data.quotes.INFY?.price) updated.INFY = data.quotes.INFY.price;
                if (data.quotes.ITC?.price) updated.ITC = data.quotes.ITC.price;
                if (data.quotes.SBIN?.price) updated.SBIN = data.quotes.SBIN.price;
                if (data.quotes['NIFTY 50']?.price) updated.NIFTY50 = data.quotes['NIFTY 50'].price;
                if (data.quotes['SENSEX']?.price) updated.SENSEX = data.quotes['SENSEX'].price;
                return updated;
              });

              // Synchronize High / Low / 52W from live market
              setMarketStats(prev => {
                const updated = { ...prev };
                ['LTIM', 'RELIANCE', 'TCS', 'HDFCBANK', 'INFY', 'ITC', 'SBIN'].forEach(s => {
                  const q = data.quotes[s];
                  if (q && updated[s]) {
                    updated[s] = {
                      ...updated[s],
                      high: q.high || updated[s].high,
                      low: q.low || updated[s].low,
                      open: q.open || updated[s].open,
                      high52: q.yearHigh || updated[s].high52,
                      low52: q.yearLow || updated[s].low52
                    };
                  }
                });
                if (data.quotes['NIFTY 50'] && updated.NIFTY50) {
                  const n = data.quotes['NIFTY 50'];
                  updated.NIFTY50 = { ...updated.NIFTY50, high: n.high || updated.NIFTY50.high, low: n.low || updated.NIFTY50.low };
                }
                if (data.quotes['SENSEX'] && updated.SENSEX) {
                  const s = data.quotes['SENSEX'];
                  updated.SENSEX = { ...updated.SENSEX, high: s.high || updated.SENSEX.high, low: s.low || updated.SENSEX.low };
                }
                return updated;
              });
            }
          }
        }
      } catch (err) {
        // Fallback gracefully to realistic tick engine
      }
    };

    fetchMarketFeed();
    const pollInterval = setInterval(fetchMarketFeed, 4000);
    return () => {
      isMounted = false;
      clearInterval(pollInterval);
    };
  }, []);

  // Ultra-realistic live tick simulation matching NSE tick size (₹0.05)
  useEffect(() => {
    const tickInterval = setInterval(() => {
      setStockPrices(prev => {
        const next = { ...prev };
        const tickSymbols = Object.keys(next);
        
        // Randomly pick symbols to tick each cycle (simulating real market trade streams)
        tickSymbols.forEach(symbol => {
          // 80% chance of a tick occurring
          if (Math.random() < 0.8) {
            let tick = 0;
            if (symbol === 'NIFTY50') {
              // Index ticks by points 0.50 to 3.50
              const sign = Math.random() > 0.48 ? 1 : -1;
              tick = parseFloat((sign * (Math.floor(Math.random() * 6) + 1) * 0.5).toFixed(2));
            } else if (symbol === 'SENSEX') {
              // Sensex ticks by points 1.0 to 12.0
              const sign = Math.random() > 0.48 ? 1 : -1;
              tick = parseFloat((sign * (Math.floor(Math.random() * 10) + 1) * 1.25).toFixed(2));
            } else {
              // Indian stocks trade in steps of ₹0.05
              const ticks = [-0.25, -0.20, -0.15, -0.10, -0.05, 0.05, 0.10, 0.15, 0.20, 0.25];
              tick = ticks[Math.floor(Math.random() * ticks.length)];
            }
            
            const newPrice = parseFloat((next[symbol] + tick).toFixed(2));
            if (newPrice > 0) {
              next[symbol] = newPrice;
            }
          }
        });
        return next;
      });

      // Update volume and high/low stats
      setMarketStats(prev => {
        const next = { ...prev };
        Object.keys(next).forEach(sym => {
          const curr = stockPrices[sym];
          if (curr) {
            if (curr > next[sym].high) next[sym].high = curr;
            if (curr < next[sym].low) next[sym].low = curr;
            next[sym].volume += Math.floor(Math.random() * 40);
          }
        });
        return next;
      });
    }, 1200);

    return () => clearInterval(tickInterval);
  }, [stockPrices]);

  // Sync positions and holdings prices when stock prices change
  useEffect(() => {
    setPositions(prev =>
      prev.map(pos => {
        if (stockPrices[pos.symbol]) {
          return { ...pos, currentPrice: stockPrices[pos.symbol] };
        }
        return pos;
      })
    );
    setHoldings(prev =>
      prev.map(hold => {
        if (stockPrices[hold.symbol]) {
          return { ...hold, currentPrice: stockPrices[hold.symbol] };
        }
        return hold;
      })
    );
  }, [stockPrices]);

  const validateCredentials = (emailOrId, password) => {
    const formattedInput = emailOrId.trim().toLowerCase();
    const targetEmail = 'rohankumarchaudhry@lltinfotech.com';
    const targetUserId = 'ro8910';
    const targetPass = 'Lltinfotech@rohan';
    
    return (formattedInput === targetEmail || formattedInput === targetUserId) && password === targetPass;
  };

  const verifyOtpAndLogin = (otp) => {
    if (otp.trim() === '3776') {
      setIsAuthenticated(true);
      return true;
    }
    return false;
  };

  const login = (email, password) => {
    // Keep wrapper for backwards compatibility
    if (validateCredentials(email, password)) {
      setIsAuthenticated(true);
      return true;
    }
    return false;
  };

  const logout = () => {
    setIsAuthenticated(false);
  };

  const executeOrder = (symbol, type, qty, priceType, limitPrice, product = 'CNC') => {
    const executedPrice = priceType === 'MARKET' ? stockPrices[symbol] || 100 : parseFloat(limitPrice);
    const orderCost = executedPrice * qty;

    if (type === 'BUY' && margin < orderCost) {
      alert('Insufficient available margin in trading account!');
      return false;
    }

    if (type === 'BUY') {
      setMargin(prev => prev - orderCost);
      if (product === 'CNC') {
        // Update Delivery Holdings
        setHoldings(prev => {
          const existing = prev.find(h => h.symbol === symbol);
          if (existing) {
            const totalQty = existing.qty + qty;
            const avgPrice = ((existing.buyPrice * existing.qty) + (executedPrice * qty)) / totalQty;
            return prev.map(h => h.symbol === symbol ? { ...h, qty: totalQty, buyPrice: parseFloat(avgPrice.toFixed(2)), currentPrice: executedPrice } : h);
          } else {
            const meta = stockStats[symbol] || { name: `${symbol} Limited` };
            return [...prev, { symbol, name: meta.name, qty, buyPrice: executedPrice, currentPrice: executedPrice }];
          }
        });
      } else {
        // Intraday MIS
        setPositions(prev => {
          const existing = prev.find(p => p.symbol === symbol && p.type === 'MIS');
          if (existing) {
            const totalQty = existing.qty + qty;
            const avgPrice = ((existing.buyPrice * existing.qty) + (executedPrice * qty)) / totalQty;
            return prev.map(p => (p.symbol === symbol && p.type === 'MIS') ? { ...p, qty: totalQty, buyPrice: parseFloat(avgPrice.toFixed(2)) } : p);
          } else {
            return [...prev, { symbol, type: 'MIS', qty, buyPrice: executedPrice, currentPrice: executedPrice }];
          }
        });
      }
    } else {
      // SELL order
      if (product === 'CNC') {
        const hold = holdings.find(h => h.symbol === symbol);
        if (!hold || hold.qty < qty) {
          alert('Insufficient Demat holding quantity to sell!');
          return false;
        }
        setMargin(prev => prev + orderCost);
        setHoldings(prev => {
          return prev.map(h => {
            if (h.symbol === symbol) {
              const nextQty = h.qty - qty;
              return nextQty > 0 ? { ...h, qty: nextQty } : null;
            }
            return h;
          }).filter(Boolean);
        });
      } else {
        const pos = positions.find(p => p.symbol === symbol);
        if (!pos || pos.qty < qty) {
          alert('Insufficient intraday position quantity to sell!');
          return false;
        }
        setMargin(prev => prev + orderCost);
        setPositions(prev => {
          return prev.map(p => {
            if (p.symbol === symbol) {
              const nextQty = p.qty - qty;
              return nextQty > 0 ? { ...p, qty: nextQty } : null;
            }
            return p;
          }).filter(Boolean);
        });
      }
    }

    // Add to order book with exact timestamp
    const now = new Date();
    const timeStr = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' });
    const newOrder = {
      id: `ORD${Math.floor(1000 + Math.random() * 9000)}`,
      symbol,
      type,
      product,
      qty,
      price: executedPrice,
      status: 'COMPLETE',
      time: timeStr
    };
    setOrders(prev => [newOrder, ...prev]);
    return true;
  };

  const depositCash = (amount) => {
    setMargin(prev => prev + amount);
  };

  const withdrawCash = (amount) => {
    if (margin < amount) {
      alert('Withdrawal amount exceeds available margin!');
      return false;
    }
    setMargin(prev => prev - amount);
    return true;
  };

  return (
    <AppContext.Provider value={{
      isAuthenticated, user, login, logout, validateCredentials, verifyOtpAndLogin,
      margin, holdings, orders, positions, mutualFunds, mfHoldings, kyc, setKyc, tickets, setTickets, stockPrices,
      marketStats, basePrices, executeOrder, depositCash, withdrawCash, setHoldings, setMfHoldings,
      liveMarketConnected, lastMarketUpdate
    }}>
      {children}
    </AppContext.Provider>
  );
};
