import {
  useMutation,
  useQuery,
  useQueryClient,
  type UseMutationResult,
  type UseQueryResult,
} from '@tanstack/react-query';
import type { BulkInsertResult } from '~/models/bulk.model';
import type { City, CityPayload } from '~/models/city.model';
import { cityService } from '~/services/city.service';

export const cityKeys = {
  all: ['cities'] as const,
  byRegion: (regionId: number | undefined) =>
    [...cityKeys.all, { regionId }] as const,
};

export const useGetAll = (
  regionId: number | undefined
): UseQueryResult<City[], Error> =>
  useQuery<City[], Error>({
    queryKey: cityKeys.byRegion(regionId),
    queryFn: () => cityService.getAll(regionId),
    enabled: regionId !== undefined, // don't fetch until a region is known
  });

interface SaveCityVariables {
  id: number | null; // null = create, number = update
  payload: CityPayload;
}

export const useCreateOrUpdate = (): UseMutationResult<
  void,
  Error,
  SaveCityVariables
> => {
  const queryClient = useQueryClient();

  return useMutation<void, Error, SaveCityVariables>({
    mutationFn: async ({ id, payload }) => {
      if (id === null) {
        await cityService.create(payload);
        return;
      }
      await cityService.update(id, payload);
    },
    // Prefix match: invalidates EVERY region's city list at once.
    onSuccess: () => queryClient.invalidateQueries({ queryKey: cityKeys.all }),
  });
};

export const useBulkCreate = (
  regionId: number | undefined
): UseMutationResult<BulkInsertResult, Error, unknown[]> => {
  const queryClient = useQueryClient();

  return useMutation<BulkInsertResult, Error, unknown[]>({
    mutationFn: (rows) => {
      if (regionId === undefined) {
        throw new Error('Select a region first.');
      }
      return cityService.bulkCreate(regionId, rows);
    },
    onSuccess: (result) => {
      if (result.inserted > 0) {
        // Bulk upload only adds cities to ONE region, so only that list is stale.
        queryClient.invalidateQueries({
          queryKey: cityKeys.byRegion(regionId),
        });
      }
    },
  });
};
