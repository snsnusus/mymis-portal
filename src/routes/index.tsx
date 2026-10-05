import { type ReactElement } from 'react';
import {
  createBrowserRouter,
  RouterProvider,
  type RouteObject,
} from 'react-router-dom';
import { ProtectedRoute } from '~/routes/protected-route';
import { loadable } from '~/utils/loadable';
import { RouteError } from '~/routes/route-error';

import NotFound from '~/pages/not-found';

import { routes as departmentsRoutes } from '~/pages/departments/routes';
import { routes as employeesRoutes } from '~/pages/employees/routes';
import { routes as hMORoutes } from '~/pages/hmo-providers/routes';
import { routes as locationRoutes } from '~/pages/locations/routes';

const App = loadable(() => import('~/App'));
const Dashboard = loadable(() => import('~/pages/dashboard'));
const Login = loadable(() => import('~/pages/login'));
const Profile = loadable(() => import('~/pages/profile'));

const routesConfig: RouteObject[] = [
  {
    path: '/',
    element: (
      <ProtectedRoute>
        <App />
      </ProtectedRoute>
    ),
    handle: { crumb: 'Dashboard' },
    children: [
      {
        errorElement: <RouteError />,
        children: [
          { index: true, element: <Dashboard /> },
          {
            path: 'profile',
            element: <Profile />,
            handle: { crumb: 'Profile' },
          },
          employeesRoutes,
          {
            path: 'data-management',
            handle: { crumb: 'Data Management', linkable: false },
            children: [departmentsRoutes, hMORoutes, locationRoutes],
          },
          {
            path: '*',
            element: <NotFound />,
            handle: { crumb: 'Page Not Found' },
          },
        ],
      },
    ],
  },
  {
    path: '/login',
    element: <Login />,
  },
];

const router = createBrowserRouter(routesConfig);

const AppRouter = (): ReactElement => <RouterProvider router={router} />;

export default AppRouter;
