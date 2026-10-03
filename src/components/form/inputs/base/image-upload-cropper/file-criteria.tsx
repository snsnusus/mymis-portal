import { type ReactElement } from 'react';
import { Stack, Typography } from '@mui/material';
import CheckIcon from '@mui/icons-material/Check';
import FiberManualRecordIcon from '@mui/icons-material/FiberManualRecord';

const FileCriteria = ({ file }: { file: File | null }): ReactElement => {
  const isTypeValid = file
    ? ['image/jpeg', 'image/png'].includes(file.type)
    : false;
  const isSizeValid = file ? file.size <= 2 * 1024 * 1024 : false;

  return (
    <Stack spacing={1} sx={{ mt: 1, pl: 0.5 }}>
      <Stack
        direction="row"
        spacing={1}
        sx={{
          alignItems: 'center',
        }}
      >
        {isTypeValid ? (
          <CheckIcon color="success" sx={{ fontSize: 18 }} />
        ) : (
          <FiberManualRecordIcon
            color="action"
            sx={{ fontSize: 18, opacity: 0.6 }}
          />
        )}
        <Typography
          variant="body2"
          sx={{
            color: 'text.secondary',
            fontWeight: 400,
            transition: 'all 0.2s ease',
          }}
        >
          Accepted formats: <span style={{ fontWeight: 'bold' }}>JPEG</span> or{' '}
          <span style={{ fontWeight: 'bold' }}>PNG</span>
        </Typography>
      </Stack>
      <Stack
        direction="row"
        spacing={1}
        sx={{
          alignItems: 'center',
        }}
      >
        {isSizeValid ? (
          <CheckIcon color="success" sx={{ fontSize: 18 }} />
        ) : (
          <FiberManualRecordIcon
            color="action"
            sx={{ fontSize: 18, opacity: 0.6 }}
          />
        )}
        <Typography
          variant="body2"
          sx={{
            color: 'text.secondary',
            fontWeight: 400,
            transition: 'all 0.2s ease',
          }}
        >
          Maximum file size: <span style={{ fontWeight: 'bold' }}>5MB</span>
        </Typography>
      </Stack>
    </Stack>
  );
};

export default FileCriteria;
