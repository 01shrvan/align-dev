// public/service-worker.js

const CACHE_NAME = "align-network-cache-v1"
const urlsToCache = [
  "/",
  "/globals.css", // Your global CSS
  "/assets/logo-white.svg",
  "/assets/logo-black.svg",
  "/assets/opengraph-image.png",
  "/pfp.png",
  "/icon-192x192.png",
  "/icon-512x512.png",
  "/icon-maskable-512x512.png",
  "/favicon.ico",
  // Add other critical static assets here.
  // For Next.js dynamic chunks, you might need a more advanced caching strategy
  // or use a library like Workbox for production PWAs.
]

self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      console.log("Service Worker: Opened cache")
      return cache.addAll(urlsToCache).catch((error) => {
        console.error("Service Worker: Failed to cache some URLs:", error)
      })
    }),
  )
})

self.addEventListener("fetch", (event) => {
  event.respondWith(
    caches.match(event.request).then((response) => {
      // Cache hit - return response
      if (response) {
        return response
      }
      // Fallback to network
      return fetch(event.request).catch(() => {
        // You can return an offline page here if the network fails
        // For example: return caches.match('/offline.html');
      })
    }),
  )
})

self.addEventListener("activate", (event) => {
  const cacheWhitelist = [CACHE_NAME]
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheWhitelist.indexOf(cacheName) === -1) {
            console.log("Service Worker: Deleting old cache:", cacheName)
            return caches.delete(cacheName)
          }
        }),
      )
    }),
  )
})
