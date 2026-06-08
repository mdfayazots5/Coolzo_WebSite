import axios, { AxiosRequestConfig } from 'axios';
import { apiConfig } from '../config/apiConfig';
import { tokenStorage } from './tokenStorage';

/**
 * Backend wraps every response in:
 *   ApiResponse<T> { isSuccess, code, message, data, errors, traceId, timestampUtc }
 *
 * This client automatically unwraps response.data.data so callers receive
 * the typed payload directly.  Error details are still accessible via the
 * error interceptor.
 */

const apiClient = axios.create({
  baseURL: apiConfig.BASE_URL,
  timeout: apiConfig.TIMEOUT,
  headers: {
    'Content-Type': 'application/json',
  },
});

// ─── Token Refresh Queue ──────────────────────────────────────────────────────
// Prevents multiple simultaneous 401s from each triggering a separate refresh.

let isRefreshing = false;
let failedQueue: Array<{ resolve: (token: string) => void; reject: (err: unknown) => void }> = [];

function processQueue(error: unknown, token: string | null): void {
  failedQueue.forEach((p) => {
    if (error) {
      p.reject(error);
    } else {
      p.resolve(token!);
    }
  });
  failedQueue = [];
}

// ─── Request Interceptor ─────────────────────────────────────────────────────

apiClient.interceptors.request.use(
  (config) => {
    (config as any)._startTime = Date.now();

    const token = tokenStorage.getAccessToken();
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }

    if (import.meta.env.DEV) {
      console.log(`[API →] ${config.method?.toUpperCase()} ${config.url}`);
    }

    return config;
  },
  (error) => Promise.reject(error),
);

// ─── Response Interceptor ────────────────────────────────────────────────────

apiClient.interceptors.response.use(
  (response) => {
    if (import.meta.env.DEV) {
      const duration = (response.config as any)._startTime
        ? `${Date.now() - (response.config as any)._startTime}ms`
        : '–';
      console.log(`[API ✓] ${response.config.url} (${duration})`);
    }

    // Unwrap ApiResponse<T> — return the inner data payload
    const apiResponse = response.data;
    if (apiResponse && typeof apiResponse === 'object' && 'data' in apiResponse) {
      return apiResponse.data;
    }
    return apiResponse;
  },
  async (error) => {
    const originalRequest: AxiosRequestConfig & { _retry?: boolean } = error.config ?? {};

    if (import.meta.env.DEV) {
      console.error(`[API ✗] ${originalRequest.url}`, {
        status: error.response?.status,
        message: error.response?.data?.message ?? error.message,
      });
    }

    // ── 401 Handling + Token Refresh ────────────────────────────────────────
    if (error.response?.status === 401 && !originalRequest._retry) {
      const refreshToken = tokenStorage.getRefreshToken();

      if (!refreshToken) {
        // No refresh token — redirect to session expired
        tokenStorage.clear();
        window.location.href = '/session-expired';
        return Promise.reject(error);
      }

      if (isRefreshing) {
        // Another refresh is in flight — queue this request
        return new Promise((resolve, reject) => {
          failedQueue.push({
            resolve: (token) => {
              originalRequest.headers = {
                ...(originalRequest.headers as Record<string, string>),
                Authorization: `Bearer ${token}`,
              };
              resolve(apiClient(originalRequest));
            },
            reject,
          });
        });
      }

      originalRequest._retry = true;
      isRefreshing = true;

      try {
        // Call refresh endpoint directly (bypass apiClient to avoid infinite loops)
        const response = await axios.post(
          `${apiConfig.BASE_URL}/api/auth/refresh`,
          { refreshToken },
          { headers: { 'Content-Type': 'application/json' } },
        );

        const tokenData = response.data?.data ?? response.data;
        const newAccessToken: string = tokenData.accessToken;
        const newRefreshToken: string = tokenData.refreshToken ?? refreshToken;

        tokenStorage.setTokens(newAccessToken, newRefreshToken);
        apiClient.defaults.headers.common['Authorization'] = `Bearer ${newAccessToken}`;

        processQueue(null, newAccessToken);

        originalRequest.headers = {
          ...(originalRequest.headers as Record<string, string>),
          Authorization: `Bearer ${newAccessToken}`,
        };
        return apiClient(originalRequest);
      } catch (refreshError) {
        processQueue(refreshError, null);
        tokenStorage.clear();
        window.location.href = '/session-expired';
        return Promise.reject(refreshError);
      } finally {
        isRefreshing = false;
      }
    }

    // ── Extract structured error from ApiResponse ────────────────────────────
    const apiError = error.response?.data;
    const message = apiError?.message ?? error.message ?? 'An unexpected error occurred.';
    const fieldErrors: Record<string, string> = {};

    if (Array.isArray(apiError?.errors)) {
      // Backend errors shape: { code: string, message: string }
      // (NOT a [field, msg] tuple — destructuring an object as a tuple throws
      //  "object is not iterable (cannot read property Symbol(Symbol.iterator))")
      apiError.errors.forEach((err: { code?: string; message?: string }) => {
        const key = err?.code ?? '';
        const msg = err?.message ?? '';
        if (key && msg) fieldErrors[key] = msg;
      });
    }

    return Promise.reject({
      status: error.response?.status,
      message,
      fieldErrors,
      raw: apiError,
    });
  },
);

/**
 * Type-safe facade over the Axios instance.
 * The response interceptor above already unwraps ApiResponse<T> → T at runtime;
 * these wrappers teach TypeScript the same thing so callers get Promise<T> directly.
 */
const api = {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  get: <T = any>(url: string, config?: AxiosRequestConfig) =>
    apiClient.get(url, config) as unknown as Promise<T>,

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  post: <T = any>(url: string, data?: unknown, config?: AxiosRequestConfig) =>
    apiClient.post(url, data, config) as unknown as Promise<T>,

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  put: <T = any>(url: string, data?: unknown, config?: AxiosRequestConfig) =>
    apiClient.put(url, data, config) as unknown as Promise<T>,

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  patch: <T = any>(url: string, data?: unknown, config?: AxiosRequestConfig) =>
    apiClient.patch(url, data, config) as unknown as Promise<T>,

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  delete: <T = any>(url: string, config?: AxiosRequestConfig) =>
    apiClient.delete(url, config) as unknown as Promise<T>,
};

export { api };
export default api;
