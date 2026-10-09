import { createBrowserRouter } from 'react-router-dom';
import { ROUTES } from '../constants/routes';

import { LandingLayout } from '../components/layouts/LandingLayout';
import { AuthLayout } from '../components/layouts/AuthLayout';
import { DashboardLayout } from '../components/layouts/DashboardLayout';
import { ProtectedRoute } from './ProtectedRoute';

import { Landing } from '../pages/landing/Landing';
import { Login } from '../pages/auth/login/Login';
import { Dashboard } from '../pages/dashboard/Dashboard';
import { Treemap } from '../pages/treemap/Treemap';
import { AccountSettings } from '../pages/account/AccountSettings';

export const router = createBrowserRouter([
  {
    path: ROUTES.LANDING,
    element: <LandingLayout />,
    children: [
      { index: true, element: <Landing /> },
      { path: 'landing/*', element: <Landing /> }
    ]
  },
  {
    path: ROUTES.AUTH,
    element: <AuthLayout />,
    children: [
      { path: 'login', element: <Login /> }
    ]
  },
  {
    path: ROUTES.APP,
    element: <ProtectedRoute />,
    children: [
      {
        path: '',
        element: <DashboardLayout />,
        children: [
          { index: true, element: <Dashboard /> },
          { path: 'dashboard', element: <Dashboard /> },
          { path: 'treemap', element: <Treemap /> },
          { path: 'account', element: <AccountSettings /> }
        ]
      }
    ]
  }
]);
