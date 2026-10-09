import { Outlet, Link } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { ROUTES } from '../../constants/routes';

export const DashboardLayout = () => {
  const { logout, user } = useAuth();

  return (
    <div style={{ minHeight: '100vh', display: 'flex', backgroundColor: 'var(--bg-canvas)' }}>
      {/* Sidebar */}
      <aside className="surface-level-1" style={{ width: '250px', borderRight: '1px solid var(--border-active)', display: 'flex', flexDirection: 'column' }}>
        <div style={{ padding: 'var(--spacing-lg)', borderBottom: '1px solid var(--border-active)' }}>
          <h1 className="text-headline-sm" style={{ color: 'var(--signal-accent)' }}>Trade Bot Pro</h1>
        </div>
        <nav style={{ flex: 1, padding: 'var(--spacing-md)', display: 'flex', flexDirection: 'column', gap: 'var(--spacing-sm)' }}>
          <Link to={ROUTES.DASHBOARD} className="text-body-lg" style={{ color: 'var(--text-primary)', textDecoration: 'none', padding: 'var(--spacing-sm)', backgroundColor: 'var(--bg-hover)', borderRadius: 'var(--radius-sm)' }}>Dashboard</Link>
          <Link to="#" className="text-body-lg" style={{ color: 'var(--text-secondary)', textDecoration: 'none', padding: 'var(--spacing-sm)', borderRadius: 'var(--radius-sm)' }}>Portfolios</Link>
          <Link to="#" className="text-body-lg" style={{ color: 'var(--text-secondary)', textDecoration: 'none', padding: 'var(--spacing-sm)', borderRadius: 'var(--radius-sm)' }}>Algorithms</Link>
        </nav>
      </aside>

      {/* Main Content Area */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
        {/* Top bar */}
        <header className="surface-level-1" style={{ padding: 'var(--spacing-md) var(--spacing-lg)', borderBottom: '1px solid var(--border-active)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div className="text-body-md" style={{ color: 'var(--text-secondary)' }}>Market Status: <span style={{ color: 'var(--signal-bullish)' }}>Open</span></div>
          
          <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--spacing-md)' }}>
            <button className="btn-secondary" style={{ padding: '6px' }} title="Notifications">🔔</button>
            <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--spacing-sm)' }}>
              <div style={{ width: '32px', height: '32px', borderRadius: '50%', backgroundColor: 'var(--bg-hover)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                👤
              </div>
              <span className="text-body-md">{user?.username || 'Trader'}</span>
              <button onClick={logout} className="text-body-sm" style={{ color: 'var(--signal-bearish)', marginLeft: 'var(--spacing-sm)' }}>Logout</button>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main style={{ flex: 1, padding: 'var(--spacing-lg)', overflowY: 'auto' }}>
          <Outlet />
        </main>
      </div>
    </div>
  );
};
