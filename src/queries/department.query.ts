import type {
  Department,
  DepartmentDetail,
  // DepartmentFormValues,
} from '~/models/department.model';
import type { RawPosition } from '~/models/position.models';
import {
  useQuery,
  // useMutation,
  // useQueryClient,
  type UseQueryResult,
  // type UseMutationResult,
} from '@tanstack/react-query';
import { departmentService } from '~/services/department.service';
import { isNotFoundError } from '~/utils/http.util';

export const useGetById = (
  id: number | undefined
): UseQueryResult<DepartmentDetail> =>
  useQuery({
    queryKey: ['departments', 'detail', id],
    queryFn: () => departmentService.getDepartmentById(id as number),
    enabled: id !== undefined,
    retry: (failureCount, error) => !isNotFoundError(error) && failureCount < 3,
  });

export const useGetAll = (): UseQueryResult<Department[]> =>
  useQuery({
    queryKey: ['departments'],
    queryFn: departmentService.getDepartments,
  });

// export const useCreate = (): UseMutationResult<
//   string,
//   unknown,
//   DepartmentFormValues,
//   unknown
// > => {
//   const queryClient = useQueryClient();

//   return useMutation({
//     mutationFn: departmentService.createDepartment,
//     onSuccess: () => {
//       queryClient.invalidateQueries({ queryKey: ['departments'] });
//     },
//     onError: (error) => {
//       console.error('Error adding department to json-server:', error);
//     },
//   });
// };

export const useGetPositionsByDepartment = (
  departmentId: string
): UseQueryResult<RawPosition[], unknown> =>
  useQuery({
    queryKey: ['departments', 'positions', departmentId],
    queryFn: () => departmentService.getPositionsByDepartment(departmentId),
    enabled: Boolean(departmentId),
  });
