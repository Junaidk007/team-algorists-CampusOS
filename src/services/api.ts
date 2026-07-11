import axios from 'axios';

// Dynamically read VITE_API_URL from environment variables, defaulting to local backend URL
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor: Auto-inject JWT token into headers if available
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('campusos-token');
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor: Handle common errors (like 401 Unauthorized)
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response) {
      const { status } = error.response;
      if (status === 401) {
        // Clear local storage details upon session expiration
        localStorage.removeItem('campusos-token');
        localStorage.removeItem('campusos-user');
        
        // Optional: Redirect to login or dispatch session expiry events
        if (window.location.pathname !== '/login') {
          window.location.href = '/login';
        }
      }
    }
    return Promise.reject(error);
  }
);

export default api;
