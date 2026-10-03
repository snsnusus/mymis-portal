import type { EmployeeOption } from '~/models/employee.model';
import { type ReactElement } from 'react';
import { useController } from 'react-hook-form';
import { useGetEmployeeOptions } from '~/queries/employee.query';
import { Avatar, Box, Typography } from '@mui/material';
import {
  Autocomplete,
  type AutocompleteProps,
} from '~/components/form/inputs/base/autocomplete';

// ==========================================
// 1. Uncontrolled User Lookup Component
// ==========================================

export type UncontrolledUserLookupProps<
  Multiple extends boolean | undefined = false,
  DisableClearable extends boolean | undefined = false,
  FreeSolo extends boolean | undefined = false
> = Omit<
  AutocompleteProps<EmployeeOption, Multiple, DisableClearable, FreeSolo>,
  'options'
>;

export const UncontrolledUserLookup = <
  Multiple extends boolean | undefined = false,
  DisableClearable extends boolean | undefined = false,
  FreeSolo extends boolean | undefined = false
>(
  props: UncontrolledUserLookupProps<Multiple, DisableClearable, FreeSolo>
): ReactElement => {
  const { data: employeeOptions = [], isLoading } = useGetEmployeeOptions();

  return (
    <Autocomplete
      loading={isLoading}
      options={employeeOptions}
      isOptionEqualToValue={(option, value) => {
        const opt = option as EmployeeOption;
        const val = value as EmployeeOption;
        return opt?.id === val?.id;
      }}
      getOptionLabel={(option) => {
        const employee = option as EmployeeOption;
        return employee?.formattedName || '';
      }}
      renderOption={(renderProps, option) => {
        const { key, ...optionProps } = renderProps;
        const employee = option as EmployeeOption;

        return (
          <Box
            component="li"
            key={key}
            {...optionProps}
            sx={{ display: 'flex', alignItems: 'center', gap: 1.5, py: 1 }}
          >
            <Avatar
              src={employee.avatarUrl ?? undefined}
              alt={employee.formattedName}
              sx={{ width: 32, height: 32 }}
            />
            <Box sx={{ display: 'flex', flexDirection: 'column' }}>
              <Typography variant="body2" sx={{ fontWeight: 600 }}>
                {employee.formattedName}
              </Typography>
              <Typography variant="caption" color="text.secondary">
                {employee.position || 'No Position'}
              </Typography>
            </Box>
          </Box>
        );
      }}
      {...props}
    />
  );
};

// ==========================================
// 2. Controlled User Lookup Component
// ==========================================

export type ControlledUserLookupProps<
  Multiple extends boolean | undefined = false,
  DisableClearable extends boolean | undefined = false,
  FreeSolo extends boolean | undefined = false
> = UncontrolledUserLookupProps<Multiple, DisableClearable, FreeSolo> & {
  name: string;
  defaultValue?: any;
  control?: any;
};

export const ControlledUserLookup = <
  Multiple extends boolean | undefined = false,
  DisableClearable extends boolean | undefined = false,
  FreeSolo extends boolean | undefined = false
>({
  name,
  defaultValue,
  control,
  ...rest
}: ControlledUserLookupProps<
  Multiple,
  DisableClearable,
  FreeSolo
>): ReactElement => {
  const {
    field: { ref, value, onChange, ...field },
  } = useController({ name, defaultValue, control });

  return (
    <UncontrolledUserLookup
      inputRef={ref}
      id={name}
      {...field}
      value={value ?? (rest.multiple ? [] : null)}
      onChange={(_, data) => {
        onChange(data);
      }}
      {...rest}
    />
  );
};
