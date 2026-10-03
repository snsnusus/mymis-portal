import { type ReactElement } from 'react';
import { Box, Stack, Typography } from '@mui/material';
import { ReactCountryFlag } from 'react-country-flag';
import { DataDisplayRow } from '~/components/ui/data-display-row';

const EmergencyContact = (): ReactElement => (
  <>
    <Stack
      direction="row"
      sx={{
        alignItems: 'center',
      }}
    >
      <Stack>
        <Typography
          variant="body1"
          sx={{ color: '#979797de', fontWeight: 'fontWeightMedium' }}
        >
          Emergency Contact
        </Typography>
      </Stack>
      <Box sx={{ flexGrow: 1 }} />
    </Stack>
    <DataDisplayRow label="Name">
      <Typography variant="body2">Maria Lourdes Vargas</Typography>
    </DataDisplayRow>
    <DataDisplayRow label="Relationship">
      <Typography variant="body2">Parent/Mother</Typography>
    </DataDisplayRow>
    <DataDisplayRow label="Contact Number">
      <Stack spacing={1.5}>
        <Stack
          direction="row"
          spacing={1.5}
          sx={{
            alignItems: 'center',
          }}
        >
          <ReactCountryFlag countryCode="PH" svg />
          <Typography variant="body2">(+639) 919 869 3717</Typography>
        </Stack>
        <Stack
          direction="row"
          spacing={1.5}
          sx={{
            alignItems: 'center',
          }}
        >
          <ReactCountryFlag countryCode="PH" svg />
          <Typography variant="body2">(+639) 936 544 9043</Typography>
        </Stack>
      </Stack>
    </DataDisplayRow>
    <DataDisplayRow label="Address">
      <Typography variant="body2">
        690 Mangga St., Napico, Manggahan, Pasig City
      </Typography>
    </DataDisplayRow>
  </>
);

export default EmergencyContact;
