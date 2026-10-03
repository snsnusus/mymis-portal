// File: src/pages/data-management/hmo/components/hmo-provider-form-dialog.tsx
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
  Grid,
  Stack,
} from '@mui/material';

import { DataDisplayRow } from '~/components/ui/data-display-row';
import { FormProvider } from '~/components/form/form-provider';
import { ControlledTextField } from '~/components/form/inputs/controlled/textfield';
import { ControlledSwitch } from '~/components/form/inputs/controlled/switch';
import {
  hmoProviderPayloadToFormValuesMapper,
  hmoProviderFormValuesToPayloadMapper,
} from '~/mappers/hmo.mapper';
import { type HmoProvider } from '~/models/hmo.model';
import { useUpdateHmoProvider } from '~/queries/hmo.query';
import {
  emptyHmoProviderFormValues,
  hmoProviderSchema,
  type HmoProviderFormValues,
} from '~/schema/hmo.schema';
import { getApiErrorMessage } from '~/utils/http.util';

const FIELD_CONFIG = { row: { flexDirection: 'column' as const, gap: 1 } };

interface HmoProviderFormProps {
  provider: HmoProvider | null;
  isSaving: boolean;
  errorMessage: string | null;
  onCancel: () => void;
  onSubmit: (values: HmoProviderFormValues) => void;
}

const HmoProviderForm = ({
  provider,
  isSaving,
  errorMessage,
  onCancel,
  onSubmit,
}: HmoProviderFormProps): ReactElement => {
  const formMethods = useForm<HmoProviderFormValues>({
    resolver: zodResolver(hmoProviderSchema),
    defaultValues: provider
      ? hmoProviderPayloadToFormValuesMapper(provider)
      : emptyHmoProviderFormValues(),
  });

  return (
    <FormProvider {...formMethods} onSubmit={onSubmit}>
      <DialogContent dividers>
        <Grid container spacing={2}>
          <Grid size={{ xs: 12, sm: 4 }}>
            <DataDisplayRow label="Code *" config={FIELD_CONFIG}>
              <ControlledTextField name="code" />
            </DataDisplayRow>
          </Grid>
          <Grid size={{ xs: 12, sm: 8 }}>
            <DataDisplayRow label="Provider name *" config={FIELD_CONFIG}>
              <ControlledTextField name="name" />
            </DataDisplayRow>
          </Grid>
          <Grid size={{ xs: 12, sm: 6 }}>
            <DataDisplayRow label="Contract start *" config={FIELD_CONFIG}>
              <ControlledTextField name="contractStartDate" type="date" />
            </DataDisplayRow>
          </Grid>
          <Grid size={{ xs: 12, sm: 6 }}>
            <DataDisplayRow label="Contract end *" config={FIELD_CONFIG}>
              <ControlledTextField name="contractEndDate" type="date" />
            </DataDisplayRow>
          </Grid>
          <Grid size={12}>
            <DataDisplayRow label="Account manager" config={FIELD_CONFIG}>
              <ControlledTextField name="accountManagerName" />
            </DataDisplayRow>
          </Grid>
          <Grid size={{ xs: 12, sm: 6 }}>
            <DataDisplayRow label="Hotline" config={FIELD_CONFIG}>
              <ControlledTextField name="hotline" />
            </DataDisplayRow>
          </Grid>
          <Grid size={{ xs: 12, sm: 6 }}>
            <DataDisplayRow label="Support email" config={FIELD_CONFIG}>
              <ControlledTextField name="supportEmail" type="email" />
            </DataDisplayRow>
          </Grid>
          <Grid size={12}>
            <DataDisplayRow label="Website" config={FIELD_CONFIG}>
              <ControlledTextField name="websiteUrl" placeholder="https://" />
            </DataDisplayRow>
          </Grid>
          <Grid size={12}>
            <DataDisplayRow label="Active">
              <Stack direction="row" sx={{ justifyContent: 'flex-end' }}>
                <ControlledSwitch name="isActive" />
              </Stack>
            </DataDisplayRow>
          </Grid>
        </Grid>

        {errorMessage && (
          <Alert severity="error" sx={{ mt: 2 }}>
            {errorMessage}
          </Alert>
        )}
      </DialogContent>

      <DialogActions sx={{ p: 2 }}>
        <Button onClick={onCancel} color="inherit" disabled={isSaving}>
          Cancel
        </Button>
        <Button type="submit" variant="contained" disabled={isSaving}>
          {isSaving ? 'Saving…' : 'Save'}
        </Button>
      </DialogActions>
    </FormProvider>
  );
};

interface HmoProviderFormDialogProps {
  open: boolean;
  provider: HmoProvider;
  onClose: () => void;
  onSaved: (provider: HmoProvider) => void;
}

export const HmoProviderFormDialog = ({
  open,
  provider,
  onClose,
  onSaved,
}: HmoProviderFormDialogProps): ReactElement => {
  const mutation = useUpdateHmoProvider();
  const isSaving = mutation.isLoading;

  const handleSubmit = (values: HmoProviderFormValues): void => {
    mutation.mutate(
      {
        id: provider.id,
        payload: hmoProviderFormValuesToPayloadMapper(values),
      },
      { onSuccess: onSaved }
    );
  };

  return (
    <Dialog
      open={open}
      onClose={isSaving ? undefined : onClose}
      maxWidth="sm"
      slotProps={{ transition: { onEnter: () => mutation.reset() } }}
    >
      <DialogTitle>Edit HMO provider</DialogTitle>
      <HmoProviderForm
        key={provider.id}
        provider={provider}
        isSaving={isSaving}
        errorMessage={
          mutation.isError ? getApiErrorMessage(mutation.error) : null
        }
        onCancel={onClose}
        onSubmit={handleSubmit}
      />
    </Dialog>
  );
};
