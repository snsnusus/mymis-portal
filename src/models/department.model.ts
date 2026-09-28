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
