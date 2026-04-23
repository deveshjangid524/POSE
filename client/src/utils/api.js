import axios from 'axios';

const API = axios.create({
  // baseURL: 'https://pose-ee3x.onrender.com',
    baseURL: 'http://localhost:5000',

  timeout: 0,
});

// Request interceptor for JWT
API.interceptors.request.use(config => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Response interceptor for error handling
API.interceptors.response.use(
  response => response,
  error => {
    // Only clear token on explicit 401 authentication errors
    if (error.response?.status === 401) {
      console.log('API - 401 error, checking if should clear token');
      // Don't clear token immediately - let ProtectedRoute handle validation
    }
    return Promise.reject(error);
  }
);

export default API;
