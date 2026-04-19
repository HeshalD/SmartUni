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

export default function MyBookingsPage() {
  const [bookings, setBookings]       = useState([]);
  const [loading, setLoading]         = useState(true);
  const [error, setError]             = useState(null);
  const [statusFilter, setStatusFilter] = useState("ALL");
  const [deleteLoading, setDeleteLoading] = useState(null);
  const [actionSuccess, setActionSuccess] = useState(null);

  useEffect(() => {
    fetchBookings();
  }, [statusFilter]);

  const fetchBookings = async () => {
    try {
      setLoading(true);
      setError(null);
      const filter = statusFilter === "ALL" ? null : statusFilter;
      const res = await bookingsApi.getMyBookings(filter);
      setBookings(res.data.data ?? res.data);
    } catch (err) {
      setError("Failed to load bookings. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const formatDateTime = (dt) =>
    new Date(dt).toLocaleString("en-GB", {
      dateStyle: "medium",
      timeStyle: "short",
    });

  const handleDelete = async (bookingId) => {
    if (!window.confirm("Are you sure you want to delete this booking? This action cannot be undone.")) {
      return;
    }

    try {
      setDeleteLoading(bookingId);
      await bookingsApi.deleteBooking(bookingId);
      setActionSuccess("Booking deleted successfully!");
      fetchBookings(); // Refresh the list
      setTimeout(() => setActionSuccess(null), 3000);
    } catch (err) {
      setError("Failed to delete booking. Please try again.");
    } finally {
      setDeleteLoading(null);
    }
  };

  return (
    <div className="page-container">

      {/* Header */}
      <div className="page-header">
        <div>
          <h1 className="page-title">My Bookings</h1>
          <p className="page-subtitle">View and track your resource booking requests</p>
        </div>
        <Link to="/bookings/new" className="btn btn-primary">
          + New Booking
        </Link>
      </div>

      {/* Filter */}
      <div style={{ marginBottom: "1.5rem", display: "flex", gap: "0.5rem", flexWrap: "wrap" }}>
        {STATUS_OPTIONS.map((s) => (
          <button
            key={s}
            onClick={() => setStatusFilter(s)}
            className="btn btn-outline"
            style={
              statusFilter === s
                ? { background: "var(--color-primary)", color: "#fff", borderColor: "var(--color-primary)" }
                : {}
            }
          >
            {s}
          </button>
        ))}
      </div>

      {/* Success message */}
      {actionSuccess && <div className="alert alert-success">{actionSuccess}</div>}

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
          <p>
            {statusFilter === "ALL"
              ? "You haven't made any bookings yet."
              : `No ${statusFilter.toLowerCase()} bookings found.`}
          </p>
          <Link to="/bookings/new" className="btn btn-primary" style={{ marginTop: "0.5rem" }}>
            Book a Resource
          </Link>
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
                padding: "1.25rem 1.5rem",
                boxShadow: "var(--shadow-sm)",
                display: "flex",
                justifyContent: "space-between",
                alignItems: "flex-start",
                gap: "1rem",
                flexWrap: "wrap",
              }}
            >
              {/* Left side */}
              <div style={{ display: "flex", flexDirection: "column", gap: "0.4rem" }}>
                <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
                  <span style={{ fontWeight: 700, fontSize: "1rem" }}>
                    {booking.resourceName}
                  </span>
                  <span
                    style={{
                      ...STATUS_STYLES[booking.status],
                      fontSize: "0.75rem",
                      fontWeight: 700,
                      padding: "0.2rem 0.6rem",
                      borderRadius: "999px",
                      textTransform: "uppercase",
                      letterSpacing: "0.04em",
                    }}
                  >
                    {booking.status}
                  </span>
                </div>

                <span style={{ fontSize: "0.875rem", color: "var(--color-text-muted)" }}>
                  📅 {formatDateTime(booking.startTime)} → {formatDateTime(booking.endTime)}
                </span>

                <span style={{ fontSize: "0.875rem", color: "var(--color-text-muted)" }}>
                  🎯 {booking.purpose} &nbsp;|&nbsp; 👥 {booking.expectedAttendees} attendees
                </span>

                {/* Admin note - only show if rejected or cancelled */}
                {booking.adminNote && (
                  <span
                    style={{
                      fontSize: "0.85rem",
                      color: "#991b1b",
                      background: "#fee2e2",
                      padding: "0.3rem 0.6rem",
                      borderRadius: "var(--radius-sm)",
                      marginTop: "0.25rem",
                    }}
                  >
                    📝 {booking.adminNote}
                  </span>
                )}
              </div>

              {/* Right side */}
              <div style={{ display: "flex", gap: "0.5rem", flexWrap: "wrap", alignItems: "flex-start" }}>
                <Link
                  to={`/bookings/${booking.id}`}
                  className="btn btn-outline"
                  style={{ flexShrink: 0 }}
                >
                  View Details
                </Link>
                
                {/* Delete button - only for PENDING bookings */}
                {booking.status === "PENDING" && (
                  <button
                    className="btn btn-danger"
                    onClick={() => handleDelete(booking.id)}
                    disabled={deleteLoading === booking.id}
                    style={{ 
                      background: "var(--color-danger)", 
                      color: "#fff", 
                      border: "none",
                      flexShrink: 0
                    }}
                  >
                    {deleteLoading === booking.id ? "Deleting..." : "Delete"}
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}