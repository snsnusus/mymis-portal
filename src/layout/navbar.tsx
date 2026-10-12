import type { Theme, CSSObject } from '@mui/material';
import type { AppBarProps } from '@mui/material/AppBar';

import { useState, type ReactElement } from 'react';
import { useNavigation } from 'react-router-dom';
import { useSidebarStore } from '~/stores/sidebar';
import { alpha, useMediaQuery, useTheme, styled } from '@mui/material';
import { useAuth } from '~/contexts/auth.context';

import MuiAppBar from '@mui/material/AppBar';
import Badge from '@mui/material/Badge';
import Box from '@mui/material/Box';
import Chip from '@mui/material/Chip';
import Divider from '@mui/material/Divider';
import IconButton from '@mui/material/IconButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import Stack from '@mui/material/Stack';
import Toolbar, { type ToolbarProps } from '@mui/material/Toolbar';

import InputBase from '@mui/material/InputBase';
import LogoutIcon from '@mui/icons-material/Logout';
import MailIcon from '@mui/icons-material/Mail';
import MenuOpenIcon from '@mui/icons-material/MenuOpen';
import MenuIcon from '@mui/icons-material/Menu';
import NotificationsIcon from '@mui/icons-material/Notifications';
import SearchIcon from '@mui/icons-material/Search';
import SettingsIcon from '@mui/icons-material/Settings';

import { ProgressBar } from '~/components/ui/progress-bar';
import ChatMenu from '~/components/chat-menu';

const AppBar = styled(MuiAppBar)<AppBarProps>(({ theme }) => ({
  padding: theme.spacing(1, 2),
}));

const openedMixin = (theme: Theme): CSSObject => ({
  transition: theme.transitions.create('margin-left', {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  marginLeft: theme.custom.drawer.sidebar.width.open,
});

const closedMixin = (theme: Theme): CSSObject => ({
  transition: theme.transitions.create('margin-left', {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  marginLeft: theme.custom.drawer.sidebar.width.close,
});

const CustomToolbar = styled(Toolbar, {
  shouldForwardProp: (prop) => prop !== 'open' && prop !== 'isMobile',
})<ToolbarProps & { open: boolean; isMobile: boolean }>(
  ({ theme, open, isMobile }) => ({
    ...(!isMobile &&
      open && {
        ...openedMixin(theme),
      }),
    ...(!isMobile &&
      !open && {
        ...closedMixin(theme),
      }),
  })
);

const Search = styled('div')(({ theme }) => ({
  position: 'relative',
  borderRadius: theme.shape.borderRadius,
  backgroundColor: alpha(theme.palette.common.white, 0.15),
  '&:hover': {
    backgroundColor: alpha(theme.palette.common.white, 0.25),
  },
  marginRight: theme.spacing(2),
  marginLeft: 0,
  width: '100%', // 100% width on mobile layouts
  [theme.breakpoints.up('sm')]: {
    width: 450, // Restrict to 450px on tablet/desktop views
  },
}));

const SearchIconWrapper = styled('div')(({ theme }) => ({
  padding: theme.spacing(0, 1),
  height: '100%',
  position: 'absolute',
  pointerEvents: 'none',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
}));

const StyledInputBase = styled(InputBase)(({ theme }) => ({
  color: 'inherit',
  '&.MuiInputBase-root': {
    width: '100%',
  },
  '& .MuiInputBase-input': {
    padding: theme.spacing(1, 1, 1, 0),
    paddingLeft: `calc(1em + ${theme.spacing(3)})`,
    transition: theme.transitions.create('width'),
    width: '100%',
  },
}));

const Navbar = (): ReactElement => {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

  const { logout } = useAuth();
  const { state: navigationState } = useNavigation();

  const open = useSidebarStore((state) => state.open);
  const toggle = useSidebarStore((state) => state.toggle);

  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  const handleClose = (): void => {
    setAnchorEl(null);
  };

  return (
    <>
      {navigationState === 'loading' ? <ProgressBar /> : null}
      <AppBar position="fixed">
        <CustomToolbar open={open} isMobile={isMobile} disableGutters>
          <Stack
            direction="row"
            sx={{
              gap: 2,
            }}
          >
            <IconButton sx={{ color: 'inherit' }} onClick={toggle}>
              {open ? <MenuOpenIcon /> : <MenuIcon />}
            </IconButton>
            <Search>
              <SearchIconWrapper>
                <SearchIcon />
              </SearchIconWrapper>
              <StyledInputBase
                placeholder="Search…"
                inputProps={{ 'aria-label': 'search' }}
              />
            </Search>
          </Stack>
          <Box sx={{ flexGrow: 1 }} />
          <Stack
            direction="row"
            sx={{
              gap: 1,
            }}
          >
            {!isMobile && (
              <Box>
                <ChatMenu />
                <IconButton
                  size="large"
                  aria-label="show 17 new notifications"
                  color="inherit"
                >
                  <Badge badgeContent={17} color="error">
                    <NotificationsIcon />
                  </Badge>
                </IconButton>
              </Box>
            )}
            <>
              <IconButton
                onClick={(e) => setAnchorEl(e.currentTarget)}
                size="large"
                aria-label="show 4 new mails"
                color="inherit"
              >
                <SettingsIcon />
              </IconButton>
              <Menu
                anchorEl={anchorEl}
                anchorOrigin={{
                  vertical: 'bottom',
                  horizontal: 'right',
                }}
                keepMounted
                transformOrigin={{
                  vertical: 'bottom',
                  horizontal: 'right',
                }}
                open={Boolean(anchorEl)}
                onClose={handleClose}
                disableScrollLock
              >
                {isMobile && (
                  <>
                    <MenuItem onClick={handleClose}>
                      <ListItemIcon>
                        <MailIcon fontSize="small" />
                      </ListItemIcon>
                      <Box sx={{ flexGrow: 1, mr: 3 }}>Messages</Box>
                      <Chip
                        label="4"
                        color="error"
                        size="small"
                        sx={{ height: 20, fontSize: '0.75rem' }}
                      />
                    </MenuItem>
                    <MenuItem onClick={handleClose}>
                      <ListItemIcon>
                        <NotificationsIcon fontSize="small" />
                      </ListItemIcon>
                      <Box sx={{ flexGrow: 1, mr: 3 }}>Notifications</Box>
                      <Chip
                        label="17"
                        color="error"
                        size="small"
                        sx={{ height: 20, fontSize: '0.75rem' }}
                      />
                    </MenuItem>
                    <Divider />
                  </>
                )}
                <MenuItem onClick={async () => logout()}>
                  <ListItemIcon>
                    <LogoutIcon fontSize="small" />
                  </ListItemIcon>
                  Logout
                </MenuItem>
              </Menu>
            </>
          </Stack>
        </CustomToolbar>
      </AppBar>
    </>
  );
};

export default Navbar;
