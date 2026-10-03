import { type ReactElement } from 'react';
import { useWatch } from 'react-hook-form';
import { Grid, Stack, Typography } from '@mui/material';

import { ControlledCurrencyInput } from '~/components/form/inputs/controlled/currency-input';
import { ControlledSwitch } from '~/components/form/inputs/controlled/switch';

import { CURRENCY_SYMBOL } from '../constants';
import { getFieldName } from '../utils';

interface PlanFieldsProps {
  namePrefix?: string;
}

export const PlanPec = ({ namePrefix }: PlanFieldsProps): ReactElement => {
  const pecCovered = useWatch({
    name: getFieldName(namePrefix, 'pecCovered'),
  }) as boolean;

  return (
    <Stack sx={{ gap: 2 }}>
      <Stack
        direction="row"
        sx={{ justifyContent: 'space-between', alignItems: 'center' }}
      >
        <Typography
          variant="body1"
          color="text.secondary"
          sx={{ fontWeight: 500 }}
        >
          Pre-existing conditions
        </Typography>
        <Stack
          component="label"
          direction="row"
          sx={{ alignItems: 'center', cursor: 'pointer', gap: 2 }}
        >
          <Typography variant="body1" color="text.secondary">
            Covered
          </Typography>
          <ControlledSwitch name={getFieldName(namePrefix, 'pecCovered')} />
        </Stack>
      </Stack>

      {pecCovered ? (
        <Grid container spacing={2}>
          <Grid size={12}>
            <ControlledCurrencyInput
              label="PEC Limit *"
              name={getFieldName(namePrefix, 'pecLimit')}
              currencySymbol={CURRENCY_SYMBOL}
            />
          </Grid>
        </Grid>
      ) : (
        <Typography variant="body1" color="text.secondary">
          Pre-existing conditions aren't covered by this plan.
        </Typography>
      )}
    </Stack>
  );
};
