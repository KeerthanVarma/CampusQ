import axios from 'axios';

const api = axios.create({
  // Use 127.0.0.1 to avoid Windows IPv6 resolution issues
  baseURL: 'http://127.0.0.1:8000/api/v1',
});

// Attach JWT token to every request automatically
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

export default api;