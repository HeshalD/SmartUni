import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { bookingsApi } from "../../api/bookingApi";
import { FaHourglassHalf, FaCheckCircle, FaTimesCircle, FaBan, FaEdit, FaTrashAlt, FaArrowLeft } from "react-icons/fa";

const STATUS_STYLES = {
  PENDING:   { background: "#fef3c7", color: "#92400e" },
  APPROVED:  { background: "#d1fae5", color: "#065f46" },
  REJECTED:  { background: "#fee2e2", color: "#991b1b" },
  CANCELLED: { background: "#f3f4f6", color: "#6b7280" },
};

const STATUS_ICONS = {
  PENDING:   <FaHourglassHalf size={20} />,
  APPROVED:  <FaCheckCircle size={20} />,
  REJECTED:  <FaTimesCircle size={20} />,
  CANCELLED: <FaBan size={20} />,
};

export default function BookingDetailPage() {
  const { id } = useParams();

  const [booking, setBooking] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError]     = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editForm, setEditForm] = useState({
    startTime: "",
    endTime: "",
    purpose: "",
    expectedAttendees: 1,
  });
  const [editErrors, setEditErrors] = useState({});
  const [editLoading, setEditLoading] = useState(false);
  const [editSuccess, setEditSuccess] = useState(null);
  const [deleteLoading, setDeleteLoading] = useState(false);

  useEffect(() => {
    fetchBooking();
  }, [id]);

  const fetchBooking = async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await bookingsApi.getBookingById(id);
      setBooking(res.data.data ?? res.data);
    } catch (err) {
      if (err.response?.status === 404) {
        setError("Booking not found.");
      } else {
        setError("Failed to load booking. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  const formatDateTime = (dt) =>
    new Date(dt).toLocaleString("en-GB", {
      dateStyle: "long",
      timeStyle: "short",
    });

  const formatDateTimeForInput = (dt) => {
    const date = new Date(dt);
    return date.toISOString().slice(0, 16);
  };

  const handleEditClick = () => {
    setEditForm({
      startTime: formatDateTimeForInput(booking.startTime),
      endTime: formatDateTimeForInput(booking.endTime),
      purpose: booking.purpose,
      expectedAttendees: booking.expectedAttendees,
    });
    setEditErrors({});
    setEditSuccess(null);
    setIsEditing(true);
  };

  const handleEditChange = (e) => {
    const { name, value } = e.target;
    setEditForm(prev => ({ ...prev, [name]: value }));
    setEditErrors(prev => ({ ...prev, [name]: null }));
  };

  const validateEditForm = () => {
    const errors = {};

    if (!editForm.startTime.trim())
      errors.startTime = "Start time is required";

    if (!editForm.endTime.trim())
      errors.endTime = "End time is required";

    if (editForm.startTime && editForm.endTime) {
      if (new Date(editForm.endTime) <= new Date(editForm.startTime))
        errors.endTime = "End time must be after start time";

      if (new Date(editForm.startTime) <= new Date())
        errors.startTime = "Start time must be in the future";
    }

    if (!editForm.purpose.trim())
      errors.purpose = "Purpose is required";

    if (!editForm.expectedAttendees || editForm.expectedAttendees < 1)
      errors.expectedAttendees = "At least 1 attendee is required";

    return errors;
  };

  const handleEditSubmit = async (e) => {
    e.preventDefault();
    const errors = validateEditForm();
    if (Object.keys(errors).length > 0) {
      setEditErrors(errors);
      return;
    }

    try {
      setEditLoading(true);
      await bookingsApi.updateBooking(booking.id, {
        startTime: editForm.startTime,
        endTime: editForm.endTime,
        purpose: editForm.purpose,
        expectedAttendees: parseInt(editForm.expectedAttendees),
      });
      setEditSuccess("Booking updated successfully!");
      setIsEditing(false);
      fetchBooking();
    } catch (err) {
      setEditErrors({ submit: "Failed to update booking. Please try again." });
    } finally {
      setEditLoading(false);
    }
  };

  const handleCancelEdit = () => {
    setIsEditing(false);
    setEditErrors({});
    setEditSuccess(null);
  };

  const handleDelete = async () => {
    if (!window.confirm("Are you sure you want to delete this booking? This action cannot be undone.")) {
      return;
    }

    try {
      setDeleteLoading(true);
      await bookingsApi.deleteBooking(booking.id);
      // Redirect to my bookings after successful deletion
      window.location.href = "/bookings";
    } catch (err) {
      setEditErrors({ submit: "Failed to delete booking. Please try again." });
    } finally {
      setDeleteLoading(false);
    }
  };

  const getMinDateTime = () => {
    const now = new Date();
    now.setMinutes(now.getMinutes() + 5);
    return now.toISOString().slice(0, 16);
  };

  // Loading state
  if (loading) {
    return (
      <div style={{ textAlign: "center", padding: "40px", color: "#9ca3af", fontSize: "14px" }}>
        <div style={{ width: "32px", height: "32px", border: "3px solid #f3f4f6", borderTopColor: "#4f46e5", borderRadius: "50%", margin: "0 auto 12px", animation: "spin 0.8s linear infinite" }} />
        Loading booking...
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div style={{ maxWidth: "1280px", margin: "0 auto", padding: "24px" }}>
        <div style={{ marginTop: "32px", padding: "12px 16px", borderRadius: "10px", background: "#fef2f2", color: "#991b1b", fontSize: "14px", fontWeight: 500, border: "1px solid #fee2e2" }}>
          {error}
        </div>
        <Link to="/bookings" style={{ display: "inline-flex", alignItems: "center", gap: "6px", marginTop: "16px", padding: "8px 14px", borderRadius: "10px", background: "#f3f4f6", color: "#374151", fontSize: "13px", fontWeight: 600, textDecoration: "none", border: "1px solid #e5e7eb", transition: "background 0.15s" }}>
          <FaArrowLeft size={12} />
          Back to My Bookings
        </Link>
      </div>
    );
  }

  return (
    <div style={{ maxWidth: "1280px", margin: "0 auto", padding: "24px" }}>

      {/* Header */}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: "16px", marginBottom: "28px" }}>
        <div>
          <h1 style={{ fontSize: "24px", fontWeight: 700, color: "#111827", margin: 0 }}>Booking Details</h1>
          <p style={{ fontSize: "14px", color: "#6b7280", margin: "4px 0 0 0" }}>Full details of your booking request</p>
        </div>
        <div style={{ display: "flex", gap: "10px" }}>
          {booking.status === "PENDING" && (
            <>
              <button
                onClick={handleEditClick}
                disabled={isEditing || deleteLoading}
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: "6px",
                  padding: "9px 16px",
                  borderRadius: "10px",
                  background: isEditing || deleteLoading ? "#f3f4f6" : "#4f46e5",
                  color: isEditing || deleteLoading ? "#9ca3af" : "#fff",
                  fontSize: "13px",
                  fontWeight: 600,
                  border: "none",
                  cursor: isEditing || deleteLoading ? "not-allowed" : "pointer",
                  transition: "background 0.15s",
                }}
                onMouseEnter={(e) => { if (!isEditing && !deleteLoading) e.currentTarget.style.background = "#4338ca"; }}
                onMouseLeave={(e) => { if (!isEditing && !deleteLoading) e.currentTarget.style.background = "#4f46e5"; }}
              >
                <FaEdit size={13} />
                {isEditing ? "Editing..." : "Edit Booking"}
              </button>
              <button
                onClick={handleDelete}
                disabled={deleteLoading || isEditing}
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: "6px",
                  padding: "9px 16px",
                  borderRadius: "10px",
                  background: deleteLoading || isEditing ? "#f9fafb" : "#ef4444",
                  color: deleteLoading || isEditing ? "#d1d5db" : "#fff",
                  border: "none",
                  fontSize: "13px",
                  fontWeight: 600,
                  cursor: deleteLoading || isEditing ? "not-allowed" : "pointer",
                  transition: "background 0.15s",
                }}
                onMouseEnter={(e) => { if (!deleteLoading && !isEditing) e.currentTarget.style.background = "#dc2626"; }}
                onMouseLeave={(e) => { if (!deleteLoading && !isEditing) e.currentTarget.style.background = "#ef4444"; }}
              >
                <FaTrashAlt size={13} />
                {deleteLoading ? "Deleting..." : "Delete Booking"}
              </button>
            </>
          )}
          <Link to="/bookings" style={{ display: "inline-flex", alignItems: "center", gap: "6px", padding: "9px 16px", borderRadius: "10px", background: "#f3f4f6", color: "#374151", fontSize: "13px", fontWeight: 600, textDecoration: "none", border: "1px solid #e5e7eb", transition: "background 0.15s" }}>
            <FaArrowLeft size={12} />
            Back to My Bookings
          </Link>
        </div>
      </div>

      {/* Success message */}
      {editSuccess && (
        <div style={{ marginBottom: "16px", padding: "12px 16px", borderRadius: "10px", background: "#ecfdf5", color: "#065f46", fontSize: "14px", fontWeight: 500, border: "1px solid #d1fae5" }}>{editSuccess}</div>
      )}

      {/* Edit Form */}
      {isEditing && (
        <div
          style={{
            background: "#ffffff",
            border: "1px solid #e5e7eb",
            borderRadius: "14px",
            padding: "28px",
            boxShadow: "0 1px 4px rgba(0,0,0,0.03)",
            maxWidth: "720px",
            marginBottom: "24px",
          }}
        >
          <h2 style={{ fontSize: "18px", fontWeight: 700, marginBottom: "20px", color: "#111827" }}>
            Edit Booking
          </h2>

          {editErrors.submit && (
            <div style={{ marginBottom: "16px", padding: "12px 16px", borderRadius: "10px", background: "#fef2f2", color: "#991b1b", fontSize: "14px", fontWeight: 500, border: "1px solid #fee2e2" }}>
              {editErrors.submit}
            </div>
          )}

          <form onSubmit={handleEditSubmit} style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
            
            {/* Start & End time side by side */}
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px" }}>
              <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
                <label htmlFor="editStartTime" style={{ fontSize: "13px", fontWeight: 600, color: "#374151" }}>Start Time</label>
                <input
                  id="editStartTime"
                  name="startTime"
                  type="datetime-local"
                  min={getMinDateTime()}
                  value={editForm.startTime}
                  onChange={handleEditChange}
                  style={{ padding: "10px 12px", borderRadius: "10px", border: "1px solid #e5e7eb", fontSize: "13px", outline: "none", color: "#374151" }}
                />
                {editErrors.startTime && (
                  <span style={{ fontSize: "12px", color: "#ef4444", marginTop: "2px" }}>{editErrors.startTime}</span>
                )}
              </div>

              <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
                <label htmlFor="editEndTime" style={{ fontSize: "13px", fontWeight: 600, color: "#374151" }}>End Time</label>
                <input
                  id="editEndTime"
                  name="endTime"
                  type="datetime-local"
                  min={editForm.startTime || getMinDateTime()}
                  value={editForm.endTime}
                  onChange={handleEditChange}
                  style={{ padding: "10px 12px", borderRadius: "10px", border: "1px solid #e5e7eb", fontSize: "13px", outline: "none", color: "#374151" }}
                />
                {editErrors.endTime && (
                  <span style={{ fontSize: "12px", color: "#ef4444", marginTop: "2px" }}>{editErrors.endTime}</span>
                )}
              </div>
            </div>

            {/* Purpose */}
            <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
              <label htmlFor="editPurpose" style={{ fontSize: "13px", fontWeight: 600, color: "#374151" }}>Purpose</label>
              <input
                id="editPurpose"
                name="purpose"
                type="text"
                placeholder="e.g. Study group session"
                value={editForm.purpose}
                onChange={handleEditChange}
                style={{ padding: "10px 12px", borderRadius: "10px", border: "1px solid #e5e7eb", fontSize: "13px", outline: "none", color: "#374151" }}
              />
              {editErrors.purpose && (
                <span style={{ fontSize: "12px", color: "#ef4444", marginTop: "2px" }}>{editErrors.purpose}</span>
              )}
            </div>

            {/* Expected Attendees */}
            <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
              <label htmlFor="editExpectedAttendees" style={{ fontSize: "13px", fontWeight: 600, color: "#374151" }}>Expected Attendees</label>
              <input
                id="editExpectedAttendees"
                name="expectedAttendees"
                type="number"
                min="1"
                placeholder="e.g. 20"
                value={editForm.expectedAttendees}
                onChange={handleEditChange}
                style={{ padding: "10px 12px", borderRadius: "10px", border: "1px solid #e5e7eb", fontSize: "13px", outline: "none", color: "#374151" }}
              />
              {editErrors.expectedAttendees && (
                <span style={{ fontSize: "12px", color: "#ef4444", marginTop: "2px" }}>{editErrors.expectedAttendees}</span>
              )}
            </div>

            {/* Actions */}
            <div style={{ display: "flex", gap: "10px", marginTop: "8px" }}>
              <button
                type="submit"
                disabled={editLoading}
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  padding: "10px 18px",
                  borderRadius: "10px",
                  background: editLoading ? "#f3f4f6" : "#4f46e5",
                  color: editLoading ? "#9ca3af" : "#fff",
                  fontSize: "14px",
                  fontWeight: 600,
                  border: "none",
                  cursor: editLoading ? "not-allowed" : "pointer",
                  transition: "background 0.15s",
                }}
                onMouseEnter={(e) => { if (!editLoading) e.currentTarget.style.background = "#4338ca"; }}
                onMouseLeave={(e) => { if (!editLoading) e.currentTarget.style.background = "#4f46e5"; }}
              >
                {editLoading ? "Updating..." : "Update Booking"}
              </button>
              <button
                type="button"
                onClick={handleCancelEdit}
                disabled={editLoading}
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  padding: "10px 18px",
                  borderRadius: "10px",
                  background: "#f3f4f6",
                  color: "#374151",
                  fontSize: "14px",
                  fontWeight: 600,
                  border: "1px solid #e5e7eb",
                  cursor: editLoading ? "not-allowed" : "pointer",
                  transition: "background 0.15s",
                }}
                onMouseEnter={(e) => { if (!editLoading) e.currentTarget.style.background = "#e5e7eb"; }}
                onMouseLeave={(e) => { if (!editLoading) e.currentTarget.style.background = "#f3f4f6"; }}
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Main card */}
      <div
        style={{
          background: "#ffffff",
          border: "1px solid #e5e7eb",
          borderRadius: "14px",
          boxShadow: "0 1px 4px rgba(0,0,0,0.03)",
          overflow: "hidden",
          maxWidth: "720px",
        }}
      >
        {/* Card top banner - color based on status */}
        <div
          style={{
            background: STATUS_STYLES[booking.status].background,
            padding: "20px 24px",
            display: "flex",
            alignItems: "center",
            gap: "12px",
            borderBottom: "1px solid #e5e7eb",
          }}
        >
          <span style={{ display: "flex", alignItems: "center" }}>
            {STATUS_ICONS[booking.status]}
          </span>
          <div>
            <div style={{ fontWeight: 700, fontSize: "16px", color: STATUS_STYLES[booking.status].color }}>
              {booking.status}
            </div>
            <div style={{ fontSize: "13px", color: "#9ca3af" }}>
              Submitted on {formatDateTime(booking.createdAt)}
            </div>
          </div>
        </div>

        {/* Card body */}
        <div style={{ padding: "28px", display: "flex", flexDirection: "column", gap: "24px" }}>

          {/* Resource info */}
          <Section title="Resource">
            <Row label="Resource Name" value={booking.resourceName} />
            <Row label="Resource ID"   value={booking.resourceId} />
          </Section>

          {/* Booking info */}
          <Section title="Booking Info">
            <Row label="Purpose"    value={booking.purpose} />
            <Row label="Attendees"  value={`${booking.expectedAttendees} people`} />
            <Row label="Start Time" value={formatDateTime(booking.startTime)} />
            <Row label="End Time"   value={formatDateTime(booking.endTime)} />
          </Section>

          {/* Admin review — only show if reviewed */}
          {booking.reviewedBy && (
            <Section title="Admin Review">
              <Row label="Reviewed By" value={booking.reviewedBy} />
              <Row label="Reviewed At" value={formatDateTime(booking.reviewedAt)} />
              {booking.adminNote && (
                <Row label="Note" value={booking.adminNote} highlight={booking.status === "REJECTED"} />
              )}
            </Section>
          )}

          {/* Audit info */}
          <Section title="Audit">
            <Row label="Booking ID"   value={booking.id} mono />
            <Row label="Created At"   value={formatDateTime(booking.createdAt)} />
            <Row label="Last Updated" value={formatDateTime(booking.updatedAt)} />
          </Section>

        </div>
      </div>
    </div>
  );
}

// ─── Helper components ────────────────────────────────────────────────────────

function Section({ title, children }) {
  return (
    <div>
      <h3
        style={{
          fontSize: "0.8rem",
          fontWeight: 700,
          textTransform: "uppercase",
          letterSpacing: "0.06em",
          color: "#9ca3af",
          marginBottom: "0.75rem",
        }}
      >
        {title}
      </h3>
      <div
        style={{
          background: "#f9fafb",
          border: "1px solid #e5e7eb",
          borderRadius: "10px",
          overflow: "hidden",
        }}
      >
        {children}
      </div>
    </div>
  );
}

function Row({ label, value, mono = false, highlight = false }) {
  return (
    <div
      style={{
        display: "flex",
        alignItems: "flex-start",
        gap: "1rem",
        padding: "0.75rem 1rem",
        borderBottom: "1px solid #e5e7eb",
        background: highlight ? "#fee2e2" : "transparent",
      }}
    >
      <span
        style={{
          fontSize: "0.875rem",
          fontWeight: 500,
          color: "#9ca3af",
          width: "130px",
          flexShrink: 0,
        }}
      >
        {label}
      </span>
      <span
        style={{
          fontSize: "0.875rem",
          color: highlight ? "#991b1b" : "#374151",
          fontFamily: mono ? "monospace" : "inherit",
          wordBreak: "break-all",
        }}
      >
        {value}
      </span>
    </div>
  );
}