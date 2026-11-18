import type { MuiTelInputInfo } from 'mui-tel-input';
import type { Phone } from '../../types';

import { useState, type ReactElement } from 'react';

import { Button, Stack, Typography } from '@mui/material';
import { Add as AddIcon } from '@mui/icons-material';

import { PhoneNumberInput } from '~/components/form/inputs/base/phone-number-input';

import { formatPhoneNumber } from '~/utils/phone-number.utils';

import { EMPTY_PHONE } from '../../const/default-values';
import { PHONE_NUMBER_SCHEMA } from '../../schemas';

interface AddPhoneFormProps {
  phones: Phone[];
  onSave: (values: Phone) => void;
}

export const AddPhoneNumberForm = ({
  phones,
  onSave,
}: AddPhoneFormProps): ReactElement => {
  const [formValues, setFormValues] = useState<Phone>(EMPTY_PHONE);
  const [errorMessage, setErrorMessage] = useState('');

  const isDuplicate = (value: string): boolean =>
    phones.some((phone) => phone.international === value);

  const handleChange = (raw: string, info: MuiTelInputInfo): void => {
    const nextValue = {
      countryCode: info.countryCode ?? '',
      dialCode: info.countryCallingCode ?? '',
      international: info.numberValue ?? raw,
      local: info.nationalNumber ?? '',
      formatted: formatPhoneNumber(
        info.nationalNumber ?? '',
        info.countryCallingCode ?? ''
      ),
    };

    setFormValues(nextValue);
    if (errorMessage) setErrorMessage('');
  };

  const handleClear = (): void => {
    setFormValues(EMPTY_PHONE);
    setErrorMessage('');
  };

  const validatePhone = (value: string): string => {
    if (!value) return 'Phone number is required.';

    const result = PHONE_NUMBER_SCHEMA.safeParse(value);
    if (!result.success) return result.error.issues[0].message;

    if (isDuplicate(value)) return 'This phone number has already been added.';

    return '';
  };

  const handleSave = (): void => {
    const error = validatePhone(formValues.international);
    if (error) {
      setErrorMessage(error);
      return;
    }

    if (isDuplicate(formValues.international)) {
      setErrorMessage('This phone number has already been added.');
      return;
    }

    onSave(formValues);

    setFormValues(EMPTY_PHONE);
    setErrorMessage('');
  };

  return (
    <Stack spacing={2}>
      <Stack spacing={1}>
        <PhoneNumberInput
          label="Phone Number *"
          value={formValues.international}
          onChange={handleChange}
        />
        {errorMessage && (
          <Typography variant="caption" color="error">
            {errorMessage}
          </Typography>
        )}
      </Stack>
      <Stack
        direction="row"
        sx={{
          justifyContent: 'flex-end',
          gap: 1,
        }}
      >
        <Button variant="outlined" size="small" onClick={handleClear}>
          Clear
        </Button>
        <Button
          variant="contained"
          size="small"
          startIcon={<AddIcon />}
          onClick={handleSave}
        >
          Add Phone Number
        </Button>
      </Stack>
    </Stack>
  );
};
