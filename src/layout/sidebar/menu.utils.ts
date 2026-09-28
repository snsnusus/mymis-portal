import { matchPath } from 'react-router-dom';
import type { MenuItems } from '~/models/sidebar.model';

// A link is active if the URL is at or below its path.
// A group is active if ANY descendant is active, at any depth.
export const isMenuItemActive = (
  item: MenuItems,
  pathname: string
): boolean => {
  if (item.path) {
    return matchPath({ path: item.path, end: false }, pathname) !== null;
  }

  return (
    item.children?.some((child) => isMenuItemActive(child, pathname)) ?? false
  );
};
