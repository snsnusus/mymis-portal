import { type ReactElement } from 'react';
import { Box, Card, CardContent, Stack, Typography } from '@mui/material';
import AccountBalanceIcon from '@mui/icons-material/AccountBalance';

export const AccountingCard = ({
  costCenterCode,
}: {
  costCenterCode: string | null;
}): ReactElement => (
  <Card variant="outlined" sx={{ borderRadius: 3 }}>
    <CardContent>
      <Stack sx={{ flexDirection: 'row', gap: 1, alignItems: 'center', mb: 2 }}>
        <AccountBalanceIcon color="primary" />
        <Typography variant="h6" sx={{ fontWeight: 700 }}>
          Corporate Accounting Ledger
        </Typography>
      </Stack>
      <Box>
        <Typography
          variant="caption"
          color="text.secondary"
          sx={{ display: 'block', fontWeight: 600, textTransform: 'uppercase' }}
        >
          Cost Center Code
        </Typography>
        <Typography
          variant="body1"
          sx={{
            fontFamily: 'monospace',
            fontWeight: 600,
            color: costCenterCode ? 'text.primary' : 'text.secondary',
          }}
        >
          {costCenterCode ?? 'Not assigned'}
        </Typography>
      </Box>
    </CardContent>
  </Card>
);
