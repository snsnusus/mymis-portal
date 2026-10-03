import type { ReactElement } from 'react';

import { useController } from 'react-hook-form';

import DatePicker, { type DatePickerProps } from '../base/datepicker';

type ControlledDatePickerProps = Omit<DatePickerProps, 'value' | 'onChange'>;

export const ControlledDatePicker = (
  props: ControlledDatePickerProps
): ReactElement => {
  const { name, type, ...rest } = props;

  const {
    field: { value, onChange, onBlur },
  } = useController({
    name,
    defaultValue: type === 'default' ? new Date() : [],
  });

  return (
    <DatePicker
      {...rest}
      name={name}
      type={type}
      value={value}
      onChange={onChange}
      onBlur={onBlur}
    />
  );
};
