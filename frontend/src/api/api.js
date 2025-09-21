import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';

// Crear instancia de axios
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Interceptor para agregar token automáticamente
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

// Interceptor para manejar respuestas
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Token expirado o inválido
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// Servicios de autenticación
export const authAPI = {
  register: (userData) => api.post('/auth/register', userData),
  login: (credentials) => api.post('/auth/login', credentials),
  getProfile: () => api.get('/auth/profile'),
};

// Servicios de cálculo de carbono
export const carbonAPI = {
  calculate: (data) => api.post('/carbon/calculate', data),
  getHistory: (page = 1, limit = 10) => api.get(`/carbon/history?page=${page}&limit=${limit}`),
  getProgress: () => api.get('/carbon/progress'),
  getStats: () => api.get('/carbon/stats'),
};

// Servicios de contenido educativo
export const educationAPI = {
  getContent: (page = 1, limit = 10, categoria = '') => 
    api.get(`/education/list?page=${page}&limit=${limit}${categoria ? `&categoria=${categoria}` : ''}`),
  getContentById: (id) => api.get(`/education/content/${id}`),
  getCategories: () => api.get('/education/categories'),
};

// Servicios de métricas
export const metricsAPI = {
  getActiveUsers: () => api.get('/metrics/active-users'),
  getContentMetrics: () => api.get('/metrics/content-users'),
  getDashboardMetrics: () => api.get('/metrics/dashboard'),
};

export default api;