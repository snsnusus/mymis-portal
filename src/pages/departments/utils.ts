export const getPath = (department: { id: number; name: string }): string =>
  `/data-management/departments/${department.id}/${encodeURIComponent(
    department.name
  )}`;
