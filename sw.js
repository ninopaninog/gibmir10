// Service Worker v4 — Gib Mir 10
// Bump version to force update on all devices
const CACHE = 'gibmir10-v4';

self.addEventListener('install', e => {
  self.skipWaiting(); // activate immediately
});

self.addEventListener('activate', e => {
  // Delete old caches
  e.waitUntil(
    caches.keys().then(keys =>
      Promise.all(keys.filter(k => k !== CACHE).map(k => caches.delete(k)))
    ).then(() => clients.claim())
  );
});

// Don't cache — always fresh
self.addEventListener('fetch', e => {
  // Only handle same-origin requests
  if (!e.request.url.startsWith(self.location.origin)) return;
  // Network first, no caching
  e.respondWith(fetch(e.request).catch(() => new Response('Offline', {status: 503})));
});

// Push notification received
self.addEventListener('push', e => {
  let data = {title: '💪 Gib Mir 10!', body: 'Du wurdest gechallengt!'};
  try { data = {...data, ...e.data.json()}; } catch {}
  e.waitUntil(
    self.registration.showNotification(data.title, {
      body: data.body,
      icon: 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64"%3E%3Crect width="64" height="64" rx="14" fill="%23ff2d55"/%3E%3Ctext y="46" x="32" text-anchor="middle" font-size="40"%3E%F0%9F%92%AA%3C/text%3E%3C/svg%3E',
      tag: 'gibmir10',
      requireInteraction: true,
      data: {url: self.location.origin + '/gibmir10/'}
    })
  );
});

// Notification clicked
self.addEventListener('notificationclick', e => {
  e.notification.close();
  e.waitUntil(
    clients.matchAll({type:'window', includeUncontrolled:true}).then(list => {
      for (const c of list) {
        if (c.url.includes('gibmir10')) { c.focus(); return; }
      }
      return clients.openWindow('/gibmir10/');
    })
  );
});
