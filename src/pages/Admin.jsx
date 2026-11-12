import React, { useState, useContext } from 'react';
import { AppContext } from '../context/AppContext';
import { Shield, Settings, Activity, ClipboardList, CheckCircle } from 'lucide-react';

export default function Admin() {
  const { kyc, margin, tickets } = useContext(AppContext);
  const [leverage, setLeverage] = useState(5);
  const [blockShortSell, setBlockShortSell] = useState(false);
  const [kycChecks, setKycChecks] = useState([
    { task: 'Penny Drop Bank verification', status: 'VERIFIED', time: '10:11 AM' },
    { task: 'Digilocker eSign application', status: 'VERIFIED', time: '10:12 AM' },
    { task: 'IPV (In-Person Verification) video scan', status: 'VERIFIED', time: '10:13 AM' }
  ]);

  const [settingsSaved, setSettingsSaved] = useState(false);

  const saveAdminSettings = (e) => {
    e.preventDefault();
    setSettingsSaved(true);
    setTimeout(() => setSettingsSaved(false), 2500);
  };

  return (
    <div class="admin-page" style={{ background: '#fbfbfb', minHeight: '80vh', padding: '60px 0' }}>
      <div class="container">
        
        {/* Header Title */}
        <div className="console-card" style={{ background: '#fff', marginBottom: '30px' }}>
          <div className="row between v-align">
            <div>
              <span style={{ fontSize: '12px', textTransform: 'uppercase', color: '#673ab7', letterSpacing: '1px', fontWeight: 'bold' }}>Risk &amp; Operations</span>
              <h2 style={{ margin: '5px 0 0 0' }}>Enterprise Operations &amp; Compliance Console</h2>
            </div>
            <div>
              <span style={{ fontSize: '12px', color: '#888' }}>System Integrity:</span>
              <span style={{ fontSize: '12px', color: '#4caf50', fontWeight: 'bold', marginLeft: '6px' }}>● Secure</span>
            </div>
          </div>
        </div>

        <div class="row between">
          {/* Risk Management Settings */}
          <div class="six columns console-card" style={{ background: '#fff' }}>
            <h3 style={{ display: 'flex', alignItems: 'center', gap: '8px' }}><Settings size={20} color="#673ab7" /> Risk Parameters</h3>
            <p class="text-grey" style={{ fontSize: '13px' }}>Configure client margin leverage limits and systemic order blocks.</p>
            <hr />

            {settingsSaved && (
              <div class="notice" style={{ background: '#e8f5e9', border: '1px solid #a5d6a7', marginBottom: '15px' }}>
                <p style={{ color: '#2e7d32', margin: 0, display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <CheckCircle size={16} /> Risk settings updated globally!
                </p>
              </div>
            )}

            <form onSubmit={saveAdminSettings}>
              <div style={{ marginBottom: '15px' }}>
                <label>Intraday MIS Leverage Multiplier</label>
                <select value={leverage} onChange={(e) => setLeverage(parseInt(e.target.value))} style={{ width: '100%', height: '35px', marginTop: '5px' }}>
                  <option value={5}>5x Leverage (NSE Standard)</option>
                  <option value={10}>10x Leverage (High Risk)</option>
                  <option value={2}>2x Leverage (Conservative)</option>
                </select>
              </div>

              <div style={{ marginBottom: '25px' }}>
                <label style={{ display: 'flex', alignItems: 'center', cursor: 'pointer' }}>
                  <input 
                    type="checkbox" 
                    checked={blockShortSell} 
                    onChange={(e) => setBlockShortSell(e.target.checked)} 
                    style={{ marginRight: '8px' }} 
                  />
                  Block Client Intraday Short Selling
                </label>
              </div>

              <button type="submit" style={{ width: '100%', backgroundColor: '#673ab7' }}>Save Risk Policies</button>
            </form>
          </div>

          {/* System logs & KYC status */}
          <div class="six columns">
            
            {/* Audit Logs */}
            <div class="console-card" style={{ background: '#fff', marginBottom: '25px' }}>
              <h3 style={{ display: 'flex', alignItems: 'center', gap: '8px' }}><Activity size={20} color="#673ab7" /> Real-time Audit Trail</h3>
              <hr />
              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', fontSize: '12px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid #f5f5f5', paddingBottom: '6px' }}>
                  <span style={{ color: '#888' }}>10:14 AM</span>
                  <span>System: Syncing NIFTY tick feeds ...</span>
                  <span style={{ color: '#4caf50' }}>[OK]</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid #f5f5f5', paddingBottom: '6px' }}>
                  <span style={{ color: '#888' }}>10:13 AM</span>
                  <span>IPV Video KYC snap saved (CDSL)</span>
                  <span style={{ color: '#387ed1' }}>[STORED]</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid #f5f5f5', paddingBottom: '6px' }}>
                  <span style={{ color: '#888' }}>10:10 AM</span>
                  <span>Vite dev server hot reload complete</span>
                  <span style={{ color: '#888' }}>[INFO]</span>
                </div>
              </div>
            </div>

            {/* SEBI Compliance Checklist */}
            <div class="console-card" style={{ background: '#fff' }}>
              <h3 style={{ display: 'flex', alignItems: 'center', gap: '8px' }}><ClipboardList size={20} color="#673ab7" /> SEBI KYC Audit Status</h3>
              <hr />
              <ul style={{ listStyleType: 'none', padding: 0, margin: 0, fontSize: '13px' }}>
                {kycChecks.map((chk, idx) => (
                  <li key={idx} style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 0', borderBottom: idx < kycChecks.length - 1 ? '1px solid #f5f5f5' : 'none' }}>
                    <div>
                      <span>{chk.task}</span>
                      <div style={{ fontSize: '11px', color: '#bbb' }}>Audited at: {chk.time}</div>
                    </div>
                    <span style={{ color: '#2e7d32', fontWeight: 'bold' }}>{chk.status}</span>
                  </li>
                ))}
              </ul>
            </div>

          </div>
        </div>

      </div>
    </div>
  );
}
