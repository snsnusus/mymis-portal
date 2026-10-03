import type { MenuItem } from '~/models/sidebar.model';

import PeopleAltIcon from '@mui/icons-material/PeopleAlt';
import ListIcon from '@mui/icons-material/List';
import PersonAddIcon from '@mui/icons-material/PersonAdd';

export const menuItems: MenuItem = {
  label: 'Employees',
  icon: PeopleAltIcon,
  children: [
    {
      label: 'List',
      path: '/employees',
      icon: ListIcon,
    },
    {
      label: 'Create',
      path: '/employees/create',
      icon: PersonAddIcon,
    },
  ],
};
