import {
  useMutation,
  useQuery,
  useQueryClient,
  type UseMutationResult,
  type UseQueryResult,
} from '@tanstack/react-query';
import type {
  HmoProviderCreatePayload,
  HmoPlan,
  HmoPlanPayload,
  HmoPlanSummary,
  HmoProvider,
  HmoProviderPayload,
} from '~/models/hmo.model';
import { hmoService } from '~/services/hmo.service';
import { isNotFoundError } from '~/utils/http.util';

export const hmoKeys = {
  all: ['hmo'] as const,
  providers: () => [...hmoKeys.all, 'providers'] as const,
  providerList: () => [...hmoKeys.providers(), 'list'] as const,
  providerDetail: (id: number | undefined) =>
    [...hmoKeys.providers(), 'detail', id] as const,
  plans: () => [...hmoKeys.all, 'plans'] as const,
  planList: (providerId: number | undefined) =>
    [...hmoKeys.plans(), 'list', { providerId }] as const,
  planDetail: (id: number | undefined) =>
    [...hmoKeys.plans(), 'detail', id] as const,
};

const MAX_RETRIES = 3;

const retryUnlessNotFound = (failureCount: number, error: Error): boolean =>
  !isNotFoundError(error) && failureCount < MAX_RETRIES;

// ---------- Providers ----------

export const useGetHmoProviders = (): UseQueryResult<HmoProvider[], Error> =>
  useQuery<HmoProvider[], Error>({
    queryKey: hmoKeys.providerList(),
    queryFn: () => hmoService.getAllProviders(),
  });

export const useGetHmoProvider = (
  id: number | undefined
): UseQueryResult<HmoProvider, Error> =>
  useQuery<HmoProvider, Error>({
    queryKey: hmoKeys.providerDetail(id),
    queryFn: () => hmoService.getProviderById(id as number),
    enabled: id !== undefined,
    retry: retryUnlessNotFound,
  });

export const useCreateHmoProvider = (): UseMutationResult<
  HmoProvider,
  Error,
  HmoProviderCreatePayload
> => {
  const queryClient = useQueryClient();

  return useMutation<HmoProvider, Error, HmoProviderCreatePayload>({
    mutationFn: (payload) => hmoService.createProvider(payload),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: hmoKeys.all }),
  });
};

interface UpdateHmoProviderVariables {
  id: number;
  payload: HmoProviderPayload;
}

export const useUpdateHmoProvider = (): UseMutationResult<
  HmoProvider,
  Error,
  UpdateHmoProviderVariables
> => {
  const queryClient = useQueryClient();

  return useMutation<HmoProvider, Error, UpdateHmoProviderVariables>({
    mutationFn: ({ id, payload }) => hmoService.updateProvider(id, payload),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: hmoKeys.all }),
  });
};

export const useGetHmoPlans = (
  providerId: number | undefined
): UseQueryResult<HmoPlanSummary[], Error> =>
  useQuery<HmoPlanSummary[], Error>({
    queryKey: hmoKeys.planList(providerId),
    queryFn: () => hmoService.getPlansByProvider(providerId as number),
    enabled: providerId !== undefined,
  });

export const useGetHmoPlan = (
  id: number | undefined
): UseQueryResult<HmoPlan, Error> =>
  useQuery<HmoPlan, Error>({
    queryKey: hmoKeys.planDetail(id),
    queryFn: () => hmoService.getPlanById(id as number),
    enabled: id !== undefined,
    retry: retryUnlessNotFound,
  });

interface SaveHmoPlanVariables {
  id: number | null;
  payload: HmoPlanPayload;
}

export const useSaveHmoPlan = (): UseMutationResult<
  HmoPlan,
  Error,
  SaveHmoPlanVariables
> => {
  const queryClient = useQueryClient();

  return useMutation<HmoPlan, Error, SaveHmoPlanVariables>({
    mutationFn: ({ id, payload }) =>
      id === null
        ? hmoService.createPlan(payload)
        : hmoService.updatePlan(id, payload),
    onSuccess: () =>
      queryClient.invalidateQueries({ queryKey: hmoKeys.plans() }),
  });
};
