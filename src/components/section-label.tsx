import { Divider, Stack, Typography } from '@mui/material';
import type { ReactElement } from 'react';

interface SectionLabelProps {
  /** Label text. Displayed in uppercase, muted color, with medium weight. */
  title: string;
  /** Optional supporting text shown below the title. Wraps if it's long. */
  caption?: string;
}

/**
 * Small uppercase label with a divider line that fills the remaining width,
 * plus an optional caption underneath.
 *
 * Use it inside a section to group related fields, for example
 * "Primary Address" or "Emergency Contact" within a form step.
 * For the title at the top of a section or page, use `SectionHeader` instead.
 */
export const SectionLabel = ({
  title,
  caption,
}: SectionLabelProps): ReactElement => (
  <Stack>
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
      <Divider sx={{ flex: 1 }} />
    </Stack>
    {caption && (
      <Typography variant="caption" color="text.secondary">
        {caption}
      </Typography>
    )}
  </Stack>
);
