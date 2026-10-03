import { useState, type ReactElement } from 'react';
import {
  Box,
  Button,
  Grid,
  IconButton,
  Paper,
  Stack,
  TextField,
  Tooltip,
  Typography,
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import EmailIcon from '@mui/icons-material/Email';
import DeleteIcon from '@mui/icons-material/Delete';
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
    <Grid container spacing={2} sx={{ padding: 2 }}>
      <Grid size={{ xs: 12, md: 6 }}>
        <Stack sx={{ gap: 2 }}>
          <Typography variant="body1" sx={{ fontWeight: 'fontWeightMedium' }}>
            Emails
          </Typography>
          {hasEmail ? (
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
              {emails.map((email, index) => (
                <Paper
                  key={email.id}
                  variant="outlined"
                  sx={{
                    p: 1.5,
                    display: 'flex',
                    alignItems: 'center',
                    gap: 1.5,
                    width: '100%',
                  }}
                >
                  <EmailIcon
                    color="primary"
                    fontSize="large"
                    sx={{ mt: 0.25 }}
                  />
                  <Box sx={{ flexGrow: 1, minWidth: 0 }}>
                    <Typography variant="body2" color="text.secondary">
                      Email {index + 1}
                    </Typography>
                    <Typography
                      variant="body1"
                      sx={{ overflowWrap: 'anywhere' }}
                    >
                      {email.value}
                    </Typography>
                  </Box>
                  <Tooltip title="Remove Email">
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
            <Typography color="text.secondary">No email added yet.</Typography>
          )}
        </Stack>
      </Grid>
      <Grid size={{ xs: 12, md: 6 }}>
        <Stack spacing={2}>
          <TextField
            label="Email Address *"
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
              sx={{
                minWidth: 150,
              }}
              onClick={() => reset()}
            >
              Clear
            </Button>
            <Button
              variant="contained"
              startIcon={<AddIcon />}
              size="small"
              onClick={handleAdd}
              disabled={Boolean(errorMessage)}
              sx={{
                minWidth: 150,
              }}
            >
              Add Email
            </Button>
          </Box>
        </Stack>
      </Grid>
    </Grid>
  );
};
