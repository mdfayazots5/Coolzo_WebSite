const apiBaseUrl = import.meta.env.VITE_API_BASE_URL as string;

if (!apiBaseUrl) {
  console.warn('[Coolzo] VITE_API_BASE_URL is not set. API calls will fail. Add it to .env.development.');
}

export const apiConfig = {
  BASE_URL: apiBaseUrl || '',
  TIMEOUT: 10000,
};
