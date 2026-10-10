export const OtherSettings = () => {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-lg)' }}>
      <h2 className="text-headline-sm" style={{ color: 'var(--text-primary)', borderBottom: '1px solid var(--border-ghost)', paddingBottom: 'var(--spacing-sm)' }}>Other Related Settings</h2>
      <div className="surface-level-1" style={{ padding: 'var(--spacing-lg)', borderRadius: 'var(--radius-md)' }}>
        <p className="text-body-md" style={{ color: 'var(--text-secondary)' }}>More settings modules will be available here soon.</p>
      </div>
    </div>
  );
};
