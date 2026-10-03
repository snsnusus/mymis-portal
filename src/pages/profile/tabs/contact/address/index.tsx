import { type ReactElement } from 'react';

import { Chip, Stack, Typography } from '@mui/material';

import { AddAddressDrawer } from '~/components/modules/add-address-drawer';
import { DataDisplayRow } from '~/components/ui/data-display-row';

const Address = (): ReactElement => (
  <>
    <DataDisplayRow
      label="Address"
      action={
        <Stack
          direction="row"
          sx={{
            gap: 1,
            justifyContent: 'flex-end',
          }}
        >
          <AddAddressDrawer
            onSave={(payload) => console.log(payload, 'payload')}
          />
        </Stack>
      }
    >
      <Stack spacing={1.5}>
        <Stack
          direction="row"
          spacing={1.5}
          sx={{
            alignItems: 'center',
          }}
        >
          <Typography variant="body2">
            2574 B7 L4 SEPVHOAI, Daang Manunuso St., Ibayo-Tipas, Taguig, 1630
          </Typography>
        </Stack>
        <Stack
          direction="row"
          spacing={1.5}
          sx={{
            alignItems: 'center',
          }}
        >
          <Typography variant="body2">
            532 Mangga St., Napico, Manggahan, Pasig, 1605{' '}
          </Typography>
          <Chip label="Primary" color="primary" size="small" />
        </Stack>
      </Stack>
    </DataDisplayRow>
  </>
);

export default Address;
