import type { EmployeeEmailValues } from '../../types';
import type { ContactOwnership } from '~/models/employee.model';
import { type ReactElement, useState } from 'react';

import { Button, MenuItem, Stack, TextField } from '@mui/material';
import EmailIcon from '@mui/icons-material/Email';

import { CONTACT_OWNERSHIP_OPTIONS } from '../../constants/options';
import { EMAIL_SCHEMA } from '../../schemas';

interface AddEmailFormProps {
  emails: Array<{ value: string }>;
  onSave: (value: EmployeeEmailValues) => void;
}

export const AddEmailForm = ({
  emails,
  onSave,
}: AddEmailFormProps): ReactElement => {
  const [input, setInput] = useState('');
  const [ownership, setOwnership] = useState<ContactOwnership>('Personal');
  const [errorMessage, setErrorMessage] = useState('');

  const validateEmail = (value: string): string => {
    if (!value.trim()) return 'Email is required.';
    const result = EMAIL_SCHEMA.safeParse(value);
    return result.success ? '' : result.error.issues[0].message;
  };

  const clear = (): void => {
    setInput('');
    setOwnership('Personal');
    setErrorMessage('');
  };

  const handleBlur = (): void => {
    if (!input) return setErrorMessage('');
    setErrorMessage(validateEmail(input));
  };

  const handleSave = (): void => {
    const trimmed = input.trim();
    const error = validateEmail(trimmed);
    if (error) {
      setErrorMessage(error);
      return;
    }

    const isDuplicate = emails.some(
      (email) => email.value.toLowerCase() === input.toLowerCase()
    );

    if (isDuplicate) {
      setErrorMessage('This email has already been added.');
      return;
    }

    onSave({ value: input, ownership });
    clear();
  };

  return (
    <Stack spacing={2}>
      <Stack direction="row" sx={{ gap: 1, alignItems: 'flex-start' }}>
        <TextField
          label="Email Address *"
          type="email"
          variant="outlined"
          size="small"
          value={input}
          onChange={(e) => {
            setInput(e.target.value);
            if (errorMessage) setErrorMessage('');
          }}
          onBlur={handleBlur}
          onKeyDown={(e) => {
            if (e.key === 'Enter') {
              e.preventDefault();
              handleSave();
            }
          }}
          error={!!errorMessage}
          helperText={errorMessage}
          sx={{ flex: 1 }}
        />
        <TextField
          select
          label="Ownership"
          value={ownership}
          onChange={(event) =>
            setOwnership(event.target.value as ContactOwnership)
          }
          size="small"
          sx={{ width: 150 }}
        >
          {CONTACT_OWNERSHIP_OPTIONS.map(({ label, value }) => (
            <MenuItem key={value} value={value}>
              {label}
            </MenuItem>
          ))}
        </TextField>
      </Stack>
      <Stack
        direction="row"
        sx={{
          justifyContent: 'flex-end',
          gap: 1,
        }}
      >
        <Button variant="outlined" size="small" onClick={() => clear()}>
          Clear
        </Button>
        <Button
          variant="contained"
          startIcon={<EmailIcon />}
          size="small"
          onClick={handleSave}
          disabled={Boolean(errorMessage)}
        >
          Add Email
        </Button>
      </Stack>
    </Stack>
  );
};
