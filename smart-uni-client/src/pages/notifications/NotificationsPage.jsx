import { useNotifications } from '../../hooks/useNotifications';
import { formatDistanceToNow } from 'date-fns';

const TYPE_LABELS = {
  BOOKING_APPROVED:     { label: 'Booking approved',  color: '#10b981' },
  BOOKING_REJECTED:     { label: 'Booking rejected',  color: '#ef4444' },
  BOOKING_CANCELLED:    { label: 'Booking cancelled', color: '#6b7280' },
  TICKET_STATUS_CHANGED:{ label: 'Ticket updated',    color: '#f59e0b' },
  TICKET_COMMENT_ADDED: { label: 'New comment',       color: '#6366f1' },
};

export default function NotificationsPage() {
  const {
    notifications,
    unreadCount,
    loading,
    hasMore,
    markAsRead,
    markAllAsRead,
    deleteNotification,
    loadMore,
  } = useNotifications();

  return (
    <div className="page-container">
      <div className="page-header">
        <div>
          <h1 className="page-title">Notifications</h1>
          {unreadCount > 0 && (
            <p className="page-subtitle">{unreadCount} unread</p>
          )}
        </div>
        {unreadCount > 0 && (
          <button className="btn btn-outline" onClick={markAllAsRead}>
            Mark all as read
          </button>
        )}
      </div>

      {loading && notifications.length === 0 ? (
        <div className="empty-state">
          <div className="spinner" />
          <p>Loading notifications…</p>
        </div>
      ) : notifications.length === 0 ? (
        <div className="empty-state">
          <span style={{ fontSize: '3rem' }}>🔔</span>
          <h3>All caught up!</h3>
          <p>You have no notifications yet.</p>
        </div>
      ) : (
        <>
          <ul className="notification-list">
            {notifications.map((n) => (
              <NotificationItem
                key={n.id}
                notification={n}
                onRead={markAsRead}
                onDelete={deleteNotification}
              />
            ))}
          </ul>

          {hasMore && (
            <div style={{ textAlign: 'center', marginTop: '1.5rem' }}>
              <button className="btn btn-outline" onClick={loadMore} disabled={loading}>
                {loading ? 'Loading…' : 'Load more'}
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
}

function NotificationItem({ notification: n, onRead, onDelete }) {
  const meta = TYPE_LABELS[n.type] || { label: n.type, color: '#6b7280' };

  const timeAgo = n.createdAt
    ? formatDistanceToNow(new Date(n.createdAt), { addSuffix: true })
    : '';

  return (
    <li
      className={`notification-item ${!n.read ? 'notification-item--unread' : ''}`}
      onClick={() => !n.read && onRead(n.id)}
    >
      <div className="notification-item__dot" style={{ background: meta.color }} />

      <div className="notification-item__body">
        <div className="notification-item__header">
          <span className="notification-item__type" style={{ color: meta.color }}>
            {meta.label}
          </span>
          <span className="notification-item__time">{timeAgo}</span>
        </div>
        <p className="notification-item__title">{n.title}</p>
        <p className="notification-item__message">{n.message}</p>
      </div>

      <div className="notification-item__actions">
        {!n.read && (
          <button
            className="btn-icon"
            title="Mark as read"
            onClick={(e) => { e.stopPropagation(); onRead(n.id); }}
          >
            ✓
          </button>
        )}
        <button
          className="btn-icon btn-icon--danger"
          title="Delete"
          onClick={(e) => { e.stopPropagation(); onDelete(n.id); }}
        >
          ✕
        </button>
      </div>
    </li>
  );
}