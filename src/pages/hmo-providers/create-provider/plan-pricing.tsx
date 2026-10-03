import { type ReactElement } from 'react';
import { Grid, Stack, Typography } from '@mui/material';

import { ControlledCurrencyInput } from '~/components/form/inputs/controlled/currency-input';
import { ControlledPercentageInput } from '~/components/form/inputs/controlled/percentage-input';
import { ControlledSelectField } from '~/components/form/inputs/controlled/select';

import { CURRENCY_SYMBOL, PREMIUM_FREQUENCY_OPTIONS } from '../constants';
import { getFieldName } from '../utils';

interface PlanFieldsProps {
  namePrefix?: string;
}

export const PlanPricing = ({ namePrefix }: PlanFieldsProps): ReactElement => (
  <Stack spacing={2}>
    <Typography variant="body1" color="text.secondary" sx={{ fontWeight: 500 }}>
      Benefit Limit and Pricing
    </Typography>
    s
    <Grid container spacing={2}>
      <Grid size={{ xs: 12, sm: 6, md: 3 }}>
        <ControlledCurrencyInput
          label="Maximum benefit limit *"
          name={getFieldName(namePrefix, 'maximumBenefitLimit')}
          currencySymbol={CURRENCY_SYMBOL}
          fullWidth
        />
      </Grid>
      <Grid size={{ xs: 12, sm: 6, md: 3 }}>
        <ControlledSelectField
          label="Premium frequency *"
          name={getFieldName(namePrefix, 'premiumFrequency')}
          options={PREMIUM_FREQUENCY_OPTIONS}
          fullWidth
        />
      </Grid>
      <Grid size={{ xs: 12, sm: 6, md: 3 }}>
        <ControlledCurrencyInput
          label="Premium *"
          name={getFieldName(namePrefix, 'premiumCost')}
          currencySymbol={CURRENCY_SYMBOL}
          fullWidth
        />
      </Grid>
      <Grid size={{ xs: 12, sm: 6, md: 3 }}>
        <ControlledPercentageInput
          label="Employer subsidy *"
          name={getFieldName(namePrefix, 'employerSubsidyPercentage')}
        />
      </Grid>
    </Grid>
  </Stack>
);
