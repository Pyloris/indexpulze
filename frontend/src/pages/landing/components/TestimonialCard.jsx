export const TestimonialCard = ({ quote, initials, name, role, isAccent }) => {
  return (
    <div className="surface-level-1" style={{ padding: 'var(--spacing-lg)', borderLeft: isAccent ? '2px solid var(--signal-accent)' : '1px solid var(--border-ghost)' }}>
      <p className="text-body-md" style={{ fontStyle: 'italic', color: 'var(--text-secondary)', marginBottom: 'var(--spacing-lg)' }}>
        "{quote}"
      </p>
      <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--spacing-md)' }}>
        <div style={{ width: '32px', height: '32px', borderRadius: 'var(--radius-sm)', backgroundColor: isAccent ? 'var(--signal-accent)' : 'var(--bg-hover)', color: isAccent ? 'var(--bg-canvas)' : 'var(--signal-accent)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '12px', fontWeight: 'bold' }}>
          {initials}
        </div>
        <div>
          <div className="text-body-md" style={{ fontWeight: 600 }}>{name}</div>
          <div className="text-body-sm" style={{ color: 'var(--text-muted)' }}>{role}</div>
        </div>
      </div>
    </div>
  );
}
