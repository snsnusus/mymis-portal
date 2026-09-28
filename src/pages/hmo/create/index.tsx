import { type ReactElement } from 'react';
import { useForm } from 'react-hook-form';
import { Box, Button, Stack, Typography } from '@mui/material';
import { Form } from '~/components/form';
import { ProviderInfo } from './provider-info';
import { PlansSection } from './plan-section';
import { Coverage } from './coverage';
import { zodResolver } from '@hookform/resolvers/zod';
import { hmoProviderSchema } from './hmo-provider.schema';

const CreateHMOProvider = (): ReactElement => {
  const formValues = useForm({
    resolver: zodResolver(hmoProviderSchema),
    defaultValues: {},
  });
  const handleSubmit = (data: any): void => {
    console.log(data, 'data');
  };

  return (
    <Form {...formValues} onSubmit={(data) => handleSubmit(data)}>
      <Stack spacing={3} sx={{ width: '100%', pt: 2 }}>
        <Box>
          <Typography
            variant="h5"
            sx={{ fontWeight: 700, color: 'text.primary' }}
          >
            Create HMO Provider
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Onboard a new HMO provider, define its contract terms, and set up
            the coverage plans available under it.
          </Typography>
        </Box>
        <ProviderInfo />
        <PlansSection />
        <Coverage />
        <Button type="submit" variant="contained">
          Submit
        </Button>
      </Stack>
    </Form>
  );
};

export default CreateHMOProvider;
