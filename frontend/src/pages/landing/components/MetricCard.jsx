export const MetricCard = ({ title, value, subtitle, valueColor = 'var(--text-primary)', subtitleColor = 'var(--text-secondary)' }) => {
  return (
    <div className="surface-level-1" style={{ padding: 'var(--spacing-lg)', borderRadius: 'var(--radius-lg)', display: 'flex', flexDirection: 'column', gap: '4px' }}>
      <div className="text-label-caps" style={{ color: 'var(--text-muted)' }}>{title}</div>
      <div className="text-metric-display" style={{ color: valueColor, fontSize: '24px' }}>{value}</div>
      <div className="text-body-sm" style={{ color: subtitleColor }}>{subtitle}</div>
    </div>
  );
}
