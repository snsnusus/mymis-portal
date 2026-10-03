import { type RouteObject } from 'react-router-dom';
import { loadable } from '~/utils/loadable';

const HMOProviderList = loadable(() => import('~/pages/hmo-providers/list'));
const CreateProvider = loadable(
  () => import('~/pages/hmo-providers/create-provider')
);

export const routes: RouteObject = {
  path: 'hmo-providers',
  handle: { crumb: 'HMO Providers' },
  children: [
    { index: true, element: <HMOProviderList /> },
    {
      path: 'create-provider',
      element: <CreateProvider />,
      handle: { crumb: 'Create Provider' },
    },
  ],
};
