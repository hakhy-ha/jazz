import { useEffect } from 'react';
import { onMessageReceived, requestNotificationPermission } from '../lib/firebase';

interface NotificationSetupProps {
  userId: string;
}

export function NotificationSetup({ userId }: NotificationSetupProps) {
  useEffect(() => {
    // Request notification permission on mount
    async function setupNotifications() {
      try {
        // Check if notifications are supported
        if (!('serviceWorker' in navigator) || !('Notification' in window)) {
          console.log('Notifications not supported in this browser');
          return;
        }

        // Request permission from user
        if (Notification.permission === 'default') {
          const permission = await Notification.requestPermission();
          if (permission !== 'granted') {
            console.log('Notification permission denied');
            return;
          }
        }

        if (Notification.permission === 'granted') {
          // Get FCM token
          const token = await requestNotificationPermission();
          if (token) {
            // Save token to backend
            // You'll need to create this endpoint
            console.log('FCM Token:', token);
          }
        }
      } catch (err) {
        console.error('Error setting up notifications:', err);
      }
    }

    setupNotifications();

    let unsubscribe: (() => void) | null = null;

    try {
      unsubscribe = onMessageReceived((payload) => {
        console.log('Message received:', payload);
        // Handle push notification
        if (payload.notification) {
          new Notification(payload.notification.title || 'Jazz', {
            body: payload.notification.body,
            icon: '/jazz-logo.png',
          });
        }
      });
    } catch (err) {
      console.error('Error setting up message listener:', err);
    }

    return () => {
      if (unsubscribe) {
        try {
          unsubscribe();
        } catch (err) {
          console.error('Error cleaning up message listener:', err);
        }
      }
    };
  }, [userId]);

  return null; // This is a setup component, no UI needed
}