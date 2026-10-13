import { type ReactNode, type ReactElement } from 'react';
import { Card as MuiCard, CardContent, Stack } from '@mui/material';

interface CardProps extends PropsWithChildren {
  header?: ReactNode;
}

export const Card = (props: CardProps): ReactElement => {
  const { header, children } = props;
  return (
    <MuiCard
      variant="outlined"
      sx={{
        borderRadius: '25px',
      }}
    >
      {header && (
        <Stack
          sx={{
            p: 2,
            borderBottom: '1px solid',
            borderColor: 'divider',
          }}
        >
          {header}
        </Stack>
      )}
      <CardContent>{children}</CardContent>
    </MuiCard>
  );
};
