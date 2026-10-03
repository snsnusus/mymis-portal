import type { MenuItem } from '~/models/sidebar.model';

import DashboardIcon from '@mui/icons-material/Dashboard';
import Face4Icon from '@mui/icons-material/Face4';
import SettingsSuggestIcon from '@mui/icons-material/SettingsSuggest';

import { menuItems as departmentsMenuItems } from '~/pages/departments/menu-items';
import { menuItems as employeesMenuItems } from '~/pages/employees/menu-items';
import { menuItems as hmoProvidersMenuItems } from '~/pages/hmo-providers/menu-items';
import { menuItems as locationsMenuItems } from '~/pages/locations/menu-items';

export const SIDEBAR_MENU_ITEMS: MenuItem[] = [
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
  employeesMenuItems,
  {
    label: 'Data Management',
    icon: SettingsSuggestIcon,
    children: [departmentsMenuItems, hmoProvidersMenuItems, locationsMenuItems],
  },
];
