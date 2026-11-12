import React, { useState, useContext, useEffect } from 'react';
import { AppContext } from '../context/AppContext';
import { Eye, TrendingUp, Sliders, ChevronDown } from 'lucide-react';

export default function Sensibull() {
  const { stockPrices } = useContext(AppContext);
  const spot = stockPrices.NIFTY50 || 23500;
  const [selectedStrike, setSelectedStrike] = useState(23500);

  // Compute strikes based on spot price rounded to nearest 50
  const atmStrike = Math.round(spot / 50) * 50;
  const strikes = [
    atmStrike - 150,
    atmStrike - 100,
    atmStrike - 50,
    atmStrike,
    atmStrike + 50,
    atmStrike + 100,
    atmStrike + 150
  ];

  // Options Greeks and bids calculation based on Spot and Strike
  const getGreeks = (strike, type) => {
    const diff = spot - strike;
    let delta = 0;
    let theta = -12.5;
    let iv = 13.4;
    let price = 0;

    if (type === 'CALL') {
      // ATM Call delta is ~0.5. ITM (Spot > Strike) delta -> 1.0. OTM (Spot < Strike) delta -> 0
      delta = parseFloat((1 / (1 + Math.exp(-diff / 80))).toFixed(2));
      price = parseFloat((Math.max(2, diff + 120 + (Math.random() - 0.5) * 5)).toFixed(2));
      theta = parseFloat((-15 * (1 - Math.abs(delta - 0.5))).toFixed(2));
    } else {
      // ATM Put delta is ~-0.5. ITM (Spot < Strike) delta -> -1.0. OTM (Spot > Strike) delta -> 0
      delta = parseFloat((-1 / (1 + Math.exp(diff / 80))).toFixed(2));
      price = parseFloat((Math.max(2, -diff + 110 + (Math.random() - 0.5) * 5)).toFixed(2));
      theta = parseFloat((-14 * (1 - Math.abs(delta + 0.5))).toFixed(2));
    }

    return {
      price,
      iv: parseFloat((iv + (strike % 100) * 0.01).toFixed(1)),
      delta,
      theta
    };
  };

  // Strategy Builder State
  const [strategyLegs, setStrategyLegs] = useState([]);
  const addLeg = (strike, optionType, action) => {
    const greeks = getGreeks(strike, optionType);
    const newLeg = {
      id: `${strike}_${optionType}_${action}_${Math.random()}`,
      strike,
      optionType,
      action,
      qty: 50, // 1 lot Nifty
      price: greeks.price,
      delta: greeks.delta
    };
    setStrategyLegs([...strategyLegs, newLeg]);
  };

  const removeLeg = (id) => {
    setStrategyLegs(strategyLegs.filter(l => l.id !== id));
  };

  const totalDelta = strategyLegs.reduce((sum, l) => sum + (l.delta * (l.action === 'BUY' ? 1 : -1) * (l.qty / 50)), 0);
  const totalCost = strategyLegs.reduce((sum, l) => sum + (l.price * l.qty * (l.action === 'BUY' ? 1 : -1)), 0);

  return (
    <div class="sensibull-page" style={{ background: '#fbfbfb', minHeight: '80vh', padding: '60px 0' }}>
      <div class="container">
        
        {/* Header Title */}
        <div className="console-card" style={{ background: '#fff', marginBottom: '30px' }}>
          <div className="row between v-align">
            <div>
              <span style={{ fontSize: '12px', textTransform: 'uppercase', color: '#ff9800', letterSpacing: '1px', fontWeight: 'bold' }}>Sensibull Partner App</span>
              <h2 style={{ margin: '5px 0 0 0' }}>Options Strategy Chain &amp; Analyzer</h2>
            </div>
            <div style={{ display: 'flex', gap: '20px' }}>
              <div>
                <span style={{ fontSize: '12px', color: '#888' }}>NIFTY 50 Spot</span>
                <h3 style={{ margin: 0, color: '#387ed1' }}>₹{spot.toFixed(2)}</h3>
              </div>
              <div>
                <span style={{ fontSize: '12px', color: '#888' }}>IV Percentile</span>
                <h3 style={{ margin: 0 }}>42% (Normal)</h3>
              </div>
            </div>
          </div>
        </div>

        {/* Option Chain Grid */}
        <div className="console-card" style={{ background: '#fff', marginBottom: '30px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '15px' }}>
            <h3 style={{ margin: 0, display: 'flex', alignItems: 'center', gap: '8px' }}><TrendingUp size={20} color="#ff9800" /> NIFTY Option Chain</h3>
            <span style={{ fontSize: '12px', color: '#888' }}>Expiry: 25-Jun-2026</span>
          </div>
          <hr />
          <div style={{ overflowX: 'auto' }}>
            <table className="options-table">
              <thead>
                <tr style={{ background: '#f5f5f5' }}>
                  <th colSpan={4} style={{ borderBottom: '2px solid #ccc' }}>CALL OPTIONS</th>
                  <th style={{ borderBottom: '2px solid #ccc', background: '#fafafa' }}>STRIKE</th>
                  <th colSpan={4} style={{ borderBottom: '2px solid #ccc' }}>PUT OPTIONS</th>
                </tr>
                <tr style={{ background: '#fafafa', fontSize: '11px', color: '#666' }}>
                  <th>Bid (Price)</th>
                  <th>IV</th>
                  <th>Delta</th>
                  <th>Theta</th>
                  <th style={{ background: '#f5f5f5' }}>Strike Price</th>
                  <th>Bid (Price)</th>
                  <th>IV</th>
                  <th>Delta</th>
                  <th>Theta</th>
                </tr>
              </thead>
              <tbody>
                {strikes.map((strike) => {
                  const call = getGreeks(strike, 'CALL');
                  const put = getGreeks(strike, 'PUT');
                  const isAtm = strike === atmStrike;

                  return (
                    <tr key={strike} style={{ background: isAtm ? '#fffde7' : 'none' }}>
                      {/* Call Side */}
                      <td class="call-side" style={{ fontWeight: '500' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', padding: '0 10px' }}>
                          <span style={{ color: '#387ed1', cursor: 'pointer' }} onClick={() => addLeg(strike, 'CALL', 'BUY')}>B</span>
                          <span>₹{call.price.toFixed(1)}</span>
                          <span style={{ color: '#e65100', cursor: 'pointer' }} onClick={() => addLeg(strike, 'CALL', 'SELL')}>S</span>
                        </div>
                      </td>
                      <td class="call-side" style={{ color: '#666' }}>{call.iv}%</td>
                      <td class="call-side" style={{ color: '#4caf50' }}>{call.delta}</td>
                      <td class="call-side" style={{ color: '#f44336' }}>{call.theta}</td>

                      {/* Strike Price */}
                      <td class="strike-col" style={{ fontWeight: isAtm ? 'bold' : 'normal' }}>
                        {strike} {isAtm && <span style={{ fontSize: '9px', background: '#333', color: '#fff', padding: '1px 4px', borderRadius: '2px', marginLeft: '4px' }}>ATM</span>}
                      </td>

                      {/* Put Side */}
                      <td class="put-side" style={{ fontWeight: '500' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', padding: '0 10px' }}>
                          <span style={{ color: '#387ed1', cursor: 'pointer' }} onClick={() => addLeg(strike, 'PUT', 'BUY')}>B</span>
                          <span>₹{put.price.toFixed(1)}</span>
                          <span style={{ color: '#e65100', cursor: 'pointer' }} onClick={() => addLeg(strike, 'PUT', 'SELL')}>S</span>
                        </div>
                      </td>
                      <td class="put-side" style={{ color: '#666' }}>{put.iv}%</td>
                      <td class="put-side" style={{ color: '#f44336' }}>{put.delta}</td>
                      <td class="put-side" style={{ color: '#f44336' }}>{put.theta}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>

        {/* Strategy Builder Panel */}
        <div className="console-card" style={{ background: '#fff' }}>
          <h3 style={{ display: 'flex', alignItems: 'center', gap: '8px' }}><Sliders size={20} color="#ff9800" /> Option Strategy Builder</h3>
          <p class="text-grey" style={{ fontSize: '13px' }}>Compose multi-leg strategies to analyze capital requirements and option Greeks portfolio offsets.</p>
          <hr />

          {strategyLegs.length > 0 ? (
            <div class="row between">
              {/* Legs Table */}
              <div class="seven columns">
                <table style={{ width: '100%', border: 'none' }}>
                  <thead>
                    <tr style={{ background: '#f5f5f5' }}>
                      <th style={{ padding: '8px' }}>Action</th>
                      <th style={{ padding: '8px' }}>Strike</th>
                      <th style={{ padding: '8px' }}>Type</th>
                      <th style={{ padding: '8px' }}>Qty</th>
                      <th style={{ padding: '8px' }}>Premium Price</th>
                      <th style={{ padding: '8px' }}>Remove</th>
                    </tr>
                  </thead>
                  <tbody>
                    {strategyLegs.map((leg) => (
                      <tr key={leg.id}>
                        <td style={{ padding: '8px' }}>
                          <span style={{ 
                            fontSize: '11px', 
                            background: leg.action === 'BUY' ? '#e3f2fd' : '#ffebee', 
                            color: leg.action === 'BUY' ? '#0d47a1' : '#c62828', 
                            padding: '2px 6px', borderRadius: '3px', fontWeight: 'bold'
                          }}>{leg.action}</span>
                        </td>
                        <td style={{ padding: '8px' }}><strong>{leg.strike}</strong></td>
                        <td style={{ padding: '8px' }}>{leg.optionType}</td>
                        <td style={{ padding: '8px' }}>{leg.qty} (1 Lot)</td>
                        <td style={{ padding: '8px' }}>₹{leg.price.toFixed(1)}</td>
                        <td style={{ padding: '8px' }}>
                          <button 
                            type="button" 
                            onClick={() => removeLeg(leg.id)}
                            style={{ background: 'none', border: 'none', color: '#f44336', fontSize: '18px', cursor: 'pointer', padding: 0 }}
                          >×</button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Analysis Summary */}
              <div class="four columns console-card" style={{ background: '#fafafa', margin: 0 }}>
                <h4>Strategy Metrics</h4>
                <hr />
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px' }}>
                  <span>Net Premium Cost:</span>
                  <strong>{totalCost >= 0 ? `₹${totalCost.toLocaleString()}` : `Credit: ₹${Math.abs(totalCost).toLocaleString()}`}</strong>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px' }}>
                  <span>Required Margin:</span>
                  <strong>₹{(strategyLegs.length * 28000).toLocaleString()}</strong>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '15px' }}>
                  <span>Strategy Delta:</span>
                  <strong style={{ color: totalDelta >= 0 ? '#4caf50' : '#f44336' }}>{totalDelta.toFixed(2)}</strong>
                </div>

                <button 
                  type="button" 
                  onClick={() => { alert('Strategy sent to Kite! Order executes instantly on confirmation.'); setStrategyLegs([]); }} 
                  style={{ width: '100%', backgroundColor: '#ff9800' }}
                >
                  Deploy Strategy via Kite
                </button>
              </div>
            </div>
          ) : (
            <p className="text-grey text-center" style={{ padding: '20px' }}>Your strategy builder is empty. Click [B] or [S] in the option chain above to add options legs.</p>
          )}
        </div>

      </div>
    </div>
  );
}
