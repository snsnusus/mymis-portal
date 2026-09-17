import { type FormValues } from '..';
import { type MuiTelInputInfo } from 'mui-tel-input';
import { useState, type ReactElement } from 'react';
import { useFieldArray, useFormContext } from 'react-hook-form';
import { Box, Button, Chip, Grid, Stack, Typography } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import DataDisplayRow from '~/components/ui/data-display-row';
import { PhoneNumberInput } from '~/components/form/base/phone-number-input';
import { formatPhoneNumber } from '~/utils/phone-number.utils';
import { z } from 'zod';
import { isValidPhoneNumber } from 'libphonenumber-js';

type PhoneNumberValue = {
  countryCode: string;
  dialCode: string;
  international: string;
  local: string;
  formatted: string;
};

const initialFormValues = {
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

export const PhoneNumber = (): ReactElement => {
  const { control } = useFormContext<FormValues>();
  const {
    fields: phoneNumbers,
    append,
    remove,
  } = useFieldArray({
    control,
    name: 'phoneNumbers',
  });
  const [formValues, setFormValues] =
    useState<PhoneNumberValue>(initialFormValues);
  const [errorMessage, setErrorMessage] = useState('');

  const hasPhoneNumber = phoneNumbers.length > 0;

  const validatePhone = (value: string): string => {
    if (!value) return 'Phone number is required.';

    const result = phoneNumberSchema.safeParse(value);
    if (!result.success) return result.error.issues[0].message;

    const isDuplicate = phoneNumbers.some(
      (phone) => phone.international === value
    );
    if (isDuplicate) return 'This phone number has already been added.';

    return '';
  };

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
    setFormValues(initialFormValues);
    setErrorMessage('');
  };

  const handleAddPhoneNumber = (): void => {
    const error = validatePhone(formValues.international);
    if (error) {
      setErrorMessage(error);
      return;
    }

    const isDuplicate = phoneNumbers.some(
      (p) => p.international === formValues.international
    );
    if (isDuplicate) {
      setErrorMessage('This phone number has already been added.');
      return;
    }

    append({ ...formValues });
    setFormValues(initialFormValues);
    setErrorMessage('');
  };

  return (
    <Grid container spacing={2} columnSpacing={3}>
      <Grid size={{ xs: 12, md: 6 }}>
        <Stack
          sx={{
            gap: 2,
          }}
        >
          <Typography
            variant="body1"
            sx={{
              fontWeight: 600,
            }}
          >
            Phone Numbers
          </Typography>
          {hasPhoneNumber ? (
            <Stack
              direction="row"
              spacing={1}
              useFlexGap
              sx={{
                flexWrap: 'wrap',
              }}
            >
              {phoneNumbers.map((phone, index) => (
                <Chip
                  key={phone.international}
                  label={phone.formatted}
                  variant="outlined"
                  color="primary"
                  onDelete={() => remove(index)}
                  sx={{
                    '&.MuiChip-root': {
                      height: 'fit-content',
                    },
                    '& .MuiChip-label': {
                      whiteSpace: 'normal',
                      padding: 1.4,
                      fontSize: '0.875rem',
                      fontWeight: 500,
                    },
                  }}
                />
              ))}
            </Stack>
          ) : (
            <Typography
              variant="body2"
              color="text.secondary"
              sx={{ fontStyle: 'italic' }}
            >
              No phone number added yet.
            </Typography>
          )}
        </Stack>
      </Grid>
      <Grid size={{ xs: 12, md: 6 }}>
        <Stack spacing={2}>
          <DataDisplayRow label="Phone Number *">
            <Stack spacing={1}>
              <PhoneNumberInput
                value={formValues.international}
                onChange={handleChange}
              />
              {errorMessage && (
                <Typography variant="caption" color="error">
                  {errorMessage}
                </Typography>
              )}
            </Stack>
          </DataDisplayRow>
          <Box
            sx={{
              display: 'flex',
              justifyContent: 'flex-end',
              gap: 1,
            }}
          >
            <Button
              variant="text"
              color="inherit"
              size="medium"
              sx={{
                minWidth: 120,
              }}
              onClick={handleClear}
            >
              Clear
            </Button>
            <Button
              variant="contained"
              startIcon={<AddIcon />}
              size="medium"
              sx={{
                minWidth: 120,
              }}
              onClick={handleAddPhoneNumber}
            >
              Add Phone Number
            </Button>
          </Box>
        </Stack>
      </Grid>
    </Grid>
  );
};
