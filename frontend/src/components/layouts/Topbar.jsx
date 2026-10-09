export const Topbar = () => {
  return (
    <header className="surface-level-1" style={{ padding: '8px var(--spacing-lg)', borderBottom: '1px solid var(--border-active)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
      
      {/* Ticker Tape */}
      <div style={{ display: 'flex', gap: 'var(--spacing-xl)' }} className="text-data-mono-sm">
        <div>
          <span style={{ color: 'var(--text-secondary)', marginRight: '8px' }}>NIFTY</span>
          <span>24,852.15</span>
          <span style={{ color: 'var(--signal-bullish)', marginLeft: '8px' }}>+142.30</span>
        </div>
        <div>
          <span style={{ color: 'var(--text-secondary)', marginRight: '8px' }}>BANKNIFTY</span>
          <span>51,320.40</span>
          <span style={{ color: 'var(--signal-bearish)', marginLeft: '8px' }}>-210.85</span>
        </div>
        <div>
          <span style={{ color: 'var(--text-secondary)', marginRight: '8px' }}>SENSEX</span>
          <span>81,765.20</span>
          <span style={{ color: 'var(--signal-bullish)', marginLeft: '8px' }}>+412.50</span>
        </div>
        <div>
          <span style={{ color: 'var(--text-secondary)', marginRight: '8px' }}>INDIA VIX</span>
          <span>13.42</span>
          <span style={{ color: 'var(--signal-bullish)', marginLeft: '8px' }}>-4.62%</span>
        </div>
      </div>

      {/* Right Controls */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--spacing-lg)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '4px 8px', backgroundColor: 'rgba(6, 182, 212, 0.1)', borderRadius: '4px', border: '1px solid rgba(6, 182, 212, 0.2)' }}>
          <span style={{ width: '6px', height: '6px', borderRadius: '50%', backgroundColor: 'var(--signal-bullish)' }}></span>
          <span className="text-data-mono-sm" style={{ color: 'var(--signal-accent)' }}>MARKET OPEN</span>
        </div>
        <span className="text-data-mono-sm" style={{ color: 'var(--text-secondary)' }}>IST 14:24:18</span>
        <div style={{ width: '28px', height: '28px', borderRadius: '50%', backgroundColor: 'var(--signal-accent)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--bg-canvas)', fontSize: '14px', cursor: 'pointer' }}>
          👤
        </div>
      </div>
      
    </header>
  );
};
