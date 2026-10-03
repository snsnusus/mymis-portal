import type { Employee, EmployeeOption } from '~/models/employee.model';

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
};

export const useGetEmployeesWithFullDetails = (): UseQueryResult<
  Employee[],
  Error
> =>
  useQuery({
    queryKey: [employeeKeys.all],
    queryFn: () => employeeService.getEmployeesWithFullDetails(),
  });

export const useGetEmployeeOptions = (): UseQueryResult<
  EmployeeOption[],
  Error
> =>
  useQuery({
    queryKey: [employeeKeys.all, 'options'],
    queryFn: () => employeeService.getEmployeeOptions(),
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
