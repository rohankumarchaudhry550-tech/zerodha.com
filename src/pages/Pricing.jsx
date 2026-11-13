import React, { useState } from 'react';

export default function Pricing() {
  // Brokerage Calculator State
  const [calcType, setCalcType] = useState('EQUITY_INTRADAY'); // EQUITY_DELIVERY, EQUITY_INTRADAY, FO_FUTURES, FO_OPTIONS
  const [buyPrice, setBuyPrice] = useState(1000);
  const [sellPrice, setSellPrice] = useState(1010);
  const [qty, setQty] = useState(100);

  // Compute Brokerage & Taxes
  const calculateFees = () => {
    const buyValue = buyPrice * qty;
    const sellValue = sellPrice * qty;
    const turnover = buyValue + sellValue;
    const grossPnl = (sellPrice - buyPrice) * qty;

    let brokerage = 0;
    let stt = 0;
    let exchangeTx = 0;
    let gstRate = 0.18;
    let sebi = parseFloat((turnover * 0.000001).toFixed(2));
    let stamp = 0;

    if (calcType === 'EQUITY_DELIVERY') {
      brokerage = 0;
      stt = parseFloat((turnover * 0.001).toFixed(2)); // 0.1% on buy & sell
      exchangeTx = parseFloat((turnover * 0.0000345).toFixed(2));
      stamp = parseFloat((buyValue * 0.00015).toFixed(2)); // 0.015% on buy
    } else if (calcType === 'EQUITY_INTRADAY') {
      const buyBrok = Math.min(20, buyValue * 0.0003);
      const sellBrok = Math.min(20, sellValue * 0.0003);
      brokerage = parseFloat((buyBrok + sellBrok).toFixed(2));
      stt = parseFloat((sellValue * 0.00025).toFixed(2)); // 0.025% on sell
      exchangeTx = parseFloat((turnover * 0.0000345).toFixed(2));
      stamp = parseFloat((buyValue * 0.00003).toFixed(2)); // 0.003% on buy
    } else if (calcType === 'FO_FUTURES') {
      const buyBrok = Math.min(20, buyValue * 0.0003);
      const sellBrok = Math.min(20, sellValue * 0.0003);
      brokerage = parseFloat((buyBrok + sellBrok).toFixed(2));
      stt = parseFloat((sellValue * 0.0001).toFixed(2)); // 0.01% on sell
      exchangeTx = parseFloat((turnover * 0.00002).toFixed(2));
      stamp = parseFloat((buyValue * 0.00002).toFixed(2)); // 0.002% on buy
    } else if (calcType === 'FO_OPTIONS') {
      brokerage = 40.0; // Flat 20 buy, 20 sell
      stt = parseFloat((sellValue * 0.000625).toFixed(2)); // 0.0625% on sell premium
      exchangeTx = parseFloat((turnover * 0.0005).toFixed(2));
      stamp = parseFloat((buyValue * 0.00003).toFixed(2));
    }

    const gst = parseFloat(((brokerage + exchangeTx) * gstRate).toFixed(2));
    const totalCharges = parseFloat((brokerage + stt + exchangeTx + gst + sebi + stamp).toFixed(2));
    const netPnl = parseFloat((grossPnl - totalCharges).toFixed(2));

    return {
      turnover,
      grossPnl,
      brokerage,
      stt,
      exchangeTx,
      gst,
      sebi,
      stamp,
      totalCharges,
      netPnl
    };
  };

  const results = calculateFees();

  return (
    <div class="pricing-page">
      {/* Title */}
      <section class="text-center" style={{ paddingTop: '80px', paddingBottom: '40px' }}>
        <div class="container">
          <h1 style={{ fontSize: '38px', color: '#424242' }}>Pricing</h1>
          <p style={{ fontSize: '18px', color: '#666' }}>Free equity delivery and flat ₹20 intraday/F&amp;O trades</p>
        </div>
      </section>

      {/* Pricing Grid */}
      <section style={{ borderTop: '1px solid #eee', paddingTop: '60px', paddingBottom: '60px' }}>
        <div class="container">
          <div class="row between text-center">
            <div class="four columns console-card" style={{ padding: '40px 20px' }}>
              <img src="/static/images/pricing-eq.svg" style={{ maxHeight: '80px', marginBottom: '20px' }} alt="Free equity" />
              <h3>Free equity delivery</h3>
              <p class="text-grey">All equity delivery investments (NSE, BSE), direct mutual funds, and IPO investments are ₹0.</p>
            </div>
            <div class="four columns console-card" style={{ padding: '40px 20px' }}>
              <img src="/static/images/other-trades.svg" style={{ maxHeight: '80px', marginBottom: '20px' }} alt="Flat rate" />
              <h3>Flat ₹20 trades</h3>
              <p class="text-grey">Flat ₹20 or 0.03% (whichever is lower) per executed order on intraday trades across equity, currency, and commodity.</p>
            </div>
            <div class="four columns console-card" style={{ padding: '40px 20px' }}>
              <img src="/static/images/pricing-eq.svg" style={{ maxHeight: '80px', marginBottom: '20px' }} alt="Mutual funds" />
              <h3>Free Mutual Funds</h3>
              <p class="text-grey">All direct mutual fund investments on Coin are ₹0 commission, with zero subscription charges.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Brokerage Calculator */}
      <section style={{ background: '#fafafb', padding: '60px 0', borderTop: '1px solid #eee', borderBottom: '1px solid #eee' }}>
        <div class="container">
          <div class="text-center" style={{ marginBottom: '40px' }}>
            <h2>Brokerage Calculator</h2>
            <p class="text-grey">Calculate your net profits after brokerage, taxes, and other regulatory levies</p>
          </div>

          <div class="row between">
            {/* Form inputs */}
            <div class="five columns console-card" style={{ background: '#fff' }}>
              <div style={{ marginBottom: '15px' }}>
                <label style={{ display: 'block', marginBottom: '6px', fontSize: '13px', fontWeight: '500' }}><strong>Segment / Trade Type</strong></label>
                <select 
                  value={calcType} 
                  onChange={(e) => setCalcType(e.target.value)} 
                  style={{ width: '100%', height: '42px', minHeight: '42px', padding: '8px 30px 8px 12px', fontSize: '14px', boxSizing: 'border-box', borderRadius: '4px', border: '1px solid #d1d1d1', backgroundColor: '#fff', cursor: 'pointer' }}
                >
                  <option value="EQUITY_DELIVERY">Equity Delivery (₹0 Brokerage)</option>
                  <option value="EQUITY_INTRADAY">Equity Intraday</option>
                  <option value="FO_FUTURES">Equity Futures (F&amp;O)</option>
                  <option value="FO_OPTIONS">Equity Options (F&amp;O)</option>
                </select>
              </div>

              <div className="row between" style={{ marginBottom: '15px' }}>
                <div className="six columns">
                  <label style={{ display: 'block', marginBottom: '6px', fontSize: '13px', fontWeight: '500' }}>Buy Price (₹)</label>
                  <input 
                    type="number" 
                    value={buyPrice} 
                    onChange={(e) => setBuyPrice(Math.max(0.1, parseFloat(e.target.value) || 0))} 
                    style={{ height: '42px', minHeight: '42px', padding: '8px 12px', fontSize: '14px', boxSizing: 'border-box', borderRadius: '4px', border: '1px solid #d1d1d1', width: '100%' }} 
                  />
                </div>
                <div className="six columns">
                  <label style={{ display: 'block', marginBottom: '6px', fontSize: '13px', fontWeight: '500' }}>Sell Price (₹)</label>
                  <input 
                    type="number" 
                    value={sellPrice} 
                    onChange={(e) => setSellPrice(Math.max(0.1, parseFloat(e.target.value) || 0))} 
                    style={{ height: '42px', minHeight: '42px', padding: '8px 12px', fontSize: '14px', boxSizing: 'border-box', borderRadius: '4px', border: '1px solid #d1d1d1', width: '100%' }} 
                  />
                </div>
              </div>

              <div style={{ marginBottom: '15px' }}>
                <label style={{ display: 'block', marginBottom: '6px', fontSize: '13px', fontWeight: '500' }}>Quantity</label>
                <input 
                  type="number" 
                  value={qty} 
                  onChange={(e) => setQty(Math.max(1, parseInt(e.target.value) || 0))} 
                  style={{ height: '42px', minHeight: '42px', padding: '8px 12px', fontSize: '14px', boxSizing: 'border-box', borderRadius: '4px', border: '1px solid #d1d1d1', width: '100%' }} 
                />
              </div>
            </div>

            {/* Calculations Breakdown */}
            <div class="six columns console-card" style={{ background: '#fff' }}>
              <h3>Calculated Summary</h3>
              <hr />
              <table style={{ width: '100%', border: 'none' }}>
                <tbody>
                  <tr>
                    <td style={{ border: 'none', padding: '6px 0' }}>Turnover (Buy + Sell Value)</td>
                    <td style={{ border: 'none', padding: '6px 0', textAlign: 'right' }}><strong>₹{results.turnover.toLocaleString()}</strong></td>
                  </tr>
                  <tr>
                    <td style={{ border: 'none', padding: '6px 0' }}>Gross P&amp;L</td>
                    <td style={{ border: 'none', padding: '6px 0', textAlign: 'right', color: results.grossPnl >= 0 ? '#4caf50' : '#f44336' }}>
                      <strong>₹{results.grossPnl.toLocaleString()}</strong>
                    </td>
                  </tr>
                  <tr>
                    <td style={{ border: 'none', padding: '6px 0' }}>Brokerage Fee</td>
                    <td style={{ border: 'none', padding: '6px 0', textAlign: 'right' }}>₹{results.brokerage}</td>
                  </tr>
                  <tr>
                    <td style={{ border: 'none', padding: '6px 0' }}>STT / CTT Levy</td>
                    <td style={{ border: 'none', padding: '6px 0', textAlign: 'right' }}>₹{results.stt}</td>
                  </tr>
                  <tr>
                    <td style={{ border: 'none', padding: '6px 0' }}>Exchange Txn Charge</td>
                    <td style={{ border: 'none', padding: '6px 0', textAlign: 'right' }}>₹{results.exchangeTx}</td>
                  </tr>
                  <tr>
                    <td style={{ border: 'none', padding: '6px 0' }}>GST (18% of Brokerage + Exchange)</td>
                    <td style={{ border: 'none', padding: '6px 0', textAlign: 'right' }}>₹{results.gst}</td>
                  </tr>
                  <tr>
                    <td style={{ border: 'none', padding: '6px 0' }}>SEBI + Stamp Duty Charges</td>
                    <td style={{ border: 'none', padding: '6px 0', textAlign: 'right' }}>₹{(results.sebi + results.stamp).toFixed(2)}</td>
                  </tr>
                  <tr style={{ borderTop: '1px solid #ddd' }}>
                    <td style={{ border: 'none', padding: '10px 0', fontSize: '16px' }}><strong>Total Taxes &amp; Charges</strong></td>
                    <td style={{ border: 'none', padding: '10px 0', textAlign: 'right', fontSize: '16px' }}><strong>₹{results.totalCharges}</strong></td>
                  </tr>
                  <tr style={{ background: '#f5f9ff' }}>
                    <td style={{ border: 'none', padding: '12px 10px', fontSize: '18px' }}><strong>Net Realized P&amp;L</strong></td>
                    <td style={{ border: 'none', padding: '12px 10px', textAlign: 'right', fontSize: '18px', color: results.netPnl >= 0 ? '#4caf50' : '#f44336' }}>
                      <strong>₹{results.netPnl.toLocaleString()}</strong>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </section>

      {/* Charge List Table */}
      <section style={{ padding: '60px 0' }}>
        <div class="container">
          <h2 class="text-center" style={{ marginBottom: '30px' }}>Charges &amp; AMC Details</h2>
          <table style={{ width: '100%' }}>
            <thead>
              <tr style={{ background: '#f7f9fa' }}>
                <th style={{ padding: '12px' }}>Service / Tax</th>
                <th style={{ padding: '12px' }}>Charges</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td style={{ padding: '12px' }}>Demat Account Opening</td>
                <td style={{ padding: '12px' }}>₹0 (Online Account Opening)</td>
              </tr>
              <tr>
                <td style={{ padding: '12px' }}>Demat Account AMC (Annual Maintenance Charge)</td>
                <td style={{ padding: '12px' }}>₹300/year + GST (billed quarterly @ ₹75/quarter)</td>
              </tr>
              <tr>
                <td style={{ padding: '12px' }}>DP Charges (debit transaction fee)</td>
                <td style={{ padding: '12px' }}>₹13.50 + GST per company debited from demat per day (CDSL charge)</td>
              </tr>
              <tr>
                <td style={{ padding: '12px' }}>Off-market Transfer</td>
                <td style={{ padding: '12px' }}>0.03% of transaction value or ₹25 (whichever is higher)</td>
              </tr>
              <tr>
                <td style={{ padding: '12px' }}>Call &amp; Trade service fee</td>
                <td style={{ padding: '12px' }}>₹50 per order placed via dealer desk calls</td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}
