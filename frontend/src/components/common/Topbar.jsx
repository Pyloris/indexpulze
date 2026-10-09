import { UserMenu } from './UserMenu';

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
        <span className="text-data-mono-sm" style={{ color: 'var(--text-secondary)' }}>IST 14:24:18</span>
        <UserMenu />
      </div>
      
    </header>
  );
};
