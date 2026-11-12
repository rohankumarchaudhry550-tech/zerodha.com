import React from 'react';
import { Link } from 'react-router-dom';

export default function Products() {
  return (
    <div class="products-page">
      {/* Title Header */}
      <section class="text-center" style={{ paddingTop: '80px', paddingBottom: '40px' }}>
        <div class="container">
          <h1 style={{ fontSize: '38px', color: '#424242' }}>Technology</h1>
          <p style={{ fontSize: '18px', color: '#666' }}>Sleek, modern, and intuitive trading platforms</p>
          <span class="text-grey">Checkout our <Link to="/kite">active trading room</Link> or backoffice portal.</span>
        </div>
      </section>

      {/* Main Ecosystem Showcase */}
      <section style={{ borderTop: '1px solid #eee', paddingTop: '60px', paddingBottom: '60px' }}>
        <div class="container">
          {/* Kite */}
          <div class="row between v-align" style={{ marginBottom: '80px' }}>
            <div class="five columns">
              <h2 style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <img src="/static/images/products/kite-logo.svg" style={{ height: '35px' }} alt="Kite logo" />
                Kite
              </h2>
              <p class="text-grey">
                Our ultra-fast flagship trading platform with streaming market data, advanced charts, an elegant UI, and more. Enjoy a seamless trading experience on your mobile, tablet, or web browser.
              </p>
              <div style={{ display: 'flex', gap: '15px' }}>
                <Link to="/kite" class="button">Go to Kite</Link>
                <a href="https://play.google.com/store/apps/details?id=com.zerodha.kite3" target="_blank" rel="noreferrer" class="button button-outlined">Android App</a>
              </div>
            </div>
            <div class="six columns text-center">
              <img src="/static/images/landing.svg" style={{ maxHeight: '300px' }} alt="Kite Platform Preview" />
            </div>
          </div>

          {/* Console */}
          <div class="row between v-align" style={{ marginBottom: '80px' }}>
            <div class="six columns text-center img-right">
              <img src="/static/images/ecosystem.png" style={{ maxHeight: '300px' }} alt="Console Backoffice Preview" />
            </div>
            <div class="five columns">
              <h2 style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <img src="/static/images/products/console.svg" style={{ height: '35px' }} alt="Console logo" />
                Console
              </h2>
              <p class="text-grey">
                The backoffice platform that gives you a birds-eye view of your investments. Get detailed portfolio analytics, tax-ready P&L statements, tradebooks, ledgers, and add/remove nominees seamlessly.
              </p>
              <div>
                <Link to="/console" class="button">Go to Console</Link>
              </div>
            </div>
          </div>

          {/* Coin */}
          <div class="row between v-align" style={{ marginBottom: '80px' }}>
            <div class="five columns">
              <h2 style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <img src="/static/images/products/coin.svg" style={{ height: '35px' }} alt="Coin logo" />
                Coin
              </h2>
              <p class="text-grey">
                Buy direct mutual funds online with zero commission, delivered straight to your Demat account. Setup daily, weekly, or monthly SIPs and track your goals dynamically in a single unified portfolio.
              </p>
              <div style={{ display: 'flex', gap: '15px' }}>
                <Link to="/coin" class="button">Go to Coin</Link>
              </div>
            </div>
            <div class="six columns text-center">
              <img src="/static/images/index-education.svg" style={{ maxHeight: '300px' }} alt="Coin Platform Preview" />
            </div>
          </div>

          {/* Kite Connect API & Varsity */}
          <div class="row between" style={{ marginBottom: '40px' }}>
            <div class="six columns console-card">
              <h3 style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <img src="/static/images/products/kite-connect.svg" style={{ height: '25px' }} alt="Kite Connect logo" />
                Kite Connect API
              </h3>
              <p class="text-grey" style={{ fontSize: '14px' }}>
                Build custom trading applications, algo scripts, or scan charts using our simple, robust HTTP and WebSocket APIs. Join thousands of independent developers and startups building the future of fintech.
              </p>
              <Link to="/kite-connect" class="button button-outlined">API Sandbox</Link>
            </div>
            <div class="six columns console-card">
              <h3 style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <img src="/static/images/products/varsity.png" style={{ height: '25px' }} alt="Varsity logo" />
                Varsity Education
              </h3>
              <p class="text-grey" style={{ fontSize: '14px' }}>
                Free, open stock market and options trading educational modules. Self-paced learning cards, options theory classes, and dynamic quizzes to test your grasp on the markets with certificate generation!
              </p>
              <Link to="/varsity" class="button button-outlined">Learn Varsity</Link>
            </div>
          </div>
        </div>
      </section>

      {/* Partner Universe Section */}
      <section style={{ background: '#fafafb', padding: '60px 0', borderTop: '1px solid #eee' }}>
        <div class="container text-center">
          <h2 style={{ fontSize: '28px' }}>The Zerodha Universe</h2>
          <p class="text-grey">Extend your trading with our curated partner applications built on Kite APIs</p>
          
          <div class="row between space-top">
            <div class="four columns console-card" style={{ background: '#fff' }}>
              <span style={{ fontSize: '40px' }}>🐂</span>
              <h4 style={{ marginTop: '10px' }}>Sensibull</h4>
              <p class="text-grey text-14">India's leading options trading platform. Build option chains, view real-time Greeks, and deploy strategies directly through Kite.</p>
              <Link to="/sensibull" class="button button-outlined">Open Sensibull</Link>
            </div>
            <div class="four columns console-card" style={{ background: '#fff' }}>
              <span style={{ fontSize: '40px' }}>⚡</span>
              <h4 style={{ marginTop: '10px' }}>Streak</h4>
              <p class="text-grey text-14">No-code algo trading strategy generator. Write chart scanners, run strategy backtests, and deploy virtual or live triggers.</p>
              <Link to="/streak" class="button button-outlined">Open Streak</Link>
            </div>
            <div class="four columns console-card" style={{ background: '#fff' }}>
              <span style={{ fontSize: '40px' }}>💼</span>
              <h4 style={{ marginTop: '10px' }}>smallcase</h4>
              <p class="text-grey text-14">Invest in thematic baskets of stocks or ETFs representing sectors like green energy, infrastructure, or digital growth.</p>
              <a href="https://smallcase.com" target="_blank" rel="noreferrer" class="button button-outlined">Explore Baskets</a>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
