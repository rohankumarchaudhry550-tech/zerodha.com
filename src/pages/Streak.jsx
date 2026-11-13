import React, { useState } from 'react';
import { Play, Sparkles, RefreshCw, Zap, TrendingUp, ShieldAlert } from 'lucide-react';

const strategyTemplates = [
  { name: 'RSI Oversold Strategy', indicator: 'RSI(14)', compare: 'crosses below', value: '30', symbol: 'RELIANCE' },
  { name: 'MA Crossover Strategy', indicator: 'EMA(9)', compare: 'crosses above', value: 'EMA(21)', symbol: 'TCS' },
  { name: 'MACD Bullish Signal', indicator: 'MACD(12,26,9)', compare: 'crosses above', value: 'Signal Line', symbol: 'INFY' }
];

export default function Streak() {
  const [selectedStock, setSelectedStock] = useState('RELIANCE');
  const [indicator, setIndicator] = useState('RSI(14)');
  const [compareOperator, setCompareOperator] = useState('crosses below');
  const [targetVal, setTargetVal] = useState('30');
  
  // Backtest state
  const [runningBacktest, setRunningBacktest] = useState(false);
  const [backtestResult, setBacktestResult] = useState(null);

  const loadTemplate = (temp) => {
    setSelectedStock(temp.symbol);
    setIndicator(temp.indicator);
    setCompareOperator(temp.compare);
    setTargetVal(temp.value);
    setBacktestResult(null);
  };

  const runBacktest = () => {
    setRunningBacktest(true);
    setBacktestResult(null);

    // Simulate strategy compiling & database scans
    setTimeout(() => {
      setRunningBacktest(false);
      
      // Seed random but realistic results
      const totalTrades = Math.floor(20 + Math.random() * 30);
      const wins = Math.floor(totalTrades * (0.52 + Math.random() * 0.18));
      const winRate = ((wins / totalTrades) * 100).toFixed(1);
      const losses = totalTrades - wins;
      const returns = parseFloat((12.5 + Math.random() * 15.0).toFixed(1));
      const buyHold = parseFloat((returns * (0.7 + Math.random() * 0.3)).toFixed(1));

      setBacktestResult({
        totalTrades,
        wins,
        losses,
        winRate,
        returns,
        buyHold,
        maxDrawdown: parseFloat((3.1 + Math.random() * 4).toFixed(1))
      });
    }, 2500);
  };

  return (
    <div class="streak-page" style={{ background: '#fbfbfb', minHeight: '80vh', padding: '60px 0' }}>
      <div class="container">
        
        {/* Header Title */}
        <div className="console-card" style={{ background: '#fff', marginBottom: '30px' }}>
          <div className="row between v-align">
            <div>
              <span style={{ fontSize: '12px', textTransform: 'uppercase', color: '#387ed1', letterSpacing: '1px', fontWeight: 'bold' }}>Streak Partner App</span>
              <h2 style={{ margin: '5px 0 0 0' }}>⚡ No-Code Algo Strategy Creator</h2>
            </div>
            <div>
              <span style={{ fontSize: '12px', color: '#888' }}>Algo status:</span>
              <span style={{ fontSize: '12px', color: '#4caf50', fontWeight: 'bold', marginLeft: '6px' }}>● Live Engine Active</span>
            </div>
          </div>
        </div>

        {/* Templates selector */}
        <div style={{ display: 'flex', gap: '15px', marginBottom: '25px' }}>
          {strategyTemplates.map((temp, idx) => (
            <button 
              key={idx} 
              type="button" 
              class="button-outlined" 
              onClick={() => loadTemplate(temp)}
              style={{ fontSize: '13px', padding: '8px 15px', display: 'flex', alignItems: 'center', gap: '6px' }}
            >
              <Sparkles size={14} color="#ffb300" /> {temp.name}
            </button>
          ))}
        </div>

        <div class="row between">
          {/* Strategy builder form */}
          <div class="six columns console-card" style={{ background: '#fff' }}>
            <h3>Define Strategy Rules</h3>
            <p class="text-grey" style={{ fontSize: '13px' }}>Create algorithmic buy/sell triggers without writing code.</p>
            <hr />

            <form onSubmit={(e) => { e.preventDefault(); runBacktest(); }}>
              {/* Asset selection */}
              <div style={{ marginBottom: '15px' }}>
                <label style={{ display: 'block', marginBottom: '6px', fontSize: '13px', fontWeight: '500' }}>Target Asset Symbol</label>
                <select 
                  value={selectedStock} 
                  onChange={(e) => { setSelectedStock(e.target.value); setBacktestResult(null); }} 
                  style={{ width: '100%', height: '42px', minHeight: '42px', padding: '8px 30px 8px 12px', fontSize: '14px', boxSizing: 'border-box', borderRadius: '4px', border: '1px solid #d1d1d1', backgroundColor: '#fff', cursor: 'pointer' }}
                >
                  <option value="RELIANCE">RELIANCE (NSE)</option>
                  <option value="TCS">TCS (NSE)</option>
                  <option value="HDFCBANK">HDFCBANK (NSE)</option>
                  <option value="INFY">INFY (NSE)</option>
                </select>
              </div>

              {/* Indicator selection */}
              <div class="row between" style={{ marginBottom: '20px' }}>
                <div class="four columns">
                  <label style={{ display: 'block', marginBottom: '6px', fontSize: '13px', fontWeight: '500' }}>Indicator</label>
                  <select 
                    value={indicator} 
                    onChange={(e) => { setIndicator(e.target.value); setBacktestResult(null); }} 
                    style={{ width: '100%', height: '42px', minHeight: '42px', padding: '8px 30px 8px 12px', fontSize: '14px', boxSizing: 'border-box', borderRadius: '4px', border: '1px solid #d1d1d1', backgroundColor: '#fff', cursor: 'pointer' }}
                  >
                    <option value="RSI(14)">RSI (14)</option>
                    <option value="EMA(9)">EMA (9)</option>
                    <option value="EMA(21)">EMA (21)</option>
                    <option value="MACD(12,26,9)">MACD (Line)</option>
                  </select>
                </div>
                <div class="four columns">
                  <label style={{ display: 'block', marginBottom: '6px', fontSize: '13px', fontWeight: '500' }}>Condition</label>
                  <select 
                    value={compareOperator} 
                    onChange={(e) => { setCompareOperator(e.target.value); setBacktestResult(null); }} 
                    style={{ width: '100%', height: '42px', minHeight: '42px', padding: '8px 30px 8px 12px', fontSize: '14px', boxSizing: 'border-box', borderRadius: '4px', border: '1px solid #d1d1d1', backgroundColor: '#fff', cursor: 'pointer' }}
                  >
                    <option value="crosses below">Crosses Below</option>
                    <option value="crosses above">Crosses Above</option>
                    <option value="is greater than">Is Greater Than</option>
                    <option value="is less than">Is Less Than</option>
                  </select>
                </div>
                <div class="four columns">
                  <label style={{ display: 'block', marginBottom: '6px', fontSize: '13px', fontWeight: '500' }}>Target / Value</label>
                  <input 
                    type="text" 
                    value={targetVal} 
                    onChange={(e) => { setTargetVal(e.target.value); setBacktestResult(null); }}
                    style={{ height: '42px', minHeight: '42px', padding: '8px 12px', fontSize: '14px', boxSizing: 'border-box', borderRadius: '4px', border: '1px solid #d1d1d1', width: '100%' }} 
                    placeholder="e.g. 30" 
                    required 
                  />
                </div>
              </div>

              <button type="submit" disabled={runningBacktest} style={{ width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}>
                {runningBacktest ? <RefreshCw size={18} class="animate-spin" /> : <Play size={18} />} 
                {runningBacktest ? 'Backtesting Strategy on 1Y chart...' : 'Run Backtest'}
              </button>
            </form>
          </div>

          {/* Results panel */}
          <div class="six columns">
            <div class="console-card" style={{ background: '#fff', height: '360px', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center' }}>
              
              {runningBacktest && (
                <div class="text-center">
                  <Zap size={48} color="#387ed1" style={{ margin: 'auto', marginBottom: '15px' }} />
                  <h4>Compiling Strategy...</h4>
                  <p class="text-grey" style={{ fontSize: '13px' }}>Scanning historical tick data from NSE servers...</p>
                </div>
              )}

              {!runningBacktest && !backtestResult && (
                <div class="text-center text-grey">
                  <Zap size={48} style={{ margin: 'auto', opacity: 0.3, marginBottom: '15px' }} />
                  <h4>No Active Backtest</h4>
                  <p style={{ fontSize: '13px' }}>Configure your rules and click "Run Backtest" to see historical returns.</p>
                </div>
              )}

              {backtestResult && (
                <div style={{ width: '100%', height: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                  <div>
                    <h3 style={{ margin: 0, display: 'flex', alignItems: 'center', gap: '8px' }}><TrendingUp color="#4caf50" /> Backtest Results</h3>
                    <p class="text-grey" style={{ fontSize: '12px', margin: 0 }}>Backtest period: 1 Year (daily interval)</p>
                    <hr />
                    
                    <div class="row between" style={{ margin: '15px 0' }}>
                      <div class="four columns text-center" style={{ borderRight: '1px solid #eee' }}>
                        <div style={{ fontSize: '12px', color: '#888' }}>Strategy Returns</div>
                        <h3 style={{ margin: '5px 0', color: '#4caf50' }}>+{backtestResult.returns}%</h3>
                      </div>
                      <div class="four columns text-center" style={{ borderRight: '1px solid #eee' }}>
                        <div style={{ fontSize: '12px', color: '#888' }}>Buy &amp; Hold</div>
                        <h3 style={{ margin: '5px 0', color: '#666' }}>+{backtestResult.buyHold}%</h3>
                      </div>
                      <div class="four columns text-center">
                        <div style={{ fontSize: '12px', color: '#888' }}>Win Rate</div>
                        <h3 style={{ margin: '5px 0' }}>{backtestResult.winRate}%</h3>
                      </div>
                    </div>

                    <div style={{ fontSize: '13px', background: '#fafafa', padding: '12px', borderRadius: '4px' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
                        <span>Total Executed Signals:</span>
                        <strong>{backtestResult.totalTrades} (Wins: {backtestResult.wins} / Losses: {backtestResult.losses})</strong>
                      </div>
                      <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                        <span>Max Drawdown:</span>
                        <strong style={{ color: '#f44336' }}>-{backtestResult.maxDrawdown}%</strong>
                      </div>
                    </div>
                  </div>

                  <button 
                    type="button" 
                    onClick={() => alert(`Algo deployed! Scanner will look for "${indicator} ${compareOperator} ${targetVal}" on ${selectedStock} NSE.`)}
                    style={{ width: '100%', backgroundColor: '#4caf50' }}
                  >
                    Deploy Strategy Virtually
                  </button>
                </div>
              )}

            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
