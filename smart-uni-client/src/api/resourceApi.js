import axios from 'axios'

const apiClient = axios.create({
  baseURL: `${import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080'}/api`,
  headers: {
    'Content-Type': 'application/json',
  },
})

export const resourceApi = {
  getAll: (params = {}) => apiClient.get('/resources', { params }),
  getById: (id) => apiClient.get(`/resources/${id}`),
  create: (payload) => apiClient.post('/resources', payload),
  update: (id, payload) => apiClient.put(`/resources/${id}`, payload),
  remove: (id) => apiClient.delete(`/resources/${id}`),
}
