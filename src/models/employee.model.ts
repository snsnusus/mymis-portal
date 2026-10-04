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
  departmentId: number | null;
};

export type EmployeeLookupModel = {
  id: number;
  firstName: string;
  lastName: string;
  positionTitle: string | null;
  avatarUrl: string | null;
  departmentId: number | null;
};
