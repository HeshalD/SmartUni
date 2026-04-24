import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { bookingsApi } from "../../api/bookingApi";
import { FaInbox, FaCalendarAlt, FaBullseye, FaUsers, FaStickyNote, FaEye, FaTrash } from "react-icons/fa";

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
    <div style={{ maxWidth: "1280px", margin: "0 auto", padding: "24px" }}>

      {/* Header */}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: "16px", marginBottom: "28px" }}>
        <div>
          <h1 style={{ fontSize: "24px", fontWeight: 700, color: "#111827", margin: 0 }}>My Bookings</h1>
          <p style={{ fontSize: "14px", color: "#6b7280", margin: "4px 0 0 0" }}>View and track your resource booking requests</p>
        </div>
        <Link
          to="/bookings/new"
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: "8px",
            padding: "10px 18px",
            borderRadius: "10px",
            background: "#4f46e5",
            color: "#fff",
            fontSize: "14px",
            fontWeight: 600,
            textDecoration: "none",
            transition: "background 0.15s",
            border: "none",
            cursor: "pointer",
          }}
          onMouseEnter={(e) => { e.currentTarget.style.background = "#4338ca"; }}
          onMouseLeave={(e) => { e.currentTarget.style.background = "#4f46e5"; }}
        >
          + New Booking
        </Link>
      </div>

      {/* Filter */}
      <div style={{ marginBottom: "24px", display: "flex", gap: "8px", flexWrap: "wrap" }}>
        {STATUS_OPTIONS.map((s) => {
          const isActive = statusFilter === s;
          return (
            <button
              key={s}
              onClick={() => setStatusFilter(s)}
              style={{
                padding: "8px 16px",
                borderRadius: "10px",
                fontSize: "13px",
                fontWeight: 600,
                border: isActive ? "1px solid #4f46e5" : "1px solid #e5e7eb",
                background: isActive ? "#4f46e5" : "#ffffff",
                color: isActive ? "#ffffff" : "#374151",
                cursor: "pointer",
                transition: "all 0.15s",
              }}
              onMouseEnter={(e) => {
                if (!isActive) { e.currentTarget.style.background = "#f9fafb"; e.currentTarget.style.borderColor = "#d1d5db"; }
              }}
              onMouseLeave={(e) => {
                if (!isActive) { e.currentTarget.style.background = "#ffffff"; e.currentTarget.style.borderColor = "#e5e7eb"; }
              }}
            >
              {s}
            </button>
          );
        })}
      </div>

      {/* Success message */}
      {actionSuccess && (
        <div style={{ marginBottom: "16px", padding: "12px 16px", borderRadius: "10px", background: "#ecfdf5", color: "#065f46", fontSize: "14px", fontWeight: 500, border: "1px solid #d1fae5" }}>
          {actionSuccess}
        </div>
      )}

      {/* Error */}
      {error && (
        <div style={{ marginBottom: "16px", padding: "12px 16px", borderRadius: "10px", background: "#fef2f2", color: "#991b1b", fontSize: "14px", fontWeight: 500, border: "1px solid #fecaca" }}>
          {error}
        </div>
      )}

      {/* Loading */}
      {loading && (
        <div style={{ textAlign: "center", padding: "40px", color: "#9ca3af", fontSize: "14px" }}>
          <div style={{ width: "32px", height: "32px", border: "3px solid #f3f4f6", borderTopColor: "#4f46e5", borderRadius: "50%", margin: "0 auto 12px", animation: "spin 0.8s linear infinite" }} />
          Loading bookings...
        </div>
      )}

      {/* Empty state */}
      {!loading && !error && bookings.length === 0 && (
        <div style={{ textAlign: "center", padding: "60px 20px", color: "#6b7280", background: "#ffffff", borderRadius: "16px", border: "1px solid #f3f4f6" }}>
          <FaInbox size={48} color="#d1d5db" style={{ marginBottom: "16px" }} />
          <h3 style={{ fontSize: "18px", fontWeight: 600, color: "#374151", marginBottom: "8px" }}>No bookings found</h3>
          <p style={{ fontSize: "14px", color: "#9ca3af", margin: "0 0 20px 0" }}>
            {statusFilter === "ALL"
              ? "You haven't made any bookings yet."
              : `No ${statusFilter.toLowerCase()} bookings found.`}
          </p>
          <Link
            to="/bookings/new"
            style={{
              display: "inline-flex",
              alignItems: "center",
              padding: "10px 18px",
              borderRadius: "10px",
              background: "#4f46e5",
              color: "#fff",
              fontSize: "14px",
              fontWeight: 600,
              textDecoration: "none",
              transition: "background 0.15s",
            }}
            onMouseEnter={(e) => { e.currentTarget.style.background = "#4338ca"; }}
            onMouseLeave={(e) => { e.currentTarget.style.background = "#4f46e5"; }}
          >
            Book a Resource
          </Link>
        </div>
      )}

      {/* Bookings list */}
      {!loading && !error && bookings.length > 0 && (
        <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
          {bookings.map((booking) => (
            <div
              key={booking.id}
              style={{
                background: "#ffffff",
                border: "1px solid #f3f4f6",
                borderRadius: "14px",
                padding: "20px 24px",
                boxShadow: "0 1px 4px rgba(0,0,0,0.03)",
                display: "flex",
                justifyContent: "space-between",
                alignItems: "flex-start",
                gap: "16px",
                flexWrap: "wrap",
                transition: "box-shadow 0.2s",
              }}
              onMouseEnter={(e) => { e.currentTarget.style.boxShadow = "0 4px 12px rgba(0,0,0,0.06)"; }}
              onMouseLeave={(e) => { e.currentTarget.style.boxShadow = "0 1px 4px rgba(0,0,0,0.03)"; }}
            >
              {/* Left side */}
              <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
                <div style={{ display: "flex", alignItems: "center", gap: "12px", flexWrap: "wrap" }}>
                  <span style={{ fontWeight: 700, fontSize: "16px", color: "#111827" }}>
                    {booking.resourceName}
                  </span>
                  <span
                    style={{
                      ...STATUS_STYLES[booking.status],
                      fontSize: "12px",
                      fontWeight: 700,
                      padding: "3px 10px",
                      borderRadius: "999px",
                      textTransform: "uppercase",
                      letterSpacing: "0.04em",
                      border: "1px solid transparent",
                    }}
                  >
                    {booking.status}
                  </span>
                </div>

                <span style={{ display: "flex", alignItems: "center", gap: "6px", fontSize: "14px", color: "#6b7280" }}>
                  <FaCalendarAlt size={13} color="#9ca3af" />
                  {formatDateTime(booking.startTime)} → {formatDateTime(booking.endTime)}
                </span>

                <span style={{ display: "flex", alignItems: "center", gap: "6px", fontSize: "14px", color: "#6b7280" }}>
                  <FaBullseye size={13} color="#9ca3af" />
                  {booking.purpose}
                  <span style={{ color: "#d1d5db" }}>|</span>
                  <FaUsers size={13} color="#9ca3af" />
                  {booking.expectedAttendees} attendees
                </span>

                {/* Admin note - only show if rejected or cancelled */}
                {booking.adminNote && (
                  <span
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "6px",
                      fontSize: "13px",
                      color: "#991b1b",
                      background: "#fee2e2",
                      padding: "6px 12px",
                      borderRadius: "8px",
                      marginTop: "4px",
                      fontWeight: 500,
                    }}
                  >
                    <FaStickyNote size={13} color="#991b1b" />
                    {booking.adminNote}
                  </span>
                )}
              </div>

              {/* Right side */}
              <div style={{ display: "flex", gap: "10px", flexWrap: "wrap", alignItems: "flex-start" }}>
                <Link
                  to={`/bookings/${booking.id}`}
                  style={{
                    display: "inline-flex",
                    alignItems: "center",
                    gap: "6px",
                    padding: "8px 14px",
                    borderRadius: "10px",
                    background: "#f3f4f6",
                    color: "#374151",
                    fontSize: "13px",
                    fontWeight: 600,
                    textDecoration: "none",
                    border: "1px solid #e5e7eb",
                    transition: "background 0.15s",
                    flexShrink: 0,
                  }}
                  onMouseEnter={(e) => { e.currentTarget.style.background = "#e5e7eb"; }}
                  onMouseLeave={(e) => { e.currentTarget.style.background = "#f3f4f6"; }}
                >
                  <FaEye size={13} />
                  View Details
                </Link>
                
                {/* Delete button - only for PENDING bookings */}
                {booking.status === "PENDING" && (
                  <button
                    onClick={() => handleDelete(booking.id)}
                    disabled={deleteLoading === booking.id}
                    style={{ 
                      display: "inline-flex",
                      alignItems: "center",
                      gap: "6px",
                      padding: "8px 14px",
                      borderRadius: "10px",
                      background: deleteLoading === booking.id ? "#f9fafb" : "#fef2f2", 
                      color: deleteLoading === booking.id ? "#d1d5db" : "#ef4444", 
                      border: "1px solid #fee2e2",
                      fontSize: "13px",
                      fontWeight: 600,
                      cursor: deleteLoading === booking.id ? "not-allowed" : "pointer",
                      flexShrink: 0,
                      transition: "background 0.15s",
                    }}
                    onMouseEnter={(e) => {
                      if (deleteLoading !== booking.id) e.currentTarget.style.background = "#fecaca";
                    }}
                    onMouseLeave={(e) => {
                      if (deleteLoading !== booking.id) e.currentTarget.style.background = "#fef2f2";
                    }}
                  >
                    <FaTrash size={13} />
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