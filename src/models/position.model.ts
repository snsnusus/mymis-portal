export interface Position {
  id: number;
  title: string;
  slug: string;
  description: string | null;
  sortOrder: number;
  isActive: boolean;
  isApprover: boolean;
  departmentId: number;
  departmentName: string;
}
