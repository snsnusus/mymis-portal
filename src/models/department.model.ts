import type { RawOffice } from './location.model';
import type { PositionFormValues } from './position.models';
import type { EmployeeOption } from './employee.model';

export type Scope = { title: string; description: string };

export type BaseDepartment = {
  name: string;
  slug: string;
  costCenterCode: string;
  description: string;
};

export interface DepartmentContact {
  id: number;
  fullName: string;
  positionTitle: string | null;
}

export interface DepartmentDetail {
  id: number;
  name: string;
  slug: string;
  description: string | null;
  costCenterCode: string | null;
  coverImageUrl: string | null;
  status: string;
  primaryContact: DepartmentContact | null;
  secondaryContact: DepartmentContact | null;
  employeeCount: number;
}

export type Department = {
  id: number;
  name: string;
  slug: string;
  description: string | null;
  status: string;
  coverImageUrl: string | null;
  primaryContactName: string | null;
  secondaryContactName: string | null;
  employeeCount: number;
};

export type DepartmentFormValues = BaseDepartment & {
  status: string;
  primaryContact: EmployeeOption | null;
  secondaryContact: EmployeeOption | null;
  coverImage: File | null;
  scopes: Array<Scope>;
  teamMembers: Array<EmployeeOption>;
  office: RawOffice | null;
  positions: PositionFormValues[];
};
