import { useController, useFormContext } from 'react-hook-form';
import { type MuiTelInputInfo } from 'mui-tel-input';
import { PhoneNumberInput } from '../base/phone-number-input';

import { formatPhoneNumber } from '~/utils/phone-number.utils';
import { type ReactElement } from 'react';

type PhoneNumberValue = {
  countryCode: string;
  dialCode: string;
  international: string;
  local: string;
  formatted: string;
};

type ControlledPhoneNumberProps = {
  name: string;
  label?: string;
};

export const ControlledPhoneNumberInput = ({
  name,
  label,
}: ControlledPhoneNumberProps): ReactElement => {
  const { control } = useFormContext();

  const {
    field: { value, onChange },
    fieldState: { error },
  } = useController({
    name,
    control,
    defaultValue: null,
  });

  const handleChange = (raw: string, info: MuiTelInputInfo): void => {
    const nextValue: PhoneNumberValue = {
      countryCode: info.countryCode ?? '',
      dialCode: info.countryCallingCode ?? '',
      international: info.numberValue ?? raw,
      local: info.nationalNumber ?? '',
      formatted: formatPhoneNumber(
        info.nationalNumber ?? '',
        info.countryCallingCode ?? ''
      ),
    };

    onChange(nextValue);
  };

  return (
    <PhoneNumberInput
      label={label}
      value={(value as PhoneNumberValue | null)?.international ?? ''}
      onChange={handleChange}
      error={!!error}
      helperText={error?.message}
    />
  );
};
