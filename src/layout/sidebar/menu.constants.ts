import type { MenuItems } from '~/models/sidebar.models';

import DashboardIcon from '@mui/icons-material/Dashboard';
import Face4Icon from '@mui/icons-material/Face4';
import PeopleAltIcon from '@mui/icons-material/PeopleAlt';
import CreateIcon from '@mui/icons-material/Create';
import ListIcon from '@mui/icons-material/List';
import BusinessIcon from '@mui/icons-material/Business';
import SettingsSuggestIcon from '@mui/icons-material/SettingsSuggest';
import HealthAndSafetyIcon from '@mui/icons-material/HealthAndSafety';

export const MENU_ITEMS: MenuItems[] = [
  {
    path: '/',
    label: 'Dashboard',
    icon: DashboardIcon,
  },
  {
    path: '/profile',
    label: 'Profile',
    icon: Face4Icon,
  },
  {
    label: 'Employees',
    icon: PeopleAltIcon,
    children: [
      {
        label: 'Create',
        path: '/employees/create',
        icon: CreateIcon,
      },
      {
        label: 'List',
        path: '/employees',
        icon: ListIcon,
      },
    ],
  },
  {
    label: 'Data Management',
    icon: SettingsSuggestIcon,
    children: [
      {
        icon: BusinessIcon,
        path: '/data-management/departments',
        label: 'Departments',
      },
      {
        icon: HealthAndSafetyIcon,
        path: '/data-management/hmo-providers',
        label: 'HMO Providers',
      },
    ],
  },
];
