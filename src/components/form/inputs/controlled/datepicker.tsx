import type { ReactElement } from 'react';

import { useController, type UseControllerProps } from 'react-hook-form';

import DatePicker, { type DatePickerProps } from '../base/datepicker';

type ControlledDatePickerProps = Omit<DatePickerProps, 'value' | 'onChange'> & {
  rules?: UseControllerProps['rules'];
};

export const ControlledDatePicker = (
  props: ControlledDatePickerProps
): ReactElement => {
  const { name, type, rules, helperText, ...rest } = props;

  const {
    field: { value, onChange, onBlur },
    fieldState: { error },
  } = useController({
    name,
    defaultValue: type === 'default' ? new Date() : [],
    rules,
  });

  return (
    <DatePicker
      {...rest}
      name={name}
      type={type}
      value={value}
      onChange={onChange}
      onBlur={onBlur}
      error={!!error}
      helperText={error?.message ?? helperText}
    />
  );
};
