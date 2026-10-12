import { Box, Typography } from '@mui/material';
import { type ReactElement } from 'react';

interface SectionHeaderProps {
  header: string;
  subheader?: string;
}

export const SectionHeader = (props: SectionHeaderProps): ReactElement => {
  const { header, subheader } = props;
  return (
    <Box>
      <Typography variant="header">{header}</Typography>
      {subheader && (
        <Typography variant="subheader" color="text.secondary">
          {subheader}
        </Typography>
      )}
    </Box>
  );
};
