import type { FormValues } from '../..';
import { type ReactElement } from 'react';
import { useFieldArray, useFormContext } from 'react-hook-form';

import {
  Box,
  Grid,
  IconButton,
  Paper,
  Stack,
  Tooltip,
  Typography,
} from '@mui/material';
import PlaceIcon from '@mui/icons-material/Place';
import DeleteIcon from '@mui/icons-material/Delete';

import { SectionLabel } from '~/components/section-label';
import { AddAddressForm } from './add-address-form';

export const Addresses = (): ReactElement => {
  const { control } = useFormContext<FormValues>();
  const {
    fields: addresses,
    append,
    remove,
  } = useFieldArray({
    control,
    name: 'addresses',
  });

  return (
    <Stack sx={{ gap: 1 }}>
      <SectionLabel title="Addresses" />
      <Grid container spacing={2}>
        <Grid size={{ xs: 12, md: 6 }}>
          <Stack
            sx={{
              gap: 2,
            }}
          >
            {addresses.length > 0 ? (
              <Stack
                spacing={1}
                sx={{
                  flexWrap: 'wrap',
                  overflowY: 'auto',
                  maxHeight: 200,
                  scrollbarGutter: 'stable',
                }}
              >
                {addresses.map((address, index) => (
                  <Paper
                    key={address.id}
                    variant="outlined"
                    sx={{
                      p: 1.5,
                      display: 'flex',
                      alignItems: 'center',
                      gap: 1.5,
                      width: '100%',
                    }}
                  >
                    <PlaceIcon color="error" fontSize="large" />
                    <Box sx={{ flexGrow: 1, minWidth: 0 }}>
                      <Typography variant="body2" color="text.secondary">
                        Address {index + 1}
                      </Typography>
                      <Typography
                        variant="body1"
                        sx={{ overflowWrap: 'anywhere' }}
                      >
                        {address.formattedAddress}
                      </Typography>
                    </Box>
                    <Tooltip title="Remove Address" placement="top-start" arrow>
                      <IconButton
                        aria-label={`Remove address ${index + 1}`}
                        sx={{ '&:hover': { color: 'primary.main' } }}
                        onClick={() => remove(index)}
                      >
                        <DeleteIcon fontSize="medium" />
                      </IconButton>
                    </Tooltip>
                  </Paper>
                ))}
              </Stack>
            ) : (
              <Typography>No address added yet.</Typography>
            )}
          </Stack>
        </Grid>
        <Grid size={{ xs: 12, md: 6 }}>
          <AddAddressForm handleSubmit={(values) => append(values)} />
        </Grid>
      </Grid>
    </Stack>
  );
};
