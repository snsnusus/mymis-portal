import type { FormValues } from '..';
import { type ReactElement } from 'react';
import { useFormContext } from 'react-hook-form';
import { useGetAll as useGetDepartments } from '~/queries/department.query';
import { useGetAll as useGetPositionsByDepartment } from '~/queries/position.query';
import {
  Card,
  CardContent,
  Grid,
  MenuItem,
  Stack,
  Typography,
} from '@mui/material';

import { ControlledAutocomplete } from '~/components/form/inputs/controlled/autocomplete';
import { ControlledDatePicker } from '~/components/form/inputs/controlled/datepicker';
import { ControlledTextField } from '~/components/form/inputs/controlled/textfield';

export const OrganizationDetails = (): ReactElement => {
  const { watch, setValue } = useFormContext<FormValues>();

  const departmentId = watch('departmentId');
  const selectedDepartmentId =
    typeof departmentId === 'number' ? departmentId : undefined;

  const { data: departments = [] } = useGetDepartments();
  const { data: allPositions = [] } =
    useGetPositionsByDepartment(selectedDepartmentId);
  const positions = allPositions.filter((position) => position.isActive);

  return (
    <Card variant="outlined">
      <Stack
        sx={{
          p: 2,
          borderBottom: '1px solid',
          borderColor: 'divider',
        }}
      >
        <Typography variant="h6">Role & Organization</Typography>
        <Typography variant="subtitle1" color="text.secondary">
          Assign the user’s department, team, and organizational role.
        </Typography>
      </Stack>

      <CardContent>
        <Grid container spacing={2}>
          <Grid size={{ xs: 12, md: 6 }}>
            <Stack sx={{ gap: 2 }}>
              <ControlledTextField
                label="Employee Type *"
                name="employeeType"
                size="small"
                select
                fullWidth
              >
                <MenuItem value="Client">Client</MenuItem>
                <MenuItem value="Management">Management</MenuItem>
              </ControlledTextField>
              <ControlledAutocomplete
                label="Department *"
                name="departmentId"
                valueKey="id"
                options={departments}
                getOptionLabel={(option) => {
                  if (typeof option === 'string') return option;
                  return option?.name ?? '';
                }}
                onChange={(_, newValue) => {
                  setValue(
                    'departmentId',
                    Array.isArray(newValue) ? null : newValue?.id ?? null
                  );
                  setValue('positionId', null);
                }}
              />
              <ControlledAutocomplete
                label="Position *"
                name="positionId"
                valueKey="id"
                options={positions}
                getOptionLabel={(option) => {
                  if (typeof option === 'string') return option;
                  return option?.title ?? '';
                }}
                disabled={!departmentId}
                placeholder="Select position"
              />
            </Stack>
          </Grid>
          <Grid size={{ xs: 12, md: 6 }}>
            <Stack sx={{ gap: 2 }}>
              <ControlledTextField
                label="Employment Status *"
                name="employmentStatus"
                size="small"
                select
                fullWidth
              >
                <MenuItem value="Probationary">Probationary</MenuItem>
                <MenuItem value="Regular">Regular</MenuItem>
                <MenuItem value="Contractual">Contractual</MenuItem>
                <MenuItem value="ProjectBased">Project-based</MenuItem>
              </ControlledTextField>
              <ControlledDatePicker label="Joining Date *" name="joiningDate" />
            </Stack>
          </Grid>
        </Grid>
      </CardContent>
    </Card>
  );
};
