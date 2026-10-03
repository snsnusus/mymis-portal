import { type ReactElement } from 'react';

import { useNumericTextInput } from '~/hooks/use-numeric-text-input';

import { BaseTextField, type BaseTextFieldProps } from './textfield';

export type BaseNumberInputProps = Omit<
  BaseTextFieldProps,
  'type' | 'value' | 'defaultValue' | 'onChange' | 'slotProps'
> & {
  value: number | null;
  onValueChange: (value: number | null) => void;
  /** Allow a decimal point. Defaults to false (whole numbers only). */
  allowDecimal?: boolean;
  /** Maximum digits after the decimal point when allowDecimal is true. Defaults to 2. */
  decimals?: number;
};

export const BaseNumberInput = (props: BaseNumberInputProps): ReactElement => {
  const {
    value,
    onValueChange,
    allowDecimal = false,
    decimals = 2,
    onFocus,
    onBlur,
    ...rest
  } = props;

  const { displayValue, handleFocus, handleBlur, handleChange } =
    useNumericTextInput({
      value,
      onValueChange,
      decimals: allowDecimal ? decimals : 0,
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
        htmlInput: { inputMode: allowDecimal ? 'decimal' : 'numeric' },
      }}
    />
  );
};
