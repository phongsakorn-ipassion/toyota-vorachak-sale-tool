# PWA Specification: Toyota Dealer Sale Tool
**แอปพลิเคชันเว็บแบบก้าวหน้า**

Version: 1.0  
Last Updated: 2026-03-28  
Status: Draft  

---

## ADDED Requirements
Progressive Web App (PWA) implementation for Toyota Dealer Sale Tool provides native app-like experience across iOS, Android, and desktop browsers. Service Worker enables offline functionality with cache-first strategy for static assets and network-first for API data. Responsive design adapts layouts and touch targets to phone (390px) and tablet (768px+) viewports. Safe area insets accommodate notched and edge-to-edge displays.

---

## MANIFEST CONFIGURATION

### Requirement: Web App Manifest File
manifest.json defines PWA metadata and installation properties for all platforms.

#### Scenario: Manifest File Location and Reference
WHEN the application loads  
THEN manifest.json is located at: `/public/manifest.json`  
AND referenced in HTML head:
```html
<link rel="manifest" href="/manifest.json">
```
AND includes integrity check for production environments

#### Scenario: Basic Manifest Properties
WHEN the manifest.json is parsed by the browser  
THEN it includes required fields:
```json
{
  "name": "Toyota Sale Tool",
  "short_name": "SaleTool",
  "description": "Sales and dealer management platform for Toyota",
  "scope": "/",
  "start_url": "/",
  "display": "standalone",
  "orientation": "portrait",
  "theme_color": "#1B7A3F",
  "background_color": "#F5F7F5"
}
```

#### Scenario: Application Name and Branding
WHEN user installs the application  
THEN:
- Full name displays: "Toyota Sale Tool" (used in app stores, about screens)
- Short name displays: "SaleTool" (used on home screen, task switchers, max 12 characters)
- Both names include Toyota branding for consistency
- Theme color: #1B7A3F (Toyota Green) applies to URL bar and system UI

#### Scenario: Display and Orientation
WHEN user launches installed app  
THEN:
- Display mode: "standalone" (fullscreen, no browser UI)
- Orientation: "portrait" (portrait-first, but allows landscape on rotation)
- Status bar: system default (transparent on iOS, Toyota Green on Android)
- App appears as native application, not web browser

#### Scenario: Start URL Configuration
WHEN user opens installed application  
THEN start_url: "/" loads  
AND application initializes from home route  
AND authentication check runs (redirects to login if needed)  
AND no query parameters are appended to start_url

---

## APP ICONS

### Requirement: Icon Assets and Sizes
Multiple icon sizes ensure clarity across all platforms and use cases.

#### Scenario: 192x192 Icon (Home Screen)
WHEN app is installed  
THEN 192x192 PNG icon displays:
- Location: `/public/icons/icon-192x192.png`
- Format: PNG with transparency (for rounded corners)
- Resolution: 192x192 pixels
- Colors: Toyota Green (#1B7A3F) background with white icon/logo
- Safe zone: 40px padding from edges
- Declared in manifest:
```json
{
  "src": "/icons/icon-192x192.png",
  "sizes": "192x192",
  "type": "image/png",
  "purpose": "any"
}
```

#### Scenario: 512x512 Icon (Splash Screen / App Store)
WHEN app loads or is listed in app stores  
THEN 512x512 PNG icon displays:
- Location: `/public/icons/icon-512x512.png`
- Format: PNG with transparency
- Resolution: 512x512 pixels
- Colors: Toyota Green (#1B7A3F) background with white icon/logo
- Safe zone: 100px padding from edges (icon in 312x312px center)
- Declared in manifest:
```json
{
  "src": "/icons/icon-512x512.png",
  "sizes": "512x512",
  "type": "image/png",
  "purpose": "any maskable"
}
```

#### Scenario: Maskable Icon Support
WHEN app displays icon on devices with rounded corners or cutouts  
THEN maskable icon allows system to apply custom masks:
```json
{
  "src": "/icons/icon-512x512.png",
  "sizes": "512x512",
  "type": "image/png",
  "purpose": "maskable"
}
```
- Icon design includes safe zone with full-color area
- Background extends to edges for proper masking
- Logo/content positioned in safe center

#### Scenario: Icon Testing
WHEN app is tested on different devices  
THEN icons:
- Display crisp and clear (no pixelation)
- Scale properly on home screens and splash screens
- Maintain readability at small sizes (48px+)
- Render correctly with system-applied corners and cutouts

---

## SERVICE WORKER IMPLEMENTATION

### Requirement: Service Worker Registration
Service Worker enables offline functionality and asset caching.

#### Scenario: Service Worker File Location
WHEN application loads  
THEN Service Worker located at: `/public/service-worker.js`  
AND registration occurs in application root:
```javascript
if ('serviceWorker' in navigator) {
  navigator.serviceWorker.register('/service-worker.js')
    .then(reg => console.log('SW registered'))
    .catch(err => console.error('SW registration failed'))
}
```

#### Scenario: Service Worker Lifecycle
WHEN Service Worker is registered  
THEN lifecycle events occur:
1. Install event: cache static assets
2. Activate event: clean old cache versions
3. Fetch event: intercept network requests with caching strategy

#### Scenario: Service Worker Update
WHEN new version of application is deployed  
THEN Service Worker:
- Detects new service-worker.js file
- Installs in background (skipWaiting not enabled, allows graceful update)
- Waits for all pages to close before activation
- User sees "Update available" prompt (optional)
- Reloading page loads new version

---

### Requirement: Cache-First Strategy for Static Assets
Static assets are served from cache with network fallback.

#### Scenario: Cache-First Configuration
WHEN Service Worker's fetch event fires for static assets  
THEN caching strategy:
1. Check service worker cache for asset
2. Return cached version if available (instant load)
3. If not in cache, fetch from network
4. Cache new version for future use
5. Handle cache size limits (max 20MB)

#### Scenario: Static Assets to Cache
WHEN application initializes  
THEN following assets are cached:
- JavaScript bundles (app-*.js, _next/static/chunks/*)
- CSS files (_next/static/css/*)
- Web fonts (fonts/*)
- Images (images/*, icons/*)
- Manifest and icon files
- HTML shell (/index.html)

#### Scenario: Cache Version Management
WHEN application is updated  
THEN:
- New cache version created (v1, v2, v3, etc.)
- Old caches remain until activation complete
- Unused caches deleted after activation
- Cache version name: `toyota-sale-tool-v${VERSION}`

---

### Requirement: Network-First Strategy for API Calls
API requests prioritize fresh data with fallback to cached responses.

#### Scenario: Network-First Configuration
WHEN Service Worker's fetch event fires for API requests  
THEN caching strategy:
1. Attempt to fetch from network immediately
2. Return response and cache for future use
3. If network fails, return cached version
4. If no cache available, return offline fallback

#### Scenario: API Request Patterns
WHEN application makes API calls  
THEN following patterns use network-first:
- `/api/leads/*` (lead data)
- `/api/sales/*` (sales data)
- `/api/targets/*` (target data)
- `/api/team/*` (team information)
- Supabase real-time subscriptions (prefer network)

#### Scenario: Cache Expiry for API Data
WHEN cached API response is retrieved  
THEN:
- Check response timestamp
- If > 5 minutes old, discard and fetch fresh
- If < 5 minutes old, return cached version
- Stale-while-revalidate pattern: serve stale, fetch fresh in background

---

## OFFLINE FUNCTIONALITY

### Requirement: Offline Fallback Screen
When network is unavailable, users see branded offline message instead of blank page.

#### Scenario: Offline Detection
WHEN application detects no network connection  
THEN:
- Service Worker intercepts failed network request
- Browser is offline (navigator.onLine === false)
- No cached response available for requested resource

#### Scenario: Offline Fallback Display
WHEN offline fallback is triggered  
THEN screen displays:
- Toyota logo (centered, 80x80px)
- Heading: "ออฟไลน์ / Offline"
- Message: "ขออภัยค่ะ ไม่มีการเชื่อมต่ออินเทอร์เน็ต / Sorry, no internet connection"
- Subtext: "โปรดตรวจสอบการเชื่อมต่อและลองใหม่ / Please check your connection and try again"
- Refresh button: "รีเฟรช / Refresh"
- Background: #F5F7F5 (light gray)
- Text: #333333 (dark gray)
- Button: Toyota Green (#1B7A3F)

#### Scenario: Offline Page Caching
WHEN offline fallback HTML is needed  
THEN:
- Fallback page cached during Service Worker install
- Lightweight HTML (~2KB) with inline CSS
- No external dependencies
- Loads instantly on offline

#### Scenario: Data Available Offline
WHEN user is offline but has cached data  
THEN:
- Application displays cached dashboard data
- Lead list shows from cache
- User can view (but not edit) cached information
- "Offline Mode" badge displays in UI: "โหมดออฟไลน์ / Offline Mode"
- Edit buttons disabled with tooltip: "ต้องเชื่อมต่อเพื่อแก้ไข / Internet required to edit"

---

## INSTALLATION & APP LAUNCHER

### Requirement: Install Prompt for iOS and Android
Custom install prompts encourage users to add app to home screen.

#### Scenario: Android Install Prompt
WHEN user visits app on Android and hasn't installed  
THEN browser displays system install prompt:
- "Install app?" dialog
- App name: "Toyota Sale Tool"
- Icons: 192x192 preview
- User can dismiss or install
- Installed app appears on home screen
- Requires manifest and icons properly configured

#### Scenario: iOS Install Prompt
WHEN user visits app on iOS Safari and hasn't installed  
THEN custom install banner displays:
- Position: bottom of screen
- Icon: app icon (192x192)
- Title: "Add to Home Screen"
- Description: "Access your sales dashboard anytime"
- Action buttons: "Add" / "Not Now"
- Uses meta tag for apple-mobile-web-app:
```html
<meta name="apple-mobile-web-app-capable" content="yes">
<meta name="apple-mobile-web-app-title" content="SaleTool">
<meta name="apple-mobile-web-app-status-bar-style" content="black-translucent">
```

#### Scenario: Custom Install Banner
WHEN app is not installed and user has visited multiple times  
THEN application displays custom banner:
- Appears after 2+ visits or on third visit
- Message: "เพิ่มลงหน้าจอหลัก / Add to Home Screen"
- "Install" button (Toyota Green)
- "Dismiss" button (gray)
- Dismissible for session (returns after 1 week)

---

## RESPONSIVE DESIGN

### Requirement: Breakpoints and Layout Adaptation
Application layout adapts to phone (390px) and tablet (768px+) viewports.

#### Scenario: Phone Breakpoint (390px and Below)
WHEN viewport width is ≤ 390px (iPhone SE, smaller phones)  
THEN layout applies:
- Single column layout for all screens
- Cards: full width with 16px horizontal margins
- Content area: max-width 100% (minus margins)
- Navigation: bottom tab bar (56px height)
- Header: 56px height
- Font sizes: 16px body, 20px headings, 14px captions
- Touch targets: minimum 44x44px (accessibility)
- Spacing: 8px, 12px, 16px units
- Lists: single-item per row

#### Scenario: Tablet Breakpoint (768px and Above)
WHEN viewport width is ≥ 768px (iPad, tablets, desktops)  
THEN layout applies:
- Two-column layouts for content
- Cards: 300-400px width in grid
- Content area: max-width 1200px, centered
- Sidebar navigation: 240px width (left)
- Header: 64px height
- Font sizes: 16px body, 24px headings, 14px captions
- Touch targets: minimum 48x48px
- Spacing: 12px, 16px, 24px units
- Data tables: full width with horizontal scroll
- Modal dialogs: centered, max-width 600px

#### Scenario: Desktop Optimization (1024px and Above)
WHEN viewport width is ≥ 1024px (desktop browsers)  
THEN layout applies:
- Three-column layouts possible (sidebar + content + panel)
- Content area: max-width 1400px
- Hover states enabled (not on touch devices)
- Context menus on right-click
- Desktop-specific interactions (drag-and-drop)

---

### Requirement: Responsive Card Layouts
Cards and content containers scale appropriately for different screen sizes.

#### Scenario: Phone Card Layout (Single Column)
WHEN displaying lead cards on phone  
THEN:
- One card per row, full width
- Padding: 16px horizontal, 12px vertical
- Card height: auto (content-driven)
- Image: 280px width × 157px height (16:9 ratio, if present)
- Button: full width, 44px height
- Text: left-aligned, no truncation

#### Scenario: Tablet Card Grid (2 Columns)
WHEN displaying lead cards on tablet  
THEN:
- Two cards per row
- Card width: (viewport - 48px) / 2 = ~340px
- Gap between cards: 16px
- Padding: 24px horizontal
- Image: 300px width × 169px height
- Button: full width within card
- Text: left-aligned, 2-line truncation for titles

#### Scenario: Desktop Card Grid (3+ Columns)
WHEN displaying lead cards on desktop  
THEN:
- Three or more cards per row (depending on width)
- Card width: ~320px
- Gap between cards: 20px
- Padding: 32px horizontal
- Image: 300px width × 169px height
- Button: full width within card
- Hover effects: shadow increase, slight scale

---

### Requirement: Wider Layouts for Tablets
Tablet displays utilize extra screen real estate with multi-column layouts.

#### Scenario: Two-Column Dashboard on Tablet
WHEN manager views dashboard on iPad (768px+)  
THEN:
- Left sidebar: 240px (navigation, filters)
- Main content: remaining width
- Cards display in 2-column grid
- Right panel (optional): 300px (details, actions)
- Sidebar collapse option for full-width content

#### Scenario: Data Table on Tablet
WHEN manager views lead table on tablet  
THEN:
- Horizontal scroll enabled if needed
- Columns: 6-8 visible columns (adjust based on data)
- Row height: 56px
- Sticky header: stays visible on scroll
- Sticky left column: first column (lead name) stays visible

---

## SAFE AREA INSETS

### Requirement: Notch and Edge-to-Edge Display Support
Safe area insets accommodate iPhone notches, Dynamic Island, and other display cutouts.

#### Scenario: Safe Area CSS Variables
WHEN application renders on notched device  
THEN CSS safe area insets are applied:
```css
:root {
  --safe-area-inset-top: env(safe-area-inset-top, 0);
  --safe-area-inset-right: env(safe-area-inset-right, 0);
  --safe-area-inset-bottom: env(safe-area-inset-bottom, 0);
  --safe-area-inset-left: env(safe-area-inset-left, 0);
}

body {
  padding-top: var(--safe-area-inset-top);
  padding-bottom: var(--safe-area-inset-bottom);
}

header {
  padding-left: var(--safe-area-inset-left);
  padding-right: var(--safe-area-inset-right);
}
```

#### Scenario: iPhone with Notch
WHEN app displays on iPhone 12 Pro (notch at top)  
THEN:
- Header padding-top: 47px (notch height)
- Content area shifts below notch
- Header background extends under notch (dark area)
- Status icons visible in notch area

#### Scenario: iPhone with Dynamic Island
WHEN app displays on iPhone 14+ (Dynamic Island)  
THEN:
- Header padding-top: 51px
- Dynamic Island remains visible (Apple controls)
- Content area respects island boundaries
- Notification badges appear in island

#### Scenario: iPad with Home Indicator
WHEN app displays on iPad with rounded corners  
THEN:
- Bottom padding-bottom: 20px (home indicator area)
- Last interactive element (button) positioned 20px above bottom
- Content area respects bottom safe area
- No overlap with system gesture areas

#### Scenario: Full-Screen Modal with Safe Areas
WHEN modal dialog displays on notched device  
THEN:
- Modal respects all safe areas
- Close button positioned outside notch area
- Content scrollable within safe bounds
- Background blur behind modal

---

## VIEWPORT CONFIGURATION

### Requirement: Viewport Meta Tag
Proper viewport configuration ensures correct rendering and zoom behavior.

#### Scenario: Viewport Meta Tag Setup
WHEN application loads  
THEN HTML head includes:
```html
<meta name="viewport" 
      content="width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no, viewport-fit=cover">
```

#### Scenario: Viewport Dimensions
WHEN viewport meta tag is processed  
THEN:
- width=device-width: layout width matches device width
- initial-scale=1: no zoom on load (1:1 ratio)
- maximum-scale=1: prevents user zoom (fixed scaling)
- user-scalable=no: disables pinch-zoom
- viewport-fit=cover: extends content under notches/curves

#### Scenario: Zoom Behavior
WHEN user attempts to zoom on application  
THEN:
- Pinch zoom is disabled (user-scalable=no)
- Double-tap zoom is disabled
- Text selection remains enabled (accessibility)
- Device zoom (system settings) still respected
- Content remains readable at default scale

#### Scenario: Orientation Lock
WHEN application runs on mobile device  
THEN portrait orientation is primary:
- Manifest orientation: "portrait"
- Landscape supported but not forced
- Content adapts to landscape (button repositioning)
- Split-screen multitasking supported

---

## TOUCH TARGETS AND MOBILE INTERACTION

### Requirement: Touch Target Sizing
Interactive elements meet minimum touch target sizes for mobile usability.

#### Scenario: Minimum Touch Target Size
WHEN user interacts with buttons, links, or controls  
THEN:
- Minimum size: 44×44px (WCAG touch target)
- Recommended size: 48×48px (Android Material Design)
- Padding around text: 8px minimum
- Spacing between targets: 8px minimum

#### Scenario: Button Touch Targets
WHEN user taps buttons  
THEN:
- Primary buttons: 48×48px minimum (including padding)
- Secondary buttons: 44×44px minimum
- Text buttons: 40px height with 8px left/right padding
- Icon buttons: 48×48px (icon 24×24px centered)

#### Scenario: Form Input Touch Targets
WHEN user interacts with form fields  
THEN:
- Input field height: 44px minimum
- Select dropdown height: 44px minimum
- Checkbox/radio size: 24×24px (clickable area 44×44px)
- Text input font size: 16px (prevents auto-zoom on iOS)

#### Scenario: Link Touch Targets
WHEN user taps links in lists  
THEN:
- List item height: 44px minimum
- Link text: 16px+ font size
- Padding around link: 12px minimum
- Hover/active states: visual feedback

---

## PERFORMANCE OPTIMIZATION

### Requirement: Asset Compression and Loading
Static assets are optimized for fast loading and offline availability.

#### Scenario: JavaScript Bundle Optimization
WHEN application loads JavaScript  
THEN:
- Code splitting: chunks by route (~50KB max per chunk)
- Minification: remove comments, whitespace
- Tree-shaking: unused code removed
- Compression: gzip enabled (~30% of original)
- Total initial bundle: < 200KB (gzipped)

#### Scenario: CSS Optimization
WHEN styles are applied  
THEN:
- Critical CSS inlined in HTML head (~5KB)
- Non-critical CSS async-loaded
- Minification and autoprefixing applied
- No unused CSS in bundles
- CSS-in-JS scoped to components

#### Scenario: Image Optimization
WHEN images are loaded  
THEN:
- Format: WebP with JPEG fallback
- Responsive: multiple sizes (192px, 384px, 768px)
- Lazy loading for below-fold images
- Compression: lossy for photos, lossless for icons
- Icon files: SVG when possible (< 1KB)

#### Scenario: Font Loading
WHEN fonts are applied  
THEN:
- System fonts as fallback (fast, no network required)
- Subset fonts loaded for Thai + English characters
- WOFF2 format (60% smaller than TTF)
- Font display: swap (show text immediately, update when font loads)
- Max font files: 2 (regular + bold weights)

---

## INSTALLABILITY CHECKLIST

### Requirement: PWA Installability Criteria
Application meets all requirements for installable PWA status.

#### Scenario: Google PWA Checklist Compliance
WHEN application is audited for PWA compliance  
THEN passes all required criteria:
- Manifest file present and valid ✓
- Icons (192px + 512px) provided ✓
- Service Worker registered and functional ✓
- HTTPS enforced (no mixed content) ✓
- Start URL specified in manifest ✓
- Display mode: standalone ✓
- Theme colors defined ✓
- Viewport configured correctly ✓
- Install prompt eligible ✓

#### Scenario: Lighthouse PWA Audit
WHEN Lighthouse audits application  
THEN scores:
- PWA score: ≥ 90/100
- Performance score: ≥ 80/100
- Best Practices score: ≥ 90/100
- Accessibility score: ≥ 90/100
- SEO score: ≥ 90/100

---

## TESTING & QA

### Requirement: Cross-Device Testing
Application is tested across representative devices and screen sizes.

#### Scenario: iPhone Testing
WHEN tested on iPhone models  
THEN application tested on:
- iPhone 12 (390px, notch)
- iPhone 14 Pro (390px, Dynamic Island)
- iPhone SE (375px, no notch)
- iOS 15+
- Safari and Chrome browsers

#### Scenario: Android Testing
WHEN tested on Android devices  
THEN application tested on:
- Samsung Galaxy S21 (360px, no notch)
- Samsung Galaxy S21 Ultra (440px, hole-punch)
- Tablet: Samsung Galaxy Tab S6 (768px)
- Android 11+
- Chrome, Samsung Internet, Firefox browsers

#### Scenario: iPad Testing
WHEN tested on iPad  
THEN application tested on:
- iPad Air (768px portrait, 1024px landscape)
- iPad Pro 11" (834px portrait, 1194px landscape)
- iPad Pro 12.9" (1024px portrait, 1366px landscape)
- iPadOS 15+
- Safari browser

#### Scenario: Offline Testing
WHEN testing offline functionality  
THEN:
- Service Worker cache verified
- Network disabled (DevTools offline mode)
- Offline fallback displays correctly
- Cached data loads without network
- Sync queue handles updates on reconnect

---

