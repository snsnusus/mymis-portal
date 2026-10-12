import { type ReactElement, useMemo, useState } from 'react';
import {
  Badge,
  IconButton,
  List,
  ListItem,
  ListItemAvatar,
  ListItemButton,
  ListItemText,
  Popover,
  Typography,
} from '@mui/material';
import ForumIcon from '@mui/icons-material/Forum';

import { EmployeeAvatar } from '~/components/modules/employee-avatar';
import { useAuth } from '~/contexts/auth.context';
import { useWebSocket } from '~/contexts/websocket.context';
import { useGetEmployeeOptions } from '~/queries/employee.query';
import { useChatDockStore } from '~/stores/chat-dock.store';

// The employee lookup endpoint returns at most 50 (Math.Clamp in the API).
// Moved here from user-directory.tsx, which is deleted in 5c.
export const CHAT_DIRECTORY_LIMIT = 50;

const ChatMenu = (): ReactElement => {
  // The icon the popover opens under; null means closed.
  const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null);

  const { user: currentUser } = useAuth();
  const { onlineIds } = useWebSocket();
  const { data: employees = [] } = useGetEmployeeOptions(
    '',
    CHAT_DIRECTORY_LIMIT
  );

  const openIds = useChatDockStore((state) => state.openIds);
  const openChat = useChatDockStore((state) => state.openChat);

  // Everyone except me. The token's id is a string, employee ids are numbers.
  const contacts = useMemo(
    () =>
      employees.filter((employee) => String(employee.id) !== currentUser?.id),
    [employees, currentUser?.id]
  );

  const handleSelect = (employeeId: number): void => {
    openChat(employeeId);
    setAnchorEl(null); // close the popover once a chat is picked
  };

  return (
    <>
      <IconButton
        size="large"
        color="inherit"
        aria-label="Open chats"
        onClick={(e) => setAnchorEl(e.currentTarget)}
      >
        <ForumIcon />
      </IconButton>
      <Popover
        open={Boolean(anchorEl)}
        anchorEl={anchorEl}
        onClose={() => setAnchorEl(null)}
        // Hang below the icon, right edges lined up, so it doesn't run off-screen.
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
        transformOrigin={{ vertical: 'top', horizontal: 'right' }}
        slotProps={{ paper: { sx: { width: 320, maxHeight: 420 } } }}
      >
        <Typography
          variant="subtitle2"
          sx={{ px: 2, pt: 2, pb: 1, fontWeight: 700 }}
        >
          Messages
        </Typography>
        <List dense>
          {contacts.map((employee) => {
            const isOnline = onlineIds.has(String(employee.id));

            return (
              <ListItem key={employee.id} disablePadding>
                <ListItemButton
                  onClick={() => handleSelect(employee.id)}
                  selected={openIds.includes(employee.id)}
                  sx={{ borderRadius: 1, mb: 0.5, pl: 3 }}
                >
                  <ListItemAvatar
                    sx={{
                      display: 'flex',
                      justifyContent: 'center',
                      width: '100%',
                      minWidth: 'auto',
                      marginRight: 0,
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
                </ListItemButton>
              </ListItem>
            );
          })}
        </List>
      </Popover>
    </>
  );
};

export default ChatMenu;
