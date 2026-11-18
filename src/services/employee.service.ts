import type {
  AvatarStyle,
  EmployeeDetailModel,
  EmployeeLookupModel,
  EmployeeOption,
  EmployeePageParams,
  EmployeeSummaryModel,
  UsernameAvailability,
  UsernameSuggestions,
  UsernameSuggestionParams,
} from '~/models/employee.model';
import type { PagedResult } from '~/models/paged-result.model';
import { apiClient, mockClient } from '~/api/client';
import { toEmployeeOption } from '~/mappers/employee.mapper';

const BASE_URL = '/employees';

export const employeeService = {
  getPaged: async ({
    pageIndex,
    pageSize,
    search,
  }: EmployeePageParams): Promise<PagedResult<EmployeeSummaryModel>> => {
    const { data: result } = await apiClient.get<
      PagedResult<EmployeeSummaryModel>
    >(BASE_URL, {
      params: {
        page: pageIndex + 1, // API pages are 1-based
        pageSize,
        search: search || undefined,
      },
    });

    return result;
  },

  getEmployeeOptions: async (
    search?: string,
    limit?: number
  ): Promise<EmployeeOption[]> => {
    const { data: employees } = await apiClient.get<EmployeeLookupModel[]>(
      `${BASE_URL}/lookup`,
      { params: { search: search || undefined, limit } }
    );

    return employees.map(toEmployeeOption);
  },

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

  getById: async (id: number): Promise<EmployeeDetailModel> => {
    const { data: employee } = await apiClient.get<EmployeeDetailModel>(
      `${BASE_URL}/${id}`
    );

    return employee;
  },

  updateMyAvatarStyle: async (avatarStyle: AvatarStyle): Promise<void> => {
    await apiClient.put(`${BASE_URL}/me/avatar-style`, { avatarStyle });
  },

  isUsernameAvailable: async (username: string): Promise<boolean> => {
    const { data } = await apiClient.get<UsernameAvailability>(
      `${BASE_URL}/availability`,
      { params: { username } }
    );

    return data.available;
  },

  getEmployeesByIds: async (ids: number[]): Promise<EmployeeOption[]> => {
    const { data: employees } = await apiClient.get<EmployeeLookupModel[]>(
      `${BASE_URL}/lookup`,
      {
        params: { ids, limit: ids.length },
        // Repeated keys (ids=3&ids=12), the format ASP.NET Core binds to int[].
        paramsSerializer: { indexes: null },
      }
    );

    return employees.map(toEmployeeOption);
  },

  suggestUsernames: async ({
    firstName,
    lastName,
    birthdate,
  }: UsernameSuggestionParams): Promise<string[]> => {
    const { data } = await apiClient.get<UsernameSuggestions>(
      `${BASE_URL}/username-suggestions`,
      { params: { firstName, lastName, birthdate: birthdate || undefined } }
    );

    return data.usernames;
  },
};
