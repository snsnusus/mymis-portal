// Wire types of mymis-chat-service (mirrors src/ws/protocol.ts and src/chat/chat.model.ts
// in that repo). If the service's protocol changes, update this file too.

// Longest message the service accepts (MAX_MESSAGE_LENGTH in the service's chat.model.ts).
export const CHAT_MAX_MESSAGE_LENGTH = 2000;

// A saved message, as the service sends it (WebSocket MESSAGE and REST history).
// id and createdAt are strings because JSON has no ObjectId or Date.
export interface ChatMessage {
  id: string;
  roomId: string;
  senderId: string;
  recipientId: string;
  text: string;
  createdAt: string; // ISO 8601, e.g. "2026-10-11T09:30:00.000Z"
}

// Messages the portal sends.
export type ChatClientMessage =
  | { type: 'AUTH'; token: string }
  | { type: 'GET_INITIAL_PRESENCE' }
  | { type: 'SEND_MESSAGE'; recipientId: string; text: string };

// Messages the service sends.
export type ChatServerMessage =
  | { type: 'AUTH_OK'; userId: string }
  | { type: 'INITIAL_PRESENCE_LIST'; userIds: string[] }
  | { type: 'USER_STATUS_CHANGE'; userId: string; status: 'online' | 'offline' }
  | { type: 'MESSAGE'; message: ChatMessage }
  | { type: 'ERROR'; message: string };

// One page of GET /conversations/:roomId/messages.
export interface ChatHistoryPage {
  messages: ChatMessage[]; // newest first
  nextCursor: string | null; // null = no older messages
}

// Application close codes the service uses (ADR-0005).
export const ChatCloseCode = {
  UNAUTHORIZED: 4001,
  TOKEN_EXPIRED: 4002,
  AUTH_TIMEOUT: 4008,
} as const;
