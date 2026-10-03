import { Box, Typography } from '@mui/material';
import type { ReactElement } from 'react';

interface SectionLabelProps {
  title: string;
  caption?: string;
}

export const SectionLabel = ({
  title,
  caption,
}: SectionLabelProps): ReactElement => (
  <Box sx={{ mb: 2 }}>
    <Typography
      variant="body1"
      color="text.secondary"
      sx={{ fontWeight: 'fontWeightMedium', textTransform: 'uppercase' }}
    >
      {title}
    </Typography>
    {caption && (
      <Typography variant="caption" color="text.secondary">
        {caption}
      </Typography>
    )}
  </Box>
);
