import React, { useState, useContext } from 'react';
import { AppContext } from '../context/AppContext';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Search, ChevronRight, Calculator, Plus, Compass } from 'lucide-react';

export default function Coin() {
  const { mutualFunds, mfHoldings, setMfHoldings, margin, withdrawCash } = useContext(AppContext);
  const [selectedFund, setSelectedFund] = useState(null);
  
  // SIP Setup States
  const [sipAmt, setSipAmt] = useState(5000);
  const [sipFreq, setSipFreq] = useState('Monthly');
  const [years, setYears] = useState(5);
  const [rate, setRate] = useState(15); // expected return rate

  // Compute SIP Future Value
  const calculateSip = () => {
    const P = sipAmt;
    const r = rate;
    const n = years * 12;
    const i = (r / 12) / 100;
    
    // Future value of SIP formula: P * [((1 + i)^n - 1) / i] * (1 + i)
    const fv = P * (((Math.pow(1 + i, n) - 1) / i) * (1 + i));
    const invested = P * n;
    const returns = fv - invested;

    return {
      invested: parseFloat(invested.toFixed(2)),
      returns: parseFloat(returns.toFixed(2)),
      total: parseFloat(fv.toFixed(2))
    };
  };

  const sipResults = calculateSip();

  const handleSipSetup = (fund) => {
    if (margin < sipAmt) {
      return alert('Insufficient balance in your Demat margin wallet! Deposit funds first.');
    }
    
    // Deduct first installment
    withdrawCash(sipAmt);

    const unitsAdded = parseFloat((sipAmt / fund.nav).toFixed(3));
    const existing = mfHoldings.find(h => h.fundId === fund.id);

    if (existing) {
      setMfHoldings(mfHoldings.map(h => 
        h.fundId === fund.id 
          ? { ...h, amountInvested: h.amountInvested + sipAmt, units: parseFloat((h.units + unitsAdded).toFixed(3)) } 
          : h
      ));
    } else {
      setMfHoldings([...mfHoldings, {
        fundId: fund.id,
        name: fund.name,
        amountInvested: sipAmt,
        currentNav: fund.nav,
        units: unitsAdded
      }]);
    }
    alert(`SIP Setup complete! First installment of ₹${sipAmt} deducted from your wallet for "${fund.name}".`);
  };

  // Mock historical performance data for the chart
  const fundPerformanceData = [
    { year: '2021', val: 100 },
    { year: '2022', val: 118 },
    { year: '2023', val: 132 },
    { year: '2024', val: 165 },
    { year: '2025', val: 210 },
    { year: '2026', val: 245 }
  ];

  return (
    <div class="coin-page" style={{ background: '#fbfbfb', minHeight: '80vh', padding: '60px 0' }}>
      <div class="container">
        
        {/* Header Title */}
        <div className="console-card" style={{ background: '#fff', marginBottom: '30px' }}>
          <div className="row between v-align">
            <div>
              <span style={{ fontSize: '12px', textTransform: 'uppercase', color: '#888', letterSpacing: '1px' }}>Coin Dashboard</span>
              <h2 style={{ margin: '5px 0 0 0' }}>Direct Mutual Funds Portal</h2>
            </div>
            <div>
              <span style={{ fontSize: '13px', color: '#888' }}>Total MF Investments</span>
              <h3 style={{ margin: 0, color: '#387ed1' }}>
                ₹{mfHoldings.reduce((sum, h) => sum + h.amountInvested, 0).toLocaleString()}
              </h3>
            </div>
          </div>
        </div>

        <div class="row between">
          {/* Funds Directory List */}
          <div class="seven columns">
            <div class="console-card" style={{ background: '#fff' }}>
              <h3 style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Compass size={20} color="#387ed1" /> Explore Direct Funds
              </h3>
              <p class="text-grey" style={{ fontSize: '13px' }}>Direct mutual funds have 0% distributor commission expense ratios saving you up to 1.5% yearly.</p>
              <hr />

              <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
                {mutualFunds.map((fund) => (
                  <div 
                    key={fund.id}
                    class="watchlist-item"
                    style={{ border: '1px solid #eee', borderRadius: '4px', padding: '15px' }}
                    onClick={() => setSelectedFund(fund)}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
                      <span style={{ fontSize: '24px' }}>{fund.logo}</span>
                      <div>
                        <strong>{fund.name}</strong>
                        <div style={{ fontSize: '12px', color: '#888' }}>{fund.category}</div>
                      </div>
                    </div>

                    <div style={{ display: 'flex', gap: '25px', alignItems: 'center' }}>
                      <div style={{ textAlign: 'right' }}>
                        <div style={{ fontSize: '12px', color: '#888' }}>3Y Returns</div>
                        <span class="text-up" style={{ fontWeight: 'bold' }}>{fund.return3y}</span>
                      </div>
                      <div style={{ textAlign: 'right' }}>
                        <div style={{ fontSize: '12px', color: '#888' }}>NAV</div>
                        <strong>₹{fund.nav.toFixed(2)}</strong>
                      </div>
                      <ChevronRight size={18} color="#bbb" />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* SIP Calculator & Holdings summary */}
          <div class="four columns">
            
            {/* MF Holdings Summary */}
            <div class="console-card" style={{ background: '#fff', marginBottom: '25px' }}>
              <h3>Your MF Holdings ({mfHoldings.length})</h3>
              <hr />
              {mfHoldings.length > 0 ? (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
                  {mfHoldings.map((h, idx) => {
                    const currentVal = h.units * h.currentNav;
                    const returnVal = currentVal - h.amountInvested;
                    return (
                      <div key={idx} style={{ fontSize: '13px', borderBottom: idx < mfHoldings.length - 1 ? '1px solid #eee' : 'none', paddingBottom: '10px' }}>
                        <strong>{h.name}</strong>
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '6px' }}>
                          <span>Invested: <strong>₹{h.amountInvested.toLocaleString()}</strong></span>
                          <span>Value: <strong>₹{currentVal.toLocaleString([], { maximumFractionDigits: 1 })}</strong></span>
                        </div>
                        <div style={{ textAlign: 'right', marginTop: '4px', color: returnVal >= 0 ? '#4caf50' : '#f44336' }}>
                          Return: <strong>₹{returnVal.toLocaleString([], { maximumFractionDigits: 1 })}</strong>
                        </div>
                      </div>
                    );
                  })}
                </div>
              ) : (
                <p class="text-grey" style={{ fontSize: '13px', margin: 0 }}>You have no active mutual fund investments.</p>
              )}
            </div>

            {/* SIP Calculator */}
            <div class="console-card" style={{ background: '#fff' }}>
              <h3 style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Calculator size={18} color="#387ed1" /> SIP Calculator
              </h3>
              <hr />
              <div style={{ marginBottom: '10px' }}>
                <label style={{ fontSize: '12px' }}>Monthly SIP Amount (₹)</label>
                <input 
                  type="number" 
                  value={sipAmt} 
                  onChange={(e) => setSipAmt(Math.max(100, parseInt(e.target.value) || 0))} 
                  style={{ height: '30px', fontSize: '13px', marginTop: '3px' }}
                />
              </div>

              <div class="row between" style={{ marginBottom: '10px' }}>
                <div class="five columns">
                  <label style={{ fontSize: '12px' }}>Period (Years)</label>
                  <input 
                    type="number" 
                    value={years} 
                    onChange={(e) => setYears(Math.max(1, parseInt(e.target.value) || 0))} 
                    style={{ height: '30px', fontSize: '13px', marginTop: '3px' }}
                  />
                </div>
                <div class="six columns">
                  <label style={{ fontSize: '12px' }}>Expected Return (%)</label>
                  <input 
                    type="number" 
                    value={rate} 
                    onChange={(e) => setRate(Math.max(1, parseInt(e.target.value) || 0))} 
                    style={{ height: '30px', fontSize: '13px', marginTop: '3px' }}
                  />
                </div>
              </div>

              <div style={{ background: '#fcfcfc', padding: '10px', borderRadius: '4px', fontSize: '12px', marginTop: '15px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
                  <span>Amount Invested:</span>
                  <strong>₹{sipResults.invested.toLocaleString()}</strong>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
                  <span>Estimated Returns:</span>
                  <span class="text-up"><strong>₹{sipResults.returns.toLocaleString()}</strong></span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', borderTop: '1px solid #ddd', paddingTop: '6px' }}>
                  <span>Future Valuation:</span>
                  <strong>₹{sipResults.total.toLocaleString()}</strong>
                </div>
              </div>
            </div>

          </div>
        </div>

        {/* Selected Fund Modal Panel */}
        {selectedFund && (
          <div style={{
            position: 'fixed', top: 0, left: 0, width: '100%', height: '100vh',
            background: 'rgba(0,0,0,0.4)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 9999
          }}>
            <div class="console-card" style={{ background: '#fff', maxWidth: '600px', width: '100%', margin: '20px', padding: '30px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '15px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <span style={{ fontSize: '28px' }}>{selectedFund.logo}</span>
                  <div>
                    <h3 style={{ margin: 0 }}>{selectedFund.name}</h3>
                    <span style={{ fontSize: '12px', background: '#eee', padding: '2px 8px', borderRadius: '10px', color: '#666' }}>{selectedFund.category}</span>
                  </div>
                </div>
                <button type="button" class="close" onClick={() => setSelectedFund(null)} style={{ border: 'none', background: 'none', fontSize: '24px' }}>×</button>
              </div>

              <hr />

              {/* Fund Performance Chart */}
              <div style={{ height: '180px', marginBottom: '20px' }}>
                <p style={{ margin: '0 0 5px 0', fontSize: '12px', color: '#888' }}>Historical NAV Index growth:</p>
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={fundPerformanceData}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#eee" />
                    <XAxis dataKey="year" stroke="#888" fontSize={10} tickLine={false} />
                    <YAxis stroke="#888" fontSize={10} tickLine={false} orientation="right" />
                    <Tooltip />
                    <Area type="monotone" dataKey="val" stroke="#2e7d32" fill="#e8f5e9" strokeWidth={2} />
                  </AreaChart>
                </ResponsiveContainer>
              </div>

              <div class="row between" style={{ marginBottom: '20px', background: '#fafafa', padding: '15px', borderRadius: '4px' }}>
                <div>
                  <span style={{ fontSize: '12px', color: '#888' }}>Current Net Asset Value (NAV)</span>
                  <h4 style={{ margin: 0 }}>₹{selectedFund.nav.toFixed(2)}</h4>
                </div>
                <div>
                  <span style={{ fontSize: '12px', color: '#888' }}>3-Year annualized compound returns</span>
                  <h4 style={{ margin: 0, color: '#2e7d32' }}>{selectedFund.return3y}</h4>
                </div>
              </div>

              {/* Installment input */}
              <div class="row between" style={{ alignItems: 'center' }}>
                <div class="six columns">
                  <label style={{ display: 'block', marginBottom: '6px', fontSize: '13px', fontWeight: '500' }}>SIP Installment Amount (₹)</label>
                  <input 
                    type="number" 
                    value={sipAmt} 
                    onChange={(e) => setSipAmt(Math.max(500, parseInt(e.target.value) || 0))} 
                    style={{ height: '42px', minHeight: '42px', padding: '8px 12px', fontSize: '14px', boxSizing: 'border-box', borderRadius: '4px', border: '1px solid #d1d1d1', margin: 0 }}
                  />
                  <span style={{ fontSize: '11px', color: '#888', display: 'block', marginTop: '4px' }}>Min amount: ₹500</span>
                </div>
                <div class="five columns">
                  <label style={{ display: 'block', marginBottom: '6px', fontSize: '13px', fontWeight: '500' }}>Installment Cycle</label>
                  <select 
                    value={sipFreq} 
                    onChange={(e) => setSipFreq(e.target.value)} 
                    style={{ width: '100%', height: '42px', minHeight: '42px', padding: '8px 30px 8px 12px', fontSize: '14px', boxSizing: 'border-box', borderRadius: '4px', border: '1px solid #d1d1d1', backgroundColor: '#fff', cursor: 'pointer', margin: 0 }}
                  >
                    <option value="Daily">Daily SIP</option>
                    <option value="Weekly">Weekly SIP</option>
                    <option value="Monthly">Monthly SIP</option>
                  </select>
                </div>
              </div>

              <button 
                type="button" 
                onClick={() => {
                  handleSipSetup(selectedFund);
                  setSelectedFund(null);
                }} 
                style={{ width: '100%', marginTop: '25px', backgroundColor: '#387ed1' }}
              >
                Set up Instant {sipFreq} SIP
              </button>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
