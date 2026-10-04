import type {
  Employee,
  EmployeeModel,
  EmployeeOption,
  EmployeeLookupModel,
} from '~/models/employee.model';
import { apiClient, mockClient } from '~/api/client';

const BASE_URL = '/employees';

export const employeeService = {
  getEmployeesWithFullDetails: async (): Promise<Employee[]> => {
    const { data: employees } = await apiClient.get<EmployeeModel[]>(BASE_URL);

    return employees.map((employee) => ({
      id: employee.id,
      firstName: employee.firstName,
      middleName: employee.middleName,
      lastName: employee.lastName,
      suffix: employee.suffix,
      formattedName: `${employee.firstName} ${employee.lastName}`,
      nickname: employee.nickname,
      gender: employee.gender,
      birthdate: employee.birthdate,
      birthplace: employee.birthplace,
      maritalStatus: employee.maritalStatus,
      nationality: employee.nationality,
      avatarUrl: employee.avatarUrl,
      employeeCode: employee.employeeCode,
      department: employee.departmentName ?? '',
      officeLocation: employee.officeLocation,
      workSchedule: employee.workSchedule,
      username: employee.username,
    }));
  },

  getEmployeeOptions: async (search?: string): Promise<EmployeeOption[]> => {
    const { data: employees } = await apiClient.get<EmployeeLookupModel[]>(
      `${BASE_URL}/lookup`,
      { params: { search: search || undefined } }
    );

    return employees.map((employee) => ({
      id: employee.id,
      formattedName: `${employee.firstName} ${employee.lastName}`,
      position: employee.positionTitle ?? '',
      avatarUrl: employee.avatarUrl,
      departmentId: employee.departmentId,
    }));
  },

  // NOT YET MIGRATED. MyMIS.Api has no partial-update endpoint - PUT
  // /api/Employees/{id} requires the full EmployeeUpdateDto on every call.
  // Left pointed at mockClient (old shape, string IDs) until a
  // fetch-then-full-PUT is deliberately implemented, or a dedicated
  // backend endpoint exists.
  updateEmployeeDepartment: async (
    employeeIds: string[],
    departmentId: string
  ): Promise<any> => {
    if (!employeeIds.length) return [];

    const patchPromises = employeeIds.map((employeeId) =>
      mockClient.patch(`/users/${employeeId}`, { departmentId })
    );

    const responses = await Promise.all(patchPromises);
    return responses.map((res) => res.data);
  },
};
