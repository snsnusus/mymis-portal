import { type RouteObject } from 'react-router-dom';
import { loadable } from '~/utils/loadable';

const CreateEmployee = loadable(() => import('~/pages/employees/create'));

export const routes: RouteObject = {
  path: 'employees',
  handle: { crumb: 'Employees' },
  children: [
    {
      index: true, // renders at exactly /employees
      element: <>THE LIST IS HERE...</>,
    },
    {
      path: 'create',
      element: <CreateEmployee />,
      handle: { crumb: 'Create Employee' },
    },
  ],
};
