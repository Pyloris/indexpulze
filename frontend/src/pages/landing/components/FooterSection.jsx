export const FooterSection = () => {
  const columns = [
    {
      title: 'TERMINAL',
      links: [
        { label: 'Nifty 50 Volume Profiles', href: '#' },
        { label: 'Bank Nifty Heavyweight', href: '#' },
        { label: 'Volatility & Skew', href: '#' },
        { label: 'Algorithmic Execution', href: '#' }
      ]
    },
    {
      title: 'BROKER OPS',
      links: [
        { label: 'Zerodha Kite Connect', href: '#' },
        { label: 'DhanHQ Fast API', href: '#' },
        { label: 'AngelOne SmartAPI', href: '#' },
        { label: 'Upstox Pro API', href: '#' }
      ]
    },
    {
      title: 'RESOURCES',
      links: [
        { label: 'Documentation', href: '#' },
        { label: 'Volume Profile Theory', href: '#' },
        { label: 'NSE Co-Lo Protocol', href: '#' },
        { label: 'TradingView Webhooks', href: '#' }
      ]
    },
    {
      title: 'SYSTEM STATUS',
      links: [
        { label: '● ALL SYSTEMS 100% OPERATIONAL', href: '#', isStatus: true },
        { label: 'NSE Tick Latency: 1.2ms', href: '#' },
        { label: 'BSE Ticks: 22,454/sec', href: '#' },
        { label: 'Colo: Rack 4 Host Cluster 1', href: '#' }
      ]
    }
  ];

  return (
    <footer 
      id="documentation"
      style={{ 
        borderTop: '1px solid #131d2e', 
        backgroundColor: '#070a12', 
        padding: '4rem 1.5rem 2.5rem',
        fontSize: '12px'
      }}
    >
      <div 
        style={{ 
          maxWidth: '1240px', 
          margin: '0 auto', 
          display: 'grid', 
          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', 
          gap: '3rem',
          marginBottom: '3.5rem'
        }}
      >
        {columns.map((col, idx) => (
          <div key={idx}>
            <div 
              style={{ 
                fontFamily: 'var(--font-mono)', 
                color: '#64748b', 
                fontSize: '11px', 
                fontWeight: 700, 
                letterSpacing: '0.08em', 
                marginBottom: '1rem',
                textTransform: 'uppercase'
              }}
            >
              {col.title}
            </div>
            <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '8px' }}>
              {col.links.map((link, lIdx) => (
                <li key={lIdx}>
                  <a 
                    href={link.href}
                    style={{ 
                      color: link.isStatus ? '#10b981' : '#94a3b8', 
                      textDecoration: 'none',
                      fontFamily: link.isStatus ? 'var(--font-mono)' : 'inherit',
                      fontSize: link.isStatus ? '11px' : '12px',
                      fontWeight: link.isStatus ? 600 : 400,
                      transition: 'color 0.2s ease'
                    }}
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>

      <div 
        style={{ 
          maxWidth: '1240px', 
          margin: '0 auto', 
          paddingTop: '2rem', 
          borderTop: '1px solid #131d2e',
          display: 'flex',
          flexWrap: 'wrap',
          justifyContent: 'space-between',
          alignItems: 'center',
          gap: '1rem',
          color: '#475569',
          fontSize: '11px',
          fontFamily: 'var(--font-mono)'
        }}
      >
        <div>
          INDEXPULSE LABS PVT LTD &copy; 2026. ALL RIGHTS RESERVED.
        </div>
        <div>
          HIGH-FREQUENCY DERIVATIVE TRADING INVOLVES RISK. FOR QUALIFIED QUANTITATIVE TRADERS. INDEXPULSE IS AN INTERMEDIARY ROUTER PLATFORM NOT SEBI INVESTMENT ADVISOR.
        </div>
      </div>
    </footer>
  );
};
