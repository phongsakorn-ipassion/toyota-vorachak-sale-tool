# PWA Specification: Toyota Dealer Sale Tool
**แอปพลิเคชันเว็บแบบก้าวหน้า**

Version: 2.0
Last Updated: 2026-03-28
Status: Implemented

---

## Overview

Progressive Web App (PWA) implementation for Toyota Dealer Sale Tool provides native app-like experience across iOS, Android, and desktop browsers. The app features a versioned service worker with cache-first strategy for static assets and network-first for Supabase API calls, offline fallback page support, and a complete web app manifest for installability.

---

## IMPLEMENTED: Web App Manifest

### manifest.json
Location: `/public/manifest.json`

```json
{
  "name": "Toyota Sale Tool | วรจักร์ยนต์",
  "short_name": "SaleTool",
  "description": "Toyota Vorachakyont Dealer Sale Tool — ระบบจัดการการขายรถยนต์",
  "start_url": "/",
  "display": "standalone",
  "orientation": "portrait",
  "theme_color": "#1B7A3F",
  "background_color": "#F5F7F5",
  "icons": [
    { "src": "/icons/icon-192.png", "sizes": "192x192", "type": "image/png" },
    { "src": "/icons/icon-512.png", "sizes": "512x512", "type": "image/png" },
    { "src": "/icons/icon-512.png", "sizes": "512x512", "type": "image/png", "purpose": "maskable" }
  ]
}
```

### Key Properties
- **display: standalone** — fullscreen app experience, no browser chrome
- **orientation: portrait** — portrait-first, landscape supported
- **theme_color: #1B7A3F** — Toyota Green applied to system UI
- **background_color: #F5F7F5** — matches app body background

---

## IMPLEMENTED: Service Worker

### File: `/public/sw.js`

### Versioned Cache
- Cache name: `toyota-sale-v2`
- Incremented on each major release
- Old caches cleaned on activate event

### Pre-cached Assets
On install, the service worker caches:
- `/` — app root
- `/index.html` — SPA shell
- `/offline.html` — offline fallback page
- `/manifest.json` — PWA manifest

### Caching Strategies

#### Network-First (Supabase API)
WHEN a fetch request targets Supabase (hostname contains 'supabase')
THEN:
1. Attempt network fetch first
2. On success: cache response, return to app
3. On failure: return cached version if available

#### Cache-First (Static Assets)
WHEN a fetch request targets same-origin static assets
THEN:
1. Check cache for existing response
2. If cached: return immediately (instant load)
3. If not cached: fetch from network
4. On success: cache response for future use
5. On failure: return offline fallback for document requests

### Offline Fallback
WHEN a document request fails (no cache, no network)
THEN serve `/offline.html` from cache
- Cached during service worker install event
- Lightweight HTML with inline styles
- Toyota branding and "offline" message
- Refresh button to retry

### Lifecycle Events

#### Install
```javascript
self.addEventListener('install', (e) => {
  e.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => cache.addAll(PRECACHE))
      .then(() => self.skipWaiting())
  )
})
```

#### Activate
```javascript
self.addEventListener('activate', (e) => {
  e.waitUntil(
    caches.keys()
      .then(keys => Promise.all(
        keys.filter(k => k !== CACHE_NAME).map(k => caches.delete(k))
      ))
      .then(() => self.clients.claim())
  )
})
```

- `skipWaiting()`: immediately take control
- `clients.claim()`: control all open tabs
- Clean old caches: delete any cache not matching current version

---

## IMPLEMENTED: Service Worker Registration

In `main.jsx`:
```javascript
if ('serviceWorker' in navigator) {
  navigator.serviceWorker.register('/sw.js')
    .then(reg => console.log('SW registered'))
    .catch(err => console.error('SW registration failed'))
}
```

---

## IMPLEMENTED: Viewport & Mobile Configuration

### HTML Head Meta Tags
```html
<meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no, viewport-fit=cover">
<meta name="theme-color" content="#1B7A3F">
<meta name="apple-mobile-web-app-capable" content="yes">
<meta name="apple-mobile-web-app-status-bar-style" content="black-translucent">
<link rel="manifest" href="/manifest.json">
```

### Safe Area Insets
- Bottom nav uses `env(safe-area-inset-bottom)` for notched devices
- Content padding accounts for safe areas
- Viewport-fit: cover enables full-screen rendering

---

## IMPLEMENTED: Responsive Design

### Breakpoints
- **Phone (390px)**: Single column, full-width cards, bottom tab nav
- **Tablet (768px+)**: Multi-column layouts where appropriate

### Touch Targets
- Minimum 44x44px for all interactive elements
- Bottom nav buttons: full flex-1 width, 78px height
- Form inputs: 44px minimum height
- Font size 16px on inputs to prevent iOS auto-zoom

---

## PWA Installability Checklist

- [x] manifest.json present and valid
- [x] Icons (192px + 512px) provided
- [x] Service Worker registered and functional
- [x] Start URL specified in manifest
- [x] Display mode: standalone
- [x] Theme colors defined
- [x] Viewport configured correctly
- [x] Offline fallback support

---

## IMPLEMENTED: Sprint 2 — localStorage Persistence

### Zustand Persist Middleware
- All major stores use `zustand/middleware/persist` with localStorage
- Store keys: `toyota-auth`, `toyota-leads`, `toyota-bookings`, `toyota-cars`
- `partialize` used to persist only essential state slices
- `onRehydrateStorage` callback re-seeds mock data if persisted state is empty

### Visibility Refresh Hook
- App re-checks auth state on `visibilitychange` event
- Prevents stale state after background/foreground transitions
- Smart page restore: user returns to their last page, not redirected to login

---

**End of PWA Specification**
