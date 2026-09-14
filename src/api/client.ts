import { type InternalAxiosRequestConfig } from 'axios';
import { createAxiosInstance } from './config';

interface RetryableRequestConfig extends InternalAxiosRequestConfig {
  _retry?: boolean;
}

// Express.js/Nest.js Client
export const nodeClient = createAxiosInstance({
  baseURL: 'http://localhost:4000',
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

// A second, interceptor-free instance used only for the refresh call itself -
// this is what prevents a failed refresh from re-triggering the response
// interceptor below and looping back into itself.
export const refreshClient = createAxiosInstance({
  baseURL: import.meta.env.VITE_API_BASE_URL,
});

let isRefreshing = false;
let pendingRequests: Array<(token: string) => void> = [];

const forceLogout = (): void => {
  localStorage.removeItem('access_token');
  localStorage.removeItem('refresh_token');
  window.location.href = '/login';
};

apiClient.interceptors.request.use((config) => {
  const accessToken = localStorage.getItem('access_token');

  if (accessToken) {
    config.headers.Authorization = `Bearer ${accessToken}`;
  }

  return config;
});

apiClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config as RetryableRequestConfig;

    if (error.response?.status !== 401 || originalRequest._retry) {
      return Promise.reject(error);
    }

    const refreshToken = localStorage.getItem('refresh_token');

    if (!refreshToken) {
      forceLogout();
      return Promise.reject(error);
    }

    originalRequest._retry = true;

    if (isRefreshing) {
      return new Promise((resolve) => {
        pendingRequests.push((newAccessToken: string) => {
          originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
          resolve(apiClient(originalRequest));
        });
      });
    }

    isRefreshing = true;

    try {
      const { data } = await refreshClient.post('/Auth/refresh', {
        refreshToken,
      });

      localStorage.setItem('access_token', data.accessToken);
      localStorage.setItem('refresh_token', data.refreshToken);

      pendingRequests.forEach((retryCallback) =>
        retryCallback(data.accessToken)
      );
      pendingRequests = [];

      originalRequest.headers.Authorization = `Bearer ${data.accessToken}`;
      return apiClient(originalRequest);
    } catch (refreshError) {
      pendingRequests = [];
      forceLogout();
      return Promise.reject(refreshError);
    } finally {
      isRefreshing = false;
    }
  }
);
