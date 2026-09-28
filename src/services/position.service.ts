import type { Position } from '~/models/position.model';
import { apiClient } from '~/api/client';

const BASE_URL = '/positions';

export const positionService = {
  getAll: async (departmentId?: number): Promise<Position[]> => {
    const { data } = await apiClient.get<Position[]>(BASE_URL, {
      params: { departmentId },
    });
    return data;
  },
};
