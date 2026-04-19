import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { bookingsApi } from "../../api/bookingApi";

const STATUS_STYLES = {
  PENDING:   { background: "#fef3c7", color: "#92400e" },
  APPROVED:  { background: "#d1fae5", color: "#065f46" },
  REJECTED:  { background: "#fee2e2", color: "#991b1b" },
  CANCELLED: { background: "#f3f4f6", color: "#6b7280" },
};

const STATUS_ICONS = {
  PENDING:   "⏳",
  APPROVED:  "✅",
  REJECTED:  "❌",
  CANCELLED: "🚫",
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
      <div className="loading-spinner">
        <div className="spinner" />
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="page-container">
        <div className="alert alert-error" style={{ marginTop: "2rem" }}>
          {error}
        </div>
        <Link to="/booking" className="btn btn-outline" style={{ marginTop: "1rem" }}>
          ← Back to My Bookings
        </Link>
      </div>
    );
  }

  return (
    <div className="page-container">

      {/* Header */}
      <div className="page-header">
        <div>
          <h1 className="page-title">Booking Details</h1>
          <p className="page-subtitle">Full details of your booking request</p>
        </div>
        <div style={{ display: "flex", gap: "0.75rem" }}>
          {booking.status === "PENDING" && (
            <>
              <button
                onClick={handleEditClick}
                className="btn btn-primary"
                disabled={isEditing || deleteLoading}
              >
                {isEditing ? "Editing..." : "Edit Booking"}
              </button>
              <button
                onClick={handleDelete}
                className="btn"
                disabled={deleteLoading || isEditing}
                style={{
                  background: "var(--color-danger)",
                  color: "#fff",
                  border: "none",
                }}
              >
                {deleteLoading ? "Deleting..." : "Delete Booking"}
              </button>
            </>
          )}
          <Link to="/bookings" className="btn btn-outline">
            ← Back to My Bookings
          </Link>
        </div>
      </div>

      {/* Success message */}
      {editSuccess && (
        <div className="alert alert-success">{editSuccess}</div>
      )}

      {/* Edit Form */}
      {isEditing && (
        <div
          style={{
            background: "var(--color-surface)",
            border: "1px solid var(--color-border)",
            borderRadius: "var(--radius-lg)",
            padding: "2rem",
            boxShadow: "var(--shadow-sm)",
            maxWidth: "720px",
          }}
        >
          <h2 style={{ fontSize: "1.25rem", fontWeight: 700, marginBottom: "1.5rem" }}>
            Edit Booking
          </h2>

          {editErrors.submit && (
            <div className="alert alert-error" style={{ marginBottom: "1rem" }}>
              {editErrors.submit}
            </div>
          )}

          <form onSubmit={handleEditSubmit} style={{ display: "flex", flexDirection: "column", gap: "1.25rem" }}>
            
            {/* Start & End time side by side */}
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" }}>
              <div className="form-group">
                <label htmlFor="editStartTime">Start Time</label>
                <input
                  id="editStartTime"
                  name="startTime"
                  type="datetime-local"
                  min={getMinDateTime()}
                  value={editForm.startTime}
                  onChange={handleEditChange}
                />
                {editErrors.startTime && (
                  <span className="field-error">{editErrors.startTime}</span>
                )}
              </div>

              <div className="form-group">
                <label htmlFor="editEndTime">End Time</label>
                <input
                  id="editEndTime"
                  name="endTime"
                  type="datetime-local"
                  min={editForm.startTime || getMinDateTime()}
                  value={editForm.endTime}
                  onChange={handleEditChange}
                />
                {editErrors.endTime && (
                  <span className="field-error">{editErrors.endTime}</span>
                )}
              </div>
            </div>

            {/* Purpose */}
            <div className="form-group">
              <label htmlFor="editPurpose">Purpose</label>
              <input
                id="editPurpose"
                name="purpose"
                type="text"
                placeholder="e.g. Study group session"
                value={editForm.purpose}
                onChange={handleEditChange}
              />
              {editErrors.purpose && (
                <span className="field-error">{editErrors.purpose}</span>
              )}
            </div>

            {/* Expected Attendees */}
            <div className="form-group">
              <label htmlFor="editExpectedAttendees">Expected Attendees</label>
              <input
                id="editExpectedAttendees"
                name="expectedAttendees"
                type="number"
                min="1"
                placeholder="e.g. 20"
                value={editForm.expectedAttendees}
                onChange={handleEditChange}
              />
              {editErrors.expectedAttendees && (
                <span className="field-error">{editErrors.expectedAttendees}</span>
              )}
            </div>

            {/* Actions */}
            <div className="form-actions" style={{ marginTop: "0.5rem" }}>
              <button
                type="submit"
                className="btn btn-primary"
                disabled={editLoading}
              >
                {editLoading ? "Updating..." : "Update Booking"}
              </button>
              <button
                type="button"
                className="btn btn-outline"
                onClick={handleCancelEdit}
                disabled={editLoading}
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
          background: "var(--color-surface)",
          border: "1px solid var(--color-border)",
          borderRadius: "var(--radius-lg)",
          boxShadow: "var(--shadow-sm)",
          overflow: "hidden",
          maxWidth: "720px",
        }}
      >
        {/* Card top banner - color based on status */}
        <div
          style={{
            background: STATUS_STYLES[booking.status].background,
            padding: "1.25rem 1.5rem",
            display: "flex",
            alignItems: "center",
            gap: "0.75rem",
            borderBottom: "1px solid var(--color-border)",
          }}
        >
          <span style={{ fontSize: "1.5rem" }}>
            {STATUS_ICONS[booking.status]}
          </span>
          <div>
            <div style={{ fontWeight: 700, fontSize: "1.1rem", color: STATUS_STYLES[booking.status].color }}>
              {booking.status}
            </div>
            <div style={{ fontSize: "0.85rem", color: "var(--color-text-muted)" }}>
              Submitted on {formatDateTime(booking.createdAt)}
            </div>
          </div>
        </div>

        {/* Card body */}
        <div style={{ padding: "1.75rem", display: "flex", flexDirection: "column", gap: "1.5rem" }}>

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
          color: "var(--color-text-muted)",
          marginBottom: "0.75rem",
        }}
      >
        {title}
      </h3>
      <div
        style={{
          background: "var(--color-bg)",
          border: "1px solid var(--color-border)",
          borderRadius: "var(--radius-md)",
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
        borderBottom: "1px solid var(--color-border)",
        background: highlight ? "#fee2e2" : "transparent",
      }}
    >
      <span
        style={{
          fontSize: "0.875rem",
          fontWeight: 500,
          color: "var(--color-text-muted)",
          width: "130px",
          flexShrink: 0,
        }}
      >
        {label}
      </span>
      <span
        style={{
          fontSize: "0.875rem",
          color: highlight ? "#991b1b" : "var(--color-text)",
          fontFamily: mono ? "monospace" : "inherit",
          wordBreak: "break-all",
        }}
      >
        {value}
      </span>
    </div>
  );
}