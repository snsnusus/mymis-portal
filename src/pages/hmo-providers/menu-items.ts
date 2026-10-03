import type { MenuItem } from '~/models/sidebar.model';

import HealthAndSafetyIcon from '@mui/icons-material/HealthAndSafety';

export const menuItems: MenuItem = {
  icon: HealthAndSafetyIcon,
  label: 'HMO Providers',
  children: [
    {
      icon: HealthAndSafetyIcon,
      path: '/data-management/hmo-providers',
      label: 'List',
    },
    {
      icon: HealthAndSafetyIcon,
      path: '/data-management/hmo-providers/create-provider',
      label: 'Create Provider',
    },
  ],
};
