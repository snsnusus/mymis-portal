import { useMatches, type UIMatch } from 'react-router-dom';

// The shape every route's `handle` must follow. Only a label is needed;
// the link path comes from the router itself.
export interface RouteHandle {
  crumb?: string | ((match: UIMatch) => string);
  linkable?: boolean; // set false for grouping levels with no page of their own
}

export interface BreadcrumbItem {
  id: string;
  label: string;
  path: string | null; // null = render as plain text, not a link
}

export const useBreadcrumbs = (): BreadcrumbItem[] => {
  // useMatches() returns every matched route from root to leaf.
  // `handle` is typed `unknown` by the library, so we tell TS our shape.
  const matches = useMatches() as UIMatch<unknown, RouteHandle | undefined>[];

  const items = matches.flatMap((match): BreadcrumbItem[] => {
    const { handle } = match;
    if (!handle?.crumb) return []; // routes without a crumb are skipped

    const label =
      typeof handle.crumb === 'function' ? handle.crumb(match) : handle.crumb;

    return [
      {
        id: match.id,
        label,
        path: handle.linkable === false ? null : match.pathname,
      },
    ];
  });

  // The last crumb is the page you're on, so it's never a link.
  return items.map((item, index) =>
    index === items.length - 1 ? { ...item, path: null } : item
  );
};
