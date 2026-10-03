import { type RouteObject } from 'react-router-dom';
import { type RouteHandle } from '~/hooks/use-breadcrumbs';
import { loadable } from '~/utils/loadable';

const DepartmentCreate = loadable(() => import('~/pages/departments/create'));
const DepartmentDetail = loadable(() => import('~/pages/departments/detail'));
const DepartmentList = loadable(() => import('~/pages/departments/list'));

export const routes: RouteObject = {
  path: 'departments',
  handle: { crumb: 'Departments' },
  children: [
    { index: true, element: <DepartmentList /> },
    {
      path: 'create',
      element: <DepartmentCreate />,
      handle: { crumb: 'Create' },
    },
    {
      path: ':id/:name',
      element: <DepartmentDetail />,
      handle: {
        crumb: ({ params }) => params.name ?? 'Department',
      } satisfies RouteHandle,
    },
  ],
};
