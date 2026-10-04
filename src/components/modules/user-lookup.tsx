import type { EmployeeOption } from '~/models/employee.model';
import { useState, type ReactElement } from 'react';
import { useController } from 'react-hook-form';
import { useGetEmployeeOptions } from '~/queries/employee.query';
import { useDebouncedValue } from '~/hooks/use-debounced-value';
import { Avatar, Box, Typography } from '@mui/material';
import {
  Autocomplete,
  type AutocompleteProps,
} from '~/components/form/inputs/base/autocomplete';

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
  // What the user has typed. Only used to drive the server search;
  // MUI still manages the input's displayed text itself.
  const [inputValue, setInputValue] = useState('');
  const debouncedSearch = useDebouncedValue(inputValue.trim(), 300);

  const { data: results = [], isFetching } =
    useGetEmployeeOptions(debouncedSearch);

  // MUI warns if the selected value isn't among the options. With server
  // search, the selected employee may not be in the current page of results,
  // so it is always merged in (without duplicating it).
  const { value } = props;
  let selected: EmployeeOption[] = [];
  if (Array.isArray(value)) {
    selected = value as EmployeeOption[];
  } else if (value) {
    selected = [value as EmployeeOption];
  }
  const options = [
    ...selected,
    ...results.filter(
      (result) => !selected.some((employee) => employee.id === result.id)
    ),
  ];

  return (
    <Autocomplete
      loading={isFetching}
      options={options}
      // The server already filtered by the search text, so MUI must not
      // filter again. Consumers can still override this (e.g. to exclude
      // already-picked employees).
      filterOptions={(opts) => opts}
      onInputChange={(_event, newInputValue, reason) => {
        // 'reset' is MUI writing the selected option's label into the input,
        // not the user typing, so it shouldn't trigger a search.
        if (reason !== 'reset') {
          setInputValue(newInputValue);
        }
      }}
      noOptionsText="No employees found"
      isOptionEqualToValue={(option, val) => {
        const opt = option as EmployeeOption;
        const v = val as EmployeeOption;
        return opt?.id === v?.id;
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
