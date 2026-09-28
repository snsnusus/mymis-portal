export interface BulkRowError {
  row: number;
  errors: string[];
  data: unknown;
}

export interface BulkInsertResult {
  total: number;
  inserted: number;
  failed: number;
  message: string;
  errors: BulkRowError[];
}
