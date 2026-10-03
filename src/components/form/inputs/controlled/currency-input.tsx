import { type ReactElement } from 'react';
import { useController } from 'react-hook-form';

import {
  BaseCurrencyInput,
  type BaseCurrencyInputProps,
} from '../base/currency-input';

type ControlledCurrencyInputProps = Omit<
  BaseCurrencyInputProps,
  'value' | 'onValueChange'
> & {
  name: string;
};

export const ControlledCurrencyInput = (
  props: ControlledCurrencyInputProps
): ReactElement => {
  const { name, label, ...rest } = props;
  const {
    field: { ref, value, onChange, onBlur },
  } = useController({ name, defaultValue: null });

  return (
    <BaseCurrencyInput
      {...rest}
      name={name}
      id={name}
      inputRef={ref}
      value={value as number | null}
      onValueChange={onChange}
      onBlur={onBlur}
      {...(label ? { label } : { hiddenLabel: true })}
    />
  );
};
