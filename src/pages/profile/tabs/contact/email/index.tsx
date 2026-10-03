import { type ReactElement } from 'react';
import { Chip, Stack, Typography } from '@mui/material';
import { DataDisplayRow } from '~/components/ui/data-display-row';
import AddEmailDrawer from '~/components/modules/add-email-drawer';

const Email = (): ReactElement => (
  <DataDisplayRow
    label="Email"
    action={
      <Stack
        direction="row"
        sx={{
          gap: 1,
          justifyContent: 'flex-end',
        }}
      >
        <AddEmailDrawer onSave={(data) => console.log(data)} />
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
        <Typography variant="body2" sx={{ minWidth: 170 }}>
          pvargas@gmail.com
        </Typography>
        <Stack
          direction="row"
          spacing={0.5}
          sx={{
            alignItems: 'center',
          }}
        >
          <Chip label="Personal" color="secondary" size="small" />
        </Stack>
      </Stack>
      <Stack
        direction="row"
        spacing={1.5}
        sx={{
          alignItems: 'center',
        }}
      >
        <Typography variant="body2" sx={{ minWidth: 170 }}>
          peyvargas@sourcefit.net
        </Typography>
        <Stack
          direction="row"
          spacing={0.5}
          sx={{
            alignItems: 'center',
          }}
        >
          <Chip label="Corporate" color="secondary" size="small" />
          <Chip label="Primary" color="primary" size="small" />
        </Stack>
      </Stack>
    </Stack>
  </DataDisplayRow>
);

export default Email;
