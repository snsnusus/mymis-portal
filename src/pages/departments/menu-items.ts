import type { MenuItem } from '~/models/sidebar.model';

import ListIcon from '@mui/icons-material/List';
import BusinessIcon from '@mui/icons-material/Business';
import DomainAddIcon from '@mui/icons-material/DomainAdd';

export const menuItems: MenuItem = {
  icon: BusinessIcon,
  label: 'Departments',
  children: [
    {
      icon: ListIcon,
      path: '/data-management/departments',
      label: 'List',
    },
    {
      icon: DomainAddIcon,
      path: '/data-management/departments/create',
      label: 'Create',
    },
  ],
};
