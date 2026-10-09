import { Link, useLocation } from 'react-router-dom';
import { ROUTES } from '../../constants/routes';

const NavItem = ({ to, icon, label, isActive }) => {
  return (
    <Link 
      to={to} 
      style={{ 
        display: 'flex', 
        alignItems: 'center', 
        gap: '12px',
        padding: '10px 16px', 
        textDecoration: 'none', 
        backgroundColor: isActive ? 'rgba(255, 255, 255, 0.05)' : 'transparent',
        borderLeft: isActive ? '3px solid var(--signal-accent)' : '3px solid transparent',
        color: isActive ? 'var(--signal-accent)' : 'var(--text-secondary)',
        transition: 'all 0.2s ease'
      }}
    >
      <span style={{ fontSize: '16px' }}>{icon}</span>
      <span className="text-body-sm" style={{ fontWeight: isActive ? 'bold' : 'normal' }}>{label}</span>
    </Link>
  );
};

export const Sidebar = () => {
  const location = useLocation();
  
  return (
    <aside className="surface-level-1" style={{ width: '240px', borderRight: '1px solid var(--border-active)', display: 'flex', flexDirection: 'column' }}>
      
      {/* Logo */}
      <div style={{ padding: 'var(--spacing-xl) var(--spacing-lg)', display: 'flex', alignItems: 'center', gap: '8px' }}>
        <div style={{ display: 'flex', gap: '2px', alignItems: 'flex-end', height: '16px' }}>
          <div style={{ width: '3px', height: '60%', backgroundColor: 'var(--signal-accent)' }}></div>
          <div style={{ width: '3px', height: '100%', backgroundColor: 'var(--signal-accent)' }}></div>
          <div style={{ width: '3px', height: '40%', backgroundColor: 'var(--signal-bullish)' }}></div>
        </div>
        <span className="text-headline-sm" style={{ letterSpacing: '1px', fontSize: '14px' }}>PULSE CORE</span>
      </div>

      {/* Nav */}
      <nav style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '4px' }}>
        <NavItem to="#" icon="🏠" label="Overview" isActive={false} />
        <NavItem to={ROUTES.DASHBOARD} icon="📊" label="Terminal / Live Chart" isActive={true} />
        <NavItem to="#" icon="🔲" label="Constituent Treemap" isActive={false} />
        <NavItem to="#" icon="📋" label="Option Chain OI" isActive={false} />
        <NavItem to="#" icon="📉" label="Orderflow & Depth" isActive={false} />
        <NavItem to="#" icon="⚙️" label="Terminal Settings" isActive={false} />
      </nav>

      {/* Footer Metrics */}
      <div style={{ padding: 'var(--spacing-lg)', borderTop: '1px solid var(--border-ghost)' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
          <span className="text-data-mono-sm" style={{ color: 'var(--text-muted)' }}>GATEWAY:</span>
          <span className="text-data-mono-sm" style={{ color: 'var(--signal-bullish)' }}>NSE DIRECT</span>
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
          <span className="text-data-mono-sm" style={{ color: 'var(--text-muted)' }}>LATENCY:</span>
          <span className="text-data-mono-sm" style={{ color: 'var(--signal-accent)' }}>11.4 ms</span>
        </div>
      </div>
      
    </aside>
  );
};
