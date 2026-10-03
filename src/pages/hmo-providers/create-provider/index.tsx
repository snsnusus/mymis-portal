import { type ReactElement } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import { zodResolver } from '@hookform/resolvers/zod';
import { Alert, Box, Button, Stack, Typography } from '@mui/material';

import { FormProvider } from '~/components/form/form-provider';
import { hmoProviderCreateFormValuesToPayloadMapper } from '~/mappers/hmo.mapper';
import { useCreateHmoProvider } from '~/queries/hmo.query';
import {
  emptyHmoProviderCreateFormValues,
  hmoProviderCreateSchema,
  type HmoProviderCreateFormValues,
} from '~/schema/hmo.schema';
import { getApiErrorMessage } from '~/utils/http.util';

import { HMO_PATHS } from '../paths';
import { PlanSection } from './plan-section';
import { ProviderInfo } from './provider-info';

const CreateProvider = (): ReactElement => {
  const navigate = useNavigate();
  const createProvider = useCreateHmoProvider();
  const isSaving = createProvider.isPending;

  const formMethods = useForm<HmoProviderCreateFormValues>({
    resolver: zodResolver(hmoProviderCreateSchema),
    defaultValues: emptyHmoProviderCreateFormValues(),
  });

  const handleSubmit = (values: HmoProviderCreateFormValues): void => {
    createProvider.mutate(hmoProviderCreateFormValuesToPayloadMapper(values), {
      onSuccess: (provider) => navigate(HMO_PATHS.provider(provider.id)),
    });
  };

  return (
    <FormProvider {...formMethods} onSubmit={(data) => handleSubmit(data)}>
      <Stack sx={{ gap: 2 }}>
        <Box>
          <Typography variant="h6">Create Provider</Typography>
          <Typography variant="subtitle1" color="text.secondary">
            Onboard a new HMO provider, define its contract terms, and set up
            the coverage plans available under it.
          </Typography>
        </Box>

        <ProviderInfo />
        <PlanSection />

        {createProvider.isError && (
          <Alert severity="error">
            {getApiErrorMessage(createProvider.error)}
          </Alert>
        )}

        <Stack direction="row" spacing={1} sx={{ justifyContent: 'flex-end' }}>
          <Button
            color="inherit"
            onClick={() => navigate(HMO_PATHS.providers)}
            disabled={isSaving}
          >
            Cancel
          </Button>
          <Button type="submit" variant="contained" disabled={isSaving}>
            {isSaving ? 'Creating…' : 'Create provider'}
          </Button>
        </Stack>
      </Stack>
    </FormProvider>
  );
};

export default CreateProvider;
