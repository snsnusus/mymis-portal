import { type ReactElement } from 'react';
import { Grid, Stack, Typography } from '@mui/material';

import { ControlledSelectField } from '~/components/form/inputs/controlled/select';
import { ControlledTextField } from '~/components/form/inputs/controlled/textfield';

import { PLAN_TIER_OPTIONS, ROOM_TYPE_OPTIONS } from '../constants';
import { getFieldName } from '../utils';

interface PlanFieldsProps {
  namePrefix?: string;
}

export const PlanDetails = ({ namePrefix }: PlanFieldsProps): ReactElement => (
  <Stack spacing={2}>
    <Typography variant="body1" color="text.secondary" sx={{ fontWeight: 500 }}>
      Plan Details
    </Typography>
    <Grid container spacing={2}>
      <Grid size={{ xs: 12, md: 6 }}>
        <ControlledTextField
          label="Plan name *"
          name={getFieldName(namePrefix, 'name')}
          fullWidth
        />
      </Grid>
      <Grid size={{ xs: 12, sm: 6, md: 3 }}>
        <ControlledSelectField
          label="Tier *"
          name={getFieldName(namePrefix, 'tier')}
          options={PLAN_TIER_OPTIONS}
          fullWidth
        />
      </Grid>
      <Grid size={{ xs: 12, sm: 6, md: 3 }}>
        <ControlledSelectField
          label="Room and board *"
          name={getFieldName(namePrefix, 'roomType')}
          options={ROOM_TYPE_OPTIONS}
          fullWidth
        />
      </Grid>
    </Grid>
  </Stack>
);
