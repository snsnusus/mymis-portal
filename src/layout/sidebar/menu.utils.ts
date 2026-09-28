import { matchPath } from 'react-router-dom';
import type { MenuItems } from '~/models/sidebar.model';

// Every link path in the menu tree, at any depth.
const collectPaths = (items: MenuItems[]): string[] =>
  items.flatMap((item) => [
    ...(item.path ? [item.path] : []),
    ...collectPaths(item.children ?? []),
  ]);

// The single menu path that best describes the current URL: the longest
// path the URL is at or below. '/' only counts on an exact match, since
// every URL starts with '/'.
export const getActiveMenuPath = (
  items: MenuItems[],
  pathname: string
): string | null => {
  const matching = collectPaths(items).filter(
    (path) => matchPath({ path, end: path === '/' }, pathname) !== null
  );

  if (matching.length === 0) return null;

  return matching.reduce((longest, path) =>
    path.length > longest.length ? path : longest
  );
};

// A link is active if it IS the active path.
// A group is active if ANY descendant is, at any depth.
export const isMenuItemActive = (
  item: MenuItems,
  activePath: string | null
): boolean => {
  if (item.path) {
    return item.path === activePath;
  }

  return (
    item.children?.some((child) => isMenuItemActive(child, activePath)) ?? false
  );
};
