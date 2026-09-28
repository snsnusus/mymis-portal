import React, {
  useState,
  useRef,
  useEffect,
  useMemo,
  type ReactElement,
} from 'react';

import { useWebSocket } from '~/contexts/websocket.context';
import { useAuth } from '~/contexts/auth.context';

import {
  Box,
  Paper,
  Typography,
  IconButton,
  InputBase,
  Divider,
  Collapse,
  Avatar,
} from '@mui/material';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import SendIcon from '@mui/icons-material/Send';
import CloseIcon from '@mui/icons-material/Close';

import { mockClient } from '~/api/client';
import { getPrivateRoomId } from '~/utils';

interface ChatWidgetProps {
  recipient: {
    id: string;
    firstName: string;
    lastName: string;
    avatar: string;
    username: string;
  } | null;
  onClose: () => void;
  directoryOffsetWidth: number;
}

const ChatWidget = ({
  recipient,
  onClose,
  directoryOffsetWidth,
}: ChatWidgetProps): ReactElement | null => {
  const { user } = useAuth();
  const [isOpen, setIsOpen] = useState(true);
  const [text, setText] = useState('');
  const [historyMessages, setHistoryMessages] = useState<any[]>([]);

  const { messages: liveMessages, sendMessage } = useWebSocket();
  const currentRoomId =
    user && recipient ? getPrivateRoomId(user.id, recipient.id) : '';

  const chatEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!currentRoomId) return;

    const loadChatHistory = async (): Promise<void> => {
      try {
        const res = await mockClient.get('/messages', {
          params: { roomId: currentRoomId },
        });
        setHistoryMessages(res.data);
      } catch (error) {
        console.error('Error fetching chat history:', error);
      }
    };
    loadChatHistory();
  }, [currentRoomId]);

  const activeRoomMessages = useMemo(
    () => [
      ...historyMessages.map((m) => ({
        user: m.senderName,
        text: m.text,
        timestamp: m.timestamp,
        roomId: m.roomId,
      })),
      ...liveMessages.filter((m: any) => m.roomId === currentRoomId),
    ],
    [historyMessages, liveMessages, currentRoomId]
  );

  useEffect(() => {
    if (isOpen) chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [activeRoomMessages, isOpen]);

  const handleToggleChat = (): void => {
    setIsOpen((prev) => !prev);
  };

  const handleSubmit = async (e: React.FormEvent): Promise<void> => {
    e.preventDefault();
    if (!text.trim() || !user || !recipient) return;

    const displayName = user.name;
    const timestampString = new Date().toLocaleTimeString([], {
      hour: '2-digit',
      minute: '2-digit',
    });

    const newMessagePayload = {
      text: text.trim(),
      userId: user.id,
      senderName: displayName,
      recipientId: recipient.id,
      roomId: currentRoomId,
      avatar: '',
      timestamp: timestampString,
    };

    try {
      await mockClient.post('/messages', newMessagePayload);

      sendMessage(text.trim(), displayName, currentRoomId);
      setText('');
    } catch (error) {
      console.error('Failed to log message:', error);
    }
  };

  if (!user || !recipient) return null;

  return (
    <Paper
      elevation={0}
      sx={{
        position: 'fixed',
        bottom: 0,
        right: `${directoryOffsetWidth}px`,
        transition: (theme) =>
          theme.transitions.create('right', {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.enteringScreen,
          }),
        marginBottom: { xs: '56px', sm: '56px' },
        width: 340,
        borderRadius: '8px 8px 0 0',
        borderTop: '1px solid',
        borderLeft: '1px solid',
        borderRight: '1px solid',
        borderColor: 'divider',
        display: 'flex',
        flexDirection: 'column',
        backgroundColor: 'background.paper',
        zIndex: (theme) => theme.zIndex.drawer + 1,
      }}
    >
      <Box
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
          borderBottom: !isOpen ? '1px solid' : 0,
          borderBottomColor: 'rgba(255, 255, 255, 0.2)',
        }}
      >
        <Box
          sx={{ display: 'flex', alignItems: 'center', gap: 1, flexGrow: 1 }}
        >
          <Avatar src={recipient?.avatar} sx={{ width: 24, height: 24 }} />
          <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>
            {recipient?.firstName} {recipient?.lastName}
          </Typography>
        </Box>

        <IconButton
          size="small"
          color="inherit"
          onClick={(e) => {
            e.stopPropagation();

            onClose();
            setIsOpen(true); // Reset to open when closed, so it opens in expanded state next time
          }}
        >
          <CloseIcon fontSize="small" />
        </IconButton>
        <IconButton
          size="small"
          color="inherit"
          sx={{ p: 0.25 }}
          onClick={handleToggleChat}
        >
          {isOpen ? <KeyboardArrowDownIcon /> : <KeyboardArrowUpIcon />}
        </IconButton>
      </Box>
      <Collapse in={isOpen} timeout="auto">
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
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
            {activeRoomMessages.map((msg, idx) => {
              const isMe = msg.user === user?.name;
              const isFirstInSequence =
                idx === 0 || activeRoomMessages[idx - 1]?.user !== msg.user;

              return (
                <Box
                  key={idx}
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
                      {msg.user}
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
                      sx={{
                        color: 'text.disabled',
                        fontSize: '0.625rem',
                        mt: 0.25,
                        px: 0.5,
                        display: 'block',
                      }}
                    >
                      {msg.timestamp || 'Just now'}
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
            placeholder="Type a message..."
            value={text}
            onChange={(e) => setText(e.target.value)}
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
            disabled={!text.trim()}
            sx={{ p: 1 }}
          >
            <SendIcon sx={{ fontSize: 16 }} />
          </IconButton>
        </Box>
      </Collapse>
    </Paper>
  );
};

export default ChatWidget;
