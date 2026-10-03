import type { ReactElement } from 'react';

import { useFormContext } from 'react-hook-form';
import { useProfileStore } from '~/stores/profile';

import {
  Stack,
  Typography,
  IconButton,
  Box,
  Button,
  useTheme,
  useMediaQuery,
} from '@mui/material';

import EditIcon from '@mui/icons-material/Edit';

import moment from 'moment';
import { shallow } from 'zustand/shallow';

import { DataDisplayRow } from '~/components/ui/data-display-row';

export const Personal = (): ReactElement => {
  const theme = useTheme();
  const { getValues } = useFormContext();

  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  const {
    firstname,
    middlename,
    lastname,
    suffix,
    nickname,
    gender,
    birthdate,
    birthplace,
    nationality,
    maritalStatus,
  } = getValues();

  const { setCanEdit } = useProfileStore(
    (state) => ({
      setCanEdit: state.setCanEdit,
    }),
    shallow
  );

  return (
    <Stack
      spacing={2}
      sx={{
        padding: 2,
      }}
    >
      <Stack
        direction="row"
        sx={{
          alignItems: 'center',
        }}
      >
        <Typography
          variant="body1"
          color="text.muted"
          sx={{
            fontWeight: 'fontWeightMedium',
          }}
        >
          Personal Information
        </Typography>
        <Box sx={{ flexGrow: 1 }} />
        {isMobile ? (
          <IconButton
            size="small"
            color="primary"
            onClick={(e) => {
              e.preventDefault();

              setCanEdit(true);
            }}
            sx={{
              flexShrink: 0,
              border: '1px solid',
              borderColor: 'primary',
              backgroundColor: 'white',
            }}
          >
            <EditIcon fontSize="small" />
          </IconButton>
        ) : (
          <Button
            color="primary"
            variant="outlined"
            size="small"
            startIcon={<EditIcon fontSize="small" />}
            sx={{ selfAlign: 'flex-start', width: 'fit-content' }}
          >
            Request Update
          </Button>
        )}
      </Stack>
      <DataDisplayRow label="First Name">
        <Typography variant="body2">{firstname}</Typography>
      </DataDisplayRow>
      <DataDisplayRow label="Middle Name">
        <Typography variant="body2">{middlename}</Typography>
      </DataDisplayRow>
      <DataDisplayRow label="Last Name">
        <Typography variant="body2">{lastname}</Typography>
      </DataDisplayRow>
      <DataDisplayRow label="Suffix">
        <Typography variant="body2">{suffix ?? '-'}</Typography>
      </DataDisplayRow>
      <DataDisplayRow label="Nickname">
        <Typography variant="body2">{nickname}</Typography>
      </DataDisplayRow>
      <DataDisplayRow label="Gender">
        <Typography variant="body2">{gender}</Typography>
      </DataDisplayRow>
      <DataDisplayRow label="Birthdate">
        <Typography variant="body2">
          {birthdate ? moment(birthdate).format('MMMM DD, yyyy') : '-'}
        </Typography>
      </DataDisplayRow>
      <DataDisplayRow label="Place of Birth">
        <Typography variant="body2">{birthplace}</Typography>
      </DataDisplayRow>
      <DataDisplayRow label="Nationality">
        <Typography variant="body2">{nationality}</Typography>
      </DataDisplayRow>
      <DataDisplayRow label="Marital Status">
        <Typography variant="body2">{maritalStatus}</Typography>
      </DataDisplayRow>
    </Stack>
  );
};

export default Personal;
