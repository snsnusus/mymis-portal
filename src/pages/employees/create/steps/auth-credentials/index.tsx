import type { EmployeeCreateFormValues, PasswordMode } from '../../types';
import {
  useEffect,
  useState,
  type ChangeEvent,
  type ReactElement,
} from 'react';
import { useFormContext, useWatch } from 'react-hook-form';
import {
  useCheckUsernameAvailability,
  useSuggestUsernames,
} from '~/queries/employee.query';
import {
  Chip,
  FormControlLabel,
  Grid,
  IconButton,
  InputAdornment,
  Radio,
  RadioGroup,
  Stack,
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
import { Card } from '~/components/ui/card';
import {
  generateDefaultPassword,
  generateRandomPassword,
} from '~/utils/password.util';
import { SectionHeader } from '~/components/section-header';

const USERNAME_PATTERN = /^[a-z][a-z0-9._-]{2,29}$/;
const USERNAME_RULE_MESSAGE =
  'Username must be 3 - 30 characters long, start with a letter, and contain only letters, numbers, dots (.), underscores (_) or hyphens (-).';

export const AuthCredentials = (): ReactElement => {
  const { getValues, setValue, trigger, clearErrors } =
    useFormContext<EmployeeCreateFormValues>();
  const username = useWatch<EmployeeCreateFormValues, 'username'>({
    name: 'username',
  });
  const checkUsernameAvailability = useCheckUsernameAvailability();
  const suggestUsernames = useSuggestUsernames();

  const passwordMode = useWatch<EmployeeCreateFormValues, 'passwordMode'>({
    name: 'passwordMode',
  });
  const [showPassword, setShowPassword] = useState(
    () => getValues('passwordMode') !== 'free-text'
  );
  const [suggestions, setSuggestions] = useState<string[]>([]);

  useEffect(() => {
    let isCancelled = false;

    const loadSuggestions = async (): Promise<void> => {
      try {
        const usernames = await suggestUsernames({
          firstName: getValues('firstName'),
          lastName: getValues('lastName'),
          birthdate: getValues('birthdate'),
        });

        if (isCancelled) return;

        setSuggestions(usernames);

        const [first] = usernames;
        if (first && !getValues('username')) {
          setValue('username', first, { shouldDirty: true });
          void trigger('username');
        }
      } catch (error) {
        if (import.meta.env.DEV)
          console.error('Username suggestions failed', error);
      }
    };

    void loadSuggestions();

    return () => {
      isCancelled = true;
    };
  }, [getValues, setValue, trigger, suggestUsernames]);

  const selectSuggestion = (suggestion: string): void => {
    clearErrors('username');
    setValue('username', suggestion, { shouldDirty: true });
    void trigger('username');
  };

  const generatePassword = (mode: Exclude<PasswordMode, 'free-text'>): void => {
    const password =
      mode === 'default'
        ? generateDefaultPassword(getValues('lastName'))
        : generateRandomPassword();

    setValue('password', password, { shouldValidate: true, shouldDirty: true });
    setShowPassword(true);
  };

  const handleModeChange = (
    _event: ChangeEvent<HTMLInputElement>,
    value: string
  ): void => {
    const mode = value as PasswordMode;
    setValue('passwordMode', mode);

    if (mode === 'free-text') {
      setValue('password', '', { shouldDirty: true });
      setShowPassword(false);
      return;
    }

    generatePassword(mode);
  };

  const isGenerated = passwordMode !== 'free-text';

  useEffect(() => {
    if (getValues('passwordMode') !== 'default' || getValues('password'))
      return;

    setValue('password', generateDefaultPassword(getValues('lastName')), {
      shouldValidate: true,
      shouldDirty: true,
    });
  }, [getValues, setValue]);

  return (
    <Card
      header={
        <SectionHeader
          header="Login Credentials"
          subheader="The employee signs in with these and must change the password on first
          login."
        />
      }
    >
      <Grid container spacing={2}>
        <Grid size={{ xs: 12, md: 6 }}>
          <Stack sx={{ gap: 1 }}>
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

            {suggestions.length > 0 && (
              <Stack
                direction="row"
                sx={{ flexWrap: 'wrap', alignItems: 'center', gap: 1 }}
              >
                <Typography variant="caption" color="text.secondary">
                  Suggestions:
                </Typography>
                {suggestions.map((suggestion) => {
                  const isSelected = suggestion === username;

                  return (
                    <Chip
                      key={suggestion}
                      label={suggestion}
                      size="small"
                      clickable
                      color={isSelected ? 'primary' : 'default'}
                      variant={isSelected ? 'filled' : 'outlined'}
                      onClick={() => selectSuggestion(suggestion)}
                    />
                  );
                })}
              </Stack>
            )}
          </Stack>
        </Grid>

        <Grid size={{ xs: 12, md: 6 }}>
          <Stack sx={{ gap: 1 }}>
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
                            edge="end"
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

            <RadioGroup
              row
              value={passwordMode}
              onChange={handleModeChange}
              aria-label="How to set the password"
            >
              <FormControlLabel
                value="free-text"
                control={<Radio size="small" />}
                label="Free-text"
                slotProps={{ typography: { variant: 'body2' } }}
              />
              <FormControlLabel
                value="default"
                control={<Radio size="small" />}
                label="Default format"
                slotProps={{ typography: { variant: 'body2' } }}
              />
              <FormControlLabel
                value="random"
                control={<Radio size="small" />}
                label="Random"
                slotProps={{ typography: { variant: 'body2' } }}
              />
            </RadioGroup>
          </Stack>
        </Grid>
      </Grid>
    </Card>
  );
};
