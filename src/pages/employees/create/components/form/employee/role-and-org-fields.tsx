import type { EmployeeCreateFormValues } from '../../../types';
import { type ReactElement } from 'react';

import { useFormContext } from 'react-hook-form';
import { useGetAll as useGetDepartments } from '~/queries/department.query';
import { useGetAll as useGetPositionsByDepartment } from '~/queries/position.query';

import { Grid, MenuItem, Stack } from '@mui/material';

import { ControlledTextField } from '~/components/form/inputs/controlled/textfield';
import { ControlledAutocomplete } from '~/components/form/inputs/controlled/autocomplete';
import { ControlledDatePicker } from '~/components/form/inputs/controlled/datepicker';

import { EMPLOYEE_TYPE_OPTIONS } from '../../../config/options';

export const RoleAndOrgFields = (): ReactElement => {
  const { watch, setValue } = useFormContext<EmployeeCreateFormValues>();

  const departmentId = watch('departmentId');
  const selectedDepartmentId =
    typeof departmentId === 'number' ? departmentId : undefined;

  const { data: departments = [] } = useGetDepartments();
  const { data: deptPositions = [] } =
    useGetPositionsByDepartment(selectedDepartmentId);
  const positions = deptPositions.filter((position) => position.isActive);

  return (
    <Grid container spacing={2}>
      <Grid size={{ xs: 12, md: 6 }}>
        <Stack sx={{ gap: 2 }}>
          <ControlledTextField
            label="Employee Type *"
            name="employeeType"
            size="small"
            select
            fullWidth
            rules={{ required: 'Employee type is required.' }}
          >
            {EMPLOYEE_TYPE_OPTIONS.map((option, index) => (
              <MenuItem key={index} value={option.value}>
                {option.label}
              </MenuItem>
            ))}
          </ControlledTextField>
          <ControlledAutocomplete
            label="Department *"
            name="departmentId"
            valueKey="id"
            rules={{ required: 'Department is required.' }}
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
            rules={{ required: 'Position is required.' }}
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
            rules={{ required: 'Employment status is required.' }}
          >
            <MenuItem value="Probationary">Probationary</MenuItem>
            <MenuItem value="Regular">Regular</MenuItem>
            <MenuItem value="Contractual">Contractual</MenuItem>
            <MenuItem value="ProjectBased">Project-based</MenuItem>
          </ControlledTextField>
          <ControlledDatePicker
            label="Joining Date *"
            name="joiningDate"
            rules={{ required: 'Joining date is required.' }}
          />
        </Stack>
      </Grid>
    </Grid>
  );
};
