import { type ReactElement, useMemo } from 'react';
import {
  styled,
  Drawer,
  type DrawerProps,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  Paper,
  Typography,
  ListItemButton as MuiListItemButton,
  type ListItemButtonProps as MuiListItemButtonProps,
  Toolbar,
  Badge,
  Box,
  Tooltip,
  type Theme,
  type CSSObject,
} from '@mui/material';

import ChatBubbleIcon from '@mui/icons-material/ChatBubble';
import { EmployeeAvatar } from '~/components/modules/employee-avatar';
import { useAuth } from '~/contexts/auth.context';
import { useWebSocket } from '~/contexts/websocket.context';
import type { EmployeeOption } from '~/models/employee.model';
import { useGetEmployeeOptions } from '~/queries/employee.query';

// The employee lookup endpoint returns at most 50 (Math.Clamp in the API).
const CHAT_DIRECTORY_LIMIT = 50;

interface UserDirectoryProps {
  isOpen: boolean;
  onSelectUser: (employee: EmployeeOption) => void;
  activeRecipientId?: number;
}

const openedMixin = (theme: Theme): CSSObject => ({
  width: theme.custom.drawer.chatDirectory.width.open,
  transition: theme.transitions.create('width', {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.enteringScreen,
  }),
  overflowX: 'hidden',
});

const closedMixin = (theme: Theme): CSSObject => ({
  transition: theme.transitions.create('width', {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  width: theme.custom.drawer.chatDirectory.width.close,
  overflowX: 'hidden',
  right: 0,
  left: 'auto',
});

const ListItemButton = styled(MuiListItemButton, {
  shouldForwardProp: (prop) => prop != 'open',
})<MuiListItemButtonProps & { open?: boolean }>(({ theme, open }) => ({
  transition: theme.transitions.create('all', {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.enteringScreen,
  }),
  minHeight: 68,
  justifyContent: open ? 'initial' : 'center',
}));

const UserDirectoryDrawer = styled(Drawer, {
  shouldForwardProp: (prop) => prop != 'open',
})<DrawerProps>(({ theme, open }) => ({
  display: 'flex',
  width: theme.custom.drawer.chatDirectory.width.open,
  flexShrink: 0,
  whiteSpace: 'nowrap',
  boxSizing: 'border-box',
  ...(open && {
    ...openedMixin(theme),
    '& .MuiDrawer-paper': openedMixin(theme),
  }),
  ...(!open && {
    ...closedMixin(theme),
    '& .MuiDrawer-paper': closedMixin(theme),
  }),
}));

const UserDirectory = ({
  isOpen,
  onSelectUser,
  activeRecipientId,
}: UserDirectoryProps): ReactElement => {
  const { user: currentUser } = useAuth();
  const { onlineIds } = useWebSocket();
  const { data: employees = [] } = useGetEmployeeOptions(
    '',
    CHAT_DIRECTORY_LIMIT
  );

  // Everyone except me. The token's id is a string, employee ids are numbers.
  const contacts = useMemo(
    () =>
      employees.filter((employee) => String(employee.id) !== currentUser?.id),
    [employees, currentUser?.id]
  );

  const chatBubbleElement = (
    <ChatBubbleIcon
      sx={{
        fontSize: 18,
        color: 'text.secondary',
        width: isOpen ? 'auto' : '100%',
      }}
    />
  );

  return (
    <UserDirectoryDrawer
      open={isOpen}
      variant="permanent"
      anchor="right"
      slotProps={{
        paper: {
          sx: {
            zIndex: (theme) => theme.zIndex.appBar - 1,
          },
        },
      }}
    >
      <Toolbar disableGutters sx={{ minHeight: '72px' }} />
      <Paper
        sx={{
          width: '100%',
          height: 'calc(100vh - 72px)',
          overflowY: 'auto',
          overflowX: 'hidden',
          py: 1,
          borderRadius: 0,
          display: 'flex',
          flexDirection: 'column',
        }}
      >
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            gap: 1,
            py: 1,
            px: 2,
          }}
        >
          {!isOpen ? (
            <Tooltip title="Messages" placement="left" arrow>
              {chatBubbleElement}
            </Tooltip>
          ) : (
            chatBubbleElement
          )}
          {isOpen && (
            <Typography
              variant="subtitle2"
              sx={{
                fontWeight: 700,
                color: 'text.secondary',
                lineHeight: 1,
              }}
            >
              Messages
            </Typography>
          )}
        </Box>
        <List sx={{ py: 0 }}>
          {contacts.map((employee) => {
            const isOnline = onlineIds.has(String(employee.id));

            return (
              <ListItem key={employee.id} disablePadding>
                <ListItemButton
                  onClick={() => onSelectUser(employee)}
                  selected={employee.id === activeRecipientId}
                  sx={{ borderRadius: 1, mb: 0.5, pl: 3 }}
                >
                  <ListItemAvatar
                    sx={{
                      display: 'flex',
                      justifyContent: isOpen ? 'initial' : 'center',
                      width: isOpen ? 'auto' : '100%',
                      minWidth: isOpen ? '56px' : 'auto',
                      marginRight: isOpen ? 'initial' : 0,
                    }}
                  >
                    <Badge
                      overlap="circular"
                      anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
                      variant="dot"
                      sx={{
                        '& .MuiBadge-badge': {
                          backgroundColor: isOnline ? '#44b700' : '#bdbdbd', // green online, grey offline
                          color: isOnline ? '#44b700' : '#bdbdbd',
                          boxShadow: (theme) =>
                            `0 0 0 2px ${theme.palette.background.paper}`,
                        },
                      }}
                    >
                      <EmployeeAvatar
                        id={employee.id}
                        name={employee.formattedName}
                        avatarUrl={employee.avatarUrl}
                        avatarStyle={employee.avatarStyle}
                        size={40}
                      />
                    </Badge>
                  </ListItemAvatar>
                  {isOpen && (
                    <ListItemText
                      primary={employee.formattedName}
                      secondary={employee.position || 'No Position'}
                      slotProps={{
                        primary: {
                          variant: 'body2',
                          noWrap: true,
                          sx: {
                            fontWeight: 600,
                          },
                        },
                        secondary: { variant: 'caption', noWrap: true },
                      }}
                      sx={{ ml: 1 }}
                    />
                  )}
                </ListItemButton>
              </ListItem>
            );
          })}
        </List>
      </Paper>
    </UserDirectoryDrawer>
  );
};

export default UserDirectory;
