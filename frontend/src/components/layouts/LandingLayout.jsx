import { Outlet, Link } from 'react-router-dom';
import { ROUTES } from '../../constants/routes';
import { Badge } from '../ui/Badge';
import { Button } from '../ui/Button';

export const LandingLayout = () => {
  return (
    <div className="surface-level-1" style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <header style={{ padding: 'var(--spacing-sm) var(--spacing-xl)', borderBottom: '1px solid var(--border-active)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', backgroundColor: 'var(--bg-panel)' }}>
        
        {/* Left: Brand & Nav */}
        <div style={{ display: 'flex', alignItems: 'left', gap: 'var(--spacing-xl)' }}>
          <h1 className="text-headline-sm" style={{ letterSpacing: '1px' }}>
            TRADE<span style={{ color: 'var(--signal-accent)' }}>BOT</span>
          </h1>
          {/* <nav style={{ display: 'flex', gap: 'var(--spacing-md)' }}>
            <span className="text-body-sm" style={{ color: 'var(--signal-accent)', cursor: 'pointer', fontWeight: 'bold' }}>TERMINAL</span>
            <span className="text-body-sm" style={{ color: 'var(--text-secondary)', cursor: 'pointer' }}>LIVE HEATMAP</span>
          </nav> */}
        </div>

        {/* Center: Market Data */}
        <div style={{ display: 'flex', alignItems: 'left', gap: 'var(--spacing-lg)' }}>
          <div className="text-data-mono-sm">
            <span style={{ color: 'var(--text-secondary)' }}>NIFTY: </span>
            <span>24,852.15 </span>
            <span style={{ color: 'var(--signal-bullish)' }}>(+143.20)</span>
          </div>
          <Badge variant="success">MARKET OPEN (NSE)</Badge>
        </div>

        {/* Right: Actions */}
        <div style={{ display: 'flex', gap: 'var(--spacing-md)', alignItems: 'center' }}>
          <Link to={ROUTES.LOGIN} style={{ textDecoration: 'none' }}>
            <Button variant="ghost" style={{ padding: '4px 12px', fontSize: '12px' }}>SIGN IN</Button>
          </Link>
          <Link to={ROUTES.LOGIN} style={{ textDecoration: 'none' }}>
            <Button variant="primary" style={{ padding: '4px 12px', fontSize: '12px' }}>GET STARTED</Button>
          </Link>
        </div>
      </header>
      
      {/* Sub-header ticker band */}
      {/* <div style={{ padding: '6px var(--spacing-xl)', backgroundColor: 'var(--bg-canvas)', borderBottom: '1px solid var(--border-active)', display: 'flex', justifyContent: 'space-between' }}>
        <div className="text-data-mono-sm" style={{ color: 'var(--signal-accent)', fontSize: '10px' }}>
          &bull; SUB-SECOND CONSTITUENT ORDERFLOW DECOMPOSITION
        </div>
        <div className="text-data-mono-sm" style={{ color: 'var(--text-muted)', fontSize: '10px' }}>
          NSE: NIFTY 50 - BANKNIFTY - FINNIFTY - BSE: SENSEX
        </div>
      </div> */}

      <main style={{ flex: 1 }}>
        <Outlet />
      </main>
    </div>
  );
};
