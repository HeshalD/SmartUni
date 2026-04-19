import api from './axiosInstance'

export const resourceApi = {
  getAll: (params = {}) => api.get('/api/resources', { params }),
  getById: (id) => api.get(`/api/resources/${id}`),
  create: (payload) => api.post('/api/resources', payload),
  update: (id, payload) => api.put(`/api/resources/${id}`, payload),
  remove: (id) => api.delete(`/api/resources/${id}`),
}
