import { type ReactElement } from 'react';
import { useController } from 'react-hook-form';

import {
  BaseNumberInput,
  type BaseNumberInputProps,
} from '~/components/form/inputs/base/number-input';

type ControlledNumberInputProps = Omit<
  BaseNumberInputProps,
  'value' | 'onValueChange'
> & {
  name: string;
};

export const ControlledNumberInput = (
  props: ControlledNumberInputProps
): ReactElement => {
  const { name, label, ...rest } = props;
  const {
    field: { ref, value, onChange, onBlur },
  } = useController({ name, defaultValue: null });

  return (
    <BaseNumberInput
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
