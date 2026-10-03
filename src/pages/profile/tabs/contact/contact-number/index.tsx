import { type ReactElement } from 'react';
import { Chip, Stack, Typography } from '@mui/material';
import { ReactCountryFlag } from 'react-country-flag';
import { DataDisplayRow } from '~/components/ui/data-display-row';
import AddNewContactNumberDrawer from '~/components/modules/add-contact-number-drawer';

const ContactNumber = (): ReactElement => (
  <DataDisplayRow
    label="Contact Number"
    action={
      <Stack
        direction="row"
        sx={{
          gap: 1,
          justifyContent: 'flex-end',
        }}
      >
        <AddNewContactNumberDrawer onSave={() => {}} />
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
        <ReactCountryFlag countryCode="PH" svg />
        <Typography variant="body2" sx={{ minWidth: 130 }}>
          (+63) 936 544 9043
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
      <Stack
        direction="row"
        spacing={1.5}
        sx={{
          alignItems: 'center',
        }}
      >
        <ReactCountryFlag countryCode="PH" svg />
        <Typography variant="body2" sx={{ minWidth: 130 }}>
          (+63) 999 861 3794
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
    </Stack>
  </DataDisplayRow>
);
export default ContactNumber;
