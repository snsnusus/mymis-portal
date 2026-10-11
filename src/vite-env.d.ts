/// <reference types="vite/client" />

// Declares the app's own env variables, so import.meta.env.VITE_... is typed
// (instead of `any`) and a typo in the name is a compile error.
interface ImportMetaEnv {
  readonly VITE_API_BASE_URL: string;
  readonly VITE_DEFAULT_DEPARTMENT_COVER_IMAGE_URL: string;
  // Optional: not set in production until the chat service is deployed (M6).
  readonly VITE_CHAT_WS_URL?: string;
  readonly VITE_CHAT_API_URL?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
