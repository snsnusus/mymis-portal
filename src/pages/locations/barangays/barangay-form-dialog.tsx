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
import type { Barangay } from '~/models/barangay.model';
import type { City } from '~/models/city.model';
import {
  barangaySchema,
  type BarangayFormValues,
} from '~/schema/barangay.schema';
import { ControlledTextField } from '~/components/form/inputs/controlled/textfield';
import { FormProvider } from '~/components/form/form-provider';
// keep your existing BaseTextField import here

interface BarangayFormDialogProps {
  open: boolean;
  barangay: Barangay | null; // null = add mode
  cities: City[]; // cities of the currently selected region
  regionName: string;
  defaultCityId: number | undefined;
  isSaving: boolean;
  errorMessage: string | null;
  onClose: () => void;
  onSubmit: (values: BarangayFormValues) => void;
}

const BarangayForm = ({
  barangay,
  cities,
  regionName,
  defaultCityId,
  isSaving,
  errorMessage,
  onClose,
  onSubmit,
}: Omit<BarangayFormDialogProps, 'open'>): ReactElement => {
  const methods = useForm<BarangayFormValues>({
    resolver: zodResolver(barangaySchema),
    defaultValues: {
      name: barangay?.name ?? '',
      psgcCode: barangay?.psgcCode ?? '',
      zipCode: barangay?.zipCode ?? '',
      cityId: barangay?.cityId ?? defaultCityId,
    },
  });

  return (
    <FormProvider {...methods} onSubmit={onSubmit}>
      <DialogTitle>
        {barangay ? `Edit ${barangay.name}` : 'Add barangay'}
      </DialogTitle>
      <DialogContent dividers>
        <Stack sx={{ gap: 2, pt: 1 }}>
          {errorMessage && <Alert severity="error">{errorMessage}</Alert>}
          <Controller
            name="cityId"
            control={methods.control}
            render={({ field, fieldState }) => (
              <TextField
                select
                label="City"
                required
                value={field.value ?? ''}
                onChange={(event) => field.onChange(Number(event.target.value))}
                onBlur={field.onBlur}
                inputRef={field.ref}
                error={!!fieldState.error}
                helperText={
                  fieldState.error?.message ?? `Cities in ${regionName}`
                }
              >
                {cities.map((city) => (
                  <MenuItem key={city.id} value={city.id}>
                    {city.name}
                  </MenuItem>
                ))}
              </TextField>
            )}
          />
          <ControlledTextField name="name" label="Name" required autoFocus />
          <ControlledTextField name="psgcCode" label="PSGC code (optional)" />
          <ControlledTextField name="zipCode" label="ZIP code (optional)" />
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

const BarangayFormDialog = ({
  open,
  barangay,
  cities,
  regionName,
  defaultCityId,
  isSaving,
  errorMessage,
  onClose,
  onSubmit,
}: BarangayFormDialogProps): ReactElement => (
  <Dialog
    open={open}
    onClose={isSaving ? undefined : onClose}
    fullWidth
    maxWidth="xs"
  >
    <BarangayForm
      key={barangay?.id ?? `new-${defaultCityId}`}
      barangay={barangay}
      cities={cities}
      regionName={regionName}
      defaultCityId={defaultCityId}
      isSaving={isSaving}
      errorMessage={errorMessage}
      onClose={onClose}
      onSubmit={onSubmit}
    />
  </Dialog>
);

export default BarangayFormDialog;
