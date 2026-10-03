import { type ReactElement } from 'react';
import {
  Card,
  CardContent,
  Chip,
  List,
  ListItem,
  ListItemText,
  Skeleton,
  Stack,
  Typography,
} from '@mui/material';
import { useGetAll } from '~/queries/position.query';

export const PositionsCard = ({
  departmentId,
}: {
  departmentId: number;
}): ReactElement => {
  const { data: positions = [], isLoading, isError } = useGetAll(departmentId);

  return (
    <Card variant="outlined" sx={{ borderRadius: 3 }}>
      <CardContent>
        <Typography variant="h6" sx={{ fontWeight: 700 }}>
          Positions
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
          Roles defined for this department, in display order.
        </Typography>

        {isLoading && <Skeleton variant="rounded" height={120} />}

        {isError && (
          <Typography variant="body2" color="error">
            Couldn&apos;t load positions.
          </Typography>
        )}

        {!isLoading && !isError && positions.length === 0 && (
          <Typography variant="body2" color="text.secondary">
            No positions defined yet.
          </Typography>
        )}

        {positions.length > 0 && (
          <List disablePadding>
            {positions.map((position) => (
              <ListItem
                key={position.id}
                divider
                disableGutters
                secondaryAction={
                  <Stack sx={{ flexDirection: 'row', gap: 0.5 }}>
                    {position.isApprover && (
                      <Chip size="small" label="Approver" color="secondary" />
                    )}
                    {!position.isActive && (
                      <Chip size="small" label="Inactive" variant="outlined" />
                    )}
                  </Stack>
                }
              >
                <ListItemText
                  primary={position.title}
                  secondary={position.description}
                />
              </ListItem>
            ))}
          </List>
        )}
      </CardContent>
    </Card>
  );
};
