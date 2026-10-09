import { Outlet } from 'react-router-dom';

export const MainLayout = () => {
  return (
    <div className="surface-level-1" style={{ minHeight: '100vh' }}>
      <header style={{ padding: 'var(--spacing-lg)', borderBottom: '1px solid var(--border-active)' }}>
        <h1 className="text-headline-sm">Trade Bot Platform</h1>
      </header>
      <main>
        <Outlet />
      </main>
    </div>
  );
};
