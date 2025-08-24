// frontend/frontend-app/src/api/client.js
import axios from 'axios';

// Create axios instance
const apiClient = axios.create({
  baseURL: '/api',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  }
});

// Request interceptor
apiClient.interceptors.request.use(
  (config) => {
    // Add auth token if available
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    // Log request in development
    if (process.env.NODE_ENV === 'development') {
      console.log(`🚀 ${config.method?.toUpperCase()} ${config.url}`, {
        params: config.params,
        data: config.data
      });
    }

    return config;
  },
  (error) => {
    console.error('Request error:', error);
    return Promise.reject(error);
  }
);

// Response interceptor
apiClient.interceptors.response.use(
  (response) => {
    // Log response in development
    if (process.env.NODE_ENV === 'development') {
      console.log(`✅ ${response.status} ${response.config.url}`, response.data);
    }

    return response;
  },
  (error) => {
    // Handle common errors
    if (error.response) {
      const { status, data } = error.response;

      // Handle authentication errors
      if (status === 401) {
        localStorage.removeItem('token');
        localStorage.removeItem('auth');
        window.location.href = '/';
      }

      // Log error in development
      if (process.env.NODE_ENV === 'development') {
        console.error(`❌ ${status} ${error.config?.url}`, data);
      }

      // Create user-friendly error message
      error.message = data?.detail || data?.message || `HTTP ${status} Error`;
    } else if (error.request) {
      error.message = 'Network error - please check your connection';
    }

    return Promise.reject(error);
  }
);

export default apiClient;