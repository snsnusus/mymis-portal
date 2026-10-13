import { Divider, Stack, Typography } from '@mui/material';
import type { ReactElement } from 'react';

interface SectionLabelProps {
  title: string;
  caption?: string;
}

export const SectionLabel = ({
  title,
  caption,
}: SectionLabelProps): ReactElement => (
  <Stack direction="row" spacing={1.5} sx={{ alignItems: 'center' }}>
    <Typography
      variant="body1"
      component="h3"
      color="text.secondary"
      sx={{
        fontWeight: 'fontWeightMedium',
        textTransform: 'uppercase',
        letterSpacing: 0.5,
        flexShrink: 0,
      }}
    >
      {title}
    </Typography>
    {caption && (
      <Typography
        variant="caption"
        color="text.secondary"
        sx={{ flexShrink: 0 }}
      >
        {caption}
      </Typography>
    )}
    <Divider sx={{ flex: 1 }} />
  </Stack>
);
