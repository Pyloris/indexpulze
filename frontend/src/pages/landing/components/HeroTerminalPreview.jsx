import { useState, useEffect } from 'react';
import { Activity, TrendingUp, ArrowUpRight, ArrowDownRight, Layers } from 'lucide-react';

export const HeroTerminalPreview = () => {
  // Live synthetic ticker state for dynamic feel
  const [niftyPrice, setNiftyPrice] = useState(24852.15);
  const [niftyChange, setNiftyChange] = useState(143.20);
  const [niftyPct, setNiftyPct] = useState(0.58);

  useEffect(() => {
    const timer = setInterval(() => {
      const delta = (Math.random() - 0.48) * 1.8;
      setNiftyPrice(prev => Number((prev + delta).toFixed(2)));
      setNiftyChange(prev => Number((prev + delta).toFixed(2)));
    }, 1800);
    return () => clearInterval(timer);
  }, []);

  return (
    <div 
      style={{
        width: '100%',
        maxWidth: '1120px',
        backgroundColor: '#0c101c',
        borderRadius: '12px',
        border: '1px solid #1e293b',
        boxShadow: '0 25px 60px -15px rgba(0, 0, 0, 0.8), 0 0 40px rgba(6, 182, 212, 0.1)',
        overflow: 'hidden',
        textAlign: 'left'
      }}
    >
      {/* Window Header Bar */}
      <div 
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          padding: '12px 18px',
          backgroundColor: '#0a0d17',
          borderBottom: '1px solid #192233',
          fontFamily: 'var(--font-mono)',
          fontSize: '11px'
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          <div style={{ display: 'flex', gap: '6px' }}>
            <span style={{ width: '10px', height: '10px', borderRadius: '50%', backgroundColor: '#ef4444', opacity: 0.8 }}></span>
            <span style={{ width: '10px', height: '10px', borderRadius: '50%', backgroundColor: '#f59e0b', opacity: 0.8 }}></span>
            <span style={{ width: '10px', height: '10px', borderRadius: '50%', backgroundColor: '#10b981', opacity: 0.8 }}></span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span style={{ color: '#ffffff', fontWeight: 700, fontSize: '12px', letterSpacing: '0.05em' }}>NIFTY 50 INDEX</span>
            <span style={{ color: '#f8fafc', fontWeight: 600, fontSize: '13px' }}>{niftyPrice.toLocaleString('en-IN', { minimumFractionDigits: 2 })}</span>
            <span style={{ color: '#10b981', backgroundColor: 'rgba(16, 185, 129, 0.12)', padding: '2px 6px', borderRadius: '4px', fontSize: '11px', display: 'flex', alignItems: 'center', gap: '2px' }}>
              <ArrowUpRight size={12} /> +{niftyChange.toFixed(2)} (+{niftyPct}%)
            </span>
            <span style={{ color: '#64748b' }}>| PE: 24,800.00</span>
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '16px', color: '#64748b' }}>
          <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <span style={{ width: '6px', height: '6px', borderRadius: '50%', backgroundColor: '#10b981', display: 'inline-block' }}></span>
            MARKET: ACTIVE (NSE/BSE)
          </span>
          <span style={{ color: '#38bdf8', cursor: 'pointer' }}>&bull; Live Orderflow</span>
          <span style={{ color: '#94a3b8', cursor: 'pointer' }}>&bull; Volume Nodes</span>
          <span style={{ color: '#94a3b8', cursor: 'pointer' }}>&bull; Algorithmic Delta</span>
        </div>
      </div>

      {/* Main Terminal Display Grid */}
      <div 
        style={{
          display: 'grid',
          gridTemplateColumns: 'minmax(0, 1.65fr) minmax(280px, 1fr)',
          backgroundColor: '#0a0e1a'
        }}
      >
        {/* Left: Volume Profile & Candlestick Workspace */}
        <div style={{ padding: '20px 24px', borderRight: '1px solid #192233', position: 'relative' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <span style={{ fontSize: '10px', textTransform: 'uppercase', color: '#06b6d4', letterSpacing: '0.08em', fontWeight: 600, backgroundColor: 'rgba(6, 182, 212, 0.1)', padding: '2px 8px', borderRadius: '4px' }}>
                VOLUME PROFILE SYNTHETIC
              </span>
              <span style={{ fontSize: '11px', fontFamily: 'var(--font-mono)', color: '#64748b' }}>15 SEC</span>
            </div>
            <div style={{ display: 'flex', gap: '16px', fontSize: '11px', fontFamily: 'var(--font-mono)' }}>
              <span style={{ color: '#38bdf8' }}>POC : 24,832.00</span>
              <span style={{ color: '#10b981' }}>VAH : 24,868.00</span>
              <span style={{ color: '#ef4444' }}>VAL : 24,792.00</span>
            </div>
          </div>

          {/* Volume Profile & Candlestick Chart Visualization */}
          <div style={{ position: 'relative', height: '240px', display: 'flex', alignItems: 'center' }}>
            {/* Horizontal Volume Profile Bars on left side */}
            <div style={{ position: 'absolute', left: 0, top: 0, bottom: 0, width: '42%', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', zIndex: 1, pointerEvents: 'none', opacity: 0.85 }}>
              <div style={{ height: '14px', width: '28%', backgroundColor: 'rgba(6, 182, 212, 0.28)', borderRadius: '0 3px 3px 0' }}></div>
              <div style={{ height: '14px', width: '45%', backgroundColor: 'rgba(6, 182, 212, 0.35)', borderRadius: '0 3px 3px 0' }}></div>
              <div style={{ height: '14px', width: '70%', backgroundColor: 'rgba(6, 182, 212, 0.45)', borderRadius: '0 3px 3px 0' }}></div>
              <div style={{ height: '16px', width: '92%', backgroundColor: '#06b6d4', borderRadius: '0 3px 3px 0', boxShadow: '0 0 10px rgba(6, 182, 212, 0.5)' }}></div>
              <div style={{ height: '14px', width: '60%', backgroundColor: 'rgba(6, 182, 212, 0.4)', borderRadius: '0 3px 3px 0' }}></div>
              <div style={{ height: '14px', width: '38%', backgroundColor: 'rgba(6, 182, 212, 0.3)', borderRadius: '0 3px 3px 0' }}></div>
              <div style={{ height: '14px', width: '22%', backgroundColor: 'rgba(6, 182, 212, 0.22)', borderRadius: '0 3px 3px 0' }}></div>
            </div>

            {/* Price Level Reference Lines across the chart */}
            <div style={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', justifyContent: 'space-between', pointerEvents: 'none' }}>
              <div style={{ borderTop: '1px dashed rgba(16, 185, 129, 0.4)', display: 'flex', justifyContent: 'flex-end', paddingTop: '2px' }}>
                <span style={{ fontSize: '10px', fontFamily: 'var(--font-mono)', color: '#10b981', paddingRight: '8px' }}>24,868.00 (VAH)</span>
              </div>
              <div style={{ borderTop: '1px solid rgba(6, 182, 212, 0.7)', display: 'flex', justifyContent: 'flex-end', paddingTop: '2px' }}>
                <span style={{ fontSize: '10px', fontFamily: 'var(--font-mono)', color: '#38bdf8', paddingRight: '8px', fontWeight: 600 }}>24,832.00 (POC)</span>
              </div>
              <div style={{ borderTop: '1px dashed rgba(239, 68, 68, 0.4)', display: 'flex', justifyContent: 'flex-end', paddingTop: '2px' }}>
                <span style={{ fontSize: '10px', fontFamily: 'var(--font-mono)', color: '#ef4444', paddingRight: '8px' }}>24,792.00 (VAL)</span>
              </div>
              <div style={{ borderTop: '1px solid rgba(51, 65, 85, 0.3)' }}></div>
            </div>

            {/* Candlesticks Drawing (SVG) */}
            <svg style={{ width: '100%', height: '100%', zIndex: 2, position: 'relative' }} viewBox="0 0 520 220" preserveAspectRatio="none">
              {/* Grid vertical lines */}
              <line x1="80" y1="0" x2="80" y2="220" stroke="rgba(255,255,255,0.03)" strokeWidth="1" />
              <line x1="160" y1="0" x2="160" y2="220" stroke="rgba(255,255,255,0.03)" strokeWidth="1" />
              <line x1="240" y1="0" x2="240" y2="220" stroke="rgba(255,255,255,0.03)" strokeWidth="1" />
              <line x1="320" y1="0" x2="320" y2="220" stroke="rgba(255,255,255,0.03)" strokeWidth="1" />
              <line x1="400" y1="0" x2="400" y2="220" stroke="rgba(255,255,255,0.03)" strokeWidth="1" />
              <line x1="480" y1="0" x2="480" y2="220" stroke="rgba(255,255,255,0.03)" strokeWidth="1" />

              {/* Candles */}
              {/* Candle 1: Bullish */}
              <line x1="90" y1="130" x2="90" y2="185" stroke="#10b981" strokeWidth="1.5" />
              <rect x="85" y="145" width="10" height="30" fill="#10b981" rx="1" />

              {/* Candle 2: Bearish */}
              <line x1="140" y1="135" x2="140" y2="195" stroke="#ef4444" strokeWidth="1.5" />
              <rect x="135" y="148" width="10" height="32" fill="#ef4444" rx="1" />

              {/* Candle 3: Bullish */}
              <line x1="190" y1="110" x2="190" y2="175" stroke="#10b981" strokeWidth="1.5" />
              <rect x="185" y="125" width="10" height="42" fill="#10b981" rx="1" />

              {/* Candle 4: Bullish */}
              <line x1="240" y1="85" x2="240" y2="150" stroke="#10b981" strokeWidth="1.5" />
              <rect x="235" y="98" width="10" height="38" fill="#10b981" rx="1" />

              {/* Candle 5: Bearish pull */}
              <line x1="290" y1="90" x2="290" y2="140" stroke="#ef4444" strokeWidth="1.5" />
              <rect x="285" y="105" width="10" height="24" fill="#ef4444" rx="1" />

              {/* Candle 6: Bullish break */}
              <line x1="340" y1="50" x2="340" y2="120" stroke="#10b981" strokeWidth="1.5" />
              <rect x="335" y="65" width="10" height="45" fill="#10b981" rx="1" />

              {/* Candle 7: Bullish higher */}
              <line x1="390" y1="35" x2="390" y2="90" stroke="#10b981" strokeWidth="1.5" />
              <rect x="385" y="45" width="10" height="35" fill="#10b981" rx="1" />

              {/* Candle 8: Small pullback */}
              <line x1="440" y1="38" x2="440" y2="80" stroke="#ef4444" strokeWidth="1.5" />
              <rect x="435" y="48" width="10" height="20" fill="#ef4444" rx="1" />

              {/* Candle 9: Live Candle */}
              <line x1="490" y1="28" x2="490" y2="70" stroke="#10b981" strokeWidth="1.5" />
              <rect x="485" y="32" width="10" height="28" fill="#10b981" rx="1" />

              {/* Smooth trend trajectory overlay */}
              <path 
                d="M 90 160 Q 190 145 240 115 T 340 85 T 440 60 T 490 42" 
                fill="none" 
                stroke="#38bdf8" 
                strokeWidth="2" 
                strokeDasharray="4 4" 
                opacity="0.7"
              />
            </svg>
          </div>
        </div>

        {/* Right: Heavyweight Orderflow Delta & Execution Bar */}
        <div style={{ padding: '20px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px' }}>
              <span style={{ fontSize: '11px', textTransform: 'uppercase', color: '#94a3b8', letterSpacing: '0.06em', fontWeight: 600 }}>
                HEAVYWEIGHT DELTA PULL
              </span>
              <span style={{ color: '#10b981', fontFamily: 'var(--font-mono)', fontSize: '11px', fontWeight: 700 }}>
                +148.7 pts &uarr;
              </span>
            </div>

            {/* Heavyweight stock list */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '11px', fontFamily: 'var(--font-mono)', fontSize: '11px' }}>
              {/* HDFC BANK */}
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
                  <span style={{ color: '#e2e8f0', fontWeight: 500 }}>HDFC BANK (13.4%)</span>
                  <span style={{ color: '#10b981', fontWeight: 600 }}>+62.4 pts</span>
                </div>
                <div style={{ height: '4px', backgroundColor: '#1e293b', borderRadius: '2px', overflow: 'hidden' }}>
                  <div style={{ width: '85%', height: '100%', backgroundColor: '#10b981', borderRadius: '2px' }}></div>
                </div>
              </div>

              {/* RELIANCE */}
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
                  <span style={{ color: '#e2e8f0', fontWeight: 500 }}>RELIANCE (9.8%)</span>
                  <span style={{ color: '#10b981', fontWeight: 600 }}>+38.1 pts</span>
                </div>
                <div style={{ height: '4px', backgroundColor: '#1e293b', borderRadius: '2px', overflow: 'hidden' }}>
                  <div style={{ width: '60%', height: '100%', backgroundColor: '#10b981', borderRadius: '2px' }}></div>
                </div>
              </div>

              {/* ICICI BANK */}
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
                  <span style={{ color: '#e2e8f0', fontWeight: 500 }}>ICICI BANK (7.9%)</span>
                  <span style={{ color: '#ef4444', fontWeight: 600 }}>-12.8 pts</span>
                </div>
                <div style={{ height: '4px', backgroundColor: '#1e293b', borderRadius: '2px', overflow: 'hidden' }}>
                  <div style={{ width: '30%', height: '100%', backgroundColor: '#ef4444', borderRadius: '2px' }}></div>
                </div>
              </div>

              {/* INFOSYS */}
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
                  <span style={{ color: '#e2e8f0', fontWeight: 500 }}>INFOSYS (5.6%)</span>
                  <span style={{ color: '#10b981', fontWeight: 600 }}>+18.3 pts</span>
                </div>
                <div style={{ height: '4px', backgroundColor: '#1e293b', borderRadius: '2px', overflow: 'hidden' }}>
                  <div style={{ width: '45%', height: '100%', backgroundColor: '#10b981', borderRadius: '2px' }}></div>
                </div>
              </div>
            </div>
          </div>

          {/* Quick Execution Buy/Sell Trigger Bar */}
          <div 
            style={{
              marginTop: '16px',
              padding: '12px',
              backgroundColor: '#111827',
              borderRadius: '8px',
              border: '1px solid #1f293d'
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px', fontSize: '10px', fontFamily: 'var(--font-mono)' }}>
              <span style={{ color: '#94a3b8' }}>ONE-CLICK DERIVATIVE ROUTING</span>
              <span style={{ color: '#10b981' }}>ZERODHA CONNECTED</span>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
              <button 
                style={{
                  padding: '7px 12px',
                  backgroundColor: '#10b981',
                  color: '#070a12',
                  border: 'none',
                  borderRadius: '4px',
                  fontWeight: 700,
                  fontSize: '11px',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '4px',
                  fontFamily: 'var(--font-mono)'
                }}
              >
                BUY CE &bull; ₹128.50
              </button>
              <button 
                style={{
                  padding: '7px 12px',
                  backgroundColor: '#ef4444',
                  color: '#ffffff',
                  border: 'none',
                  borderRadius: '4px',
                  fontWeight: 700,
                  fontSize: '11px',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '4px',
                  fontFamily: 'var(--font-mono)'
                }}
              >
                SELL PE &bull; ₹112.00
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
