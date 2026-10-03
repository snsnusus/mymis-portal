import {
  useMemo,
  useState,
  type ChangeEvent,
  type FocusEvent,
  type ReactElement,
} from 'react';
import { InputAdornment } from '@mui/material';

import { BaseTextField, type BaseTextFieldProps } from './textfield';

export type BaseCurrencyInputProps = Omit<
  BaseTextFieldProps,
  'type' | 'value' | 'defaultValue' | 'onChange' | 'slotProps'
> & {
  value: number | null;
  onValueChange: (value: number | null) => void;
  /** Shown before the amount. Defaults to '$'. */
  currencySymbol?: string;
  /** Digits allowed after the decimal point. Defaults to 2. */
  decimals?: number;
  /** Locale for the thousands separator and decimal point. Defaults to 'en-US'. */
  locale?: string;
};

const buildAllowedPattern = (decimals: number): RegExp =>
  decimals > 0 ? new RegExp(`^\\d*(\\.\\d{0,${decimals}})?$`) : /^\d*$/;

export const BaseCurrencyInput = (
  props: BaseCurrencyInputProps
): ReactElement => {
  const {
    value,
    onValueChange,
    currencySymbol = '$',
    decimals = 2,
    locale = 'en-US',
    onFocus,
    onBlur,
    ...rest
  } = props;

  const [isFocused, setIsFocused] = useState(false);
  const [rawText, setRawText] = useState('');

  const formatter = useMemo(
    () =>
      new Intl.NumberFormat(locale, {
        minimumFractionDigits: decimals,
        maximumFractionDigits: decimals,
      }),
    [locale, decimals]
  );

  const allowedPattern = useMemo(
    () => buildAllowedPattern(decimals),
    [decimals]
  );

  const displayValue = isFocused
    ? rawText
    : value === null
    ? ''
    : formatter.format(value);

  const handleFocus = (
    event: FocusEvent<HTMLInputElement | HTMLTextAreaElement>
  ): void => {
    setRawText(value === null ? '' : String(value));
    setIsFocused(true);
    onFocus?.(event);
  };

  const handleBlur = (
    event: FocusEvent<HTMLInputElement | HTMLTextAreaElement>
  ): void => {
    setIsFocused(false);
    onBlur?.(event);
  };

  const handleChange = (
    event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ): void => {
    const text = event.target.value.replace(/,/g, '');
    if (!allowedPattern.test(text)) {
      return;
    }
    setRawText(text);
    onValueChange(text === '' || text === '.' ? null : Number(text));
  };

  return (
    <BaseTextField
      {...rest}
      type="text"
      value={displayValue}
      onFocus={handleFocus}
      onBlur={handleBlur}
      onChange={handleChange}
      autoComplete="off"
      slotProps={{
        input: {
          startAdornment: (
            <InputAdornment position="start">{currencySymbol}</InputAdornment>
          ),
        },
        htmlInput: { inputMode: 'decimal' },
      }}
    />
  );
};
