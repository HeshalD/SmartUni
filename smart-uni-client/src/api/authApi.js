import api from './axiosInstance';

export const authApi = {
  signup: (data) => api.post('/api/auth/signup', data),
  login: (data) => api.post('/api/auth/login', data),
  getMe: () => api.get('/api/auth/me'),
  updateProfile: (data) => api.put('/api/auth/me', data),
  assignRole: (userId, role) => api.post(`/api/auth/admin/users/${userId}/roles/${role}`),
  removeRole: (userId, role) => api.delete(`/api/auth/admin/users/${userId}/roles/${role}`),
};