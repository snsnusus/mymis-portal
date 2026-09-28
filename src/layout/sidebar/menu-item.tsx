import type { MenuItems } from '~/models/sidebar.models';

import { useState, useEffect, type ReactElement, type MouseEvent } from 'react';
import { useLocation, NavLink } from 'react-router-dom';
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

import { isMenuItemActive } from './menu.utils';

interface PopoverLinkProps {
  path: string;
  label: string;
  icon?: MenuItems['icon'];
}

interface MenuItemProps extends MenuItems {
  open: boolean; // is the sidebar drawer expanded?
  depth?: number; // 0 = top level, 1 = child, 2 = grandchild...
}

const NavigationLink = styled(NavLink)({
  color: 'inherit',
  textDecoration: 'none',
});

const ListItem = styled(MuiListItem)<ListItemProps>({
  display: 'block',
});

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
}: PopoverLinkProps): ReactElement => (
  <ListItem disablePadding>
    <NavigationLink to={path} end>
      {({ isActive }) => (
        <ListItemButton open selected={isActive} sx={{ pl: 2 }}>
          {IconComponent && (
            <ListItemIcon open isActive={isActive} sx={{ mr: 2 }}>
              <IconComponent />
            </ListItemIcon>
          )}
          <ListItemText primary={label} open />
        </ListItemButton>
      )}
    </NavigationLink>
  </ListItem>
);

const renderPopoverItems = (items: MenuItems[]): ReactElement[] =>
  items.flatMap((item, index) => {
    if (item.path) {
      return [
        <PopoverLink
          key={item.path}
          path={item.path}
          label={item.label}
          icon={item.icon}
        />,
      ];
    }

    return [
      ...(index > 0
        ? [<Divider key={`${item.label}-divider`} sx={{ my: 0.5 }} />]
        : []),
      <ListSubheader
        key={`${item.label}-header`}
        disableSticky
        sx={{ lineHeight: 2.5 }}
      >
        {item.label}
      </ListSubheader>,
      ...renderPopoverItems(item.children ?? []),
    ];
  });

const MenuItem = ({
  open,
  depth = 0,
  path,
  label,
  icon: IconComponent,
  children,
}: MenuItemProps): ReactElement => {
  const location = useLocation();
  const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null);

  const isGroupActive =
    !path && isMenuItemActive({ label, children }, location.pathname);

  const [expanded, setExpanded] = useState(isGroupActive);

  useEffect(() => {
    if (isGroupActive) {
      setExpanded(true);
    }
  }, [isGroupActive]);

  useEffect(() => {
    setAnchorEl(null);
  }, [location]);

  // Drawer indentation: children line up under the parent's text.
  // On the collapsed rail, keep the styled default.
  const indent = open ? 3.5 + depth * 3.25 : undefined;

  // ── Link item ────────────────────────────────────────────────────────
  if (path) {
    return (
      <ListItem disablePadding>
        <NavigationLink to={path} end>
          {({ isActive }) => (
            <ListItemButton
              open={open}
              selected={isActive}
              divider={depth > 0}
              sx={{ pl: indent }}
            >
              {IconComponent && (
                <ListItemIcon open={open} isActive={isActive}>
                  <IconComponent />
                </ListItemIcon>
              )}
              <ListItemText primary={label} open={open} />
              {depth === 0 && open && <ExpandIconWrapper />}
            </ListItemButton>
          )}
        </NavigationLink>
      </ListItem>
    );
  }

  // ── Group item ───────────────────────────────────────────────────────
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
              <MenuItem
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
          {renderPopoverItems(children ?? [])}
        </Menu>
      )}
    </ListItem>
  );
};

export default MenuItem;
