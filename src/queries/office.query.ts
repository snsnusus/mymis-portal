import type { Office, OfficePayload } from '~/models/office.model';
import {
  useMutation,
  useQuery,
  useQueryClient,
  type UseMutationResult,
  type UseQueryResult,
} from '@tanstack/react-query';
import { officeService } from '~/services/office.service';

export const officeKeys = {
  all: ['offices'] as const,
};

export const useGetAll = (): UseQueryResult<Office[], Error> =>
  useQuery<Office[], Error>({
    queryKey: officeKeys.all,
    queryFn: officeService.getAll,
  });

interface SaveOfficeVariables {
  id: number | null; // null = create, number = update
  payload: OfficePayload;
}

export const useCreateOrUpdate = (): UseMutationResult<
  Office,
  Error,
  SaveOfficeVariables
> => {
  const queryClient = useQueryClient();

  return useMutation<Office, Error, SaveOfficeVariables>({
    mutationFn: ({ id, payload }) =>
      id === null
        ? officeService.create(payload)
        : officeService.update(id, payload),
    onSuccess: () =>
      queryClient.invalidateQueries({ queryKey: officeKeys.all }),
  });
};

export const useDelete = (): UseMutationResult<void, Error, number> => {
  const queryClient = useQueryClient();

  return useMutation<void, Error, number>({
    mutationFn: (id) => officeService.remove(id),
    onSuccess: () =>
      queryClient.invalidateQueries({ queryKey: officeKeys.all }),
  });
};
