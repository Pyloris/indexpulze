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
    <div>
      {/* Form */}

      {/* Form */}
      <form onSubmit={handleLogin}>
        <Input 
          label="TRADING ID / REGISTERED EMAIL" 
          icon="🆔" 
          placeholder="e.g. INX-88291 or trader@desk.in" 
        />
        
        <Input 
          label="PASSWORD / TERMINAL PIN" 
          rightLabel="Forgot PIN?"
          icon="🔑" 
          type="password"
          placeholder="••••••••" 
        />
        
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 'var(--spacing-xl)' }}>
          <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }}>
            <input type="checkbox" defaultChecked style={{ accentColor: 'var(--signal-accent)', width: '16px', height: '16px' }} />
            <span className="text-body-sm" style={{ color: 'var(--text-secondary)' }}>Remember this terminal workstation</span>
          </label>
          <span className="text-data-mono-sm" style={{ color: 'var(--text-muted)' }}>DESK-ID-04</span>
        </div>

        <Button type="submit" variant="primary" style={{ width: '100%', marginBottom: 'var(--spacing-xl)', padding: '12px' }}>
          <span style={{ marginRight: '8px' }}>🔓</span> Sign In to Terminal
        </Button>


      </form>
    </div>
  );
};
