import type {
  EmployeeLookupModel,
  EmployeeOption,
} from '~/models/employee.model';

// The API's lookup row -> the portal's option shape.
// formattedName is built here: the API only sends first and last name.
export const toEmployeeOption = (
  employee: EmployeeLookupModel
): EmployeeOption => ({
  id: employee.id,
  formattedName: `${employee.firstName} ${employee.lastName}`,
  position: employee.positionTitle ?? '',
  avatarUrl: employee.avatarUrl,
  avatarStyle: employee.avatarStyle,
  departmentId: employee.departmentId,
});
