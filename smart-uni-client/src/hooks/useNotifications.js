import { useState, useEffect, useCallback } from 'react';
import { notificationApi } from '../api/notificationApi';

export function useNotifications() {
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount]     = useState(0);
  const [loading, setLoading]             = useState(false);
  const [page, setPage]                   = useState(0);
  const [totalPages, setTotalPages]       = useState(0);

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
      // fail silently
    }
  }, []);

  useEffect(() => {
    fetchNotifications(0);
    fetchUnreadCount();
    const interval = setInterval(fetchUnreadCount, 30_000);
    return () => clearInterval(interval);
  }, [fetchNotifications, fetchUnreadCount]);

  const markAsRead = useCallback(async (id) => {
    await notificationApi.markAsRead(id);
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, read: true } : n))
    );
    setUnreadCount((c) => Math.max(0, c - 1));
  }, []);

  const markAllAsRead = useCallback(async () => {
    await notificationApi.markAllAsRead();
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
    setUnreadCount(0);
  }, []);

  const deleteNotification = useCallback(async (id) => {
    const wasUnread = notifications.find((n) => n.id === id && !n.read);
    await notificationApi.deleteNotification(id);
    setNotifications((prev) => prev.filter((n) => n.id !== id));
    if (wasUnread) setUnreadCount((c) => Math.max(0, c - 1));
  }, [notifications]);

  const loadMore = useCallback(() => {
    if (page + 1 < totalPages) fetchNotifications(page + 1);
  }, [page, totalPages, fetchNotifications]);

  return {
    notifications,
    unreadCount,
    loading,
    hasMore: page + 1 < totalPages,
    markAsRead,
    markAllAsRead,
    deleteNotification,
    loadMore,
    refresh: () => fetchNotifications(0),
  };
}