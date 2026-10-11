import { useState, useEffect } from 'react';
import { Outlet, Link, useNavigate } from 'react-router-dom';
import { ROUTES } from '../../constants/routes';
import { Button } from '../ui/Button';

export const LandingLayout = () => {
  const [activeSection, setActiveSection] = useState('terminal');
  const navigate = useNavigate();

  const navItems = [
    { id: 'terminal', label: 'TERMINAL' },
    { id: 'features', label: 'Features' },
    { id: 'integrations', label: 'Integrations' },
    { id: 'pricing', label: 'Pricing' },
    { id: 'documentation', label: 'Documentation' }
  ];

  const scrollToSection = (id) => {
    setActiveSection(id);
    const element = document.getElementById(id);
    if (element) {
      const headerOffset = 64;
      const elementPosition = element.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.pageYOffset - headerOffset;
      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth'
      });
    }
  };

  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.scrollY + 100;
      for (const item of navItems) {
        const el = document.getElementById(item.id);
        if (el) {
          const top = el.offsetTop;
          const height = el.offsetHeight;
          if (scrollPosition >= top && scrollPosition < top + height) {
            setActiveSection(item.id);
            break;
          }
        }
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div className="surface-level-1" style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <header 
        style={{ 
          padding: '0.75rem var(--spacing-xl)', 
          borderBottom: '1px solid rgba(51, 65, 85, 0.4)', 
          display: 'flex', 
          justifyContent: 'space-between', 
          alignItems: 'center', 
          backgroundColor: 'rgba(11, 15, 25, 0.88)',
          backdropFilter: 'blur(12px)',
          position: 'sticky',
          top: 0,
          zIndex: 100
        }}
      >
        {/* Left: Brand & Nav */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--spacing-xl)' }}>
          <div 
            onClick={() => scrollToSection('terminal')} 
            style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }}
          >
            <div style={{ width: '24px', height: '24px', backgroundColor: '#06b6d4', borderRadius: '4px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#070a12', fontWeight: 900, fontSize: '13px' }}>
              P
            </div>
            <h1 className="text-headline-sm" style={{ letterSpacing: '0.05em', fontSize: '16px', fontWeight: 800 }}>
              INDEX<span style={{ color: 'var(--signal-accent)' }}>PULSE</span>
            </h1>
          </div>
          
          <div className="text-data-mono-sm" style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '11px', backgroundColor: 'rgba(16, 185, 129, 0.1)', padding: '3px 8px', borderRadius: '4px', border: '1px solid rgba(16, 185, 129, 0.25)' }}>
            <span style={{ width: '6px', height: '6px', borderRadius: '50%', backgroundColor: 'var(--signal-bullish)' }}></span>
            <span style={{ color: 'var(--signal-bullish)' }}>NSE: +0.58 (TICK)</span>
          </div>

          <div style={{ fontSize: '11px', color: 'var(--text-muted)' }} className="hidden sm:block">
            Nifty 50, FinNifty
          </div>
        </div>

        {/* Center: Interactive Navigation Links */}
        <nav style={{ display: 'flex', gap: '24px', alignItems: 'center' }}>
          {navItems.map((item) => {
            const isActive = activeSection === item.id;
            return (
              <button
                key={item.id}
                onClick={() => scrollToSection(item.id)}
                style={{
                  background: 'none',
                  border: 'none',
                  outline: 'none',
                  cursor: 'pointer',
                  color: isActive ? 'var(--signal-accent)' : 'var(--text-secondary)',
                  fontWeight: isActive ? 600 : 400,
                  fontSize: '12px',
                  fontFamily: 'var(--font-sans)',
                  borderBottom: isActive ? '2px solid var(--signal-accent)' : '2px solid transparent',
                  padding: '4px 0',
                  transition: 'color 0.2s ease, border-color 0.2s ease'
                }}
                onMouseEnter={(e) => {
                  if (!isActive) e.currentTarget.style.color = 'var(--text-primary)';
                }}
                onMouseLeave={(e) => {
                  if (!isActive) e.currentTarget.style.color = 'var(--text-secondary)';
                }}
              >
                {item.label}
              </button>
            );
          })}
        </nav>

        {/* Right: Actions */}
        <div style={{ display: 'flex', gap: 'var(--spacing-md)', alignItems: 'center' }}>
          <Link to={ROUTES.LOGIN} style={{ textDecoration: 'none' }}>
            <span style={{ fontSize: '12px', color: 'var(--text-secondary)', cursor: 'pointer', paddingRight: '8px', transition: 'color 0.2s' }}>
              Sign In &gt;
            </span>
          </Link>
          <Link to={ROUTES.APP} style={{ textDecoration: 'none' }}>
            <Button variant="primary" style={{ padding: '7px 16px', fontSize: '12px', backgroundColor: '#06b6d4', color: '#070a12', fontWeight: 700, borderRadius: '4px', border: 'none' }}>
              Launch Terminal &rarr;
            </Button>
          </Link>
        </div>
      </header>

      <main style={{ flex: 1 }}>
        <Outlet />
      </main>
    </div>
  );
};
