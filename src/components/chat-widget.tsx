import {
  useEffect,
  useMemo,
  useRef,
  useState,
  type FormEvent,
  type ReactElement,
} from 'react';
import { useSnackbar } from 'notistack';

import {
  Box,
  Button,
  Paper,
  Typography,
  IconButton,
  InputBase,
  Divider,
} from '@mui/material';
import SendIcon from '@mui/icons-material/Send';
import CloseIcon from '@mui/icons-material/Close';
import RemoveIcon from '@mui/icons-material/Remove';

import { EmployeeAvatar } from '~/components/modules/employee-avatar';
import { useAuth } from '~/contexts/auth.context';
import { useWebSocket, type ChatStatus } from '~/contexts/websocket.context';
import { CHAT_MAX_MESSAGE_LENGTH, type ChatMessage } from '~/models/chat.model';
import type { EmployeeOption } from '~/models/employee.model';
import { useChatHistory } from '~/queries/chat.query';
import { getPrivateRoomId } from '~/utils';

interface ChatWidgetProps {
  recipient: EmployeeOption | null;
  onClose: () => void;
  onMinimize: () => void;
}

const PLACEHOLDER_BY_STATUS: Record<ChatStatus, string> = {
  ready: 'Type a message...',
  connecting: 'Connecting...',
  offline: 'Chat is offline',
  disabled: 'Chat is unavailable',
};

// "09:30 AM" in the viewer's locale and time zone (createdAt is UTC).
const formatTime = (iso: string): string =>
  new Date(iso).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

// Oldest first. ISO timestamps in the same format sort correctly as plain strings;
// the id (an ObjectId, which grows over time) breaks ties, like the service's index.
const byCreatedAt = (a: ChatMessage, b: ChatMessage): number =>
  a.createdAt.localeCompare(b.createdAt) || a.id.localeCompare(b.id);

const ChatWidget = ({
  recipient,
  onClose,
  onMinimize,
}: ChatWidgetProps): ReactElement | null => {
  const { user } = useAuth();
  const {
    status,
    onlineIds,
    messages: liveMessages,
    sendMessage,
  } = useWebSocket();
  const { enqueueSnackbar } = useSnackbar();

  const [text, setText] = useState('');
  const chatEndRef = useRef<HTMLDivElement>(null);

  // Chat ids are strings (they come from the token's sub); employee ids are numbers.
  const recipientId = recipient ? String(recipient.id) : '';
  const roomId =
    user && recipient ? getPrivateRoomId(user.id, recipientId) : '';

  const history = useChatHistory(roomId);

  // History pages + live messages for this room, de-duplicated by id, oldest first.
  // A message can be in both (sent after the history loaded, then refetched), so the
  // Map keeps one copy per id.
  const roomMessages = useMemo(() => {
    const byId = new Map<string, ChatMessage>();
    history.data?.pages.forEach((page) =>
      page.messages.forEach((message) => byId.set(message.id, message))
    );
    liveMessages.forEach((message) => {
      if (message.roomId === roomId) byId.set(message.id, message);
    });
    return [...byId.values()].sort(byCreatedAt);
  }, [history.data, liveMessages, roomId]);

  // Scroll to the bottom only when the NEWEST message changes (or the widget mounts),
  // so loading older messages at the top doesn't jump the view.
  const lastMessageId = roomMessages.at(-1)?.id;
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [lastMessageId]);

  const handleSubmit = (e: FormEvent): void => {
    e.preventDefault();
    const trimmed = text.trim();
    if (!trimmed || !recipient) return;

    // The server saves the message and sends it back to us as MESSAGE, which is what
    // shows it in the list, so a message is only displayed once it's really saved.
    if (sendMessage(recipientId, trimmed)) {
      setText('');
    } else {
      enqueueSnackbar('Chat is offline. Your message was not sent.', {
        variant: 'error',
      });
    }
  };

  if (!user || !recipient) return null;

  const isReady = status === 'ready';
  const isRecipientOnline = onlineIds.has(recipientId);

  return (
    <Paper
      elevation={0}
      sx={{
        width: 340,
        borderRadius: '8px 8px 0 0',
        borderTop: '1px solid',
        borderLeft: '1px solid',
        borderRight: '1px solid',
        borderColor: 'divider',
        display: 'flex',
        flexDirection: 'column',
        backgroundColor: 'background.paper',
      }}
    >
      <Box
        onClick={() => onMinimize()}
        sx={{
          backgroundColor: 'primary.main',
          color: 'primary.contrastText',
          px: 2,
          py: 1.25,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          cursor: 'pointer',
          userSelect: 'none',
        }}
      >
        <Box
          sx={{ display: 'flex', alignItems: 'center', gap: 1, flexGrow: 1 }}
        >
          <EmployeeAvatar
            id={recipient.id}
            name={recipient.formattedName}
            avatarUrl={recipient.avatarUrl}
            avatarStyle={recipient.avatarStyle}
            size={24}
          />
          <Box
            sx={{ display: 'flex', flexDirection: 'column', lineHeight: 1.1 }}
          >
            <Typography
              variant="subtitle2"
              sx={{ fontWeight: 600, lineHeight: 1.2 }}
            >
              {recipient.formattedName}
            </Typography>
            <Typography
              variant="caption"
              sx={{ opacity: 0.8, lineHeight: 1.2 }}
            >
              {isRecipientOnline ? 'Online' : 'Offline'}
            </Typography>
          </Box>
        </Box>
        <IconButton
          size="small"
          color="inherit"
          onClick={(e) => {
            e.stopPropagation();
            onMinimize();
          }}
        >
          <RemoveIcon fontSize="small" />
        </IconButton>
        <IconButton
          size="small"
          color="inherit"
          onClick={(e) => {
            e.stopPropagation();
            onClose();
          }}
        >
          <CloseIcon fontSize="small" />
        </IconButton>
      </Box>
      <Box
        sx={{
          height: 280,
          backgroundColor: 'grey.50',
          overflowY: 'auto',
          p: 2,
          display: 'flex',
          flexDirection: 'column',
          gap: 1.5,
        }}
      >
        {history.hasNextPage && (
          <Button
            size="small"
            onClick={() => void history.fetchNextPage()}
            disabled={history.isFetchingNextPage}
            sx={{ alignSelf: 'center' }}
          >
            {history.isFetchingNextPage ? 'Loading...' : 'Load older messages'}
          </Button>
        )}
        {history.isError && (
          <Typography
            variant="caption"
            color="error"
            sx={{ alignSelf: 'center' }}
          >
            Could not load earlier messages.
          </Typography>
        )}
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
          {roomMessages.map((msg, idx) => {
            const isMe = msg.senderId === user.id;
            const isFirstInSequence =
              idx === 0 || roomMessages[idx - 1]?.senderId !== msg.senderId;

            return (
              <Box
                key={msg.id}
                sx={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: isMe ? 'flex-end' : 'flex-start',
                  width: '100%',
                  mt: isFirstInSequence && idx !== 0 ? 1.5 : 0,
                }}
              >
                {!isMe && isFirstInSequence && (
                  <Typography
                    variant="caption"
                    sx={{
                      pl: 1,
                      mb: 0.25,
                      fontWeight: 600,
                      color: 'primary.main',
                      fontSize: '0.75rem',
                    }}
                  >
                    {recipient.formattedName}
                  </Typography>
                )}
                <Box
                  sx={{
                    maxWidth: '80%',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: isMe ? 'flex-end' : 'flex-start',
                  }}
                >
                  <Box
                    sx={{
                      backgroundColor: isMe
                        ? 'primary.main'
                        : 'background.paper',
                      color: isMe ? 'primary.contrastText' : 'text.primary',
                      px: 1.75,
                      py: 1,
                      fontSize: '0.875rem',
                      lineHeight: 1.4,
                      boxShadow: '0px 1px 2px rgba(0, 0, 0, 0.06)',
                      border: isMe ? 'none' : '1px solid',
                      borderColor: 'grey.200',
                      borderRadius: 4,
                    }}
                  >
                    <Typography
                      variant="body2"
                      sx={{ wordBreak: 'break-word', whiteSpace: 'pre-wrap' }}
                    >
                      {msg.text}
                    </Typography>
                  </Box>
                  <Typography
                    variant="caption"
                    title={new Date(msg.createdAt).toLocaleString()}
                    sx={{
                      color: 'text.disabled',
                      fontSize: '0.625rem',
                      mt: 0.25,
                      px: 0.5,
                      display: 'block',
                    }}
                  >
                    {formatTime(msg.createdAt)}
                  </Typography>
                </Box>
              </Box>
            );
          })}
        </Box>
        <div ref={chatEndRef} />
      </Box>
      <Divider />
      <Box
        component="form"
        onSubmit={handleSubmit}
        sx={{
          p: 1,
          backgroundColor: 'background.paper',
          display: 'flex',
          alignItems: 'center',
          gap: 1,
        }}
      >
        <InputBase
          size="small"
          placeholder={PLACEHOLDER_BY_STATUS[status]}
          value={text}
          onChange={(e) => setText(e.target.value)}
          disabled={!isReady}
          inputProps={{ maxLength: CHAT_MAX_MESSAGE_LENGTH }}
          sx={{
            flex: 1,
            bgcolor: 'grey.100',
            px: 2,
            py: 0.5,
            borderRadius: 5,
            fontSize: '0.875rem',
          }}
        />
        <IconButton
          type="submit"
          color="primary"
          disabled={!isReady || !text.trim()}
          sx={{ p: 1 }}
        >
          <SendIcon sx={{ fontSize: 16 }} />
        </IconButton>
      </Box>
    </Paper>
  );
};

export default ChatWidget;
