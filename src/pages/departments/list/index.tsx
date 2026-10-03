import { type ReactElement, type MouseEvent } from 'react';
import { useSearchParams } from 'react-router-dom';
import {
  Box,
  Grid,
  LinearProgress,
  Stack,
  ToggleButton,
  ToggleButtonGroup,
  Tooltip,
  Typography,
} from '@mui/material';
import GridViewIcon from '@mui/icons-material/GridView';
import ViewListIcon from '@mui/icons-material/ViewList';
import { useGetAll as useGetDepartments } from '~/queries/department.query';
import { DepartmentCard } from './department-card';
import { DepartmentTable } from './department-table';

type ViewMode = 'grid' | 'table';

const Departments = (): ReactElement => {
  const { data: departments = [], isLoading, isError } = useGetDepartments();
  const [searchParams, setSearchParams] = useSearchParams();

  const view: ViewMode =
    searchParams.get('view') === 'table' ? 'table' : 'grid';

  const handleViewChange = (
    _event: MouseEvent<HTMLElement>,
    next: ViewMode | null
  ): void => {
    if (next === null) return;
    setSearchParams(next === 'grid' ? {} : { view: next }, { replace: true });
  };

  return (
    <Stack spacing={2}>
      <Stack
        direction="row"
        sx={{ justifyContent: 'space-between', alignItems: 'center' }}
      >
        <Box>
          <Typography variant="h5" sx={{ fontWeight: 700 }}>
            Departments
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Manage and view organizational business units
          </Typography>
        </Box>
        <ToggleButtonGroup
          value={view}
          exclusive
          onChange={handleViewChange}
          size="small"
          aria-label="View mode"
        >
          <Tooltip title="Card view">
            <ToggleButton value="grid" aria-label="Card view">
              <GridViewIcon fontSize="small" />
            </ToggleButton>
          </Tooltip>
          <Tooltip title="Table view">
            <ToggleButton value="table" aria-label="Table view">
              <ViewListIcon fontSize="small" />
            </ToggleButton>
          </Tooltip>
        </ToggleButtonGroup>
      </Stack>

      {isLoading && <LinearProgress />}

      {isError && (
        <Typography color="error">
          Couldn&apos;t load departments. Please try refreshing.
        </Typography>
      )}

      {!isLoading && !isError && departments.length === 0 && (
        <Typography color="text.secondary">No departments yet.</Typography>
      )}

      {departments.length > 0 &&
        (view === 'grid' ? (
          <Grid container spacing={2}>
            {departments.map((department) => (
              <Grid key={department.id} size={{ xs: 12, sm: 6, md: 4 }}>
                <DepartmentCard department={department} />
              </Grid>
            ))}
          </Grid>
        ) : (
          <DepartmentTable departments={departments} />
        ))}
    </Stack>
  );
};

export default Departments;
