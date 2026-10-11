import axios, {
  type AxiosInstance,
  type InternalAxiosRequestConfig,
} from 'axios';
import { createAxiosInstance } from './config';

interface RetryableRequestConfig extends InternalAxiosRequestConfig {
  _retry?: boolean;
}

interface AuthTokens {
  accessToken: string;
  refreshToken: string;
}

// OTP endpoints in server/ (temporary, ADR-0008: until OTP is rebuilt in mymis-api).
export const otpClient = createAxiosInstance({
  baseURL: 'http://localhost:4100',
});

// Json-server Client
export const mockClient = createAxiosInstance({
  baseURL: 'http://localhost:3001',
  headers: {
    'Content-Type': 'application/json',
  },
});

// .NET Client
export const apiClient = createAxiosInstance({
  baseURL: import.meta.env.VITE_API_BASE_URL,
});

// Chat service (mymis-chat-service). Undefined URL = chat not configured (e.g. production
// until the service is deployed); callers check isChatEnabled before using it.
export const chatClient = createAxiosInstance({
  baseURL: import.meta.env.VITE_CHAT_API_URL,
});

// A second, interceptor-free instance used only for the refresh call itself -
// this is what prevents a failed refresh from re-triggering the response
// interceptor below and looping back into itself.
export const refreshClient = createAxiosInstance({
  baseURL: import.meta.env.VITE_API_BASE_URL,
});

const forceLogout = (): void => {
  localStorage.removeItem('access_token');
  localStorage.removeItem('refresh_token');
  window.location.href = '/login';
};

// The refresh currently in flight, shared by every caller (single-flight).
let refreshPromise: Promise<string> | null = null;

// Gets a new access token using the stored refresh token, saves both tokens, and returns
// the new access token. Concurrent callers (several 401s, or a 401 and a WebSocket 4002
// at the same moment) all receive the SAME promise, so the API is called only once.
export const refreshAccessToken = (): Promise<string> => {
  if (refreshPromise) {
    return refreshPromise;
  }

  refreshPromise = (async () => {
    const refreshToken = localStorage.getItem('refresh_token');
    if (!refreshToken) {
      throw new Error('No refresh token');
    }

    const { data } = await refreshClient.post<AuthTokens>('/Auth/refresh', {
      refreshToken,
    });

    localStorage.setItem('access_token', data.accessToken);
    localStorage.setItem('refresh_token', data.refreshToken);
    return data.accessToken;
  })().finally(() => {
    // Success or failure, the next caller after this one starts a fresh refresh.
    refreshPromise = null;
  });

  return refreshPromise;
};

// Adds "Authorization: Bearer <token>" to every request of `instance`, and on a 401
// refreshes the token once and retries the request. Used by every client that calls
// an API trusting mymis-api's tokens.
const attachAuthInterceptors = (instance: AxiosInstance): void => {
  instance.interceptors.request.use((config) => {
    const accessToken = localStorage.getItem('access_token');

    if (accessToken) {
      config.headers.Authorization = `Bearer ${accessToken}`;
    }

    return config;
  });

  instance.interceptors.response.use(
    (response) => response,
    async (error: unknown) => {
      // Only handle a 401 from a request we can retry; anything else passes through.
      if (
        !axios.isAxiosError(error) ||
        error.response?.status !== 401 ||
        !error.config
      ) {
        return Promise.reject(error);
      }

      const originalRequest = error.config as RetryableRequestConfig;

      // Already retried once with a fresh token and still 401: give up.
      if (originalRequest._retry) {
        return Promise.reject(error);
      }
      originalRequest._retry = true;

      try {
        const newAccessToken = await refreshAccessToken();
        originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
        return instance(originalRequest); // retry on the SAME instance it came from
      } catch (refreshError) {
        forceLogout();
        return Promise.reject(refreshError);
      }
    }
  );
};

attachAuthInterceptors(apiClient);
attachAuthInterceptors(chatClient);
