import type { MenuItems } from '~/models/sidebar.model';

import DashboardIcon from '@mui/icons-material/Dashboard';
import Face4Icon from '@mui/icons-material/Face4';
import PeopleAltIcon from '@mui/icons-material/PeopleAlt';
// import CreateIcon from '@mui/icons-material/Create';
import ListIcon from '@mui/icons-material/List';
import BusinessIcon from '@mui/icons-material/Business';
import SettingsSuggestIcon from '@mui/icons-material/SettingsSuggest';
import HealthAndSafetyIcon from '@mui/icons-material/HealthAndSafety';
import PlaceIcon from '@mui/icons-material/Place';
import MapIcon from '@mui/icons-material/Map';
import LocationCityIcon from '@mui/icons-material/LocationCity';
import HolidayVillageIcon from '@mui/icons-material/HolidayVillage';
import PersonAddIcon from '@mui/icons-material/PersonAdd';
import DomainAddIcon from '@mui/icons-material/DomainAdd';

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
  },
  {
    label: 'Data Management',
    icon: SettingsSuggestIcon,
    children: [
      {
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
      },
      {
        icon: HealthAndSafetyIcon,
        path: '/data-management/hmo',
        label: 'HMO',
      },
      {
        icon: PlaceIcon,
        label: 'Locations',
        children: [
          {
            icon: MapIcon,
            path: '/data-management/locations/regions',
            label: 'Regions',
          },
          {
            icon: LocationCityIcon,
            path: '/data-management/locations/cities',
            label: 'Cities',
          },
          {
            icon: HolidayVillageIcon,
            path: '/data-management/locations/barangays',
            label: 'Barangays',
          },
        ],
      },
    ],
  },
];
