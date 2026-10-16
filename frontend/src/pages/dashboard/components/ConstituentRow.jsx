export const ConstituentRow = ({
  symbol,
  rawSymbol,
  weight,
  price,
  change,
  changePct,
  vol,
  volMult,
  pts,
  isPositive,
  onClick,
}) => {
  return (
    <div
      onClick={onClick}
      role="button"
      tabIndex={0}
      title={`Click to analyze ${symbol} Volume Profile`}
      style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: '10px 8px',
        borderBottom: '1px solid var(--border-ghost)',
        borderRadius: 'var(--radius-sm, 4px)',
        cursor: onClick ? 'pointer' : 'default',
        transition: 'background-color 0.15s ease, transform 0.15s ease',
      }}
      onMouseEnter={(e) => {
        if (onClick) {
          e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.05)';
        }
      }}
      onMouseLeave={(e) => {
        if (onClick) {
          e.currentTarget.style.backgroundColor = 'transparent';
        }
      }}
    >
      <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <span className="text-data-mono-sm" style={{ fontWeight: 'bold' }}>
            {symbol}
          </span>
          <span
            style={{
              fontSize: '10px',
              backgroundColor: 'var(--bg-hover)',
              padding: '2px 4px',
              borderRadius: '4px',
              color: 'var(--text-muted)',
            }}
          >
            Weight {weight}
          </span>
        </div>
        <div className="text-data-mono-sm">
          <span>{price} </span>
          <span style={{ color: isPositive ? 'var(--signal-bullish)' : 'var(--signal-bearish)' }}>
            {changePct}
          </span>
        </div>
      </div>
      <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
        {vol && (
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '2px' }}>
            <span className="text-body-sm" style={{ color: 'var(--text-secondary)' }}>
              &bull; Vol: {vol}
            </span>
            {volMult && <span className="text-body-sm" style={{ color: 'var(--text-muted)' }}>({volMult})</span>}
          </div>
        )}
        <div
          className="text-data-mono-sm"
          style={{
            backgroundColor: isPositive ? 'rgba(34, 197, 94, 0.12)' : 'rgba(239, 68, 68, 0.12)',
            color: isPositive ? 'var(--signal-bullish)' : 'var(--signal-bearish)',
            padding: '4px 8px',
            borderRadius: '4px',
            minWidth: '68px',
            textAlign: 'center',
            fontWeight: 600,
          }}
        >
          {pts} pts
        </div>
        {onClick && (
          <span
            style={{
              color: 'var(--text-muted)',
              fontSize: '12px',
              display: 'flex',
              alignItems: 'center',
            }}
            title="Open Stock Volume Profile"
          >
            →
          </span>
        )}
      </div>
    </div>
  );
};
