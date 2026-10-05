import type { ChangeEvent, ReactElement, ReactNode } from 'react';
import type { DataTableProps } from './types';
import {
  flexRender,
  getCoreRowModel,
  useReactTable,
} from '@tanstack/react-table';
import {
  CircularProgress,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TablePagination,
  TableRow,
  Typography,
} from '@mui/material';

const ROWS_PER_PAGE_OPTIONS = [10, 20, 50];

// One shared empty array. Writing `data ?? []` inline would create a NEW
// array every render, which makes TanStack think the data changed.
const EMPTY_ROWS: never[] = [];

export const DataTable = <TData,>({
  data,
  columns,
  pagination,
  getRowId,
  isLoading = false,
  isFetching = false,
  isError = false,
  emptyMessage = 'No records found.',
  errorMessage = "Couldn't load data. Please try again.",
  size = 'medium',
}: DataTableProps<TData>): ReactElement => {
  const { pageIndex, pageSize, totalCount, onChange } = pagination;

  // Only the core row model: TanStack renders exactly the rows it's given.
  // No pagination row model, because the server already sent just one page.
  const table = useReactTable({
    data: data ?? EMPTY_ROWS,
    columns,
    getRowId,
    getCoreRowModel: getCoreRowModel(),
  });

  const rows = table.getRowModel().rows;
  const columnCount = table.getVisibleLeafColumns().length;

  const handlePageChange = (_event: unknown, newPageIndex: number): void => {
    onChange(newPageIndex, pageSize);
  };

  const handleRowsPerPageChange = (
    event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ): void => {
    // A new page size changes what "page 3" means, so go back to the first page.
    onChange(0, parseInt(event.target.value, 10));
  };

  // A single full-width row, used for the loading, error and empty states.
  const renderMessageRow = (content: ReactNode): ReactElement => (
    <TableRow>
      <TableCell colSpan={columnCount} align="center" sx={{ py: 6 }}>
        {content}
      </TableCell>
    </TableRow>
  );

  let body: ReactNode;
  if (isLoading && rows.length === 0) {
    body = renderMessageRow(<CircularProgress size={28} />);
  } else if (isError) {
    body = renderMessageRow(
      <Typography color="error">{errorMessage}</Typography>
    );
  } else if (rows.length === 0) {
    body = renderMessageRow(
      <Typography color="text.secondary">{emptyMessage}</Typography>
    );
  } else {
    body = rows.map((row) => (
      <TableRow key={row.id} hover>
        {row.getVisibleCells().map((cell) => (
          <TableCell key={cell.id}>
            {flexRender(cell.column.columnDef.cell, cell.getContext())}
          </TableCell>
        ))}
      </TableRow>
    ));
  }

  return (
    <Paper variant="outlined">
      <TableContainer>
        <Table size={size}>
          <TableHead>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <TableCell key={header.id} colSpan={header.colSpan}>
                    {header.isPlaceholder
                      ? null
                      : flexRender(
                          header.column.columnDef.header,
                          header.getContext()
                        )}
                  </TableCell>
                ))}
              </TableRow>
            ))}
          </TableHead>
          <TableBody
            sx={{
              opacity: isFetching && rows.length > 0 ? 0.6 : 1,
              transition: 'opacity 150ms',
            }}
          >
            {body}
          </TableBody>
        </Table>
      </TableContainer>
      <TablePagination
        component="div"
        count={totalCount}
        page={pageIndex}
        rowsPerPage={pageSize}
        rowsPerPageOptions={ROWS_PER_PAGE_OPTIONS}
        onPageChange={handlePageChange}
        onRowsPerPageChange={handleRowsPerPageChange}
      />
    </Paper>
  );
};
