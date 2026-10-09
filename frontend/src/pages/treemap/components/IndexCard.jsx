export const IndexCard = ({ name, exchange, value, changePct, stocksCount, vol, isActive, isPositive, onClick }) => {
  return (
    <div onClick={onClick} style={{ 
      flex: 1,
      minWidth: '150px',
      padding: 'var(--spacing-md)', 
      backgroundColor: isActive ? 'rgba(6, 182, 212, 0.1)' : 'transparent', 
      border: isActive ? '1px solid var(--signal-accent)' : '1px solid var(--border-active)', 
      borderRadius: 'var(--radius-sm)',
      cursor: 'pointer'
    }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
        <span className="text-label-caps" style={{ color: isActive ? 'var(--signal-accent)' : 'var(--text-primary)' }}>{name}</span>
        {isActive ? <span className="text-label-caps" style={{ backgroundColor: 'var(--signal-accent)', color: 'var(--bg-canvas)', padding: '2px 4px', borderRadius: '2px' }}>ACTIVE</span> : <span className="text-label-caps" style={{ color: 'var(--text-muted)' }}>{exchange}</span>}
      </div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: '4px' }}>
        <span className="text-data-mono-sm" style={{ fontSize: '16px' }}>{value}</span>
        <span className="text-data-mono-sm" style={{ color: isPositive ? 'var(--signal-bullish)' : 'var(--signal-bearish)' }}>{changePct}</span>
      </div>
      <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--text-secondary)' }} className="text-body-sm">
        <span>{stocksCount} Stocks</span>
        <span>Vol: {vol}</span>
      </div>
    </div>
  );
};
