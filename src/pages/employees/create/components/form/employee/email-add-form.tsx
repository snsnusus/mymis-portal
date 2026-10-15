import { useState, type ReactElement } from 'react';

import { Button, Stack, TextField } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';

import { z } from 'zod';

interface AddEmailFormProps {
  emails: Array<{ value: string }>;
  onSave: (value: { value: string }) => void;
}

const emailSchema = z.email('Please enter a valid email address.');

export const EmailAddForm = ({
  emails,
  onSave,
}: AddEmailFormProps): ReactElement => {
  const [input, setInput] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  const validateEmail = (value: string): string => {
    if (!value.trim()) return 'Email is required.';
    const result = emailSchema.safeParse(value);
    return result.success ? '' : result.error.issues[0].message;
  };

  const clear = (): void => {
    setInput('');
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

    onSave({ value: input });
    clear();
  };

  return (
    <Stack spacing={2}>
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
      />
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
          startIcon={<AddIcon />}
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
