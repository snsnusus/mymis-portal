import { useMemo, type ReactElement } from 'react';
import { useController } from 'react-hook-form';
import { Autocomplete, type AutocompleteProps } from '../base/autocomplete';

export type ControlledAutocompleteProps<
  T,
  Multiple extends boolean | undefined = false,
  DisableClearable extends boolean | undefined = false,
  FreeSolo extends boolean | undefined = false
> = AutocompleteProps<T, Multiple, DisableClearable, FreeSolo> & {
  name: string;
  valueKey?: keyof T;
};

export const ControlledAutocomplete = <
  T,
  Multiple extends boolean | undefined = false,
  DisableClearable extends boolean | undefined = false,
  FreeSolo extends boolean | undefined = false
>(
  props: ControlledAutocompleteProps<T, Multiple, DisableClearable, FreeSolo>
): ReactElement => {
  const {
    name,
    defaultValue,
    valueKey,
    options,
    onChange: customOnChange,
    ...rest
  } = props;
  const {
    field: { ref, value, onChange, ...field },
  } = useController({ name, defaultValue });

  const selectedValue = useMemo(() => {
    if (!valueKey || value === undefined || value === null || value === '') {
      return value ?? null;
    }

    if (Array.isArray(options)) {
      return (options as T[]).find((opt) => opt[valueKey] === value) ?? null;
    }

    return null;
  }, [value, options, valueKey]);

  const handleChange: AutocompleteProps<
    T,
    Multiple,
    DisableClearable,
    FreeSolo
  >['onChange'] = (event, newValue, reason, details) => {
    let formValue: any = newValue;

    // Safely extract the key when newValue is an object
    if (valueKey && newValue && typeof newValue === 'object') {
      formValue = (newValue as Record<string, any>)[valueKey as string];
    }

    onChange(formValue);

    if (customOnChange) {
      customOnChange(event, newValue, reason, details);
    }
  };

  return (
    <Autocomplete
      inputRef={ref}
      id={name}
      {...field}
      {...rest}
      options={options}
      value={selectedValue}
      onChange={handleChange}
      isOptionEqualToValue={(option, val) => {
        if (valueKey && option && val) {
          const optionVal = (option as T)[valueKey];
          const compareVal =
            typeof val === 'object' && val !== null
              ? (val as T)[valueKey]
              : val;
          return optionVal === compareVal;
        }
        return option === val;
      }}
    />
  );
};
