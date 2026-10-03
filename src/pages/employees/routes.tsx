import { type RouteObject } from 'react-router-dom';
import { loadable } from '~/utils/loadable';

const EmployeesCreate = loadable(() => import('~/pages/employees/create'));

export const routes: RouteObject = {
  path: 'employees',
  handle: { crumb: 'Employees' },
  children: [
    {
      index: true,
      element: <>THE LIST IS HERE...</>,
    },
    {
      path: 'create',
      element: <EmployeesCreate />,
      handle: { crumb: 'Create' },
    },
  ],
};
