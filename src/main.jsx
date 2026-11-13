import React, { useContext } from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter, Routes, Route, useLocation, Navigate } from 'react-router-dom';
import { AppProvider, AppContext } from './context/AppContext';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Home from './pages/Home';
import Products from './pages/Products';
import Pricing from './pages/Pricing';
import Signup from './pages/Signup';
import Support from './pages/Support';
import About from './pages/About';
import Kite from './pages/Kite';
import Console from './pages/Console';
import Coin from './pages/Coin';
import Varsity from './pages/Varsity';
import KiteConnect from './pages/KiteConnect';
import Sensibull from './pages/Sensibull';
import Streak from './pages/Streak';
import Admin from './pages/Admin';
import Login from './pages/Login';
import './index.css';

function ProtectedRoute({ children }) {
  const { isAuthenticated } = useContext(AppContext);
  return isAuthenticated ? children : <Navigate to="/login" replace />;
}

function ExternalRedirect({ to }) {
  React.useEffect(() => {
    window.location.href = to;
  }, [to]);
  return (
    <div style={{ textAlign: 'center', padding: '120px 20px', fontFamily: '"Inter", sans-serif' }}>
      <p style={{ fontSize: '18px', color: '#555', marginBottom: '15px' }}>Redirecting to official Zerodha page...</p>
      <a href={to} style={{ color: '#387ed1', fontSize: '15px', textDecoration: 'underline' }}>Click here if you are not redirected automatically</a>
    </div>
  );
}

function AppLayout() {
  const location = useLocation();
  // Hide main marketing Navbar/Footer inside the fullscreen Kite trading terminal and the Login page to look clean!
  const isKiteTerminal = location.pathname.startsWith('/kite');
  const isLoginPage = location.pathname === '/login';
  const hideHeaderFooter = isKiteTerminal || isLoginPage;

  return (
    <>
      {!hideHeaderFooter && <Navbar />}
      <div className={!hideHeaderFooter ? 'marketing-content' : ''} style={{ minHeight: hideHeaderFooter ? '100vh' : 'calc(100vh - 65px)' }}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/products" element={<ExternalRedirect to="https://zerodha.com/products/" />} />
          <Route path="/pricing" element={<ExternalRedirect to="https://zerodha.com/pricing/" />} />
          <Route path="/about" element={<ExternalRedirect to="https://zerodha.com/about/" />} />
          <Route path="/signup" element={<ExternalRedirect to="https://zerodha.com/open-account/" />} />
          <Route path="/support" element={<ExternalRedirect to="https://support.zerodha.com/" />} />
          <Route path="/login" element={<Login />} />
          
          {/* Protected Trading Platforms */}
          <Route path="/kite" element={<ProtectedRoute><Kite /></ProtectedRoute>} />
          <Route path="/console" element={<ProtectedRoute><Console /></ProtectedRoute>} />
          <Route path="/coin" element={<ProtectedRoute><Coin /></ProtectedRoute>} />
          <Route path="/varsity" element={<ExternalRedirect to="https://zerodha.com/varsity/" />} />
          <Route path="/kite-connect" element={<ExternalRedirect to="https://kite.trade/" />} />
          <Route path="/sensibull" element={<ExternalRedirect to="https://sensibull.com/" />} />
          <Route path="/streak" element={<ProtectedRoute><Streak /></ProtectedRoute>} />
          <Route path="/admin" element={<ProtectedRoute><Admin /></ProtectedRoute>} />
        </Routes>
      </div>
      {!hideHeaderFooter && <Footer />}
    </>
  );
}

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <AppProvider>
      <BrowserRouter>
        <AppLayout />
      </BrowserRouter>
    </AppProvider>
  </React.StrictMode>
);
