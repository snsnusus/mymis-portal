import { type MouseEvent, Suspense, useState, type ReactElement } from 'react';

import {
  Avatar,
  Badge,
  Box,
  type BoxProps,
  IconButton,
  ListItemAvatar,
  ListItemText,
  Menu,
  MenuItem,
  Stack,
  styled,
  useTheme,
} from '@mui/material';

import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import ForumIcon from '@mui/icons-material/Forum';

import { AppBreadcrumbs } from '../components/breadcrumb';
import Navbar from './navbar';
import Sidebar from './sidebar';
import Footer from './footer';

import ChatWidget from '~/components/chat-widget';
import UserDirectory from '~/components/user-directory';

const AppWrapper = styled('div')({
  display: 'flex',
  flexDirection: 'column',
  minHeight: '100vh',
  position: 'relative',
});

const MainSection = styled('div')({
  display: 'flex',
  flexGrow: 1,
  width: '100%',
});

const Content = styled(Box)<BoxProps>(({ theme }) => ({
  flexGrow: 1,
  minHeight: `calc(100% - ${theme.mixins.toolbar.minHeight}px)`,
  marginBottom: theme.mixins.toolbar.minHeight,
}));

const TopOffset = styled('div')(({ theme }) => ({
  minHeight: `calc(${theme.mixins.toolbar.minHeight}px + ${theme.spacing(2)})`,
}));

const Layout = (props: PropsWithChildren): ReactElement => {
  const [isDirectoryOpen, setIsDirectoryOpen] = useState(false);
  const [activeChatSessions, setActiveChatSessions] = useState<any[]>([]);
  const [activeChatTarget, setActiveChatTarget] = useState<any | null>(null);

  const [badgeMenuAnchor, setBadgeMenuAnchor] = useState<null | HTMLElement>(
    null
  );

  const theme = useTheme();

  const currentChatWidth = isDirectoryOpen
    ? theme.custom.drawer.chatDirectory.width.open
    : theme.custom.drawer.chatDirectory.width.close;

  const { children } = props;

  const handleSelectUserChat = (selectedUser: any): void => {
    // 1. Set the last clicked user as the active maximized target
    setActiveChatTarget(selectedUser);

    // 2. Add them to the session tray if they aren't already in it
    setActiveChatSessions((prevSessions) => {
      const isAlreadyOpen = prevSessions.some(
        (user) => user.id === selectedUser.id
      );
      if (isAlreadyOpen) return prevSessions;

      return [...prevSessions, selectedUser];
    });
  };

  const handleCloseSession = (userIdToClose: string): void => {
    setActiveChatSessions((prev) =>
      prev.filter((user) => user.id !== userIdToClose)
    );

    if (activeChatTarget?.id === userIdToClose) {
      setActiveChatTarget(() => {
        const remaining = activeChatSessions.filter(
          (user) => user.id !== userIdToClose
        );
        return remaining.length > 0 ? remaining[remaining.length - 1] : null;
      });
    }
  };

  const handleOpenBadgeMenu = (event: MouseEvent<HTMLElement>): void => {
    setBadgeMenuAnchor(event.currentTarget);
  };

  const handleCloseBadgeMenu = (): void => {
    setBadgeMenuAnchor(null);
  };

  const handleSwitchActiveChat = (selectedUser: any): void => {
    setActiveChatTarget(selectedUser);
    handleCloseBadgeMenu();
  };

  return (
    <Suspense fallback={<div>Loading...</div>}>
      <AppWrapper>
        <Navbar />
        <MainSection>
          <Sidebar />
          <Box
            sx={{
              display: 'flex',
              flexDirection: 'column',
              width: '100%',
              minWidth: 0,
              overflow: 'hidden',
            }}
          >
            <TopOffset />
            <Box
              sx={{
                display: 'flex',
                width: '100%',
                minWidth: 0,
                overflow: 'hidden',
              }}
            >
              <Content
                component="main"
                sx={{
                  minWidth: 0,
                  transition: (sxTheme) =>
                    sxTheme.transitions.create('margin', {
                      easing: sxTheme.transitions.easing.sharp,
                      duration: sxTheme.transitions.duration.leavingScreen,
                    }),
                }}
              >
                <Box
                  sx={{
                    display: 'flex',
                    flexDirection: 'column',
                    position: 'relative',
                  }}
                >
                  <Stack
                    sx={{
                      py: 2,
                      px: 4,
                    }}
                  >
                    <AppBreadcrumbs />
                    <Stack sx={{ pt: 2 }}>{children}</Stack>
                  </Stack>
                </Box>
              </Content>
              <UserDirectory
                isOpen={isDirectoryOpen}
                onSelectUser={handleSelectUserChat}
                activeRecipientId={activeChatTarget?.id}
              />
            </Box>
            <IconButton
              onClick={() => setIsDirectoryOpen(!isDirectoryOpen)}
              size="small"
              sx={{
                position: 'fixed',
                top: '140px',
                right: (sxTheme) =>
                  `${
                    isDirectoryOpen
                      ? sxTheme.custom.drawer.chatDirectory.width.open
                      : sxTheme.custom.drawer.chatDirectory.width.close
                  }px`,
                transform: 'translateX(50%)',
                transition: (sxTheme) =>
                  sxTheme.transitions.create('right', {
                    easing: sxTheme.transitions.easing.sharp,
                    duration: sxTheme.transitions.duration.enteringScreen,
                  }),
                backgroundColor: 'background.paper',
                border: '1px solid',
                borderColor: 'divider',
                boxShadow: '0px 3px 6px rgba(0,0,0,0.15)',
                zIndex: (sxTheme) => sxTheme.zIndex.drawer,
                '&:hover': {
                  backgroundColor: 'grey.100',
                },
              }}
            >
              {isDirectoryOpen ? (
                <ChevronRightIcon fontSize="small" />
              ) : (
                <ChevronLeftIcon fontSize="small" />
              )}
            </IconButton>
          </Box>
        </MainSection>
        {activeChatSessions.length > 1 && (
          <Box
            sx={{
              position: 'fixed',
              bottom: '66px',
              right: `calc(${currentChatWidth}px + 340px + 16px)`,
              transition: (sxTheme) =>
                sxTheme.transitions.create('right', {
                  easing: sxTheme.transitions.easing.sharp,
                  duration: sxTheme.transitions.duration.enteringScreen,
                }),
              zIndex: 1301,
            }}
          >
            <Badge
              badgeContent={activeChatSessions.length - 1}
              color="primary"
              max={99}
            >
              <Avatar
                onClick={handleOpenBadgeMenu}
                sx={{
                  bgcolor: 'background.paper',
                  color: 'text.secondary',
                  boxShadow: 3,
                  cursor: 'pointer',
                  width: 45,
                  height: 45,
                }}
              >
                <ForumIcon />
              </Avatar>
            </Badge>

            <Menu
              anchorEl={badgeMenuAnchor}
              open={Boolean(badgeMenuAnchor)}
              onClose={handleCloseBadgeMenu}
              anchorOrigin={{
                vertical: 'top',
                horizontal: 'right',
              }}
              transformOrigin={{
                vertical: 'bottom',
                horizontal: 'right',
              }}
              slotProps={{
                paper: {
                  sx: {
                    minWidth: 200,
                    maxHeight: 300,
                    marginBottom: '12px',
                  },
                  style: {
                    transform: 'translateY(-18px)',
                  },
                },
              }}
            >
              {activeChatSessions.map((sessionUser) => {
                const isCurrentlyActive =
                  sessionUser.id === activeChatTarget?.id;

                if (isCurrentlyActive) return null;

                return (
                  <MenuItem
                    key={sessionUser.id}
                    onClick={() => handleSwitchActiveChat(sessionUser)}
                    sx={{ gap: 1.5 }}
                  >
                    <ListItemAvatar sx={{ minWidth: 'auto' }}>
                      <Avatar
                        sx={{ width: 32, height: 32 }}
                        src={sessionUser.avatar}
                      >
                        {sessionUser.name?.charAt(0)}
                      </Avatar>
                    </ListItemAvatar>
                    <ListItemText
                      primary={`${sessionUser.firstName} ${sessionUser.lastName}`}
                      slotProps={{
                        primary: {
                          variant: 'body2',
                          sx: {
                            fontWeight: isCurrentlyActive ? 'bold' : 'normal',
                          },
                        },
                      }}
                    />
                  </MenuItem>
                );
              })}
            </Menu>
          </Box>
        )}
        <ChatWidget
          recipient={activeChatTarget}
          onClose={() => handleCloseSession(activeChatTarget.id)}
          directoryOffsetWidth={currentChatWidth}
        />
        <Footer />
      </AppWrapper>
    </Suspense>
  );
};

export default Layout;
