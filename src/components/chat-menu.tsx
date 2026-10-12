import { type ReactElement, useMemo, useRef, useState } from 'react';
import {
  Badge,
  Box,
  Button,
  IconButton,
  InputBase,
  List,
  ListItemAvatar,
  ListItemButton,
  ListItemText,
  Popover,
  Typography,
} from '@mui/material';
import EditOutlinedIcon from '@mui/icons-material/EditOutlined';
import ForumIcon from '@mui/icons-material/Forum';
import ForumOutlinedIcon from '@mui/icons-material/ForumOutlined';
import SearchIcon from '@mui/icons-material/Search';

import { EmployeeAvatar } from '~/components/modules/employee-avatar';
import { useAuth } from '~/contexts/auth.context';
import { useWebSocket } from '~/contexts/websocket.context';
import { useDebouncedValue } from '~/hooks/use-debounced-value';
import type { EmployeeOption } from '~/models/employee.model';
import { useConversations } from '~/queries/chat.query';
import {
  useGetEmployeeOptions,
  useGetEmployeesByIds,
} from '~/queries/employee.query';
import { useChatDockStore } from '~/stores/chat-dock.store';
import { formatShortRelativeTime } from '~/utils/time.util';

// The employee lookup endpoint returns at most 50 (Math.Clamp in the API).
const CHAT_DIRECTORY_LIMIT = 50;

const ChatMenu = (): ReactElement => {
  // The icon the popover opens under; null means closed.
  const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null);

  // What's typed in the search box, and the same value 300ms after typing stops.
  const [search, setSearch] = useState('');
  const debouncedSearch = useDebouncedValue(search.trim(), 300);
  // The input element, so the pencil and "New message" button can focus it.
  const searchInputRef = useRef<HTMLInputElement>(null);

  const { user: currentUser } = useAuth();
  const { onlineIds } = useWebSocket();

  const openIds = useChatDockStore((state) => state.openIds);
  const openChat = useChatDockStore((state) => state.openChat);

  // --- Conversations (shown when the search box is empty) ---

  const { data: conversations = [], isLoading } = useConversations();

  const otherIds = useMemo(
    () => conversations.map((conversation) => Number(conversation.otherUserId)),
    [conversations]
  );

  const { data: employees = [] } = useGetEmployeesByIds(otherIds);
  const employeesById = useMemo(
    () =>
      new Map<number, EmployeeOption>(
        employees.map((employee) => [employee.id, employee])
      ),
    [employees]
  );

  // --- People search (shown while something is typed) ---

  // Switch views as soon as there's text, without waiting for the debounce.
  const isSearching = search.trim() !== '';

  const { data: searchResults = [], isFetching: isSearchFetching } =
    useGetEmployeeOptions(debouncedSearch, CHAT_DIRECTORY_LIMIT, {
      enabled: debouncedSearch !== '',
    });

  // Everyone matching, except me: you can't start a chat with yourself.
  const people = useMemo(
    () =>
      searchResults.filter(
        (employee) => String(employee.id) !== currentUser?.id
      ),
    [searchResults, currentUser?.id]
  );

  const handleClose = (): void => {
    setAnchorEl(null);
    setSearch(''); // the next open starts on the conversation list
  };

  const handleSelect = (employeeId: number): void => {
    openChat(employeeId);
    handleClose();
  };

  const focusSearch = (): void => {
    searchInputRef.current?.focus();
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
        onClose={handleClose}
        // Hang below the icon, right edges lined up, so it doesn't run off-screen.
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
        transformOrigin={{ vertical: 'top', horizontal: 'right' }}
        slotProps={{ paper: { sx: { width: 320, maxHeight: 460 } } }}
      >
        {/* Header: title + new message */}
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            px: 2,
            pt: 2,
            pb: 1,
          }}
        >
          <Typography variant="subtitle1" sx={{ fontWeight: 700 }}>
            Messages
          </Typography>
          <IconButton
            size="small"
            aria-label="New message"
            onClick={focusSearch}
          >
            <EditOutlinedIcon fontSize="small" />
          </IconButton>
        </Box>

        {/* Search box */}
        <Box
          sx={{
            mx: 2,
            mb: 1,
            px: 1.5,
            py: 0.5,
            borderRadius: 5,
            bgcolor: 'grey.100',
            display: 'flex',
            alignItems: 'center',
            gap: 1,
          }}
        >
          <SearchIcon fontSize="small" sx={{ color: 'text.secondary' }} />
          <InputBase
            inputRef={searchInputRef}
            placeholder="Search people"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            inputProps={{ 'aria-label': 'Search people' }}
            sx={{ flex: 1, fontSize: '0.875rem' }}
          />
        </Box>

        {isSearching ? (
          // --- Search results ---
          <>
            {people.length === 0 && (
              <Typography
                variant="body2"
                color="text.secondary"
                sx={{ px: 2, py: 2 }}
              >
                {isSearchFetching || debouncedSearch !== search.trim()
                  ? 'Searching...'
                  : 'No one found.'}
              </Typography>
            )}
            {people.length > 0 && (
              <List dense disablePadding sx={{ pb: 1 }}>
                {people.map((employee) => (
                  <ListItemButton
                    key={employee.id}
                    selected={openIds.includes(employee.id)}
                    onClick={() => handleSelect(employee.id)}
                    sx={{ px: 2, py: 1 }}
                  >
                    <ListItemAvatar sx={{ minWidth: 52 }}>
                      <EmployeeAvatar
                        id={employee.id}
                        name={employee.formattedName}
                        avatarUrl={employee.avatarUrl}
                        avatarStyle={employee.avatarStyle}
                        size={40}
                      />
                    </ListItemAvatar>
                    <ListItemText
                      primary={employee.formattedName}
                      secondary={employee.position || undefined}
                      slotProps={{
                        primary: { noWrap: true, sx: { fontWeight: 500 } },
                      }}
                    />
                  </ListItemButton>
                ))}
              </List>
            )}
          </>
        ) : (
          // --- Conversations ---
          <>
            {isLoading && (
              <Typography
                variant="body2"
                color="text.secondary"
                sx={{ px: 2, pb: 2 }}
              >
                Loading...
              </Typography>
            )}

            {!isLoading && conversations.length === 0 && (
              <Box sx={{ px: 3, pt: 2, pb: 4, textAlign: 'center' }}>
                <ForumOutlinedIcon
                  sx={{ fontSize: 36, color: 'text.disabled' }}
                />
                <Typography
                  variant="body2"
                  color="text.secondary"
                  sx={{ mt: 1 }}
                >
                  No conversations yet.
                  <br />
                  Start one with a colleague.
                </Typography>
                <Button
                  size="small"
                  variant="contained"
                  disableElevation
                  onClick={focusSearch}
                  sx={{ mt: 1.5, borderRadius: 5 }}
                >
                  New message
                </Button>
              </Box>
            )}

            {!isLoading && conversations.length > 0 && (
              <List dense disablePadding sx={{ pb: 1 }}>
                {conversations.map((conversation) => {
                  const employeeId = Number(conversation.otherUserId);
                  const employee = employeesById.get(employeeId);
                  const name = employee?.formattedName ?? 'Unknown employee';
                  const isOnline = onlineIds.has(conversation.otherUserId);
                  const isMine =
                    conversation.lastMessage.senderId === currentUser?.id;

                  return (
                    <ListItemButton
                      key={conversation.roomId}
                      selected={openIds.includes(employeeId)}
                      // An employee that can't be looked up (e.g. deleted) can't be shown in the dock.
                      disabled={!employee}
                      onClick={() => handleSelect(employeeId)}
                      sx={{ px: 2, py: 1 }}
                    >
                      <ListItemAvatar sx={{ minWidth: 60 }}>
                        <Badge
                          overlap="circular"
                          variant="dot"
                          anchorOrigin={{
                            vertical: 'bottom',
                            horizontal: 'right',
                          }}
                          sx={{
                            '& .MuiBadge-badge': {
                              width: 12,
                              height: 12,
                              borderRadius: '50%',
                              bgcolor: isOnline ? 'success.main' : 'grey.400',
                              // A ring in the popover's color, so the dot stands out from the avatar.
                              boxShadow: (theme) =>
                                `0 0 0 2px ${theme.palette.background.paper}`,
                            },
                          }}
                        >
                          <EmployeeAvatar
                            id={employeeId}
                            name={name}
                            avatarUrl={employee?.avatarUrl}
                            avatarStyle={employee?.avatarStyle}
                            size={48}
                          />
                        </Badge>
                      </ListItemAvatar>
                      <ListItemText
                        primary={name}
                        slotProps={{
                          primary: { noWrap: true, sx: { fontWeight: 500 } },
                        }}
                        secondary={
                          <Box
                            component="span"
                            sx={{ display: 'flex', gap: 0.5 }}
                          >
                            {/* The message shrinks and gets "…"; the time never does. */}
                            <Box
                              component="span"
                              sx={{
                                overflow: 'hidden',
                                textOverflow: 'ellipsis',
                                whiteSpace: 'nowrap',
                                minWidth: 0,
                              }}
                            >
                              {isMine ? 'You: ' : ''}
                              {conversation.lastMessage.text}
                            </Box>
                            <Box component="span" sx={{ flexShrink: 0 }}>
                              ·{' '}
                              {formatShortRelativeTime(
                                conversation.lastMessage.createdAt
                              )}
                            </Box>
                          </Box>
                        }
                      />
                    </ListItemButton>
                  );
                })}
              </List>
            )}
          </>
        )}
      </Popover>
    </>
  );
};

export default ChatMenu;
