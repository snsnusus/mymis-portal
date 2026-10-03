import { type ReactElement, type Ref, useState } from 'react';
import {
  Autocomplete as MuiAutocomplete,
  TextField,
  CircularProgress,
  createFilterOptions,
  type AutocompleteChangeDetails,
  type AutocompleteProps as MuiAutocompleteProps,
  type FilterOptionsState,
} from '@mui/material';

const CREATE_OPTION_MARKER = Symbol('create-option');

type CreateOption = {
  [CREATE_OPTION_MARKER]: true;
  inputValue: string;
};

function isCreateOption<T>(option: T | CreateOption): option is CreateOption {
  return (
    typeof option === 'object' &&
    option !== null &&
    CREATE_OPTION_MARKER in option
  );
}

export type AutocompleteProps<
  T,
  Multiple extends boolean | undefined = false,
  DisableClearable extends boolean | undefined = false,
  FreeSolo extends boolean | undefined = false
> = Omit<
  MuiAutocompleteProps<T, Multiple, DisableClearable, FreeSolo>,
  'renderInput' | 'onChange'
> & {
  label?: string;
  placeholder?: string;
  name?: string;
  error?: boolean;
  helperText?: string;
  inputRef?: Ref<any>;
  onChange?: (
    event: React.SyntheticEvent,
    value: T | T[] | null,
    reason: string,
    details?: AutocompleteChangeDetails<T>
  ) => void;
  /** When provided, typing a value not in `options` shows an "Add ..." row that calls this to create it. */
  onCreate?: (inputValue: string) => Promise<T>;
  /** Customize the "Add ..." row label. Defaults to `Add "input"`. */
  getCreateOptionLabel?: (inputValue: string) => string;
};

export const Autocomplete = <
  T,
  Multiple extends boolean | undefined = false,
  DisableClearable extends boolean | undefined = false,
  FreeSolo extends boolean | undefined = false
>({
  options,
  getOptionLabel,
  label,
  placeholder = 'Search...',
  name,
  error,
  helperText,
  inputRef,
  onCreate,
  getCreateOptionLabel = (inputValue) => `Add "${inputValue}"`,
  onChange,
  filterOptions,
  ...rest
}: AutocompleteProps<
  T,
  Multiple,
  DisableClearable,
  FreeSolo
>): ReactElement => {
  const [isCreating, setIsCreating] = useState(false);
  const defaultFilter = createFilterOptions<T>();

  const resolvedGetOptionLabel = (option: T | CreateOption): string => {
    if (isCreateOption(option)) return getCreateOptionLabel(option.inputValue);
    return getOptionLabel ? getOptionLabel(option as T) : String(option);
  };

  const resolvedFilterOptions = onCreate
    ? (opts: T[], state: FilterOptionsState<T>) => {
        const filtered = filterOptions
          ? filterOptions(opts, state)
          : defaultFilter(opts, state);

        const inputValue = state.inputValue.trim();
        const alreadyExists = opts.some(
          (option) =>
            resolvedGetOptionLabel(option).toLowerCase() ===
            inputValue.toLowerCase()
        );

        if (inputValue !== '' && !alreadyExists) {
          const createOption: CreateOption = {
            [CREATE_OPTION_MARKER]: true,
            inputValue,
          };
          return [...filtered, createOption as unknown as T];
        }

        return filtered;
      }
    : filterOptions;

  const handleChange = async (
    event: React.SyntheticEvent,
    newValue: T | T[] | null,
    reason: string
  ): Promise<void> => {
    if (onCreate && newValue && isCreateOption(newValue as any)) {
      const { inputValue } = newValue as unknown as CreateOption;
      setIsCreating(true);
      try {
        const created = await onCreate(inputValue);
        onChange?.(event, created, 'createOption');
      } finally {
        setIsCreating(false);
      }
      return;
    }

    onChange?.(event, newValue, reason);
  };

  return (
    <MuiAutocomplete
      options={options}
      getOptionLabel={resolvedGetOptionLabel as any}
      filterOptions={resolvedFilterOptions}
      onChange={handleChange as any}
      disabled={rest.disabled || isCreating}
      {...rest}
      renderInput={(params) => (
        <TextField
          {...params}
          inputRef={inputRef}
          name={name}
          label={label}
          placeholder={placeholder}
          size="small"
          error={error}
          helperText={helperText}
          fullWidth
          slotProps={{
            ...params.slotProps,
            input: {
              ...params.slotProps.input,
              endAdornment: (
                <>
                  {isCreating && <CircularProgress size={16} sx={{ mr: 1 }} />}
                  {params.slotProps.input.endAdornment}
                </>
              ),
            },
          }}
        />
      )}
    />
  );
};
