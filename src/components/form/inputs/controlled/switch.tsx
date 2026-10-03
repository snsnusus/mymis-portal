import { type ReactElement } from 'react';
import { Switch } from '../base/switch';
import {
  type FieldPath,
  type FieldPathValue,
  type FieldValues,
  useController,
} from 'react-hook-form';

type ControlledSwitchProps<
  T extends FieldValues,
  TName extends FieldPath<T> = FieldPath<T>
> = FieldPathValue<T, TName> extends boolean
  ? {
      name: TName;
      disabled?: boolean;
    }
  : never;

export const ControlledSwitch = <
  T extends FieldValues,
  TName extends FieldPath<T> = FieldPath<T>
>({
  name,
  disabled,
}: ControlledSwitchProps<T, TName>): ReactElement => {
  const {
    field: { value, onChange, onBlur },
  } = useController<T, TName>({
    name,
    defaultValue: false as FieldPathValue<T, TName>,
  });

  return (
    <Switch
      checked={!!value}
      onChange={(e) => onChange(e.target.checked)}
      onBlur={onBlur}
      disabled={disabled}
    />
  );
};
