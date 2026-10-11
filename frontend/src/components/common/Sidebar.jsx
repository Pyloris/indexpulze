import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { 
  Home, 
  Activity, 
  LayoutGrid, 
  List, 
  BarChart2, 
  Settings2,
  PieChart,
  Sliders,
  TrendingUp,
  User
} from 'lucide-react';
import { SIDEBAR_MENU_CONFIG } from '../../config/menu.config';

const ICON_MAP = {
  Home,
  Activity,
  LayoutGrid,
  List,
  BarChart2,
  Settings2,
  PieChart,
  Sliders,
  TrendingUp,
  User
};

const NavItem = ({ to, icon: IconComponent, label, isActive }) => {
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
      {IconComponent && (
        <span style={{ display: 'flex', alignItems: 'center' }}>
          <IconComponent size={18} />
        </span>
      )}
      <span className="text-body-sm" style={{ fontWeight: isActive ? 'bold' : 'normal' }}>
        {label}
      </span>
    </Link>
  );
};

export const Sidebar = () => {
  const location = useLocation();

  const isItemActive = (item) => {
    if (item.matchPaths && Array.isArray(item.matchPaths)) {
      return item.matchPaths.includes(location.pathname);
    }
    return location.pathname === item.to;
  };
  
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

      {/* Nav dynamically rendered from menu.config.js */}
      <nav style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '4px' }}>
        {SIDEBAR_MENU_CONFIG.map((item) => (
          <NavItem 
            key={item.id}
            to={item.to} 
            icon={ICON_MAP[item.icon] || Home} 
            label={item.label} 
            isActive={isItemActive(item)} 
          />
        ))}
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
