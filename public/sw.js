const CACHE_NAME = 'toyota-sale-tool-v1'
const PRECACHE = ['/', '/index.html', '/offline.html']

self.addEventListener('install', e => {
  e.waitUntil(
    caches.open(CACHE_NAME).then(c => c.addAll(PRECACHE)).then(() => self.skipWaiting())
  )
})

self.addEventListener('activate', e => {
  e.waitUntil(
    caches.keys().then(keys =>
      Promise.all(keys.filter(k => k !== CACHE_NAME).map(k => caches.delete(k)))
    ).then(() => self.clients.claim())
  )
})

self.addEventListener('fetch', e => {
  if (e.request.method !== 'GET') return
  const url = new URL(e.request.url)
  // Network-first for API calls
  if (url.hostname.includes('supabase')) {
    e.respondWith(
      fetch(e.request).catch(() => caches.match(e.request))
    )
    return
  }
  // Cache-first for static assets
  e.respondWith(
    caches.match(e.request).then(cached => {
      if (cached) return cached
      return fetch(e.request).then(resp => {
        if (resp.ok && url.origin === location.origin) {
          const clone = resp.clone()
          caches.open(CACHE_NAME).then(c => c.put(e.request, clone))
        }
        return resp
      })
    }).catch(() => {
      if (e.request.destination === 'document') return caches.match('/offline.html')
    })
  )
})
