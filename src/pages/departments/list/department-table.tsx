import type { Department } from '~/models/department.model';
import { type ReactElement } from 'react';
import { Link as RouterLink } from 'react-router-dom';
import {
  Link,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from '@mui/material';
import { getPath } from '../utils';
import { StatusChip } from './status-chip';

export const DepartmentTable = ({
  departments,
}: {
  departments: Department[];
}): ReactElement => (
  <Paper variant="outlined">
    <TableContainer>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>Department</TableCell>
            <TableCell>Slug</TableCell>
            <TableCell>Primary contact</TableCell>
            <TableCell align="right">Members</TableCell>
            <TableCell>Status</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {departments.map((department) => (
            <TableRow key={department.id} hover>
              <TableCell>
                <Link
                  component={RouterLink}
                  to={getPath(department)}
                  underline="hover"
                  sx={{ fontWeight: 600 }}
                >
                  {department.name}
                </Link>
              </TableCell>
              <TableCell>{department.slug}</TableCell>
              <TableCell>{department.primaryContactName ?? '—'}</TableCell>
              <TableCell align="right">{department.employeeCount}</TableCell>
              <TableCell>
                <StatusChip status={department.status} />
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  </Paper>
);
