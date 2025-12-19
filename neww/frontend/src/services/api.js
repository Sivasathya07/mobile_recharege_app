import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add token to requests
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token && token !== 'admin-token') {
    config.headers.Authorization = `Bearer ${token}`;
    console.log('[AUTH] JWT Token:', token);
    console.log('[API] Request:', config.method?.toUpperCase(), config.url);
  } else if (token === 'admin-token') {
    console.log('[AUTH] Demo admin token - skipping API call');
    // For demo admin, we'll handle this in the components
  } else {
    console.log('[AUTH] No JWT token found in localStorage');
  }
  return config;
});

// Add response interceptor for error handling
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.code === 'ERR_NETWORK') {
      console.error('[ERROR] Cannot connect to backend server');
      console.log('[INFO] Make sure backend is running on http://localhost:5000');
    }
    if (error.response?.status === 401) {
      console.error('[ERROR] Unauthorized - Token may be invalid');
      // Don't auto-redirect, let components handle it
    }
    return Promise.reject(error);
  }
);

// Auth API
export const authAPI = {
  register: (userData) => api.post('/auth/register', userData),
  login: (credentials) => api.post('/auth/login', credentials),
  getMe: () => api.get('/auth/me'),
  enable2FA: () => api.post('/auth/enable-2fa'),
  disable2FA: () => api.post('/auth/disable-2fa'),
};

// User API
export const userAPI = {
  updateProfile: (data) => api.put('/users/profile', data),
  updatePassword: (data) => api.put('/users/password', data),
  updatePreferences: (data) => api.put('/users/preferences', data),
  addFavorite: (data) => api.post('/users/favorites', data),
  updateFavorite: (id, data) => api.put(`/users/favorites/${id}`, data),
  deleteFavorite: (id) => api.delete(`/users/favorites/${id}`),
};

// Recharge API
export const rechargeAPI = {
  getPlans: (operator) => api.get(`/recharge/plans/${operator}`),
  processRecharge: (data) => api.post('/recharge/process', data),
  getHistory: (params = {}) => api.get('/recharge/history', { params }),
};

// Wallet API
export const walletAPI = {
  getBalance: () => api.get('/wallet/balance'),
  addMoney: (data) => api.post('/wallet/add', data),
  getTransactions: () => api.get('/wallet/transactions'),
  getAllTransactions: () => api.get('/wallet/all-transactions'),
};

// Admin API
export const adminAPI = {
  getUsers: () => api.get('/admin/users'),
  getStats: () => api.get('/admin/stats'),
  updateUser: (id, data) => api.put(`/admin/users/${id}`, data),
  deleteUser: (id) => api.delete(`/admin/users/${id}`),
  getPlans: () => api.get('/admin/plans'),
  addPlan: (data) => api.post('/admin/plans', data),
  updatePlan: (id, data) => api.put(`/admin/plans/${id}`, data),
  deletePlan: (id) => api.delete(`/admin/plans/${id}`)
};

export default api;