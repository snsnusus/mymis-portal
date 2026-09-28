import type { Region, RegionPayload } from '~/models/region.model';
import type { BulkInsertResult } from '~/models/bulk.model';
import { apiClient } from '~/api/client';

const BASE_URL = '/regions';

export const regionService = {
  getAll: async (): Promise<Region[]> => {
    const { data } = await apiClient.get<Region[]>(BASE_URL);
    return data;
  },

  create: async (payload: RegionPayload): Promise<void> => {
    await apiClient.post(BASE_URL, payload);
  },

  update: async (id: number, payload: RegionPayload): Promise<void> => {
    await apiClient.put(`${BASE_URL}/${id}`, payload);
  },

  bulkCreate: async (rows: unknown[]): Promise<BulkInsertResult> => {
    const { data } = await apiClient.post<BulkInsertResult>(
      `${BASE_URL}/bulk`,
      rows
    );
    return data;
  },
};
