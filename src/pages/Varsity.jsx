import React, { useState, useContext } from 'react';
import { AppContext } from '../context/AppContext';
import { BookOpen, Award, CheckCircle, HelpCircle, GraduationCap } from 'lucide-react';

const courses = [
  { id: 'intro', title: 'Introduction to Stock Markets', desc: 'Learn the absolute basics of stock markets, stock brokers, stock exchanges, indices, and trading types.', chapters: 12 },
  { id: 'tech', title: 'Technical Analysis', desc: 'Master charts, candlestick patterns, support & resistance levels, volumes, and technical indicator metrics.', chapters: 20 },
  { id: 'opts', title: 'Options Trading', desc: 'Dive deep into options theory: Calls/Puts, strike prices, option Greeks (Delta/Theta/Vega), and strategies.', chapters: 15 }
];

export default function Varsity() {
  const { kyc } = useContext(AppContext);
  const [selectedCourse, setSelectedCourse] = useState(null);
  
  // Quiz State
  const [showQuiz, setShowQuiz] = useState(false);
  const [answers, setAnswers] = useState({ q1: '', q2: '', q3: '' });
  const [quizSubmitted, setQuizSubmitted] = useState(false);
  const [score, setScore] = useState(0);
  const [userName, setUserName] = useState(kyc.panName || 'Financial Scholar');

  const handleQuizSubmit = (e) => {
    e.preventDefault();
    let computedScore = 0;
    if (answers.q1 === '0.5') computedScore += 1;
    if (answers.q2 === 'right_sell') computedScore += 1;
    if (answers.q3 === 'time') computedScore += 1;

    setScore(computedScore);
    setQuizSubmitted(true);
  };

  const resetQuiz = () => {
    setAnswers({ q1: '', q2: '', q3: '' });
    setQuizSubmitted(false);
    setScore(0);
    setShowQuiz(false);
  };

  return (
    <div class="varsity-page" style={{ background: '#fbfbfb', minHeight: '80vh', padding: '60px 0' }}>
      <div class="container">
        
        {/* Header Title */}
        <div className="console-card" style={{ background: '#fff', marginBottom: '30px' }}>
          <div className="row between v-align">
            <div>
              <span style={{ fontSize: '12px', textTransform: 'uppercase', color: '#888', letterSpacing: '1px' }}>Varsity Education</span>
              <h2 style={{ margin: '5px 0 0 0' }}>Free &amp; Open Financial Education</h2>
            </div>
            <div>
              <button className="button" onClick={() => setShowQuiz(true)} style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <GraduationCap size={18} /> Take Certification Quiz
              </button>
            </div>
          </div>
        </div>

        {/* Course Cards */}
        <div class="row between">
          <div class="eight columns">
            <div class="console-card" style={{ background: '#fff' }}>
              <h3 style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <BookOpen size={20} color="#387ed1" /> Learning Modules
              </h3>
              <p class="text-grey" style={{ fontSize: '13px' }}>Explore comprehensive financial courses organized in easy-to-read chapters.</p>
              <hr />

              <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                {courses.map((course) => (
                  <div 
                    key={course.id} 
                    class="console-card" 
                    style={{ border: '1px solid #eee', background: '#fafafa', margin: 0, padding: '20px', cursor: 'pointer' }}
                    onClick={() => setSelectedCourse(course)}
                  >
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <div>
                        <h4 style={{ margin: 0 }}>{course.title}</h4>
                        <p class="text-grey" style={{ fontSize: '13px', margin: '5px 0 0 0' }}>{course.desc}</p>
                      </div>
                      <span style={{ fontSize: '12px', background: '#eee', padding: '4px 10px', borderRadius: '10px', whiteSpace: 'nowrap' }}>
                        {course.chapters} Chapters
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div class="three columns console-card" style={{ background: '#fff' }}>
            <h3>Learning Cards</h3>
            <p class="text-grey" style={{ fontSize: '13px' }}>Quick bits of financial wisdom to learn on the go.</p>
            <hr />
            <div style={{ background: '#f5f9ff', padding: '15px', borderRadius: '4px', border: '1px solid #d2e4ff', fontSize: '13px' }}>
              <strong>Did you know?</strong>
              <p style={{ marginTop: '8px', marginBottom: 0, color: '#444' }}>
                Direct mutual funds bypass agents entirely. By investing in direct mutual funds rather than regular ones, you save on commission costs which compounds to massive sums over 20 years!
              </p>
            </div>
          </div>
        </div>

        {/* Selected Course Chapters Modal */}
        {selectedCourse && (
          <div style={{
            position: 'fixed', top: 0, left: 0, width: '100%', height: '100vh',
            background: 'rgba(0,0,0,0.4)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 9999
          }}>
            <div class="console-card" style={{ background: '#fff', maxWidth: '550px', width: '100%', margin: '20px', padding: '30px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '15px' }}>
                <h3 style={{ margin: 0 }}>{selectedCourse.title}</h3>
                <button type="button" class="close" onClick={() => setSelectedCourse(null)} style={{ border: 'none', background: 'none', fontSize: '24px' }}>×</button>
              </div>
              <hr />
              <div style={{ maxHeight: '250px', overflowY: 'auto', paddingRight: '10px' }}>
                <p class="text-grey" style={{ fontSize: '13px' }}>Chapters List:</p>
                {Array.from({ length: selectedCourse.chapters }).map((_, i) => (
                  <div key={i} style={{ padding: '8px 10px', borderBottom: '1px solid #f0f0f0', display: 'flex', justifyContent: 'space-between', fontSize: '13px' }}>
                    <span>Chapter {i + 1}: Chapter topic placeholder title</span>
                    <a href="#read" onClick={(e) => { e.preventDefault(); alert(`Opening Chapter ${i + 1} reader...`); }} style={{ color: '#387ed1' }}>Read</a>
                  </div>
                ))}
              </div>
              <button type="button" onClick={() => setSelectedCourse(null)} style={{ width: '100%', marginTop: '20px' }}>Close</button>
            </div>
          </div>
        )}

        {/* Options Trading Certification Quiz Modal */}
        {showQuiz && (
          <div style={{
            position: 'fixed', top: 0, left: 0, width: '100%', height: '100vh',
            background: 'rgba(0,0,0,0.4)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 9999
          }}>
            <div class="console-card" style={{ background: '#fff', maxWidth: '650px', width: '100%', margin: '20px', padding: '30px', maxHeight: '90vh', overflowY: 'auto' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '15px' }}>
                <h3 style={{ margin: 0, display: 'flex', alignItems: 'center', gap: '8px' }}><Award color="#d2a13b" /> Options Certification Quiz</h3>
                <button type="button" class="close" onClick={resetQuiz} style={{ border: 'none', background: 'none', fontSize: '24px' }}>×</button>
              </div>
              <hr />

              {!quizSubmitted ? (
                <form onSubmit={handleQuizSubmit}>
                  <div style={{ marginBottom: '15px' }}>
                    <label><strong>Student Name</strong> (as it should appear on certificate)</label>
                    <input 
                      type="text" 
                      value={userName} 
                      onChange={(e) => setUserName(e.target.value)} 
                      style={{ height: '35px', marginTop: '5px' }}
                      required
                    />
                  </div>

                  {/* Question 1 */}
                  <div class="quiz-box">
                    <p style={{ margin: 0, marginBottom: '10px' }}><strong>Q1: What is the delta of an At-The-Money (ATM) option contract?</strong></p>
                    {['0.1', '0.5', '1.0', '0.0'].map((opt) => (
                      <label key={opt} style={{ display: 'block', margin: '6px 0', cursor: 'pointer', fontSize: '13px' }}>
                        <input 
                          type="radio" 
                          name="q1" 
                          value={opt} 
                          checked={answers.q1 === opt}
                          onChange={(e) => setAnswers({ ...answers, q1: e.target.value })} 
                          style={{ marginRight: '8px' }}
                          required
                        />
                        {opt}
                      </label>
                    ))}
                  </div>

                  {/* Question 2 */}
                  <div class="quiz-box">
                    <p style={{ margin: 0, marginBottom: '10px' }}><strong>Q2: Buying a Put option contract provides the purchaser with:</strong></p>
                    {[
                      { val: 'obligation_buy', label: 'The obligation to buy the underlying asset' },
                      { val: 'right_sell', label: 'The right to sell the underlying asset (correct answer)' },
                      { val: 'obligation_sell', label: 'The obligation to sell the underlying asset' }
                    ].map((opt) => (
                      <label key={opt.val} style={{ display: 'block', margin: '6px 0', cursor: 'pointer', fontSize: '13px' }}>
                        <input 
                          type="radio" 
                          name="q2" 
                          value={opt.val} 
                          checked={answers.q2 === opt.val}
                          onChange={(e) => setAnswers({ ...answers, q2: e.target.value })} 
                          style={{ marginRight: '8px' }}
                          required
                        />
                        {opt.label}
                      </label>
                    ))}
                  </div>

                  {/* Question 3 */}
                  <div class="quiz-box">
                    <p style={{ margin: 0, marginBottom: '10px' }}><strong>Q3: What does the Options Greek "Theta" measure?</strong></p>
                    {[
                      { val: 'volatility', label: 'Option price sensitivity to changes in implied volatility' },
                      { val: 'time', label: 'Option price decay over time (daily theta decay)' },
                      { val: 'underlying', label: 'Option price sensitivity to underlying stock price movements' }
                    ].map((opt) => (
                      <label key={opt.val} style={{ display: 'block', margin: '6px 0', cursor: 'pointer', fontSize: '13px' }}>
                        <input 
                          type="radio" 
                          name="q3" 
                          value={opt.val} 
                          checked={answers.q3 === opt.val}
                          onChange={(e) => setAnswers({ ...answers, q3: e.target.value })} 
                          style={{ marginRight: '8px' }}
                          required
                        />
                        {opt.label}
                      </label>
                    ))}
                  </div>

                  <button type="submit" style={{ width: '100%', marginTop: '15px' }}>Submit Quiz Answers</button>
                </form>
              ) : (
                <div class="text-center">
                  {score === 3 ? (
                    <div>
                      <CheckCircle size={54} color="#4caf50" style={{ margin: 'auto', marginBottom: '15px' }} />
                      <h3 style={{ color: '#2e7d32' }}>Score: 3/3 (100% Passed)</h3>
                      <p class="text-grey">Congratulations {userName}! Your certificate has been issued below.</p>
                      
                      {/* Printable Certificate Frame */}
                      <div class="certificate-frame" id="print-cert">
                        <div class="cert-title">Certificate of Merit</div>
                        <div style={{ fontSize: '14px', fontStyle: 'italic', margin: '15px 0' }}>This is proudly presented to</div>
                        <div class="cert-recipient">{userName}</div>
                        <div style={{ fontSize: '13px', lineHeight: '1.5' }}>
                          for successfully passing the <strong>Varsity Option Trading Certification</strong> assessment demonstrating understanding of option Greeks, delta pricing, and premium time decay strategies.
                        </div>
                        <hr style={{ borderColor: '#d2a13b', borderStyle: 'double', borderWidth: '3px 0 0 0', margin: '20px 0 10px 0' }} />
                        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '11px', color: '#555' }}>
                          <span>DATE: {new Date().toLocaleDateString()}</span>
                          <span>SIGNED: <strong>Nithin Kamath (CEO, Zerodha)</strong></span>
                        </div>
                      </div>

                      <div style={{ display: 'flex', gap: '15px', marginTop: '20px' }}>
                        <button type="button" class="button-outlined" onClick={() => window.print()} style={{ flex: 1 }}>Print / Save PDF</button>
                        <button type="button" onClick={resetQuiz} style={{ flex: 1 }}>Close</button>
                      </div>
                    </div>
                  ) : (
                    <div>
                      <HelpCircle size={54} color="#f44336" style={{ margin: 'auto', marginBottom: '15px' }} />
                      <h3 style={{ color: '#c62828' }}>Score: {score}/3 (Failed)</h3>
                      <p class="text-grey">You must answer all 3 questions correctly to receive certification.</p>
                      <button type="button" onClick={() => setQuizSubmitted(false)} style={{ width: '100%', marginTop: '20px' }}>Try Again</button>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
