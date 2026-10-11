// Chat is on only when both chat service URLs are configured. In production they are
// unset until the service is deployed (M6), so the portal simply doesn't connect.
export const CHAT_WS_URL = import.meta.env.VITE_CHAT_WS_URL;

export const isChatEnabled = Boolean(
  import.meta.env.VITE_CHAT_WS_URL && import.meta.env.VITE_CHAT_API_URL
);
