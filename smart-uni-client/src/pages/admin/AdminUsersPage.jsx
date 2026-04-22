import { useState, useEffect, useCallback } from "react";
import { adminApi } from "../../api/adminApi";
import { format } from "date-fns";
import {
  FaUsers,
  FaSearch,
  FaFilter,
  FaTimes,
  FaTrash,
  FaSpinner,
  FaEnvelope,
  FaCheckCircle,
  FaBan,
  FaUserShield,
  FaUserCog,
  FaUser,
} from "react-icons/fa";

// ─── Role styles ────────────────────────────────────────────────────────────
const ROLE_STYLES = {
  ADMIN:      { background: "#fee2e2", color: "#991b1b", icon: <FaUserShield size={10} /> },
  TECHNICIAN: { background: "#fef3c7", color: "#92400e", icon: <FaUserCog size={10} /> },
  USER:       { background: "#e0e7ff", color: "#3730a3", icon: <FaUser size={10} /> },
};

// ─── User card ───────────────────────────────────────────────────────────────
function UserCard({ user, onDelete, actionLoading }) {
  const isEnabled = user.enabled;
  const createdAt = user.createdAt ? format(new Date(user.createdAt), "MMM d, yyyy") : "Unknown";

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
            {user.name || "Unnamed User"}
          </span>
          <div style={{ display: "flex", gap: "0.5rem", flexWrap: "wrap", alignItems: "center" }}>
            {/* Roles badges */}
            {user.roles?.map((role) => {
              const style = ROLE_STYLES[role] ?? ROLE_STYLES.USER;
              return (
                <span
                  key={role}
                  style={{
                    background: style.background,
                    color: style.color,
                    fontSize: "0.7rem",
                    fontWeight: 700,
                    padding: "0.18rem 0.55rem",
                    borderRadius: "999px",
                    textTransform: "uppercase",
                    letterSpacing: "0.04em",
                    display: "inline-flex",
                    alignItems: "center",
                    gap: "4px"
                  }}
                >
                  {style.icon} {role}
                </span>
              );
            })}

            {/* Status badge */}
            <span
              style={{
                fontSize: "0.7rem",
                fontWeight: 700,
                padding: "0.18rem 0.55rem",
                borderRadius: "999px",
                textTransform: "uppercase",
                letterSpacing: "0.04em",
                background: isEnabled ? "#d1fae5" : "#fee2e2",
                color:      isEnabled ? "#065f46" : "#991b1b",
                display: "inline-flex",
                alignItems: "center",
                gap: "4px"
              }}
            >
              {isEnabled ? <><FaCheckCircle size={10} /> Active</> : <><FaBan size={10} /> Disabled</>}
            </span>
          </div>
        </div>

        {/* Actions */}
        <div style={{ display: "flex", gap: "0.4rem", flexShrink: 0 }}>
          <button
            onClick={() => onDelete(user.id)}
            disabled={actionLoading}
            title="Delete user"
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
              opacity: actionLoading ? 0.6 : 1,
            }}
            onMouseEnter={(e) => { e.currentTarget.style.background = "#fee2e2"; }}
            onMouseLeave={(e) => { e.currentTarget.style.background = "#fef2f2"; }}
          >
            <FaTrash size={12} />
          </button>
        </div>
      </div>

      {/* Meta info */}
      <div style={{ display: "flex", flexDirection: "column", gap: "0.4rem", marginTop: "0.2rem" }}>
        <span style={{ fontSize: "0.85rem", color: "var(--color-text-muted)", display: "flex", alignItems: "center", gap: "6px" }}>
          <FaEnvelope size={11} /> {user.email}
        </span>
        <span style={{ fontSize: "0.82rem", color: "var(--color-text-muted)", display: "flex", alignItems: "center", gap: "6px" }}>
          Provider: <strong style={{ textTransform: "capitalize" }}>{user.provider?.toLowerCase() || "Local"}</strong>
        </span>
        <span style={{ fontSize: "0.82rem", color: "var(--color-text-muted)", display: "flex", alignItems: "center", gap: "6px" }}>
          Joined: {createdAt}
        </span>
      </div>
    </div>
  );
}

// ─── Main page ───────────────────────────────────────────────────────────────
export default function AdminUsersPage() {
  const [users,         setUsers]         = useState([]);
  const [loading,       setLoading]       = useState(true);
  const [error,         setError]         = useState(null);
  const [successMsg,    setSuccessMsg]    = useState(null);
  const [actionLoading, setActionLoading] = useState(false);

  // Filters
  const [searchQuery, setSearchQuery] = useState("");
  const [roleFilter,  setRoleFilter]  = useState("ALL"); // ALL | ADMIN | TECHNICIAN | USER
  const [providerFilter, setProviderFilter] = useState("ALL"); // ALL | LOCAL | GOOGLE

  // ── Data fetching ──────────────────────────────────────────────────────────
  const fetchUsers = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await adminApi.getUsers();
      setUsers(res.data);
    } catch {
      setError("Failed to load users. Please try again.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchUsers(); }, [fetchUsers]);

  // ── Helpers ────────────────────────────────────────────────────────────────
  const showSuccess = (msg) => {
    setSuccessMsg(msg);
    setTimeout(() => setSuccessMsg(null), 3500);
  };

  // ── Filtered list (client-side search) ────────────────────────────────────
  const displayed = users.filter((u) => {
    let match = true;
    
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      match = match && (
        (u.name && u.name.toLowerCase().includes(q)) ||
        (u.email && u.email.toLowerCase().includes(q))
      );
    }
    
    if (roleFilter !== "ALL") {
      match = match && u.roles?.includes(roleFilter);
    }

    if (providerFilter !== "ALL") {
      match = match && u.provider === providerFilter;
    }

    return match;
  });

  // ── Delete ─────────────────────────────────────────────────────────────────
  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to permanently delete this user? This action cannot be undone.")) return;
    try {
      setActionLoading(true);
      await adminApi.deleteUser(id);
      showSuccess("User deleted successfully.");
      fetchUsers();
    } catch (err) {
      alert(err?.response?.data?.message || "Failed to delete user. Please try again.");
    } finally {
      setActionLoading(false);
    }
  };

  const hasFilters = roleFilter !== "ALL" || providerFilter !== "ALL" || searchQuery.trim();

  // ── Render ─────────────────────────────────────────────────────────────────
  return (
    <div className="page-container">

      {/* Header */}
      <div className="page-header">
        <div>
          <h1 className="page-title">Manage Users</h1>
          <p className="page-subtitle">View and manage all users registered in the system</p>
        </div>
      </div>

      {/* Feedback messages */}
      {successMsg && <div className="alert alert-success">{successMsg}</div>}

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
              placeholder="Search by name or email..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              style={{ paddingLeft: "32px", width: "100%" }}
            />
          </div>
        </div>

        {/* Role filter */}
        <div className="form-group" style={{ margin: 0 }}>
          <label><FaFilter size={11} style={{ marginRight: "5px" }} />Role</label>
          <select
            value={roleFilter}
            onChange={(e) => setRoleFilter(e.target.value)}
            style={{
              padding: "0.6rem 0.9rem",
              border: "1px solid var(--color-border)",
              borderRadius: "var(--radius-sm)",
              fontSize: "0.95rem",
              background: "var(--color-surface)",
              cursor: "pointer",
            }}
          >
            <option value="ALL">All Roles</option>
            <option value="ADMIN">Admin</option>
            <option value="TECHNICIAN">Technician</option>
            <option value="USER">User</option>
          </select>
        </div>

        {/* Provider filter */}
        <div className="form-group" style={{ margin: 0 }}>
          <label><FaFilter size={11} style={{ marginRight: "5px" }} />Provider</label>
          <select
            value={providerFilter}
            onChange={(e) => setProviderFilter(e.target.value)}
            style={{
              padding: "0.6rem 0.9rem",
              border: "1px solid var(--color-border)",
              borderRadius: "var(--radius-sm)",
              fontSize: "0.95rem",
              background: "var(--color-surface)",
              cursor: "pointer",
            }}
          >
            <option value="ALL">All Providers</option>
            <option value="LOCAL">Local</option>
            <option value="GOOGLE">Google</option>
          </select>
        </div>

        {/* Clear */}
        {hasFilters && (
          <button
            className="btn btn-outline"
            onClick={() => { setSearchQuery(""); setRoleFilter("ALL"); setProviderFilter("ALL"); }}
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
          <p style={{ color: "#6b7280", fontSize: "16px" }}>Loading users…</p>
        </div>
      )}

      {/* Count */}
      {!loading && !error && (
        <p style={{ fontSize: "0.875rem", color: "var(--color-text-muted)", marginBottom: "1rem" }}>
          Showing <strong>{displayed.length}</strong> of <strong>{users.length}</strong> user{users.length !== 1 ? "s" : ""}
        </p>
      )}

      {/* Empty state */}
      {!loading && !error && displayed.length === 0 && (
        <div className="empty-state" style={{
          display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center",
          gap: "1rem", padding: "4rem", color: "var(--color-text-muted)", textAlign: "center",
        }}>
          <FaUsers size={40} style={{ opacity: 0.35 }} />
          <div>
            <h3 style={{ fontSize: "1.1rem", fontWeight: 600, marginBottom: "0.3rem" }}>No users found</h3>
            <p style={{ fontSize: "0.9rem" }}>
              {hasFilters ? "Try adjusting your filters or search query." : "There are no users in the system."}
            </p>
          </div>
        </div>
      )}

      {/* Users grid */}
      {!loading && !error && displayed.length > 0 && (
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))",
            gap: "1rem",
          }}
        >
          {displayed.map((user) => (
            <UserCard
              key={user.id}
              user={user}
              onDelete={handleDelete}
              actionLoading={actionLoading}
            />
          ))}
        </div>
      )}

    </div>
  );
}
