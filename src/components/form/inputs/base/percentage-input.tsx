import { type ReactElement } from 'react';
import { InputAdornment } from '@mui/material';

import { useNumericTextInput } from '~/hooks/use-numeric-text-input';

import { BaseTextField, type BaseTextFieldProps } from './textfield';

export type BasePercentageInputProps = Omit<
  BaseTextFieldProps,
  'type' | 'value' | 'defaultValue' | 'onChange' | 'slotProps'
> & {
  /** Stored as a fraction: 0.8 means 80%. */
  value: number | null;
  onValueChange: (value: number | null) => void;
  /** Digits allowed after the decimal point of the displayed percentage. Defaults to 2. */
  decimals?: number;
  /** Shown after the number. Defaults to '%'. */
  symbol?: string;
};

const roundTo = (value: number, digits: number): number =>
  Number(value.toFixed(digits));

export const BasePercentageInput = (
  props: BasePercentageInputProps
): ReactElement => {
  const {
    value,
    onValueChange,
    decimals = 2,
    symbol = '%',
    onFocus,
    onBlur,
    ...rest
  } = props;

  const toPercentText = (fraction: number): string =>
    String(roundTo(fraction * 100, decimals));

  const { displayValue, handleFocus, handleBlur, handleChange } =
    useNumericTextInput({
      value,
      onValueChange,
      decimals,
      toDisplayText: toPercentText,
      toEditText: toPercentText,
      fromTypedNumber: (typed) => roundTo(typed / 100, decimals + 2),
      onFocus,
      onBlur,
    });

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
          endAdornment: (
            <InputAdornment position="end">{symbol}</InputAdornment>
          ),
        },
        htmlInput: { inputMode: 'decimal', style: { textAlign: 'right' } },
      }}
    />
  );
};
