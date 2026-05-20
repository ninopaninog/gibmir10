// Service Worker — Gib Mir 10
// Handles push notifications + offline caching

const CACHE = 'gibmir10-v1';
const VAPID_PUBLIC = '_Yv31_16tHe5wvVRX4JETRgZ0tg3Pgs0L5Xk__d6_e2R0TDmlSb80RpqzTSOMTawc0Dn6IlYQz-2o98ZVztl5A';

// Install — cache app shell
self.addEventListener('install', e => {
  e.waitUntil(
    caches.open(CACHE).then(c => c.addAll(['/', '/index.html', '/manifest.json']))
      .catch(() => {}) // ok if some files missing
  );
  self.skipWaiting();
});

self.addEventListener('activate', e => {
  e.waitUntil(clients.claim());
});

// Fetch — serve from cache if offline
self.addEventListener('fetch', e => {
  if (e.request.method !== 'GET') return;
  e.respondWith(
    fetch(e.request).catch(() => caches.match(e.request))
  );
});

// Push notification received
self.addEventListener('push', e => {
  let data = { title: '💪 Gib Mir 10!', body: 'Du wurdest gechallengt!', from: '' };
  try { data = { ...data, ...e.data.json() }; } catch {}
  
  e.waitUntil(
    self.registration.showNotification(data.title, {
      body: data.body,
      icon: '/icon-192.png',
      badge: '/badge.png',
      tag: 'challenge',
      renotify: true,
      requireInteraction: true, // stays until tapped — important!
      data: { url: '/?challenge=1' },
      actions: [
        { action: 'do', title: '💪 Jetzt machen!' },
        { action: 'later', title: 'Später' }
      ]
    })
  );
});

// Notification clicked — open app
self.addEventListener('notificationclick', e => {
  e.notification.close();
  const url = e.notification.data?.url || '/';
  e.waitUntil(
    clients.matchAll({ type: 'window', includeUncontrolled: true }).then(list => {
      for (const c of list) {
        if (c.url.includes(self.location.origin)) { c.focus(); return; }
      }
      return clients.openWindow(url);
    })
  );
});
