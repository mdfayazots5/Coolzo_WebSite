/** Generic paginated response from the backend. */
export interface PagedResult<T> {
  items: T[];
  totalCount: number;
  pageNumber: number;
  pageSize: number;
  totalPages: number;
  hasNext: boolean;
  hasPrevious: boolean;
}

/** Generic API error shape returned from the 4xx/5xx interceptor. */
export interface ApiError {
  status?: number;
  message: string;
  fieldErrors: Record<string, string>;
  raw?: unknown;
}
