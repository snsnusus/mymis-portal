import type { ReactElement } from 'react';

import { useSidebarStore } from '~/stores/sidebar';

import { styled } from '@mui/material';
import Avatar from '@mui/material/Avatar';
import Badge from '@mui/material/Badge';
import List from '@mui/material/List';
import Stack, { type StackProps } from '@mui/material/Stack';
import Toolbar from '@mui/material/Toolbar';
import Tooltip from '@mui/material/Tooltip';
import Divider from '@mui/material/Divider';
import Typography from '@mui/material/Typography';

import Drawer from './drawer';
import DrawerContent from './content';
import MenuItem from './menu-item';

import { SIDEBAR_MENU_ITEMS } from '~/config/sidebar-menu-items';

const Logo = styled('img')(({ theme }) => ({
  transition: theme.transitions.create('all', {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.enteringScreen,
  }),
  [theme.breakpoints.down('md')]: {
    // height: '30px',
  },
  [theme.breakpoints.up('md')]: {
    // height: '60px',
  },
}));

const ProfileWrapper = styled(Stack)<StackProps>(({ theme }) => ({
  transition: theme.transitions.create('all', {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.enteringScreen,
  }),
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  padding: theme.spacing(2),
  backgroundColor: theme.palette.primary.main,
  color: theme.palette.primary.contrastText,
  minHeight: 192,
}));

const StyledBadge = styled(Badge)(({ theme }) => ({
  '& .MuiBadge-badge': {
    backgroundColor: '#44b700',
    color: '#44b700',
    boxShadow: `0 0 0 2px ${theme.palette.background.paper}`,
    '&::after': {
      position: 'absolute',
      top: 0,
      left: 0,
      width: '100%',
      height: '100%',
      borderRadius: '50%',
      animation: 'ripple 1.2s infinite ease-in-out',
      border: '1px solid currentColor',
      content: '""',
    },
  },
  '@keyframes ripple': {
    '0%': {
      transform: 'scale(.8)',
      opacity: 1,
    },
    '100%': {
      transform: 'scale(2.4)',
      opacity: 0,
    },
  },
}));

const Sidebar = (): ReactElement => {
  const open = useSidebarStore((state) => state.open);

  return (
    <Drawer>
      <Toolbar
        disableGutters
        sx={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          padding: '0 24px',
          minHeight: '72px',
        }}
      >
        <Logo
          alt="Logo"
          src={open ? '/assets/logo-long.png' : '/assets/logo-short.png'}
          height={52}
          width={open ? 252 : 56}
        />
      </Toolbar>
      <DrawerContent>
        <ProfileWrapper
          sx={{
            gap: 1,
          }}
        >
          <StyledBadge
            overlap="circular"
            anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
            variant="dot"
          >
            <Avatar
              alt="Employee Picture"
              src="/assets/employee.jfif"
              sx={{ width: open ? 100 : 62, height: open ? 100 : 62 }}
            />
          </StyledBadge>
          <Stack
            sx={{
              justifyContent: 'center',
              alignItems: 'center',
            }}
          >
            <Typography
              sx={{
                fontSize: '1rem',
              }}
            >
              {open ? 'Pea Daphne Vargas' : 'Pey'}
            </Typography>
            {open ? (
              <Stack
                direction="row"
                sx={{
                  gap: 1,
                }}
              >
                <Typography
                  sx={{
                    fontWeight: 600,
                  }}
                >
                  IT Specialist
                </Typography>
                <Divider
                  orientation="vertical"
                  flexItem
                  sx={{
                    backgroundColor: '#ffffff',
                  }}
                />
                <Typography
                  sx={{
                    fontStyle: 'italic',
                  }}
                >
                  Management
                </Typography>
              </Stack>
            ) : (
              <Tooltip title="Short status here..." placement="right">
                <Typography>😭</Typography>
              </Tooltip>
            )}
          </Stack>
        </ProfileWrapper>
        <Stack
          sx={{
            overflow: 'auto',
          }}
        >
          <List sx={{ overflowX: 'hidden' }}>
            {SIDEBAR_MENU_ITEMS.map((item) => (
              <MenuItem key={item.label} open={open} {...item} />
            ))}
          </List>
        </Stack>
      </DrawerContent>
      <Divider />
    </Drawer>
  );
};

export default Sidebar;
