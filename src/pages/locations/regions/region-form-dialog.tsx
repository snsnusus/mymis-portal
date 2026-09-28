import { type ReactElement } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  Alert,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Stack,
} from '@mui/material';
import type { Region } from '~/models/region.model';
import { regionSchema, type RegionFormValues } from '~/schema/region.schema';
import { Form } from '~/components/form';
import { ControlledTextField } from '~/components/form/controlled/textfield';

interface RegionFormDialogProps {
  open: boolean;
  region: Region | null;
  isSaving: boolean;
  errorMessage: string | null;
  onClose: () => void;
  onSubmit: (values: RegionFormValues) => void;
}

const RegionForm = ({
  region,
  isSaving,
  errorMessage,
  onClose,
  onSubmit,
}: Omit<RegionFormDialogProps, 'open'>): ReactElement => {
  const methods = useForm<RegionFormValues>({
    resolver: zodResolver(regionSchema),
    defaultValues: {
      name: region?.name ?? '',
      psgcCode: region?.psgcCode ?? '',
    },
  });

  return (
    <Form {...methods} onSubmit={onSubmit}>
      <DialogTitle>{region ? `Edit Region` : 'Add Region'}</DialogTitle>
      <DialogContent dividers>
        <Stack sx={{ gap: 2, pt: 1 }}>
          {errorMessage && <Alert severity="error">{errorMessage}</Alert>}
          <ControlledTextField name="name" label="Name" />
          <ControlledTextField name="psgcCode" label="PSGC Code (optional)" />
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
    </Form>
  );
};

const RegionFormDialog = ({
  open,
  region,
  isSaving,
  errorMessage,
  onClose,
  onSubmit,
}: RegionFormDialogProps): ReactElement => (
  <Dialog
    open={open}
    onClose={isSaving ? undefined : onClose}
    fullWidth
    maxWidth="xs"
  >
    <RegionForm
      key={region?.id ?? 'new'}
      region={region}
      isSaving={isSaving}
      errorMessage={errorMessage}
      onClose={onClose}
      onSubmit={onSubmit}
    />
  </Dialog>
);

export default RegionFormDialog;
