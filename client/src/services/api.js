import axios from 'axios';

// Create axios instance
const api = axios.create({
  baseURL: 'http://localhost:3000/api', 
});

// Interceptor to attach token automatically
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token'); 
  if (token) {
    config.headers['Authorization'] = `Bearer ${token}`;
  }
  return config;
});

export default api;
