// public/firebase-messaging-sw.js
importScripts('https://www.gstatic.com/firebasejs/10.0.0/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/10.0.0/firebase-messaging-compat.js');

const firebaseConfig = {
  apiKey: 'AIzaSyAUTRFwmPf47uFKAGLJRX_txa-tsxTubG8',
  authDomain: 'hakhy-chat.firebaseapp.com',
  projectId: 'hakhy-chat',
  storageBucket: 'hakhy-chat.appspot.com',
  messagingSenderId: '1060910683787',
  appId: '1:1060910683787:web:aee9be9fbe5ebe1e91268e',
  measurementId: 'G-TZ9F8FZJWC',
};

firebase.initializeApp(firebaseConfig);

const messaging = firebase.messaging();

// Handle background messages
messaging.onBackgroundMessage((payload) => {
  console.log('Received background message:', payload);

  const notificationTitle = payload.notification?.title || 'Jazz';
  const notificationOptions = {
    body: payload.notification?.body || 'You have a new notification',
    icon: '/jazz-logo.png',
    badge: '/jazz-logo.png',
    tag: payload.data?.tag || 'jazz-notification',
    data: payload.data,
  };

  self.registration.showNotification(notificationTitle, notificationOptions);
});

// Handle notification click
self.addEventListener('notificationclick', (event) => {
  console.log('Notification click received:', event);

  event.notification.close();

  // This will focus on the app if it's already open, or open it if not
  event.waitUntil(
    clients.matchAll({ type: 'window', includeUncontrolled: true }).then((windowClients) => {
      // Check if there is already a window/tab open with the target URL
      for (let client of windowClients) {
        if (client.url.includes('/notifications') && 'focus' in client) {
          return client.focus();
        }
      }
      // If not, open a new window/tab with the app
      if (clients.openWindow) {
        return clients.openWindow('/notifications');
      }
    })
  );
});