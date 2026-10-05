export type Gender = 'MALE' | 'FEMALE';
export type MaritalStatus = 'SINGLE' | 'MARRIED';

export type EmployeeModel = {
  id: number;
  firstName: string;
  middleName: string | null;
  lastName: string;
  suffix: string | null;
  nickname: string | null;
  avatarUrl: string | null;
  gender: Gender;
  birthdate: string;
  birthplace: string | null;
  maritalStatus: MaritalStatus;
  nationality: string | null;
  officeLocation: string | null;
  workSchedule: string | null;
  employeeCode: string;
  username: string;
  departmentId: number | null;
  departmentName: string | null;
};

export type Employee = Omit<
  EmployeeModel,
  'departmentId' | 'departmentName'
> & {
  formattedName: string;
  department: string;
};

export type EmployeeOption = {
  id: number;
  formattedName: string;
  position: string;
  avatarUrl: string | null;
  avatarStyle: AvatarStyle | null;
  departmentId: number | null;
};

export type EmployeeLookupModel = {
  id: number;
  firstName: string;
  lastName: string;
  positionTitle: string | null;
  avatarUrl: string | null;
  avatarStyle: AvatarStyle | null;
  departmentId: number | null;
};

export type EmployeeSummaryModel = {
  id: number;
  firstName: string;
  middleName: string; // never null: the API stores "" when there's none
  lastName: string;
  suffix: string | null;
  employeeCode: string;
  departmentName: string | null;
  avatarUrl: string | null;
  avatarThumbnailUrl: string | null;
  avatarStyle: AvatarStyle | null;
  positionTitle: string | null;
};

// What the list page asks for. pageIndex is 0-based, like MUI and TanStack Table;
// the service converts it to the API's 1-based page.
export type EmployeePageParams = {
  pageIndex: number;
  pageSize: number;
  search: string;
};

// DiceBear style for an employee's generated default avatar.
// The values match the API's JSON exactly ("avataaars", "bottts", "constellation").
export type AvatarStyle = 'avataaars' | 'bottts' | 'constellation';

export type EmployeeDetailModel = {
  id: number;
  firstName: string;
  lastName: string;
  avatarUrl: string | null;
  avatarThumbnailUrl: string | null;
  avatarStyle: AvatarStyle | null;
};
