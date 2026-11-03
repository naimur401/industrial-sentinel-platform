import axios from 'axios';
import Cookies from 'js-cookie';

export const api = axios.create({
  baseURL: 'http://localhost:3000/api/v1', // Backend API URL
  headers: { 'Content-Type': 'application/json' },
});

// Add token to every request if it exists
api.interceptors.request.use((config) => {
  const token = Cookies.get('token');
  if (token) {
    config.headers.Authorization = Bearer \;
  }
  return config;
});
