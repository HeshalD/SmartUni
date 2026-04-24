import { useState, useEffect, useCallback } from "react";
import { notificationApi } from "../../api/notificationApi";
import { formatDistanceToNow } from "date-fns";
import {
  FaBell,
  FaSpinner,
  FaFilter,
  FaTimes,
  FaChevronDown,
  FaCheckCircle,
  FaTimesCircle,
  FaBan,
  FaExchangeAlt,
  FaCommentAlt,
  FaInfoCircle,
} from "react-icons/fa";

// ─── Notification type metadata ──────────────────────────────────────────────
const TYPE_META = {
  BOOKING_APPROVED:      { label: "Booking Approved",   color: "#10b981", bg: "#d1fae5", icon: <FaCheckCircle size={13} /> },
  BOOKING_REJECTED:      { label: "Booking Rejected",   color: "#ef4444", bg: "#fee2e2", icon: <FaTimesCircle size={13} /> },
  BOOKING_CANCELLED:     { label: "Booking Cancelled",  color: "#6b7280", bg: "#f3f4f6", icon: <FaBan size={13} /> },
  TICKET_STATUS_CHANGED: { label: "Ticket Updated",     color: "#f59e0b", bg: "#fef3c7", icon: <FaExchangeAlt size={13} /> },
  TICKET_COMMENT_ADDED:  { label: "New Comment",        color: "#6366f1", bg: "#ede9fe", icon: <FaCommentAlt size={13} /> },
};

const FILTER_OPTIONS = [
  { value: "ALL",                    label: "All Types" },
  { value: "BOOKING_APPROVED",       label: "Booking Approved" },
  { value: "BOOKING_REJECTED",       label: "Booking Rejected" },
  { value: "BOOKING_CANCELLED",      label: "Booking Cancelled" },
  { value: "TICKET_STATUS_CHANGED",  label: "Ticket Updated" },
  { value: "TICKET_COMMENT_ADDED",   label: "New Comment" },
];

const PAGE_SIZE = 20;

// ─── Single notification row ─────────────────────────────────────────────────
function NotificationRow({ n }) {
  const meta = TYPE_META[n.type] ?? {
    label: n.type ?? "Notification",
    color: "#6b7280",
    bg: "#f3f4f6",
    icon: <FaInfoCircle size={13} />,
  };

  const timeAgo = n.createdAt
    ? formatDistanceToNow(new Date(n.createdAt), { addSuffix: true })
    : "—";

  return (
    <div
      style={{
        background: "var(--color-surface)",
        border: "1px solid var(--color-border)",
        borderLeft: `4px solid ${meta.color}`,
        borderRadius: "var(--radius-md)",
        padding: "1rem 1.25rem",
        display: "flex",
        alignItems: "flex-start",
        gap: "1rem",
        boxShadow: "var(--shadow-sm)",
        transition: "box-shadow 0.15s",
      }}
      onMouseEnter={(e) => { e.currentTarget.style.boxShadow = "var(--shadow-md)"; }}
      onMouseLeave={(e) => { e.currentTarget.style.boxShadow = "var(--shadow-sm)"; }}
    >
      {/* Colour dot */}
      <div
        style={{
          width: 36,
          height: 36,
          borderRadius: "50%",
          background: meta.bg,
          color: meta.color,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          flexShrink: 0,
          marginTop: "2px",
        }}
      >
        {meta.icon}
      </div>

      {/* Body */}
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: "0.75rem", flexWrap: "wrap", marginBottom: "0.25rem" }}>
          <span
            style={{
              fontSize: "0.72rem",
              fontWeight: 700,
              textTransform: "uppercase",
              letterSpacing: "0.05em",
              color: meta.color,
              background: meta.bg,
              padding: "0.18rem 0.55rem",
              borderRadius: "999px",
            }}
          >
            {meta.label}
          </span>
          <span style={{ fontSize: "0.78rem", color: "var(--color-text-muted)", flexShrink: 0 }}>
            {timeAgo}
          </span>
        </div>

        <p style={{ fontWeight: 600, fontSize: "0.95rem", margin: "0 0 0.2rem" }}>
          {n.title ?? "—"}
        </p>
        {n.message && (
          <p style={{ fontSize: "0.875rem", color: "var(--color-text-muted)", margin: 0, lineHeight: 1.5 }}>
            {n.message}
          </p>
        )}

        {/* Read status pill */}
        <div style={{ marginTop: "0.5rem" }}>
          <span
            style={{
              fontSize: "0.7rem",
              fontWeight: 600,
              padding: "0.15rem 0.5rem",
              borderRadius: "999px",
              background: n.read ? "#d1fae5" : "#fef3c7",
              color:      n.read ? "#065f46" : "#92400e",
            }}
          >
            {n.read ? "Read" : "Unread"}
          </span>
        </div>
      </div>
    </div>
  );
}

// ─── Main page ───────────────────────────────────────────────────────────────
export default function AdminNotificationsPage() {
  const [notifications, setNotifications] = useState([]);
  const [loading,       setLoading]       = useState(true);
  const [loadingMore,   setLoadingMore]   = useState(false);
  const [error,         setError]         = useState(null);
  const [page,          setPage]          = useState(0);
  const [hasMore,       setHasMore]       = useState(true);
  const [typeFilter,    setTypeFilter]    = useState("ALL");

  // ── Fetch first page whenever filter changes ──────────────────────────────
  const fetchPage = useCallback(async (pageNum, replace = false) => {
    try {
      replace ? setLoading(true) : setLoadingMore(true);
      setError(null);
      const res  = await notificationApi.getAllAdmin(pageNum, PAGE_SIZE);
      // Spring Page<T> shape: { content: [], last: bool, totalPages: N, ... }
      const body = res.data;
      const data = body?.content ?? body?.data ?? body ?? [];
      const isLast = body?.last ?? data.length < PAGE_SIZE;

      setNotifications((prev) => (replace ? data : [...prev, ...data]));
      setHasMore(!isLast);
    } catch {
      setError("Failed to load notifications. Please try again.");
    } finally {
      setLoading(false);
      setLoadingMore(false);
    }
  }, []);

  // Reset on mount
  useEffect(() => {
    setPage(0);
    fetchPage(0, true);
  }, [fetchPage]);

  // Load more handler
  const handleLoadMore = () => {
    const next = page + 1;
    setPage(next);
    fetchPage(next, false);
  };

  // ── Client-side type filter ───────────────────────────────────────────────
  const displayed =
    typeFilter === "ALL"
      ? notifications
      : notifications.filter((n) => n.type === typeFilter);

  const hasFilters = typeFilter !== "ALL";

  // ── Stats ─────────────────────────────────────────────────────────────────
  const unreadCount = notifications.filter((n) => !n.read).length;

  return (
    <div className="page-container">

      {/* Header */}
      <div className="page-header">
        <div>
          <h1 className="page-title">Sent Notifications</h1>
          <p className="page-subtitle">
            Read-only view of all notifications dispatched by the system
            {unreadCount > 0 && (
              <span
                style={{
                  marginLeft: "0.6rem",
                  fontSize: "0.78rem",
                  fontWeight: 700,
                  padding: "0.15rem 0.55rem",
                  borderRadius: "999px",
                  background: "#fef3c7",
                  color: "#92400e",
                }}
              >
                {unreadCount} unread
              </span>
            )}
          </p>
        </div>
      </div>

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
        <div className="form-group" style={{ margin: 0 }}>
          <label><FaFilter size={11} style={{ marginRight: "5px" }} />Type</label>
          <select
            value={typeFilter}
            onChange={(e) => setTypeFilter(e.target.value)}
            style={{
              padding: "0.6rem 0.9rem",
              border: "1px solid var(--color-border)",
              borderRadius: "var(--radius-sm)",
              fontSize: "0.95rem",
              background: "var(--color-surface)",
              cursor: "pointer",
              minWidth: "180px",
            }}
          >
            {FILTER_OPTIONS.map((o) => (
              <option key={o.value} value={o.value}>{o.label}</option>
            ))}
          </select>
        </div>

        {hasFilters && (
          <button
            className="btn btn-outline"
            onClick={() => setTypeFilter("ALL")}
          >
            <FaTimes size={12} /> Clear
          </button>
        )}

        {/* Count chip */}
        <div style={{ marginLeft: "auto", display: "flex", alignItems: "flex-end" }}>
          <span style={{ fontSize: "0.85rem", color: "var(--color-text-muted)" }}>
            Showing <strong>{displayed.length}</strong>
            {notifications.length !== displayed.length && (
              <> of <strong>{notifications.length}</strong> loaded</>
            )}
          </span>
        </div>
      </div>

      {/* Error */}
      {error && <div className="alert alert-error">{error}</div>}

      {/* Loading spinner (first load) */}
      {loading && (
        <div style={{ display: "flex", justifyContent: "center", alignItems: "center", height: "45vh", flexDirection: "column", gap: "16px" }}>
          <FaSpinner size={32} color="#4f46e5" style={{ animation: "spin 1s linear infinite" }} />
          <p style={{ color: "#6b7280", fontSize: "16px" }}>Loading notifications…</p>
        </div>
      )}

      {/* Empty state */}
      {!loading && !error && displayed.length === 0 && (
        <div
          style={{
            display: "flex", flexDirection: "column", alignItems: "center",
            justifyContent: "center", gap: "1rem", padding: "4rem",
            color: "var(--color-text-muted)", textAlign: "center",
          }}
        >
          <FaBell size={40} style={{ opacity: 0.3 }} />
          <div>
            <h3 style={{ fontSize: "1.1rem", fontWeight: 600, marginBottom: "0.3rem" }}>No notifications found</h3>
            <p style={{ fontSize: "0.9rem" }}>
              {hasFilters ? "Try changing the type filter." : "No notifications have been sent yet."}
            </p>
          </div>
        </div>
      )}

      {/* Notification list */}
      {!loading && !error && displayed.length > 0 && (
        <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
          {displayed.map((n) => (
            <NotificationRow key={n.id} n={n} />
          ))}
        </div>
      )}

      {/* Load more */}
      {!loading && !error && hasMore && typeFilter === "ALL" && (
        <div style={{ textAlign: "center", marginTop: "1.75rem" }}>
          <button
            className="btn btn-outline"
            onClick={handleLoadMore}
            disabled={loadingMore}
            style={{ display: "inline-flex", alignItems: "center", gap: "6px" }}
          >
            {loadingMore
              ? <><FaSpinner size={13} style={{ animation: "spin 1s linear infinite" }} /> Loading…</>
              : <><FaChevronDown size={13} /> Load more</>}
          </button>
        </div>
      )}

    </div>
  );
}
