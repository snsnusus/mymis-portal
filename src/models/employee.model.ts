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

export type EmployeePageParams = {
  pageIndex: number;
  pageSize: number;
  search: string;
};

export type AvatarStyle = 'avataaars' | 'bottts' | 'constellation';

export type EmployeeDetailModel = {
  id: number;
  firstName: string;
  lastName: string;
  avatarUrl: string | null;
  avatarThumbnailUrl: string | null;
  avatarStyle: AvatarStyle | null;
};

export type EmployeeType = 'Management' | 'Client';

export type EmploymentStatus =
  | 'Probationary'
  | 'Regular'
  | 'Contractual'
  | 'ProjectBased';

export interface UsernameAvailability {
  available: boolean;
}

export type EmergencyContactRelationship =
  | 'Spouse'
  | 'Partner'
  | 'Parent'
  | 'Guardian'
  | 'Sibling'
  | 'Child'
  | 'Relative'
  | 'Friend'
  | 'Other';

export interface UsernameSuggestion {
  username: string | null;
}

export type UsernameSuggestionParams = {
  firstName: string;
  lastName: string;
  birthdate?: string;
};
