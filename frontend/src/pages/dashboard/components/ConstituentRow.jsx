export const ConstituentRow = ({ symbol, weight, price, change, changePct, vol, volMult, pts, isPositive }) => {
  return (
    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px 0', borderBottom: '1px solid var(--border-ghost)' }}>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <span className="text-data-mono-sm" style={{ fontWeight: 'bold' }}>{symbol}</span>
          <span style={{ fontSize: '10px', backgroundColor: 'var(--bg-hover)', padding: '2px 4px', borderRadius: '4px', color: 'var(--text-muted)' }}>Wt {weight}</span>
        </div>
        <div className="text-data-mono-sm">
          <span>{price} </span>
          <span style={{ color: isPositive ? 'var(--signal-bullish)' : 'var(--signal-bearish)' }}>{changePct}</span>
        </div>
      </div>
      <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '2px' }}>
          <span className="text-body-sm" style={{ color: 'var(--text-secondary)' }}>&bull; Vol: {vol}</span>
          <span className="text-body-sm" style={{ color: 'var(--text-muted)' }}>({volMult})</span>
        </div>
        <div 
          className="text-data-mono-sm" 
          style={{ 
            backgroundColor: isPositive ? 'rgba(34, 197, 94, 0.1)' : 'rgba(239, 68, 68, 0.1)', 
            color: isPositive ? 'var(--signal-bullish)' : 'var(--signal-bearish)',
            padding: '4px 8px',
            borderRadius: '4px',
            minWidth: '60px',
            textAlign: 'center'
          }}
        >
          {pts} pts
        </div>
      </div>
    </div>
  );
};
