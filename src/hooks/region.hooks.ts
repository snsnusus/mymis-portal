import type { Region, RegionPayload } from '~/models/region.model';
import {
  useMutation,
  type UseMutationResult,
  useQuery,
  useQueryClient,
  type UseQueryResult,
} from '@tanstack/react-query';
import { regionService } from '~/services/region.service';
import type { BulkInsertResult } from '~/models/bulk.model';

interface CreateOrUpdateRegionVariables {
  id: number | null; // null = create, number = update
  payload: RegionPayload;
}

const regionKeys = {
  all: ['regions'] as const,
};

export const useGetAll = (): UseQueryResult<Region[], Error> =>
  useQuery({
    queryKey: regionKeys.all,
    queryFn: regionService.getAll,
  });

export const useCreateOrUpdate = (): UseMutationResult<
  void,
  Error,
  CreateOrUpdateRegionVariables
> => {
  const queryClient = useQueryClient();

  return useMutation<void, Error, CreateOrUpdateRegionVariables>({
    mutationFn: async ({ id, payload }) => {
      if (id === null) {
        await regionService.create(payload);
        return;
      }
      await regionService.update(id, payload);
    },
    onSuccess: () =>
      queryClient.invalidateQueries({ queryKey: regionKeys.all }),
  });
};

export const useBulkCreate = (): UseMutationResult<
  BulkInsertResult,
  Error,
  unknown[]
> => {
  const queryClient = useQueryClient();

  return useMutation<BulkInsertResult, Error, unknown[]>({
    mutationFn: (rows) => regionService.bulkCreate(rows),
    onSuccess: (result) => {
      // Only refetch if something actually changed.
      if (result.inserted > 0) {
        queryClient.invalidateQueries({ queryKey: regionKeys.all });
      }
    },
  });
};
