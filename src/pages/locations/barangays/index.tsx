import { useState, type ReactElement } from 'react';
import { useSearchParams } from 'react-router-dom';
import {
  Box,
  Button,
  Card,
  CardContent,
  CircularProgress,
  IconButton,
  MenuItem,
  Paper,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TablePagination,
  TableRow,
  TextField,
  Tooltip,
  Typography,
  type TableProps,
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import DensityMediumIcon from '@mui/icons-material/DensityMedium';
import DensitySmallIcon from '@mui/icons-material/DensitySmall';
import UploadFileIcon from '@mui/icons-material/UploadFile';
import { RowActionsMenu } from '~/components/row-actions-menu';
import {
  useGetAll,
  useCreateOrUpdate,
  useBulkCreate,
} from '~/queries/barangay.query';
import { useGetAll as useGetCities } from '~/queries/city.query';
import { useGetAll as useGetRegions } from '~/queries/region.query';
import { usePagination } from '~/hooks/use-pagination';
import type { Barangay } from '~/models/barangay.model';
import type { City } from '~/models/city.model';
import type { Region } from '~/models/region.model';
import BarangayFormDialog from './barangay-form-dialog';
import { type BarangayFormValues } from '~/schema/barangay.schema';
import BulkUploadDialog from '~/components/bulk-upload-dialog';

const COLUMN_COUNT = 4;

const BARANGAY_EXAMPLE = `[
  { "name": "Commonwealth", "zipCode": "1121" },
  { "name": "Bagong Pag-asa", "zipCode": "1105" }
]`;

const BarangaysTable = ({
  city,
  size,
  onEdit,
}: {
  city: City;
  size: TableProps['size'];
  onEdit: (barangay: Barangay) => void;
}): ReactElement => {
  const { data: barangays, isLoading } = useGetAll(city.id);
  const pagination = usePagination(barangays);

  return (
    <TableContainer component={Paper} variant="outlined">
      <Table size={size}>
        <TableHead>
          <TableRow>
            <TableCell>Name</TableCell>
            <TableCell>PSGC Code</TableCell>
            <TableCell>ZIP Code</TableCell>
            <TableCell align="right" width={56} />
          </TableRow>
        </TableHead>
        <TableBody>
          {isLoading && (
            <TableRow>
              <TableCell colSpan={COLUMN_COUNT} align="center" sx={{ py: 4 }}>
                <CircularProgress size={24} />
              </TableCell>
            </TableRow>
          )}
          {!isLoading && pagination.count === 0 && (
            <TableRow>
              <TableCell colSpan={COLUMN_COUNT} align="center" sx={{ py: 4 }}>
                <Typography variant="body2" color="text.secondary">
                  No barangays in {city.name} yet. Add one or use bulk upload.
                </Typography>
              </TableCell>
            </TableRow>
          )}
          {pagination.pageItems.map((barangay) => (
            <TableRow key={barangay.id} hover>
              <TableCell>{barangay.name}</TableCell>
              <TableCell>{barangay.psgcCode ?? '—'}</TableCell>
              <TableCell>{barangay.zipCode ?? '—'}</TableCell>
              <TableCell align="right">
                <RowActionsMenu
                  itemLabel={barangay.name}
                  onEdit={() => onEdit(barangay)}
                />
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
      <TablePagination
        component="div"
        count={pagination.count}
        page={pagination.page}
        rowsPerPage={pagination.rowsPerPage}
        rowsPerPageOptions={[5, 10, 25]}
        onPageChange={pagination.onPageChange}
        onRowsPerPageChange={pagination.onRowsPerPageChange}
      />
    </TableContainer>
  );
};

const Barangays = (): ReactElement => {
  const [bulkOpen, setBulkOpen] = useState(false);
  const [tableSize, setTableSize] = useState<TableProps['size']>('small');
  const [formOpen, setFormOpen] = useState(false);
  const [editingBarangay, setEditingBarangay] = useState<Barangay | null>(null);
  const [searchParams, setSearchParams] = useSearchParams();

  // Level 1: region (from ?regionId=, falls back to the first region)
  const { data: regions = [], isLoading: regionsLoading } = useGetRegions();
  const regionIdParam = Number(searchParams.get('regionId'));
  const selectedRegion: Region | undefined =
    regions.find((region) => region.id === regionIdParam) ?? regions[0];

  // Level 2: city (from ?cityId=, falls back to the region's first city)
  const { data: cities = [], isInitialLoading: citiesLoading } = useGetCities(
    selectedRegion?.id
  );
  const cityIdParam = Number(searchParams.get('cityId'));
  const selectedCity: City | undefined =
    cities.find((city) => city.id === cityIdParam) ?? cities[0];
  const bulkUpload = useBulkCreate(selectedCity?.id);

  const saveBarangay = useCreateOrUpdate();

  const isCompact = tableSize === 'small';

  // Changing the region drops cityId, so the new region's first city is used.
  const selectRegion = (regionId: number): void => {
    setSearchParams({ regionId: String(regionId) });
  };

  const selectCity = (cityId: number): void => {
    if (!selectedRegion) {
      return;
    }
    setSearchParams({
      regionId: String(selectedRegion.id),
      cityId: String(cityId),
    });
  };

  const openForm = (barangay: Barangay | null): void => {
    saveBarangay.reset();
    setEditingBarangay(barangay);
    setFormOpen(true);
  };

  const openBulkUpload = (): void => {
    bulkUpload.reset();
    setBulkOpen(true);
  };

  const handleSubmit = (values: BarangayFormValues): void => {
    saveBarangay.mutate(
      {
        id: editingBarangay?.id ?? null,
        payload: {
          name: values.name,
          psgcCode: values.psgcCode || null,
          zipCode: values.zipCode || null,
          cityId: values.cityId,
        },
      },
      {
        onSuccess: () => {
          setFormOpen(false);
          // If the barangay moved to another city, follow it there.
          if (values.cityId !== selectedCity?.id) {
            selectCity(values.cityId);
          }
        },
      }
    );
  };

  const isFilterLoading = regionsLoading || citiesLoading;

  return (
    <Card variant="outlined">
      <Stack
        direction="row"
        sx={{
          p: 2,
          gap: 2,
          alignItems: 'center',
          flexWrap: 'wrap',
          borderBottom: '1px solid',
          borderColor: 'divider',
        }}
      >
        <Box>
          <Typography sx={{ fontWeight: 600 }}>Barangays</Typography>
          <Typography variant="caption" color="text.secondary">
            Barangays, grouped by city.
          </Typography>
        </Box>
        <Stack direction="row" sx={{ gap: 1, alignItems: 'center' }}>
          <Tooltip title={isCompact ? 'Comfortable rows' : 'Compact rows'}>
            <IconButton
              size="small"
              aria-label={
                isCompact
                  ? 'Switch to comfortable rows'
                  : 'Switch to compact rows'
              }
              onClick={() => setTableSize(isCompact ? 'medium' : 'small')}
            >
              {isCompact ? (
                <DensityMediumIcon fontSize="small" />
              ) : (
                <DensitySmallIcon fontSize="small" />
              )}
            </IconButton>
          </Tooltip>
          {/* Opens the bulk upload modal for selectedCity (next step) */}
          <Button
            variant="outlined"
            size="small"
            startIcon={<UploadFileIcon />}
            onClick={openBulkUpload}
            disabled={!selectedCity}
          >
            Bulk upload
          </Button>
          <Button
            variant="contained"
            size="small"
            startIcon={<AddIcon />}
            onClick={() => openForm(null)}
            disabled={!selectedCity}
          >
            Add barangay
          </Button>
        </Stack>
      </Stack>

      <CardContent
        sx={{
          p: 2,
          '&.MuiCardContent-root:last-child': { paddingBottom: 2 },
        }}
      >
        <Stack sx={{ gap: 2 }}>
          <Stack direction="row" sx={{ gap: 2, flexWrap: 'wrap' }}>
            <TextField
              select
              size="small"
              label="Region"
              value={selectedRegion?.id ?? ''}
              onChange={(event) => selectRegion(Number(event.target.value))}
              disabled={regions.length === 0}
              sx={{ minWidth: 240 }}
            >
              {regions.map((region) => (
                <MenuItem key={region.id} value={region.id}>
                  {region.name}
                </MenuItem>
              ))}
            </TextField>
            <TextField
              select
              size="small"
              label="City"
              value={selectedCity?.id ?? ''}
              onChange={(event) => selectCity(Number(event.target.value))}
              disabled={cities.length === 0}
              sx={{ minWidth: 240 }}
            >
              {cities.map((city) => (
                <MenuItem key={city.id} value={city.id}>
                  {city.name}
                </MenuItem>
              ))}
            </TextField>
          </Stack>

          {isFilterLoading && (
            <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
              <CircularProgress size={24} />
            </Box>
          )}

          {!isFilterLoading && !selectedRegion && (
            <Typography
              variant="body2"
              color="text.secondary"
              sx={{ py: 4, textAlign: 'center' }}
            >
              No regions yet. Add a region and its cities first.
            </Typography>
          )}

          {!isFilterLoading && selectedRegion && !selectedCity && (
            <Typography
              variant="body2"
              color="text.secondary"
              sx={{ py: 4, textAlign: 'center' }}
            >
              No cities in {selectedRegion.name} yet. Add cities first, then
              come back to add barangays.
            </Typography>
          )}

          {selectedCity && (
            <BarangaysTable
              key={selectedCity.id}
              city={selectedCity}
              size={tableSize}
              onEdit={openForm}
            />
          )}
        </Stack>
      </CardContent>

      <BarangayFormDialog
        open={formOpen}
        barangay={editingBarangay}
        cities={cities}
        regionName={selectedRegion?.name ?? ''}
        defaultCityId={selectedCity?.id}
        isSaving={saveBarangay.isPending}
        errorMessage={saveBarangay.error?.message ?? null}
        onClose={() => setFormOpen(false)}
        onSubmit={handleSubmit}
      />
      <BulkUploadDialog
        open={bulkOpen}
        title="Bulk Upload: Barangays"
        context={
          selectedCity && selectedRegion
            ? `Barangays will be added to ${selectedCity.name}, ${selectedRegion.name}.`
            : undefined
        }
        instructions="Each row needs a name. psgcCode and zipCode are optional. Don't include a cityId: every row goes to the city above. Barangays whose name already exists in this city are skipped."
        example={BARANGAY_EXAMPLE}
        mutation={bulkUpload}
        onClose={() => setBulkOpen(false)}
      />
    </Card>
  );
};

export default Barangays;
