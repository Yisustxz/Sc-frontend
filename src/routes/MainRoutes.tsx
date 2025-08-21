import { lazy } from 'react';

// project imports
import MainLayout from 'layout/MainLayout';
import Loadable from 'components/Loadable';
import { RouteObject } from 'react-router';

// pages
import GeneralRoutes from './GeneralRoutes';
import CompanyRoutes from './CompanyRoutes';
import Logout from 'views/logout';

// dashboard routing
const DashboardDefault = Loadable(lazy(() => import('views/dashboard/Default')));

// ==============================|| MAIN ROUTING ||============================== //

const MainRoutes: RouteObject = {
  path: '/',
  element: <MainLayout />,
  children: [
    {
      path: '/',
      element: <DashboardDefault />
    },
    {
      path: 'dashboard',
      children: [
        {
          path: 'default',
          element: <DashboardDefault />
        }
      ]
    },
    ...GeneralRoutes,
    ...CompanyRoutes,
    {
      path: 'logout',
      element: <Logout />
    }
  ]
};

export default MainRoutes;
