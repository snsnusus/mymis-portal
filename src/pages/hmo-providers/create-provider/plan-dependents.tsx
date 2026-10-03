import { type ReactElement } from 'react';
import { useWatch } from 'react-hook-form';
import { Grid, Stack, Typography } from '@mui/material';

import { ControlledCurrencyInput } from '~/components/form/inputs/controlled/currency-input';
import { ControlledPercentageInput } from '~/components/form/inputs/controlled/percentage-input';
import { ControlledSwitch } from '~/components/form/inputs/controlled/switch';

import { CURRENCY_SYMBOL } from '../constants';
import { getFieldName } from '../utils';

interface PlanFieldsProps {
  namePrefix?: string;
}

export const PlanDependents = ({
  namePrefix,
}: PlanFieldsProps): ReactElement => {
  const allowDependents = useWatch({
    name: getFieldName(namePrefix, 'allowDependents'),
  }) as boolean;

  return (
    <Stack spacing={2}>
      <Stack
        direction="row"
        sx={{ justifyContent: 'space-between', alignItems: 'center' }}
      >
        <Typography
          variant="body1"
          color="text.secondary"
          sx={{ fontWeight: 500 }}
        >
          Dependents
        </Typography>
        <Stack
          component="label"
          direction="row"
          sx={{ alignItems: 'center', cursor: 'pointer', gap: 2 }}
        >
          <Typography variant="body1" color="text.secondary">
            Allowed
          </Typography>
          <ControlledSwitch
            name={getFieldName(namePrefix, 'allowDependents')}
          />
        </Stack>
      </Stack>

      {allowDependents ? (
        <Grid container spacing={2}>
          <Grid size={{ xs: 12, md: 6 }}>
            <ControlledCurrencyInput
              label="Dependent Premium *"
              name={getFieldName(namePrefix, 'dependentPremiumCost')}
              currencySymbol={CURRENCY_SYMBOL}
            />
          </Grid>
          <Grid size={{ xs: 12, md: 6 }}>
            <ControlledPercentageInput
              label="Dependent Subsidy *"
              name={getFieldName(namePrefix, 'dependentSubsidyPercentage')}
            />
          </Grid>
        </Grid>
      ) : (
        <Typography variant="body1" color="text.secondary">
          Employee-only plan. Turn on to set dependent pricing.
        </Typography>
      )}
    </Stack>
  );
};
