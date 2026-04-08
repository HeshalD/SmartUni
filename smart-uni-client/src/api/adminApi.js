import api from './axiosInstance';

export const adminApi = {
  getUsers: () => api.get('/api/admin/users'),

  getTechnicians: () => api.get('/api/admin/technicians'),

  createTechnician: (data) => api.post('/api/admin/technicians', data),

  deleteUser: (userId) => api.delete(`/api/admin/users/${userId}`),
};