import { useState, type ChangeEvent } from 'react';

interface Pagination<T> {
  pageItems: T[];
  count: number;
  page: number;
  rowsPerPage: number;
  onPageChange: (event: unknown, newPage: number) => void;
  onRowsPerPageChange: (
    event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => void;
}

export const usePagination = <T>(
  items: T[] | undefined,
  initialRowsPerPage = 10
): Pagination<T> => {
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(initialRowsPerPage);

  const allItems = items ?? [];

  // If the list shrinks (e.g. after a delete) and the current page no
  // longer exists, fall back to the last page that does.
  const lastPage = Math.max(0, Math.ceil(allItems.length / rowsPerPage) - 1);
  const safePage = Math.min(page, lastPage);

  const start = safePage * rowsPerPage;

  return {
    pageItems: allItems.slice(start, start + rowsPerPage),
    count: allItems.length,
    page: safePage,
    rowsPerPage,
    onPageChange: (_event, newPage) => setPage(newPage),
    onRowsPerPageChange: (event) => {
      setRowsPerPage(Number(event.target.value));
      setPage(0); // page 3 at 10 rows/page doesn't mean the same thing at 25
    },
  };
};
