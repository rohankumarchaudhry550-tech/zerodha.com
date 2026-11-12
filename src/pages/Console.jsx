import React, { useState, useContext } from 'react';
import { AppContext } from '../context/AppContext';
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts';
import { Landmark, ArrowUpRight, ArrowDownRight, Users, Plus, ShieldAlert } from 'lucide-react';

const COLORS = ['#387ed1', '#00C49F', '#FFBB28', '#FF8042', '#9c27b0', '#00bcd4', '#4caf50'];

export default function Console() {
  const { margin, holdings, depositCash, withdrawCash, stockPrices } = useContext(AppContext);

  // Cash forms state
  const [depositAmt, setDepositAmt] = useState(10000);
  const [withdrawAmt, setWithdrawAmt] = useState(5000);
  const [payMethod, setPayMethod] = useState('UPI');

  // Nominee state
  const [nominees, setNominees] = useState([
    { name: 'Hariom Chaudhary', relation: 'Father', dob: '1978-05-15', share: 100 }
  ]);
  const [nomineeName, setNomineeName] = useState('');
  const [relation, setRelation] = useState('Sibling');
  const [share, setShare] = useState(100);
  const [dob, setDob] = useState('');

  // Prepare holdings chart data
  const chartData = holdings.map(hold => ({
    name: hold.symbol,
    fullName: hold.name,
    qty: hold.qty,
    value: parseFloat((hold.currentPrice * hold.qty).toFixed(2))
  }));

  const totalQty = holdings.reduce((sum, h) => sum + h.qty, 0);
  const totalHoldingsValue = holdings.reduce((sum, h) => sum + (h.currentPrice * h.qty), 0);
  const totalCostValue = holdings.reduce((sum, h) => sum + (h.buyPrice * h.qty), 0);
  const totalPnl = totalHoldingsValue - totalCostValue;
  const pnlPercent = (totalPnl / totalCostValue) * 100;

  const handleDeposit = (e) => {
    e.preventDefault();
    if (depositAmt <= 0) return alert('Please enter a valid amount.');
    depositCash(depositAmt);
    alert(`Successfully deposited ₹${depositAmt.toLocaleString()} via ${payMethod}. Updated Kite available margin!`);
  };

  const handleWithdraw = (e) => {
    e.preventDefault();
    if (withdrawAmt <= 0) return alert('Please enter a valid amount.');
    const success = withdrawCash(withdrawAmt);
    if (success) {
      alert(`Withdrawal request for ₹${withdrawAmt.toLocaleString()} submitted to your linked bank account!`);
    }
  };

  const addNominee = (e) => {
    e.preventDefault();
    if (!nomineeName || !dob) return alert('Nominee name and DOB are required.');
    const totalShare = nominees.reduce((sum, n) => sum + n.share, 0) + parseInt(share);
    if (totalShare > 100) return alert('Total nominee share percentage cannot exceed 100%');
    
    setNominees([...nominees, { name: nomineeName, relation, dob, share: parseInt(share) }]);
    setNomineeName('');
    setDob('');
    alert('Nominee added successfully to Demat records!');
  };

  return (
    <div class="console-page" style={{ background: '#fbfbfb', minHeight: '80vh', padding: '60px 0' }}>
      <div class="container">
        
        {/* Header Summary */}
        <div className="console-card" style={{ background: '#fff' }}>
          <div class="row between v-align">
            <div>
              <span style={{ fontSize: '12px', textTransform: 'uppercase', color: '#888', letterSpacing: '1px' }}>Console Dashboard</span>
              <h2 style={{ margin: '5px 0 0 0' }}>Demat Portfolio Backoffice</h2>
            </div>
            <div style={{ display: 'flex', gap: '30px' }}>
              <div>
                <span style={{ fontSize: '13px', color: '#888' }}>Holdings Value</span>
                <h3 style={{ margin: 0 }}>₹{totalHoldingsValue.toLocaleString([], { maximumFractionDigits: 2 })}</h3>
              </div>
              <div>
                <span style={{ fontSize: '13px', color: '#888' }}>Margin Capital</span>
                <h3 style={{ margin: 0, color: '#4caf50' }}>₹{margin.toLocaleString([], { maximumFractionDigits: 2 })}</h3>
              </div>
            </div>
          </div>
        </div>

        {/* Portfolio PieChart & Ledger Summary */}
        <div class="row between">
          <div class="seven columns console-card" style={{ background: '#fff', height: '400px', display: 'flex', flexDirection: 'column' }}>
            <h3 style={{ margin: 0, marginBottom: '10px' }}>Portfolio Distribution</h3>
            <p class="text-grey" style={{ fontSize: '13px', margin: 0 }}>Asset allocation representation across active holdings.</p>
            <hr />
            <div style={{ flex: 1, minHeight: '260px', position: 'relative' }}>
              {chartData.length > 0 ? (
                <>
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={chartData}
                        cx="50%"
                        cy="45%"
                        innerRadius={68}
                        outerRadius={105}
                        paddingAngle={2}
                        dataKey="value"
                      >
                        {chartData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip 
                        content={({ active, payload }) => {
                          if (active && payload && payload.length) {
                            const data = payload[0].payload;
                            return (
                              <div style={{ background: '#fff', border: '1px solid #ddd', padding: '10px 14px', borderRadius: '4px', boxShadow: '0 4px 12px rgba(0,0,0,0.1)', fontSize: '12px' }}>
                                <div style={{ fontWeight: '700', fontSize: '13px', color: '#333', marginBottom: '4px' }}>
                                  {data.name} <span style={{ fontWeight: 'normal', color: '#777', fontSize: '11px' }}>({data.fullName || 'Holding'})</span>
                                </div>
                                <div style={{ color: '#387ed1', fontWeight: 'bold', fontSize: '14px', marginBottom: '4px' }}>
                                  Share Count: {data.qty} shares
                                </div>
                                <div style={{ color: '#555' }}>
                                  Valuation: <strong>₹{data.value.toLocaleString([], { minimumFractionDigits: 2 })}</strong>
                                </div>
                              </div>
                            );
                          }
                          return null;
                        }}
                      />
                      <Legend 
                        verticalAlign="bottom" 
                        height={36} 
                        formatter={(val) => {
                          const hold = holdings.find(h => h.symbol === val);
                          return `${val} (${hold ? hold.qty : 0} shares)`;
                        }}
                      />
                    </PieChart>
                  </ResponsiveContainer>

                  {/* Centered Donut Circle Metric showing exact Share Count & Live CMP */}
                  <div style={{
                    position: 'absolute',
                    top: '45%',
                    left: '50%',
                    transform: 'translate(-50%, -50%)',
                    textAlign: 'center',
                    pointerEvents: 'none'
                  }}>
                    <span style={{ fontSize: '10px', textTransform: 'uppercase', color: '#888', letterSpacing: '1px', fontWeight: '700' }}>
                      Share Count
                    </span>
                    <div style={{ fontSize: '28px', fontWeight: '800', color: '#387ed1', lineHeight: '1.1' }}>
                      {totalQty}
                    </div>
                    <span style={{ fontSize: '11px', color: '#555', fontWeight: '600' }}>
                      {holdings[0]?.symbol || 'Shares'}
                    </span>
                    <div style={{ fontSize: '10.5px', color: '#2e7d32', fontWeight: '700', marginTop: '2px' }}>
                      ₹{(stockPrices?.[holdings[0]?.symbol] || holdings[0]?.currentPrice || 0).toFixed(2)}
                    </div>
                  </div>
                </>
              ) : (
                <p class="text-center text-grey" style={{ paddingTop: '80px' }}>No holdings data to chart.</p>
              )}
            </div>
          </div>

          <div class="four columns console-card" style={{ background: '#fff', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
            <div>
              <h3>P&amp;L Summary</h3>
              <hr />
              <div style={{ padding: '10px 0' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '12px' }}>
                  <span>Total Cost Basis:</span>
                  <strong>₹{totalCostValue.toLocaleString([], { maximumFractionDigits: 2 })}</strong>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '12px' }}>
                  <span>Current Valuation:</span>
                  <strong>₹{totalHoldingsValue.toLocaleString([], { maximumFractionDigits: 2 })}</strong>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '12px', alignItems: 'center' }}>
                  <span>Net Unrealized P&amp;L:</span>
                  <span class={totalPnl >= 0 ? 'text-up' : 'text-down'} style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                    {totalPnl >= 0 ? <ArrowUpRight size={18} /> : <ArrowDownRight size={18} />}
                    <strong>₹{totalPnl.toLocaleString([], { maximumFractionDigits: 2 })} ({pnlPercent.toFixed(2)}%)</strong>
                  </span>
                </div>
              </div>
            </div>

            <div class="notice" style={{ background: '#e1f5fe', border: '1px solid #b3e5fc', marginTop: '10px' }}>
              <span style={{ fontSize: '11px', color: '#01579b', fontWeight: '500' }}>
                💡 P&amp;L figures update in real-time syncing directly with the live stock feeds inside Kite.
              </span>
            </div>
          </div>
        </div>

        {/* Cash Deposits & Withdrawals Simulator */}
        <div class="row between">
          <div class="six columns console-card" style={{ background: '#fff' }}>
            <h3 style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Landmark size={20} color="#387ed1" /> Transfer Funds
            </h3>
            <p class="text-grey" style={{ fontSize: '13px' }}>Transfer capital instantly via UPI, Netbanking, or NEFT directly to your demat margin account.</p>
            <hr />

            <form onSubmit={handleDeposit}>
              <div style={{ marginBottom: '15px' }}>
                <label>Deposit Amount (₹)</label>
                <input 
                  type="number" 
                  value={depositAmt} 
                  onChange={(e) => setDepositAmt(Math.max(10, parseInt(e.target.value) || 0))} 
                  style={{ height: '35px', marginTop: '5px' }} 
                  required 
                />
              </div>
              <div style={{ marginBottom: '20px' }}>
                <label>Payment Method</label>
                <select value={payMethod} onChange={(e) => setPayMethod(e.target.value)} style={{ width: '100%', height: '35px', marginTop: '5px' }}>
                  <option value="UPI">UPI Payment Gateway (₹0 fee)</option>
                  <option value="NETBANKING">Netbanking Instant (₹9 fee)</option>
                  <option value="NEFT">NEFT / IMPS Bank Transfer (₹0 fee)</option>
                </select>
              </div>
              <button type="submit" style={{ width: '100%' }}>Add Capital Instantly</button>
            </form>
          </div>

          <div class="six columns console-card" style={{ background: '#fff' }}>
            <h3>Request Payout</h3>
            <p class="text-grey" style={{ fontSize: '13px' }}>Submit cash payout request. Funds are deposited in your bank by next day.</p>
            <hr />

            <form onSubmit={handleWithdraw}>
              <div style={{ marginBottom: '15px' }}>
                <label>Withdrawal Amount (₹)</label>
                <input 
                  type="number" 
                  value={withdrawAmt} 
                  onChange={(e) => setWithdrawAmt(Math.max(10, parseInt(e.target.value) || 0))} 
                  style={{ height: '35px', marginTop: '5px' }} 
                  required 
                />
              </div>

              <button type="submit" class="button-outlined" style={{ width: '100%' }}>Submit Withdrawal Request</button>
            </form>
          </div>
        </div>

        {/* Nominee Management Portal */}
        <div className="console-card" style={{ background: '#fff' }}>
          <h3 style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Users size={20} color="#387ed1" /> Nominees List ({nominees.length})
          </h3>
          <p class="text-grey" style={{ fontSize: '13px' }}>Declare demat nominees to protect your financial inheritance in compliance with SEBI rules.</p>
          <hr />

          <div class="row between">
            <div class="six columns">
              <table style={{ width: '100%', border: 'none' }}>
                <thead>
                  <tr style={{ background: '#f5f5f5' }}>
                    <th style={{ padding: '8px' }}>Nominee Name</th>
                    <th style={{ padding: '8px' }}>Relation</th>
                    <th style={{ padding: '8px' }}>DOB</th>
                    <th style={{ padding: '8px' }}>Share %</th>
                  </tr>
                </thead>
                <tbody>
                  {nominees.map((nom, idx) => (
                    <tr key={idx}>
                      <td style={{ padding: '8px' }}><strong>{nom.name}</strong></td>
                      <td style={{ padding: '8px' }}>{nom.relation}</td>
                      <td style={{ padding: '8px' }}>{nom.dob}</td>
                      <td style={{ padding: '8px' }}>{nom.share}%</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div class="five columns console-card" style={{ background: '#fafafa', border: '1px dashed #ccc' }}>
              <h4 style={{ margin: 0, marginBottom: '10px' }}><Plus size={16} style={{ verticalAlign: 'middle', marginRight: '4px' }} /> Add Nominee</h4>
              <form onSubmit={addNominee}>
                <div style={{ marginBottom: '10px' }}>
                  <input 
                    type="text" 
                    value={nomineeName} 
                    onChange={(e) => setNomineeName(e.target.value)} 
                    placeholder="Nominee Full Name" 
                    required 
                    style={{ height: '32px', fontSize: '13px' }}
                  />
                </div>
                <div class="row between" style={{ marginBottom: '10px' }}>
                  <div class="five columns">
                    <select value={relation} onChange={(e) => setRelation(e.target.value)} style={{ width: '100%', height: '32px', fontSize: '13px' }}>
                      <option value="Spouse">Spouse</option>
                      <option value="Father">Father</option>
                      <option value="Mother">Mother</option>
                      <option value="Sibling">Sibling</option>
                      <option value="Child">Child</option>
                    </select>
                  </div>
                  <div class="six columns">
                    <input 
                      type="date" 
                      value={dob} 
                      onChange={(e) => setDob(e.target.value)} 
                      required 
                      style={{ height: '32px', fontSize: '13px' }}
                    />
                  </div>
                </div>
                <div style={{ marginBottom: '15px' }}>
                  <label style={{ fontSize: '12px' }}>Share Allocation %</label>
                  <input 
                    type="number" 
                    value={share} 
                    onChange={(e) => setShare(Math.min(100, Math.max(1, parseInt(e.target.value) || 0)))} 
                    style={{ height: '32px', fontSize: '13px' }}
                  />
                </div>
                <button type="submit" style={{ width: '100%', padding: '6px 12px', fontSize: '13px' }}>Register Nominee</button>
              </form>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
