import type { City, CityPayload } from '~/models/city.model';
import type { BulkInsertResult } from '~/models/bulk.model';
import { apiClient } from '~/api/client';

const BASE_URL = '/cities';

export const cityService = {
  // No regionId → all cities; with regionId → that region's cities.
  getAll: async (regionId?: number): Promise<City[]> => {
    const { data } = await apiClient.get<City[]>(BASE_URL, {
      params: { regionId },
    });
    return data;
  },

  create: async (payload: CityPayload): Promise<void> => {
    await apiClient.post(BASE_URL, payload);
  },

  update: async (id: number, payload: CityPayload): Promise<void> => {
    await apiClient.put(`${BASE_URL}/${id}`, payload);
  },

  bulkCreate: async (
    regionId: number,
    rows: unknown[]
  ): Promise<BulkInsertResult> => {
    const { data } = await apiClient.post<BulkInsertResult>(
      `${BASE_URL}/bulk`,
      rows,
      { params: { regionId } }
    );
    return data;
  },
};
