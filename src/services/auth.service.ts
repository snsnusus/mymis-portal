import { apiClient, refreshClient } from '~/api/client';

interface AuthResponse {
  accessToken: string;
  refreshToken: string;
}

export const authService = {
  login: async (username: string, password: string): Promise<AuthResponse> => {
    const { data } = await apiClient.post<AuthResponse>('/Auth/login', {
      username,
      password,
    });

    return data;
  },
  logout: async (refreshToken: string): Promise<void> => {
    await apiClient.post('/Auth/logout', { refreshToken });
  },
  refresh: async (refreshToken: string): Promise<AuthResponse> => {
    const { data } = await refreshClient.post<AuthResponse>('/Auth/refresh', {
      refreshToken,
    });

    return data;
  },
};
