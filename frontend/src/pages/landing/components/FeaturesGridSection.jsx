import { 
  Globe2, 
  BarChart2, 
  LayoutGrid, 
  Flame, 
  ArrowRight,
  TrendingUp,
  ShieldCheck,
  RefreshCcw,
  Sliders
} from 'lucide-react';

export const FeaturesGridSection = () => {
  const features = [
    {
      num: '1',
      title: 'Universal Multi-Broker Execution',
      description: 'Connect Zerodha, Dhan, AngelOne, or Upstox in under 30 seconds using secure OAuth. Fire one-click scalps across multiple broker accounts simultaneously with unified tick hotkeys and dynamic execution trailing stops without ever switching tabs.',
      icon: <Globe2 size={20} color="#38bdf8" />,
      tag: 'MULTI-BROKER WEBHOOKS',
      actionText: 'Broker Setup Docs',
      detailsContent: (
        <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', marginTop: '14px', fontFamily: 'var(--font-mono)', fontSize: '10px' }}>
          <span style={{ backgroundColor: 'rgba(56, 189, 248, 0.1)', color: '#38bdf8', padding: '3px 8px', borderRadius: '4px', border: '1px solid rgba(56, 189, 248, 0.2)' }}>Zerodha Kite API</span>
          <span style={{ backgroundColor: 'rgba(56, 189, 248, 0.1)', color: '#38bdf8', padding: '3px 8px', borderRadius: '4px', border: '1px solid rgba(56, 189, 248, 0.2)' }}>Dhan FastHQ</span>
          <span style={{ backgroundColor: 'rgba(56, 189, 248, 0.1)', color: '#38bdf8', padding: '3px 8px', borderRadius: '4px', border: '1px solid rgba(56, 189, 248, 0.2)' }}>Angel SmartAPI</span>
        </div>
      )
    },
    {
      num: '2',
      title: 'Real-Time Heavyweight Contribution',
      description: 'Know immediately whether a 100-point Bank Nifty rally is driven by genuine institutional buying in HDFC Bank and ICICI Bank, or mere fakeout short-covering through low-weight float that will collapse at resistance.',
      icon: <BarChart2 size={20} color="#10b981" />,
      tag: 'SYNTHETIC POINT DELTA',
      actionText: 'Load Pillar Breakdown',
      detailsContent: (
        <div style={{ marginTop: '14px', display: 'flex', flexDirection: 'column', gap: '6px', fontFamily: 'var(--font-mono)', fontSize: '11px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', color: '#94a3b8' }}>
            <span>HDFCBANK (+1.8%)</span>
            <span style={{ color: '#10b981' }}>+48.2 pts pull</span>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', color: '#94a3b8' }}>
            <span>ICICIBANK (-0.9%)</span>
            <span style={{ color: '#ef4444' }}>-18.4 pts drag</span>
          </div>
        </div>
      )
    },
    {
      num: '3',
      title: 'Dynamic Volume-Weighted Treemap',
      description: 'A 100x better heat-map visual pump. Tile sizes mutate in real-time according to turnover and volume bursts, colored green or red by instant index delta. Spot institutional block absorptions seconds before candles print.',
      icon: <LayoutGrid size={20} color="#38bdf8" />,
      tag: 'INSTANT TURNOVER MATRIX',
      actionText: 'Live Basket Heatmap',
      detailsContent: (
        <div style={{ marginTop: '14px', display: 'grid', gridTemplateColumns: '2fr 1fr 1fr', gap: '4px', height: '36px', fontFamily: 'var(--font-mono)', fontSize: '10px' }}>
          <div style={{ backgroundColor: 'rgba(16, 185, 129, 0.25)', border: '1px solid #10b981', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#10b981', borderRadius: '3px' }}>HDFC +1.8%</div>
          <div style={{ backgroundColor: 'rgba(16, 185, 129, 0.15)', border: '1px solid #10b981', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#10b981', borderRadius: '3px' }}>RELI +0.7%</div>
          <div style={{ backgroundColor: 'rgba(239, 68, 68, 0.2)', border: '1px solid #ef4444', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#ef4444', borderRadius: '3px' }}>TCS -1.1%</div>
        </div>
      )
    },
    {
      num: '4',
      title: 'Options Greeks & Strike Congestion',
      description: 'Correlate synthesized index volume directly against real-time Open Interest, Max Pain prices, and dealer Gamma Exposure. Identify high probability reversal levels where market makers are trapped.',
      icon: <Flame size={20} color="#ef4444" />,
      tag: 'OI GAMMA PINPOINT',
      actionText: 'Inspect Gamma Exposure',
      detailsContent: (
        <div style={{ marginTop: '14px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', backgroundColor: '#090d16', padding: '8px 10px', borderRadius: '4px', border: '1px solid #192233', fontFamily: 'var(--font-mono)', fontSize: '10px' }}>
          <span style={{ color: '#94a3b8' }}>ATM: 24,850 CE/PE</span>
          <span style={{ color: '#06b6d4' }}>MAX PAIN: 24,800</span>
          <span style={{ color: '#10b981' }}>PCR: 1.28</span>
        </div>
      )
    },
    {
      num: '5',
      title: 'Multi-Index Sector Rotation Engine',
      description: 'Compare relative momentum across NIFTY 50, NIFTY BANK, FINNIFTY, and BSE SENSEX to catch rotation inflows before breakout candles form. Pivot instantly into the index basket receiving aggressive institutional liquidity.',
      icon: <RefreshCcw size={20} color="#a855f7" />,
      tag: 'CROSS-INDEX DIVERGENCE',
      actionText: 'Sector Spread Matrix',
      detailsContent: (
        <div style={{ marginTop: '14px', display: 'flex', flexDirection: 'column', gap: '6px', fontFamily: 'var(--font-mono)', fontSize: '10px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', color: '#94a3b8' }}>
            <span>NIFTY IT vs BANK</span>
            <span style={{ color: '#10b981' }}>IT LEADING (+1.4%)</span>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', color: '#94a3b8' }}>
            <span>FINNIFTY DIVERGENCE</span>
            <span style={{ color: '#38bdf8' }}>NEUTRAL (0.0%)</span>
          </div>
        </div>
      )
    },
    {
      num: '6',
      title: 'Algorithmic Trailing & Risk Safeguards',
      description: 'Automate trade protection with sub-tick server-side stop losses, volatility-adjusted trailing stops, and multi-leg risk guards that protect capital during high-impact market spikes and sudden RBI/FOMC policy releases.',
      icon: <ShieldCheck size={20} color="#06b6d4" />,
      tag: 'LOW-LATENCY PROTECTION',
      actionText: 'Risk Engine Specs',
      detailsContent: (
        <div style={{ marginTop: '14px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', backgroundColor: '#090d16', padding: '8px 10px', borderRadius: '4px', border: '1px solid #192233', fontFamily: 'var(--font-mono)', fontSize: '10px' }}>
          <span style={{ color: '#94a3b8' }}>TRAILING: 1.5 ATR</span>
          <span style={{ color: '#10b981' }}>PROTECTION: ACTIVE</span>
          <span style={{ color: '#38bdf8' }}>SLIPPAGE: &lt;0.05%</span>
        </div>
      )
    }
  ];

  return (
    <section 
      id="features"
      style={{ 
        maxWidth: '1240px', 
        margin: '0 auto', 
        padding: '5rem 1.5rem',
        textAlign: 'center'
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
        ENGINEERED FOR SERIOUS TRADERS
      </div>

      <h2 
        style={{ 
          fontSize: 'clamp(2rem, 3.5vw, 2.75rem)', 
          fontWeight: 800, 
          lineHeight: 1.2, 
          color: '#ffffff',
          marginBottom: '0.75rem'
        }}
      >
        Institutional Functionality. Pristine Execution.
      </h2>
      <p 
        style={{ 
          color: '#94a3b8', 
          fontSize: '1rem', 
          maxWidth: '680px', 
          margin: '0 auto 3rem',
          lineHeight: 1.6
        }}
      >
        Every tool is designed to give option scalpers and index swing traders an unambiguous edge.
      </p>

      {/* Grid of 6 Feature Cards (3 columns on desktop) */}
      <div 
        style={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', 
          gap: '24px',
          textAlign: 'left'
        }}
      >
        {features.map((f, idx) => (
          <div 
            key={idx}
            style={{ 
              backgroundColor: '#0c101c', 
              borderRadius: '10px', 
              border: '1px solid #1e293b', 
              padding: '24px',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
              transition: 'border-color 0.2s ease, transform 0.2s ease',
              boxShadow: '0 10px 30px rgba(0,0,0,0.5)'
            }}
          >
            <div>
              {/* Card Header with Icon */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '16px' }}>
                <div 
                  style={{ 
                    width: '42px', 
                    height: '42px', 
                    borderRadius: '8px', 
                    backgroundColor: 'rgba(15, 23, 42, 0.8)', 
                    border: '1px solid #1e293b',
                    display: 'flex', 
                    alignItems: 'center', 
                    justifyContent: 'center' 
                  }}
                >
                  {f.icon}
                </div>
                <span 
                  style={{ 
                    fontSize: '10px', 
                    fontWeight: 600, 
                    color: '#64748b', 
                    backgroundColor: '#111827', 
                    padding: '3px 8px', 
                    borderRadius: '4px', 
                    fontFamily: 'var(--font-mono)',
                    border: '1px solid #1f293d'
                  }}
                >
                  {f.tag}
                </span>
              </div>

              {/* Title & Description */}
              <h3 style={{ fontSize: '1.2rem', fontWeight: 700, color: '#f8fafc', marginBottom: '10px' }}>
                {f.num}. {f.title}
              </h3>
              <p style={{ fontSize: '0.92rem', color: '#94a3b8', lineHeight: 1.6 }}>
                {f.description}
              </p>

              {f.detailsContent}
            </div>

            {/* Action Link at Bottom */}
            <div style={{ marginTop: '24px', paddingTop: '16px', borderTop: '1px solid #162032', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ fontSize: '12px', fontWeight: 600, color: '#38bdf8', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '4px' }}>
                {f.actionText} <ArrowRight size={13} />
              </span>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};
