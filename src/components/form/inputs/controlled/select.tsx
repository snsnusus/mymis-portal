import { type ReactElement } from 'react';
import { useController } from 'react-hook-form';
import { MenuItem } from '@mui/material';

import {
  BaseTextField,
  type BaseTextFieldProps,
} from '~/components/form/inputs/base/textfield';

export interface SelectOption<TValue extends string = string> {
  value: TValue;
  label: string;
}

type ControlledSelectFieldProps = Omit<
  BaseTextFieldProps,
  'select' | 'value' | 'onChange' | 'defaultValue' | 'children'
> & {
  name: string;
  options: readonly SelectOption[];
};

export const ControlledSelectField = (
  props: ControlledSelectFieldProps
): ReactElement => {
  const { name, label, options, ...rest } = props;
  const {
    field: { ref, value, onChange, onBlur },
  } = useController({ name, defaultValue: null });

  return (
    <BaseTextField
      {...rest}
      select
      name={name}
      id={name}
      inputRef={ref}
      value={value ?? ''}
      onChange={(event) =>
        onChange(event.target.value === '' ? null : event.target.value)
      }
      onBlur={onBlur}
      {...(label ? { label } : { hiddenLabel: true })}
    >
      {options.map((option) => (
        <MenuItem key={option.value} value={option.value}>
          {option.label}
        </MenuItem>
      ))}
    </BaseTextField>
  );
};
