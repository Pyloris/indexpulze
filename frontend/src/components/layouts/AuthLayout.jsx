import { Outlet, Link } from 'react-router-dom';
import { ROUTES } from '../../constants/routes';

export const AuthLayout = () => {
  return (
    <div style={{ 
      minHeight: '100vh', 
      display: 'flex', 
      flexDirection: 'column',
      alignItems: 'center', 
      justifyContent: 'center', 
      backgroundColor: 'var(--bg-canvas)',
      backgroundImage: 'radial-gradient(circle at center, rgba(6, 182, 212, 0.05) 0%, transparent 70%), linear-gradient(rgba(255,255,255,0.02) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.02) 1px, transparent 1px)',
      backgroundSize: '100% 100%, 40px 40px, 40px 40px',
      padding: 'var(--spacing-xl)'
    }}>
      
      {/* Auth Header */}
      <div style={{ textAlign: 'center', marginBottom: 'var(--spacing-xl)' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '12px', marginBottom: '8px' }}>
          <div style={{ width: '32px', height: '32px', backgroundColor: 'var(--bg-panel)', border: '1px solid var(--border-active)', borderRadius: '8px', display: 'flex', gap: '2px', alignItems: 'flex-end', justifyContent: 'center', padding: '6px' }}>
            <div style={{ width: '3px', height: '60%', backgroundColor: 'var(--signal-accent)' }}></div>
            <div style={{ width: '3px', height: '100%', backgroundColor: 'var(--signal-accent)' }}></div>
            <div style={{ width: '3px', height: '40%', backgroundColor: 'var(--signal-bullish)' }}></div>
          </div>
          <h1 className="text-headline-sm" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            TradeBot <span style={{ fontSize: '10px', padding: '2px 6px', backgroundColor: 'rgba(6, 182, 212, 0.1)', color: 'var(--signal-accent)', borderRadius: '4px', border: '1px solid var(--signal-accent)' }}>V4.1.8-PRO</span>
          </h1>
        </div>
      </div>

      <main className="surface-level-2" style={{ padding: 'calc(var(--spacing-xl) * 1.5)', width: '100%', maxWidth: '520px', borderRadius: 'var(--radius-lg)', boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5)' }}>
        <Outlet />
      </main>

      {/* Auth Footer */}
      <div style={{ textAlign: 'center', marginTop: 'var(--spacing-xl)', maxWidth: '520px' }}>
        <Link to={ROUTES.LANDING} style={{ color: 'var(--signal-accent)', textDecoration: 'none', display: 'inline-block', marginBottom: 'var(--spacing-xl)' }} className="text-body-sm">
          Explore live public indices in Read-Only Guest Mode &rarr;
        </Link>
      </div>

    </div>
  );
};
