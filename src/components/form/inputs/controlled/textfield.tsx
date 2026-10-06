import { type ReactElement } from 'react';
import { useController, type UseControllerProps } from 'react-hook-form';
import { BaseTextField, type BaseTextFieldProps } from '../base/textfield';

export type ControlledTextFieldProps = BaseTextFieldProps & {
  rules?: UseControllerProps['rules'];
};

export const ControlledTextField = (
  props: ControlledTextFieldProps
): ReactElement => {
  const { name, label, defaultValue = '', rules, helperText, ...rest } = props;
  const {
    field: { ref, ...field },
    fieldState: { error },
  } = useController({ name, defaultValue, rules });

  return (
    <BaseTextField
      {...field}
      {...rest}
      name={name}
      id={name}
      inputRef={ref}
      error={!!error}
      helperText={error?.message ?? helperText}
      {...(label ? { label: label } : { hiddenLabel: true })}
    />
  );
};
