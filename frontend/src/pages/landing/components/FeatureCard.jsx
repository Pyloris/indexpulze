export const FeatureCard = ({ icon, pillar, title, description, children, footerLink }) => {
  return (
    <div className="surface-level-1" style={{ padding: 'var(--spacing-lg)', display: 'flex', flexDirection: 'column', gap: 'var(--spacing-md)', height: '100%' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <div style={{ width: '40px', height: '40px', backgroundColor: 'var(--bg-hover)', borderRadius: 'var(--radius-md)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--signal-accent)', border: '1px solid var(--border-active)' }}>
          {icon}
        </div>
        <div className="text-label-caps" style={{ color: 'var(--text-muted)' }}>PILLAR {pillar}</div>
      </div>
      
      <div>
        <h4 className="text-headline-sm" style={{ marginBottom: '8px' }}>{title}</h4>
        <p className="text-body-sm" style={{ color: 'var(--text-secondary)', lineHeight: '1.6' }}>{description}</p>
      </div>

      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center', padding: 'var(--spacing-md) 0' }}>
        {children}
      </div>

      <div style={{ paddingTop: 'var(--spacing-md)', borderTop: '1px solid var(--border-ghost)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <a href="#" className="text-body-sm" style={{ color: 'var(--signal-accent)', textDecoration: 'none' }}>{footerLink}</a>
        <span style={{ color: 'var(--text-muted)' }}>&nabla;</span>
      </div>
    </div>
  );
}
