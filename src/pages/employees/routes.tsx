import { type RouteObject } from 'react-router-dom';
import { loadable } from '~/utils/loadable';

const EmployeeList = loadable(() => import('~/pages/employees/list'));
const EmployeesCreate = loadable(() => import('~/pages/employees/create'));

export const routes: RouteObject = {
  path: 'employees',
  handle: { crumb: 'Employees' },
  children: [
    {
      index: true,
      element: <EmployeeList />,
    },
    {
      path: 'create',
      element: <EmployeesCreate />,
      handle: { crumb: 'Create' },
    },
  ],
};
