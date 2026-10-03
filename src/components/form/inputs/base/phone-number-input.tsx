import type { ReactElement } from 'react';
import { MuiTelInput, type MuiTelInputProps } from 'mui-tel-input';

export const PhoneNumberInput = ({
  defaultCountry = 'PH',
  size,
  ...rest
}: MuiTelInputProps): ReactElement => (
  <MuiTelInput
    size={size ?? 'small'}
    {...rest}
    defaultCountry={defaultCountry}
    fullWidth
  />
);
