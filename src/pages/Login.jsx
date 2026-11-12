import React, { useState, useContext, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { AppContext } from '../context/AppContext';
import { ShieldCheck, User, ArrowLeft, Key } from 'lucide-react';

export default function Login() {
  const { validateCredentials, verifyOtpAndLogin, isAuthenticated } = useContext(AppContext);
  
  // Login stages: 1 = Credentials, 2 = 2FA OTP
  const [step, setStep] = useState(1);
  
  // Inputs
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [otp, setOtp] = useState('');
  
  const [error, setError] = useState('');
  const navigate = useNavigate();

  // If already logged in, redirect immediately to trading room
  useEffect(() => {
    if (isAuthenticated) {
      navigate('/kite');
    }
  }, [isAuthenticated, navigate]);

  const handleSubmitCredentials = (e) => {
    e.preventDefault();
    setError('');
    const isValid = validateCredentials(email, password);
    if (isValid) {
      setStep(2); // Go to 2FA OTP verification
    } else {
      setError('Invalid email/user ID or password.');
    }
  };

  const handleSubmitOtp = (e) => {
    e.preventDefault();
    setError('');
    const loggedIn = verifyOtpAndLogin(otp);
    if (loggedIn) {
      navigate('/kite');
    } else {
      setError('Invalid 2FA OTP or PIN. Please try again.');
    }
  };

  return (
    <div style={{ background: '#fbfbfb', minHeight: '100vh', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', padding: '50px 0', boxSizing: 'border-box', fontFamily: '"Inter", sans-serif' }}>
      
      {/* Centered Login Card Container */}
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', flex: 1 }}>
        <div style={{ 
          maxWidth: '380px', width: '100%', padding: '40px', background: '#fff', 
          textAlign: 'center', border: '1px solid #e0e0e0', borderRadius: '3px',
          boxShadow: '0 8px 30px rgba(0,0,0,0.04)', boxSizing: 'border-box'
        }}>
          
          {/* Brand Logo - Stylized Kite Orange Diamond */}
          <div style={{ marginBottom: '30px' }}>
            <Link to="/" style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', marginBottom: '12px', textDecoration: 'none' }} title="Back to Zerodha Home">
              <svg width="44" height="44" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M50 0L100 50L50 100L0 50L50 0Z" fill="#ff5722" />
                <path d="M50 25L75 50L50 75L25 50L50 25Z" fill="#fff" />
                <circle cx="50" cy="50" r="12" fill="#ff5722" />
              </svg>
            </Link>
            <h3 style={{ margin: '5px 0 0 0', fontSize: '20px', fontWeight: '500', color: '#444' }}>
              {step === 1 ? 'Login to Kite' : 'Two-factor authentication'}
            </h3>
          </div>

          {error && (
            <div style={{ 
              background: '#ffebee', border: '1px solid #ffcdd2', padding: '10px 12px',
              borderRadius: '3px', marginBottom: '20px', textAlign: 'left' 
            }}>
              <p style={{ color: '#c62828', margin: 0, fontSize: '12px', fontWeight: '500' }}>{error}</p>
            </div>
          )}

          {/* STEP 1: CREDENTIALS PAGE */}
          {step === 1 && (
            <form onSubmit={handleSubmitCredentials} style={{ textAlign: 'left' }} autoComplete="off">
              <div style={{ marginBottom: '18px' }}>
                <label style={{ fontSize: '11px', color: '#888', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Email ID / Client ID</label>
                <input 
                  type="text" 
                  name="zerodha_client_identity"
                  autoComplete="off"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="User ID or email" 
                  required 
                  style={{ 
                    height: '38px', marginTop: '6px', fontSize: '13px', width: '100%', 
                    boxSizing: 'border-box', border: '1px solid #ccc', borderRadius: '3px', padding: '0 12px',
                    outline: 'none', transition: 'border-color 0.15s'
                  }}
                  onFocus={(e) => e.target.style.borderColor = '#ff5722'}
                  onBlur={(e) => e.target.style.borderColor = '#ccc'}
                />
              </div>
              
              <div style={{ marginBottom: '22px' }}>
                <label style={{ fontSize: '11px', color: '#888', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Password</label>
                <input 
                  type="password" 
                  name="zerodha_user_credential"
                  autoComplete="new-password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Password" 
                  required 
                  style={{ 
                    height: '38px', marginTop: '6px', fontSize: '13px', width: '100%', 
                    boxSizing: 'border-box', border: '1px solid #ccc', borderRadius: '3px', padding: '0 12px',
                    outline: 'none', transition: 'border-color 0.15s'
                  }}
                  onFocus={(e) => e.target.style.borderColor = '#ff5722'}
                  onBlur={(e) => e.target.style.borderColor = '#ccc'}
                />
              </div>

              <button 
                type="submit" 
                className="btn-login"
                style={{ 
                  width: '100%', height: '40px', fontSize: '14px', fontWeight: '600', 
                  backgroundColor: '#ff5722', color: '#fff', border: 'none', borderRadius: '3px',
                  cursor: 'pointer', transition: 'background-color 0.15s'
                }}
              >
                Login
              </button>
            </form>
          )}

          {/* STEP 2: 2FA OTP PAGE */}
          {step === 2 && (
            <form onSubmit={handleSubmitOtp} style={{ textAlign: 'left' }} autoComplete="off">
              <p style={{ margin: '0 0 15px 0', fontSize: '12px', color: '#666', lineHeight: '1.5', textAlign: 'center' }}>
                Enter the mobile OTP or TOTP App PIN to continue verification check.
              </p>
              
              <div style={{ marginBottom: '20px', textAlign: 'center' }}>
                <label style={{ fontSize: '11px', color: '#888', textTransform: 'uppercase', letterSpacing: '0.5px', display: 'block', marginBottom: '8px' }}>
                  Mobile OTP / TOTP
                </label>
                <div style={{ display: 'flex', justifyContent: 'center', gap: '8px' }}>
                  <input 
                    type="text" 
                    name="zerodha_totp_val"
                    autoComplete="one-time-code"
                    value={otp}
                    onChange={(e) => setOtp(e.target.value)}
                    placeholder="Enter OTP" 
                    required 
                    maxLength={6}
                    autoFocus
                    style={{ 
                      height: '42px', fontSize: '16px', width: '160px', textAlign: 'center',
                      fontWeight: '700', boxSizing: 'border-box', border: '1px solid #ccc', borderRadius: '3px',
                      outline: 'none', transition: 'border-color 0.15s', letterSpacing: '2px'
                    }}
                    onFocus={(e) => e.target.style.borderColor = '#ff5722'}
                    onBlur={(e) => e.target.style.borderColor = '#ccc'}
                  />
                </div>
              </div>

              <button 
                type="submit" 
                className="btn-login"
                style={{ 
                  width: '100%', height: '40px', fontSize: '14px', fontWeight: '600', 
                  backgroundColor: '#ff5722', color: '#fff', border: 'none', borderRadius: '3px',
                  cursor: 'pointer', transition: 'background-color 0.15s'
                }}
              >
                Continue to Trading Desk
              </button>

              <div style={{ textAlign: 'center', marginTop: '15px' }}>
                <div 
                  className="login-back-link" 
                  onClick={() => { setStep(1); setError(''); }}
                >
                  <ArrowLeft size={13} /> Back to credentials
                </div>
              </div>
            </form>
          )}

          {/* Marketing link footer inside card */}
          <div style={{ marginTop: '30px', fontSize: '12px', borderTop: '1px solid #eee', paddingTop: '20px' }}>
            <span style={{ color: '#999' }}>Don't have an account? </span>
            <Link to="/signup" style={{ color: '#387ed1', textDecoration: 'none', fontWeight: '500' }}>Signup</Link>
          </div>
        </div>
      </div>

      {/* Corporate footer info */}
      <div style={{ textAlign: 'center', color: '#aaa', fontSize: '11px' }}>
        <span>Zerodha Broking Ltd. • Kite Version 3.0.2fa</span>
        <div style={{ marginTop: '5px', display: 'flex', justifyContent: 'center', gap: '15px' }}>
          <a href="#rules" onClick={(e) => { e.preventDefault(); alert('Brokerage rules and guidelines page active.'); }} style={{ color: '#aaa', textDecoration: 'none' }}>Rules</a>
          <span>•</span>
          <a href="#privacy" onClick={(e) => { e.preventDefault(); alert('Privacy policy statement.'); }} style={{ color: '#aaa', textDecoration: 'none' }}>Privacy Policy</a>
        </div>
      </div>
    </div>
  );
}
