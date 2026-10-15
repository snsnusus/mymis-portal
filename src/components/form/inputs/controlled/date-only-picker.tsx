// File: src/components/form/inputs/controlled/date-only-picker.tsx
import type { ReactElement } from 'react';
import { useController, type UseControllerProps } from 'react-hook-form';

import { dateOnlyToDate, dateToDateOnly } from '~/utils/date.util';

import DatePicker, { type DatePickerProps } from '../base/datepicker';

type ControlledDateOnlyPickerProps = Omit<
  DatePickerProps,
  'value' | 'onChange' | 'type'
> & {
  rules?: UseControllerProps['rules'];
};

const ControlledDateOnlyPicker = (
  props: ControlledDateOnlyPickerProps
): ReactElement => {
  const { name, rules, helperText, ...rest } = props;
  const {
    field: { value, onChange, onBlur },
    fieldState: { error },
  } = useController({ name, defaultValue: '', rules });

  return (
    <DatePicker
      {...rest}
      name={name}
      type="default"
      value={dateOnlyToDate(value as string)}
      onChange={(date) => onChange(dateToDateOnly(date as Date | null))}
      onBlur={onBlur}
      error={!!error}
      helperText={error?.message ?? helperText}
    />
  );
};

export default ControlledDateOnlyPicker;
