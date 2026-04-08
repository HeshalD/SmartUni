import { useState, useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useNotifications } from '../hooks/useNotifications';
import { formatDistanceToNow } from 'date-fns';

export default function NotificationPanel() {
  const [open, setOpen] = useState(false);
  const panelRef = useRef(null);
  const {
    notifications,
    unreadCount,
    markAsRead,
    markAllAsRead,
    deleteNotification,
  } = useNotifications();

  // Close on outside click
  useEffect(() => {
    const handler = (e) => {
      if (panelRef.current && !panelRef.current.contains(e.target)) {
        setOpen(false);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const preview = notifications.slice(0, 5);

  return (
    <div className="notif-panel" ref={panelRef}>
      {/* Bell button */}
      <button
        className="notif-bell"
        onClick={() => setOpen((o) => !o)}
        aria-label={`Notifications (${unreadCount} unread)`}
      >
        🔔
        {unreadCount > 0 && (
          <span className="notif-bell__badge">
            {unreadCount > 99 ? '99+' : unreadCount}
          </span>
        )}
      </button>

      {/* Dropdown */}
      {open && (
        <div className="notif-dropdown">
          <div className="notif-dropdown__header">
            <span className="notif-dropdown__title">Notifications</span>
            {unreadCount > 0 && (
              <button
                className="notif-dropdown__mark-all"
                onClick={() => { markAllAsRead(); }}
              >
                Mark all read
              </button>
            )}
          </div>

          {preview.length === 0 ? (
            <div className="notif-dropdown__empty">No notifications yet</div>
          ) : (
            <ul className="notif-dropdown__list">
              {preview.map((n) => (
                <li
                  key={n.id}
                  className={`notif-dropdown__item ${!n.read ? 'notif-dropdown__item--unread' : ''}`}
                  onClick={() => { if (!n.read) markAsRead(n.id); }}
                >
                  <div className="notif-dropdown__item-body">
                    <p className="notif-dropdown__item-title">{n.title}</p>
                    <p className="notif-dropdown__item-msg">{n.message}</p>
                    <span className="notif-dropdown__item-time">
                      {n.createdAt
                        ? formatDistanceToNow(new Date(n.createdAt), { addSuffix: true })
                        : ''}
                    </span>
                  </div>
                  <button
                    className="btn-icon btn-icon--danger"
                    title="Delete"
                    onClick={(e) => { e.stopPropagation(); deleteNotification(n.id); }}
                  >
                    ✕
                  </button>
                </li>
              ))}
            </ul>
          )}

          <div className="notif-dropdown__footer">
            <Link
              to="/notifications"
              className="notif-dropdown__view-all"
              onClick={() => setOpen(false)}
            >
              View all notifications →
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}