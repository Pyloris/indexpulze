import { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { User, Settings, Moon, LogOut, ChevronRight } from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';

const MenuItem = ({ icon: Icon, label, rightElement, onClick, isDanger }) => {
  const [isHovered, setIsHovered] = useState(false);
  return (
    <div
      onClick={onClick}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '10px 16px',
        cursor: 'pointer',
        backgroundColor: isHovered ? 'var(--bg-hover)' : 'transparent',
        transition: 'background-color 0.15s ease'
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
        <Icon size={16} color={isDanger ? 'var(--signal-bearish)' : 'var(--text-secondary)'} />
        <span className="text-body-sm" style={{ color: isDanger ? 'var(--signal-bearish)' : 'var(--text-primary)' }}>{label}</span>
      </div>
      {rightElement}
    </div>
  );
};

export const UserMenu = () => {
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef();
  const { logout } = useAuth();
  const navigate = useNavigate();

  const handleNavigate = (path) => {
    setIsOpen(false);
    navigate(path);
  };

  const handleLogout = () => {
    logout();
    navigate('/auth/login');
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div style={{ position: 'relative' }} ref={menuRef}>
      <div 
        onClick={() => setIsOpen(!isOpen)}
        style={{ width: '32px', height: '32px', borderRadius: '50%', backgroundColor: 'var(--signal-accent)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--bg-canvas)', fontSize: '14px', cursor: 'pointer', fontWeight: 'bold' }}
      >
        SW
      </div>

      {isOpen && (
        <div style={{ position: 'absolute', top: 'calc(100% + 12px)', right: 0, width: '280px', backgroundColor: 'var(--bg-canvas)', border: '1px solid var(--border-active)', borderRadius: '8px', boxShadow: '0 8px 24px rgba(0,0,0,0.5)', zIndex: 100, overflow: 'hidden' }}>
          
          {/* Profile Header */}
          <div style={{ padding: '16px', display: 'flex', gap: '12px', alignItems: 'center', borderBottom: '1px solid var(--border-ghost)' }}>
            <div style={{ width: '40px', height: '40px', borderRadius: '50%', backgroundColor: 'rgba(255,255,255,0.05)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--text-primary)', fontSize: '16px' }}>
              SW
            </div>
            <div style={{ display: 'flex', flexDirection: 'column' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span className="text-body-md" style={{ fontWeight: 'bold', color: 'var(--text-primary)' }}>Shoaib Wani</span>
                <span className="text-label-caps" style={{ backgroundColor: 'rgba(6, 182, 212, 0.1)', color: 'var(--signal-accent)', padding: '2px 6px', borderRadius: '4px', fontSize: '10px' }}>Admin</span>
              </div>
              <span className="text-body-sm" style={{ color: 'var(--text-muted)' }}>shoaib+snapsec@snapsec.co</span>
            </div>
          </div>

          {/* Links */}
          <div style={{ padding: '8px 0' }}>
            <MenuItem icon={User} label="My Account" onClick={() => handleNavigate('/app/account')} />
            <MenuItem icon={Settings} label="Settings" onClick={() => handleNavigate('/app/account')} rightElement={<ChevronRight size={16} color="var(--text-secondary)" />} />
          </div>

          {/* Preferences */}
          <div style={{ borderTop: '1px solid var(--border-ghost)', borderBottom: '1px solid var(--border-ghost)', padding: '8px 0' }}>
            <MenuItem 
              icon={Moon} 
              label="Dark Mode" 
              rightElement={
                <div style={{ width: '32px', height: '18px', backgroundColor: 'var(--signal-accent)', borderRadius: '10px', position: 'relative' }}>
                  <div style={{ width: '14px', height: '14px', backgroundColor: '#fff', borderRadius: '50%', position: 'absolute', right: '2px', top: '2px' }}></div>
                </div>
              } 
            />
          </div>

          {/* Logout */}
          <div style={{ padding: '8px 0' }}>
            <MenuItem icon={LogOut} label="Logout" isDanger={true} onClick={handleLogout} />
          </div>

        </div>
      )}
    </div>
  );
};
