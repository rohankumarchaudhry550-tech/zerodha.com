import React, { useState, useContext } from 'react';
import { AppContext } from '../context/AppContext';
import { Check, ShieldCheck, CreditCard, Landmark, Video, CheckCircle } from 'lucide-react';

export default function Signup() {
  const { kyc, setKyc } = useContext(AppContext);
  const [step, setStep] = useState(kyc.currentStep);
  const [inputs, setInputs] = useState({
    mobile: '',
    email: '',
    otp1: '',
    pan: '',
    name: '',
    aadhaar: '',
    otp2: '',
    bankName: '',
    account: '',
    ifsc: ''
  });

  const handleInput = (e) => {
    setInputs({ ...inputs, [e.target.name]: e.target.value });
  };

  const nextStep = (updatedKyc) => {
    const next = step + 1;
    setStep(next);
    setKyc({ ...kyc, ...updatedKyc, currentStep: next });
  };

  // Step 1: Mobile OTP
  const [otpSent1, setOtpSent1] = useState(false);
  const submitMobile = (e) => {
    e.preventDefault();
    if (!inputs.mobile || !inputs.email) return alert('Please enter both mobile and email.');
    setOtpSent1(true);
  };
  const verifyMobileOtp = (e) => {
    e.preventDefault();
    if (inputs.otp1 === '1234') {
      nextStep({});
    } else {
      alert('Invalid verification code. Please try again.');
    }
  };

  // Step 2: PAN Check
  const verifyPan = (e) => {
    e.preventDefault();
    if (inputs.pan.length !== 10) return alert('PAN card must be 10 alphanumeric characters.');
    if (!inputs.name) return alert('Please enter your full name as on PAN.');
    nextStep({ pan: inputs.pan, panName: inputs.name });
  };

  // Step 3: Aadhaar OTP
  const [otpSent2, setOtpSent2] = useState(false);
  const submitAadhaar = (e) => {
    e.preventDefault();
    if (inputs.aadhaar.length !== 12) return alert('Aadhaar must be a 12 digit number.');
    setOtpSent2(true);
  };
  const verifyAadhaarOtp = (e) => {
    e.preventDefault();
    if (inputs.otp2 === '5678') {
      nextStep({ aadhaar: inputs.aadhaar });
    } else {
      alert('Invalid verification code. Please try again.');
    }
  };

  // Step 4: IPV Video KYC
  const [scanning, setScanning] = useState(false);
  const [snapTaken, setSnapTaken] = useState(false);
  const startIpv = () => {
    setScanning(true);
    setTimeout(() => {
      setScanning(false);
      setSnapTaken(true);
    }, 3000);
  };
  const completeIpv = () => {
    nextStep({ ipvCompleted: true });
  };

  // Step 5: Bank Linking
  const [linking, setLinking] = useState(false);
  const linkBank = (e) => {
    e.preventDefault();
    if (!inputs.bankName || !inputs.account || !inputs.ifsc) return alert('All bank details are required.');
    setLinking(true);
    setTimeout(() => {
      setLinking(false);
      nextStep({ bankLinked: true, bankName: inputs.bankName, bankAccount: inputs.account });
    }, 2000);
  };

  // Step 6: eSign NSDL
  const [esigning, setEsigning] = useState(false);
  const runEsign = () => {
    setEsigning(true);
    setTimeout(() => {
      setEsigning(false);
      nextStep({ eSignCompleted: true, verified: true });
    }, 2500);
  };

  return (
    <div class="signup-page" style={{ minHeight: '80vh', display: 'flex', alignItems: 'center', background: '#fcfcfc', padding: '60px 0' }}>
      <div class="container">
        <div class="mini-container console-card" style={{ maxWidth: '600px', margin: 'auto', background: '#fff', padding: '40px' }}>
          
          {/* Progress Indicators */}
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '40px' }}>
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div key={i} style={{ 
                width: '32px', height: '32px', borderRadius: '50%', 
                background: step > i ? '#4caf50' : step === i ? '#387ed1' : '#eee',
                color: step >= i ? '#fff' : '#888',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontWeight: 'bold', fontSize: '14px'
              }}>
                {step > i ? <Check size={16} /> : i}
              </div>
            ))}
          </div>

          {/* Form Wizards */}
          
          {/* Step 1: Mobile & Email */}
          {step === 1 && (
            <div>
              <h2>Create your account</h2>
              <p class="text-grey">Verify your mobile and email to start your Demat account creation.</p>
              <hr />
              {!otpSent1 ? (
                <form onSubmit={submitMobile}>
                  <div style={{ marginBottom: '15px' }}>
                    <label>Mobile Number (10 digits)</label>
                    <input type="tel" name="mobile" value={inputs.mobile} onChange={handleInput} placeholder="Enter mobile number" required />
                  </div>
                  <div style={{ marginBottom: '20px' }}>
                    <label>Email Address</label>
                    <input type="email" name="email" value={inputs.email} onChange={handleInput} placeholder="Enter email address" required />
                  </div>
                  <button type="submit" style={{ width: '100%' }}>Send Verification OTP</button>
                </form>
              ) : (
                <form onSubmit={verifyMobileOtp}>
                  <div class="notice" style={{ marginBottom: '20px' }}>
                    <p>A verification OTP code has been sent to your mobile and email.</p>
                  </div>
                  <div style={{ marginBottom: '20px' }}>
                    <label>Verification OTP Code</label>
                    <input type="text" name="otp1" value={inputs.otp1} onChange={handleInput} placeholder="Enter 4 digit OTP" required maxLength={4} />
                  </div>
                  <div style={{ display: 'flex', gap: '15px' }}>
                    <button type="button" class="button-outlined" onClick={() => setOtpSent1(false)} style={{ flex: 1 }}>Back</button>
                    <button type="submit" style={{ flex: 2 }}>Verify &amp; Continue</button>
                  </div>
                </form>
              )}
            </div>
          )}

          {/* Step 2: PAN Check */}
          {step === 2 && (
            <form onSubmit={verifyPan}>
              <h2>PAN Verification</h2>
              <p class="text-grey">Validate your permanent account number under IT department records.</p>
              <hr />
              <div style={{ marginBottom: '15px' }}>
                <label>PAN Card Number</label>
                <input type="text" name="pan" value={inputs.pan} onChange={handleInput} placeholder="ABCDE1234F" style={{ textTransform: 'uppercase' }} required />
              </div>
              <div style={{ marginBottom: '20px' }}>
                <label>Full Name (as printed on PAN card)</label>
                <input type="text" name="name" value={inputs.name} onChange={handleInput} placeholder="Enter full name" required />
              </div>
              <button type="submit" style={{ width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}>
                <CreditCard size={18} /> Verify PAN Details
              </button>
            </form>
          )}

          {/* Step 3: Aadhaar KYC */}
          {step === 3 && (
            <div>
              <h2>Digilocker Aadhaar e-KYC</h2>
              <p class="text-grey">Sign in to your Digilocker profile and share your Aadhaar metadata records securely.</p>
              <hr />
              {!otpSent2 ? (
                <form onSubmit={submitAadhaar}>
                  <div style={{ marginBottom: '20px' }}>
                    <label>Aadhaar Number (12 digits)</label>
                    <input type="text" name="aadhaar" value={inputs.aadhaar} onChange={handleInput} placeholder="1234 5678 9012" maxLength={12} required />
                  </div>
                  <button type="submit" style={{ width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}>
                    <ShieldCheck size={18} /> Authenticate Aadhaar
                  </button>
                </form>
              ) : (
                <form onSubmit={verifyAadhaarOtp}>
                  <div class="notice" style={{ marginBottom: '20px' }}>
                    <p>Digilocker secure connection established. Please enter the verification code sent to your UIDAI registered mobile number.</p>
                  </div>
                  <div style={{ marginBottom: '20px' }}>
                    <label>Aadhaar OTP Code</label>
                    <input type="text" name="otp2" value={inputs.otp2} onChange={handleInput} placeholder="Enter OTP" maxLength={4} required />
                  </div>
                  <div style={{ display: 'flex', gap: '15px' }}>
                    <button type="button" class="button-outlined" onClick={() => setOtpSent2(false)} style={{ flex: 1 }}>Back</button>
                    <button type="submit" style={{ flex: 2 }}>Verify Digilocker</button>
                  </div>
                </form>
              )}
            </div>
          )}

          {/* Step 4: IPV Video KYC */}
          {step === 4 && (
            <div class="text-center">
              <h2>In-Person Verification (IPV)</h2>
              <p class="text-grey">SEBI compliance requires a quick live camera verification to prove identity.</p>
              <hr />

              <div class="camera-mock">
                {scanning && <div class="scan-line"></div>}
                {snapTaken ? (
                  <div style={{ padding: '20px' }}>
                    <CheckCircle size={48} color="#4caf50" style={{ margin: 'auto' }} />
                    <p style={{ marginTop: '10px' }}>Verification Snapshot Recorded!</p>
                  </div>
                ) : (
                  <div>
                    <Video size={48} style={{ margin: 'auto', opacity: 0.6, marginBottom: '10px' }} />
                    {scanning ? <p>Webcam Active - Scanning...</p> : <p>Hold up code <strong>74</strong> clearly</p>}
                  </div>
                )}
              </div>

              {!snapTaken ? (
                <button type="button" onClick={startIpv} disabled={scanning} style={{ width: '100%' }}>
                  {scanning ? 'Analyzing Face & Code...' : 'Start Camera Snapshot'}
                </button>
              ) : (
                <button type="button" onClick={completeIpv} style={{ width: '100%', backgroundColor: '#4caf50' }}>
                  Proceed to Bank Link
                </button>
              )}
            </div>
          )}

          {/* Step 5: Bank account link */}
          {step === 5 && (
            <form onSubmit={linkBank}>
              <h2>Link Bank Account</h2>
              <p class="text-grey">Link your bank details. We will deposit ₹1 to verify active status.</p>
              <hr />
              <div style={{ marginBottom: '15px' }}>
                <label>Bank Name</label>
                <input type="text" name="bankName" value={inputs.bankName} onChange={handleInput} placeholder="State Bank of India / HDFC" required />
              </div>
              <div style={{ marginBottom: '15px' }}>
                <label>Account Number</label>
                <input type="text" name="account" value={inputs.account} onChange={handleInput} placeholder="1234567890" required />
              </div>
              <div style={{ marginBottom: '20px' }}>
                <label>IFSC Code</label>
                <input type="text" name="ifsc" value={inputs.ifsc} onChange={handleInput} placeholder="SBIN0001234" style={{ textTransform: 'uppercase' }} required />
              </div>

              <button type="submit" disabled={linking} style={{ width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}>
                <Landmark size={18} /> {linking ? 'Verifying with Penny Drop...' : 'Link Bank & Deposit verification ₹1'}
              </button>
            </form>
          )}

          {/* Step 6: eSign NSDL */}
          {step === 6 && (
            <div class="text-center">
              <h2>Digitally e-Sign Application</h2>
              <p class="text-grey">Final step: Electronically sign your SEBI demat registration application.</p>
              <hr />
              
              <div class="notice" style={{ textAlign: 'left', marginBottom: '30px' }}>
                <p><strong>Demat Registration Form</strong></p>
                <ul style={{ paddingLeft: '20px', fontSize: '13px', margin: '5px 0' }}>
                  <li>Demat Client ID: CDSL-MOCK-11200</li>
                  <li>Linked Brokerage Plan: Zerodha Flat 20</li>
                  <li>Linked Bank: {kyc.bankName} (XXXX-{kyc.bankAccount.slice(-4)})</li>
                </ul>
              </div>

              <button type="button" onClick={runEsign} disabled={esigning} style={{ width: '100%' }}>
                {esigning ? 'Opening NSDL Gateway...' : 'Sign Application with Aadhaar Card'}
              </button>
            </div>
          )}

          {/* Step 7: Completed! */}
          {step === 7 && (
            <div class="text-center">
              <CheckCircle size={64} color="#4caf50" style={{ margin: 'auto', marginBottom: '20px' }} />
              <h2>KYC Verified Successfully!</h2>
              <p class="text-grey">Congratulations! Your Demat account has been opened instantly.</p>
              <div class="notice" style={{ margin: '20px 0', textAlign: 'left' }}>
                <p><strong>Account Profile Summary:</strong></p>
                <table style={{ border: 'none', margin: 0, width: '100%' }}>
                  <tbody>
                    <tr><td style={{ padding: '4px', border: 'none' }}>Name:</td><td style={{ padding: '4px', border: 'none', textAlign: 'right' }}><strong>{kyc.panName}</strong></td></tr>
                    <tr><td style={{ padding: '4px', border: 'none' }}>PAN ID:</td><td style={{ padding: '4px', border: 'none', textAlign: 'right' }}>{kyc.pan.toUpperCase()}</td></tr>
                    <tr><td style={{ padding: '4px', border: 'none' }}>Margin Available:</td><td style={{ padding: '4px', border: 'none', textAlign: 'right', color: '#4caf50' }}><strong>₹1,24,500.75</strong></td></tr>
                  </tbody>
                </table>
              </div>
              <p class="text-grey">You can now access your trading console or inspect the stock watchlists.</p>
              <div style={{ display: 'flex', gap: '15px', marginTop: '25px' }}>
                <a href="/kite" class="button" style={{ flex: 1 }}>Go to Kite Trading</a>
                <a href="/console" class="button button-outlined" style={{ flex: 1 }}>Go to Console Portfolio</a>
              </div>
            </div>
          )}

        </div>
      </div>
    </div>
  );
}
