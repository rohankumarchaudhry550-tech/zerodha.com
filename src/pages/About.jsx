import React from 'react';
import { Link } from 'react-router-dom';

export default function About() {
  const team = [
    {
      name: 'Nithin Kamath',
      role: 'Founder, CEO',
      desc: 'Nithin bootstrapped and founded Zerodha in 2010 to overcome the barriers he faced during a decade as an active trader. He is a member of the SEBI Secondary Market Advisory Committee (SMAC).',
      avatar: '👨‍💼'
    },
    {
      name: 'Nikhil Kamath',
      role: 'Co-founder, CFO',
      desc: 'Nikhil is an astute investor and manages the financial risk controls and proprietary funding allocations at Zerodha. He also runs True Beacon, an asset management fund.',
      avatar: '📊'
    },
    {
      name: 'Dr. Kailash Nadh',
      role: 'CTO',
      desc: 'Kailash has a PhD in Artificial Intelligence and Computational Linguistics. He joined Zerodha in 2013 and has been heading all technology, open-source projects, and engineering initiatives.',
      avatar: '💻'
    },
    {
      name: 'Venu Madhav',
      role: 'COO',
      desc: 'Venu manages the core backend operations, regulatory compliance audits, exchange integrations, and depository settlements clearing systems at Zerodha.',
      avatar: '⚙️'
    },
    {
      name: 'Seema Patil',
      role: 'Director',
      desc: 'Seema oversees operations audits, quality control checks, and HR policies at Zerodha. She acts as one of the key advisors on compliance compliance checks.',
      avatar: '👩‍💼'
    }
  ];

  return (
    <div className="about-page">
      {/* Intro Header */}
      <section className="text-center" style={{ paddingTop: '80px', paddingBottom: '60px', borderBottom: '1px solid #eee' }}>
        <div className="container">
          <h2 style={{ fontSize: '34px', color: '#424242', fontWeight: '500', lineHeight: '1.4', margin: '0 0 10px 0' }}>
            We pioneered the discount broking model in India.
          </h2>
          <h2 style={{ fontSize: '34px', color: '#424242', fontWeight: '500', lineHeight: '1.4', margin: 0 }}>
            Today, we are the largest retail stock broker in India.
          </h2>
        </div>
      </section>

      {/* Story Grid */}
      <section style={{ padding: '60px 0' }}>
        <div className="container">
          <div className="row between text-grey text-med" style={{ fontSize: '15px', lineHeight: '1.7' }}>
            <div className="six columns">
              <p style={{ marginBottom: '20px' }}>
                We bootstrapped and founded Zerodha in 2010 to solve the core broker problems traders face in India. The name Zerodha is a combination of Zero and "Rodha", the Sanskrit word for barrier.
              </p>
              <p style={{ marginBottom: '20px' }}>
                Today, our disruptive pricing models and in-house technology have made us the largest retail stock broker in India. Over 1.6+ Crore clients place millions of orders daily through our proprietary trading platforms, contributing to over 15% of all retail volumes in India.
              </p>
              <p>
                In addition, we run <a href="https://rainmatter.com" target="_blank" rel="noreferrer">Rainmatter</a>, our fintech fund and incubator, which has invested in several fintech startups and green projects.
              </p>
            </div>
            
            <div className="six columns">
              <p style={{ marginBottom: '20px' }}>
                We pioneered the flat discount broking fee model in India. All equity delivery investments, direct mutual funds, and IPO transactions are free of any brokerage, while intraday and currency orders are capped at a flat ₹20 fee.
              </p>
              <p style={{ marginBottom: '20px' }}>
                High-quality software tools like Kite (trading terminal), Console (backoffice ledger), and Coin (mutual funds app) are developed entirely in-house by our engineering team to ensure zero friction.
              </p>
              <p>
                We do not spam, place annoying advertisements, or gamify financial trading. We actively nudge users to prevent bad trading habits through compliance checks like Kill Switch.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Executive Leadership Team Grid */}
      <section style={{ background: '#fafafb', padding: '60px 0', borderTop: '1px solid #eee', borderBottom: '1px solid #eee' }}>
        <div className="container text-center">
          <h2 style={{ marginBottom: '45px', fontWeight: '500' }}>People</h2>
          
          {/* Executive grid */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '40px', justifyContent: 'center', marginTop: '20px' }}>
            {team.map(member => (
              <div 
                key={member.name}
                className="console-card"
                style={{ background: '#fff', padding: '30px', textAlign: 'center', border: '1px solid #eee', display: 'flex', flexDirection: 'column', alignItems: 'center' }}
              >
                <div style={{ fontSize: '48px', marginBottom: '15px', background: '#f5f5f6', width: '90px', height: '90px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  {member.avatar}
                </div>
                <h4 style={{ margin: '0 0 4px 0', fontSize: '16px', fontWeight: '600', color: '#424242' }}>{member.name}</h4>
                <span style={{ fontSize: '12px', color: '#9b9b9b', fontWeight: '500', textTransform: 'uppercase', letterSpacing: '0.5px' }}>{member.role}</span>
                <p style={{ margin: '15px 0 0 0', fontSize: '13px', color: '#666', lineHeight: '1.6', textAlign: 'left' }}>{member.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Join Team CTA */}
      <section className="text-center" style={{ padding: '60px 0' }}>
        <div className="mini-container">
          <h2 style={{ fontSize: '30px', fontWeight: '500', color: '#424242' }}>Work with us</h2>
          <p className="text-grey" style={{ fontSize: '15px', maxWidth: '500px', margin: '10px auto 25px auto' }}>
            We are always looking for passionate engineers, customer relationship officers, and financial specialists to help build the future of investing.
          </p>
          <a href="https://careers.zerodha.com" target="_blank" rel="noreferrer" className="button button-outlined" style={{ fontSize: '14px', padding: '8px 24px' }}>
            See active openings
          </a>
        </div>
      </section>
    </div>
  );
}
