import type { ReactElement, MouseEvent, ChangeEvent } from 'react';
import { Fragment, useEffect } from 'react';

import type { TableProps } from './types';

import Paper from '@mui/material/Paper';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TablePagination from '@mui/material/TablePagination';
import TableRow from '@mui/material/TableRow';
import Collapse from '@mui/material/Collapse';
import { flexRender } from '@tanstack/react-table';

import { useTable } from './hooks';
import TableHeader from './header';

export const ReactTable = <TData extends object>(
  props: TableProps<TData>
): ReactElement => {
  const {
    data,
    columns,
    enableRowSelection = false,
    enableColumnResizing = false,
    getRowSelection,
  } = props;

  const {
    getVisibleFlatColumns,
    getCenterTotalSize,
    getHeaderGroups,
    getRowModel,
    getState,
    setPageIndex,
    setPageSize,
    getSelectedRowModel,
  } = useTable({
    data,
    columns,
    enableRowSelection,
    enableColumnResizing,
  });

  const selectedFlatRows = getSelectedRowModel().flatRows.map(
    (row) => row.original
  );

  useEffect(() => {
    getRowSelection?.(selectedFlatRows);
  }, [selectedFlatRows, getRowSelection]);

  const handlePageChange = (
    _evt: MouseEvent<HTMLButtonElement> | null,
    currentPage: number
  ): void => {
    setPageIndex(currentPage);
  };

  const handleRowsPerPageChange = (
    evt: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ): void => {
    setPageSize(parseInt(evt.target.value, 10));
    setPageIndex(0);
  };

  return (
    <>
      <TableContainer component={Paper}>
        <Table
          sx={{
            width: getCenterTotalSize(),
            minWidth: '100%',
          }}
        >
          <TableHeader headerGroups={getHeaderGroups()} getState={getState} />
          <TableBody>
            {getRowModel().rows.map((row) => (
              <Fragment key={row.id}>
                <TableRow>
                  {row.getVisibleCells().map((cell) => (
                    <TableCell
                      key={cell.id}
                      padding={
                        cell.column.id === 'select' ||
                        cell.column.id === 'expand'
                          ? 'none'
                          : 'normal'
                      }
                      size="small"
                      sx={{ width: cell.column.getSize() }}
                    >
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext()
                      )}
                    </TableCell>
                  ))}
                </TableRow>
                <TableRow>
                  <TableCell
                    sx={{ paddingBottom: 0, paddingTop: 0 }}
                    colSpan={getVisibleFlatColumns().length}
                  >
                    <Collapse
                      in={row.getIsExpanded()}
                      timeout="auto"
                      unmountOnExit
                    >
                      <span>EXPAND!!!</span>
                    </Collapse>
                  </TableCell>
                </TableRow>
              </Fragment>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      <TablePagination
        component="div"
        page={getState().pagination.pageIndex}
        rowsPerPage={getState().pagination.pageSize}
        count={data?.length}
        onPageChange={handlePageChange}
        onRowsPerPageChange={handleRowsPerPageChange}
      />
    </>
  );
};

export default ReactTable;
