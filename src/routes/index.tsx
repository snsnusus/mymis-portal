import { type ReactElement } from 'react';
import {
  createBrowserRouter,
  RouterProvider,
  Outlet,
  type RouteObject,
} from 'react-router-dom';
import { ProtectedRoute } from '~/routes/protected-route';
import { loadable } from '~/utils/loadable';

const App = loadable(() => import('~/App'));
const Login = loadable(() => import('~/pages/login'));
const Profile = loadable(() => import('~/pages/profile'));
const UsersCreate = loadable(() => import('~/pages/users/create'));
const Departments = loadable(
  () => import('~/pages/data-management/departments')
);
const Department = loadable(
  () => import('~/pages/data-management/departments/department')
);
const CreateDepartment = loadable(
  () => import('~/pages/data-management/departments/create-department')
);

const HMOProvider = loadable(
  () => import('~/pages/data-management/hmo-providers')
);
const CreateHMOProvider = loadable(
  () => import('~/pages/data-management/hmo-providers/create')
);

const routesConfig: RouteObject[] = [
  {
    path: '/',
    element: (
      <ProtectedRoute>
        <App />
      </ProtectedRoute>
    ),
    handle: { breadcrumb: 'Dashboard' },
    children: [
      {
        errorElement: <h1>NOT FOUND PAGE</h1>,
        children: [
          {
            index: true,
            element: <h1>DASHBOARD</h1>,
            handle: {
              breadcrumb: [],
            },
          },
          {
            path: 'profile',
            element: <Profile />,
            handle: { breadcrumb: [{ label: 'Profile', path: '/profile' }] },
          },
          {
            path: 'users',
            element: <Outlet />,
            handle: {
              breadcrumb: [{ label: 'Users', path: 'null' }],
            },
            children: [
              {
                index: true,
                element: <>Users: Index Page~.</>,
              },
              {
                path: 'create',
                element: <UsersCreate />,
                handle: {
                  breadcrumb: [
                    { label: 'Users', path: '/users' },
                    { label: 'Create User', path: 'null' },
                  ],
                },
              },
            ],
          },
          {
            path: 'departments/:name/:id',
            element: <Department />,
            handle: {
              breadcrumb: ({ name }: { name: string }) =>
                `Departments / ${name}`,
            },
          },
          {
            element: <Outlet />,
            children: [
              {
                path: 'data-management/departments',
                element: <Departments />,
                handle: {
                  breadcrumb: [
                    { label: 'Data Management', path: null },
                    { label: 'Department', path: null },
                  ],
                },
              },
              {
                path: 'data-management/departments/create',
                element: <CreateDepartment />,
                handle: {
                  breadcrumb: [
                    { label: 'Data Management', path: null },
                    {
                      label: 'Departments',
                      path: '/data-management/departments',
                    },
                    { label: 'Create', path: null }, // Active page (doesn't need a link)
                  ],
                },
              },
              {
                path: 'data-management/hmo-providers',
                element: <HMOProvider />,
                handle: {
                  breadcrumb: [
                    { label: 'Data Management', path: null },
                    {
                      label: 'HMO Providers',
                      path: null,
                    },
                  ],
                },
              },
              {
                path: 'data-management/hmo-providers/create',
                element: <CreateHMOProvider />,
                handle: {
                  breadcrumb: [
                    { label: 'Data Management', path: null },
                    {
                      label: 'HMO Providers',
                      path: 'data-management/hmo-providers',
                    },
                    {
                      label: 'Create',
                      path: 'null',
                    },
                  ],
                },
              },
            ],
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
