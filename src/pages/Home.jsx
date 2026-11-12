import React from 'react';
import { Link } from 'react-router-dom';

export default function Home() {
  return (
    <div class="homepage">
      {/* Invest in everything */}
      <section class="text-center landing">
        <div class="container">
          <img class="landing-image" src="/static/images/landing.svg" alt="Online stock brokerage platform for trading and investing in stocks, futures, options, commodities, currency, ETFs, mutual funds, and bonds." />
          <h1 class="landing-heading text-center" style={{ fontSize: '44px', fontWeight: '500', color: '#424242' }}>Invest in everything</h1>
          <p class="landing-subheading text-center" style={{ fontSize: '20px', color: '#666' }}>
            Online platform to invest in stocks, derivatives, mutual funds, ETFs, bonds, and more.
          </p>
          <Link to="/signup" class="button" id="acop_link" style={{ fontSize: '20px', padding: '12px 40px', marginTop: '20px' }}>Sign up for free</Link>
        </div>
      </section>

      {/* Trust with confidence */}
      <section class="ecosystem">
        <div class="container">
          <div class="row between middle">
            <div class="five columns">
              <h2 style={{ fontSize: '32px' }}>Trust with confidence</h2>
              
              <div class="why-us-section">
                <h3>Customer-first always</h3>
                <p>
                  That's why <span class="client-count">1.6+ crore</span> customers trust Zerodha with <span class="aum-value">~ ₹6 lakh crores</span> of equity investments, making us India’s largest broker; contributing to 15% of daily retail exchange volumes in India.
                </p>
              </div>
              <div class="why-us-section">
                <h3>No spam or gimmicks</h3>
                <p>
                  No gimmicks, spam, "gamification", or annoying push notifications. High quality apps that you use at your pace, the way you like. <a href="https://zerodha.com/about/philosophy" target="_blank" rel="noreferrer">Our philosophies.</a>
                </p>
              </div>
              <div class="why-us-section">
                <h3>The Zerodha universe</h3>
                <p>
                  Not just an app, but a whole ecosystem. Our investments in 30+ fintech startups offer you tailored services specific to your needs.
                </p>
              </div>
              <div class="why-us-section">
                <h3>Do better with money</h3>
                <p>
                  With initiatives like <a href="https://support.zerodha.com/category/trading-and-markets/kite-features/nudges/articles/what-is-nudge" target="_blank" rel="noreferrer">Nudge</a> and <a href="https://support.zerodha.com/category/console/profile/killswitch/articles/what-is-the-kill-switch" target="_blank" rel="noreferrer">Kill Switch</a>, we don't just facilitate transactions, but actively help you do better with your money.
                </p>
              </div>
            </div>
            <div class="seven columns text-center">
              <Link to="/products">
                <img src="/static/images/ecosystem.png" alt="The Zerodha Universe" class="ecosystem-image" />
              </Link>
              <p class="text-center space-top">
                <Link to="/products">Explore our products <i class="icon-arrow-right"></i></Link>
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Kite Connect banner */}
      <section class="kc-banner-homepage">
        <div class="kc-banner-container container">
          <img src="/static/images/kc-logo-landing.svg" alt="Kite Connect logo" />
          <span class="text-grey" style={{ fontSize: '15px' }}>
            Need more? Build your own trading and investing experience with Kite Connect, simple HTTP APIs to place orders, stream market data, manage your account, and more. 
            <Link to="/kite-connect">Explore <span class="icon icon-arrow-right"></span></Link>
          </span>
          <img class="kc-banner-image hide-on-mobile" src="/static/images/kc-banner-image.svg" alt="Kite Connect banner image" />
        </div>
      </section>

      {/* Unbeatable pricing */}
      <section class="pricing">
        <div class="container">
          <div class="row v-align around">
            <div class="columns five">
              <h2 style={{ fontSize: '32px' }}>Unbeatable pricing</h2>
              <p>
                We pioneered the concept of discount broking and price transparency in India. Flat fees and no hidden charges.
              </p>
            </div>
            <div class="columns seven">
              <div class="pricing-box">
                <img src="/static/images/pricing-eq.svg" alt="Free account opening icon" />
                <p>Free account<br />opening</p>
              </div>
              <div class="pricing-box">
                <img src="/static/images/pricing-eq.svg" alt="Free equity delivery icon" />
                <p>Free equity delivery<br />and direct mutual funds</p>
              </div>
              <div class="pricing-box">
                <img src="/static/images/other-trades.svg" alt="Intraday and F&O icon" />
                <p>Intraday and<br />F&amp;O</p>
              </div>
            </div>
          </div>
          <p class="pricing-link">
            <Link to="/pricing">See pricing <i class="icon-arrow-right"></i></Link>
          </p>
        </div>
      </section>

      {/* Free and open market education */}
      <section style={{ paddingBottom: '100px' }}>
        <div class="container">
          <div class="row between v-align">
            <div class="columns five text-center">
              <Link to="/varsity">
                <img class="img-margin" src="/static/images/index-education.svg" alt="Market Education Illustration" />
              </Link>
            </div>
            <div class="columns six">
              <h2 style={{ fontSize: '32px' }}>Free and open market education</h2>
              <p>
                Varsity, the largest online stock market education book in the world covering everything from the basics to advanced trading.
              </p>
              <Link to="/varsity">Varsity <i class="icon-arrow-right"></i></Link>
              <p class="space-top">
                TradingQ&amp;A, the most active trading and investment community in India for all your market related queries.
              </p>
              <a href="https://tradingqna.com" target="_blank" rel="noreferrer">TradingQ&amp;A <i class="icon-arrow-right"></i></a>
            </div>
          </div>
        </div>
      </section>

      {/* Open Account CTA */}
      <section class="kite-sections text-center kitefooter-container" style={{ padding: '60px 0', borderTop: '1px solid #eee' }}>
        <div class="mini-container">
          <h2 style={{ fontSize: '32px' }}>Open a Zerodha account</h2>
          <p class="text-grey text-med">
            Modern platforms and apps, ₹0 investments, and flat ₹20 intraday and F&amp;O trades.
          </p>
          <Link to="/signup" class="button" style={{ fontSize: '18px', padding: '10px 30px' }}>Sign up for free</Link>
        </div>
      </section>
    </div>
  );
}
