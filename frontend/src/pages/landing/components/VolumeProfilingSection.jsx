import { BarChart3, AlertCircle, CheckCircle2, ChevronRight } from 'lucide-react';

export const VolumeProfilingSection = () => {
  return (
    <section 
      style={{ 
        maxWidth: '1240px', 
        margin: '0 auto', 
        padding: '5rem 1.5rem',
        borderTop: '1px solid #131d2e',
        borderBottom: '1px solid #131d2e'
      }}
    >
      {/* Category Pill */}
      <div 
        style={{
          display: 'inline-block',
          padding: '4px 10px',
          borderRadius: '4px',
          backgroundColor: 'rgba(6, 182, 212, 0.08)',
          border: '1px solid rgba(6, 182, 212, 0.25)',
          color: '#38bdf8',
          fontSize: '11px',
          fontWeight: 600,
          letterSpacing: '0.06em',
          textTransform: 'uppercase',
          marginBottom: '1rem'
        }}
      >
        PROPRIETARY INNOVATION
      </div>

      <div 
        style={{ 
          display: 'grid', 
          gridTemplateColumns: 'minmax(0, 1.15fr) minmax(0, 0.85fr)', 
          gap: '3rem',
          alignItems: 'center'
        }}
      >
        {/* Left Column: Text & Explanation */}
        <div>
          <h2 
            style={{ 
              fontSize: 'clamp(2rem, 3.5vw, 2.75rem)', 
              fontWeight: 800, 
              lineHeight: 1.2, 
              color: '#ffffff',
              marginBottom: '0.75rem'
            }}
          >
            Volume Profiling on the Index Itself
          </h2>

          <h3 
            style={{ 
              fontSize: '1.4rem', 
              fontWeight: 700, 
              color: '#06b6d4', 
              marginBottom: '1.5rem',
              letterSpacing: '-0.01em'
            }}
          >
            First Time in the World.
          </h3>

          <p style={{ color: '#94a3b8', fontSize: '1rem', lineHeight: 1.7, marginBottom: '1.25rem' }}>
            Traditional candlestick charts hide Nifty 50 or Bank Nifty true price action without true order volume. Why? Because spot indices are non-tradeable mathematical formulas and therefore have zero traded contracts.
          </p>

          <p style={{ color: '#cbd5e1', fontSize: '1rem', lineHeight: 1.7, marginBottom: '1.25rem' }}>
            <strong style={{ color: '#ffffff' }}>IndexPulse changes this forever:</strong> Our high-frequency engine aggregates 50+ constituents instantaneous trading volume weighted by their live index weightages (HDFC Bank, Reliance, ICICI Bank, TCS, etc.) to re-synthesize real volume directly as each index calculates.
          </p>

          <p style={{ color: '#94a3b8', fontSize: '1rem', lineHeight: 1.7, marginBottom: '2rem' }}>
            Here, you get genuine <span style={{ color: '#38bdf8', fontWeight: 600 }}>Point of Control (POC)</span>, <span style={{ color: '#10b981', fontWeight: 600 }}>Value Area High (VAH)</span>, and <span style={{ color: '#ef4444', fontWeight: 600 }}>Value Area Low (VAL)</span> directly on the benchmark index, exposing real institutional accumulation and distribution zones.
          </p>

          {/* Metric Stat Badges */}
          <div style={{ display: 'flex', gap: '2rem', paddingTop: '1rem', borderTop: '1px solid #1e293b' }}>
            <div>
              <div style={{ fontSize: '1.75rem', fontWeight: 800, color: '#38bdf8', fontFamily: 'var(--font-mono)' }}>14.8ms</div>
              <div style={{ fontSize: '12px', color: '#64748b' }}>Tick Synthesis Latency</div>
            </div>
            <div>
              <div style={{ fontSize: '1.75rem', fontWeight: 800, color: '#10b981', fontFamily: 'var(--font-mono)' }}>100%</div>
              <div style={{ fontSize: '12px', color: '#64748b' }}>Mathematical Accuracy</div>
            </div>
          </div>
        </div>

        {/* Right Column: Comparative Visual Cards */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {/* Card 1: Old Paradigm (Red / Flawed) */}
          <div 
            style={{ 
              backgroundColor: '#0c101c', 
              borderRadius: '8px', 
              border: '1px solid rgba(239, 68, 68, 0.25)', 
              padding: '20px',
              boxShadow: '0 10px 25px rgba(0,0,0,0.4)'
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#ef4444', fontSize: '12px', fontWeight: 700, fontFamily: 'var(--font-mono)' }}>
                <AlertCircle size={16} />
                <span>STANDARD BROKER CHARTS</span>
              </div>
              <span style={{ fontSize: '10px', color: '#ef4444', backgroundColor: 'rgba(239, 68, 68, 0.1)', padding: '2px 6px', borderRadius: '3px' }}>VOLUME MISSING</span>
            </div>
            <p style={{ fontSize: '12px', color: '#94a3b8', lineHeight: 1.5, marginBottom: '10px' }}>
              Derivative spot candles display empty histograms or rely on futures data, which are distorted by rollover premia, wide spreads and front-running.
            </p>
            <div style={{ fontFamily: 'var(--font-mono)', fontSize: '11px', color: '#f87171', backgroundColor: '#161019', padding: '8px 12px', borderRadius: '4px', border: '1px dashed #7f1d1d' }}>
              Volume = 0 (Data unavailable on index ticks)
            </div>
          </div>

          {/* Card 2: New Paradigm (Cyan / Pulse Core Engine) */}
          <div 
            style={{ 
              backgroundColor: '#0d1527', 
              borderRadius: '8px', 
              border: '1px solid rgba(6, 182, 212, 0.45)', 
              padding: '20px',
              boxShadow: '0 15px 35px rgba(6, 182, 212, 0.12)'
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#38bdf8', fontSize: '12px', fontWeight: 700, fontFamily: 'var(--font-mono)' }}>
                <CheckCircle2 size={16} />
                <span>INDEXPULSE SYNTHESIZED VOLUME PROFILE</span>
              </div>
              <span style={{ fontSize: '10px', color: '#38bdf8', backgroundColor: 'rgba(6, 182, 212, 0.15)', padding: '2px 6px', borderRadius: '3px' }}>LIVE SYNTHESIS</span>
            </div>
            <p style={{ fontSize: '12px', color: '#cbd5e1', lineHeight: 1.5, marginBottom: '14px' }}>
              Deconstructs and calculates instantaneous real-market volume by weighting constituent stocks in tick time. Identifies true Value Area High, Value Area Low and Point of Control (POC).
            </p>

            {/* Profile Level Indicators */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', fontFamily: 'var(--font-mono)', fontSize: '11px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', padding: '6px 10px', backgroundColor: 'rgba(16, 185, 129, 0.08)', borderRadius: '4px', borderLeft: '3px solid #10b981' }}>
                <span style={{ color: '#a7f3d0' }}>VAH (70% Volume Boundary High)</span>
                <span style={{ color: '#10b981', fontWeight: 600 }}>24,868.00</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', padding: '6px 10px', backgroundColor: 'rgba(6, 182, 212, 0.12)', borderRadius: '4px', borderLeft: '3px solid #06b6d4' }}>
                <span style={{ color: '#bae6fd' }}>Point of Control (POC - Peak Volume)</span>
                <span style={{ color: '#38bdf8', fontWeight: 700 }}>24,832.00</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', padding: '6px 10px', backgroundColor: 'rgba(239, 68, 68, 0.08)', borderRadius: '4px', borderLeft: '3px solid #ef4444' }}>
                <span style={{ color: '#fecaca' }}>VAL (70% Volume Boundary Low)</span>
                <span style={{ color: '#ef4444', fontWeight: 600 }}>24,792.00</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
