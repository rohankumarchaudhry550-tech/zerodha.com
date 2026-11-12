import React, { useState, useEffect, useContext } from 'react';
import { NavLink, Link, useLocation } from 'react-router-dom';
import { AppContext } from '../context/AppContext';
import { Menu, X, LogOut, User } from 'lucide-react';

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const { isAuthenticated, logout, user } = useContext(AppContext);
  const location = useLocation();

  // Close menu on route change
  useEffect(() => {
    setMenuOpen(false);
  }, [location]);

  // Click outside to close menu dropdown
  useEffect(() => {
    const handleOutsideClick = (e) => {
      const menu = document.getElementById("menu");
      const btn = document.getElementById("menu_btn");
      if (menuOpen && menu && btn && !menu.contains(e.target) && !btn.contains(e.target)) {
        setMenuOpen(false);
      }
    };
    window.addEventListener('click', handleOutsideClick);
    return () => window.removeEventListener('click', handleOutsideClick);
  }, [menuOpen]);

  const toggleMenu = (e) => {
    e.stopPropagation();
    setMenuOpen(!menuOpen);
  };

  return (
    <nav class="navbar">
      <div class="container">
        <div class="nav-responsive row between">
          <div class="relative-section five columns">
            <Link to="/">
              <img class="logo-img" src="/static/images/logo.svg" alt="Zerodha logo" />
            </Link>
          </div>
          <div class="nav-active seven columns" role="navigation" aria-label="main navigation">
            <ul class="navbar-links">
              <li class="hide-on-small">
                {isAuthenticated ? (
                  <Link to="/kite" id="nav_acop" style={{ color: '#fff' }}>Kite Trading</Link>
                ) : (
                  <NavLink to="/signup" className={({ isActive }) => isActive ? 'active-link' : ''}>Signup</NavLink>
                )}
              </li>
              <li class="hide-on-small">
                <NavLink to="/about" className={({ isActive }) => isActive ? 'active-link' : ''}>About</NavLink>
              </li>
              <li class="hide-on-small">
                <NavLink to="/products" className={({ isActive }) => isActive ? 'active-link' : ''}>Products</NavLink>
              </li>
              <li class="hide-on-small">
                <NavLink to="/pricing" className={({ isActive }) => isActive ? 'active-link' : ''}>Pricing</NavLink>
              </li>
              <li class="hide-on-small">
                <NavLink to="/support" className={({ isActive }) => isActive ? 'active-link' : ''}>Support</NavLink>
              </li>

              {isAuthenticated && (
                <li class="hide-on-small" style={{ marginLeft: '15px' }}>
                  <span style={{ fontSize: '13px', background: '#fafafa', border: '1px solid #ddd', padding: '5px 10px', borderRadius: '4px', display: 'inline-flex', alignItems: 'center', gap: '5px' }}>
                    <User size={13} color="#387ed1" /> <strong>{user.name.split(' ')[0]}</strong> ({user.userId})
                    <LogOut size={13} style={{ cursor: 'pointer', marginLeft: '5px' }} onClick={logout} title="Logout" />
                  </span>
                </li>
              )}

              {!isAuthenticated && (
                <li className="hide-on-small" style={{ marginLeft: '12px' }}>
                  <Link to="/login" style={{ fontSize: '13px', background: '#387ed1', color: '#fff', padding: '6px 16px', borderRadius: '3px', fontWeight: '500', textDecoration: 'none', display: 'inline-block' }}>Login</Link>
                </li>
              )}
              
              <li id="navbar_menu">
                <div class="cursor-pointer" id="menu_btn" title="Menu" onClick={toggleMenu}>
                  <div id="nav-icon3" class={menuOpen ? 'open' : ''}>
                    <span></span>
                    <span></span>
                    <span></span>
                    <span></span>
                  </div>
                </div>
                
                <div id="menu" class={`navbar-menu text-left ${menuOpen ? 'show' : ''}`} style={{ transition: 'all 0.2s ease' }}>
                  <ul class="navbar-links show-on-mobile">
                    {isAuthenticated ? (
                      <li><Link to="/kite">Kite Platform</Link></li>
                    ) : (
                      <li><Link to="/signup">Signup</Link></li>
                    )}
                    <li><Link to="/about">About</Link></li>
                    <li><Link to="/products">Products</Link></li>
                    <li><Link to="/pricing">Pricing</Link></li>
                    <li><Link to="/support">Support</Link></li>
                    {isAuthenticated ? (
                      <li><a href="#logout" onClick={(e) => { e.preventDefault(); logout(); }}>Logout</a></li>
                    ) : (
                      <li><Link to="/login">Login</Link></li>
                    )}
                  </ul>
                  
                  <div class="row between v-align products-list" style={{ padding: '20px' }}>
                    <div class="three columns">
                      <Link class="text-center" to="/kite">
                        <img src="/static/images/products/kite-logo.svg" style={{ maxHeight: '35px' }} alt="Kite" /><br />
                        <span><strong>Kite</strong></span>
                        <br class="hide-on-small" />
                        <span class="text-light-grey text-12 hide-on-small">Trading platform</span>
                      </Link>
                    </div>
                    <div class="three columns">
                      <Link class="text-center" to="/console">
                        <img src="/static/images/products/console.svg" style={{ maxHeight: '35px' }} alt="Console" /><br />
                        <span><strong>Console</strong></span>
                        <br class="hide-on-small" />
                        <span class="text-light-grey text-12 hide-on-small">Backoffice dashboard</span>
                      </Link>
                    </div>
                    <div class="three columns">
                      <Link class="text-center" to="/coin">
                        <img src="/static/images/products/coin.svg" style={{ maxHeight: '35px' }} alt="Coin" /><br />
                        <span><strong>Coin</strong></span>
                        <br class="hide-on-small" />
                        <span class="text-light-grey text-12 hide-on-small">Mutual funds</span>
                      </Link>
                    </div>
                    <div class="three columns">
                      <Link class="text-center" to="/varsity">
                        <img src="/static/images/products/varsity.png" style={{ maxHeight: '35px' }} alt="Varsity" /><br />
                        <span><strong>Varsity</strong></span>
                        <br class="hide-on-small" />
                        <span class="text-light-grey text-12 hide-on-small">Market education</span>
                      </Link>
                    </div>
                  </div>

                  <div class="row between v-align products-list" style={{ padding: '0 20px 20px 20px', borderTop: 'none' }}>
                    <div class="three columns">
                      <Link class="text-center" to="/kite-connect">
                        <img src="/static/images/products/kite-connect.svg" style={{ maxHeight: '30px' }} alt="Kite Connect" /><br />
                        <span><strong>Kite Connect API</strong></span>
                      </Link>
                    </div>
                    <div class="three columns">
                      <Link class="text-center" to="/sensibull">
                        <span style={{ fontSize: '24px' }}>🐂</span><br />
                        <span><strong>Sensibull</strong></span>
                        <br />
                        <span class="text-light-grey text-12 hide-on-small">Options strategy</span>
                      </Link>
                    </div>
                    <div class="three columns">
                      <Link class="text-center" to="/streak">
                        <span style={{ fontSize: '24px' }}>⚡</span><br />
                        <span><strong>Streak</strong></span>
                        <br />
                        <span class="text-light-grey text-12 hide-on-small">Algo backtesting</span>
                      </Link>
                    </div>
                    <div class="three columns">
                      <Link class="text-center" to="/admin">
                        <span style={{ fontSize: '24px' }}>⚙️</span><br />
                        <span><strong>Admin Portal</strong></span>
                      </Link>
                    </div>
                  </div>

                  <div class="menu-footer">
                    <div class="row between">
                      <div class="seven columns">
                        <div class="row between">
                          <div class="six columns">
                            <p><strong>Utilities</strong></p>
                            <Link to="/pricing">Brokerage Calculator</Link>
                            <Link to="/kite">Margin Calculator</Link>
                            <a href="https://zerodha.com/calculators/sip-calculator/" target="_blank" rel="noreferrer">SIP Calculator</a>
                          </div>
                          <div class="six columns">
                            <p><strong>Ecosystem Partners</strong></p>
                            <a href="https://smallcase.com" target="_blank" rel="noreferrer">smallcase theme investing</a>
                            <a href="https://ditto.com" target="_blank" rel="noreferrer">Ditto insurance advisory</a>
                            <a href="https://tijori.com" target="_blank" rel="noreferrer">Tijori stock insights</a>
                          </div>
                        </div>
                      </div>
                      <div class="five columns education hide-on-small">
                        <p><strong>Quick Links</strong></p>
                        <Link to="/kite">🚀 Active Trading Room (Kite)</Link>
                        <Link to="/console">📊 Backoffice Portfolio (Console)</Link>
                      </div>
                    </div>
                  </div>
                </div>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </nav>
  );
}
