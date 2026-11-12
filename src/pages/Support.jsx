import React, { useState, useContext } from 'react';
import { AppContext } from '../context/AppContext';
import { Search, FileText, CheckCircle2, AlertCircle, HelpCircle } from 'lucide-react';

const kbArticles = [
  { title: 'How do I complete In-Person Verification (IPV)?', category: 'Account Opening', tags: ['ipv', 'kyc', 'video'] },
  { title: 'DP charges explained (debit transaction fee)', category: 'Charges', tags: ['dp', 'charges', 'fees'] },
  { title: 'What is the Kill Switch for trading?', category: 'Kite Features', tags: ['kill switch', 'trading', 'risk'] },
  { title: 'How to download P&L report for tax filing?', category: 'Console Reports', tags: ['tax', 'p&l', 'console'] },
  { title: 'Daily SIP vs Weekly SIP on Coin', category: 'Mutual Funds', tags: ['sip', 'coin', 'mutual fund'] },
  { title: 'Updating nominee details online', category: 'Console Reports', tags: ['nominee', 'account'] }
];

export default function Support() {
  const { tickets, setTickets } = useContext(AppContext);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  
  // Ticket filing state
  const [subject, setSubject] = useState('');
  const [category, setCategory] = useState('Kite Login');
  const [desc, setDesc] = useState('');
  const [showSuccess, setShowSuccess] = useState(false);

  const handleSearch = (e) => {
    const val = e.target.value;
    setSearchQuery(val);
    if (!val) {
      setSearchResults([]);
      return;
    }
    const matches = kbArticles.filter(art => 
      art.title.toLowerCase().includes(val.toLowerCase()) || 
      art.tags.some(t => t.includes(val.toLowerCase()))
    );
    setSearchResults(matches);
  };

  const fileTicket = (e) => {
    e.preventDefault();
    if (!subject || !desc) return alert('Please enter both subject and description.');
    const newTkt = {
      id: `TKT${Math.floor(100 + Math.random() * 900)}`,
      subject,
      status: 'OPEN',
      date: new Date().toISOString().split('T')[0]
    };
    setTickets([newTkt, ...tickets]);
    setSubject('');
    setDesc('');
    setShowSuccess(true);
    setTimeout(() => setShowSuccess(false), 3000);
  };

  return (
    <div class="support-page" style={{ background: '#fbfbfb', minHeight: '80vh', padding: '60px 0' }}>
      <div class="container">
        
        {/* Support Banner Search */}
        <div className="console-card" style={{ background: '#387ed1', color: '#fff', padding: '35px 30px', marginBottom: '30px', borderRadius: '4px' }}>
          <h2 style={{ color: '#fff', marginBottom: '10px' }}>Support Portal</h2>
          <p style={{ opacity: 0.9 }}>Search for answers or file a ticket with our support desks</p>
          <div style={{ position: 'relative', marginTop: '20px' }}>
            <input 
              type="text" 
              value={searchQuery}
              onChange={handleSearch}
              placeholder="e.g. video kyc, DP charges, P&amp;L reports, biometrics..." 
              style={{ paddingLeft: '45px', borderRadius: '4px', border: 'none', height: '50px', background: '#fff', color: '#333' }}
            />
            <Search size={20} style={{ position: 'absolute', left: '15px', top: '15px', color: '#888' }} />
          </div>

          {/* Search Results */}
          {searchQuery && (
            <div style={{ background: '#fff', color: '#333', border: '1px solid #eee', borderRadius: '4px', marginTop: '10px', padding: '15px' }}>
              <p style={{ margin: '0 0 10px 0', fontSize: '14px', color: '#888' }}>
                Search results ({searchResults.length}):
              </p>
              {searchResults.length > 0 ? (
                <ul style={{ listStyleType: 'none', padding: 0, margin: 0 }}>
                  {searchResults.map((art, idx) => (
                    <li key={idx} style={{ padding: '8px 0', borderBottom: idx < searchResults.length - 1 ? '1px solid #f0f0f0' : 'none', display: 'flex', gap: '8px', alignItems: 'center' }}>
                      <FileText size={16} color="#888" />
                      <a href={`#${art.title}`} onClick={(e) => {e.preventDefault(); alert(`Reading article: "${art.title}" \nCategory: ${art.category} \n\nThis KB article is fully updated.`);}} style={{ color: '#387ed1', fontSize: '14px' }}>{art.title}</a>
                      <span style={{ fontSize: '10px', background: '#eee', padding: '2px 6px', borderRadius: '10px', color: '#666' }}>{art.category}</span>
                    </li>
                  ))}
                </ul>
              ) : (
                <p style={{ margin: 0, fontSize: '14px' }}>No matches found. Try searching for "ipv", "dp", or "tax".</p>
              )}
            </div>
          )}
        </div>

        <div class="row between">
          {/* File a ticket */}
          <div class="six columns console-card" style={{ background: '#fff' }}>
            <h3>Create a Support Ticket</h3>
            <p class="text-grey" style={{ fontSize: '13px' }}>If you cannot find an answer in the KB, submit a direct query to our operators.</p>
            <hr />

            {showSuccess && (
              <div class="notice" style={{ background: '#e8f5e9', border: '1px solid #a5d6a7', marginBottom: '20px' }}>
                <p style={{ color: '#2e7d32', display: 'flex', alignItems: 'center', gap: '8px', margin: 0 }}>
                  <CheckCircle2 size={16} /> Ticket submitted successfully!
                </p>
              </div>
            )}

            <form onSubmit={fileTicket}>
              <div style={{ marginBottom: '15px' }}>
                <label>Query Subject</label>
                <input 
                  type="text" 
                  value={subject} 
                  onChange={(e) => setSubject(e.target.value)} 
                  placeholder="Summarize your issue" 
                  required 
                  style={{ height: '38px', marginTop: '5px' }}
                />
              </div>

              <div class="row between" style={{ marginBottom: '15px' }}>
                <div class="twelve columns">
                  <label>Category</label>
                  <select value={category} onChange={(e) => setCategory(e.target.value)} style={{ width: '100%', height: '38px', marginTop: '5px' }}>
                    <option value="Kite Login">Kite App &amp; Biometrics</option>
                    <option value="KYC Verification">Account Opening / KYC</option>
                    <option value="Funds / Banking">Funds Deposit &amp; Bank Links</option>
                    <option value="Mutual Funds">Coin Mutual Funds</option>
                  </select>
                </div>
              </div>

              <div style={{ marginBottom: '20px' }}>
                <label>Detailed Description</label>
                <textarea 
                  value={desc} 
                  onChange={(e) => setDesc(e.target.value)} 
                  placeholder="Explain your problem in detail" 
                  required 
                  style={{ height: '100px', marginTop: '5px', padding: '10px' }}
                />
              </div>

              <button type="submit" style={{ width: '100%' }}>Submit Support Ticket</button>
            </form>
          </div>

          {/* Ticket lists & KB categories */}
          <div class="five columns">
            <div class="console-card" style={{ background: '#fff', marginBottom: '25px' }}>
              <h3>Your Active Tickets ({tickets.length})</h3>
              <hr />
              {tickets.length > 0 ? (
                <ul style={{ listStyleType: 'none', padding: 0, margin: 0 }}>
                  {tickets.map((tkt, idx) => (
                    <li key={tkt.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '10px 0', borderBottom: idx < tickets.length - 1 ? '1px solid #f5f5f5' : 'none' }}>
                      <div>
                        <span style={{ fontSize: '12px', color: '#888', marginRight: '8px' }}>{tkt.id}</span>
                        <span style={{ fontSize: '14px', fontWeight: '500' }}>{tkt.subject}</span>
                        <div style={{ fontSize: '11px', color: '#bbb' }}>Filed on: {tkt.date}</div>
                      </div>
                      <span style={{ 
                        fontSize: '10px', 
                        background: tkt.status === 'OPEN' ? '#fff3e0' : '#e8f5e9', 
                        color: tkt.status === 'OPEN' ? '#e65100' : '#2e7d32', 
                        padding: '2px 8px', 
                        borderRadius: '3px',
                        fontWeight: '600'
                      }}>{tkt.status}</span>
                    </li>
                  ))}
                </ul>
              ) : (
                <p class="text-grey" style={{ fontSize: '13px', margin: 0 }}>You have no support tickets filed yet.</p>
              )}
            </div>

            <div class="console-card" style={{ background: '#fff' }}>
              <h3>Help Directories</h3>
              <hr />
              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                {['Account Opening', 'Console Reports', 'Kite Features', 'Coin Funds', 'Charges'].map((dir) => (
                  <div key={dir} style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }} onClick={() => alert(`Opening help section: ${dir}`)}>
                    <HelpCircle size={16} color="#888" />
                    <span style={{ color: '#387ed1', fontSize: '14px' }}>{dir} Guides</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
