import api from './axiosInstance';

export const bookingsApi = {
  // ─── User Endpoints ─────────────────────────────────────────

  // Create a new booking request
  createBooking: (data) => api.post('/api/bookings', data),

  // Get current user's bookings (optional status filter)
  getMyBookings: (status = null) =>
    api.get('/api/bookings/my', { params: status ? { status } : {} }),

  // Get a single booking by ID
  getBookingById: (id) => api.get(`/api/bookings/${id}`),

  // Update booking details (user only - for pending bookings)
  updateBooking: (id, data) => api.put(`/api/bookings/${id}`, data),

  // ─── Admin Endpoints ─────────────────────────────────────────

  // Get all bookings with optional filters (admin only)
  getAllBookings: (status = null, resourceId = null) => {
    const params = {};
    if (status) params.status = status;
    if (resourceId) params.resourceId = resourceId;
    return api.get('/api/bookings', { params });
  },

  // Approve, reject or cancel a booking (admin only)
  updateBookingStatus: (id, status, adminNote = '') =>
    api.put(`/api/bookings/${id}/status`, { status, adminNote }),

  // Delete a booking (admin only)
  deleteBooking: (id) => api.delete(`/api/bookings/${id}`),
};