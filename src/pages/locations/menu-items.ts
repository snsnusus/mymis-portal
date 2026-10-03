import type { MenuItem } from '~/models/sidebar.model';

import PlaceIcon from '@mui/icons-material/Place';
import MapIcon from '@mui/icons-material/Map';
import LocationCityIcon from '@mui/icons-material/LocationCity';
import HolidayVillageIcon from '@mui/icons-material/HolidayVillage';
import HomeWorkIcon from '@mui/icons-material/HomeWork';

export const menuItems: MenuItem = {
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
    {
      icon: HomeWorkIcon,
      path: '/data-management/locations/offices',
      label: 'Offices',
    },
  ],
};
