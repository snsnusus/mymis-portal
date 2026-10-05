import type { ReactNode } from 'react';
import type { ColumnDef, TableOptions } from '@tanstack/react-table';
import type { TableProps as MuiTableProps } from '@mui/material';

// Server-side pagination: the page owns this state and fetches each page.
export type DataTablePagination = {
  pageIndex: number; // 0-based, like MUI's TablePagination
  pageSize: number;
  totalCount: number; // from the API's PagedResult
  onChange: (pageIndex: number, pageSize: number) => void;
};

export type DataTableProps<TData> = {
  // undefined while the first request is loading, so a query's `data`
  // can be passed straight in.
  data: TData[] | undefined;

  // `any` is TanStack's recommended type for a list of columns whose values
  // differ (string, number, ...). Each column is still type-checked where
  // it's built with createColumnHelper.
  columns: ColumnDef<TData, any>[];

  pagination: DataTablePagination;

  // Use a real id (e.g. String(employee.id)) instead of the array index.
  getRowId?: TableOptions<TData>['getRowId'];

  isLoading?: boolean; // first load: nothing to show yet
  isFetching?: boolean; // any request, including page changes
  isError?: boolean;
  emptyMessage?: ReactNode;
  errorMessage?: ReactNode;
  size?: MuiTableProps['size']; // 'small' | 'medium' (density toggle)
};
