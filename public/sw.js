const CACHE_NAME = 'toyota-sale-v2'
const PRECACHE = [
  '/',
  '/index.html',
  '/offline.html',
  '/manifest.json',
]

// Install: cache core assets
self.addEventListener('install', (e) => {
  e.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => cache.addAll(PRECACHE))
      .then(() => self.skipWaiting())
  )
})

// Activate: clean old caches
self.addEventListener('activate', (e) => {
  e.waitUntil(
    caches.keys()
      .then((keys) =>
        Promise.all(
          keys
            .filter((k) => k !== CACHE_NAME)
            .map((k) => caches.delete(k))
        )
      )
      .then(() => self.clients.claim())
  )
})

// Fetch: network-first for API, cache-first for static
self.addEventListener('fetch', (e) => {
  if (e.request.method !== 'GET') return

  const url = new URL(e.request.url)

  // Network-first for Supabase API calls
  if (url.hostname.includes('supabase')) {
    e.respondWith(
      fetch(e.request)
        .then((resp) => {
          if (resp.ok) {
            const clone = resp.clone()
            caches.open(CACHE_NAME).then((c) => c.put(e.request, clone))
          }
          return resp
        })
        .catch(() => caches.match(e.request))
    )
    return
  }

  // Cache-first for static assets (same origin)
  e.respondWith(
    caches.match(e.request).then((cached) => {
      if (cached) return cached
      return fetch(e.request)
        .then((resp) => {
          if (resp.ok && url.origin === location.origin) {
            const clone = resp.clone()
            caches.open(CACHE_NAME).then((c) => c.put(e.request, clone))
          }
          return resp
        })
        .catch(() => {
          // Offline fallback for document requests
          if (e.request.destination === 'document') {
            return caches.match('/offline.html')
          }
        })
    })
  )
})
