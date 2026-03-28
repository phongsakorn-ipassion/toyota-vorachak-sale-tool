# Toyota Vorachakyont Sale Tool — Project Memory

## Project Overview
Mobile-first PWA for Toyota dealership sales teams (วรจักร์ยนต์). Sales staff manage leads, browse car catalog, calculate payments, and book cars. Managers view dashboards, pipeline, targets, and reports.

## Tech Stack
- React 18 + Vite 5 + Tailwind CSS 3 + Zustand 4 + React Router 6 (HashRouter)
- Chart.js 4 + react-chartjs-2 for dashboards
- Supabase JS 2 (optional — app works fully with mock data)
- PWA: Service Worker + Web App Manifest
- Deploy: GitHub Actions → GitHub Pages

## Live URLs
- **App**: https://phongsakorn-ipassion.github.io/toyota-vorachak-sale-tool/
- **Repo**: https://github.com/phongsakorn-ipassion/toyota-vorachak-sale-tool
- **Account**: phongsakorn-ipassion

## Supabase Setup
- URL: ooepnqsgxowwtmjlytye.supabase.co
- Demo users: sales@demo.com / manager@demo.com (password: demo1234)
- Sales UUID: 7db2bc2f-ab8c-4f57-b668-c3f7894128a6
- Manager UUID: 3bb1d4e3-8c41-478f-a546-35a4e621b45c
- Schema: supabase/schema.sql (branches, profiles, cars, leads, lead_activities, bookings, notifications)
- Auth trigger handle_new_user() patched with fallback UUID + EXCEPTION handler

## Design Source of Truth
**`Toyota-SaleTool-Prototype-v5.html`** is the SINGLE SOURCE OF TRUTH for all UI design.
The user demands pixel-perfect matching to this prototype. Always reference it for layout, icons, colors, spacing, and interaction patterns.

## User Preferences (CRITICAL)
1. **MUST be native PWA** — NO device frames, NO DemoBar, NO fake StatusBar
2. **MUST match HTML prototype exactly** — layout, icons, journeys, spacing
3. **MUST have full working CRUD** — NOT view-only screens
4. **Thai language throughout** — all labels, notifications, user names in Thai
5. **User gives lukewarm feedback** — "OK, that might fine" means accepted but may come back with corrections

## Architecture
- **Mock-first**: App runs entirely with mock data (no Supabase required)
- **Stores**: 6 Zustand stores (auth, car, lead, booking, dashboard, ui)
- **Data flow**: Pages → Stores → Mock data (or Supabase when configured)
- **Routing**: HashRouter (required for GitHub Pages)

## Current State (as of commit 70b8f18)
All 13 pages were rewritten to match the HTML prototype exactly. However, this rewrite STRIPPED OUT the CRUD functionality that was added in commit e8f9273. The stores still have full CRUD methods but NO pages call them.

### What's broken / needs re-integration:
- LeadDetailPage: Call/LINE/Note/Appointment actions are alerts-only again (were real CRUD)
- ACardPage: Edit mode (?edit=ID) removed (was working)
- BookingPage: Booking persistence removed (saveBooking not called)
- CarDetailPage: Booking button may not link properly
- PipelinePage: Cards not clickable, no move-stage functionality
- TargetsPage: No edit mode for manager
- SalesDashboard: Static hardcoded data (was dynamic)
- ManagerDashboard: Branch filter cosmetic only (was working)
- ReportsPage: No export (was working CSV/PDF)
- NotificationsPage: No deep-links, no delete (was working)
- ProfilePage: Created but removed from routes

### What the stores support (ready to connect):
- leadStore: addLead, updateLead, deleteLead, changeLevel, changeStage, addActivity, assignLead, getLeadById, getPipelineData, getLeadStats, search
- bookingStore: saveBooking, getBookings, getBookingById, cancelBooking, calculator
- dashboardStore: getSalesKpis, getManagerKpis, updateTeamMemberTarget, updateBranchTarget
- authStore: login, logout, updateProfile
- uiStore: addNotification, markRead, markAllRead, deleteNotification, clearAllNotifications

## Bottom Nav (from prototype)
- **Sales**: หน้าหลัก / Leads / รุ่นรถ / ผ่อน
- **Manager**: Dashboard / Pipeline / Targets / Reports

## Data Constants
- 6 cars: Corolla Altis, Yaris Cross, Land Cruiser FJ, bZ4X, Hilux Revo, GR 86
- 10 leads across pipeline stages (new/test_drive/negotiation/won/lost)
- 3 branches: สาขาลาดพร้าว, สาขาบางนา, สาขาอ่อนนุช
- 5 team members for leaderboard
- Loan: 2.49% rate, terms 48/60/72 months
- Booking deposit: ฿5,000

## Commit History
1. 7f3ed02 — Initial MVP (94 files, 18K lines)
2. 99fbe69 — Fix GitHub Actions write permissions
3. e241e08 — Fix Vite base path for GitHub Pages
4. a72de6b — Remove device frame, go native PWA
5. e8f9273 — Full CRUD + user journeys (24 files, +2,559 lines) ← HAS THE CRUD CODE
6. 70b8f18 — Rewrite all pages to match prototype (21 files, -1,575 net) ← CURRENT, lost CRUD

## Priority for Next Work
Re-integrate CRUD functionality into the prototype-matching pages. The pages should look like the prototype AND have full working CRUD. This means merging the best of e8f9273 (functionality) with 70b8f18 (UI).
