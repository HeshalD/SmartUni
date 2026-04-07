import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { notificationApi } from '../api/notificationApi';

const NotificationContext = createContext(null);

export function NotificationProvider({ children }) {
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);

  const fetchNotifications = useCallback(async (pageNum = 0) => {
    setLoading(true);
    try {
      const res = await notificationApi.getAll(pageNum, 20);

      if (pageNum === 0) {
        setNotifications(res.data.content);
      } else {
        setNotifications((prev) => [...prev, ...res.data.content]);
      }

      setTotalPages(res.data.totalPages);
      setPage(pageNum);
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchUnreadCount = useCallback(async () => {
    try {
      const res = await notificationApi.getUnreadCount();
      setUnreadCount(res.data.count);
    } catch {
      // ignore silently
    }
  }, []);

  useEffect(() => {
    fetchNotifications(0);
    fetchUnreadCount();

    const interval = setInterval(() => {
      fetchUnreadCount();
    }, 30000);

    return () => clearInterval(interval);
  }, [fetchNotifications, fetchUnreadCount]);

  const markAsRead = useCallback(async (id) => {
    await notificationApi.markAsRead(id);

    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, read: true } : n))
    );

    setUnreadCount((prev) => Math.max(0, prev - 1));
  }, []);

  const markAllAsRead = useCallback(async () => {
    await notificationApi.markAllAsRead();

    setNotifications((prev) =>
      prev.map((n) => ({ ...n, read: true }))
    );

    setUnreadCount(0);
  }, []);

  const deleteNotification = useCallback(async (id) => {
    setNotifications((prev) => {
      const target = prev.find((n) => n.id === id);

      if (target && !target.read) {
        setUnreadCount((count) => Math.max(0, count - 1));
      }

      return prev.filter((n) => n.id !== id);
    });

    await notificationApi.deleteNotification(id);
  }, []);

  const loadMore = useCallback(() => {
    if (page + 1 < totalPages) {
      fetchNotifications(page + 1);
    }
  }, [page, totalPages, fetchNotifications]);

  const refresh = useCallback(() => {
    fetchNotifications(0);
    fetchUnreadCount();
  }, [fetchNotifications, fetchUnreadCount]);

  return (
    <NotificationContext.Provider
      value={{
        notifications,
        unreadCount,
        loading,
        hasMore: page + 1 < totalPages,
        markAsRead,
        markAllAsRead,
        deleteNotification,
        loadMore,
        refresh,
      }}
    >
      {children}
    </NotificationContext.Provider>
  );
}

export function useNotifications() {
  const context = useContext(NotificationContext);

  if (!context) {
    throw new Error('useNotifications must be used inside NotificationProvider');
  }

  return context;
}