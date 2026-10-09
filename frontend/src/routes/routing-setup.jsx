import { createBrowserRouter } from 'react-router-dom';
import { ROUTES } from '../constants/routes';

import { MainLayout } from '../components/layouts/MainLayout';
import { ProtectedRoute } from './ProtectedRoute';

import { Landing } from '../pages/landing/Landing';
import { Login } from '../pages/auth/login/Login';
import { Dashboard } from '../pages/dashboard/Dashboard';

export const router = createBrowserRouter([
  {
    path: ROUTES.LANDING,
    element: <MainLayout />,
    children: [
      { index: true, element: <Landing /> },
      { path: ROUTES.LOGIN, element: <Login /> },
      { 
        path: ROUTES.DASHBOARD, 
        element: <ProtectedRoute />, 
        children: [
          { index: true, element: <Dashboard /> }
        ] 
      }
    ]
  }
]);
