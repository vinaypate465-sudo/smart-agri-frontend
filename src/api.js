
import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:8080/api'
});

api.interceptors.request.use((cfg) => {
  const token = localStorage.getItem('token');
  if (token) cfg.headers.Authorization = `Bearer ${token}`;
  return cfg;
});

api.interceptors.response.use(
  (r) => r,
  (e) => {
    if (e.response?.status === 401 && localStorage.getItem('token')) {
      localStorage.clear();
      window.location.href = '/login';
    }
    return Promise.reject(e);
  }
);

export const errMsg = (e) =>
  e.response?.data?.message || e.message || 'Something went wrong';

export const money = (n) =>
  '₹' + Number(n || 0).toLocaleString('en-IN', {
    maximumFractionDigits: 2
  });

export default api;
