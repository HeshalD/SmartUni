import { useState, useEffect, useCallback } from "react";
import { resourceApi } from "../../api/resourceApi";
import {
  FaBox,
  FaPlus,
  FaSearch,
  FaFilter,
  FaTimes,
  FaEdit,
  FaTrash,
  FaSpinner,
  FaCheckCircle,
  FaExclamationTriangle,
  FaTag,
  FaMapMarkerAlt,
  FaUsers,
  FaToggleOn,
  FaToggleOff,
  FaSave,
  FaBan,
} from "react-icons/fa";

// ─── Resource type options ──────────────────────────────────────────────────
const CATEGORY_OPTIONS = ["ALL", "ROOM", "EQUIPMENT", "LAB", "AUDITORIUM", "OTHER"];

const CATEGORY_STYLES = {
  ROOM:       { background: "#dbeafe", color: "#1d4ed8" },
  EQUIPMENT:  { background: "#fef3c7", color: "#92400e" },
  LAB:        { background: "#d1fae5", color: "#065f46" },
  AUDITORIUM: { background: "#ede9fe", color: "#6d28d9" },
  OTHER:      { background: "#f3f4f6", color: "#6b7280" },
};

// ─── Blank form ─────────────────────────────────────────────────────────────
const BLANK_FORM = {
  name: "",
  description: "",
  category: "ROOM",
  location: "",
  capacity: "",
  available: true,
};

// ─── Field validation ────────────────────────────────────────────────────────
function validateForm(form, mode) {
  const errors = {};
  if (!form.name.trim())       errors.name     = "Name is required.";
  if (!form.category)          errors.category = "Category is required.";
  if (!form.location.trim())   errors.location = "Location is required.";
  // capacity is @NotNull on create, optional on update
  if (mode === "add" && (form.capacity === "" || isNaN(form.capacity) || Number(form.capacity) < 1))
    errors.capacity = "Capacity is required and must be at least 1.";
  if (mode === "edit" && form.capacity !== "" && (isNaN(form.capacity) || Number(form.capacity) < 1))
    errors.capacity = "Capacity must be a positive number.";
  return errors;
}

// ─── Resource card ───────────────────────────────────────────────────────────
function ResourceCard({ resource, onEdit, onDelete, actionLoading }) {
  const categoryStyle = CATEGORY_STYLES[resource.category] ?? CATEGORY_STYLES.OTHER;

  return (
    <div
      style={{
        background: "var(--color-surface)",
        border: "1px solid var(--color-border)",
        borderRadius: "var(--radius-md)",
        boxShadow: "var(--shadow-sm)",
        padding: "1.25rem",
        display: "flex",
        flexDirection: "column",
        gap: "0.75rem",
        transition: "box-shadow 0.2s, transform 0.2s",
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.boxShadow = "var(--shadow-md)";
        e.currentTarget.style.transform = "translateY(-2px)";
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.boxShadow = "var(--shadow-sm)";
        e.currentTarget.style.transform = "translateY(0)";
      }}
    >
      {/* Top row */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: "0.75rem" }}>
        <div style={{ display: "flex", flexDirection: "column", gap: "0.35rem", flex: 1, minWidth: 0 }}>
          <span style={{ fontWeight: 700, fontSize: "1rem", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
            {resource.name}
          </span>
          <div style={{ display: "flex", gap: "0.5rem", flexWrap: "wrap", alignItems: "center" }}>
            {/* Type badge */}
            <span
              style={{
                ...categoryStyle,
                fontSize: "0.7rem",
                fontWeight: 700,
                padding: "0.18rem 0.55rem",
                borderRadius: "999px",
                textTransform: "uppercase",
                letterSpacing: "0.04em",
              }}
            >
              <FaTag size={9} style={{ marginRight: "4px", verticalAlign: "middle" }} />
              {resource.category}
            </span>

            {/* Availability badge */}
            <span
              style={{
                fontSize: "0.7rem",
                fontWeight: 700,
                padding: "0.18rem 0.55rem",
                borderRadius: "999px",
                textTransform: "uppercase",
                letterSpacing: "0.04em",
                background: resource.available ? "#d1fae5" : "#fee2e2",
                color:      resource.available ? "#065f46" : "#991b1b",
              }}
            >
              {resource.available ? (
                <><FaToggleOn size={10} style={{ marginRight: "4px", verticalAlign: "middle" }} />Available</>
              ) : (
                <><FaToggleOff size={10} style={{ marginRight: "4px", verticalAlign: "middle" }} />Unavailable</>
              )}
            </span>
          </div>
        </div>

        {/* Actions */}
        <div style={{ display: "flex", gap: "0.4rem", flexShrink: 0 }}>
          <button
            onClick={() => onEdit(resource)}
            disabled={actionLoading}
            title="Edit resource"
            style={{
              padding: "6px 10px",
              borderRadius: "6px",
              border: "1px solid var(--color-border)",
              background: "#f0f9ff",
              color: "#0369a1",
              cursor: "pointer",
              fontSize: "12px",
              display: "inline-flex",
              alignItems: "center",
              gap: "4px",
              transition: "background 0.15s",
            }}
            onMouseEnter={(e) => { e.currentTarget.style.background = "#e0f2fe"; }}
            onMouseLeave={(e) => { e.currentTarget.style.background = "#f0f9ff"; }}
          >
            <FaEdit size={12} />
          </button>
          <button
            onClick={() => onDelete(resource.id)}
            disabled={actionLoading}
            title="Delete resource"
            style={{
              padding: "6px 10px",
              borderRadius: "6px",
              border: "1px solid #fee2e2",
              background: "#fef2f2",
              color: "#ef4444",
              cursor: "pointer",
              fontSize: "12px",
              display: "inline-flex",
              alignItems: "center",
              gap: "4px",
              transition: "background 0.15s",
            }}
            onMouseEnter={(e) => { e.currentTarget.style.background = "#fee2e2"; }}
            onMouseLeave={(e) => { e.currentTarget.style.background = "#fef2f2"; }}
          >
            <FaTrash size={12} />
          </button>
        </div>
      </div>

      {/* Description */}
      {resource.description && (
        <p style={{ fontSize: "0.85rem", color: "var(--color-text-muted)", margin: 0, lineHeight: 1.5 }}>
          {resource.description}
        </p>
      )}

      {/* Meta row */}
      <div style={{ display: "flex", gap: "1rem", flexWrap: "wrap" }}>
        {resource.location && (
          <span style={{ fontSize: "0.82rem", color: "#6b7280", display: "flex", alignItems: "center", gap: "5px" }}>
            <FaMapMarkerAlt size={11} /> {resource.location}
          </span>
        )}
        {resource.capacity && (
          <span style={{ fontSize: "0.82rem", color: "#6b7280", display: "flex", alignItems: "center", gap: "5px" }}>
            <FaUsers size={11} /> Capacity: {resource.capacity}
          </span>
        )}
      </div>
    </div>
  );
}

// ─── Resource form modal ─────────────────────────────────────────────────────
function ResourceFormModal({ mode, form, onChange, onSubmit, onClose, loading, error }) {
  const isEdit  = mode === "edit";
  const errors  = validateForm(form, mode);
  const hasErr  = Object.keys(errors).length > 0;

  return (
    <>
      {/* Backdrop */}
      <div
        onClick={onClose}
        style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.45)", zIndex: 300 }}
      />

      {/* Panel */}
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
          maxWidth: "520px",
          zIndex: 400,
          boxShadow: "var(--shadow-lg)",
          maxHeight: "90vh",
          overflowY: "auto",
        }}
      >
        <h2 style={{ fontSize: "1.1rem", fontWeight: 700, marginBottom: "0.3rem" }}>
          {isEdit ? "Edit Resource" : "Add New Resource"}
        </h2>
        <p style={{ fontSize: "0.875rem", color: "var(--color-text-muted)", marginBottom: "1.5rem" }}>
          {isEdit
            ? "Update the resource details below."
            : "Fill in the details to add a new resource to the system."}
        </p>

        {error && <div className="alert alert-error" style={{ marginBottom: "1rem" }}>{error}</div>}

        {/* Name */}
        <div className="form-group" style={{ marginBottom: "1rem" }}>
          <label htmlFor="res-name">Name *</label>
          <input
            id="res-name"
            type="text"
            placeholder="e.g. Conference Room A"
            value={form.name}
            onChange={(e) => onChange("name", e.target.value)}
          />
          {errors.name && <span className="field-error">{errors.name}</span>}
        </div>

        {/* Description */}
        <div className="form-group" style={{ marginBottom: "1rem" }}>
          <label htmlFor="res-description">Description</label>
          <textarea
            id="res-description"
            placeholder="Brief description of this resource..."
            value={form.description}
            onChange={(e) => onChange("description", e.target.value)}
            rows={3}
            style={{
              width: "100%",
              padding: "0.6rem 0.9rem",
              border: "1px solid var(--color-border)",
              borderRadius: "var(--radius-sm)",
              background: "var(--color-surface)",
              fontSize: "0.95rem",
              resize: "vertical",
              minHeight: "70px",
              fontFamily: "inherit",
              transition: "border-color 0.15s, box-shadow 0.15s",
            }}
            onFocus={(e) => {
              e.target.style.outline = "none";
              e.target.style.borderColor = "var(--color-primary)";
              e.target.style.boxShadow = "0 0 0 3px rgba(99,102,241,0.15)";
            }}
            onBlur={(e) => {
              e.target.style.borderColor = "var(--color-border)";
              e.target.style.boxShadow = "none";
            }}
          />
        </div>

        {/* Type & Location row */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem", marginBottom: "1rem" }}>
          <div className="form-group" style={{ margin: 0 }}>
            <label htmlFor="res-category">Category *</label>
            <select
              id="res-category"
              value={form.category}
              onChange={(e) => onChange("category", e.target.value)}
              style={{
                padding: "0.6rem 0.9rem",
                border: "1px solid var(--color-border)",
                borderRadius: "var(--radius-sm)",
                fontSize: "0.95rem",
                background: "var(--color-surface)",
                width: "100%",
                cursor: "pointer",
              }}
            >
              {CATEGORY_OPTIONS.filter((t) => t !== "ALL").map((t) => (
                <option key={t} value={t}>{t}</option>
              ))}
            </select>
            {errors.category && <span className="field-error">{errors.category}</span>}
          </div>

          <div className="form-group" style={{ margin: 0 }}>
            <label htmlFor="res-location">Location *</label>
            <input
              id="res-location"
              type="text"
              placeholder="e.g. Block A, 2nd Floor"
              value={form.location}
              onChange={(e) => onChange("location", e.target.value)}
            />
            {errors.location && <span className="field-error">{errors.location}</span>}
          </div>
        </div>

        {/* Capacity & Available row */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem", marginBottom: "1.5rem" }}>
          <div className="form-group" style={{ margin: 0 }}>
            <label htmlFor="res-capacity">Capacity</label>
            <input
              id="res-capacity"
              type="number"
              min="1"
              placeholder="e.g. 30"
              value={form.capacity}
              onChange={(e) => onChange("capacity", e.target.value)}
            />
            {errors.capacity && <span className="field-error">{errors.capacity}</span>}
          </div>

          <div className="form-group" style={{ margin: 0 }}>
            <label>Availability</label>
            <div style={{ display: "flex", alignItems: "center", gap: "0.75rem", marginTop: "0.4rem" }}>
              <button
                type="button"
                onClick={() => onChange("available", !form.available)}
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: "0.5rem",
                  padding: "0.45rem 1rem",
                  borderRadius: "var(--radius-sm)",
                  border: "1px solid var(--color-border)",
                  background: form.available ? "#d1fae5" : "#fee2e2",
                  color:      form.available ? "#065f46" : "#991b1b",
                  fontWeight: 600,
                  fontSize: "0.875rem",
                  cursor: "pointer",
                  transition: "background 0.2s",
                }}
              >
                {form.available
                  ? <><FaToggleOn size={15} /> Available</>
                  : <><FaToggleOff size={15} /> Unavailable</>}
              </button>
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="form-actions">
          <button
            className="btn"
            disabled={loading || hasErr}
            onClick={onSubmit}
            style={{
              background: "var(--color-primary)",
              color: "#fff",
              border: "none",
              display: "inline-flex",
              alignItems: "center",
              gap: "6px",
            }}
          >
            {loading
              ? <><FaSpinner size={13} style={{ animation: "spin 1s linear infinite" }} /> Saving…</>
              : <><FaSave size={13} /> {isEdit ? "Save Changes" : "Create Resource"}</>}
          </button>
          <button className="btn btn-outline" onClick={onClose}>
            <FaBan size={13} /> Cancel
          </button>
        </div>
      </div>
    </>
  );
}

// ─── Main page ───────────────────────────────────────────────────────────────
export default function AdminResourcesPage() {
  const [resources,     setResources]     = useState([]);
  const [loading,       setLoading]       = useState(true);
  const [error,         setError]         = useState(null);
  const [successMsg,    setSuccessMsg]    = useState(null);
  const [actionLoading, setActionLoading] = useState(false);
  const [actionError,   setActionError]   = useState(null);

  // Filters
  const [searchQuery,    setSearchQuery]    = useState("");
  const [categoryFilter, setCategoryFilter] = useState("ALL");
  const [availFilter,    setAvailFilter]    = useState("ALL"); // ALL | AVAILABLE | UNAVAILABLE

  // Modal state
  const [modalMode, setModalMode] = useState(null); // "add" | "edit" | null
  const [editId,    setEditId]    = useState(null);
  const [form,      setForm]      = useState({ ...BLANK_FORM });

  // ── Data fetching ──────────────────────────────────────────────────────────
  const fetchResources = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const params = {};
      if (categoryFilter !== "ALL")       params.category = categoryFilter;
      if (availFilter === "AVAILABLE")    params.available = true;
      if (availFilter === "UNAVAILABLE")  params.available = false;
      const res = await resourceApi.getAll(params);
      setResources(res.data.data ?? res.data);
    } catch {
      setError("Failed to load resources. Please try again.");
    } finally {
      setLoading(false);
    }
  }, [categoryFilter, availFilter]);

  useEffect(() => { fetchResources(); }, [fetchResources]);

  // ── Helpers ────────────────────────────────────────────────────────────────
  const showSuccess = (msg) => {
    setSuccessMsg(msg);
    setTimeout(() => setSuccessMsg(null), 3500);
  };

  const handleFormChange = (field, value) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  // ── Filtered list (client-side search) ────────────────────────────────────
  const displayed = resources.filter((r) => {
    if (!searchQuery.trim()) return true;
    const q = searchQuery.toLowerCase();
    return (
      r.name?.toLowerCase().includes(q) ||
      r.description?.toLowerCase().includes(q) ||
      r.location?.toLowerCase().includes(q) ||
      r.category?.toLowerCase().includes(q)
    );
  });

  // ── Open modals ────────────────────────────────────────────────────────────
  const openAddModal = () => {
    setForm(BLANK_FORM);
    setActionError(null);
    setModalMode("add");
    setEditId(null);
  };

  const openEditModal = (resource) => {
    setForm({
      name:        resource.name        ?? "",
      description: resource.description ?? "",
      category:    resource.category    ?? "ROOM",
      location:    resource.location    ?? "",
      capacity:    resource.capacity != null ? String(resource.capacity) : "",
      available:   resource.available   ?? true,
    });
    setActionError(null);
    setEditId(resource.id);
    setModalMode("edit");
  };

  const closeModal = () => {
    setModalMode(null);
    setEditId(null);
    setForm(BLANK_FORM);
    setActionError(null);
  };

  // ── Submit (create / update) ───────────────────────────────────────────────
  const handleSubmit = async () => {
    const errors = validateForm(form, modalMode);
    if (Object.keys(errors).length > 0) return;

    const payload = {
      name:        form.name.trim(),
      description: form.description.trim() || null,
      category:    form.category,
      location:    form.location.trim(),
      capacity:    form.capacity !== "" ? Number(form.capacity) : null,
      available:   form.available,
    };

    try {
      setActionLoading(true);
      setActionError(null);
      if (modalMode === "edit") {
        await resourceApi.update(editId, payload);
        showSuccess("Resource updated successfully.");
      } else {
        await resourceApi.create(payload);
        showSuccess("Resource created successfully.");
      }
      closeModal();
      fetchResources();
    } catch (err) {
      setActionError(
        err?.response?.data?.message ||
        (modalMode === "edit" ? "Failed to update resource." : "Failed to create resource.")
      );
    } finally {
      setActionLoading(false);
    }
  };

  // ── Delete ─────────────────────────────────────────────────────────────────
  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to permanently delete this resource?")) return;
    try {
      setActionLoading(true);
      await resourceApi.remove(id);
      showSuccess("Resource deleted.");
      fetchResources();
    } catch {
      setActionError("Failed to delete resource. Please try again.");
    } finally {
      setActionLoading(false);
    }
  };

  const hasFilters = categoryFilter !== "ALL" || availFilter !== "ALL" || searchQuery.trim();

  // ── Render ─────────────────────────────────────────────────────────────────
  return (
    <div className="page-container">

      {/* Header */}
      <div className="page-header">
        <div>
          <h1 className="page-title">Manage Resources</h1>
          <p className="page-subtitle">View, add, edit and remove university resources</p>
        </div>
        <button
          className="btn"
          onClick={openAddModal}
          style={{
            background: "var(--color-primary)",
            color: "#fff",
            border: "none",
            display: "inline-flex",
            alignItems: "center",
            gap: "6px",
          }}
        >
          <FaPlus size={13} /> Add Resource
        </button>
      </div>

      {/* Feedback messages */}
      {successMsg  && <div className="alert alert-success">{successMsg}</div>}
      {actionError && <div className="alert alert-error">{actionError}</div>}

      {/* Filters bar */}
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
        {/* Search */}
        <div className="form-group" style={{ margin: 0, flex: 1, minWidth: "200px", position: "relative" }}>
          <label><FaSearch size={12} style={{ marginRight: "5px" }} />Search</label>
          <div style={{ position: "relative" }}>
            <FaSearch
              size={13}
              style={{
                position: "absolute",
                left: "10px",
                top: "50%",
                transform: "translateY(-50%)",
                color: "var(--color-text-muted)",
                pointerEvents: "none",
              }}
            />
            <input
              type="text"
              placeholder="Search by name, location, type..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              style={{ paddingLeft: "32px" }}
            />
          </div>
        </div>

        {/* Category filter */}
        <div className="form-group" style={{ margin: 0 }}>
          <label><FaFilter size={11} style={{ marginRight: "5px" }} />Category</label>
          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            style={{
              padding: "0.6rem 0.9rem",
              border: "1px solid var(--color-border)",
              borderRadius: "var(--radius-sm)",
              fontSize: "0.95rem",
              background: "var(--color-surface)",
              cursor: "pointer",
            }}
          >
            {CATEGORY_OPTIONS.map((t) => <option key={t} value={t}>{t}</option>)}
          </select>
        </div>

        {/* Availability filter */}
        <div className="form-group" style={{ margin: 0 }}>
          <label><FaFilter size={11} style={{ marginRight: "5px" }} />Availability</label>
          <select
            value={availFilter}
            onChange={(e) => setAvailFilter(e.target.value)}
            style={{
              padding: "0.6rem 0.9rem",
              border: "1px solid var(--color-border)",
              borderRadius: "var(--radius-sm)",
              fontSize: "0.95rem",
              background: "var(--color-surface)",
              cursor: "pointer",
            }}
          >
            <option value="ALL">ALL</option>
            <option value="AVAILABLE">Available</option>
            <option value="UNAVAILABLE">Unavailable</option>
          </select>
        </div>

        {/* Clear */}
        {hasFilters && (
          <button
            className="btn btn-outline"
            onClick={() => { setSearchQuery(""); setCategoryFilter("ALL"); setAvailFilter("ALL"); }}
          >
            <FaTimes size={12} /> Clear
          </button>
        )}
      </div>

      {/* Error */}
      {error && <div className="alert alert-error">{error}</div>}

      {/* Loading */}
      {loading && (
        <div style={{ display: "flex", justifyContent: "center", alignItems: "center", height: "45vh", flexDirection: "column", gap: "16px" }}>
          <FaSpinner size={32} color="#4f46e5" style={{ animation: "spin 1s linear infinite" }} />
          <p style={{ color: "#6b7280", fontSize: "16px" }}>Loading resources…</p>
        </div>
      )}

      {/* Count */}
      {!loading && !error && (
        <p style={{ fontSize: "0.875rem", color: "var(--color-text-muted)", marginBottom: "1rem" }}>
          Showing <strong>{displayed.length}</strong> of <strong>{resources.length}</strong> resource{resources.length !== 1 ? "s" : ""}
        </p>
      )}

      {/* Empty state */}
      {!loading && !error && displayed.length === 0 && (
        <div className="empty-state" style={{
          display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center",
          gap: "1rem", padding: "4rem", color: "var(--color-text-muted)", textAlign: "center",
        }}>
          <FaBox size={40} style={{ opacity: 0.35 }} />
          <div>
            <h3 style={{ fontSize: "1.1rem", fontWeight: 600, marginBottom: "0.3rem" }}>No resources found</h3>
            <p style={{ fontSize: "0.9rem" }}>
              {hasFilters ? "Try adjusting your filters or search query." : "Get started by adding your first resource."}
            </p>
          </div>
          {!hasFilters && (
            <button
              className="btn"
              onClick={openAddModal}
              style={{ background: "var(--color-primary)", color: "#fff", border: "none", display: "inline-flex", alignItems: "center", gap: "6px" }}
            >
              <FaPlus size={13} /> Add Resource
            </button>
          )}
        </div>
      )}

      {/* Resource grid */}
      {!loading && !error && displayed.length > 0 && (
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(320px, 1fr))",
            gap: "1rem",
          }}
        >
          {displayed.map((resource) => (
            <ResourceCard
              key={resource.id}
              resource={resource}
              onEdit={openEditModal}
              onDelete={handleDelete}
              actionLoading={actionLoading}
            />
          ))}
        </div>
      )}

      {/* Add / Edit modal */}
      {modalMode && (
        <ResourceFormModal
          mode={modalMode}
          form={form}
          onChange={handleFormChange}
          onSubmit={handleSubmit}
          onClose={closeModal}
          loading={actionLoading}
          error={actionError}
        />
      )}

    </div>
  );
}
