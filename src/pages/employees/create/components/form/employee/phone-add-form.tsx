import { type MuiTelInputInfo } from 'mui-tel-input';
import { type Phone } from '../../../types';
import { useState, type ReactElement } from 'react';

import { Button, Stack, Typography } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';

import { PhoneNumberInput } from '~/components/form/inputs/base/phone-number-input';
import { formatPhoneNumber } from '~/utils/phone-number.utils';

import { z } from 'zod';
import { isValidPhoneNumber } from 'libphonenumber-js';

interface AddPhoneFormProps {
  phones: Phone[];
  onSave: (values: Phone) => void;
}

const defaultValues = {
  countryCode: '',
  dialCode: '',
  international: '',
  local: '',
  formatted: '',
};

const phoneNumberSchema = z
  .string()
  .refine((value) => isValidPhoneNumber(value, 'PH'), {
    message: 'Please enter a valid Philippine phone number.',
  });

export const PhoneAddForm = ({
  phones,
  onSave,
}: AddPhoneFormProps): ReactElement => {
  const [formValues, setFormValues] = useState<Phone>(defaultValues);
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
    setFormValues(defaultValues);
    setErrorMessage('');
  };

  const validatePhone = (value: string): string => {
    if (!value) return 'Phone number is required.';

    const result = phoneNumberSchema.safeParse(value);
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

    setFormValues(defaultValues);
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
