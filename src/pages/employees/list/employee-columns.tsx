import type { ReactElement } from 'react';
import type { EmployeeSummaryModel } from '~/models/employee.model';
import { createColumnHelper, type ColumnDef } from '@tanstack/react-table';
import { Stack, Typography } from '@mui/material';
import { EmployeeAvatar } from '~/components/modules/employee-avatar';

const getFullName = (employee: EmployeeSummaryModel): string =>
  [employee.firstName, employee.middleName, employee.lastName, employee.suffix]
    .filter(Boolean)
    .join(' ');

const EmployeeCell = ({
  employee,
}: {
  employee: EmployeeSummaryModel;
}): ReactElement => {
  const fullName = getFullName(employee);

  return (
    <Stack direction="row" sx={{ alignItems: 'center', gap: 1.5 }}>
      <EmployeeAvatar
        id={employee.id}
        name={fullName}
        avatarUrl={employee.avatarThumbnailUrl ?? employee.avatarUrl}
        avatarStyle={employee.avatarStyle}
      />
      <Typography variant="body2" sx={{ fontWeight: 600 }}>
        {fullName}
      </Typography>
    </Stack>
  );
};

// Gives each row a stable key based on the employee, not the array index.
export const getEmployeeRowId = (employee: EmployeeSummaryModel): string =>
  String(employee.id);

const columnHelper = createColumnHelper<EmployeeSummaryModel>();

// Defined once at module level, so it's the same array on every render.
export const employeeColumns: ColumnDef<EmployeeSummaryModel, any>[] = [
  columnHelper.display({
    id: 'employee',
    header: 'Employee',
    cell: ({ row }) => <EmployeeCell employee={row.original} />,
  }),
  columnHelper.accessor('employeeCode', {
    header: 'Employee code',
  }),
  columnHelper.accessor('departmentName', {
    header: 'Department',
    cell: ({ getValue }) => getValue() ?? '—',
  }),
  columnHelper.accessor('positionTitle', {
    header: 'Position',
    cell: ({ getValue }) => getValue() ?? '—',
  }),
];
