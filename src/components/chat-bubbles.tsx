import { useState, type ReactElement } from 'react';
import { Avatar, Box, IconButton, Menu, Stack, Tooltip } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';

import { EmployeeAvatar } from '~/components/modules/employee-avatar';
import type { EmployeeOption } from '~/models/employee.model';
import { MAX_VISIBLE_BUBBLES } from '~/stores/chat-dock.store';

interface ChatBubblesProps {
  chats: EmployeeOption[]; // minimized chats, oldest first
  onOpen: (employeeId: number) => void;
  onClose: (employeeId: number) => void;
  onCloseAll: () => void;
}

const ChatBubbles = ({
  chats,
  onOpen,
  onClose,
  onCloseAll,
}: ChatBubblesProps): ReactElement | null => {
  // The element the menu opens next to; null means the menu is closed.
  const [menuAnchor, setMenuAnchor] = useState<HTMLElement | null>(null);
  // Nothing minimized: render nothing at all.
  if (chats.length === 0) return null;

  // The newest MAX_VISIBLE_BUBBLES chats (the rest go behind "+N" in 4c).
  const visible = chats.slice(-MAX_VISIBLE_BUBBLES);

  // Everything except the newest MAX_VISIBLE_BUBBLES. Empty when nothing is hidden.
  const hidden = chats.slice(0, -MAX_VISIBLE_BUBBLES);

  return (
    // A vertical column: oldest at the top, newest at the bottom.
    <Stack
      spacing={1}
      sx={{
        mb: 1,
        alignItems: 'center', // centers the smaller close-all button over the 48px bubbles
        '&:hover .bubbles-close-all, &:focus-within .bubbles-close-all': {
          opacity: 1,
        },
      }}
    >
      <Tooltip title="Close all chats" placement="left" arrow>
        <IconButton
          className="bubbles-close-all"
          size="small"
          aria-label="Close all chats"
          onClick={onCloseAll}
          sx={{
            opacity: 0, // hidden until the Stack's hover rule shows it
            transition: (theme) => theme.transitions.create('opacity'),
            bgcolor: 'background.paper',
            boxShadow: 1,
            '&:hover': { bgcolor: 'grey.100' },
          }}
        >
          <CloseIcon fontSize="small" />
        </IconButton>
      </Tooltip>
      {hidden.length > 0 && (
        <IconButton
          onClick={(e) => setMenuAnchor(e.currentTarget)}
          aria-label={`${hidden.length} more chats`}
          sx={{ p: 0, boxShadow: 3 }}
        >
          <Avatar
            sx={{
              width: 48,
              height: 48,
              bgcolor: 'background.paper',
              color: 'text.secondary',
            }}
          >
            +{hidden.length}.
          </Avatar>
        </IconButton>
      )}
      <Menu
        anchorEl={menuAnchor}
        open={Boolean(menuAnchor)}
        onClose={() => setMenuAnchor(null)}
        // Open to the LEFT of the bubble, since the bubbles sit at the screen's right edge.
        anchorOrigin={{ vertical: 'top', horizontal: 'left' }}
        transformOrigin={{ vertical: 'top', horizontal: 'right' }}
      >
        {/* one MenuItem per hidden chat */}
      </Menu>
      {visible.map((chat) => (
        <Box
          key={chat.id}
          sx={{
            position: 'relative',
            '&:hover .bubble-close, &:focus-within .bubble-close': {
              opacity: 1,
            },
          }}
        >
          <Tooltip title={chat.formattedName} placement="left" arrow>
            <IconButton
              aria-label={`Open chat with ${chat.formattedName}`}
              onClick={() => onOpen(chat.id)}
              sx={{ p: 0, boxShadow: 3 }}
            >
              <EmployeeAvatar
                id={chat.id}
                name={chat.formattedName}
                avatarStyle={chat.avatarStyle}
                size={48}
              />
            </IconButton>
          </Tooltip>

          <IconButton
            className="bubble-close"
            size="small"
            aria-label={`Close chat with ${chat.formattedName}`}
            onClick={() => onClose(chat.id)}
            sx={{
              position: 'absolute', // placed relative to the wrapper Box
              top: -4, // nudged past the corner, so it overhangs the avatar
              right: -4,
              width: 20,
              height: 20,
              p: 0,
              opacity: 0, // invisible until the hover rule above sets it to 1
              transition: (theme) => theme.transitions.create('opacity'),
              bgcolor: 'background.paper',
              boxShadow: 1,
              '&:hover': { bgcolor: 'grey.100' },
            }}
          >
            <CloseIcon sx={{ fontSize: 14 }} />
          </IconButton>
        </Box>
      ))}
    </Stack>
  );
};

export default ChatBubbles;
