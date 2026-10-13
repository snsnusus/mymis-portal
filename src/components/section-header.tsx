import { Box, Typography } from '@mui/material';
import { type ReactElement } from 'react';

interface SectionHeaderProps {
  /** Main title of the section. Rendered with the theme's `header` variant. */
  header: string;
  /** Optional supporting text shown under the header in a muted color. */
  subheader?: string;
}

/**
 * Title block at the top of a form section or page area.
 *
 * Use it once per section, for example at the top of each step in the
 * Employee Create wizard. For a smaller label with a divider line inside
 * a section, use `SectionLabel` instead.
 */
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
