import type { SvgIconProps } from '@mui/material';
import type { ElementType } from 'react';

export interface MenuItem {
  label: string;
  path?: string;
  icon?: ElementType<SvgIconProps>;
  children?: MenuItem[];
}
