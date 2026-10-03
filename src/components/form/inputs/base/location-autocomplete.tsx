import { type ReactElement } from 'react';
import { Autocomplete, TextField, type TextFieldProps } from '@mui/material';

export type LocationOption = { id: string | number; name: string };

type LocationAutocompleteProps<T extends LocationOption> = {
  value: T | null;
  label?: string;
  onChange: (value: T | null) => void;
  options: T[];
  disabled?: boolean;
  size?: TextFieldProps['size'];
};

export const LocationAutocomplete = <T extends LocationOption>({
  value,
  label,
  onChange,
  options,
  disabled,
  size,
}: LocationAutocompleteProps<T>): ReactElement => (
  <Autocomplete
    size={size ?? 'small'}
    disabled={disabled}
    options={options}
    getOptionLabel={(option) => option.name}
    isOptionEqualToValue={(option, val) => option.id === val?.id}
    value={value}
    onChange={(_, newValue) => onChange(newValue)}
    renderInput={(params) => (
      <TextField {...params} label={label} size={size ?? 'small'} />
    )}
  />
);
