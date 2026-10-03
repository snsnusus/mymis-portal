import { type ReactElement } from 'react';
import { Box, Card, CardContent, Stack, Typography } from '@mui/material';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';

export interface Scope {
  title: string;
  desc: string;
}

export const MandateCard = ({ scopes }: { scopes: Scope[] }): ReactElement => (
  <Card variant="outlined" sx={{ borderRadius: 3, height: '100%' }}>
    <CardContent>
      <Typography variant="h6" sx={{ fontWeight: 700 }}>
        Operational Mandate
      </Typography>
      <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
        Core responsibilities and scope of this department.
      </Typography>

      {scopes.length === 0 ? (
        <Typography variant="body2" color="text.secondary">
          No responsibilities defined yet.
        </Typography>
      ) : (
        <Stack sx={{ gap: 2 }}>
          {scopes.map((scope) => (
            <Stack
              key={scope.title}
              sx={{ flexDirection: 'row', gap: 1.5, alignItems: 'flex-start' }}
            >
              <CheckCircleIcon color="primary" sx={{ mt: 0.25 }} />
              <Box>
                <Typography variant="body1" sx={{ fontWeight: 600 }}>
                  {scope.title}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {scope.desc}
                </Typography>
              </Box>
            </Stack>
          ))}
        </Stack>
      )}
    </CardContent>
  </Card>
);
