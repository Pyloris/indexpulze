export const IndexOverviewCard = ({ name, value, change, changePercent, isPositive, stats, linkText }) => {
  const signalColor = isPositive ? 'var(--signal-bullish)' : 'var(--signal-bearish)';
  const signalBg = isPositive ? 'var(--signal-bullish-tint)' : 'var(--signal-bearish-tint)';

  return (
    <div className="surface-level-2" style={{ padding: 'var(--spacing-lg)', display: 'flex', flexDirection: 'column', gap: 'var(--spacing-md)' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <div>
          <h3 className="text-headline-sm" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            {name} <span style={{ fontSize: '10px', color: 'var(--text-muted)' }}>IDX</span>
          </h3>
          <div style={{ display: 'flex', alignItems: 'baseline', gap: '8px', marginTop: '4px' }}>
            <span className="text-metric-display" style={{ fontSize: '24px' }}>{value}</span>
            <span className="text-data-mono-sm" style={{ color: signalColor }}>
              {change} ({changePercent}%)
            </span>
          </div>
        </div>
        <div style={{ padding: '4px 8px', backgroundColor: signalBg, color: signalColor, borderRadius: 'var(--radius-sm)', fontSize: '10px', fontWeight: 'bold' }}>
          {changePercent}%
        </div>
      </div>

      <div style={{ borderTop: '1px solid var(--border-active)', paddingTop: 'var(--spacing-md)', display: 'flex', flexDirection: 'column', gap: '8px' }}>
        {stats.map((stat, idx) => (
          <div key={idx} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span className="text-body-sm" style={{ color: 'var(--text-secondary)' }}>{stat.label}</span>
            <span className="text-data-mono-sm" style={{ color: stat.color || 'var(--text-primary)' }}>{stat.value}</span>
          </div>
        ))}
      </div>

      {linkText && (
        <div style={{ marginTop: 'auto', paddingTop: 'var(--spacing-md)', borderTop: '1px solid var(--border-ghost)', textAlign: 'right' }}>
          <a href="#" className="text-body-sm" style={{ color: 'var(--signal-accent)', textDecoration: 'none' }}>{linkText} &gt;</a>
        </div>
      )}
    </div>
  );
}
