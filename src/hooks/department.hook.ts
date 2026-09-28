import type {
  DepartmentFormValues,
  DepartmentNew,
} from '~/models/department.models';
import type { RawPosition } from '~/models/position.models';
import {
  useQuery,
  useMutation,
  useQueryClient,
  type UseQueryResult,
  type UseMutationResult,
} from '@tanstack/react-query';
import { departmentService } from '~/services/department.service';
import type { DepartmentDetail } from '~/models/department.model';
import { isNotFoundError } from '~/utils/http.util';

export const useGetDepartment = (
  id: number | undefined
): UseQueryResult<DepartmentDetail> =>
  useQuery({
    queryKey: ['departments', 'detail', id],
    queryFn: () => departmentService.getDepartmentById(id as number),
    enabled: id !== undefined,
    retry: (failureCount, error) => !isNotFoundError(error) && failureCount < 3,
  });

export const useGetDepartments = (): UseQueryResult<DepartmentNew[]> =>
  useQuery({
    queryKey: ['departments', 'new'],
    queryFn: departmentService.getDepartments,
  });

export const useCreateDepartment = (): UseMutationResult<
  string,
  unknown,
  DepartmentFormValues,
  unknown
> => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: departmentService.createDepartment,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['departments'] });
    },
    onError: (error) => {
      console.error('Error adding department to json-server:', error);
    },
  });
};

export const useGetPositionsByDepartment = (
  departmentId: string
): UseQueryResult<RawPosition[], unknown> =>
  useQuery({
    queryKey: ['departments', 'positions', departmentId],
    queryFn: () => departmentService.getPositionsByDepartment(departmentId),
    enabled: Boolean(departmentId),
  });
