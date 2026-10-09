export const Button = ({ children, variant = 'primary', className = '', style = {}, ...props }) => {
  let baseClass = 'inline-flex items-center justify-center font-bold transition-colors duration-200 ';
  
  if (variant === 'primary') baseClass += 'btn-buy ';
  if (variant === 'danger') baseClass += 'btn-sell ';
  if (variant === 'secondary') baseClass += 'btn-secondary ';
  if (variant === 'ghost') baseClass += 'bg-transparent border border-transparent hover:border-[var(--border-active)] hover:bg-[var(--bg-hover)] text-[var(--text-primary)] ';

  // Inline styles fallback since we are mostly using inline styles right now for layout
  const defaultStyles = {
    padding: 'var(--spacing-sm) var(--spacing-lg)',
    borderRadius: 'var(--radius-DEFAULT)',
    cursor: 'pointer',
    border: variant === 'secondary' || variant === 'ghost' ? '1px solid var(--border-active)' : 'none',
    backgroundColor: variant === 'primary' ? 'var(--signal-accent)' : (variant === 'secondary' ? 'transparent' : undefined),
    color: variant === 'primary' ? 'var(--bg-canvas)' : 'var(--text-primary)',
    fontWeight: 'bold',
    fontFamily: 'var(--font-sans)',
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '8px',
    ...style
  };

  // If using classes from index.css, we might not need all inline styles, but providing them for safety
  return (
    <button className={`${baseClass} ${className}`} style={variant === 'primary' ? {...defaultStyles, backgroundColor: 'var(--signal-accent)'} : defaultStyles} {...props}>
      {children}
    </button>
  );
};
