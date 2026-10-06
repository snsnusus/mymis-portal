import { type ReactElement } from 'react';
import { useController, type UseControllerProps } from 'react-hook-form';
import {
  LocationAutocomplete,
  type LocationOption,
} from '../base/location-autocomplete';

export type ControlledLocationAutocompleteProps<T extends LocationOption> = {
  name: string;
  label?: string;
  options: T[];
  disabled?: boolean;
  defaultValue?: T | null;
  rules?: UseControllerProps['rules'];
  onChange?: (value: T | null) => void;
};

export const ControlledLocationAutocomplete = <T extends LocationOption>({
  name,
  label,
  options,
  disabled,
  defaultValue = null,
  rules,
  onChange,
}: ControlledLocationAutocompleteProps<T>): ReactElement => {
  const {
    field: { value, onChange: formOnChange },
    fieldState: { error },
  } = useController({
    name,
    defaultValue,
    rules,
  });

  return (
    <LocationAutocomplete
      label={label}
      value={value ?? null}
      onChange={(nextValue) => {
        formOnChange(nextValue);
        onChange?.(nextValue);
      }}
      options={options}
      disabled={disabled}
      error={!!error}
      helperText={error?.message}
    />
  );
};
