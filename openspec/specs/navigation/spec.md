# Navigation Specification
## Toyota Dealer Sale Tool PWA

**Version:** 2.0
**Status:** Implemented
**Last Updated:** 2026-03-28
**Format:** OpenSpec (Scenario-Based Requirements)

---

## Overview

Navigation architecture for Toyota Dealer Sale Tool PWA using React Router v6 with HashRouter (GitHub Pages compatibility). The app supports dual role-based dashboards (Sales/Manager) with role-aware routing, persistent browser history stack, bottom tab navigation, and profile page accessible from both roles.

---

## IMPLEMENTED: Routes & Screen Map

### Full Route Table (15+ pages)

| Route | Component | Role(s) | Purpose |
|-------|-----------|---------|---------|
| /login | LoginPage | All | Login with role selection |
| /sales-dash | SalesDashboard | sales, mgr | Sales dashboard with KPIs |
| /mgr-dash | ManagerDashboard | mgr | Manager dashboard |
| /catalog | CatalogPage | sales, mgr | Car catalog with 3-level filter |
| /car/:id | CarDetailPage | sales, mgr | Car detail with gallery, specs |
| /calc | PaymentCalcPage | sales, mgr | Payment calculator |
| /leads | LeadListPage | sales, mgr | Lead list with search + filter |
| /lead/:id | LeadDetailPage | sales, mgr | Lead detail with activities |
| /acard | ACardPage | sales, mgr | A-Card form (create/edit lead) |
| /booking | BookingPage | sales | 3-step booking wizard |
| /pipeline | PipelinePage | mgr | Pipeline kanban board |
| /targets | TargetsPage | mgr | Branch targets (view/edit) |
| /reports | ReportsPage | sales, mgr | Reports with charts + export |
| /notifications | NotificationsPage | sales, mgr | Notifications (read/delete) |
| /profile | ProfilePage | sales, mgr | Profile + role switching |

### Route Protection
- `ProtectedRoute` component wraps role-specific routes
- Checks `isLoggedIn` and `role` from authStore
- Redirects unauthenticated users to /login
- Redirects wrong-role users to their appropriate dashboard

---

## IMPLEMENTED: Bottom Navigation Tabs

### Sales Tabs (4 tabs)

| Order | Label | Route | Icon | Badge |
|-------|-------|-------|------|-------|
| 1 | หน้าหลัก | /sales-dash | home | - |
| 2 | Leads | /leads | users | Unread notifications dot |
| 3 | รุ่นรถ | /catalog | car | - |
| 4 | ผ่อน | /calc | calc | - |

### Manager Tabs (4 tabs)

| Order | Label | Route | Icon | Badge |
|-------|-------|-------|------|-------|
| 1 | Dashboard | /mgr-dash | chart | - |
| 2 | Pipeline | /pipeline | pipeline | Unread notifications dot |
| 3 | Targets | /targets | target | - |
| 4 | Reports | /reports | report | - |

### Badge Behavior
- Notification badge dot shows on Leads/Pipeline tab
- Reactive: uses `useUiStore.getUnreadCount()`
- Badge appears only when unreadCount > 0
- Small red dot (7px) with white border

### Active State
- Active tab: text-primary color
- Active indicator: small green dot below tab
- Inactive: text-t3 (gray)

---

## IMPLEMENTED: Profile Page Access

### Navigation to Profile
- Both Sales and Manager roles can access /profile
- Accessible via PageHeader user avatar or direct navigation
- Profile page includes role switching without logout

### Role Switching Flow
1. User navigates to /profile
2. Taps the opposite role card
3. `authStore.login(newRole)` is called
4. User is navigated to the new role's dashboard
5. BottomNav tabs update to match new role

---

## IMPLEMENTED: Navigation Patterns

### AppShell Layout
- `AppShell` wraps all authenticated pages
- Contains `<Outlet />` for page content
- Contains `<BottomNav />` fixed at bottom
- 78px bottom nav height with safe area inset

### Page Headers
- `PageHeader` component with title, optional back button, optional right action
- Back button calls `navigate(-1)`
- Fixed at top, does not scroll with content

### Screen Transitions
- `screen-enter` CSS animation on page mount
- Slide-in from right with opacity fade (0.22s ease)

### Deep Linking
- All routes support direct URL access via HashRouter
- Auth check on route access (redirect to login if not authenticated)
- Parameters in URL: /car/:id, /lead/:id, /acard?edit=ID

---

## Router Configuration

```jsx
<HashRouter>
  <Routes>
    <Route path="/login" element={<LoginPage />} />
    <Route path="/" element={<Navigate to="/login" />} />

    <Route element={<AppShell />}>
      {/* Shared (sales + mgr) */}
      <Route element={<ProtectedRoute allowedRoles={['sales', 'mgr']} />}>
        <Route path="/sales-dash" element={<SalesDashboard />} />
        <Route path="/catalog" element={<CatalogPage />} />
        <Route path="/car/:id" element={<CarDetailPage />} />
        <Route path="/calc" element={<PaymentCalcPage />} />
        <Route path="/leads" element={<LeadListPage />} />
        <Route path="/lead/:id" element={<LeadDetailPage />} />
        <Route path="/acard" element={<ACardPage />} />
        <Route path="/notifications" element={<NotificationsPage />} />
        <Route path="/reports" element={<ReportsPage />} />
        <Route path="/profile" element={<ProfilePage />} />
      </Route>

      {/* Sales only */}
      <Route element={<ProtectedRoute allowedRoles={['sales']} />}>
        <Route path="/booking" element={<BookingPage />} />
      </Route>

      {/* Manager only */}
      <Route element={<ProtectedRoute allowedRoles={['mgr']} />}>
        <Route path="/mgr-dash" element={<ManagerDashboard />} />
        <Route path="/pipeline" element={<PipelinePage />} />
        <Route path="/targets" element={<TargetsPage />} />
      </Route>
    </Route>

    <Route path="*" element={<Navigate to="/login" />} />
  </Routes>
</HashRouter>
```

---

## Navigation Hooks
- `useNavigate()` for programmatic navigation
- `useParams()` for URL parameters (carId, leadId)
- `useLocation()` for current route and query params
- `useSearchParams()` for query string (e.g., ?edit=ID)

---

## IMPLEMENTED: Sprint 3 Enhancements

### Bottom Nav Restructure
- Sales Tab 4 changed from "ผ่อน" (/calc) to "Profile" (/profile)
- Calculator is now embedded inline in CarDetailPage (no separate /calc nav tab)
- /calc route still exists for direct access but is not in the bottom nav

### Role Switcher in Header
- App header now includes a role switcher component
- Allows switching between Sales and Manager roles without navigating to Profile
- Updates bottom nav tabs and redirects to appropriate dashboard

---

**End of Navigation Specification**
