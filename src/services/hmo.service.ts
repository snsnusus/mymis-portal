import { apiClient } from '~/api/client';
import type {
  HmoProviderCreatePayload,
  HmoPlan,
  HmoPlanPayload,
  HmoPlanSummary,
  HmoProvider,
  HmoProviderPayload,
} from '~/models/hmo.model';

const PROVIDERS_URL = '/hmoproviders';
const PLANS_URL = '/hmoplans';

export const hmoService = {
  getAllProviders: async (): Promise<HmoProvider[]> => {
    const { data } = await apiClient.get<HmoProvider[]>(PROVIDERS_URL);
    return data;
  },

  getProviderById: async (id: number): Promise<HmoProvider> => {
    const { data } = await apiClient.get<HmoProvider>(`${PROVIDERS_URL}/${id}`);
    return data;
  },

  createProvider: async (
    payload: HmoProviderCreatePayload
  ): Promise<HmoProvider> => {
    const { data } = await apiClient.post<HmoProvider>(PROVIDERS_URL, payload);
    return data;
  },

  updateProvider: async (
    id: number,
    payload: HmoProviderPayload
  ): Promise<HmoProvider> => {
    const { data } = await apiClient.put<HmoProvider>(
      `${PROVIDERS_URL}/${id}`,
      payload
    );
    return data;
  },

  getPlansByProvider: async (providerId: number): Promise<HmoPlanSummary[]> => {
    const { data } = await apiClient.get<HmoPlanSummary[]>(PLANS_URL, {
      params: { providerId },
    });
    return data;
  },

  getPlanById: async (id: number): Promise<HmoPlan> => {
    const { data } = await apiClient.get<HmoPlan>(`${PLANS_URL}/${id}`);
    return data;
  },

  createPlan: async (payload: HmoPlanPayload): Promise<HmoPlan> => {
    const { data } = await apiClient.post<HmoPlan>(PLANS_URL, payload);
    return data;
  },

  updatePlan: async (id: number, payload: HmoPlanPayload): Promise<HmoPlan> => {
    const { data } = await apiClient.put<HmoPlan>(
      `${PLANS_URL}/${id}`,
      payload
    );
    return data;
  },
};
