import React, { useState } from 'react';
import { Terminal, Shield, Play, Key, RefreshCw } from 'lucide-react';

export default function KiteConnect() {
  const [apiKey, setApiKey] = useState('kite_api_live_9a2f1b8c');
  const [apiSecret, setApiSecret] = useState('kite_secret_98acdf12b450');
  const [activeEndpoint, setActiveEndpoint] = useState('GET_PROFILE');
  const [apiResponse, setApiResponse] = useState({
    status: 'success',
    data: {
      user_id: 'ZR1234',
      user_name: 'Financial Trader',
      email: 'trader@zerodha.com',
      broker: 'ZERODHA',
      exchanges: ['NSE', 'BSE', 'MCX'],
      products: ['CNC', 'MIS', 'CO', 'BO']
    }
  });

  const [requestCount, setRequestCount] = useState(24);

  const rotateKeys = () => {
    const chars = 'abcdef0123456789';
    let key = 'kite_api_live_';
    let secret = 'kite_secret_';
    for (let i = 0; i < 8; i++) key += chars[Math.floor(Math.random() * chars.length)];
    for (let i = 0; i < 12; i++) secret += chars[Math.floor(Math.random() * chars.length)];
    setApiKey(key);
    setApiSecret(secret);
  };

  const testEndpoint = (endpoint) => {
    setActiveEndpoint(endpoint);
    setRequestCount(prev => prev + 1);

    if (endpoint === 'GET_PROFILE') {
      setApiResponse({
        status: 'success',
        data: {
          user_id: 'ZR1234',
          user_name: 'Financial Trader',
          email: 'trader@zerodha.com',
          broker: 'ZERODHA',
          exchanges: ['NSE', 'BSE', 'MCX']
        }
      });
    } else if (endpoint === 'GET_HOLDINGS') {
      setApiResponse({
        status: 'success',
        data: [
          { symbol: 'RELIANCE', exchange: 'NSE', quantity: 10, average_price: 2420.5 },
          { symbol: 'TCS', exchange: 'NSE', quantity: 5, average_price: 3210.0 }
        ]
      });
    } else if (endpoint === 'PLACE_ORDER') {
      setApiResponse({
        status: 'success',
        data: {
          order_id: `26062200${Math.floor(100000 + Math.random() * 900000)}`,
          status: 'COMPLETE',
          symbol: 'INFY',
          transaction_type: 'BUY',
          quantity: 10
        }
      });
    } else if (endpoint === 'GET_QUOTE') {
      setApiResponse({
        status: 'success',
        data: {
          symbol: 'NIFTY50',
          last_price: 23512.45,
          volume: 2451000,
          ohlc: { open: 23480.0, high: 23525.0, low: 23450.0, close: 23472.0 }
        }
      });
    }
  };

  return (
    <div class="kite-connect-page" style={{ background: '#fbfbfb', minHeight: '80vh', padding: '60px 0' }}>
      <div class="container">
        
        {/* Header Title */}
        <div className="console-card" style={{ background: '#fff', marginBottom: '30px' }}>
          <div className="row between v-align">
            <div>
              <span style={{ fontSize: '12px', textTransform: 'uppercase', color: '#888', letterSpacing: '1px' }}>Developer APIs</span>
              <h2 style={{ margin: '5px 0 0 0' }}>Kite Connect Developer Console</h2>
            </div>
            <div style={{ textAlign: 'right' }}>
              <span style={{ fontSize: '12px', color: '#888' }}>Total API Calls Today</span>
              <h3 style={{ margin: 0 }}>{requestCount} / 50,000</h3>
            </div>
          </div>
        </div>

        {/* API Credentials */}
        <div className="console-card" style={{ background: '#fff', marginBottom: '30px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <h3 style={{ margin: 0, display: 'flex', alignItems: 'center', gap: '8px' }}><Key size={20} color="#387ed1" /> API Credentials</h3>
            <button className="button button-outlined" onClick={rotateKeys} style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '13px', padding: '6px 12px' }}>
              <RefreshCw size={14} /> Regenerate Keys
            </button>
          </div>
          <hr />
          <div className="row between">
            <div className="six columns">
              <label style={{ fontSize: '12px', color: '#888' }}>Kite API Key</label>
              <input type="text" value={apiKey} readOnly style={{ height: '35px', fontFamily: 'monospace', fontSize: '13px', background: '#f5f5f5', marginTop: '4px' }} />
            </div>
            <div className="six columns">
              <label style={{ fontSize: '12px', color: '#888' }}>Kite API Secret Token</label>
              <input type="text" value={apiSecret} readOnly style={{ height: '35px', fontFamily: 'monospace', fontSize: '13px', background: '#f5f5f5', marginTop: '4px' }} />
            </div>
          </div>
        </div>

        {/* Sandbox API Explorer */}
        <div class="row between">
          {/* Endpoint list */}
          <div class="five columns">
            <div class="console-card" style={{ background: '#fff' }}>
              <h3 style={{ display: 'flex', alignItems: 'center', gap: '8px' }}><Terminal size={20} color="#387ed1" /> Endpoint Sandbox</h3>
              <p class="text-grey" style={{ fontSize: '13px' }}>Click on any endpoint below to test request execution inside the developer sandbox environment.</p>
              <hr />

              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                {[
                  { id: 'GET_PROFILE', method: 'GET', path: '/user/profile', label: 'Fetch User Profile' },
                  { id: 'GET_HOLDINGS', method: 'GET', path: '/portfolio/holdings', label: 'Fetch Demat Holdings' },
                  { id: 'PLACE_ORDER', method: 'POST', path: '/orders', label: 'Submit Buy/Sell Order' },
                  { id: 'GET_QUOTE', method: 'GET', path: '/market/quote', label: 'Fetch Spot Quote' }
                ].map((ep) => (
                  <div 
                    key={ep.id}
                    style={{ 
                      display: 'flex', justifyContent: 'space-between', alignItems: 'center', 
                      padding: '12px', border: '1px solid #eee', borderRadius: '4px',
                      cursor: 'pointer', background: activeEndpoint === ep.id ? '#f0f7ff' : '#fff',
                      borderColor: activeEndpoint === ep.id ? '#387ed1' : '#eee'
                    }}
                    onClick={() => testEndpoint(ep.id)}
                  >
                    <div>
                      <span style={{ 
                        fontSize: '10px', 
                        background: ep.method === 'GET' ? '#e8f5e9' : '#e3f2fd', 
                        color: ep.method === 'GET' ? '#2e7d32' : '#0d47a1', 
                        padding: '2px 6px', borderRadius: '3px', fontWeight: 'bold', marginRight: '8px'
                      }}>{ep.method}</span>
                      <strong style={{ fontSize: '13px' }}>{ep.path}</strong>
                      <div style={{ fontSize: '11px', color: '#888', marginTop: '2px' }}>{ep.label}</div>
                    </div>
                    <Play size={14} color="#888" />
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* JSON runner preview */}
          <div class="seven columns">
            <div class="console-card" style={{ background: '#fff', height: '400px', display: 'flex', flexDirection: 'column' }}>
              <h3>Response Console</h3>
              <p class="text-grey" style={{ fontSize: '13px', margin: 0 }}>Raw JSON response returned by the API gateway server.</p>
              <hr />

              <div class="api-runner" style={{ flex: 1, maxHeight: 'none', background: '#1e1e1e', margin: 0 }}>
                <pre style={{ margin: 0, fontSize: '13px', color: '#a9b7c6' }}>
                  {JSON.stringify(apiResponse, null, 2)}
                </pre>
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
