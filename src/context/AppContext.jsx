import React, { createContext, useState, useEffect } from 'react';

export const AppContext = createContext();

const initialHoldings = [
  { symbol: 'LTIM', name: 'LTIMindtree Limited', qty: 89, buyPrice: 3580.0, currentPrice: 3863.00 }
];

const initialMutualFunds = [
  { id: 'sbi-bluechip', name: 'SBI Bluechip Fund Direct Growth', category: 'Equity - Large Cap', nav: 72.85, return3y: '18.4%', logo: '🔵' },
  { id: 'hdfc-midcap', name: 'HDFC Mid-Cap Opportunities Direct Growth', category: 'Equity - Mid Cap', nav: 145.20, return3y: '26.8%', logo: '🔴' },
  { id: 'icici-prudential', name: 'ICICI Prudential Technology Direct Growth', category: 'Equity - Sectoral', nav: 185.60, return3y: '14.2%', logo: '🟠' },
  { id: 'parag-parikh', name: 'Parag Parikh Flexi Cap Direct Growth', category: 'Equity - Flexi Cap', nav: 68.40, return3y: '22.5%', logo: '🟢' }
];

const initialStockPrices = {
  LTIM: 3863.00,
  RELIANCE: 2465.30,
  TCS: 3192.40,
  HDFCBANK: 1548.90,
  INFY: 1445.00,
  ITC: 432.50,
  SBIN: 815.40,
  NIFTY50: 23500.50,
  SENSEX: 77200.80
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
    { id: 'ORD001', symbol: 'LTIM', type: 'BUY', qty: 89, price: 3580.0, status: 'COMPLETE', time: '09:15 AM' }
  ]);
  const [positions, setPositions] = useState([
    { symbol: 'LTIM', type: 'CNC', qty: 89, buyPrice: 3580.0, currentPrice: 3863.00 }
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

  // Live stock prices simulator
  const [stockPrices, setStockPrices] = useState(initialStockPrices);

  useEffect(() => {
    const interval = setInterval(() => {
      setStockPrices(prev => {
        const next = { ...prev };
        Object.keys(next).forEach(symbol => {
          const changePercent = (Math.random() - 0.5) * 0.002; // +/- 0.1% change
          next[symbol] = parseFloat((next[symbol] * (1 + changePercent)).toFixed(2));
        });
        return next;
      });
    }, 1500);

    return () => clearInterval(interval);
  }, []);

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


  const executeOrder = (symbol, type, qty, priceType, limitPrice) => {
    const executedPrice = priceType === 'MARKET' ? stockPrices[symbol] || 100 : parseFloat(limitPrice);
    const orderCost = executedPrice * qty;

    if (type === 'BUY' && margin < orderCost) {
      alert('Insufficient available margin!');
      return false;
    }

    // Deduct margin if BUY
    if (type === 'BUY') {
      setMargin(prev => prev - orderCost);
      // Update positions (MIS/Intraday mock) or holdings
      setPositions(prev => {
        const existing = prev.find(p => p.symbol === symbol);
        if (existing) {
          const totalQty = existing.qty + qty;
          const avgPrice = ((existing.buyPrice * existing.qty) + (executedPrice * qty)) / totalQty;
          return prev.map(p => p.symbol === symbol ? { ...p, qty: totalQty, buyPrice: parseFloat(avgPrice.toFixed(2)) } : p);
        } else {
          return [...prev, { symbol, type: 'MIS', qty, buyPrice: executedPrice, currentPrice: executedPrice }];
        }
      });
    } else {
      // SELL order
      const pos = positions.find(p => p.symbol === symbol);
      if (!pos || pos.qty < qty) {
        alert('Insufficient position quantity to sell!');
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

    // Add to order book
    const newOrder = {
      id: `ORD${Math.floor(100 + Math.random() * 900)}`,
      symbol,
      type,
      qty,
      price: executedPrice,
      status: 'COMPLETE',
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
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
      executeOrder, depositCash, withdrawCash, setHoldings, setMfHoldings
    }}>
      {children}
    </AppContext.Provider>
  );
};
