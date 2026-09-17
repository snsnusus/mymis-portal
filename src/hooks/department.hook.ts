import type {
  Department,
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

export const useGetDepartments = (): UseQueryResult<DepartmentNew[]> =>
  useQuery({
    queryKey: ['departments', 'new'],
    queryFn: departmentService.getDepartments,
  });

export const useGetAllDepartments = (): UseQueryResult<Department> =>
  useQuery({
    queryKey: ['departments'],
    queryFn: departmentService.getAllDepartments,
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
