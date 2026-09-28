import { type ReactElement } from 'react';
import { Box, Card, CardContent, Typography } from '@mui/material';

export const Coverage = (): ReactElement => (
  <Card variant="outlined">
    <Box
      sx={{
        p: 2,
        bgcolor: 'grey.50',
        borderBottom: '1px solid',
        borderColor: 'divider',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
      }}
    >
      <Box>
        <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
          Coverage Packages
        </Typography>
        <Typography variant="caption" color="text.secondary">
          Outline outpatient, inpatient, dental, and pre-existing condition
          benefits for this provider.
        </Typography>
      </Box>
    </Box>
    <CardContent />
  </Card>
);
