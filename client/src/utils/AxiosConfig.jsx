// src/utils/AxiosClient.js
import axios from 'axios';

// Create axios instance with base configuration
const axiosInstance = axios.create({
  baseURL: 'http://localhost:3000', // Your API base URL
  timeout: 10000, // 10 second timeout
  withCredentials: true, // Include credentials in requests
});

let isRefreshing = false;
let failedQueue = [];

const processQueue = (error, token = null) => {
  failedQueue.forEach(prom => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve(token);
    }
  });
  
  failedQueue = [];
};

// Request interceptor to add token to headers
axiosInstance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('accessToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
      console.log('Adding token to request:', config.url, 'Token:', token.substring(0, 20) + '...');
    } else {
      console.log('No token found for request:', config.url);
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor to handle token refresh
axiosInstance.interceptors.response.use(
  (response) => {
    return response;
  },
  async (error) => {
    const originalRequest = error.config;

    if (error.response?.status === 401 && !originalRequest._retry) {
      if (isRefreshing) {
        // If already refreshing, queue this request
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        }).then(token => {
          originalRequest.headers.Authorization = `Bearer ${token}`;
          return axiosInstance(originalRequest);
        }).catch(err => {
          return Promise.reject(err);
        });
      }

      originalRequest._retry = true;
      isRefreshing = true;

      try {
        const response = await axiosInstance.get('/api/auth/refresh_token', {
          withCredentials: true,
        });
        
        const newToken = response.data.accesstoken;
        localStorage.setItem('accessToken', newToken);
        
        // Process queued requests
        processQueue(null, newToken);
        
        // Retry original request
        originalRequest.headers.Authorization = `Bearer ${newToken}`;
        return axiosInstance(originalRequest);
        
      } catch (refreshError) {
        processQueue(refreshError, null);
        
        // Clear tokens and redirect to login
        localStorage.removeItem('accessToken');
        localStorage.removeItem('firstLogin');
        
        // Optional: Redirect to login page
        // window.location.href = '/login';
        
        return Promise.reject(refreshError);
      } finally {
        isRefreshing = false;
      }
    }

    return Promise.reject(error);
  }
);

export default axiosInstance;