export const Badge = ({ children, variant = 'default', style = {}, ...props }) => {
  let baseStyle = { 
    padding: '2px 6px', 
    borderRadius: 'var(--radius-sm)', 
    fontSize: '10px', 
    textTransform: 'uppercase', 
    letterSpacing: '0.06em', 
    fontFamily: 'var(--font-mono)', 
    fontWeight: 600,
    display: 'inline-block',
    ...style
  };
  
  if (variant === 'success') {
    baseStyle.backgroundColor = 'var(--signal-bullish-tint)';
    baseStyle.color = 'var(--signal-bullish)';
  } else if (variant === 'danger') {
    baseStyle.backgroundColor = 'var(--signal-bearish-tint)';
    baseStyle.color = 'var(--signal-bearish)';
  } else if (variant === 'accent') {
    baseStyle.backgroundColor = 'rgba(6, 182, 212, 0.12)';
    baseStyle.color = 'var(--signal-accent)';
  } else {
    baseStyle.backgroundColor = 'var(--bg-hover)';
    baseStyle.color = 'var(--text-secondary)';
    baseStyle.border = '1px solid var(--border-active)';
  }

  return <span style={baseStyle} {...props}>{children}</span>;
}
