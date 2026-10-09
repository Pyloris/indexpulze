export const Input = ({ label, rightLabel, icon, type = "text", style = {}, ...props }) => {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginBottom: 'var(--spacing-lg)' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between' }}>
        <label className="text-label-caps" style={{ color: 'var(--text-muted)' }}>{label}</label>
        {rightLabel && <span className="text-body-sm" style={{ color: 'var(--signal-accent)', cursor: 'pointer' }}>{rightLabel}</span>}
      </div>
      <div style={{ 
        display: 'flex', 
        alignItems: 'center', 
        backgroundColor: 'var(--bg-panel)', 
        border: '1px solid var(--border-active)', 
        borderRadius: 'var(--radius-sm)',
        padding: '0 var(--spacing-sm)',
        transition: 'border-color 0.2s ease'
      }}>
        {icon && <span style={{ color: 'var(--text-secondary)', marginRight: '8px', fontSize: '14px' }}>{icon}</span>}
        <input 
          type={type} 
          style={{ 
            flex: 1, 
            backgroundColor: 'transparent', 
            border: 'none', 
            color: 'var(--text-primary)', 
            padding: '12px 0',
            fontFamily: type === 'password' || props.placeholder?.includes('0') ? 'var(--font-mono)' : 'var(--font-sans)',
            outline: 'none',
            fontSize: '14px',
            ...style
          }} 
          {...props} 
        />
        {type === 'password' && <span style={{ color: 'var(--text-secondary)', marginLeft: '8px', cursor: 'pointer', fontSize: '14px' }}>👁</span>}
      </div>
    </div>
  );
};
