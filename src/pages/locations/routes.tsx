import { type RouteObject } from 'react-router-dom';
import { loadable } from '~/utils/loadable';

const Barangays = loadable(() => import('./barangays'));
const Cities = loadable(() => import('./cities'));
const Offices = loadable(() => import('./offices'));
const Regions = loadable(() => import('./regions'));

export const routes: RouteObject = {
  path: 'locations',
  handle: { crumb: 'Locations', linkable: false },
  children: [
    {
      path: 'regions',
      element: <Regions />,
      handle: { crumb: 'Regions' },
    },
    {
      path: 'cities',
      element: <Cities />,
      handle: { crumb: 'Cities' },
    },
    {
      path: 'barangays',
      element: <Barangays />,
      handle: { crumb: 'Barangays' },
    },
    {
      path: 'offices',
      element: <Offices />,
      handle: { crumb: 'Offices' },
    },
  ],
};
