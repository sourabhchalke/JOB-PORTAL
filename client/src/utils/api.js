import axios from 'axios';

// Use environment variable or fallback
const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || 'https://job-portal-red-eight.vercel.app';

console.log('🔗 Backend URL:', BACKEND_URL);

const api = axios.create({
  baseURL: BACKEND_URL,
  timeout: 30000,
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true
});

// Request interceptor
api.interceptors.request.use(
  async (config) => {
    console.log('📤 Request:', config.method?.toUpperCase(), config.url);
    return config;
  },
  (error) => {
    console.error('📤 Request Error:', error);
    return Promise.reject(error);
  }
);

// Response interceptor
api.interceptors.response.use(
  (response) => {
    console.log('📥 Response:', response.status, response.config.url);
    return response;
  },
  (error) => {
    console.error('📥 Response Error:', error.response?.status, error.config?.url);
    console.error('📥 Error Details:', error.response?.data || error.message);
    return Promise.reject(error);
  }
);

export default api;