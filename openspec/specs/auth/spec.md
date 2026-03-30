# Auth Specification: Toyota Dealer Sale Tool
**ระบบการยืนยันตัวตน**

Version: 2.0
Last Updated: 2026-03-28
Status: Implemented

---

## Overview

Authentication system for Toyota Dealer Sale Tool enables role-based access with two distinct user types: Sales Staff (พนักงานขาย) and Managers (ผู้จัดการ). The system supports both demo mode (instant login with pre-seeded accounts) and Supabase Auth integration (email/password). In-app role switching is available via the Profile page without requiring logout.

---

## IMPLEMENTED: Demo Login with Role Selection

### Requirement: Login Screen with Role Cards
Users select their role on a visually rich login page to enter the app instantly in demo mode.

#### Scenario: Role Selection Display
WHEN the user navigates to /login
THEN the screen displays:
- Toyota branding header with logo and dealer name (วรจักร์ยนต์)
- Two role selection cards in a grid:
  - **พนักงานขาย (Sales)**: user icon, description "จัดการลีดและการขาย"
  - **ผู้จัดการ (Manager)**: chart icon, description "ดูภาพรวมสาขา"
- Selected card shows green border (#1B7A3F) and light green background
- Unselected card shows gray border with hover effect

#### Scenario: Demo Login Flow
WHEN the user selects a role card and taps "เข้าสู่ระบบ"
THEN the system:
1. Calls `authStore.login(role)` with 'sales' or 'mgr'
2. Loads demo user from `DEMO_USERS` object in mockData.js
3. Sets user state: `{ id, email, name, role, init }`
4. Sets `isLoggedIn: true`, `isDemo: true`
5. Navigates to role-appropriate dashboard:
   - Sales: `/sales-dash`
   - Manager: `/mgr-dash`

#### Demo Users
| Role | ID | Name | Initial |
|------|----|------|---------|
| sales | demo-sales | มาลี | ม |
| mgr | demo-mgr | วิชัย | ว |

---

## IMPLEMENTED: In-App Role Switching

### Requirement: Role Switch via Profile Page
Users can switch between Sales and Manager roles without logging out, enabling easy demonstration of both interfaces.

#### Scenario: Role Switch Cards
WHEN the user navigates to /profile
THEN the "สลับบทบาท" (Switch Role) section displays:
- Two role cards: "พนักงานขาย" and "ผู้จัดการ"
- Current role card has green border (#1B7A3F) and "ใช้งานอยู่" badge
- Other role card has gray border with hover effect

#### Scenario: Switching Role
WHEN the user taps the non-active role card
THEN the system:
1. Calls `authStore.login(newRole)` to load the new demo user
2. Navigates to the appropriate dashboard:
   - Sales: `/sales-dash`
   - Manager: `/mgr-dash`
3. BottomNav tabs update to match the new role
4. All role-specific content refreshes

---

## IMPLEMENTED: Supabase Auth Integration (Optional)

### Requirement: Email/Password Authentication
When Supabase is configured, the system supports full email/password authentication as an alternative to demo mode.

#### Scenario: Supabase Login
WHEN Supabase environment variables are configured
AND the user submits email and password
THEN:
1. `loginWithSupabase(email, password, role)` is called
2. Supabase Auth validates credentials and returns JWT
3. User profile is populated from `user_metadata`
4. Session is persisted by Supabase client

#### Scenario: Supabase Not Configured (Fallback)
WHEN Supabase URL/key are not set
THEN `loginWithSupabase()` automatically falls back to demo login
AND console.warn is logged for developer visibility

---

## IMPLEMENTED: Logout

### Requirement: Secure Logout
Users can log out from the Profile page, clearing all session state.

#### Scenario: Logout Flow
WHEN user taps "ออกจากระบบ" on the Profile page
THEN:
1. If Supabase session exists, `supabase.auth.signOut()` is called
2. Auth state is cleared: `user: null, role: null, isLoggedIn: false`
3. User is navigated to `/login`

---

## IMPLEMENTED: Route Protection

### Requirement: ProtectedRoute Component
A wrapper component ensures only authenticated users with appropriate roles can access protected pages.

#### Scenario: Unauthenticated Access
WHEN an unauthenticated user navigates to a protected route
THEN they are redirected to `/login`

#### Scenario: Wrong Role Access
WHEN a Sales user navigates to a Manager-only route (e.g., /mgr-dash)
THEN they are redirected to their role-appropriate dashboard

#### Protected Route Configuration
| Route | Allowed Roles |
|-------|--------------|
| /sales-dash, /catalog, /car/:id, /calc, /leads, /lead/:id, /acard, /notifications, /reports, /profile | sales, mgr |
| /booking | sales |
| /mgr-dash, /pipeline, /targets | mgr |

---

## Auth Store API

```javascript
useAuthStore = {
  // State
  user: null | { id, email, name, role, init },
  role: null | 'sales' | 'mgr',
  isLoggedIn: boolean,
  isDemo: boolean,

  // Actions
  login(role): void,                          // Demo login
  loginWithSupabase(email, password, role): Promise<void>,
  logout(): Promise<void>,                    // Clear session
  updateProfile(updates): void,               // Update user fields
  switchRole(newRole): void,                   // Switch role in-place
  checkSession(): Promise<void>,              // Restore Supabase session
}
```

---

## Session Management

### Token Storage
- Demo mode: state held in Zustand (memory only, no persistence)
- Supabase mode: JWT stored by Supabase client in localStorage

### Session Restoration
WHEN the app loads and Supabase is configured
THEN `checkSession()` checks for existing JWT
AND restores user/role state if valid session found

---

## IMPLEMENTED: Sprint 2 — Persist & Hydration

### Persist Middleware
- Auth store uses `zustand/middleware/persist` with localStorage key `toyota-auth`
- Persists: user, role, isLoggedIn, isDemo
- On page refresh, auth state is restored from localStorage
- No redirect to /login if user is already authenticated

### Hydration-Aware Routing
- ProtectedRoute waits for store hydration before redirecting
- Prevents flash of login page on refresh
- Smart restore: user lands on their current page, not forced to dashboard

### Role Switcher (Sprint 3)
- Available in app header for quick role switching
- Calls `authStore.login(newRole)` to load the opposite demo user
- Navigates to the new role's dashboard
- BottomNav tabs update reactively

---

**End of Auth Specification**
