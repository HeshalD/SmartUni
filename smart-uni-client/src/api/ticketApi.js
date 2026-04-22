import api from './axiosInstance';

export const ticketsApi = {
  // Get all tickets (admin only)
  getAllTickets: (status = null) => {
    const params = {};
    if (status && status !== 'ALL') params.status = status;
    return api.get('/api/tickets', { params });
  },

  // Get ticket by ID
  getTicketById: (id) => api.get(`/api/tickets/${id}`),

  // Update ticket (admin/technician only)
  updateTicket: (id, data) => api.put(`/api/tickets/${id}`, data),

  // Add comment to ticket
  addComment: (ticketId, data) => api.post(`/api/tickets/${ticketId}/comments`, data),

  // Edit comment
  editComment: (ticketId, commentId, data) => 
    api.put(`/api/tickets/${ticketId}/comments/${commentId}`, data),

  // Delete comment
  deleteComment: (ticketId, commentId) => 
    api.delete(`/api/tickets/${ticketId}/comments/${commentId}`),

  // Create new ticket
  createTicket: (data) => api.post('/api/tickets', data),

  // Get tickets by reporter
  getTicketsByReporter: (reporterId) => api.get(`/api/tickets/reporter/${reporterId}`),

  // Delete ticket (admin only)
  deleteTicket: (id) => api.delete(`/api/tickets/${id}`)
};
