import type {
  EmployeeOption,
  EmployeePageParams,
  EmployeeSummaryModel,
} from '~/models/employee.model';
import type { PagedResult } from '~/models/paged-result.model';

import { employeeService } from '~/services/employee.service';
import {
  useMutation,
  useQuery,
  useQueryClient,
  type UseMutationResult,
  type UseQueryResult,
} from '@tanstack/react-query';

interface UpdateEmployeeDepartmentParams {
  employeeIds: string[];
  departmentId: string;
}

const employeeKeys = {
  all: ['employees'] as const,
  options: (search: string) =>
    [...employeeKeys.all, 'options', { search }] as const,
  paged: (params: EmployeePageParams) =>
    [...employeeKeys.all, 'paged', params] as const,
};

export const useGetEmployeesPaged = (
  params: EmployeePageParams
): UseQueryResult<PagedResult<EmployeeSummaryModel>, Error> =>
  useQuery({
    queryKey: employeeKeys.paged(params),
    queryFn: () => employeeService.getPaged(params),
    keepPreviousData: true,
  });

export const useGetEmployeeOptions = (
  search = ''
): UseQueryResult<EmployeeOption[], Error> =>
  useQuery({
    queryKey: employeeKeys.options(search),
    queryFn: () => employeeService.getEmployeeOptions(search),
    keepPreviousData: true,
  });

export const useUpdateEmployeeDepartment = (): UseMutationResult<
  any,
  unknown,
  UpdateEmployeeDepartmentParams,
  unknown
> => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      employeeIds,
      departmentId,
    }: UpdateEmployeeDepartmentParams) =>
      employeeService.updateEmployeeDepartment(employeeIds, departmentId),

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [employeeKeys.all, 'update'],
      });
    },
  });
};
