import { Outlet } from 'react-router-dom';
import { Sidebar } from '../common/Sidebar';
import { Topbar } from '../common/Topbar';

export const DashboardLayout = () => {
  return (
    <div style={{ minHeight: '100vh', display: 'flex', backgroundColor: 'var(--bg-canvas)' }}>
      <Sidebar />
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
        <Topbar />
        <main style={{ flex: 1, padding: 'var(--spacing-lg)', overflowY: 'auto' }}>
          <Outlet />
        </main>
      </div>
    </div>
  );
};
