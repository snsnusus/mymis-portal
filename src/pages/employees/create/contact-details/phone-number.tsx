import { type FormValues } from '..';
import { type MuiTelInputInfo } from 'mui-tel-input';
import { useState, type ReactElement } from 'react';
import { useFieldArray, useFormContext } from 'react-hook-form';
import {
  Box,
  Button,
  Grid,
  IconButton,
  Paper,
  Stack,
  Tooltip,
  Typography,
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import DeleteIcon from '@mui/icons-material/Delete';
import SmartphoneIcon from '@mui/icons-material/Smartphone';
import { PhoneNumberInput } from '~/components/form/inputs/base/phone-number-input';
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
    <Grid container spacing={2} sx={{ padding: 2 }}>
      <Grid size={{ xs: 12, md: 6 }}>
        <Stack sx={{ gap: 2 }}>
          <Typography variant="body1" sx={{ fontWeight: 'fontWeightMedium' }}>
            Phone Numbers
          </Typography>
          {hasPhoneNumber ? (
            <Stack
              spacing={1}
              sx={{
                flexWrap: 'wrap',
                overflowY: 'auto',
                maxHeight: 200,
                scrollbarGutter: 'stable',
                paddingRight: 1,
              }}
            >
              {phoneNumbers.map((phone, index) => (
                <Paper
                  key={phone.id}
                  variant="outlined"
                  sx={{
                    p: 1.5,
                    display: 'flex',
                    alignItems: 'center',
                    gap: 1.5,
                    width: '100%',
                  }}
                >
                  <SmartphoneIcon
                    color="primary"
                    fontSize="large"
                    sx={{ mt: 0.25 }}
                  />
                  <Box sx={{ flexGrow: 1, minWidth: 0 }}>
                    <Typography variant="body2" color="text.secondary">
                      Phone Number {index + 1}
                    </Typography>
                    <Typography
                      variant="body1"
                      sx={{ overflowWrap: 'anywhere' }}
                    >
                      {phone.international}
                    </Typography>
                  </Box>
                  <Tooltip title="Remove Phone Number">
                    <IconButton
                      aria-label={`Remove address ${index + 1}`}
                      sx={{ '&:hover': { color: 'error.main' } }}
                      onClick={() => remove(index)}
                    >
                      <DeleteIcon fontSize="medium" />
                    </IconButton>
                  </Tooltip>
                </Paper>
              ))}
            </Stack>
          ) : (
            <Typography color="text.secondary">
              No phone number added yet.
            </Typography>
          )}
        </Stack>
      </Grid>
      <Grid size={{ xs: 12, md: 6 }}>
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
          <Box
            sx={{
              display: 'flex',
              justifyContent: 'flex-end',
              gap: 1,
            }}
          >
            <Button
              variant="outlined"
              size="small"
              onClick={handleClear}
              sx={{
                minWidth: 150,
              }}
            >
              Clear
            </Button>
            <Button
              variant="contained"
              size="small"
              startIcon={<AddIcon />}
              sx={{
                minWidth: 150,
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
