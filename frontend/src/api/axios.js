/**
 * @fileoverview Axios instance configured for the Construction Progress Tracker API.
 * Sets up base URL from environment variable, JWT token interceptor,
 * and automatic redirect on 401 unauthorized responses.
 */
import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:8080';

/**
 * Pre-configured Axios instance for API communication.
 * Automatically attaches JWT tokens and handles authentication errors.
 */
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

/**
 * Request interceptor that attaches the JWT Bearer token
 * from localStorage to every outgoing request.
 */
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

/**
 * Response interceptor that redirects to login page
 * when a 401 Unauthorized response is received.
 */
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export default api;
