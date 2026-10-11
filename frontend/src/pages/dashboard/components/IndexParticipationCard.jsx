export const IndexParticipationCard = ({
  title = 'INDEX PARTICIPATION GAUGE',
  badgeText = '118% of 10-D AVG',
  badgeColor = 'var(--signal-bullish)',
  totalShares = '184.2M',
  totalSharesLabel = 'Total Traded Shares',
  bullishPct = 64,
  bearishPct = 36,
  bullVol = '117.8M',
  bearVol = '66.4M',
  className = '',
  style = {}
}) => {
  return (
    <div 
      className={`surface-level-1 ${className}`} 
      style={{ 
        padding: 'var(--spacing-lg)', 
        borderRadius: 'var(--radius-md)', 
        border: '1px solid var(--border-active)',
        display: 'flex',
        flexDirection: 'column',
        ...style 
      }}
    >
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 'var(--spacing-lg)' }}>
        <span className="text-label-caps" style={{ color: 'var(--text-muted)' }}>{title}</span>
        <span className="text-data-mono-sm" style={{ color: badgeColor }}>{badgeText}</span>
      </div>

      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: 'var(--spacing-md)' }}>
        <div style={{ display: 'flex', flexDirection: 'column' }}>
          <span className="text-metric-display">{totalShares}</span>
          <span className="text-body-sm" style={{ color: 'var(--text-secondary)' }}>{totalSharesLabel}</span>
        </div>
        <div className="text-data-mono-sm">
          <span style={{ color: 'var(--signal-bullish)' }}>{bullishPct}%</span>{' '}
          <span style={{ color: 'var(--text-muted)' }}>Bullish</span>{' '}
          <span style={{ color: 'var(--text-muted)' }}>/</span>{' '}
          <span style={{ color: 'var(--signal-bearish)' }}>{bearishPct}%</span>{' '}
          <span style={{ color: 'var(--text-muted)' }}>Bearish</span>
        </div>
      </div>

      <div style={{ height: '6px', width: '100%', backgroundColor: 'var(--signal-bearish)', borderRadius: '3px', display: 'flex', overflow: 'hidden', marginBottom: '12px' }}>
        <div style={{ width: `${bullishPct}%`, height: '100%', backgroundColor: 'var(--signal-bullish)' }}></div>
      </div>

      <div style={{ display: 'flex', justifyContent: 'space-between' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
          <div style={{ width: '8px', height: '8px', backgroundColor: 'var(--signal-bullish)', borderRadius: '1px' }}></div>
          <span className="text-label-caps" style={{ color: 'var(--text-muted)' }}>BULL VOL: {bullVol}</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
          <div style={{ width: '8px', height: '8px', backgroundColor: 'var(--signal-bearish)', borderRadius: '1px' }}></div>
          <span className="text-label-caps" style={{ color: 'var(--text-muted)' }}>BEAR VOL: {bearVol}</span>
        </div>
      </div>
    </div>
  );
};
