export const Landing = () => {
  return (
    <div style={{ padding: 'var(--spacing-xl)' }}>
      <h1 className="text-headline-xl">Terminal Precision</h1>
      <p className="text-body-lg" style={{ color: 'var(--text-secondary)' }}>
        React app initialized with the custom design system.
      </p>

      <div style={{ marginTop: 'var(--spacing-xl)', display: 'flex', gap: 'var(--spacing-md)' }}>
        <button className="btn-buy">Buy CE</button>
        <button className="btn-sell">Sell PE</button>
        <button className="btn-secondary">Settings</button>
      </div>
      
      <div style={{ marginTop: 'var(--spacing-xl)' }} className="surface-level-2">
        <div style={{ padding: 'var(--spacing-lg)' }}>
          <p className="text-data-mono-lg">NIFTY 50: 22,453.30</p>
          <p className="text-data-mono-sm" style={{ color: 'var(--signal-bullish)' }}>+143.20 (+0.64%)</p>
        </div>
      </div>
    </div>
  );
};
