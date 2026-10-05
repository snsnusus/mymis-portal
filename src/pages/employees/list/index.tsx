import { useState, type ReactElement } from 'react';
import { Link as RouterLink } from 'react-router-dom';
import {
  Box,
  Button,
  Card,
  CardContent,
  IconButton,
  InputAdornment,
  Stack,
  TextField,
  Tooltip,
  Typography,
  type TableProps,
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import DensityMediumIcon from '@mui/icons-material/DensityMedium';
import DensitySmallIcon from '@mui/icons-material/DensitySmall';
import SearchIcon from '@mui/icons-material/Search';
import { DataTable } from '~/components/table/data-table';
import { useDebouncedValue } from '~/hooks/use-debounced-value';
import { useGetEmployeesPaged } from '~/queries/employee.query';
import { employeeColumns, getEmployeeRowId } from './employee-columns';

const DEFAULT_PAGE_SIZE = 20;

const EmployeeList = (): ReactElement => {
  const [tableSize, setTableSize] = useState<TableProps['size']>('medium');
  const isCompact = tableSize === 'small';

  const [search, setSearch] = useState('');
  const [pageIndex, setPageIndex] = useState(0);
  const [pageSize, setPageSize] = useState(DEFAULT_PAGE_SIZE);

  const debouncedSearch = useDebouncedValue(search.trim(), 300);

  // When the search changes, go back to the first page. Done during render
  // (not in a useEffect) so no request is sent for the old page number.
  const [lastSearch, setLastSearch] = useState(debouncedSearch);
  if (debouncedSearch !== lastSearch) {
    setLastSearch(debouncedSearch);
    setPageIndex(0);
  }

  const {
    data: result,
    isLoading,
    isFetching,
    isError,
  } = useGetEmployeesPaged({ pageIndex, pageSize, search: debouncedSearch });

  return (
    <Stack sx={{ gap: 2 }}>
      <Box>
        <Typography variant="h6">Employees</Typography>
        <Typography variant="subtitle1" color="text.secondary">
          Everyone in the organization. Search by name or employee code.
        </Typography>
      </Box>
      <Card variant="outlined">
        <Stack
          sx={{
            p: 2,
            gap: 2,
            flexDirection: 'row',
            flexWrap: 'wrap',
            justifyContent: 'flex-end',
            alignItems: 'center',
            borderBottom: '1px solid',
            borderColor: 'divider',
          }}
        >
          <TextField
            size="small"
            placeholder="Search by name or employee code"
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            sx={{ width: 360 }}
            slotProps={{
              input: {
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon fontSize="small" />
                  </InputAdornment>
                ),
              },
              htmlInput: { 'aria-label': 'Search employees' },
            }}
          />
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
        </Stack>

        <CardContent
          sx={{
            p: 2,
            '&.MuiCardContent-root:last-child': { paddingBottom: 2 },
          }}
        >
          <Stack sx={{ gap: 2 }}>
            <DataTable
              data={result?.data}
              columns={employeeColumns}
              getRowId={getEmployeeRowId}
              size={tableSize}
              isLoading={isLoading}
              isFetching={isFetching}
              isError={isError}
              emptyMessage={
                debouncedSearch
                  ? `No employees match "${debouncedSearch}".`
                  : 'No employees yet.'
              }
              pagination={{
                pageIndex,
                pageSize,
                totalCount: result?.totalCount ?? 0,
                onChange: (newPageIndex, newPageSize) => {
                  setPageIndex(newPageIndex);
                  setPageSize(newPageSize);
                },
              }}
            />
          </Stack>
        </CardContent>
      </Card>
    </Stack>
  );
};

export default EmployeeList;
