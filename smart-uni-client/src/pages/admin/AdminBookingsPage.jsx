import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { bookingsApi } from "../../api/bookingApi";

const STATUS_OPTIONS = ["ALL", "PENDING", "APPROVED", "REJECTED", "CANCELLED"];

const STATUS_STYLES = {
  PENDING:   { background: "#fef3c7", color: "#92400e" },
  APPROVED:  { background: "#d1fae5", color: "#065f46" },
  REJECTED:  { background: "#fee2e2", color: "#991b1b" },
  CANCELLED: { background: "#f3f4f6", color: "#6b7280" },
};

export default function AdminBookingsPage() {
  const [bookings, setBookings]         = useState([]);
  const [loading, setLoading]           = useState(true);
  const [error, setError]               = useState(null);
  const [statusFilter, setStatusFilter] = useState("ALL");
  const [resourceFilter, setResourceFilter] = useState("");

  // Reject modal state
  const [rejectModal, setRejectModal]   = useState({ open: false, bookingId: null });
  const [rejectNote, setRejectNote]     = useState("");
  
  // Approve modal state
  const [approveModal, setApproveModal] = useState({ open: false, bookingId: null });
  const [approveNote, setApproveNote]   = useState("");
  
  const [actionLoading, setActionLoading] = useState(false);
  const [actionError, setActionError]   = useState(null);
  const [successMsg, setSuccessMsg]     = useState(null);

  useEffect(() => {
    fetchBookings();
  }, [statusFilter, resourceFilter]);

  const fetchBookings = async () => {
    try {
      setLoading(true);
      setError(null);
      const status     = statusFilter === "ALL" ? null : statusFilter;
      const resourceId = resourceFilter.trim() || null;
      const res = await bookingsApi.getAllBookings(status, resourceId);
      setBookings(res.data.data ?? res.data);
    } catch (err) {
      setError("Failed to load bookings. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const showSuccess = (msg) => {
    setSuccessMsg(msg);
    setTimeout(() => setSuccessMsg(null), 3000);
  };

  const openApproveModal = (id) => {
    setApproveNote("");
    setActionError(null);
    setApproveModal({ open: true, bookingId: id });
  };

  const handleApprove = async () => {
    try {
      setActionLoading(true);
      setActionError(null);
      await bookingsApi.updateBookingStatus(
        approveModal.bookingId,
        "APPROVED",
        approveNote
      );
      setApproveModal({ open: false, bookingId: null });
      showSuccess("Booking approved successfully.");
      fetchBookings();
    } catch (err) {
      setActionError("Failed to approve booking. Please try again.");
    } finally {
      setActionLoading(false);
    }
  };

  const openRejectModal = (id) => {
    setRejectNote("");
    setActionError(null);
    setRejectModal({ open: true, bookingId: id });
  };

  const handleReject = async () => {
    try {
      setActionLoading(true);
      setActionError(null);
      await bookingsApi.updateBookingStatus(
        rejectModal.bookingId,
        "REJECTED",
        rejectNote
      );
      setRejectModal({ open: false, bookingId: null });
      showSuccess("Booking rejected.");
      fetchBookings();
    } catch (err) {
      setActionError("Failed to reject booking. Please try again.");
    } finally {
      setActionLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to permanently delete this booking?")) return;
    try {
      setActionLoading(true);
      setActionError(null);
      await bookingsApi.deleteBooking(id);
      showSuccess("Booking deleted.");
      fetchBookings();
    } catch (err) {
      setActionError("Failed to delete booking. Please try again.");
    } finally {
      setActionLoading(false);
    }
  };

  const formatDateTime = (dt) =>
    new Date(dt).toLocaleString("en-GB", {
      dateStyle: "medium",
      timeStyle: "short",
    });

  return (
    <div className="page-container">

      {/* Header */}
      <div className="page-header">
        <div>
          <h1 className="page-title">Manage Bookings</h1>
          <p className="page-subtitle">Review, approve, reject and manage all booking requests</p>
        </div>
      </div>

      {/* Success message */}
      {successMsg && (
        <div className="alert alert-success">{successMsg}</div>
      )}

      {/* Action error */}
      {actionError && (
        <div className="alert alert-error">{actionError}</div>
      )}

      {/* Filters */}
      <div
        style={{
          background: "var(--color-surface)",
          border: "1px solid var(--color-border)",
          borderRadius: "var(--radius-md)",
          padding: "1rem 1.25rem",
          marginBottom: "1.5rem",
          display: "flex",
          gap: "1rem",
          flexWrap: "wrap",
          alignItems: "flex-end",
        }}
      >
        {/* Status filter */}
        <div className="form-group" style={{ margin: 0 }}>
          <label>Status</label>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            style={{
              padding: "0.6rem 0.9rem",
              border: "1px solid var(--color-border)",
              borderRadius: "var(--radius-sm)",
              fontSize: "0.95rem",
              background: "var(--color-surface)",
              cursor: "pointer",
            }}
          >
            {STATUS_OPTIONS.map((s) => (
              <option key={s} value={s}>{s}</option>
            ))}
          </select>
        </div>

        {/* Resource ID filter */}
        <div className="form-group" style={{ margin: 0, flex: 1, minWidth: "200px" }}>
          <label>Resource ID</label>
          <input
            type="text"
            placeholder="Filter by resource ID..."
            value={resourceFilter}
            onChange={(e) => setResourceFilter(e.target.value)}
          />
        </div>

        {/* Clear filters */}
        {(statusFilter !== "ALL" || resourceFilter) && (
          <button
            className="btn btn-outline"
            onClick={() => { setStatusFilter("ALL"); setResourceFilter(""); }}
          >
            Clear Filters
          </button>
        )}
      </div>

      {/* Error */}
      {error && <div className="alert alert-error">{error}</div>}

      {/* Loading */}
      {loading && (
        <div className="loading-spinner">
          <div className="spinner" />
        </div>
      )}

      {/* Empty state */}
      {!loading && !error && bookings.length === 0 && (
        <div className="empty-state">
          <span style={{ fontSize: "2.5rem" }}>📭</span>
          <h3>No bookings found</h3>
          <p>Try adjusting your filters.</p>
        </div>
      )}

      {/* Bookings list */}
      {!loading && !error && bookings.length > 0 && (
        <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
          {bookings.map((booking) => (
            <div
              key={booking.id}
              style={{
                background: "var(--color-surface)",
                border: "1px solid var(--color-border)",
                borderRadius: "var(--radius-md)",
                boxShadow: "var(--shadow-sm)",
                overflow: "hidden",
              }}
            >
              {/* Top row */}
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "flex-start",
                  padding: "1rem 1.25rem",
                  gap: "1rem",
                  flexWrap: "wrap",
                }}
              >
                {/* Left: booking info */}
                <div style={{ display: "flex", flexDirection: "column", gap: "0.35rem" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
                    <span style={{ fontWeight: 700, fontSize: "1rem" }}>
                      {booking.resourceName}
                    </span>
                    <span
                      style={{
                        ...STATUS_STYLES[booking.status],
                        fontSize: "0.72rem",
                        fontWeight: 700,
                        padding: "0.2rem 0.55rem",
                        borderRadius: "999px",
                        textTransform: "uppercase",
                        letterSpacing: "0.04em",
                      }}
                    >
                      {booking.status}
                    </span>
                  </div>

                  <span style={{ fontSize: "0.85rem", color: "var(--color-text-muted)" }}>
                    👤 {booking.userEmail}
                  </span>

                  <span style={{ fontSize: "0.85rem", color: "var(--color-text-muted)" }}>
                    📅 {formatDateTime(booking.startTime)} → {formatDateTime(booking.endTime)}
                  </span>

                  <span style={{ fontSize: "0.85rem", color: "var(--color-text-muted)" }}>
                    🎯 {booking.purpose} &nbsp;|&nbsp; 👥 {booking.expectedAttendees} attendees
                  </span>

                  {booking.adminNote && (
                    <span
                      style={{
                        fontSize: "0.82rem",
                        color: "#991b1b",
                        background: "#fee2e2",
                        padding: "0.25rem 0.6rem",
                        borderRadius: "var(--radius-sm)",
                        marginTop: "0.15rem",
                      }}
                    >
                      📝 {booking.adminNote}
                    </span>
                  )}
                </div>

                {/* Right: action buttons */}
                <div style={{ display: "flex", gap: "0.5rem", flexWrap: "wrap", alignItems: "flex-start" }}>

                  <Link
                    to={`/bookings/${booking.id}`}
                    className="btn btn-outline"
                    style={{ fontSize: "0.85rem" }}
                  >
                    View
                  </Link>

                  {/* Approve — only for PENDING */}
                  {booking.status === "PENDING" && (
                    <button
                      className="btn"
                      disabled={actionLoading}
                      onClick={() => openApproveModal(booking.id)}
                      style={{
                        background: "var(--color-success)",
                        color: "#fff",
                        fontSize: "0.85rem",
                        border: "none",
                      }}
                    >
                      Approve
                    </button>
                  )}

                  {/* Reject — only for PENDING */}
                  {booking.status === "PENDING" && (
                    <button
                      className="btn"
                      disabled={actionLoading}
                      onClick={() => openRejectModal(booking.id)}
                      style={{
                        background: "var(--color-danger)",
                        color: "#fff",
                        fontSize: "0.85rem",
                        border: "none",
                      }}
                    >
                      ✗ Reject
                    </button>
                  )}

                  {/* Delete — always available */}
                  <button
                    className="btn-icon btn-icon--danger"
                    disabled={actionLoading}
                    onClick={() => handleDelete(booking.id)}
                    title="Delete booking"
                  >
                    🗑
                  </button>

                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Reject Modal */}
      {rejectModal.open && (
        <>
          {/* Backdrop */}
          <div
            onClick={() => setRejectModal({ open: false, bookingId: null })}
            style={{
              position: "fixed",
              inset: 0,
              background: "rgba(0,0,0,0.4)",
              zIndex: 300,
            }}
          />

          {/* Modal */}
          <div
            style={{
              position: "fixed",
              top: "50%",
              left: "50%",
              transform: "translate(-50%, -50%)",
              background: "var(--color-surface)",
              border: "1px solid var(--color-border)",
              borderRadius: "var(--radius-lg)",
              padding: "2rem",
              width: "100%",
              maxWidth: "440px",
              zIndex: 400,
              boxShadow: "var(--shadow-lg)",
            }}
          >
            <h2 style={{ fontSize: "1.1rem", fontWeight: 700, marginBottom: "0.5rem" }}>
              Reject Booking
            </h2>
            <p style={{ fontSize: "0.9rem", color: "var(--color-text-muted)", marginBottom: "1.25rem" }}>
              Provide a reason for rejection. This will be visible to the user.
            </p>

            {actionError && (
              <div className="alert alert-error">{actionError}</div>
            )}

            <div className="form-group">
              <label htmlFor="rejectNote">Rejection Reason</label>
              <input
                id="rejectNote"
                type="text"
                placeholder="e.g. Room unavailable on that date"
                value={rejectNote}
                onChange={(e) => setRejectNote(e.target.value)}
              />
            </div>

            <div className="form-actions" style={{ marginTop: "1.25rem" }}>
              <button
                className="btn"
                disabled={actionLoading}
                onClick={handleReject}
                style={{
                  background: "var(--color-danger)",
                  color: "#fff",
                  border: "none",
                }}
              >
                {actionLoading ? "Rejecting..." : "Confirm Reject"}
              </button>
              <button
                className="btn btn-outline"
                onClick={() => setRejectModal({ open: false, bookingId: null })}
              >
                Cancel
              </button>
            </div>
          </div>
        </>
      )}

      {/* Approve Modal */}
      {approveModal.open && (
        <>
          {/* Backdrop */}
          <div
            onClick={() => setApproveModal({ open: false, bookingId: null })}
            style={{
              position: "fixed",
              inset: 0,
              background: "rgba(0,0,0,0.4)",
              zIndex: 300,
            }}
          />

          {/* Modal */}
          <div
            style={{
              position: "fixed",
              top: "50%",
              left: "50%",
              transform: "translate(-50%, -50%)",
              background: "var(--color-surface)",
              border: "1px solid var(--color-border)",
              borderRadius: "var(--radius-lg)",
              padding: "2rem",
              width: "100%",
              maxWidth: "440px",
              zIndex: 400,
              boxShadow: "var(--shadow-lg)",
            }}
          >
            <h2 style={{ fontSize: "1.1rem", fontWeight: 700, marginBottom: "0.5rem" }}>
              Approve Booking
            </h2>
            <p style={{ fontSize: "0.9rem", color: "var(--color-text-muted)", marginBottom: "1.25rem" }}>
              Add an optional approval message for the user.
            </p>

            {actionError && (
              <div className="alert alert-error">{actionError}</div>
            )}

            <div className="form-group">
              <label htmlFor="approveNote">Approval Message (Optional)</label>
              <textarea
                id="approveNote"
                placeholder="e.g. Approved! Please arrive 10 minutes early."
                value={approveNote}
                onChange={(e) => setApproveNote(e.target.value)}
                rows={3}
                style={{
                  width: "100%",
                  padding: "0.75rem",
                  border: "1px solid var(--color-border)",
                  borderRadius: "var(--radius-md)",
                  background: "var(--color-surface)",
                  fontSize: "0.95rem",
                  resize: "vertical",
                  minHeight: "80px",
                }}
              />
            </div>

            <div className="form-actions" style={{ marginTop: "1.25rem" }}>
              <button
                className="btn"
                disabled={actionLoading}
                onClick={handleApprove}
                style={{
                  background: "var(--color-success)",
                  color: "#fff",
                  border: "none",
                }}
              >
                {actionLoading ? "Approving..." : "Confirm Approve"}
              </button>
              <button
                className="btn btn-outline"
                onClick={() => setApproveModal({ open: false, bookingId: null })}
              >
                Cancel
              </button>
            </div>
          </div>
        </>
      )}

    </div>
  );
}