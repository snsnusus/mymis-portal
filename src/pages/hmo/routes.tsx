import { type RouteObject } from 'react-router-dom';
import { loadable } from '~/utils/loadable';

const HMO = loadable(() => import('~/pages/hmo'));
const CreateHMOProvider = loadable(() => import('~/pages/hmo/create'));

export const routes: RouteObject = {
  path: 'hmo',
  handle: { crumb: 'HMO' },
  children: [
    { index: true, element: <HMO /> },
    {
      path: 'create',
      element: <CreateHMOProvider />,
      handle: { crumb: 'Create' },
    },
  ],
};
