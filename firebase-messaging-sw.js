// ============================================================
// firebase-messaging-sw.js
// Infernix Esports - Push Notification Service Worker
// Place this file in the ROOT folder of your website
// ============================================================

importScripts('https://www.gstatic.com/firebasejs/10.12.0/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/10.12.0/firebase-messaging-compat.js');

firebase.initializeApp({
  apiKey: "AIzaSyBYZ1gAxMfLinFQMDvGraDy96ft9_I5aPQ",
  authDomain: "infernix-esports.firebaseapp.com",
  projectId: "infernix-esports",
  storageBucket: "infernix-esports.firebasestorage.app",
  messagingSenderId: "769631336074",
  appId: "1:769631336074:web:18831357cc7dd200931f73"
});

const messaging = firebase.messaging();

// -------------------------------------------------------
// Background notification handler
// Jab app band ho tab bhi notification aayega
// -------------------------------------------------------
messaging.onBackgroundMessage(function(payload) {
  console.log('[SW] Background notification:', payload);

  const notificationTitle = payload.notification?.title || 'Infernix Esports';
  const notificationOptions = {
    body: payload.notification?.body || 'Aapke liye ek notification hai!',
    icon: payload.notification?.icon || '/icon-192.png',
    badge: '/icon-192.png',
    data: payload.data || {},
    actions: [
      { action: 'open', title: '🎮 Open App' }
    ],
    vibrate: [200, 100, 200],
    requireInteraction: true
  };

  self.registration.showNotification(notificationTitle, notificationOptions);
});

// -------------------------------------------------------
// Notification click handler — app open karo click pe
// -------------------------------------------------------
self.addEventListener('notificationclick', function(event) {
  event.notification.close();

  const urlToOpen = event.notification.data?.url || '/';

  event.waitUntil(
    clients.matchAll({ type: 'window', includeUncontrolled: true }).then(function(clientList) {
      for (let client of clientList) {
        if (client.url === urlToOpen && 'focus' in client) {
          return client.focus();
        }
      }
      if (clients.openWindow) {
        return clients.openWindow(urlToOpen);
      }
    })
  );
});
