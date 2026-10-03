import type { Office, OfficePayload } from '~/models/office.model';
import { apiClient } from '~/api/client';

const BASE_URL = '/offices';

export const officeService = {
  getAll: async (): Promise<Office[]> => {
    const { data } = await apiClient.get<Office[]>(BASE_URL);
    return data;
  },

  create: async (payload: OfficePayload): Promise<Office> => {
    const { data } = await apiClient.post<Office>(BASE_URL, payload);
    return data;
  },

  update: async (id: number, payload: OfficePayload): Promise<Office> => {
    const { data } = await apiClient.put<Office>(`${BASE_URL}/${id}`, payload);
    return data;
  },

  remove: async (id: number): Promise<void> => {
    await apiClient.delete(`${BASE_URL}/${id}`);
  },
};
