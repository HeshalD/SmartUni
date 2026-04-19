import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { bookingsApi } from "../../api/bookingApi";
import { resourceApi } from "../../api/resourceApi";

export default function CreateBookingPage() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    resourceId: "",
    resourceName: "",
    startTime: "",
    endTime: "",
    purpose: "",
    expectedAttendees: 1,
  });

  const [errors, setErrors]   = useState({});
  const [apiError, setApiError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [resources, setResources] = useState([]);
  const [resourcesLoading, setResourcesLoading] = useState(false);

  // Fetch available resources on component mount
  useEffect(() => {
    const fetchResources = async () => {
      try {
        setResourcesLoading(true);
        const response = await resourceApi.getAll();
        setResources(response.data);
      } catch (err) {
        console.error('Failed to fetch resources:', err);
        setApiError('Failed to load available resources. Please refresh the page.');
      } finally {
        setResourcesLoading(false);
      }
    };

    fetchResources();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    // Clear field error on change
    setErrors((prev) => ({ ...prev, [name]: null }));
  };

  const handleResourceSelect = (resource) => {
    setFormData((prev) => ({
      ...prev,
      resourceId: resource.id || resource._id,
      resourceName: resource.name || resource.title,
    }));
    // Clear resource-related errors
    setErrors((prev) => ({
      ...prev,
      resourceId: null,
      resourceName: null,
    }));
  };

  const validate = () => {
    const newErrors = {};

    if (!formData.resourceId.trim())
      newErrors.resourceId = "Resource ID is required";

    if (!formData.resourceName.trim())
      newErrors.resourceName = "Resource name is required";

    if (!formData.startTime)
      newErrors.startTime = "Start time is required";

    if (!formData.endTime)
      newErrors.endTime = "End time is required";

    if (formData.startTime && formData.endTime) {
      if (new Date(formData.endTime) <= new Date(formData.startTime))
        newErrors.endTime = "End time must be after start time";

      if (new Date(formData.startTime) <= new Date())
        newErrors.startTime = "Start time must be in the future";
    }

    if (!formData.purpose.trim())
      newErrors.purpose = "Purpose is required";

    if (!formData.expectedAttendees || formData.expectedAttendees < 1)
      newErrors.expectedAttendees = "At least 1 attendee is required";

    return newErrors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setApiError(null);

    // Run frontend validation first
    const validationErrors = validate();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    try {
      setLoading(true);
      await bookingsApi.createBooking({
        ...formData,
        expectedAttendees: parseInt(formData.expectedAttendees),
      });
      navigate("/bookings");
    } catch (err) {
      const data = err.response?.data;

      // Handle field-level validation errors from backend
      if (data?.fields) {
        setErrors(data.fields);
      } else {
        setApiError(data?.error || "Something went wrong. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  // Helper to get min datetime string for the datetime-local input
  const getMinDateTime = () => {
    const now = new Date();
    now.setMinutes(now.getMinutes() + 5);
    return now.toISOString().slice(0, 16);
  };

  return (
    <div className="page-container">

      {/* Header */}
      <div className="page-header">
        <div>
          <h1 className="page-title">New Booking</h1>
          <p className="page-subtitle">Submit a request to book a university resource</p>
        </div>
        <Link to="/bookings" className="btn btn-outline">
          ← Back to My Bookings
        </Link>
      </div>

      {/* Form card */}
      <div
        style={{
          background: "var(--color-surface)",
          border: "1px solid var(--color-border)",
          borderRadius: "var(--radius-lg)",
          padding: "2rem",
          boxShadow: "var(--shadow-sm)",
          maxWidth: "640px",
        }}
      >
        {/* API-level error */}
        {apiError && <div className="alert alert-error">{apiError}</div>}

        <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "1.25rem" }}>

          {/* Resource Selection */}
          <div className="form-group">
            <label htmlFor="resourceSelect">Select Resource</label>
            {resourcesLoading ? (
              <div style={{ padding: '0.75rem', background: 'var(--color-background)', borderRadius: 'var(--radius-md)', textAlign: 'center' }}>
                Loading available resources...
              </div>
            ) : resources.length === 0 ? (
              <div style={{ padding: '0.75rem', background: 'var(--color-error-light)', borderRadius: 'var(--radius-md)', textAlign: 'center' }}>
                No resources available. Please try again later.
              </div>
            ) : (
              <select
                id="resourceSelect"
                name="resourceSelect"
                value={formData.resourceId}
                onChange={(e) => {
                  const selectedResource = resources.find(r => (r.id || r._id) === e.target.value);
                  if (selectedResource) {
                    handleResourceSelect(selectedResource);
                  }
                }}
                style={{
                  width: '100%',
                  padding: '0.75rem',
                  border: '1px solid var(--color-border)',
                  borderRadius: 'var(--radius-md)',
                  background: 'var(--color-surface)',
                  fontSize: '1rem',
                }}
              >
                <option value="">Choose a resource...</option>
                {resources.map((resource) => (
                  <option key={resource.id || resource._id} value={resource.id || resource._id}>
                    {resource.name || resource.title} ({resource.type || 'Resource'})
                  </option>
                ))}
              </select>
            )}
            {(errors.resourceId || errors.resourceName) && (
              <span className="field-error">
                {errors.resourceId || errors.resourceName}
              </span>
            )}
          </div>

          {/* Selected Resource Display */}
          {formData.resourceName && (
            <div className="form-group">
              <label>Selected Resource</label>
              <div style={{
                padding: '0.75rem',
                background: 'var(--color-primary-light)',
                border: '1px solid var(--color-primary)',
                borderRadius: 'var(--radius-md)',
                fontSize: '0.9rem',
                color: 'var(--color-primary-dark)'
              }}>
                <strong>{formData.resourceName}</strong>
                <br />
                <small>ID: {formData.resourceId}</small>
              </div>
            </div>
          )}

          {/* Start & End time side by side */}
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" }}>
            <div className="form-group">
              <label htmlFor="startTime">Start Time</label>
              <input
                id="startTime"
                name="startTime"
                type="datetime-local"
                min={getMinDateTime()}
                value={formData.startTime}
                onChange={handleChange}
              />
              {errors.startTime && (
                <span className="field-error">{errors.startTime}</span>
              )}
            </div>

            <div className="form-group">
              <label htmlFor="endTime">End Time</label>
              <input
                id="endTime"
                name="endTime"
                type="datetime-local"
                min={formData.startTime || getMinDateTime()}
                value={formData.endTime}
                onChange={handleChange}
              />
              {errors.endTime && (
                <span className="field-error">{errors.endTime}</span>
              )}
            </div>
          </div>

          {/* Purpose */}
          <div className="form-group">
            <label htmlFor="purpose">Purpose</label>
            <input
              id="purpose"
              name="purpose"
              type="text"
              placeholder="e.g. Study group session"
              value={formData.purpose}
              onChange={handleChange}
            />
            {errors.purpose && (
              <span className="field-error">{errors.purpose}</span>
            )}
          </div>

          {/* Expected Attendees */}
          <div className="form-group">
            <label htmlFor="expectedAttendees">Expected Attendees</label>
            <input
              id="expectedAttendees"
              name="expectedAttendees"
              type="number"
              min="1"
              placeholder="e.g. 20"
              value={formData.expectedAttendees}
              onChange={handleChange}
            />
            {errors.expectedAttendees && (
              <span className="field-error">{errors.expectedAttendees}</span>
            )}
          </div>

          {/* Actions */}
          <div className="form-actions" style={{ marginTop: "0.5rem" }}>
            <button
              type="submit"
              className="btn btn-primary"
              disabled={loading}
            >
              {loading ? "Submitting..." : "Submit Booking Request"}
            </button>
            <Link to="/bookings" className="btn btn-outline">
              Cancel
            </Link>
          </div>

        </form>
      </div>
    </div>
  );
}