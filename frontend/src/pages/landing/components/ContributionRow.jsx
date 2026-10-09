export const ContributionRow = ({ name, weight, contribution, isPositive }) => {
  const color = isPositive ? 'var(--signal-bullish)' : 'var(--signal-bearish)';
  return (
    <div style={{ marginBottom: '12px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
        <span className="text-data-mono-sm">{name}</span>
        <span className="text-data-mono-sm" style={{ color: 'var(--text-secondary)' }}>{weight}</span>
        <span className="text-data-mono-sm" style={{ color }}>{isPositive ? '+' : ''}{contribution} pts {isPositive ? '▲' : '▼'}</span>
      </div>
      <div style={{ height: '4px', backgroundColor: 'var(--bg-hover)', borderRadius: 'var(--radius-sm)', overflow: 'hidden' }}>
        <div style={{ height: '100%', width: weight, backgroundColor: color, borderRadius: 'var(--radius-sm)' }}></div>
      </div>
    </div>
  );
}
