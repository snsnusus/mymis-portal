import { useState, type ReactElement } from 'react';
import { useSearchParams } from 'react-router-dom';
import {
  Box,
  Button,
  Card,
  CardContent,
  CircularProgress,
  IconButton,
  ListItemIcon,
  ListItemText,
  Menu,
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
import DeleteIcon from '@mui/icons-material/Delete';
import DensityMediumIcon from '@mui/icons-material/DensityMedium';
import DensitySmallIcon from '@mui/icons-material/DensitySmall';
import EditOutlinedIcon from '@mui/icons-material/EditOutlined';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import UploadFileIcon from '@mui/icons-material/UploadFile';
import {
  useGetAll,
  useCreateOrUpdate,
  useBulkCreate,
} from '~/queries/city.query';
import { useGetAll as useGetRegions } from '~/queries/region.query';
import { usePagination } from '~/hooks/use-pagination';
import type { City } from '~/models/city.model';
import type { Region } from '~/models/region.model';
import CityFormDialog from './city-form-dialog';
import { type CityFormValues } from '~/schema/city.schema';
import BulkUploadDialog from '~/components/bulk-upload-dialog';

const COLUMN_COUNT = 3;

const CITY_EXAMPLE = `[
  { "name": "Quezon City", "psgcCode": "137404000" },
  { "name": "Makati", "psgcCode": "137602000" }
]`;

const CityRowActions = ({
  city,
  onEdit,
}: {
  city: City;
  onEdit: (city: City) => void;
}): ReactElement => {
  const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null);
  const menuOpen = Boolean(anchorEl);

  const handleEdit = (): void => {
    setAnchorEl(null);
    onEdit(city);
  };

  return (
    <>
      <IconButton
        size="small"
        aria-label={`Actions for ${city.name}`}
        aria-haspopup="menu"
        aria-expanded={menuOpen}
        onClick={(event) => setAnchorEl(event.currentTarget)}
      >
        <MoreVertIcon fontSize="small" />
      </IconButton>
      <Menu
        anchorEl={anchorEl}
        open={menuOpen}
        onClose={() => setAnchorEl(null)}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
        transformOrigin={{ vertical: 'top', horizontal: 'right' }}
      >
        <MenuItem onClick={handleEdit}>
          <ListItemIcon>
            <EditOutlinedIcon fontSize="small" />
          </ListItemIcon>
          <ListItemText>Edit</ListItemText>
        </MenuItem>
        {/* Enabled once a delete confirmation is built */}
        <MenuItem disabled>
          <ListItemIcon>
            <DeleteIcon fontSize="small" />
          </ListItemIcon>
          <ListItemText>Delete</ListItemText>
        </MenuItem>
      </Menu>
    </>
  );
};

const CitiesTable = ({
  region,
  size,
  onEdit,
}: {
  region: Region;
  size: TableProps['size'];
  onEdit: (city: City) => void;
}): ReactElement => {
  const { data: cities, isLoading } = useGetAll(region.id);
  const pagination = usePagination(cities);

  return (
    <TableContainer component={Paper} variant="outlined">
      <Table size={size}>
        <TableHead>
          <TableRow>
            <TableCell>Name</TableCell>
            <TableCell>PSGC Code</TableCell>
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
                  No cities in {region.name} yet. Add one or use bulk upload.
                </Typography>
              </TableCell>
            </TableRow>
          )}
          {pagination.pageItems.map((city) => (
            <TableRow key={city.id} hover>
              <TableCell>{city.name}</TableCell>
              <TableCell>{city.psgcCode ?? '—'}</TableCell>
              <TableCell align="right">
                <CityRowActions city={city} onEdit={onEdit} />
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

const Cities = (): ReactElement => {
  const [searchParams, setSearchParams] = useSearchParams();
  const { data: regions = [], isLoading: regionsLoading } = useGetRegions();

  const regionIdParam = Number(searchParams.get('regionId'));
  const selectedRegion: Region | undefined =
    regions.find((region) => region.id === regionIdParam) ?? regions[0];

  const saveCity = useCreateOrUpdate();
  const bulkUpload = useBulkCreate(selectedRegion?.id);

  const [bulkOpen, setBulkOpen] = useState(false);
  const [tableSize, setTableSize] = useState<TableProps['size']>('small');
  const [formOpen, setFormOpen] = useState(false);
  const [editingCity, setEditingCity] = useState<City | null>(null);

  const isCompact = tableSize === 'small';

  const selectRegion = (regionId: number): void => {
    setSearchParams({ regionId: String(regionId) });
  };

  const openForm = (city: City | null): void => {
    saveCity.reset();
    setEditingCity(city);
    setFormOpen(true);
  };

  const openBulkUpload = (): void => {
    bulkUpload.reset();
    setBulkOpen(true);
  };

  const handleSubmit = (values: CityFormValues): void => {
    saveCity.mutate(
      {
        id: editingCity?.id ?? null,
        payload: {
          name: values.name,
          psgcCode: values.psgcCode || null,
          regionId: values.regionId,
        },
      },
      {
        onSuccess: () => {
          setFormOpen(false);
          // If the city was saved to a different region, follow it there.
          if (values.regionId !== selectedRegion?.id) {
            selectRegion(values.regionId);
          }
        },
      }
    );
  };

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
          <Typography sx={{ fontWeight: 600 }}>Cities</Typography>
          <Typography variant="caption" color="text.secondary">
            Cities and municipalities, grouped by region.
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
          {/* Opens the bulk upload modal for selectedRegion (next step) */}
          <Button
            variant="outlined"
            size="small"
            startIcon={<UploadFileIcon />}
            onClick={openBulkUpload}
            disabled={!selectedRegion}
          >
            Bulk upload
          </Button>
          <Button
            variant="contained"
            size="small"
            startIcon={<AddIcon />}
            onClick={() => openForm(null)}
            disabled={!selectedRegion}
          >
            Add city
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
          <TextField
            select
            size="small"
            label="Region"
            value={selectedRegion?.id ?? ''}
            onChange={(event) => selectRegion(Number(event.target.value))}
            disabled={regions.length === 0}
            sx={{ maxWidth: 320 }}
          >
            {regions.map((region) => (
              <MenuItem key={region.id} value={region.id}>
                {region.name}
              </MenuItem>
            ))}
          </TextField>

          {regionsLoading && (
            <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
              <CircularProgress size={24} />
            </Box>
          )}

          {!regionsLoading && !selectedRegion && (
            <Typography
              variant="body2"
              color="text.secondary"
              sx={{ py: 4, textAlign: 'center' }}
            >
              No regions yet. Add a region first, then come back to add its
              cities.
            </Typography>
          )}

          {selectedRegion && (
            <CitiesTable
              key={selectedRegion.id}
              region={selectedRegion}
              size={tableSize}
              onEdit={openForm}
            />
          )}
        </Stack>
      </CardContent>

      <CityFormDialog
        open={formOpen}
        city={editingCity}
        regions={regions}
        defaultRegionId={selectedRegion?.id}
        isSaving={saveCity.isPending}
        errorMessage={saveCity.error?.message ?? null}
        onClose={() => setFormOpen(false)}
        onSubmit={handleSubmit}
      />
      <BulkUploadDialog
        open={bulkOpen}
        title="Bulk Upload: Cities"
        context={
          selectedRegion
            ? `Cities will be added to ${selectedRegion.name}.`
            : undefined
        }
        instructions="Each row needs a name. psgcCode is optional. Don't include a regionId: every row goes to the region above. Cities whose name already exists in this region are skipped."
        example={CITY_EXAMPLE}
        mutation={bulkUpload}
        onClose={() => setBulkOpen(false)}
      />
    </Card>
  );
};

export default Cities;
