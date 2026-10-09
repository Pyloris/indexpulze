export const MetricBox = ({ title, badge, badgeColor, mainValue, subValue, highlightValue, subText, progress, progressColor }) => {
  return (
    <div className="surface-level-1" style={{ padding: 'var(--spacing-lg)', borderRadius: 'var(--radius-md)', display: 'flex', flexDirection: 'column', border: '1px solid var(--border-active)', height: '100%' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 'var(--spacing-md)' }}>
        <span className="text-label-caps" style={{ color: 'var(--text-muted)', maxWidth: '90px', lineHeight: '1.4' }}>{title}</span>
        {badge && <span className="text-label-caps" style={{ backgroundColor: 'var(--bg-hover)', border: `1px solid ${badgeColor}`, padding: '2px 6px', borderRadius: '4px', color: badgeColor }}>{badge}</span>}
      </div>
      
      <div style={{ flex: 1, display: 'flex', alignItems: 'baseline', gap: '8px' }}>
        <span className="text-metric-display" style={{ fontSize: '28px' }}>{mainValue}</span>
        {subValue && (
          <div style={{ display: 'flex', flexDirection: 'column', paddingBottom: '4px' }}>
            <span className="text-data-mono-sm" style={{ color: 'var(--text-secondary)' }}>{subValue}</span>
            {highlightValue && <span className="text-data-mono-sm" style={{ color: 'var(--signal-bullish)' }}>{highlightValue}</span>}
          </div>
        )}
      </div>

      {subText && <div className="text-body-sm" style={{ color: 'var(--signal-accent)', marginTop: '4px', textAlign: 'right' }}>{subText}</div>}
      
      <div style={{ marginTop: 'auto', paddingTop: 'var(--spacing-md)' }}>
        <div style={{ height: '3px', backgroundColor: 'var(--bg-hover)', width: '100%', borderRadius: '2px', overflow: 'hidden' }}>
          <div style={{ width: progress, height: '100%', backgroundColor: progressColor }}></div>
        </div>
      </div>
    </div>
  );
};
