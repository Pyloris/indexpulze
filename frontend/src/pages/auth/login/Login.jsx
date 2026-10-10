import { useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { User, Key, Unlock } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../../hooks/useAuth';
import { Button } from '../../../components/ui/Button';
import { Input } from '../../../components/ui/Input';
import { useLoginMutation } from '../../../services/auth-api';

export const Login = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [loginMutation, { isLoading, error }] = useLoginMutation();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const response = await loginMutation({ username, password }).unwrap();
      const authData = response.data.data;
      login(authData.user, authData.token);
      navigate('/app');
    } catch (err) {
      console.error('Failed to log in:', err);
    }
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
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />
        
        <Input 
          label="PASSWORD / TERMINAL PIN" 
          rightLabel="Forgot PIN?"
          icon={<Key size={16} />} 
          type="password"
          placeholder="••••••••" 
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        
        {error && (
          <div style={{ color: 'var(--signal-bearish)', marginBottom: 'var(--spacing-md)', fontSize: '14px' }}>
            {error.data?.error?.message || 'Login failed. Please check your credentials.'}
          </div>
        )}
        
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 'var(--spacing-xl)' }}>
          <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }}>
            <input type="checkbox" defaultChecked style={{ accentColor: 'var(--signal-accent)', width: '16px', height: '16px' }} />
            <span className="text-body-sm" style={{ color: 'var(--text-secondary)' }}>Remember this terminal workstation</span>
          </label>
          {/* <span className="text-data-mono-sm" style={{ color: 'var(--text-muted)' }}>DESK-ID-04</span> */}
        </div>

        <Button type="submit" variant="primary" style={{ width: '100%', marginBottom: 'var(--spacing-xl)', padding: '12px' }} disabled={isLoading}>
          <Unlock size={18} style={{ marginRight: '8px' }} /> {isLoading ? 'Authenticating...' : 'Sign In to Terminal'}
        </Button>


      </form>
    </div>
    </>
  );
};
