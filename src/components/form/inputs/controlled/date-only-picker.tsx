import type { ReactElement } from 'react';
import { useController } from 'react-hook-form';

import { dateOnlyToDate, dateToDateOnly } from '~/utils/date.util';

import DatePicker, { type DatePickerProps } from '../base/datepicker';

type ControlledDateOnlyPickerProps = Omit<
  DatePickerProps,
  'value' | 'onChange' | 'type'
>;

const ControlledDateOnlyPicker = (
  props: ControlledDateOnlyPickerProps
): ReactElement => {
  const { name, ...rest } = props;
  const {
    field: { value, onChange, onBlur },
  } = useController({ name, defaultValue: '' });

  return (
    <DatePicker
      {...rest}
      name={name}
      type="default"
      value={dateOnlyToDate(value as string)}
      onChange={(date) => onChange(dateToDateOnly(date as Date | null))}
      onBlur={onBlur}
    />
  );
};

export default ControlledDateOnlyPicker;
