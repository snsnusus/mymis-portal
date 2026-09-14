import { createAxiosInstance } from './config';

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
