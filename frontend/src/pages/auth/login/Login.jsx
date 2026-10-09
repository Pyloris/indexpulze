import { useAuth } from '../../../hooks/useAuth';

export const Login = () => {
  const { login } = useAuth();

  const handleLogin = (e) => {
    e.preventDefault();
    login({ username: 'trader' }, 'dummy-token');
  };

  return (
    <div style={{ padding: 'var(--spacing-xl)' }}>
      <h1 className="text-headline-lg">Login</h1>
      <form onSubmit={handleLogin} style={{ marginTop: 'var(--spacing-md)' }}>
        <button type="submit" className="btn-buy">Login Now</button>
      </form>
    </div>
  );
};
