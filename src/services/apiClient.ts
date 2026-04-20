import axios from 'axios';
import { apiConfig, getAuthHeader } from '../config/apiConfig';

const apiClient = axios.create({
  baseURL: apiConfig.BASE_URL,
  timeout: apiConfig.TIMEOUT,
  headers: {
    'Content-Type': 'application/json',
  },
});

apiClient.interceptors.request.use(
  (config) => {
    // Add performance marker
    (config as any)._startTime = Date.now();
    
    const authHeader = getAuthHeader();
    config.headers = { ...config.headers, ...authHeader } as any;
    
    if (process.env.NODE_ENV === 'development') {
      console.log(`[API Request] ${config.method?.toUpperCase()} ${config.url}`);
    }
    
    return config;
  },
  (error) => Promise.reject(error)
);

apiClient.interceptors.response.use(
  (response) => {
    const startTime = (response.config as any)._startTime;
    const duration = startTime ? `${Date.now() - startTime}ms` : 'unknown';
    
    if (process.env.NODE_ENV === 'development') {
      console.log(`[API Success] ${response.config.url} (${duration})`);
    }
    
    return response.data;
  },
  (error) => {
    const startTime = error.config?._startTime;
    const duration = startTime ? `${Date.now() - startTime}ms` : 'unknown';
    
    const errorData = {
      status: error.response?.status,
      message: error.response?.data?.message || error.message,
      url: error.config?.url,
      method: error.config?.method?.toUpperCase(),
      duration
    };

    console.error(`[API Error]`, errorData);

    // Global handling for specific statuses
    if (error.response?.status === 401) {
      // Potentially trigger logout or refresh
    }

    return Promise.reject(errorData);
  }
);

export default apiClient;
