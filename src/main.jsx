import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'
import './styles/globals.css'

// Register service worker + listen for new version
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register(
      `${import.meta.env.BASE_URL || '/'}sw.js`
    ).then((registration) => {
      // Check for updates every 60 seconds
      setInterval(() => registration.update(), 60000)
    }).catch(() => {})
  })

  // Listen for messages from service worker
  navigator.serviceWorker.addEventListener('message', (event) => {
    if (event.data?.type === 'NEW_VERSION_AVAILABLE') {
      showUpdateBanner()
    }
  })

  // Also detect when a new SW is waiting (in case message is missed)
  navigator.serviceWorker.ready.then((registration) => {
    registration.addEventListener('updatefound', () => {
      const newWorker = registration.installing
      if (newWorker) {
        newWorker.addEventListener('statechange', () => {
          if (newWorker.state === 'activated') {
            showUpdateBanner()
          }
        })
      }
    })
  })
}

function showUpdateBanner() {
  // Don't show if already visible
  if (document.getElementById('update-banner')) return

  const banner = document.createElement('div')
  banner.id = 'update-banner'
  banner.style.cssText = `
    position: fixed; top: 0; left: 0; right: 0; z-index: 9999;
    background: #1B7A3F; color: white; padding: 10px 16px;
    display: flex; align-items: center; justify-content: space-between;
    font-family: 'Sarabun', sans-serif; font-size: 13px; font-weight: 600;
    box-shadow: 0 2px 8px rgba(0,0,0,0.15);
    animation: slideDown 0.3s ease;
  `
  banner.innerHTML = `
    <span style="display:flex;align-items:center;gap:8px;">
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4M7 10l5 5 5-5M12 15V3"/></svg>
      มีเวอร์ชันใหม่พร้อมใช้งาน
    </span>
    <button id="update-btn" style="
      background: white; color: #1B7A3F; border: none; padding: 6px 14px;
      border-radius: 100px; font-size: 12px; font-weight: 700; cursor: pointer;
      font-family: 'Sarabun', sans-serif;
    ">อัปเดต</button>
  `

  // Add animation keyframes
  const style = document.createElement('style')
  style.textContent = `@keyframes slideDown { from { transform: translateY(-100%); } to { transform: translateY(0); } }`
  document.head.appendChild(style)

  document.body.appendChild(banner)

  document.getElementById('update-btn').addEventListener('click', () => {
    window.location.reload()
  })
}

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
)
