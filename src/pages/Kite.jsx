import React, { useState, useContext, useEffect, useRef } from 'react';
import { AppContext } from '../context/AppContext';
import { useNavigate, Link } from 'react-router-dom';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { 
  Search, ChevronDown, User, LogOut, ArrowUpRight, ArrowDownRight, 
  TrendingUp, HelpCircle, Settings, Trash, Eye, BarChart2, Bell, 
  RefreshCw, X, Play, Shield, Globe, Award, Sparkles, BookOpen 
} from 'lucide-react';

// Generates high-fidelity mock historical stock data with OHLC (Open High Low Close)
const generateMockChartData = (basePrice, timeframe = '5m', count = 30) => {
  const data = [];
  let price = basePrice * 0.98;
  const now = new Date();
  
  let multiplier = 1;
  if (timeframe === '1m') multiplier = 0.2;
  else if (timeframe === '15m') multiplier = 2;
  else if (timeframe === '1h') multiplier = 6;
  else if (timeframe === '1d') multiplier = 24;

  for (let i = count; i >= 0; i--) {
    const time = new Date(now.getTime() - i * 5 * 60 * 1000 * multiplier);
    const change = (Math.random() - 0.49) * (basePrice * 0.015);
    const open = parseFloat(price.toFixed(2));
    const close = parseFloat((price + change).toFixed(2));
    const high = parseFloat((Math.max(open, close) + Math.random() * (basePrice * 0.004)).toFixed(2));
    const low = parseFloat((Math.min(open, close) - Math.random() * (basePrice * 0.004)).toFixed(2));
    const volume = Math.floor(1000 + Math.random() * 20000);
    price = close;
    
    data.push({
      date: time.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      dateLabel: time.toLocaleDateString([], { month: 'short', day: 'numeric' }),
      open,
      high,
      low,
      close,
      price: close,
      volume
    });
  }
  return data;
};

// Play a soft, realistic beep sound when order is executed
const playSuccessSound = () => {
  try {
    const ctx = new (window.AudioContext || window.webkitAudioContext)();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    
    osc.type = 'sine';
    osc.frequency.setValueAtTime(880, ctx.currentTime); // A5 note
    osc.frequency.exponentialRampToValueAtTime(1320, ctx.currentTime + 0.12); // slide up
    
    gain.gain.setValueAtTime(0.08, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.12);
    
    osc.connect(gain);
    gain.connect(ctx.destination);
    
    osc.start();
    osc.stop(ctx.currentTime + 0.12);
  } catch (e) {
    console.log('Audio execution blocked or not supported');
  }
};

export default function Kite() {
  const { 
    margin, holdings, orders, positions, executeOrder, stockPrices, user, logout, depositCash, withdrawCash
  } = useContext(AppContext);

  const navigate = useNavigate();
  
  // Custom stock watchlists
  const watchlists = ['LTIM', 'RELIANCE', 'TCS', 'HDFCBANK', 'INFY', 'ITC', 'SBIN'];
  
  // Navigation & stock state
  const [selectedStock, setSelectedStock] = useState('LTIM');
  const [chartData, setChartData] = useState([]);
  const [activeTab, setActiveTab] = useState('DASHBOARD'); // DASHBOARD, ORDERS, HOLDINGS, POSITIONS, FUNDS, APPS
  
  // Watchlist page & search filters
  const [watchlistPage, setWatchlistPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState('');
  
  // Inline Market Depth state in Sidebar
  const [watchlistDepthOpen, setWatchlistDepthOpen] = useState(null);
  const [hoveredStock, setHoveredStock] = useState(null);

  // Floating Order Modal state
  const [orderModalOpen, setOrderModalOpen] = useState(false);
  const [orderModalType, setOrderModalType] = useState('BUY'); // BUY / SELL
  const [orderQty, setOrderQty] = useState(89);
  const [orderProduct, setOrderProduct] = useState('CNC'); // CNC / MIS
  const [orderPriceType, setOrderPriceType] = useState('MARKET'); // MARKET / LIMIT
  const [orderLimitPrice, setOrderLimitPrice] = useState(0);

  // Profile menu drop dropdown state
  const [profileOpen, setProfileOpen] = useState(false);

  // Funds tab modal state
  const [addFundsOpen, setAddFundsOpen] = useState(false);
  const [withdrawOpen, setWithdrawOpen] = useState(false);
  const [fundInput, setFundInput] = useState(10000);
  const [payMethod, setPayMethod] = useState('UPI');

  // TradingView custom toolbar settings
  const [chartTimeframe, setChartTimeframe] = useState('5m');
  const [chartType, setChartType] = useState('candle'); // candle / area
  const [chartIndicator, setChartIndicator] = useState('None');
  const [activeDrawingTool, setActiveDrawingTool] = useState('crosshair');

  // Watchlist searches & filters
  const [holdingsSearch, setHoldingsSearch] = useState('');
  const [ordersSearch, setOrdersSearch] = useState('');

  // Watchlist flashing ticks calculation
  const [prevPrices, setPrevPrices] = useState({});
  const [flashStates, setFlashStates] = useState({});

  useEffect(() => {
    const nextFlashes = {};
    let changed = false;

    Object.keys(stockPrices).forEach(sym => {
      if (prevPrices[sym] !== undefined) {
        if (stockPrices[sym] > prevPrices[sym]) {
          nextFlashes[sym] = 'up';
          changed = true;
        } else if (stockPrices[sym] < prevPrices[sym]) {
          nextFlashes[sym] = 'down';
          changed = true;
        }
      }
    });

    if (changed) {
      setFlashStates(prev => ({ ...prev, ...nextFlashes }));
      const timer = setTimeout(() => {
        setFlashStates(prev => {
          const reset = { ...prev };
          Object.keys(nextFlashes).forEach(s => {
            reset[s] = null;
          });
          return reset;
        });
      }, 500);
      return () => clearTimeout(timer);
    }
    setPrevPrices(stockPrices);
  }, [stockPrices]);

  // Initialize chart data when selectedStock or timeframe changes
  useEffect(() => {
    const base = stockPrices[selectedStock] || 1000;
    setChartData(generateMockChartData(base, chartTimeframe));
    setOrderLimitPrice(parseFloat(base.toFixed(2)));
  }, [selectedStock, chartTimeframe]);

  // Smoothly update the latest point in chart when live stock price changes
  useEffect(() => {
    const currentPrice = stockPrices[selectedStock];
    if (!currentPrice) return;
    setChartData(prevData => {
      if (!prevData || prevData.length === 0) return prevData;
      const lastIndex = prevData.length - 1;
      const lastPoint = prevData[lastIndex];
      const updatedPoint = {
        ...lastPoint,
        close: currentPrice,
        price: currentPrice,
        high: Math.max(lastPoint.high, currentPrice),
        low: Math.min(lastPoint.low, currentPrice)
      };
      const nextData = [...prevData];
      nextData[lastIndex] = updatedPoint;
      return nextData;
    });
  }, [stockPrices[selectedStock]]);

  const handleOrderSubmit = (e) => {
    e.preventDefault();
    if (orderQty <= 0) return alert('Quantity must be greater than 0');
    
    const targetPrice = orderPriceType === 'MARKET' ? stockPrices[selectedStock] : orderLimitPrice;
    const success = executeOrder(selectedStock, orderModalType, orderQty, orderPriceType, targetPrice);
    if (success) {
      playSuccessSound();
      setOrderModalOpen(false);
      // Automatically switch to orders page to see execution
      setActiveTab('ORDERS');
    }
  };

  const openOrderModal = (sym, type) => {
    setSelectedStock(sym);
    setOrderModalType(type);
    const matchingHold = holdings.find(h => h.symbol === sym);
    setOrderQty(matchingHold ? matchingHold.qty : 10);
    setOrderModalOpen(true);
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  // Dynamic market baseline prices for calculating live day's change
  const basePrices = {
    LTIM: 3784.50,
    RELIANCE: 2430.00,
    TCS: 3214.20,
    HDFCBANK: 1536.30,
    INFY: 1428.90,
    ITC: 429.70,
    SBIN: 804.50,
    NIFTY50: 23402.10,
    SENSEX: 76908.40
  };

  const getStockPercentChange = (symbol) => {
    const base = basePrices[symbol] || 1000;
    const current = stockPrices[symbol] || base;
    const diff = current - base;
    const pct = (diff / base) * 100;
    const sign = pct >= 0 ? '+' : '';
    return `${sign}${pct.toFixed(2)}%`;
  };

  const getStockAbsoluteChange = (symbol) => {
    const base = basePrices[symbol] || 1000;
    const current = stockPrices[symbol] || base;
    const diff = current - base;
    const sign = diff >= 0 ? '+' : '';
    return `${sign}${diff.toFixed(2)}`;
  };

  const totalHoldingsValue = holdings.reduce((sum, h) => sum + (h.currentPrice * h.qty), 0);
  const totalCostValue = holdings.reduce((sum, h) => sum + (h.buyPrice * h.qty), 0);
  const totalPnl = totalHoldingsValue - totalCostValue;
  const pnlPercent = (totalPnl / totalCostValue) * 100;

  // Filter watchlists
  const filteredWatchlist = watchlists.filter(sym => 
    sym.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Inline market depth drawer
  const renderInlineMarketDepth = (sym) => {
    const ltp = stockPrices[sym] || 1000;
    const bids = [
      { price: ltp - 0.25, qty: 154, orders: 2 },
      { price: ltp - 0.60, qty: 542, orders: 5 },
      { price: ltp - 0.85, qty: 231, orders: 1 },
      { price: ltp - 1.10, qty: 890, orders: 9 },
      { price: ltp - 1.45, qty: 1205, orders: 14 }
    ];
    const asks = [
      { price: ltp + 0.15, qty: 320, orders: 3 },
      { price: ltp + 0.40, qty: 215, orders: 2 },
      { price: ltp + 0.70, qty: 640, orders: 6 },
      { price: ltp + 0.95, qty: 110, orders: 1 },
      { price: ltp + 1.30, qty: 1450, orders: 8 }
    ];

    const totalBids = bids.reduce((acc, curr) => acc + curr.qty, 0);
    const totalAsks = asks.reduce((acc, curr) => acc + curr.qty, 0);

    return (
      <div className="watchlist-depth-container" onClick={e => e.stopPropagation()}>
        <table className="watchlist-depth-table">
          <thead>
            <tr>
              <th>Bid Price</th>
              <th>Orders</th>
              <th>Qty</th>
              <th>Ask Price</th>
              <th>Orders</th>
              <th>Qty</th>
            </tr>
          </thead>
          <tbody>
            {Array.from({ length: 5 }).map((_, idx) => (
              <tr key={idx} style={{ fontSize: '10.5px' }}>
                <td className="depth-bid">₹{bids[idx].price.toFixed(2)}</td>
                <td>{bids[idx].orders}</td>
                <td>{bids[idx].qty}</td>
                <td className="depth-ask">₹{asks[idx].price.toFixed(2)}</td>
                <td>{asks[idx].orders}</td>
                <td>{asks[idx].qty}</td>
              </tr>
            ))}
            <tr style={{ fontWeight: '600', borderTop: '1px solid #ddd' }}>
              <td colSpan={2}>Total</td>
              <td>{totalBids}</td>
              <td colSpan={2}>Total</td>
              <td>{totalAsks}</td>
            </tr>
          </tbody>
        </table>
      </div>
    );
  };

  // Add mock cash execution
  const executeDeposit = (e) => {
    e.preventDefault();
    if (fundInput <= 0) return alert('Enter a valid amount');
    depositCash(fundInput);
    playSuccessSound();
    setAddFundsOpen(false);
    alert(`Successfully credited ₹${fundInput.toLocaleString()} to your trading balance via ${payMethod}!`);
  };

  // Withdraw cash execution
  const executeWithdraw = (e) => {
    e.preventDefault();
    if (fundInput <= 0) return alert('Enter a valid amount');
    const success = withdrawCash(fundInput);
    if (success) {
      playSuccessSound();
      setWithdrawOpen(false);
      alert(`Withdrawal request of ₹${fundInput.toLocaleString()} has been queued. Funds will clear to your HDFC linked account.`);
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100vh', overflow: 'hidden', fontFamily: '"Inter", sans-serif', backgroundColor: '#fbfbfb' }}>
      
      {/* Official Kite Top Navigation Header */}
      <header style={{ 
        display: 'flex', justifyContent: 'space-between', alignItems: 'center', 
        padding: '0 30px', height: '56px', borderBottom: '1px solid #e0e0e0', 
        background: '#fff', boxSizing: 'border-box', boxShadow: '0 1px 3px rgba(0,0,0,0.03)',
        zIndex: 1000
      }}>
        {/* Left Side: Brand Logo and Live Indices */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '25px' }}>
          <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: '8px', textDecoration: 'none' }}>
            {/* Redesigned Kite shape SVG logo */}
            <svg width="22" height="22" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M50 0L100 50L50 100L0 50L50 0Z" fill="#ff5722" />
              <path d="M50 25L75 50L50 75L25 50L50 25Z" fill="#fff" />
              <circle cx="50" cy="50" r="12" fill="#ff5722" />
            </svg>
            <span style={{ fontSize: '18px', fontWeight: '800', color: '#ff5722', letterSpacing: '0.5px' }}>kite</span>
          </Link>

          <div style={{ display: 'flex', gap: '15px', fontSize: '12px', borderLeft: '1px solid #eee', paddingLeft: '20px' }}>
            <div style={{ color: '#555' }}>
              NIFTY 50 <span className={flashStates.NIFTY50 === 'up' ? 'flash-up text-up' : flashStates.NIFTY50 === 'down' ? 'flash-down text-down' : 'text-up'} style={{ fontWeight: '600', marginLeft: '3px' }}>
                {(stockPrices.NIFTY50 || 23500).toFixed(2)}
              </span>
              <span className={(stockPrices.NIFTY50 || 23500) >= 23402.10 ? 'text-up' : 'text-down'} style={{ marginLeft: '4px', fontSize: '10px' }}>
                ({getStockPercentChange('NIFTY50')})
              </span>
            </div>
            <div style={{ color: '#555' }}>
              SENSEX <span className={flashStates.SENSEX === 'up' ? 'flash-up text-up' : flashStates.SENSEX === 'down' ? 'flash-down text-down' : 'text-up'} style={{ fontWeight: '600', marginLeft: '3px' }}>
                {(stockPrices.SENSEX || 77200).toFixed(2)}
              </span>
              <span className={(stockPrices.SENSEX || 77200) >= 76908.40 ? 'text-up' : 'text-down'} style={{ marginLeft: '4px', fontSize: '10px' }}>
                ({getStockPercentChange('SENSEX')})
              </span>
            </div>
          </div>
        </div>

        {/* Center: Main Navigation Menu */}
        <nav style={{ display: 'flex', gap: '30px', fontSize: '13px', height: '100%' }}>
          {[
            { id: 'DASHBOARD', label: 'Dashboard' },
            { id: 'ORDERS', label: 'Orders' },
            { id: 'HOLDINGS', label: 'Holdings' },
            { id: 'POSITIONS', label: 'Positions' },
            { id: 'FUNDS', label: 'Funds' },
            { id: 'APPS', label: 'Apps' }
          ].map(tab => (
            <span 
              key={tab.id}
              onClick={() => setActiveTab(tab.id)} 
              style={{ 
                cursor: 'pointer', 
                display: 'flex', 
                alignItems: 'center',
                height: '100%',
                borderBottom: activeTab === tab.id ? '2px solid #ff5722' : '2px solid transparent',
                color: activeTab === tab.id ? '#ff5722' : '#555',
                fontWeight: activeTab === tab.id ? '500' : 'normal',
                padding: '0 4px',
                transition: 'all 0.15s ease'
              }}
            >
              {tab.label}
            </span>
          ))}
        </nav>

        {/* Right Side: Notification & User ID Dropdown */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '18px' }}>
          <Bell size={16} style={{ color: '#777', cursor: 'pointer' }} onClick={() => alert('No new notifications today.')} />
          
          <div style={{ position: 'relative' }}>
            <div 
              onClick={() => setProfileOpen(!profileOpen)}
              style={{ 
                display: 'flex', alignItems: 'center', gap: '6px', cursor: 'pointer', 
                fontSize: '12px', background: '#f5f5f5', padding: '6px 12px', borderRadius: '15px',
                border: '1px solid #e0e0e0', color: '#ff5722', fontWeight: '600'
              }}
            >
              <User size={13} />
              <span>{user.userId}</span>
              <ChevronDown size={12} style={{ color: '#777' }} />
            </div>

            {profileOpen && (
              <div style={{
                position: 'absolute', right: 0, top: '38px', width: '240px',
                background: '#fff', border: '1px solid #ddd', borderRadius: '4px',
                boxShadow: '0 4px 18px rgba(0,0,0,0.1)', zIndex: 1005, padding: '15px'
              }}>
                <div style={{ marginBottom: '8px' }}>
                  <div style={{ fontWeight: '600', fontSize: '13px', color: '#333' }}>{user.name}</div>
                  <div style={{ fontSize: '10.5px', color: '#888', wordBreak: 'break-all' }}>{user.email}</div>
                </div>
                <hr style={{ margin: '10px 0', border: 'none', borderTop: '1px solid #eee' }} />
                
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', fontSize: '12px' }}>
                  <Link to="/console" style={{ color: '#387ed1', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '5px' }}>
                    Console Backoffice <ArrowUpRight size={11} />
                  </Link>
                  <Link to="/coin" style={{ color: '#387ed1', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '5px' }}>
                    Coin Mutual Funds <ArrowUpRight size={11} />
                  </Link>
                  <Link to="/support" style={{ color: '#387ed1', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '5px' }}>
                    Support Tickets <ArrowUpRight size={11} />
                  </Link>
                  <hr style={{ margin: '5px 0', border: 'none', borderTop: '1px solid #eee' }} />
                  <div 
                    onClick={handleLogout} 
                    style={{ color: '#f44336', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '5px', fontWeight: '600' }}
                  >
                    <LogOut size={12} /> Logout
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </header>

      {/* Main Workspace Layout */}
      <div style={{ display: 'flex', flex: 1, overflow: 'hidden' }}>
        
        {/* Watchlist Sidebar Column (Left) */}
        <div className="kite-sidebar" style={{ width: '360px', height: '100%', display: 'flex', flexDirection: 'column', borderRight: '1px solid #e0e0e0', background: '#fff' }}>
          
          {/* Watchlist Search Field */}
          <div className="watchlist-search" style={{ padding: '12px 15px', borderBottom: '1px solid #f0f0f0' }}>
            <div style={{ position: 'relative' }}>
              <input 
                type="text" 
                placeholder="Search eg: infy bse, reliance..." 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                style={{ 
                  paddingLeft: '32px', height: '34px', fontSize: '12px', borderRadius: '3px', 
                  border: '1px solid #e0e0e0', width: '100%', boxSizing: 'border-box',
                  outline: 'none', transition: 'border-color 0.15s'
                }}
                onFocus={(e) => e.target.style.borderColor = '#ff5722'}
                onBlur={(e) => e.target.style.borderColor = '#e0e0e0'}
              />
              <Search size={13} style={{ position: 'absolute', left: '10px', top: '10px', color: '#aaa' }} />
            </div>
          </div>

          {/* Stocks Watchlist List */}
          <div className="watchlist-list" style={{ flex: 1, overflowY: 'auto' }}>
            {filteredWatchlist.map(sym => {
              const price = stockPrices[sym] || 0;
              const change = getStockPercentChange(sym);
              const isUp = change.startsWith('+');
              const isSelected = selectedStock === sym;
              const flash = flashStates[sym]; // 'up', 'down', or null

              return (
                <div key={sym}>
                  <div 
                    onClick={() => { setSelectedStock(sym); }}
                    onMouseEnter={() => setHoveredStock(sym)}
                    onMouseLeave={() => setHoveredStock(null)}
                    className={`watchlist-item ${isSelected ? 'selected' : ''}`}
                    style={{
                      display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                      padding: '14px 18px', borderBottom: '1px solid #f5f5f5', cursor: 'pointer',
                      transition: 'background 0.2s, border-left 0.15s', position: 'relative',
                      borderLeft: isSelected ? '3px solid #ff5722' : '3px solid transparent',
                      backgroundColor: isSelected ? '#fefefe' : '#fff'
                    }}
                  >
                    <div>
                      <span style={{ fontWeight: '500', color: isSelected ? '#ff5722' : '#333', fontSize: '13px' }}>{sym}</span>
                      <span style={{ fontSize: '9px', color: '#9b9b9b', marginLeft: '6px', background: '#f5f5f5', padding: '1px 3px', borderRadius: '2px' }}>NSE</span>
                    </div>
                    
                    {/* Action buttons shown on hover dynamically using React state */}
                    {hoveredStock === sym ? (
                      <div className="watchlist-actions" style={{ display: 'flex', position: 'absolute', right: '15px', gap: '4px', zIndex: 10 }}>
                        <button 
                          className="watchlist-action-btn buy" 
                          onClick={(e) => { e.stopPropagation(); openOrderModal(sym, 'BUY'); }}
                        >B</button>
                        <button 
                          className="watchlist-action-btn sell" 
                          onClick={(e) => { e.stopPropagation(); openOrderModal(sym, 'SELL'); }}
                        >S</button>
                        <button 
                          className="watchlist-action-btn icon" 
                          onClick={(e) => { 
                            e.stopPropagation(); 
                            setWatchlistDepthOpen(watchlistDepthOpen === sym ? null : sym); 
                          }}
                          title="Market Depth"
                        ><BarChart2 size={11} /></button>
                        <button 
                          className="watchlist-action-btn icon" 
                          onClick={(e) => { e.stopPropagation(); setSelectedStock(sym); }}
                          title="View Chart"
                        ><TrendingUp size={11} /></button>
                      </div>
                    ) : (
                      <div className={`watchlist-price ${isUp ? 'text-up' : 'text-down'} ${flash === 'up' ? 'flash-up' : flash === 'down' ? 'flash-down' : ''}`} style={{ display: 'flex', gap: '8px', fontSize: '13px', padding: '2px 4px', borderRadius: '2px' }}>
                        <span style={{ fontWeight: '500' }}>{price.toFixed(2)}</span>
                        <span style={{ fontSize: '11px', opacity: 0.85 }}>{change}</span>
                      </div>
                    )}
                  </div>

                  {/* Inline Market Depth Expanded Block */}
                  {watchlistDepthOpen === sym && renderInlineMarketDepth(sym)}
                </div>
              );
            })}
            
            {filteredWatchlist.length === 0 && (
              <div style={{ textAlign: 'center', color: '#999', fontSize: '12px', padding: '40px' }}>
                No search matches found
              </div>
            )}
          </div>

          {/* Watchlist Footer Pagination bar */}
          <div style={{ 
            display: 'flex', justifyContent: 'space-between', alignItems: 'center', 
            padding: '10px 15px', borderTop: '1px solid #e0e0e0', background: '#fafafa', fontSize: '10px', color: '#888' 
          }}>
            <div style={{ display: 'flex', gap: '8px' }}>
              {[1, 2, 3, 4, 5, 6, 7].map((num) => (
                <span 
                  key={num}
                  onClick={() => setWatchlistPage(num)}
                  style={{ 
                    cursor: 'pointer', 
                    padding: '2px 5px', 
                    borderRadius: '2px',
                    background: watchlistPage === num ? '#e2e2e2' : 'transparent',
                    color: watchlistPage === num ? '#222' : '#777',
                    fontWeight: watchlistPage === num ? '600' : '400'
                  }}
                >
                  {num}
                </span>
              ))}
            </div>
            <Settings size={12} style={{ cursor: 'pointer', color: '#777' }} onClick={() => alert('Watchlist customizer active.')} />
          </div>
        </div>

        {/* Right Workspace Dashboard Panel */}
        <div className="kite-main" style={{ flex: 1, height: '100%', overflowY: 'auto', padding: '25px 30px', boxSizing: 'border-box', display: 'flex', flexDirection: 'column' }}>
          
          {/* TAB CONTENT RENDERERS */}

          {/* 1. DASHBOARD SHEET */}
          {activeTab === 'DASHBOARD' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '25px' }}>
              <div>
                <h1 style={{ fontSize: '24px', fontWeight: '400', color: '#333', margin: 0 }}>Hi, {user.name.split(' ')[0]}</h1>
                <p style={{ margin: '4px 0 0 0', color: '#888', fontSize: '13px' }}>Verify your margins, hold portfolios, and manage your trading desk.</p>
              </div>

              {/* Top Equity and Commodity Cards */}
              <div style={{ display: 'flex', gap: '20px' }}>
                <div className="console-card" style={{ flex: 1, margin: 0, padding: '20px' }}>
                  <h4 style={{ margin: '0 0 10px 0', fontSize: '13px', color: '#888', fontWeight: '500', display: 'flex', alignItems: 'center', gap: '5px' }}>
                    <TrendingUp size={14} color="#ff5722" /> Equity Balance
                  </h4>
                  <hr style={{ margin: '0 0 15px 0', border: 'none', borderTop: '1px solid #f0f0f0' }} />
                  <h2 style={{ color: '#4caf50', margin: '0 0 4px 0', fontSize: '24px', fontWeight: '600' }}>₹{margin.toLocaleString([], { minimumFractionDigits: 2 })}</h2>
                  <span style={{ fontSize: '11px', color: '#999' }}>Used Margin: ₹0.00 • Cash deposit: 100% active</span>
                </div>

                <div className="console-card" style={{ flex: 1, margin: 0, padding: '20px' }}>
                  <h4 style={{ margin: '0 0 10px 0', fontSize: '13px', color: '#888', fontWeight: '500', display: 'flex', alignItems: 'center', gap: '5px' }}>
                    <TrendingUp size={14} color="#777" /> Commodity Balance
                  </h4>
                  <hr style={{ margin: '0 0 15px 0', border: 'none', borderTop: '1px solid #f0f0f0' }} />
                  <h2 style={{ color: '#666', margin: '0 0 4px 0', fontSize: '24px', fontWeight: '600' }}>₹0.00</h2>
                  <span style={{ fontSize: '11px', color: '#999' }}>Activate MCX segments from settings profile page</span>
                </div>
              </div>

              {/* Portfolio Snapshot brief with Circular Share Count Widget */}
              <div className="console-card" style={{ padding: '20px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '15px' }}>
                  <h3 style={{ margin: 0, fontSize: '14px', fontWeight: '600', color: '#333' }}>Portfolio Summary</h3>
                  <Link to="/console" style={{ fontSize: '12px', color: '#387ed1', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '4px' }}>
                    View Console Backoffice <ArrowUpRight size={12} />
                  </Link>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '20px' }}>
                  {/* Financial Metrics */}
                  <div style={{ display: 'flex', alignItems: 'center', gap: '40px' }}>
                    <div>
                      <span style={{ fontSize: '12px', color: '#888' }}>Holdings Value</span>
                      <h3 style={{ margin: '4px 0 0 0', fontSize: '20px', color: '#387ed1', fontWeight: '600' }}>₹{totalHoldingsValue.toLocaleString([], { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</h3>
                      <span style={{ fontSize: '11px', color: '#999' }}>Live Market Value</span>
                    </div>
                    <div>
                      <span style={{ fontSize: '12px', color: '#888' }}>Total Returns</span>
                      <h3 className={totalPnl >= 0 ? 'text-up' : 'text-down'} style={{ margin: '4px 0 0 0', fontSize: '20px', fontWeight: '600' }}>
                        ₹{totalPnl.toLocaleString([], { minimumFractionDigits: 2, maximumFractionDigits: 2 })} ({pnlPercent.toFixed(2)}%)
                      </h3>
                      <span style={{ fontSize: '11px', color: '#999' }}>Investment: ₹{totalCostValue.toLocaleString([], { minimumFractionDigits: 2 })}</span>
                    </div>
                  </div>

                  {/* Circular Share Count Donut Widget */}
                  <div style={{ 
                    display: 'flex', alignItems: 'center', gap: '16px', 
                    background: '#f8fafd', padding: '12px 20px', borderRadius: '8px', border: '1px solid #e3eefc'
                  }}>
                    {/* Donut Circle */}
                    <div style={{ position: 'relative', width: '74px', height: '74px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      <svg width="74" height="74" viewBox="0 0 74 74">
                        {/* Track circle */}
                        <circle cx="37" cy="37" r="30" fill="none" stroke="#e8ecf2" strokeWidth="7" />
                        {/* Progress ring 100% */}
                        <circle 
                          cx="37" cy="37" r="30" fill="none" 
                          stroke="#387ed1" strokeWidth="7" 
                          strokeDasharray="188.5" strokeDashoffset="0"
                          strokeLinecap="round"
                          transform="rotate(-90 37 37)"
                        />
                      </svg>
                      {/* Centered Share Count */}
                      <div style={{ position: 'absolute', textAlign: 'center', pointerEvents: 'none' }}>
                        <div style={{ fontSize: '17px', fontWeight: '800', color: '#387ed1', lineHeight: '1' }}>
                          {holdings.reduce((sum, h) => sum + h.qty, 0)}
                        </div>
                        <span style={{ fontSize: '8px', fontWeight: '700', color: '#777', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                          Shares
                        </span>
                      </div>
                    </div>

                    <div>
                      <div style={{ fontSize: '13px', fontWeight: '700', color: '#222', display: 'flex', alignItems: 'center', gap: '6px' }}>
                        <span>LTIM</span>
                        <span style={{ fontSize: '10px', background: '#e8f5e9', color: '#2e7d32', padding: '1px 6px', borderRadius: '3px', fontWeight: 'bold' }}>
                          100% Demat
                        </span>
                      </div>
                      <div style={{ fontSize: '11.5px', color: '#555', marginTop: '3px' }}>
                        Total Shares: <strong style={{ color: '#387ed1', fontSize: '13px' }}>{holdings.reduce((sum, h) => sum + h.qty, 0)}</strong> units
                      </div>
                      <div style={{ fontSize: '11px', color: '#777', marginTop: '2px' }}>
                        Avg: ₹3,580.00 • CMP: <strong className={flashStates.LTIM === 'up' ? 'flash-up text-up' : flashStates.LTIM === 'down' ? 'flash-down text-down' : ''}>₹{(stockPrices.LTIM || 3863).toFixed(2)}</strong>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Quick instructions details */}
              <div className="console-card" style={{ padding: '20px' }}>
                <h4 style={{ margin: '0 0 10px 0', fontSize: '13px', color: '#ff5722' }}>System updates</h4>
                <ul style={{ paddingLeft: '18px', margin: 0, fontSize: '12px', color: '#555', display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  {holdings.map(h => (
                    <li key={h.symbol}>
                      🚀 <strong>{h.name || h.symbol} ({h.qty} shares)</strong> delivery settled • CMP: <strong>₹{(stockPrices[h.symbol] || h.currentPrice).toFixed(2)}</strong>
                    </li>
                  ))}
                  <li>🔒 Your Demat Nominee has been registered as <strong>Hariom Chaudhary (Father, DOB: 1978-05-15, Share: 100%)</strong> in demat records.</li>
                  <li>💸 Bank account linked: <strong>HDFC Bank (XXXX-XXXX-1234)</strong> is active for deposits and payouts.</li>
                </ul>
              </div>
            </div>
          )}

          {/* 2. ORDERS SHEET */}
          {activeTab === 'ORDERS' && (
            <div className="console-card" style={{ padding: '25px', background: '#fff' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '15px' }}>
                <div>
                  <h3 style={{ margin: 0, fontSize: '15px' }}>Order Logs</h3>
                  <p style={{ margin: '2px 0 0 0', fontSize: '11px', color: '#999' }}>Logs of orders executed during this session.</p>
                </div>
                <input 
                  type="text" 
                  placeholder="Filter orders..." 
                  value={ordersSearch}
                  onChange={(e) => setOrdersSearch(e.target.value)}
                  style={{ width: '180px', height: '28px', fontSize: '12px', padding: '0 8px', borderRadius: '3px', border: '1px solid #ddd' }}
                />
              </div>
              <hr style={{ border: 'none', borderTop: '1px solid #f0f0f0', margin: '0 0 15px 0' }} />

              {orders.length > 0 ? (
                <table className="kite-table">
                  <thead>
                    <tr>
                      <th>Time</th>
                      <th>Type</th>
                      <th>Symbol</th>
                      <th>Qty.</th>
                      <th>Price</th>
                      <th>Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {orders
                      .filter(ord => ord.symbol.toLowerCase().includes(ordersSearch.toLowerCase()))
                      .map((ord) => (
                        <tr key={ord.id}>
                          <td>{ord.time}</td>
                          <td>
                            <span style={{ 
                              fontSize: '10px', 
                              background: ord.type === 'BUY' ? '#e3f2fd' : '#ffebee', 
                              color: ord.type === 'BUY' ? '#0d47a1' : '#c62828', 
                              padding: '2px 5px', borderRadius: '2px', fontWeight: 'bold' 
                            }}>{ord.type}</span>
                          </td>
                          <td><strong>{ord.symbol}</strong></td>
                          <td>{ord.qty}</td>
                          <td>₹{ord.price.toFixed(2)}</td>
                          <td>
                            <span style={{ 
                              fontSize: '10px', 
                              background: '#e8f5e9', 
                              color: '#2e7d32', 
                              padding: '2px 5px', borderRadius: '2px', fontWeight: '600' 
                            }}>{ord.status}</span>
                          </td>
                        </tr>
                      ))}
                    {orders.filter(ord => ord.symbol.toLowerCase().includes(ordersSearch.toLowerCase())).length === 0 && (
                      <tr>
                        <td colSpan={6} style={{ textAlign: 'center', padding: '30px', color: '#999' }}>
                          No orders matching "{ordersSearch}"
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              ) : (
                <div style={{ textAlign: 'center', padding: '40px', color: '#999', fontSize: '13px' }}>
                  No orders matched or placed yet.
                </div>
              )}
            </div>
          )}

          {/* 3. HOLDINGS SHEET */}
          {activeTab === 'HOLDINGS' && (
            <div className="console-card" style={{ padding: '25px', background: '#fff' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '15px' }}>
                <div>
                  <h3 style={{ margin: 0, fontSize: '15px' }}>Holdings ({holdings.length})</h3>
                  <p style={{ margin: '2px 0 0 0', fontSize: '11px', color: '#999' }}>Demat delivery holdings linked to your client profile.</p>
                </div>
                <input 
                  type="text" 
                  placeholder="Search holdings..." 
                  value={holdingsSearch}
                  onChange={(e) => setHoldingsSearch(e.target.value)}
                  style={{ width: '180px', height: '28px', fontSize: '12px', padding: '0 8px', borderRadius: '3px', border: '1px solid #ddd' }}
                />
              </div>
              <hr style={{ border: 'none', borderTop: '1px solid #f0f0f0', margin: '0 0 15px 0' }} />

              <table className="kite-table">
                <thead>
                  <tr>
                    <th>Instrument</th>
                    <th>Qty.</th>
                    <th>Avg. Cost</th>
                    <th>LTP</th>
                    <th>Current Value</th>
                    <th>P&amp;L</th>
                  </tr>
                </thead>
                <tbody>
                  {holdings
                    .filter(h => h.symbol.toLowerCase().includes(holdingsSearch.toLowerCase()))
                    .map((hold) => {
                      const value = hold.currentPrice * hold.qty;
                      const cost = hold.buyPrice * hold.qty;
                      const returnVal = value - cost;
                      const percent = (returnVal / cost) * 100;

                      return (
                        <tr key={hold.symbol}>
                          <td>
                            <strong>{hold.symbol}</strong>
                            {hold.name && <span style={{ fontSize: '11px', color: '#777', marginLeft: '6px' }}>{hold.name}</span>}
                            <span style={{ fontSize: '9px', background: '#e8f5e9', color: '#2e7d32', padding: '1px 5px', borderRadius: '3px', marginLeft: '6px', fontWeight: 'bold' }}>{hold.qty} shares</span>
                          </td>
                          <td>{hold.qty}</td>
                          <td>₹{hold.buyPrice.toFixed(2)}</td>
                          <td className={flashStates[hold.symbol] === 'up' ? 'flash-up text-up' : flashStates[hold.symbol] === 'down' ? 'flash-down text-down' : ''}>₹{hold.currentPrice.toFixed(2)}</td>
                          <td>₹{value.toFixed(2)}</td>
                          <td className={returnVal >= 0 ? 'text-up' : 'text-down'}>
                            <strong>₹{returnVal.toFixed(2)} ({percent.toFixed(2)}%)</strong>
                          </td>
                        </tr>
                      );
                    })}
                  {holdings.filter(h => h.symbol.toLowerCase().includes(holdingsSearch.toLowerCase())).length === 0 && (
                    <tr>
                      <td colSpan={6} style={{ textAlign: 'center', padding: '30px', color: '#999' }}>
                        No holdings matching "{holdingsSearch}"
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>

              <div style={{ 
                marginTop: '25px', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '20px',
                background: '#fafafa', padding: '15px 20px', borderRadius: '4px', border: '1px solid #eee', alignItems: 'center'
              }}>
                <div>
                  <span style={{ fontSize: '11px', color: '#888' }}>Total Investment</span>
                  <h4 style={{ margin: '4px 0 0 0', fontSize: '15px' }}>₹{totalCostValue.toLocaleString([], { maximumFractionDigits: 2 })}</h4>
                </div>
                <div>
                  <span style={{ fontSize: '11px', color: '#888' }}>Current Valuation</span>
                  <h4 style={{ margin: '4px 0 0 0', fontSize: '15px' }}>₹{totalHoldingsValue.toLocaleString([], { maximumFractionDigits: 2 })}</h4>
                </div>
                <div>
                  <span style={{ fontSize: '11px', color: '#888' }}>Total Return</span>
                  <h4 className={totalPnl >= 0 ? 'text-up' : 'text-down'} style={{ margin: '4px 0 0 0', fontSize: '15px' }}>
                    ₹{totalPnl.toLocaleString([], { maximumFractionDigits: 2 })} ({pnlPercent.toFixed(2)}%)
                  </h4>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <div style={{ 
                    width: '38px', height: '38px', borderRadius: '50%', background: '#e3f2fd', 
                    border: '2px solid #387ed1', display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontWeight: '800', color: '#1976d2', fontSize: '13px', flexShrink: 0
                  }}>
                    {holdings.reduce((sum, h) => sum + h.qty, 0)}
                  </div>
                  <div>
                    <span style={{ fontSize: '11px', color: '#888' }}>Demat Share Count</span>
                    <h4 style={{ margin: '2px 0 0 0', fontSize: '13px', color: '#333' }}>
                      {holdings.reduce((sum, h) => sum + h.qty, 0)} shares ({holdings[0]?.symbol || 'LTIM'})
                    </h4>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* 4. POSITIONS SHEET */}
          {activeTab === 'POSITIONS' && (
            <div className="console-card" style={{ padding: '25px', background: '#fff' }}>
              <h3 style={{ margin: 0, fontSize: '15px' }}>Day's Positions ({positions.length})</h3>
              <p style={{ margin: '2px 0 0 0', fontSize: '11px', color: '#999' }}>Intraday MIS trading positions.</p>
              <hr style={{ border: 'none', borderTop: '1px solid #f0f0f0', margin: '15px 0' }} />

              {positions.length > 0 ? (
                <table className="kite-table">
                  <thead>
                    <tr>
                      <th>Symbol</th>
                      <th>Product</th>
                      <th>Qty.</th>
                      <th>Avg. Price</th>
                      <th>LTP</th>
                      <th>P&amp;L</th>
                      <th>Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {positions.map((pos) => {
                      const pnl = (pos.currentPrice - pos.buyPrice) * pos.qty;
                      return (
                        <tr key={pos.symbol}>
                          <td><strong>{pos.symbol}</strong></td>
                          <td>
                            <span style={{ fontSize: '10px', background: '#e0f7fa', color: '#006064', padding: '2px 5px', borderRadius: '2px' }}>
                              {pos.type}
                            </span>
                          </td>
                          <td>{pos.qty}</td>
                          <td>₹{pos.buyPrice.toFixed(2)}</td>
                          <td className={flashStates[pos.symbol] === 'up' ? 'flash-up text-up' : flashStates[pos.symbol] === 'down' ? 'flash-down text-down' : ''}>₹{pos.currentPrice.toFixed(2)}</td>
                          <td className={pnl >= 0 ? 'text-up' : 'text-down'}>
                            <strong>₹{pnl.toFixed(2)}</strong>
                          </td>
                          <td>
                            <button 
                              className="btn-sell" 
                              style={{ padding: '3px 8px !important', fontSize: '10px !important', border: 'none', borderRadius: '2px' }}
                              onClick={() => {
                                const ok = executeOrder(pos.symbol, 'SELL', pos.qty, 'MARKET');
                                if (ok) {
                                  playSuccessSound();
                                  alert(`Successfully squared off position in ${pos.symbol}!`);
                                }
                              }}
                            >Square Off</button>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              ) : (
                <div style={{ textAlign: 'center', padding: '40px', color: '#999', fontSize: '13px' }}>
                  No open intraday trading positions.
                </div>
              )}
            </div>
          )}

          {/* 5. FUNDS SHEET */}
          {activeTab === 'FUNDS' && (
            <div className="console-card" style={{ padding: '25px', background: '#fff' }}>
              <h3 style={{ margin: 0, fontSize: '15px' }}>Margin Limits</h3>
              <p style={{ margin: '2px 0 0 0', fontSize: '11px', color: '#999' }}>Available deposit cash and withdraw limits.</p>
              <hr style={{ border: 'none', borderTop: '1px solid #f0f0f0', margin: '15px 0' }} />

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '30px' }}>
                <div>
                  <span style={{ fontSize: '11px', color: '#888' }}>Available Margin (Cash)</span>
                  <h1 style={{ color: '#4caf50', margin: '5px 0', fontSize: '28px', fontWeight: '600' }}>
                    ₹{margin.toLocaleString([], { minimumFractionDigits: 2 })}
                  </h1>
                  <span style={{ fontSize: '11px', color: '#999' }}>Leverage factor: 5x active on intraday orders</span>
                </div>
                <div style={{ borderLeft: '1px solid #eee', paddingLeft: '30px' }}>
                  <span style={{ fontSize: '11px', color: '#888' }}>Linked Verification Bank Profile</span>
                  <h4 style={{ margin: '5px 0 2px 0', fontSize: '13px' }}>HDFC Bank Ltd</h4>
                  <span style={{ fontSize: '11px', color: '#999' }}>Direct settlements (Account: XXXX-XXXX-1234)</span>
                </div>
              </div>

              <div style={{ display: 'flex', gap: '15px', marginTop: '25px' }}>
                <button className="button" style={{ background: '#387ed1' }} onClick={() => { setFundInput(10000); setAddFundsOpen(true); }}>Add Funds</button>
                <button className="button button-outlined" style={{ color: '#4caf50', borderColor: '#4caf50' }} onClick={() => { setFundInput(5000); setWithdrawOpen(true); }}>Withdraw Capital</button>
              </div>
            </div>
          )}

          {/* 6. APPS SHEET */}
          {activeTab === 'APPS' && (
            <div className="console-card" style={{ padding: '25px', background: '#fff' }}>
              <h3 style={{ margin: 0, fontSize: '15px' }}>Ecosystem Apps</h3>
              <p style={{ margin: '2px 0 0 0', fontSize: '11px', color: '#999' }}>Explore Zerodha's specialized trading platforms.</p>
              <hr style={{ border: 'none', borderTop: '1px solid #f0f0f0', margin: '15px 0' }} />

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: '20px' }}>
                {[
                  { name: 'Console', desc: 'Backoffice portfolio reporting and nominee records.', route: '/console', color: '#387ed1', icon: <Shield size={24} /> },
                  { name: 'Coin', desc: 'Direct mutual fund explorer with compound calculators.', route: '/coin', color: '#e0533c', icon: <Globe size={24} /> },
                  { name: 'Varsity', desc: 'Financial education courses and options trading quizes.', route: '/varsity', color: '#673ab7', icon: <BookOpen size={24} /> },
                  { name: 'Sensibull', desc: 'Options strategies analyzer with Greek calculations.', route: '/sensibull', color: '#009688', icon: <Sparkles size={24} /> },
                  { name: 'Streak', desc: 'Backtesting scanners for algorithmic coding strategies.', route: '/streak', color: '#ff9800', icon: <Play size={24} /> }
                ].map(app => (
                  <div 
                    key={app.name} 
                    onClick={() => navigate(app.route)}
                    style={{ 
                      border: '1px solid #eee', borderRadius: '6px', padding: '20px', 
                      cursor: 'pointer', transition: 'all 0.2s', background: '#fafafa'
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.borderColor = app.color;
                      e.currentTarget.style.boxShadow = '0 4px 10px rgba(0,0,0,0.05)';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.borderColor = '#eee';
                      e.currentTarget.style.boxShadow = 'none';
                    }}
                  >
                    <div style={{ color: app.color, marginBottom: '10px' }}>{app.icon}</div>
                    <h4 style={{ margin: '0 0 6px 0', fontSize: '14px', color: '#333' }}>{app.name}</h4>
                    <p style={{ margin: 0, fontSize: '11px', color: '#777', lineHeight: '1.4' }}>{app.desc}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* DYNAMIC TRADINGVIEW CHART BLOCK (Visible across main trading sheets) */}
          {activeTab !== 'APPS' && activeTab !== 'FUNDS' && (
            <div style={{ marginTop: '20px', display: 'flex', flexDirection: 'column', gap: '10px' }}>
              
              {/* TradingView Header Instrument info */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <h4 style={{ margin: 0, fontSize: '14px', fontWeight: '600' }}>{selectedStock} Chart (NSE)</h4>
                  <span style={{ fontSize: '11px', color: '#999' }}>Live Ticker</span>
                  <span className={(stockPrices[selectedStock] || 0) >= (prevPrices[selectedStock] || 0) ? 'text-up' : 'text-down'} style={{ fontSize: '12px', fontWeight: 'bold' }}>
                    ₹{(stockPrices[selectedStock] || 0).toFixed(2)}
                  </span>
                  <span style={{ fontSize: '10.5px', color: '#555' }}>
                    {getStockAbsoluteChange(selectedStock)} ({getStockPercentChange(selectedStock)})
                  </span>
                </div>
                
                <div style={{ fontSize: '11px', color: '#ff5722', fontWeight: '500', display: 'flex', alignItems: 'center', gap: '8px' }}>
                  {chartIndicator === 'EMA' && <span style={{ background: '#fff3e0', color: '#e65100', padding: '1px 6px', borderRadius: '3px', fontSize: '10px', fontWeight: 'bold' }}>EMA (7) Active</span>}
                  {chartIndicator === 'RSI' && <span style={{ background: '#e8f5e9', color: '#2e7d32', padding: '1px 6px', borderRadius: '3px', fontSize: '10px', fontWeight: 'bold' }}>RSI (14) = 58.4</span>}
                  <span>⚡ TradingView Engine Active</span>
                </div>
              </div>

              {/* TradingView Container */}
              <div className="tv-chart-container">
                
                {/* Left Drawing Tools Toolbar */}
                <div className="tv-drawing-toolbar">
                  {[
                    { tool: 'crosshair', icon: '✛', title: 'Crosshair' },
                    { tool: 'trendline', icon: '╱', title: 'Trend Line' },
                    { tool: 'fibonacci', icon: '≡', title: 'Fibonacci Retracement' },
                    { tool: 'text', icon: 'T', title: 'Text Note' },
                    { tool: 'ruler', icon: '📏', title: 'Measure Ruler' },
                    { tool: 'trash', icon: '🗑', title: 'Erase Drawings' }
                  ].map(item => (
                    <div 
                      key={item.tool}
                      onClick={() => {
                        if (item.tool === 'trash') {
                          alert('Drawings cleared!');
                        } else {
                          setActiveDrawingTool(item.tool);
                        }
                      }}
                      className={`tv-drawing-tool ${activeDrawingTool === item.tool && item.tool !== 'trash' ? 'active' : ''}`}
                      title={item.title}
                    >
                      {item.icon}
                    </div>
                  ))}
                </div>

                {/* Main Chart with Recharts */}
                <div className="tv-chart-main">
                  
                  {/* Top Chart Navigation Options */}
                  <div className="tv-chart-toolbar">
                    {/* Timeframes */}
                    <div style={{ display: 'flex', gap: '6px' }}>
                      {['1m', '5m', '15m', '1h', '1d'].map(tf => (
                        <button 
                          key={tf}
                          onClick={() => setChartTimeframe(tf)}
                          className={`tv-toolbar-btn ${chartTimeframe === tf ? 'active' : ''}`}
                        >
                          {tf}
                        </button>
                      ))}
                    </div>

                    {/* Chart style selection */}
                    <div style={{ display: 'flex', gap: '6px', borderLeft: '1px solid #ddd', paddingLeft: '10px' }}>
                      <button 
                        onClick={() => setChartType('candle')}
                        className={`tv-toolbar-btn ${chartType === 'candle' ? 'active' : ''}`}
                      >
                        Candles
                      </button>
                      <button 
                        onClick={() => setChartType('area')}
                        className={`tv-toolbar-btn ${chartType === 'area' ? 'active' : ''}`}
                      >
                        Area Chart
                      </button>
                    </div>

                    {/* Technical Indicators */}
                    <div style={{ display: 'flex', gap: '6px', borderLeft: '1px solid #ddd', paddingLeft: '10px' }}>
                      <select 
                        value={chartIndicator}
                        onChange={(e) => setChartIndicator(e.target.value)}
                        style={{ height: '24px', fontSize: '11px', border: '1px solid #ddd', borderRadius: '3px', background: '#fff' }}
                      >
                        <option value="None">Indicators</option>
                        <option value="EMA">EMA (Moving Average)</option>
                        <option value="RSI">RSI (Relative Strength)</option>
                        <option value="MACD">MACD Oscillator</option>
                      </select>
                    </div>
                  </div>

                  {/* Canvas area */}
                  <div style={{ flex: 1, padding: '10px 5px 5px 5px' }}>
                    <ResponsiveContainer width="100%" height="95%">
                      <AreaChart data={chartData.map((d, idx, arr) => {
                        let ema = d.price;
                        if (idx >= 3) {
                          const slice = arr.slice(Math.max(0, idx - 5), idx + 1);
                          ema = parseFloat((slice.reduce((s, p) => s + p.price, 0) / slice.length).toFixed(2));
                        }
                        return { ...d, ema };
                      })}>
                        <defs>
                          <linearGradient id="chartColor" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor={chartType === 'candle' ? '#4caf50' : '#2196f3'} stopOpacity={0.25}/>
                            <stop offset="95%" stopColor={chartType === 'candle' ? '#4caf50' : '#2196f3'} stopOpacity={0.0}/>
                          </linearGradient>
                        </defs>
                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
                        <XAxis dataKey="date" stroke="#888" fontSize={9} tickLine={false} />
                        <YAxis domain={['auto', 'auto']} stroke="#888" fontSize={9} tickLine={false} orientation="right" />
                        <Tooltip 
                          content={({ active, payload }) => {
                            if (active && payload && payload.length) {
                              const d = payload[0].payload;
                              const isUp = d.close >= d.open;
                              return (
                                <div style={{ background: '#fff', border: '1px solid #ddd', padding: '8px 12px', borderRadius: '4px', fontSize: '11px', boxShadow: '0 2px 8px rgba(0,0,0,0.1)' }}>
                                  <div style={{ fontWeight: '600', marginBottom: '4px', color: '#555' }}>{d.dateLabel ? `${d.dateLabel} ${d.date}` : d.date}</div>
                                  <div style={{ display: 'grid', gridTemplateColumns: 'auto auto', gap: '3px 12px' }}>
                                    <span style={{ color: '#888' }}>Open:</span> <strong>₹{d.open}</strong>
                                    <span style={{ color: '#888' }}>High:</span> <strong style={{ color: '#4caf50' }}>₹{d.high}</strong>
                                    <span style={{ color: '#888' }}>Low:</span> <strong style={{ color: '#f44336' }}>₹{d.low}</strong>
                                    <span style={{ color: '#888' }}>Close:</span> <strong style={{ color: isUp ? '#4caf50' : '#f44336' }}>₹{d.close}</strong>
                                    <span style={{ color: '#888' }}>Vol:</span> <span>{d.volume ? d.volume.toLocaleString() : 'N/A'}</span>
                                    {chartIndicator === 'EMA' && d.ema && (
                                      <>
                                        <span style={{ color: '#ff9800' }}>EMA (7):</span> <strong style={{ color: '#ff9800' }}>₹{d.ema}</strong>
                                      </>
                                    )}
                                  </div>
                                </div>
                              );
                            }
                            return null;
                          }}
                        />
                        <Area 
                          type="monotone" 
                          dataKey="price" 
                          stroke={chartType === 'candle' ? '#4caf50' : '#2196f3'} 
                          fill="url(#chartColor)" 
                          strokeWidth={2} 
                        />
                        {chartIndicator === 'EMA' && (
                          <Area 
                            type="monotone" 
                            dataKey="ema" 
                            stroke="#ff9800" 
                            strokeWidth={2} 
                            fill="none" 
                            dot={false} 
                          />
                        )}
                      </AreaChart>
                    </ResponsiveContainer>
                  </div>
                </div>

              </div>
            </div>
          )}

        </div>
      </div>

      {/* FLOAT BUY/SELL ORDER MODAL */}
      {orderModalOpen && (
        <div style={{
          position: 'fixed', bottom: '25px', right: '25px', width: '380px',
          background: '#fff', borderRadius: '4px', boxShadow: '0 5px 25px rgba(0,0,0,0.18)',
          zIndex: 10010, border: '1px solid #eee', overflow: 'hidden',
          animation: 'slideUp 0.15s ease-out'
        }}>
          {/* Modal header styled blue/orange like Kite */}
          <div style={{
            background: orderModalType === 'BUY' ? '#4184f3' : '#ff5722',
            color: '#fff', padding: '12px 18px', display: 'flex', justifyContent: 'space-between',
            alignItems: 'center'
          }}>
            <span style={{ fontWeight: '600', fontSize: '13px' }}>
              {orderModalType === 'BUY' ? 'Buy' : 'Sell'} {selectedStock} <span style={{ fontSize: '10px', opacity: 0.8 }}>NSE x {orderQty} Qty</span>
            </span>
            <button 
              className="order-modal-close-btn"
              onClick={() => setOrderModalOpen(false)}
            >&times;</button>
          </div>

          {/* Modal Form */}
          <form onSubmit={handleOrderSubmit} style={{ padding: '20px' }}>
            {/* Product selection */}
            <div style={{ display: 'flex', gap: '20px', marginBottom: '15px', fontSize: '12px' }}>
              <label style={{ cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '5px' }}>
                <input type="radio" checked={orderProduct === 'CNC'} onChange={() => setOrderProduct('CNC')} style={{ marginBottom: 0 }} />
                CNC (Longterm delivery)
              </label>
              <label style={{ cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '5px' }}>
                <input type="radio" checked={orderProduct === 'MIS'} onChange={() => setOrderProduct('MIS')} style={{ marginBottom: 0 }} />
                MIS (Intraday auto-squareoff)
              </label>
            </div>

            <hr style={{ margin: '15px 0', border: 'none', borderTop: '1px solid #eee' }} />

            {/* Inputs row */}
            <div style={{ display: 'flex', gap: '15px', marginBottom: '15px' }}>
              <div style={{ flex: 1 }}>
                <label style={{ fontSize: '11px', color: '#666' }}>Quantity</label>
                <input 
                  type="number" 
                  value={orderQty} 
                  onChange={(e) => setOrderQty(Math.max(1, parseInt(e.target.value) || 0))}
                  style={{ height: '32px', marginTop: '4px', fontSize: '13px', width: '100%', boxSizing: 'border-box' }}
                />
              </div>

              <div style={{ flex: 1.2 }}>
                <label style={{ fontSize: '11px', color: '#666' }}>Price Type</label>
                <div style={{ display: 'flex', gap: '4px', marginTop: '4px' }}>
                  <button 
                    type="button" 
                    onClick={() => setOrderPriceType('MARKET')}
                    style={{ 
                      flex: 1, padding: '4px 0', border: '1px solid #ddd', fontSize: '11px', borderRadius: '3px', cursor: 'pointer',
                      background: orderPriceType === 'MARKET' ? '#387ed1' : '#f5f5f5',
                      color: orderPriceType === 'MARKET' ? '#fff' : '#333'
                    }}
                  >Mkt</button>
                  <button 
                    type="button" 
                    onClick={() => setOrderPriceType('LIMIT')}
                    style={{ 
                      flex: 1, padding: '4px 0', border: '1px solid #ddd', fontSize: '11px', borderRadius: '3px', cursor: 'pointer',
                      background: orderPriceType === 'LIMIT' ? '#387ed1' : '#f5f5f5',
                      color: orderPriceType === 'LIMIT' ? '#fff' : '#333'
                    }}
                  >Lmt</button>
                </div>
              </div>
            </div>

            {orderPriceType === 'LIMIT' && (
              <div style={{ marginBottom: '15px' }}>
                <label style={{ fontSize: '11px', color: '#666' }}>Limit Trigger Price (₹)</label>
                <input 
                  type="number" 
                  value={orderLimitPrice} 
                  onChange={(e) => setOrderLimitPrice(Math.max(0.1, parseFloat(e.target.value) || 0))}
                  style={{ height: '32px', marginTop: '4px', fontSize: '13px', width: '100%', boxSizing: 'border-box' }}
                  step="0.05"
                />
              </div>
            )}

            {/* Margin Requirement Info */}
            <div style={{ 
              display: 'flex', justifyContent: 'space-between', background: '#fcfcfc', 
              padding: '10px 12px', border: '1px solid #eee', borderRadius: '3px', fontSize: '11.5px', marginBottom: '20px' 
            }}>
              <span>Margin Required: <strong>₹{((orderPriceType === 'MARKET' ? stockPrices[selectedStock] || 100 : orderLimitPrice) * orderQty * (orderProduct === 'MIS' ? 0.2 : 1)).toFixed(2)}</strong></span>
              <span>Available: <strong>₹{margin.toFixed(2)}</strong></span>
            </div>

            <div style={{ display: 'flex', gap: '10px' }}>
              <button 
                type="submit" 
                style={{ 
                  flex: 3, 
                  backgroundColor: orderModalType === 'BUY' ? '#4184f3' : '#ff5722',
                  color: '#fff',
                  border: 'none',
                  borderRadius: '3px',
                  height: '36px',
                  cursor: 'pointer',
                  fontSize: '13px', fontWeight: 'bold' 
                }}
              >
                {orderModalType} Order
              </button>
              <button 
                type="button" 
                className="button-outlined" 
                onClick={() => setOrderModalOpen(false)}
                style={{ flex: 1.2, height: '36px', padding: 0, fontSize: '13px' }}
              >Cancel</button>
            </div>
          </form>
        </div>
      )}

      {/* ADD FUNDS INLINE MODAL */}
      {addFundsOpen && (
        <div className="funds-modal-overlay">
          <div className="funds-modal-card">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '15px' }}>
              <h3 style={{ margin: 0, fontSize: '15px' }}>Add Funds to Account</h3>
              <X size={18} style={{ cursor: 'pointer', color: '#777' }} onClick={() => setAddFundsOpen(false)} />
            </div>
            <hr style={{ border: 'none', borderTop: '1px solid #eee', margin: '0 0 15px 0' }} />
            <form onSubmit={executeDeposit}>
              <div style={{ marginBottom: '15px' }}>
                <label style={{ fontSize: '12px', color: '#555' }}>Amount to Deposit (₹)</label>
                <input 
                  type="number" 
                  value={fundInput}
                  onChange={(e) => setFundInput(Math.max(10, parseInt(e.target.value) || 0))}
                  style={{ height: '34px', width: '100%', marginTop: '5px', boxSizing: 'border-box' }}
                  required
                />
              </div>
              <div style={{ marginBottom: '20px' }}>
                <label style={{ fontSize: '12px', color: '#555' }}>Select Method</label>
                <select 
                  value={payMethod}
                  onChange={(e) => setPayMethod(e.target.value)}
                  style={{ width: '100%', height: '34px', marginTop: '5px' }}
                >
                  <option value="UPI">UPI Gateway (GooglePay/PhonePe)</option>
                  <option value="Netbanking">HDFC Netbanking Portal</option>
                </select>
              </div>
              <button type="submit" style={{ width: '100%', height: '36px', background: '#387ed1' }}>Credit Instantly</button>
            </form>
          </div>
        </div>
      )}

      {/* WITHDRAW CAPITAL INLINE MODAL */}
      {withdrawOpen && (
        <div className="funds-modal-overlay">
          <div className="funds-modal-card">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '15px' }}>
              <h3 style={{ margin: 0, fontSize: '15px' }}>Withdraw Capital</h3>
              <X size={18} style={{ cursor: 'pointer', color: '#777' }} onClick={() => setWithdrawOpen(false)} />
            </div>
            <hr style={{ border: 'none', borderTop: '1px solid #eee', margin: '0 0 15px 0' }} />
            <form onSubmit={executeWithdraw}>
              <div style={{ marginBottom: '15px' }}>
                <label style={{ fontSize: '12px', color: '#555' }}>Withdrawal Amount (₹)</label>
                <input 
                  type="number" 
                  value={fundInput}
                  onChange={(e) => setFundInput(Math.max(10, parseInt(e.target.value) || 0))}
                  style={{ height: '34px', width: '100%', marginTop: '5px', boxSizing: 'border-box' }}
                  required
                />
              </div>
              <div style={{ padding: '10px 12px', background: '#fafafa', border: '1px solid #eee', borderRadius: '3px', marginBottom: '20px', fontSize: '11px', color: '#555' }}>
                🏦 Settlement will clear to your linked account: <strong>HDFC Bank (XXXX-XXXX-1234)</strong>. No other bank accounts are mapped.
              </div>
              <button type="submit" style={{ width: '100%', height: '36px', background: '#4caf50' }}>Submit Withdrawal Request</button>
            </form>
          </div>
        </div>
      )}

      {/* Slideup Animation Keyframes */}
      <style>{`
        @keyframes slideUp {
          from { transform: translateY(50px); opacity: 0; }
          to { transform: translateY(0); opacity: 1; }
        }
      `}</style>

    </div>
  );
}
