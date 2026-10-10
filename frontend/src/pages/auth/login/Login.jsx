import { Helmet } from 'react-helmet-async';
import { User, Key, Unlock } from 'lucide-react';
import { useAuth } from '../../../hooks/useAuth';
import { Button } from '../../../components/ui/Button';
import { Input } from '../../../components/ui/Input';

export const Login = () => {
  const { login } = useAuth();

  const handleLogin = (e) => {
    e.preventDefault();
    login({ username: 'trader' }, 'dummy-token');
  };

  return (
    <>
    <Helmet>
      <title>Login - Pulse Core Terminal</title>
    </Helmet>
    <div>
      {/* Form */}

      {/* Form */}
      <form onSubmit={handleLogin}>
        <Input 
          label="TRADING ID / REGISTERED EMAIL" 
          icon={<User size={16} />} 
          placeholder="e.g. INX-88291 or trader@desk.in" 
        />
        
        <Input 
          label="PASSWORD / TERMINAL PIN" 
          rightLabel="Forgot PIN?"
          icon={<Key size={16} />} 
          type="password"
          placeholder="••••••••" 
        />
        
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 'var(--spacing-xl)' }}>
          <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }}>
            <input type="checkbox" defaultChecked style={{ accentColor: 'var(--signal-accent)', width: '16px', height: '16px' }} />
            <span className="text-body-sm" style={{ color: 'var(--text-secondary)' }}>Remember this terminal workstation</span>
          </label>
          {/* <span className="text-data-mono-sm" style={{ color: 'var(--text-muted)' }}>DESK-ID-04</span> */}
        </div>

        <Button type="submit" variant="primary" style={{ width: '100%', marginBottom: 'var(--spacing-xl)', padding: '12px' }}>
          <Unlock size={18} style={{ marginRight: '8px' }} /> Sign In to Terminal
        </Button>


      </form>
    </div>
    </>
  );
};
