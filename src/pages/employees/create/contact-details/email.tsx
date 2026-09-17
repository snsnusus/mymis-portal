import { useState, type ReactElement } from 'react';
import {
  Box,
  Button,
  Chip,
  Grid,
  Stack,
  TextField,
  Typography,
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import DataDisplayRow from '~/components/ui/data-display-row';
import { useFieldArray, useFormContext } from 'react-hook-form';
import type { FormValues } from '..';
import { z } from 'zod';

const emailSchema = z.email('Please enter a valid email address.');

export const Email = (): ReactElement => {
  const { control } = useFormContext<FormValues>();
  const {
    fields: emails,
    append,
    remove,
  } = useFieldArray({
    control,
    name: 'emails',
  });
  const [inputValue, setInputValue] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  const hasEmail = emails.length > 0;

  const validateEmail = (value: string): string => {
    if (!value.trim()) return 'Email is required.';
    const result = emailSchema.safeParse(value);
    return result.success ? '' : result.error.issues[0].message;
  };

  const reset = (): void => {
    setInputValue('');
    setErrorMessage('');
  };

  const handleBlur = (): void => {
    if (!inputValue) return setErrorMessage('');
    setErrorMessage(validateEmail(inputValue));
  };

  const handleAdd = (): void => {
    const trimmed = inputValue.trim();
    const error = validateEmail(trimmed);
    if (error) {
      setErrorMessage(error);
      return;
    }

    const isDuplicate = emails.some(
      (email) => email.value.toLowerCase() === inputValue.toLowerCase()
    );

    if (isDuplicate) {
      setErrorMessage('This email has already been added.');
      return;
    }

    append({ value: inputValue });
    reset();
  };

  return (
    <Grid container spacing={2} columnSpacing={3}>
      <Grid size={{ xs: 12, md: 6 }}>
        <Stack sx={{ gap: 2 }}>
          <Typography
            variant="body1"
            sx={{
              fontWeight: 600,
            }}
          >
            Emails
          </Typography>
          {hasEmail ? (
            <Stack
              direction="row"
              spacing={1}
              useFlexGap
              sx={{
                flexWrap: 'wrap',
              }}
            >
              {emails.map((email, index) => (
                <Chip
                  key={email.id ?? `${email.value}-${index}`}
                  label={email.value}
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
              No email added yet.
            </Typography>
          )}
        </Stack>
      </Grid>
      <Grid size={{ xs: 12, md: 6 }}>
        <Stack spacing={2}>
          <DataDisplayRow label="Email *">
            <Stack spacing={1}>
              <TextField
                type="email"
                variant="outlined"
                size="small"
                value={inputValue}
                onChange={(e) => {
                  setInputValue(e.target.value);
                  if (errorMessage) setErrorMessage('');
                }}
                onBlur={handleBlur}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    handleAdd();
                  }
                }}
                error={!!errorMessage}
                helperText={errorMessage}
              />
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
              onClick={() => reset()}
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
              onClick={handleAdd}
              disabled={Boolean(errorMessage)}
            >
              Add Email
            </Button>
          </Box>
        </Stack>
      </Grid>
    </Grid>
  );
};
