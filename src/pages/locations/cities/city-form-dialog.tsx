import { type ReactElement } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  Alert,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  MenuItem,
  Stack,
  TextField,
} from '@mui/material';
import type { City } from '~/models/city.model';
import type { Region } from '~/models/region.model';
import { citySchema, type CityFormValues } from '~/schema/city.schema';
import { ControlledTextField } from '~/components/form/inputs/controlled/textfield';
import { FormProvider } from '~/components/form/form-provider';

interface CityFormDialogProps {
  open: boolean;
  city: City | null; // null = add mode
  regions: Region[];
  defaultRegionId: number | undefined; // prefill in add mode
  isSaving: boolean;
  errorMessage: string | null;
  onClose: () => void;
  onSubmit: (values: CityFormValues) => void;
}

const CityForm = ({
  city,
  regions,
  defaultRegionId,
  isSaving,
  errorMessage,
  onClose,
  onSubmit,
}: Omit<CityFormDialogProps, 'open'>): ReactElement => {
  const methods = useForm<CityFormValues>({
    resolver: zodResolver(citySchema),
    defaultValues: {
      name: city?.name ?? '',
      psgcCode: city?.psgcCode ?? '',
      regionId: city?.regionId ?? defaultRegionId,
    },
  });

  return (
    <FormProvider {...methods} onSubmit={onSubmit}>
      <DialogTitle>{city ? `Edit ${city.name}` : 'Add city'}</DialogTitle>
      <DialogContent>
        <Stack sx={{ gap: 2, pt: 1 }}>
          {errorMessage && <Alert severity="error">{errorMessage}</Alert>}
          <Controller
            name="regionId"
            control={methods.control}
            render={({ field, fieldState }) => (
              <TextField
                select
                label="Region"
                required
                value={field.value ?? ''}
                onChange={(event) => field.onChange(Number(event.target.value))}
                onBlur={field.onBlur}
                inputRef={field.ref}
                error={!!fieldState.error}
                helperText={fieldState.error?.message}
              >
                {regions.map((region) => (
                  <MenuItem key={region.id} value={region.id}>
                    {region.name}
                  </MenuItem>
                ))}
              </TextField>
            )}
          />
          <ControlledTextField name="name" label="Name" required autoFocus />
          <ControlledTextField name="psgcCode" label="PSGC code (optional)" />
        </Stack>
      </DialogContent>
      <DialogActions sx={{ px: 3, pb: 2 }}>
        <Button color="inherit" onClick={onClose} disabled={isSaving}>
          Cancel
        </Button>
        <Button type="submit" variant="contained" disabled={isSaving}>
          {isSaving ? 'Saving...' : 'Save'}
        </Button>
      </DialogActions>
    </FormProvider>
  );
};

const CityFormDialog = ({
  open,
  city,
  regions,
  defaultRegionId,
  isSaving,
  errorMessage,
  onClose,
  onSubmit,
}: CityFormDialogProps): ReactElement => (
  <Dialog
    open={open}
    onClose={isSaving ? undefined : onClose}
    fullWidth
    maxWidth="xs"
  >
    <CityForm
      key={city?.id ?? `new-${defaultRegionId}`}
      city={city}
      regions={regions}
      defaultRegionId={defaultRegionId}
      isSaving={isSaving}
      errorMessage={errorMessage}
      onClose={onClose}
      onSubmit={onSubmit}
    />
  </Dialog>
);

export default CityFormDialog;
