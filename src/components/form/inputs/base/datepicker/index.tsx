import type {
  DatePickerProps as ReactDatePickerProps,
  ReactDatePickerCustomHeaderProps,
} from 'react-datepicker';

import { type ReactElement, forwardRef } from 'react';

import { TextField, type TextFieldProps } from '@mui/material';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import ReactDatePicker from 'react-datepicker';
import DatePickerHeader from './header';

export interface DatePickerProps
  extends Omit<ReactDatePickerProps, 'value' | 'onChange'> {
  name: string;
  value: Date | [Date | null, Date | null] | null;
  type?: 'default' | 'range';
  label?: string;
  defaultValue?: Date | [Date | null, Date | null] | null;
  dateFormat?: 'MM/dd/yyyy';
  onChange: (date: Date | [Date | null, Date | null] | null) => void;
}

const DatePicker = (ReactDatePicker as any).default ?? ReactDatePicker;

const MuiDatePickerInput = forwardRef<
  HTMLDivElement,
  TextFieldProps & { name?: string }
>((props, ref) => {
  const { label, name, ...restProps } = props;

  return (
    <TextField
      {...restProps}
      inputRef={ref}
      id={name}
      label={label}
      variant="outlined"
      fullWidth
      size={props.size ?? 'small'}
      slotProps={{
        input: {
          endAdornment: <CalendarMonthIcon />,
        },
      }}
    />
  );
});

MuiDatePickerInput.displayName = 'MuiDatePickerInput';

const CustomDatePicker = (props: DatePickerProps): ReactElement => {
  const {
    type = 'default',
    name,
    value,
    label,
    showPopperArrow = false,
    dateFormat = 'MM/dd/yyyy',
    onChange,
    ...rest
  } = props;

  const isDateRange = type === 'range';
  const selectedDate = isDateRange
    ? Array.isArray(value) && value.length > 0
      ? value[0]
      : null // ✅ Ensure value is an array
    : value instanceof Date
    ? value
    : null; // ✅ Ensure value is a Date

  const selectedStartDate = isDateRange
    ? Array.isArray(value) && value.length > 0
      ? value[0]
      : null
    : null;

  const selectedEndDate = isDateRange
    ? Array.isArray(value) && value.length > 1
      ? value[1]
      : null
    : null;

  return (
    <DatePicker
      name={name}
      autoComplete="off"
      showPopperArrow={showPopperArrow}
      dateFormat={dateFormat}
      {...(isDateRange && { selectsRange: true })}
      selected={selectedDate}
      startDate={selectedStartDate}
      endDate={selectedEndDate}
      renderCustomHeader={(
        customHeaderProps: ReactDatePickerCustomHeaderProps
      ) => <DatePickerHeader {...customHeaderProps} />}
      customInput={<MuiDatePickerInput label={label} name={name} />}
      onChange={onChange}
      {...rest}
    />
  );
};

export default CustomDatePicker;
