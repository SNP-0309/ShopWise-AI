import axios from 'axios';

const api = axios.create({
  baseURL: '/api',
  timeout: 15000,
  headers: { 'Content-Type': 'application/json' },
});

// Attach JWT
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('sw_token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

// Handle auth errors
api.interceptors.response.use(
  (res) => res,
  (err) => {
    if (err.response?.status === 401) {
      localStorage.removeItem('sw_token');
      localStorage.removeItem('sw_user');
    }
    return Promise.reject(err);
  }
);

export default api;

// Product API
export const productAPI = {
  search: (params) => api.get('/products/search', { params }),
  getById: (id) => api.get(`/products/${id}`),
  getTrending: () => api.get('/products/trending'),
  getFeatured: () => api.get('/products/featured'),
  getSuggestions: (q) => api.get('/products/suggestions', { params: { q } }),
};

// Auth API
export const authAPI = {
  syncUser: () => api.post('/auth/sync'),
  getMe: () => api.get('/auth/me'),
  updateProfile: (data) => api.put('/auth/profile', data),
};

// AI API
export const aiAPI = {
  chat: (data) => api.post('/ai/chat', data),
  compare: (data) => api.post('/ai/compare', data),
  shoppingAgent: (data) => api.post('/ai/agent', data),
};

// User API
export const userAPI = {
  getWishlist: () => api.get('/users/wishlist'),
  addToWishlist: (data) => api.post('/users/wishlist', data),
  removeFromWishlist: (productId) => api.delete(`/users/wishlist/${productId}`),
  getAlerts: () => api.get('/users/alerts'),
  createAlert: (data) => api.post('/users/alerts', data),
  deleteAlert: (id) => api.delete(`/users/alerts/${id}`),
  getSearchHistory: () => api.get('/users/search-history'),
  getNotifications: () => api.get('/users/notifications'),
};
