import { useState, type ReactElement } from 'react';
import { Link as RouterLink } from 'react-router-dom';
import {
  Alert,
  Box,
  Chip,
  Link,
  Paper,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
} from '@mui/material';

import { RowActionsMenu } from '~/components/row-actions-menu';
import { type HmoProvider } from '~/models/hmo.model';
import { useGetHmoProviders } from '~/queries/hmo.query';
import { formatDateOnly } from '~/utils/date.util';
import { getApiErrorMessage } from '~/utils/http.util';

import { HmoProviderFormDialog } from '../provider-form-dialog';
import { HMO_PATHS } from '../paths';

const COLUMN_COUNT = 5;

const HmoProviderList = (): ReactElement => {
  const {
    data: providers = [],
    isLoading,
    isError,
    error,
  } = useGetHmoProviders();

  const [formOpen, setFormOpen] = useState(false);
  const [editingProvider, setEditingProvider] = useState<HmoProvider | null>(
    null
  );

  const openForm = (provider: HmoProvider | null): void => {
    setEditingProvider(provider);
    setFormOpen(true);
  };

  const handleSaved = (): void => {
    setFormOpen(false);
  };

  return (
    <Stack spacing={2}>
      <Box>
        <Typography variant="h6">HMO Providers</Typography>
        <Typography variant="subtitle1" color="text.secondary">
          HMO companies the organization contracts with. Open a provider to
          manage its plans.
        </Typography>
      </Box>

      {isError && <Alert severity="error">{getApiErrorMessage(error)}</Alert>}

      <TableContainer component={Paper} variant="outlined">
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Code</TableCell>
              <TableCell>Name</TableCell>
              <TableCell>Contract period</TableCell>
              <TableCell>Status</TableCell>
              <TableCell align="right" aria-label="Actions" />
            </TableRow>
          </TableHead>
          <TableBody>
            {isLoading && (
              <TableRow>
                <TableCell colSpan={COLUMN_COUNT}>
                  <Typography color="text.secondary">
                    Loading providers…
                  </Typography>
                </TableCell>
              </TableRow>
            )}

            {!isLoading && !isError && providers.length === 0 && (
              <TableRow>
                <TableCell colSpan={COLUMN_COUNT}>
                  <Typography color="text.secondary">
                    No HMO providers yet. Add the HMO companies your
                    organization contracts with.
                  </Typography>
                </TableCell>
              </TableRow>
            )}

            {providers.map((provider) => (
              <TableRow key={provider.id} hover>
                <TableCell>{provider.code}</TableCell>
                <TableCell>
                  <Link
                    component={RouterLink}
                    to={HMO_PATHS.provider(provider.id)}
                    underline="hover"
                  >
                    {provider.name}
                  </Link>
                </TableCell>
                <TableCell>
                  {formatDateOnly(provider.contractStartDate)} –{' '}
                  {formatDateOnly(provider.contractEndDate)}
                </TableCell>
                <TableCell>
                  <Chip
                    size="small"
                    variant="outlined"
                    label={provider.isActive ? 'Active' : 'Inactive'}
                    color={provider.isActive ? 'success' : 'default'}
                  />
                </TableCell>
                <TableCell align="right">
                  <RowActionsMenu
                    itemLabel={provider.name}
                    onEdit={() => openForm(provider)}
                  />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      {editingProvider && (
        <HmoProviderFormDialog
          open={formOpen}
          provider={editingProvider}
          onClose={() => setFormOpen(false)}
          onSaved={handleSaved}
        />
      )}
    </Stack>
  );
};

export default HmoProviderList;
