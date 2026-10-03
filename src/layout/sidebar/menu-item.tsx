import type { MenuItem } from '~/models/sidebar.model';

import { useState, useEffect, type ReactElement, type MouseEvent } from 'react';
import { useLocation, Link } from 'react-router-dom';
import { styled } from '@mui/material';
import List from '@mui/material/List';
import MuiListItem, { type ListItemProps } from '@mui/material/ListItem';
import MuiListItemButton, {
  type ListItemButtonProps,
} from '@mui/material/ListItemButton';
import MuiListItemIcon, {
  type ListItemIconProps,
} from '@mui/material/ListItemIcon';
import MuiListItemText, {
  type ListItemTextProps,
} from '@mui/material/ListItemText';
import ExpandLessIcon from '@mui/icons-material/ExpandLess';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import Collapse from '@mui/material/Collapse';
import Menu from '@mui/material/Menu';
import Divider from '@mui/material/Divider';
import ListSubheader from '@mui/material/ListSubheader';

import ChevronRightIcon from '@mui/icons-material/ChevronRight';

import { SIDEBAR_MENU_ITEMS } from '~/config/sidebar-menu-items';
import { getActiveMenuPath, isMenuItemActive } from './utils';

interface PopoverLinkProps extends Omit<MenuItem, 'path' | 'children'> {
  path: string;
  isActive: boolean;
  depth: number;
}

interface MenuItemProps extends MenuItem {
  open: boolean;
  depth?: number;
}

const NavigationLink = styled(Link)({
  color: 'inherit',
  textDecoration: 'none',
});

const ListItem = styled(MuiListItem)<ListItemProps>({
  display: 'block',
});

const PopoverSection = styled(ListItem)(({ theme }) => ({
  backgroundColor: theme.palette.grey[200],
}));

const ListItemButton = styled(MuiListItemButton, {
  shouldForwardProp: (prop) => prop != 'open',
})<ListItemButtonProps & { open?: boolean }>(({ theme, open }) => ({
  transition: theme.transitions.create('all', {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.enteringScreen,
  }),
  minHeight: 48,
  justifyContent: open ? 'initial' : 'center',
  ...(open && { padding: theme.spacing(1, 3.5) }),
  '&.Mui-selected': {
    color: theme.palette.primary.main,
  },
}));

const ListItemIcon = styled(MuiListItemIcon, {
  shouldForwardProp: (prop) => prop !== 'open' && prop !== 'isActive',
})<ListItemIconProps & { open?: boolean; isActive?: boolean }>(
  ({ theme, open, isActive }) => ({
    transition: theme.transitions.create('all', {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen,
    }),
    justifyContent: 'center',
    ...(open && { minWidth: 0 }),
    ...(open && { marginRight: theme.spacing(4) }),
    ...(isActive && { color: theme.palette.primary.main }),
  })
);

const ListItemText = styled(MuiListItemText, {
  shouldForwardProp: (prop) => prop != 'open',
})<ListItemTextProps & { open?: boolean }>(({ open }) => ({
  display: open !== undefined ? (open ? 'block' : 'none') : 'block',
}));

const ExpandIconWrapper = styled('span')(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  width: 20,
  marginLeft: theme.spacing(2),
}));

const RailChevron = styled(ChevronRightIcon)(({ theme }) => ({
  position: 'absolute',
  right: theme.spacing(1.5),
  top: '50%',
  transform: 'translateY(-50%)',
  color: 'inherit',
}));

const PopoverLink = ({
  path,
  label,
  icon: IconComponent,
  isActive,
  depth,
}: PopoverLinkProps): ReactElement => (
  <ListItem disablePadding>
    <NavigationLink to={path} aria-current={isActive ? 'page' : undefined}>
      <ListItemButton open selected={isActive} sx={{ pl: 2 + depth * 2 }}>
        {IconComponent && (
          <ListItemIcon open isActive={isActive} sx={{ mr: 2 }}>
            <IconComponent />
          </ListItemIcon>
        )}
        <ListItemText primary={label} open />
      </ListItemButton>
    </NavigationLink>
  </ListItem>
);

const renderPopoverItems = (
  items: MenuItem[],
  activePath: string | null,
  depth = 0
): ReactElement[] =>
  items.flatMap((item, index) => {
    const isGroup = !item.path;
    const previousIsGroup = index > 0 && !items[index - 1]?.path;
    const needsDivider = index > 0 && (isGroup || previousIsGroup);

    const divider = needsDivider
      ? [
          <Divider
            key={`${item.label}-divider`}
            component="li"
            sx={{ my: 0.5 }}
          />,
        ]
      : [];

    if (item.path) {
      return [
        ...divider,
        <PopoverLink
          key={item.path}
          path={item.path}
          label={item.label}
          icon={item.icon}
          isActive={item.path === activePath}
          depth={depth}
        />,
      ];
    }

    return [
      ...divider,
      <PopoverSection key={`${item.label}-section`} disablePadding>
        <List disablePadding>
          <ListSubheader
            disableSticky
            sx={{ lineHeight: 2.5, fontWeight: 700, color: 'text.primary' }}
          >
            {item.label}
          </ListSubheader>
          {renderPopoverItems(item.children ?? [], activePath)}
        </List>
      </PopoverSection>,
    ];
  });

const SidebarMenuItem = ({
  open,
  depth = 0,
  path,
  label,
  icon: IconComponent,
  children,
}: MenuItemProps): ReactElement => {
  const location = useLocation();
  const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null);

  const activePath = getActiveMenuPath(SIDEBAR_MENU_ITEMS, location.pathname);
  const isLinkActive = path !== undefined && path === activePath;
  const isGroupActive =
    !path && isMenuItemActive({ label, children }, activePath);

  const [expanded, setExpanded] = useState(isGroupActive);

  useEffect(() => {
    if (isGroupActive) {
      setExpanded(true);
    }
  }, [isGroupActive]);

  useEffect(() => {
    setAnchorEl(null);
  }, [location]);

  const indent = open ? 3.5 + depth * 3.25 : undefined;

  if (path) {
    return (
      <ListItem disablePadding>
        <NavigationLink
          to={path}
          aria-current={isLinkActive ? 'page' : undefined}
        >
          <ListItemButton
            open={open}
            selected={isLinkActive}
            divider={depth > 0}
            sx={{ pl: indent }}
          >
            {IconComponent && (
              <ListItemIcon open={open} isActive={isLinkActive}>
                <IconComponent />
              </ListItemIcon>
            )}
            <ListItemText primary={label} open={open} />
            {depth === 0 && open && <ExpandIconWrapper />}
          </ListItemButton>
        </NavigationLink>
      </ListItem>
    );
  }

  const handleGroupClick = (event: MouseEvent<HTMLDivElement>): void => {
    if (open) {
      setExpanded((prev) => !prev);
    } else {
      setAnchorEl(event.currentTarget);
    }
  };

  return (
    <ListItem disablePadding>
      <ListItemButton
        open={open}
        onClick={handleGroupClick}
        selected={isGroupActive && depth === 0}
        divider={depth > 0 || (expanded && open)}
        aria-expanded={open ? expanded : Boolean(anchorEl)}
        sx={{
          pl: indent,
          color: isGroupActive && depth > 0 ? 'primary.main' : undefined,
        }}
      >
        {IconComponent && (
          <ListItemIcon open={open} isActive={isGroupActive}>
            <IconComponent />
          </ListItemIcon>
        )}
        <ListItemText primary={label} open={open} />
        {open ? (
          <ExpandIconWrapper>
            {expanded ? <ExpandLessIcon /> : <ExpandMoreIcon />}
          </ExpandIconWrapper>
        ) : (
          <RailChevron />
        )}
      </ListItemButton>

      {open ? (
        <Collapse in={expanded} unmountOnExit>
          <List disablePadding>
            {children?.map((child) => (
              <SidebarMenuItem
                key={child.path ?? child.label}
                open
                depth={depth + 1}
                {...child}
              />
            ))}
          </List>
        </Collapse>
      ) : (
        <Menu
          anchorEl={anchorEl}
          open={Boolean(anchorEl)}
          onClose={() => setAnchorEl(null)}
          anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
        >
          <ListSubheader disableSticky sx={{ lineHeight: 2.5 }}>
            {label}
          </ListSubheader>
          {renderPopoverItems(children ?? [], activePath)}
        </Menu>
      )}
    </ListItem>
  );
};

export default SidebarMenuItem;
