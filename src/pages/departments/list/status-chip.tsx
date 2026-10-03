import { type ReactElement } from 'react';
import { Chip } from '@mui/material';

export const StatusChip = ({ status }: { status: string }): ReactElement => {
  const isActive = status.toLowerCase() === 'active';

  return (
    <Chip
      size="small"
      label={status}
      color={isActive ? 'success' : 'default'}
      variant={isActive ? 'filled' : 'outlined'}
      sx={{ textTransform: 'capitalize', fontWeight: 600 }}
    />
  );
};
