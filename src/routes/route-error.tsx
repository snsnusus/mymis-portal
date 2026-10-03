import { type ReactElement } from 'react';
import { isRouteErrorResponse, useRouteError } from 'react-router-dom';
import { Box, Typography } from '@mui/material';
import NotFound from '~/pages/not-found';

export const RouteError = (): ReactElement => {
  const error = useRouteError();

  if (isRouteErrorResponse(error) && error.status === 404) {
    return <NotFound />;
  }

  const message = error instanceof Error ? error.message : String(error);

  return (
    <Box sx={{ py: 4 }}>
      <Typography variant="h6" sx={{ fontWeight: 700 }}>
        Something went wrong
      </Typography>
      <Typography variant="body2" color="text.secondary">
        Please refresh the page. If it keeps happening, contact support.
      </Typography>
      {import.meta.env.DEV && (
        <Typography
          component="pre"
          variant="body2"
          color="error"
          sx={{ mt: 2, whiteSpace: 'pre-wrap' }}
        >
          {message}
        </Typography>
      )}
    </Box>
  );
};
