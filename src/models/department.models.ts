import type { RawOffice } from './location.model';
import type { PositionFormValues } from './position.models';
import type { EmployeeOption } from './employee.model';

export type RawDepartment = {
  name: string;
  slug: string;
  description: string;
  costCenterCode: string;
  coverImageUrl: string;
  primaryContactId: number;
  secondaryContactId: number;
  officeId: string;
  status: string;
  id: string;
};

export type Scope = { title: string; description: string };
export type RawScope = Scope & {
  departmentId: string;
  id: string;
};

export type BaseDepartment = {
  name: string;
  slug: string;
  costCenterCode: string;
  description: string;
};

// 2. FORM VALUES - What React state and inputs use
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

// 3. API SUBMISSION PAYLOAD - What we send POST/PUT to the API
export type DepartmentPayload = BaseDepartment & {
  status: string;
  primaryContactId: string | null;
  secondaryContactId: string | null;
  coverImageUrl: string | null;
  officeId: string;
};

// 4. DATABASE ROW / FLAT MODEL - What the raw DB table contains (with ID)
export type DepartmentModel = BaseDepartment &
  DepartmentPayload & {
    id: string;
  };

// 5. FETCHED DETAIL - Full rich object returned by your joins to display in UI
export type Department = Omit<
  DepartmentFormValues,
  'coverImage' | 'positions'
> & {
  id: string;
  coverImageUrl: string;
};

export type DepartmentNew = {
  id: number;
  name: string;
  slug: string;
  description: string;
  status: string;
  primaryContactName: string | null;
  secondaryContactName: string | null;
  employeeCount: number;
};
