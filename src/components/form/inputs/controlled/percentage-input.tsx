import { type ReactElement } from 'react';
import { useController } from 'react-hook-form';

import {
  BasePercentageInput,
  type BasePercentageInputProps,
} from '~/components/form/inputs/base/percentage-input';

type ControlledPercentageInputProps = Omit<
  BasePercentageInputProps,
  'value' | 'onValueChange'
> & {
  name: string;
};

export const ControlledPercentageInput = (
  props: ControlledPercentageInputProps
): ReactElement => {
  const { name, label, ...rest } = props;
  const {
    field: { ref, value, onChange, onBlur },
  } = useController({ name, defaultValue: null });

  return (
    <BasePercentageInput
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
