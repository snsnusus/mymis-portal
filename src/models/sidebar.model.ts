import type { SvgIconProps } from '@mui/material';
import type { ElementType } from 'react';

// An item is either a link (has `path`) or a group (has `children`).
export interface MenuItems {
  label: string;
  path?: string;
  icon?: ElementType<SvgIconProps>;
  children?: MenuItems[]; // recursive: children can have children
}
