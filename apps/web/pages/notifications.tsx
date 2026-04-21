import { useEffect, useState } from 'react';
import api from '../lib/api';
import { Layout } from '../components/Layout';

type Notification = {
  id: string;
  type: string;
  payload: string;
  read: boolean;
  createdAt: string;
};

export default function NotificationsPage() {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadNotifications();
  }, []);

  async function loadNotifications() {
    try {
      const res = await api.get('/notifications');
      setNotifications(res.data);
    } catch (err) {
      console.error('Error loading notifications:', err);
    } finally {
      setLoading(false);
    }
  }

  async function markAsRead(notificationId: string) {
    try {
      await api.post(`/notifications/${notificationId}/read`);
      setNotifications((prev) =>
        prev.map((n) => (n.id === notificationId ? { ...n, read: true } : n))
      );
    } catch (err) {
      console.error('Error marking notification as read:', err);
    }
  }

  async function deleteNotification(notificationId: string) {
    try {
      await api.delete(`/notifications/${notificationId}`);
      setNotifications((prev) => prev.filter((n) => n.id !== notificationId));
    } catch (err) {
      console.error('Error deleting notification:', err);
    }
  }

  async function markAllAsRead() {
    try {
      await api.post('/notifications/read-all');
      setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
    } catch (err) {
      console.error('Error marking all as read:', err);
    }
  }

  function getNotificationContent(notification: Notification) {
    try {
      const payload = JSON.parse(notification.payload);

      switch (notification.type) {
        case 'LIKE':
          return {
            emoji: payload.emoji || '❤️',
            text: `${payload.reacterName} reacted to your post`,
          };
        case 'COMMENT':
          return {
            emoji: '💬',
            text: `${payload.commenterName} commented on your post: "${payload.content}"`,
          };
        case 'FOLLOW':
          return {
            emoji: '👤',
            text: 'Someone started following you',
          };
        case 'FRIEND_REQUEST':
          return {
            emoji: '🤝',
            text: 'You received a friend request',
          };
        default:
          return {
            emoji: '📬',
            text: 'New notification',
          };
      }
    } catch (err) {
      return {
        emoji: '📬',
        text: 'New notification',
      };
    }
  }

  if (loading) {
    return (
      <Layout>
        <div className="rounded-3xl border border-white/10 bg-surface p-6 text-white">
          Loading notifications...
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="space-y-6">
        <div className="rounded-3xl border border-white/10 bg-surface p-6">
          <div className="flex items-center justify-between">
            <h1 className="text-3xl font-semibold text-lime-400">Notifications</h1>
            {notifications.some((n) => !n.read) && (
              <button
                onClick={markAllAsRead}
                className="text-sm text-lime-400 hover:underline"
              >
                Mark all as read
              </button>
            )}
          </div>
          <p className="mt-2 text-sm text-white/70">
            Stay updated with likes, comments, and follows
          </p>
        </div>

        {notifications.length === 0 ? (
          <div className="rounded-3xl border border-white/10 bg-surface p-6 text-center text-white/60">
            No notifications yet
          </div>
        ) : (
          <div className="space-y-3">
            {notifications.map((notification) => {
              const content = getNotificationContent(notification);
              return (
                <div
                  key={notification.id}
                  className={`rounded-3xl border p-4 flex items-center justify-between transition-colors ${
                    notification.read
                      ? 'border-white/10 bg-white/5'
                      : 'border-lime-500/30 bg-lime-500/10'
                  }`}
                >
                  <div className="flex items-center gap-3 flex-1">
                    <span className="text-2xl">{content.emoji}</span>
                    <div className="flex-1">
                      <p className="text-white/80">{content.text}</p>
                      <p className="text-xs text-white/50 mt-1">
                        {new Date(notification.createdAt).toLocaleString()}
                      </p>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    {!notification.read && (
                      <button
                        onClick={() => markAsRead(notification.id)}
                        className="px-3 py-1 text-xs rounded-full bg-lime-500 text-black hover:bg-lime-600 transition-colors"
                      >
                        Read
                      </button>
                    )}
                    <button
                      onClick={() => deleteNotification(notification.id)}
                      className="px-3 py-1 text-xs rounded-full bg-white/10 text-white hover:bg-white/20 transition-colors"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </Layout>
  );
}
