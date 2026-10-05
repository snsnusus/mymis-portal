// Generic shape of any paged API response (PagedResult<T> in MyMIS.Api).
export type PagedResult<T> = {
  data: T[];
  totalCount: number; // rows across all pages, after any search
  page: number; // 1-based, as the API returns it
  pageSize: number;
};
