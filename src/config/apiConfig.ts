const apiBaseUrl = import.meta.env.VITE_API_BASE_URL as string;
const snapshotBaseUrl = import.meta.env.VITE_SNAPSHOT_BASE_URL as string | undefined;

if (!apiBaseUrl) {
  console.warn('[Coolzo] VITE_API_BASE_URL is not set. API calls will fail. Add it to .env.development.');
}

export const apiConfig = {
  BASE_URL: apiBaseUrl || '',
  // Public CDN origin the static snapshot is served from (e.g. the Cloudflare R2 public base URL).
  // When unset, falls back to the API origin so local/dev (FileSystem storage) keeps working.
  SNAPSHOT_BASE_URL: snapshotBaseUrl || apiBaseUrl || '',
  TIMEOUT: 10000,
};
