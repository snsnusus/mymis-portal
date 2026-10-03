import { type ReactElement } from 'react';
import { useController } from 'react-hook-form';
import { BaseTextField, type BaseTextFieldProps } from '../base/textfield';

export const ControlledTextField = (
  props: BaseTextFieldProps
): ReactElement => {
  const { name, label, defaultValue = '', ...rest } = props;
  const {
    field: { ref, ...field },
  } = useController({ name, defaultValue });

  return (
    <BaseTextField
      {...field}
      {...rest}
      name={name}
      id={name}
      inputRef={ref}
      {...(label ? { label: label } : { hiddenLabel: true })}
    />
  );
};
