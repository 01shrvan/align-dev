const CACHE_NAME = "align-network-cache-v3";
const NOTIFICATION_EVENT_NAME = "align:notification-received";
const urlsToCache = [
  "/",
  "/globals.css",
  "/assets/logo-white.svg",
  "/assets/logo-black.svg",
  "/assets/opengraph-image.png",
  "/pfp.png",
  "/icon-192x192.png",
  "/icon-512x512.png",
  "/icon-maskable-192x192.png",
  "/icon-maskable-512x512.png",
  "/favicon.ico",
];

self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(urlsToCache).catch(() => undefined);
    }),
  );
  self.skipWaiting();
});

self.addEventListener("fetch", (event) => {
  event.respondWith(
    caches.match(event.request).then((response) => {
      if (response) {
        return response;
      }

      return fetch(event.request).catch(() => response || Response.error());
    }),
  );
});

async function broadcastNotificationEvent() {
  const clients = await self.clients.matchAll({
    type: "window",
    includeUncontrolled: true,
  });

  clients.forEach((client) => {
    client.postMessage({ type: NOTIFICATION_EVENT_NAME });
  });
}

self.addEventListener("push", (event) => {
  if (!event.data) {
    return;
  }

  let payload;

  try {
    payload = event.data.json();
  } catch {
    payload = { body: event.data.text() };
  }

  const title = payload.title || "Align";
  const options = {
    body: payload.body || "You have a new notification",
    icon: payload.icon || "/icon-192x192.png",
    badge: payload.badge || "/icon-192x192.png",
    data: {
      url: payload.url || "/notifications",
    },
  };

  event.waitUntil(
    Promise.all([
      self.registration.showNotification(title, options),
      broadcastNotificationEvent(),
    ]),
  );
});

self.addEventListener("notificationclick", (event) => {
  event.notification.close();

  const urlPath = event.notification?.data?.url || "/notifications";
  const targetUrl = new URL(urlPath, self.location.origin).toString();

  event.waitUntil(
    self.clients
      .matchAll({
        type: "window",
        includeUncontrolled: true,
      })
      .then(async (windowClients) => {
        for (const client of windowClients) {
          if ("navigate" in client) {
            await client.navigate(targetUrl);
          }

          if ("focus" in client) {
            return client.focus();
          }
        }

        if (self.clients.openWindow) {
          return self.clients.openWindow(targetUrl);
        }

        return undefined;
      }),
  );
});

self.addEventListener("activate", (event) => {
  const cacheWhitelist = [CACHE_NAME];
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheWhitelist.indexOf(cacheName) === -1) {
            return caches.delete(cacheName);
          }

          return Promise.resolve(true);
        }),
      );
    }),
  );
  return self.clients.claim();
});
