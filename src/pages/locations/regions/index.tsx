import { useState, type ReactElement } from 'react';
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
} from '~/queries/region.query';
import { usePagination } from '~/hooks/use-pagination';
import type { Region } from '~/models/region.model';
import RegionFormDialog from './region-form-dialog';
import { type RegionFormValues } from '~/schema/region.schema';
import BulkUploadDialog from '~/components/bulk-upload-dialog';

const COLUMN_COUNT = 3;

const REGION_EXAMPLE = `[
  { "name": "Metro Manila (NCR)", "psgcCode": "130000000" },
  { "name": "Cordillera Administrative Region (CAR)", "psgcCode": "140000000" }
]`;

const RegionRowActions = ({
  region,
  onEdit,
}: {
  region: Region;
  onEdit: (region: Region) => void;
}): ReactElement => {
  const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null);
  const menuOpen = Boolean(anchorEl);

  const handleEdit = (): void => {
    setAnchorEl(null);
    onEdit(region);
  };

  return (
    <>
      <IconButton
        size="small"
        aria-label={`Actions for ${region.name}`}
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

const Regions = (): ReactElement => {
  const [bulkOpen, setBulkOpen] = useState(false);

  const { data: regions, isLoading } = useGetAll();
  const bulkUpload = useBulkCreate();

  const pagination = usePagination(regions);
  const saveRegion = useCreateOrUpdate();

  const [tableSize, setTableSize] = useState<TableProps['size']>('small');
  const [formOpen, setFormOpen] = useState(false);
  const [editingRegion, setEditingRegion] = useState<Region | null>(null);

  const isCompact = tableSize === 'small';

  const openForm = (region: Region | null): void => {
    saveRegion.reset(); // clear any error from a previous attempt
    setEditingRegion(region);
    setFormOpen(true);
  };

  const openBulkUpload = (): void => {
    bulkUpload.reset(); // clear any result from a previous upload
    setBulkOpen(true);
  };

  const handleSubmit = (values: RegionFormValues): void => {
    saveRegion.mutate(
      {
        id: editingRegion?.id ?? null,
        payload: { name: values.name, psgcCode: values.psgcCode || null },
      },
      { onSuccess: () => setFormOpen(false) }
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
          <Typography sx={{ fontWeight: 600 }}>Regions</Typography>
          <Typography variant="caption" color="text.secondary">
            Subtitle here...
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
          {/* Opens the bulk upload modal (next step) */}
          <Button
            variant="outlined"
            size="small"
            startIcon={<UploadFileIcon />}
            onClick={openBulkUpload}
          >
            Bulk upload
          </Button>
          <Button
            variant="contained"
            size="small"
            startIcon={<AddIcon />}
            onClick={() => openForm(null)}
          >
            Add region
          </Button>
        </Stack>
      </Stack>

      <CardContent
        sx={{
          p: 2,
          '&.MuiCardContent-root:last-child': { paddingBottom: 2 },
        }}
      >
        <TableContainer component={Paper} variant="outlined">
          <Table size={tableSize}>
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
                  <TableCell
                    colSpan={COLUMN_COUNT}
                    align="center"
                    sx={{ py: 4 }}
                  >
                    <CircularProgress size={24} />
                  </TableCell>
                </TableRow>
              )}
              {!isLoading && pagination.count === 0 && (
                <TableRow>
                  <TableCell
                    colSpan={COLUMN_COUNT}
                    align="center"
                    sx={{ py: 4 }}
                  >
                    <Typography variant="body2" color="text.secondary">
                      No regions yet. Add one or use bulk upload.
                    </Typography>
                  </TableCell>
                </TableRow>
              )}
              {pagination.pageItems.map((region) => (
                <TableRow key={region.id} hover>
                  <TableCell>{region.name}</TableCell>
                  <TableCell>{region.psgcCode ?? '—'}</TableCell>
                  <TableCell align="right">
                    <RegionRowActions region={region} onEdit={openForm} />
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
      </CardContent>

      <RegionFormDialog
        open={formOpen}
        region={editingRegion}
        isSaving={saveRegion.isPending}
        errorMessage={saveRegion.error?.message ?? null}
        onClose={() => setFormOpen(false)}
        onSubmit={handleSubmit}
      />
      <BulkUploadDialog
        open={bulkOpen}
        title="Bulk Upload: Regions"
        instructions="Each row needs a name. psgcCode is optional. Regions whose name already exists are skipped."
        example={REGION_EXAMPLE}
        mutation={bulkUpload}
        onClose={() => setBulkOpen(false)}
      />
    </Card>
  );
};

export default Regions;
