import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  type PropsWithChildren,
  type ReactElement,
} from 'react';
import { useSnackbar } from 'notistack';

import { refreshAccessToken } from '~/api/client';
import { CHAT_WS_URL, isChatEnabled } from '~/config/chat.config';
import { useAuth } from '~/contexts/auth.context';
import {
  ChatCloseCode,
  type ChatClientMessage,
  type ChatMessage,
  type ChatServerMessage,
} from '~/models/chat.model';
import { isTokenExpired } from '~/utils/token.util';

// disabled: chat not configured, or nobody logged in
// connecting: socket opening or waiting for AUTH_OK
// ready: authenticated; messages can be sent
// offline: connection lost; a reconnect may be scheduled
export type ChatStatus = 'disabled' | 'connecting' | 'ready' | 'offline';

interface WebSocketContextType {
  status: ChatStatus;
  onlineIds: ReadonlySet<string>;
  messages: ChatMessage[]; // live messages received since login, all rooms
  sendMessage: (recipientId: string, text: string) => boolean;
}

const WebSocketContext = createContext<WebSocketContextType | null>(null);

const MAX_RECONNECT_DELAY_MS = 30_000;

// 1 s, 2 s, 4 s, ... capped at 30 s, plus up to 1 s of random jitter.
const reconnectDelay = (attempt: number): number =>
  Math.min(1000 * 2 ** attempt, MAX_RECONNECT_DELAY_MS) + Math.random() * 1000;

// A valid access token: the stored one, or a refreshed one if it has expired.
const getFreshAccessToken = async (): Promise<string> => {
  const token = localStorage.getItem('access_token');
  if (token && !isTokenExpired(token)) {
    return token;
  }
  return refreshAccessToken();
};

export const WebSocketProvider = ({
  children,
}: PropsWithChildren): ReactElement => {
  const { user } = useAuth();
  const { enqueueSnackbar } = useSnackbar();

  const [status, setStatus] = useState<ChatStatus>('disabled');
  const [onlineIds, setOnlineIds] = useState<ReadonlySet<string>>(new Set());
  const [messages, setMessages] = useState<ChatMessage[]>([]);

  // The current socket, for sendMessage (refs don't trigger re-renders).
  const socketRef = useRef<WebSocket | null>(null);

  const userId = user?.id;

  useEffect(() => {
    if (!isChatEnabled || !CHAT_WS_URL || !userId) {
      setStatus('disabled');
      return;
    }
    const url = CHAT_WS_URL; // narrowed to string for the closures below

    let disposed = false; // set by cleanup: stop reconnecting after logout/unmount
    let attempt = 0; // consecutive failed connections, for the backoff
    let reconnectTimer: ReturnType<typeof setTimeout> | undefined;

    const handleServerMessage = (
      data: ChatServerMessage,
      ws: WebSocket
    ): void => {
      switch (data.type) {
        case 'AUTH_OK': {
          attempt = 0; // a successful login resets the backoff
          setStatus('ready');
          const request: ChatClientMessage = { type: 'GET_INITIAL_PRESENCE' };
          ws.send(JSON.stringify(request));
          break;
        }
        case 'INITIAL_PRESENCE_LIST':
          setOnlineIds(new Set(data.userIds));
          break;
        case 'USER_STATUS_CHANGE':
          setOnlineIds((prev) => {
            const next = new Set(prev); // copy: React state must not be mutated
            if (data.status === 'online') next.add(data.userId);
            else next.delete(data.userId);
            return next;
          });
          break;
        case 'MESSAGE':
          setMessages((prev) =>
            prev.some((m) => m.id === data.message.id)
              ? prev // already have it
              : [...prev, data.message]
          );
          break;
        case 'ERROR':
          enqueueSnackbar(data.message, { variant: 'warning' });
          break;
      }
    };

    const connect = async (): Promise<void> => {
      setStatus('connecting');

      // Schedules the next attempt with backoff. Defined inside connect, so it can
      // refer to connect itself (a function's own name is always in scope in its body).
      const scheduleReconnect = (): void => {
        if (disposed) return;
        const delay = reconnectDelay(attempt);
        attempt += 1;
        reconnectTimer = setTimeout(() => void connect(), delay);
      };

      let token: string;
      try {
        token = await getFreshAccessToken();
      } catch {
        // Refresh failed: the session is over. The API client's interceptor will send
        // the user to /login on their next request; just stop here.
        setStatus('offline');
        return;
      }
      if (disposed) return; // logged out while we were refreshing

      const ws = new WebSocket(url);
      socketRef.current = ws;

      ws.onopen = () => {
        const auth: ChatClientMessage = { type: 'AUTH', token };
        ws.send(JSON.stringify(auth));
      };

      ws.onmessage = (event: MessageEvent<string>) => {
        try {
          handleServerMessage(JSON.parse(event.data) as ChatServerMessage, ws);
        } catch (error) {
          console.error('[chat] could not handle message:', event.data, error);
        }
      };

      ws.onclose = (event) => {
        if (socketRef.current === ws) socketRef.current = null;
        setStatus('offline');
        setOnlineIds(new Set()); // presence is unknown while disconnected

        if (disposed) return;

        switch (event.code) {
          case ChatCloseCode.UNAUTHORIZED:
            // Invalid token or protocol error: retrying the same thing won't help.
            console.error('[chat] connection rejected: unauthorized');
            return;
          case ChatCloseCode.TOKEN_EXPIRED:
            // connect() fetches a fresh token first, so a normal reconnect handles it.
            scheduleReconnect();
            return;
          default:
            // Server down/restarting (1006), auth timeout (4008), network change...
            scheduleReconnect();
        }
      };
    };

    void connect();

    // Cleanup: runs on logout (userId changes) and on unmount.
    return () => {
      disposed = true;
      clearTimeout(reconnectTimer);
      socketRef.current?.close(1000, 'client closed');
      socketRef.current = null;
      setMessages([]);
      setOnlineIds(new Set());
    };
  }, [userId, enqueueSnackbar]);

  const sendMessage = useCallback(
    (recipientId: string, text: string): boolean => {
      const ws = socketRef.current;
      if (!ws || ws.readyState !== WebSocket.OPEN || status !== 'ready') {
        return false;
      }
      const message: ChatClientMessage = {
        type: 'SEND_MESSAGE',
        recipientId,
        text,
      };
      ws.send(JSON.stringify(message));
      return true;
    },
    [status]
  );

  const value = useMemo(
    () => ({ status, onlineIds, messages, sendMessage }),
    [status, onlineIds, messages, sendMessage]
  );

  return (
    <WebSocketContext.Provider value={value}>
      {children}
    </WebSocketContext.Provider>
  );
};

export const useWebSocket = (): WebSocketContextType => {
  const context = useContext(WebSocketContext);
  if (!context)
    throw new Error('useWebSocket must be used within a WebSocketProvider');
  return context;
};
