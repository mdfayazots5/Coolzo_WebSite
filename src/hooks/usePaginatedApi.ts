import { useState, useEffect, useCallback } from 'react';
import { PagedResult } from '../types/common';

interface UsePaginatedApiOptions {
  initialPage?: number;
  pageSize?: number;
  /** Set to false to prevent the initial fetch from firing automatically. */
  autoFetch?: boolean;
}

interface UsePaginatedApiResult<T> {
  data: T[];
  loading: boolean;
  error: string | null;
  page: number;
  totalCount: number;
  totalPages: number;
  hasNext: boolean;
  hasPrevious: boolean;
  goToPage: (page: number) => void;
  nextPage: () => void;
  previousPage: () => void;
  refetch: () => void;
}

/**
 * Generic hook for paginated API calls that return PagedResult<T>.
 *
 * Usage:
 *   const { data, loading, error, hasNext, nextPage } = usePaginatedApi(
 *     (page) => BookingService.getMyBookings(page, 10),
 *   );
 */
export function usePaginatedApi<T>(
  fetcher: (page: number, pageSize: number) => Promise<PagedResult<T>>,
  options: UsePaginatedApiOptions = {},
): UsePaginatedApiResult<T> {
  const { initialPage = 1, pageSize = 10, autoFetch = true } = options;

  const [data, setData] = useState<T[]>([]);
  const [loading, setLoading] = useState(autoFetch);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(initialPage);
  const [totalCount, setTotalCount] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [hasNext, setHasNext] = useState(false);
  const [hasPrevious, setHasPrevious] = useState(false);
  const [fetchKey, setFetchKey] = useState(0);

  useEffect(() => {
    if (!autoFetch && fetchKey === 0) return;

    let cancelled = false;
    setLoading(true);
    setError(null);

    fetcher(page, pageSize)
      .then((result) => {
        if (cancelled) return;
        setData(result.items ?? []);
        setTotalCount(result.totalCount ?? 0);
        setTotalPages(result.totalPages ?? 1);
        setHasNext(result.hasNext ?? false);
        setHasPrevious(result.hasPrevious ?? false);
      })
      .catch((err) => {
        if (cancelled) return;
        setError(err?.message ?? 'Failed to load data.');
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [page, pageSize, fetchKey]);

  const goToPage = useCallback((p: number) => setPage(p), []);
  const nextPage = useCallback(() => setPage((p) => p + 1), []);
  const previousPage = useCallback(() => setPage((p) => Math.max(1, p - 1)), []);
  const refetch = useCallback(() => setFetchKey((k) => k + 1), []);

  return {
    data,
    loading,
    error,
    page,
    totalCount,
    totalPages,
    hasNext,
    hasPrevious,
    goToPage,
    nextPage,
    previousPage,
    refetch,
  };
}
