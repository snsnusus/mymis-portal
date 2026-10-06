import type { FormValues } from '..';
import { useState, type MouseEvent, type ReactElement } from 'react';
import { useFormContext } from 'react-hook-form';
import {
  Card,
  CardContent,
  Grid,
  IconButton,
  InputAdornment,
  Stack,
  ToggleButton,
  ToggleButtonGroup,
  Tooltip,
  Typography,
} from '@mui/material';
import {
  ContentCopy as ContentCopyIcon,
  Refresh as RefreshIcon,
  Visibility as VisibilityIcon,
  VisibilityOff as VisibilityOffIcon,
} from '@mui/icons-material';
import { ControlledTextField } from '~/components/form/inputs/controlled/textfield';
import { useCheckUsernameAvailability } from '~/queries/employee.query';
import {
  generateDefaultPassword,
  generateRandomPassword,
} from '~/utils/password.util';

type PasswordMode = 'manual' | 'default' | 'random';

// Must match UsernameRules in MyMIS.Api.
const USERNAME_PATTERN = /^[a-z][a-z0-9._-]{2,29}$/;
const USERNAME_RULE_MESSAGE =
  'Username must be 3–30 characters long, start with a letter, and contain only letters, numbers, dots (.), underscores (_) or hyphens (-).';

export const AuthCredentials = (): ReactElement => {
  const { getValues, setValue, trigger, clearErrors } =
    useFormContext<FormValues>();
  const checkUsernameAvailability = useCheckUsernameAvailability();

  const [passwordMode, setPasswordMode] = useState<PasswordMode>('manual');
  const [showPassword, setShowPassword] = useState(false);

  const generatePassword = (mode: Exclude<PasswordMode, 'manual'>): void => {
    const password =
      mode === 'default'
        ? generateDefaultPassword(getValues('lastName'))
        : generateRandomPassword();

    setValue('password', password, { shouldValidate: true, shouldDirty: true });
    setShowPassword(true);
  };

  const handleModeChange = (
    _event: MouseEvent<HTMLElement>,
    mode: PasswordMode | null
  ): void => {
    // ToggleButtonGroup passes null when the selected button is clicked again.
    if (mode === null) return;

    setPasswordMode(mode);

    if (mode === 'manual') {
      setValue('password', '', { shouldDirty: true });
      setShowPassword(false);
      return;
    }

    generatePassword(mode);
  };

  const isGenerated = passwordMode !== 'manual';

  return (
    <Card variant="outlined">
      <Stack sx={{ p: 2, borderBottom: '1px solid', borderColor: 'divider' }}>
        <Typography variant="h6">Login Credentials</Typography>
        <Typography variant="subtitle1" color="text.secondary">
          The employee signs in with these and must change the password on first
          login.
        </Typography>
      </Stack>

      <CardContent>
        <Grid container spacing={2}>
          <Grid size={{ xs: 12, md: 6 }}>
            <Stack sx={{ gap: 2 }}>
              <ControlledTextField
                label="Username *"
                name="username"
                autoComplete="off"
                helperText="Lowercase letters, numbers, dots, underscores and hyphens."
                rules={{
                  required: 'Username is required.',
                  pattern: {
                    value: USERNAME_PATTERN,
                    message: USERNAME_RULE_MESSAGE,
                  },
                  validate: async (value: string) => {
                    try {
                      const available = await checkUsernameAvailability(value);
                      return available || 'That username is already taken.';
                    } catch {
                      // If the check itself fails, don't block HR here;
                      // the API's 409 on submit is still the final guard.
                      return true;
                    }
                  },
                }}
                onChange={(event) => {
                  clearErrors('username');
                  setValue('username', event.target.value.toLowerCase(), {
                    shouldDirty: true,
                  });
                }}
                onBlur={() => {
                  void trigger('username');
                }}
              />
            </Stack>
          </Grid>

          <Grid size={{ xs: 12, md: 6 }}>
            <Stack sx={{ gap: 2 }}>
              <ToggleButtonGroup
                value={passwordMode}
                exclusive
                size="small"
                onChange={handleModeChange}
                aria-label="How to set the password"
              >
                <ToggleButton value="manual">Type it</ToggleButton>
                <ToggleButton value="default">Default format</ToggleButton>
                <ToggleButton value="random">Random</ToggleButton>
              </ToggleButtonGroup>

              <ControlledTextField
                label="Password *"
                name="password"
                type={showPassword ? 'text' : 'password'}
                autoComplete="new-password"
                rules={{
                  required: 'Password is required.',
                  minLength: {
                    value: 8,
                    message: 'Password must be at least 8 characters.',
                  },
                }}
                slotProps={{
                  input: {
                    readOnly: isGenerated,
                    endAdornment: (
                      <InputAdornment position="end">
                        <Tooltip title={showPassword ? 'Hide' : 'Show'}>
                          <IconButton
                            aria-label={
                              showPassword ? 'Hide password' : 'Show password'
                            }
                            onClick={() => setShowPassword((shown) => !shown)}
                            edge="end"
                          >
                            {showPassword ? (
                              <VisibilityOffIcon fontSize="small" />
                            ) : (
                              <VisibilityIcon fontSize="small" />
                            )}
                          </IconButton>
                        </Tooltip>
                        <Tooltip title="Copy">
                          <IconButton
                            aria-label="Copy password"
                            onClick={() => {
                              void navigator.clipboard.writeText(
                                getValues('password')
                              );
                            }}
                          >
                            <ContentCopyIcon fontSize="small" />
                          </IconButton>
                        </Tooltip>
                        {isGenerated && (
                          <Tooltip title="Generate another">
                            <IconButton
                              aria-label="Generate another password"
                              onClick={() => generatePassword(passwordMode)}
                            >
                              <RefreshIcon fontSize="small" />
                            </IconButton>
                          </Tooltip>
                        )}
                      </InputAdornment>
                    ),
                  },
                }}
              />
            </Stack>
          </Grid>
        </Grid>
      </CardContent>
    </Card>
  );
};
