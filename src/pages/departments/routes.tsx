import { type RouteObject } from 'react-router-dom';
import { type RouteHandle } from '~/hooks/use-breadcrumbs';
import { loadable } from '~/utils/loadable';

const Departments = loadable(() => import('~/pages/departments'));
const Department = loadable(() => import('~/pages/departments/department'));
const CreateDepartment = loadable(
  () => import('~/pages/departments/create-department')
);

export const routes: RouteObject = {
  path: 'departments',
  handle: { crumb: 'Departments' },
  children: [
    { index: true, element: <Departments /> },
    {
      path: 'create',
      element: <CreateDepartment />,
      handle: { crumb: 'Create' },
    },
    {
      path: ':name/:id',
      element: <Department />,
      handle: {
        crumb: ({ params }) => params.name ?? 'Department',
      } satisfies RouteHandle,
    },
  ],
};
