import axios from 'axios';

const AxiosClient = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
  timeout: 10000,
});

// Add request interceptor to include auth token
AxiosClient.interceptors.request.use(
  (config) => {
    // First try to get token from localStorage
    let token = localStorage.getItem('token');
    
    // If not in localStorage, try to get from the request headers (passed from component)
    if (!token && config.headers.Authorization) {
      token = config.headers.Authorization.replace('Bearer ', '');
    }
    
    console.log('🔍 Request interceptor - Token:', token ? 'Present' : 'Missing');
    console.log('🔍 Request interceptor - localStorage token:', localStorage.getItem('token') ? 'Present' : 'Missing');
    
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
      console.log('🔑 Authorization header set');
    } else {
      console.warn('⚠️ No token found');
    }
    
    console.log('📤 Making request to:', config.url);
    console.log('📤 Request headers:', config.headers);
    
    return config;
  },
  (error) => {
    console.error('❌ Request interceptor error:', error);
    return Promise.reject(error);
  }
);

// Add response interceptor to handle auth errors
AxiosClient.interceptors.response.use(
  (response) => {
    console.log('✅ Response received:', response.status, response.config.url);
    return response;
  },
  (error) => {
    console.error('❌ Response error:', error.response?.status, error.response?.data);
    
    if (error.response?.status === 401) {
      console.warn('🚫 Unauthorized - redirecting to login');
      localStorage.removeItem('token');
      window.location.href = '/login';
    }
    
    return Promise.reject(error);
  }
);

export default AxiosClient;