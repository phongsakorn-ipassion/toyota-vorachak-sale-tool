# Toyota Vorachakyont Sale Tool

**Toyota Vorachakyont Sale Tool** is a mobile-first Progressive Web App (PWA) designed for Toyota dealership sales teams. It provides car catalog browsing, lead management, booking flow, payment calculators, team dashboards, and real-time notifications.

เครื่องมือสำหรับทีมขาย โตโยต้า วรจักร์ยนต์ -- แอปพลิเคชัน PWA ออกแบบมาสำหรับพนักงานขายและผู้จัดการสาขา ครอบคัลแค็ตตาล็อกรถ, การจัดการลีดลูกค้า, การจอง, คำนวณสินเชื่อ, และแดชบอร์ดสำหรับผู้จัดการ

---

## Tech Stack

| Layer | Technology |
|---|---|
| Framework | React 18 + Vite 5 |
| Styling | Tailwind CSS 3.4 |
| State | Zustand 4.5 |
| Routing | React Router 6 |
| Charts | Chart.js 4 + react-chartjs-2 |
| Backend | Supabase (Auth, Database, RLS) |
| Hosting | GitHub Pages |
| PWA | Service Worker + Web App Manifest |

---

## Quick Start

### Prerequisites

- Node.js 18+ and npm
- A Supabase account (free tier works)

### 1. Install Dependencies

```bash
npm install
```

### 2. Set Up Supabase

1. Create a new project at [supabase.com](https://supabase.com)
2. Open **SQL Editor** in the Supabase Dashboard
3. Copy and paste the entire contents of `supabase/schema.sql`
4. Click **Run** to execute the schema + seed data
5. Go to **Authentication > Users** and create demo users:
   - `sales@demo.com` (password: `demo1234`, user metadata: `{"role":"sales","name":"สมศักดิ์ ดีงาม"}`)
   - `manager@demo.com` (password: `demo1234`, user metadata: `{"role":"mgr","name":"วิชัย ผู้จัดการ"}`)
6. Copy your **Project URL** and **anon key** from **Settings > API**

### 3. Configure Environment

Create `.env.local` in the project root:

```env
VITE_SUPABASE_URL=https://your-project-ref.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key-here
```

### 4. Run Development Server

```bash
npm run dev
```

Open [http://localhost:5173](http://localhost:5173) in your browser (or use mobile device preview).

---

## GitHub Pages Deployment

### Automatic (GitHub Actions)

The project includes a GitHub Actions workflow at `.github/workflows/` that automatically builds and deploys to GitHub Pages on push to `main`.

### Manual

```bash
# Build the production bundle
npm run build

# The output is in /dist -- deploy this folder to GitHub Pages
# Or use gh-pages:
npx gh-pages -d dist
```

### Base Path Configuration

If deploying to `https://username.github.io/repo-name/`, update `vite.config.js`:

```js
export default defineConfig({
  base: '/repo-name/',
  // ...
})
```

---

## Project Structure

```
toyota-sale-tool/
  index.html                 # Entry point
  package.json
  vite.config.js
  tailwind.config.js
  postcss.config.js
  .env.example               # Environment variable template
  supabase/
    schema.sql               # Complete Supabase schema + seed data
  public/
    manifest.json             # PWA manifest
    sw.js                     # Service Worker
    icons/                    # App icons (SVG)
    404.html                  # SPA fallback for GitHub Pages
  src/
    main.jsx                  # React entry
    App.jsx                   # Router + layout
    styles/
      globals.css             # Tailwind base + custom styles
    lib/
      supabase.js             # Supabase client init
      mockData.js             # Demo/fallback data
      constants.js            # App constants
      formats.js              # Number/date formatters
    stores/
      authStore.js            # Auth state (Zustand)
      carStore.js             # Car catalog state
      leadStore.js            # Lead management state
      bookingStore.js         # Booking flow state
      dashboardStore.js       # Dashboard KPIs
      uiStore.js              # UI state (modals, toasts)
    hooks/
      useCountdown.js         # Countdown timer hook
    components/
      layout/                 # AppShell, BottomNav, DemoBar, StatusBar
      ui/                     # Button, Card, Badge, Modal, Input, etc.
      icons/                  # SVG icon component
      car/                    # CarGallery, CarListItem, SpecAccordion
      lead/                   # LeadListItem, LeadActions, ActivityTimeline
      booking/                # BookingStep1-3 wizard components
      dashboard/              # KPIGrid, WeeklyChart, Leaderboard, etc.
    pages/
      LoginPage.jsx           # Login with role selector
      CatalogPage.jsx         # Car catalog grid
      CarDetailPage.jsx       # Car specs + gallery + video
      LeadListPage.jsx        # Lead list with filters
      LeadDetailPage.jsx      # Lead detail + activity timeline
      BookingPage.jsx         # 3-step booking wizard
      PaymentCalcPage.jsx     # Loan calculator
      SalesDashboard.jsx      # Sales rep dashboard
      ManagerDashboard.jsx    # Branch manager dashboard
      PipelinePage.jsx        # Sales pipeline board
      NotificationsPage.jsx   # Notification center
      ACardPage.jsx           # A-Card (digital business card)
      TargetsPage.jsx         # Monthly targets tracking
      ReportsPage.jsx         # Reports and analytics
```

---

## Demo Credentials

| Role | Email | Password |
|---|---|---|
| Sales Rep | sales@demo.com | demo1234 |
| Branch Manager | manager@demo.com | demo1234 |

---

## Screenshots

> Screenshots will be added here after deployment.

| Screen | Preview |
|---|---|
| Login | _coming soon_ |
| Car Catalog | _coming soon_ |
| Lead Management | _coming soon_ |
| Booking Flow | _coming soon_ |
| Manager Dashboard | _coming soon_ |

---

## License

Internal use only -- Toyota Vorachakyont dealership.
