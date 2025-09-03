import axios, { AxiosRequestConfig, AxiosResponse } from 'axios';

const options: AxiosRequestConfig = {
  baseURL: import.meta.env.DEV
    ? '/api' // Use proxy in development
    : import.meta.env.VITE_API_BASE_URL || 'API',
};

// Create axios instance
const api = axios.create(options);

// Request interceptor to add Bearer token
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

// Response interceptor for error handling
api.interceptors.response.use(
  (response: AxiosResponse) => {
    return response;
  },
  (error) => {
    // Handle 401 unauthorized errors
    if (error?.response?.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('isLoggedIn');
      localStorage.removeItem('currentUser');
      // Redirect to login - this will be handled by the hook that uses this
      window.location.href = '/';
    }

    // Handle WAF/security errors
    if (
      error?.response?.headers?.['content-type']?.includes('text/html') &&
      error.response.data?.toLowerCase().includes('support id')
    ) {
      const ticketNumber = error.response.data.replace(/\D+/g, '');
      alert(
        `The requested URL was rejected. Please consult with your administrator. Your support ID is: ${ticketNumber}`
      );
    }

    return Promise.reject(error);
  }
);

export default api;