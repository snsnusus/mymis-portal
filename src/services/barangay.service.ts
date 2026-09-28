import type { Barangay, BarangayPayload } from '~/models/barangay.model';
import { apiClient } from '~/api/client';
import type { BulkInsertResult } from '~/models/bulk.model';

const BASE_URL = '/barangays';

export const barangayService = {
  // cityId is required: loading every barangay (~42,000) is never wanted.
  getAll: async (cityId: number): Promise<Barangay[]> => {
    const { data } = await apiClient.get<Barangay[]>(BASE_URL, {
      params: { cityId },
    });
    return data;
  },

  create: async (payload: BarangayPayload): Promise<void> => {
    await apiClient.post(BASE_URL, payload);
  },

  update: async (id: number, payload: BarangayPayload): Promise<void> => {
    await apiClient.put(`${BASE_URL}/${id}`, payload);
  },

  bulkCreate: async (
    cityId: number,
    rows: unknown[]
  ): Promise<BulkInsertResult> => {
    const { data } = await apiClient.post<BulkInsertResult>(
      `${BASE_URL}/bulk`,
      rows,
      { params: { cityId } }
    );
    return data;
  },
};
