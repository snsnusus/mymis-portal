import {
  useMutation,
  useQuery,
  useQueryClient,
  type UseMutationResult,
  type UseQueryResult,
} from '@tanstack/react-query';
import type { Barangay, BarangayPayload } from '~/models/barangay.model';
import type { BulkInsertResult } from '~/models/bulk.model';
import { barangayService } from '~/services/barangay.service';

export const barangayKeys = {
  all: ['barangays'] as const,
  byCity: (cityId: number) => [...barangayKeys.all, { cityId }] as const,
};

export const useGetAll = (cityId: number): UseQueryResult<Barangay[], Error> =>
  useQuery<Barangay[], Error>({
    queryKey: barangayKeys.byCity(cityId),
    queryFn: () => barangayService.getAll(cityId),
  });

interface SaveBarangayVariables {
  id: number | null; // null = create, number = update
  payload: BarangayPayload;
}

export const useCreateOrUpdate = (): UseMutationResult<
  void,
  Error,
  SaveBarangayVariables
> => {
  const queryClient = useQueryClient();

  return useMutation<void, Error, SaveBarangayVariables>({
    mutationFn: async ({ id, payload }) => {
      if (id === null) {
        await barangayService.create(payload);
        return;
      }
      await barangayService.update(id, payload);
    },
    onSuccess: () =>
      queryClient.invalidateQueries({ queryKey: barangayKeys.all }),
  });
};

export const useBulkCreate = (
  cityId: number | undefined
): UseMutationResult<BulkInsertResult, Error, unknown[]> => {
  const queryClient = useQueryClient();

  return useMutation<BulkInsertResult, Error, unknown[]>({
    mutationFn: (rows) => {
      if (cityId === undefined) {
        throw new Error('Select a city first.');
      }
      return barangayService.bulkCreate(cityId, rows);
    },
    onSuccess: (result) => {
      if (result.inserted > 0 && cityId !== undefined) {
        queryClient.invalidateQueries({
          queryKey: barangayKeys.byCity(cityId),
        });
      }
    },
  });
};
