# Toyota Vorachakyont Sale Tool Demo App — Technical Design Document

**Version**: 1.0  
**Date**: 2026-03-28  
**Status**: Ready for Implementation  
**Audience**: Engineering team, Claude Code scaffold generation

---

## TABLE OF CONTENTS

1. [Context & Goals](#context--goals)
2. [Constraints & Non-Goals](#constraints--non-goals)
3. [Architecture Decisions](#architecture-decisions)
4. [Project Structure](#project-structure)
5. [Supabase Database Schema](#supabase-database-schema)
6. [Row Level Security (RLS) Policies](#row-level-security-rls-policies)
7. [Zustand Store Architecture](#zustand-store-architecture)
8. [React Router Configuration](#react-router-configuration)
9. [Tailwind CSS Theme Configuration](#tailwind-css-theme-configuration)
10. [Service Worker & PWA](#service-worker--pwa)
11. [Component Library Structure](#component-library-structure)
12. [State Flow Diagrams](#state-flow-diagrams)
13. [Migration Plan](#migration-plan)
14. [Seed Data & SQL](#seed-data--sql)
15. [Risks & Trade-offs](#risks--trade-offs)

---

## CONTEXT & GOALS

### Current State

**Prototype Status**: Toyota Vorachakyont Sale Tool Prototype v5 is a single HTML file (`Toyota-SaleTool-Prototype-v5.html`) containing:
- 6 car products with full specs, images, videos
- 4 demo leads with color-coded heat levels (hot/warm/cool/won)
- Payment calculator with configurable loan terms
- A-Card (customer information form) generation
- Responsive design for iPad (landscape/portrait) and iPhone (portrait)
- Manual styling with CSS variables and utility classes
- Vanilla JavaScript state management via global objects

**UX/UI Sign-Off**: Complete — prototype has been validated against user requirements and approved by stakeholder.

### Target State

Transform the approved prototype into a **production-ready React PWA** with:
- **Frontend**: React 18 + Vite 5 + Tailwind CSS 3
- **State Management**: Zustand 4 (replacing vanilla JS globals)
- **Routing**: React Router 6 with HashRouter (for GitHub Pages SPA compatibility)
- **Backend**: Supabase (Auth + PostgreSQL 15 database)
- **Offline Support**: Service Worker with offline-first caching
- **Deployment**: GitHub Actions → GitHub Pages (no server-side rendering)
- **Device Support**: iPhone (390px), iPad (768px+), responsive breakpoints

### Success Criteria

✅ **Feature Parity**: 100% pixel-for-pixel replication of prototype  
✅ **Data Persistence**: All cars, leads, bookings stored in Supabase PostgreSQL  
✅ **Authentication**: Sales staff & managers login with role-based access control  
✅ **Offline Capability**: Core pages cacheable, load without network  
✅ **Performance**: First contentful paint < 3s on 4G, Lighthouse score > 80  
✅ **PWA**: Installable on iOS/Android, works as standalone app  
✅ **Security**: Row-level security policies, no data exposure between roles/branches  

---

## CONSTRAINTS & NON-GOALS

### Constraints

| Constraint | Rationale |
|---|---|
| **GitHub Pages hosting** | Client requirement — no external servers, leverages free GitHub infrastructure |
| **SPA with HashRouter** | GitHub Pages has no server-side routing; hash-based navigation required |
| **Supabase free tier** | Demo scope — 500MB storage, realtime limits acceptable for 6 cars + 4 leads |
| **No custom backend** | All logic client-side or Supabase edge functions; reduces infrastructure complexity |
| **Mobile-first responsive** | Prototype tested on iPad + iPhone; desktop not a primary target |
| **2-week implementation** | Pre-sale demo deadline — limited scope, focus on MVP features |

### Non-Goals

❌ **Server-side rendering (SSR/Next.js)** — HashRouter SPA sufficient  
❌ **Multi-tenancy (multiple branches per database)** — Supabase projects per branch if needed  
❌ **Real-time sync** — Polling sufficient; websockets unnecessary for demo  
❌ **Internationalization (i18n)** — Thai+English hardcoded; no dynamic language switching  
❌ **Custom payment gateway integration** — QR code generation only (Google Charts API)  
❌ **Email/SMS notifications** — Dashboard notifications UI only, no backend integration  

---

## ARCHITECTURE DECISIONS

### 1. React 18 + Vite 5 + Tailwind CSS

**Decision**: Use React 18 (latest stable), Vite 5 (fastest bundler), Tailwind CSS 3 (utility-first styling).

**Rationale**:
- **React 18**: Latest concurrent rendering, automatic batching, suspense support
- **Vite 5**: ~10x faster dev server than Create React App, ESM-native, perfect for PWA with service workers
- **Tailwind CSS 3**: Replicates prototype CSS variables → Tailwind theme tokens; tree-shakable, ~30KB gzipped

**Trade-off**: Vite requires Node 14.18+ and explicit environment variables setup (not automatic like CRA).

---

### 2. Zustand for State Management

**Decision**: Use Zustand 4 instead of Redux/Context API.

**Rationale**:
- **Lightweight**: ~2KB gzipped vs Redux boilerplate
- **Simple API**: `create()` hook, no action types/reducers
- **TypeScript-friendly**: Excellent type inference
- **Devtools**: Built-in middleware for debugging
- **Modular stores**: Each domain (auth, cars, leads, booking) as separate store — mirrors prototype JS objects

**Store Architecture**:
```
stores/
├── authStore.ts        // user, session, role, login/logout
├── carStore.ts         // cars[], filters, selectedCar, fetchCars()
├── leadStore.ts        // leads[], selectedLead, CRUD operations
├── bookingStore.ts     // currentBooking, step, validation
├── dashboardStore.ts   // KPIs, teamData, fetchDashboard()
└── uiStore.ts          // device, navHistory, activeTab
```

---

### 3. Supabase Backend

**Decision**: Use Supabase (Firebase alternative with PostgreSQL).

**Rationale**:
- **Built-in Auth**: Email/password auth with role metadata
- **PostgreSQL 15**: Relational schema (cars, leads, bookings, users)
- **Row Level Security (RLS)**: Fine-grained access control without custom API
- **Realtime subscriptions**: Optional future feature (chat, notifications)
- **Free tier**: 500MB storage + 50,000 monthly active users — sufficient for demo
- **No custom backend**: Reduces deployment complexity

**Trade-off**: RLS policies must be carefully configured; testing required.

---

### 4. React Router v6 with HashRouter

**Decision**: Use React Router v6 with `<HashRouter>` instead of BrowserRouter.

**Rationale**:
- **GitHub Pages limitation**: No server-side routing support
- **HashRouter**: Client-side routing via URL hash (#/path)
- **v6 advantages**: Nested routes, loaders, error boundaries, modern API

**URL Pattern**: `https://repo.github.io/demo-app/#/car/123`

---

### 5. Row Level Security (RLS) Policies

**Decision**: Enforce all access control via Supabase RLS, not application logic.

**Rationale**:
- **Defense in depth**: Can't bypass via API tampering
- **Multi-tenant safety**: Sales staff can't see other branch's data
- **Audit trail**: Database logs all access
- **Zero-trust assumption**: Client code untrusted; backend is source of truth

**Policy Examples**:
```sql
-- Sales staff: own leads + assigned leads only
CREATE POLICY "sales_own_leads"
  ON leads FOR SELECT
  USING (assigned_to = auth.uid() OR created_by = auth.uid());

-- Managers: all leads in own branch
CREATE POLICY "manager_branch_leads"
  ON leads FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM profiles p
      WHERE p.id = auth.uid()
      AND p.role = 'mgr'
      AND p.branch_id = leads.branch_id
    )
  );

-- All authenticated: read cars (no write)
CREATE POLICY "public_read_cars"
  ON cars FOR SELECT
  USING (true);
```

---

### 6. Service Worker & Offline Strategy

**Decision**: Implement offline-first service worker using `workbox-window`.

**Rationale**:
- **Offline fallback**: Load critical pages without network
- **Asset caching**: Vite-generated chunks + images cached
- **App shell**: HTML shell cached, data requests fail gracefully
- **PWA credential**: Required for iOS/Android "Add to Home Screen"

**Caching Strategy**:
- **Stale-While-Revalidate** (SWR): Return cached asset, update in background
- **Network-First** (NF): Try network first, fallback to cache (API calls)
- **Cache-First** (CF): Always return cache, no network attempt (images, fonts)

---

### 7. Tailwind CSS Custom Theme

**Decision**: Extend Tailwind config with custom colors, typography, spacing from prototype CSS.

**Rationale**:
- **Design tokens**: Map prototype CSS variables to Tailwind theme
- **Consistency**: Same colors/spacing across all components
- **Maintainability**: Change colors in one place (tailwind.config.js)
- **Tree-shaking**: Tailwind removes unused utilities; final CSS ~30KB

**Theme Tokens**:
```js
colors: {
  primary: { DEFAULT: '#1B7A3F', dark: '#145E30', light: '#EBF7EF', medium: '#C4E3CE' },
  avail: '#16A34A',      // Available status (green)
  transit: '#EA580C',    // Transit status (orange)
  hot: '#DC2626',        // Hot lead (red)
  warm: '#D97706',       // Warm lead (amber)
  cool: '#2563EB',       // Cool lead (blue)
  won: '#10B981',        // Won lead (emerald)
  t1: '#111827',         // Text primary (near-black)
  t2: '#6B7280',         // Text secondary (gray-500)
  t3: '#9CA3AF',         // Text tertiary (gray-400)
  bg: '#F5F7F5',         // Page background (very light gray)
  card: '#FFFFFF',       // Card background (white)
  border: '#E5E7EB'      // Border color (gray-200)
}
```

---

## PROJECT STRUCTURE

```
04 - Demo/
├── openspec/                    # This design document + specs
│   ├── design.md               # You are here
│   ├── proposal.md             # Business proposal
│   ├── config.yaml             # OpenSpec metadata
│   └── specs/                  # Feature specifications (read-only reference)
│       ├── auth/
│       ├── car-catalog/
│       ├── lead-management/
│       ├── booking-payment/
│       ├── manager-dashboard/
│       ├── pwa/
│       └── design-system/
│
├── src/
│   ├── components/
│   │   ├── ui/                 # Atomic design: Buttons, Cards, Badges, etc.
│   │   │   ├── Button.jsx
│   │   │   ├── Card.jsx
│   │   │   ├── Badge.jsx
│   │   │   ├── Input.jsx
│   │   │   ├── Select.jsx
│   │   │   ├── Modal.jsx
│   │   │   ├── Tabs.jsx
│   │   │   ├── Toast.jsx
│   │   │   ├── Avatar.jsx
│   │   │   ├── Spinner.jsx
│   │   │   ├── FilterPill.jsx
│   │   │   └── StatusBadge.jsx
│   │   │
│   │   ├── layout/             # Page-level layouts & navigation
│   │   │   ├── AppShell.jsx    # Main app container with nav
│   │   │   ├── BottomNav.jsx   # Mobile tab bar (Cars, Leads, Reports, Profile)
│   │   │   ├── PageHeader.jsx  # Page title + back button
│   │   │   ├── ManagerNav.jsx  # Manager sidebar (Dashboard, Pipeline, Targets, Reports)
│   │   │   └── StatusBar.jsx   # Top bar: branch, user name, sync status
│   │   │
│   │   ├── car/                # Car catalog components
│   │   │   ├── CarListItem.jsx        # Thumbnail card (image, name, price, type)
│   │   │   ├── CarDetail.jsx          # Full car page (specs, images, video, actions)
│   │   │   ├── CarGallery.jsx         # Image carousel + thumbnails
│   │   │   ├── SpecAccordion.jsx      # Engine, dimensions, safety, features
│   │   │   ├── CarFilterBar.jsx       # Type > Model > Budget filters
│   │   │   ├── FilterPillGroup.jsx    # Horizontal pill buttons for filters
│   │   │   └── CarVideoEmbed.jsx      # YouTube/video player
│   │   │
│   │   ├── lead/               # Lead management components
│   │   │   ├── LeadListItem.jsx       # Card: avatar, name, color, heat level, car
│   │   │   ├── LeadDetail.jsx         # Full lead page (form, activities, assigned car)
│   │   │   ├── LeadForm.jsx           # Create/edit lead form
│   │   │   ├── ACardForm.jsx          # Customer info form (name, phone, email, address)
│   │   │   ├── PipelineKanban.jsx     # Hot/Warm/Cool/Won columns with drag-drop
│   │   │   ├── LeadStatusBadge.jsx    # Color-coded heat level badge
│   │   │   ├── ActivityTimeline.jsx   # Activities list (calls, notes, bookings)
│   │   │   └── LeadAvatar.jsx         # Initials + background color
│   │   │
│   │   ├── booking/            # Booking & payment components
│   │   │   ├── BookingSteps.jsx       # 3-step flow: Select Car > Terms > Confirm
│   │   │   ├── TermsInput.jsx         # Down payment, term, interest rate input
│   │   │   ├── PaymentCalculator.jsx  # Monthly payment calculation UI
│   │   │   ├── QRPayment.jsx          # QR code display + reference number
│   │   │   ├── BookingConfirm.jsx     # Confirmation screen after booking
│   │   │   ├── TermsTable.jsx         # Payment breakdown table
│   │   │   └── StepIndicator.jsx      # 1/2/3 progress indicator
│   │   │
│   │   ├── dashboard/          # Manager dashboard components
│   │   │   ├── KPIGrid.jsx            # 4 KPI cards (Units, Revenue, Conversion, Leads)
│   │   │   ├── KPICard.jsx            # Single KPI card with trend
│   │   │   ├── TeamChart.jsx          # Bar chart: salesperson performance
│   │   │   ├── PerformanceLeaderboard.jsx # Ranked table: units, revenue, targets
│   │   │   ├── InsightCard.jsx        # AI insight cards (smart recommendations)
│   │   │   ├── TargetProgress.jsx     # Branch target vs actual (progress bars)
│   │   │   ├── WeeklyReport.jsx       # Weekly summary cards
│   │   │   └── FunnelChart.jsx        # Lead funnel visualization
│   │   │
│   │   └── common/
│   │       ├── NotificationBell.jsx   # Notification icon + count
│   │       ├── ConfirmDialog.jsx      # Confirmation modal
│   │       ├── LoadingScreen.jsx      # Full-screen spinner
│   │       └── ErrorFallback.jsx      # Error boundary component
│   │
│   ├── pages/                  # Route-level pages
│   │   ├── LoginPage.jsx       # Email + password input, role selector
│   │   ├── SalesDashboard.jsx  # Sales staff home: KPIs + lead list
│   │   ├── CatalogPage.jsx     # Car listing with filters
│   │   ├── CarDetailPage.jsx   # Single car detail + specs + video
│   │   ├── LeadListPage.jsx    # All leads, grouped by status or salesperson
│   │   ├── LeadDetailPage.jsx  # Single lead detail + form + activities
│   │   ├── ACardPage.jsx       # A-Card customer form
│   │   ├── PaymentCalcPage.jsx # Standalone payment calculator
│   │   ├── BookingPage.jsx     # 3-step booking flow
│   │   ├── ManagerDashboard.jsx   # Manager home: KPIs + team chart + targets
│   │   ├── PipelinePage.jsx       # Kanban board: Hot/Warm/Cool/Won
│   │   ├── TargetsPage.jsx        # Branch targets + leaderboard
│   │   ├── ReportsPage.jsx        # Weekly/monthly reports, export
│   │   ├── NotificationsPage.jsx  # Notification center
│   │   └── NotFoundPage.jsx       # 404 fallback
│   │
│   ├── stores/                 # Zustand stores
│   │   ├── authStore.ts
│   │   ├── carStore.ts
│   │   ├── leadStore.ts
│   │   ├── bookingStore.ts
│   │   ├── dashboardStore.ts
│   │   └── uiStore.ts
│   │
│   ├── lib/                    # Utility functions & libraries
│   │   ├── supabase.ts         # Supabase client initialization
│   │   ├── auth.ts             # Auth helpers: login, logout, getSession
│   │   ├── car.ts              # Car queries: fetchCars, searchCars
│   │   ├── lead.ts             # Lead queries: fetchLeads, createLead, updateLead
│   │   ├── booking.ts          # Booking queries: createBooking, getBookings
│   │   ├── payment.ts          # Payment calc: monthlyPayment(principal, rate, term)
│   │   ├── qr.ts               # QR code generation: generateQRCode(text)
│   │   ├── notifications.ts    # Notification helpers
│   │   ├── formats.ts          # Thai number + currency formatting
│   │   └── constants.ts        # App constants (roles, statuses, car types)
│   │
│   ├── hooks/                  # Custom React hooks
│   │   ├── useAuth.ts          # Wrapper around authStore
│   │   ├── useLocalStorage.ts  # Persist state to localStorage
│   │   ├── useInfiniteScroll.ts # Lazy load cars/leads list
│   │   ├── useDevice.ts        # Detect mobile vs tablet
│   │   ├── useOffline.ts       // Detect offline status
│   │   └── usePushNotification.ts # PWA push notifications
│   │
│   ├── assets/
│   │   ├── icons/              # SVG icons (converted from prototype sprites)
│   │   │   ├── CarIcon.svg
│   │   │   ├── LeadIcon.svg
│   │   │   ├── DashboardIcon.svg
│   │   │   ├── BellIcon.svg
│   │   │   ├── MenuIcon.svg
│   │   │   ├── BackIcon.svg
│   │   │   └── ... (20+ icons)
│   │   │
│   │   ├── images/             # Car images, backgrounds (sourced from prototype)
│   │   │   ├── car-1-main.jpg
│   │   │   ├── car-1-ext.jpg
│   │   │   ├── car-1-side.jpg
│   │   │   ├── car-1-rear.jpg
│   │   │   ├── car-1-int.jpg
│   │   │   └── ... (4 angles × 6 cars = 24 images)
│   │   │
│   │   ├── videos/             # Car promo videos (from prototype)
│   │   │   ├── car-1-promo.mp4
│   │   │   └── ...
│   │   │
│   │   └── logos/
│   │       ├── toyota-logo.svg
│   │       ├── vorachakyont-logo.svg
│   │       └── app-icon-192x192.png (PWA icon)
│   │
│   ├── styles/
│   │   ├── globals.css         # Tailwind imports + global styles
│   │   ├── tailwind.config.js  # Tailwind theme configuration
│   │   └── postcss.config.js   # PostCSS configuration for Tailwind
│   │
│   ├── App.jsx                 # Root component: Auth wrapper + Router
│   ├── App.css                 # (empty, all styles via Tailwind)
│   └── main.jsx                # Vite entry point
│
├── public/
│   ├── manifest.json           # PWA manifest (app name, icons, display mode)
│   ├── service-worker.js       # Offline-first caching strategy
│   ├── icons/
│   │   ├── android-chrome-192x192.png
│   │   ├── android-chrome-512x512.png
│   │   ├── apple-touch-icon.png
│   │   └── favicon.ico
│   │
│   └── 404.html                # GitHub Pages SPA fallback (redirect to /)
│
├── .github/
│   └── workflows/
│       └── deploy.yml          # GitHub Actions CI/CD pipeline
│
├── .env.example                # Template for environment variables
├── .env.local                  # (gitignored) Supabase credentials
├── .gitignore
├── package.json
├── vite.config.js              # Vite build configuration
├── tailwind.config.js          # Tailwind CSS configuration
├── index.html                  # HTML entry point (Vite)
└── README.md                   # Installation & deployment guide
```

---

## SUPABASE DATABASE SCHEMA

### SQL DDL — Complete Schema Definition

```sql
-- ============================================================================
-- 1. Enable Required Extensions
-- ============================================================================

CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";


-- ============================================================================
-- 2. PROFILES TABLE (extends auth.users)
-- ============================================================================

CREATE TABLE profiles (
  id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
  email TEXT,
  role TEXT NOT NULL CHECK (role IN ('sales', 'mgr', 'admin')),
  name TEXT NOT NULL,
  branch_id UUID NOT NULL,
  avatar_color TEXT DEFAULT '#1B7A3F',  -- Primary green fallback
  phone TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

CREATE INDEX idx_profiles_branch_id ON profiles(branch_id);
CREATE INDEX idx_profiles_role ON profiles(role);


-- ============================================================================
-- 3. BRANCHES TABLE
-- ============================================================================

CREATE TABLE branches (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL UNIQUE,
  location TEXT,
  region TEXT,
  target_units_monthly INTEGER DEFAULT 10,
  target_revenue_monthly DECIMAL(12, 2) DEFAULT 50000000,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Demo branches: Bangkok, Chiang Mai, Phuket, Rayong
INSERT INTO branches (name, location, region, target_units_monthly, target_revenue_monthly) VALUES
  ('วรจักร์ยนต์ บางกอก', 'Rama IX Road, Bangkok', 'Bangkok Metropolitan', 15, 75000000),
  ('วรจักร์ยนต์ เชียงใหม่', 'Nimmanhaemin Road, Chiang Mai', 'North', 8, 40000000),
  ('วรจักร์ยนต์ ภูเก็ต', 'Yaowarat Road, Phuket', 'South', 6, 30000000),
  ('วรจักร์ยนต์ ระยอง', 'Sukhumvit Road, Rayong', 'East', 8, 40000000)
ON CONFLICT DO NOTHING;


-- ============================================================================
-- 4. CARS TABLE
-- ============================================================================

CREATE TABLE cars (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  type TEXT NOT NULL,  -- e.g., "Sedan", "SUV", "Hatchback", "Pickup"
  price DECIMAL(12, 2) NOT NULL,
  fuel TEXT NOT NULL,  -- "Petrol", "Diesel", "Hybrid"
  seats INTEGER NOT NULL,
  gearbox TEXT NOT NULL,  -- "Automatic", "Manual"
  power INTEGER,  -- HP (horsepower)
  avail_status TEXT DEFAULT 'available' CHECK (avail_status IN ('available', 'transit', 'reserved')),
  stock_info JSONB DEFAULT '{"total": 10, "branches": {}}'::jsonb,
  warranty TEXT DEFAULT '3 years',
  eco TEXT DEFAULT 'Euro 5',
  category TEXT,  -- "Luxury", "Premium", "Popular"
  bg_color TEXT DEFAULT '#F5F5F5',  -- Card background color
  image_url TEXT,  -- Main product image
  images JSONB,  -- Multiple angles: {ext, side, rear, int}
  video_id TEXT,  -- YouTube video ID
  specs JSONB,  -- {engine: [[label, value], ...], dim: [...], safety: [...], features: [...]}
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

CREATE INDEX idx_cars_type ON cars(type);
CREATE INDEX idx_cars_price ON cars(price);


-- ============================================================================
-- 5. LEADS TABLE
-- ============================================================================

CREATE TABLE leads (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  initial TEXT,  -- First initial + last initial, e.g., "SK"
  avatar_color TEXT DEFAULT '#DC2626',
  level TEXT NOT NULL CHECK (level IN ('hot', 'warm', 'cool', 'won')),
  source TEXT,  -- "walk-in", "phone", "online", "referral"
  car_id UUID REFERENCES cars(id),
  assigned_to UUID REFERENCES profiles(id) ON DELETE SET NULL,
  branch_id UUID NOT NULL REFERENCES branches(id),
  created_by UUID NOT NULL REFERENCES profiles(id) ON DELETE RESTRICT,
  phone TEXT,
  email TEXT,
  address TEXT,
  notes TEXT,
  last_contact_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

CREATE INDEX idx_leads_branch_id ON leads(branch_id);
CREATE INDEX idx_leads_assigned_to ON leads(assigned_to);
CREATE INDEX idx_leads_level ON leads(level);
CREATE INDEX idx_leads_car_id ON leads(car_id);


-- ============================================================================
-- 6. LEAD ACTIVITIES TABLE (audit trail)
-- ============================================================================

CREATE TABLE lead_activities (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  lead_id UUID NOT NULL REFERENCES leads(id) ON DELETE CASCADE,
  type TEXT NOT NULL CHECK (type IN ('call', 'meeting', 'email', 'note', 'booking', 'status_change')),
  title TEXT NOT NULL,
  description TEXT,
  result TEXT,  -- e.g., "interested", "not_interested", "pending"
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  created_by UUID NOT NULL REFERENCES profiles(id) ON DELETE RESTRICT
);

CREATE INDEX idx_activities_lead_id ON lead_activities(lead_id);
CREATE INDEX idx_activities_created_at ON lead_activities(created_at);


-- ============================================================================
-- 7. BOOKINGS TABLE
-- ============================================================================

CREATE TABLE bookings (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  lead_id UUID NOT NULL REFERENCES leads(id) ON DELETE CASCADE,
  car_id UUID NOT NULL REFERENCES cars(id),
  branch_id UUID NOT NULL REFERENCES branches(id),
  salesperson_id UUID NOT NULL REFERENCES profiles(id),
  booking_date DATE NOT NULL,
  down_payment DECIMAL(12, 2),  -- ชำระเบื้องต้น
  loan_amount DECIMAL(12, 2),
  loan_term_months INTEGER DEFAULT 60,  -- ระยะเวลาผ่อน
  interest_rate DECIMAL(5, 2) DEFAULT 2.5,  -- อัตราดอกเบี้ย (%)
  monthly_amount DECIMAL(12, 2),  -- ยอดผ่อนรายเดือน
  payment_method TEXT DEFAULT 'bank_loan' CHECK (payment_method IN ('cash', 'bank_loan', 'company_lease')),
  qr_code_url TEXT,
  reference_number TEXT UNIQUE,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'confirmed', 'completed', 'cancelled')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

CREATE INDEX idx_bookings_lead_id ON bookings(lead_id);
CREATE INDEX idx_bookings_status ON bookings(status);
CREATE INDEX idx_bookings_branch_id ON bookings(branch_id);


-- ============================================================================
-- 8. NOTIFICATIONS TABLE
-- ============================================================================

CREATE TABLE notifications (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  body TEXT,
  type TEXT DEFAULT 'info' CHECK (type IN ('info', 'success', 'warning', 'error', 'lead_update', 'booking')),
  read BOOLEAN DEFAULT FALSE,
  action_url TEXT,  -- Navigation link when clicked
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

CREATE INDEX idx_notifications_user_id ON notifications(user_id);
CREATE INDEX idx_notifications_read ON notifications(read);


-- ============================================================================
-- 9. Set Updated_at Trigger Function
-- ============================================================================

CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Apply trigger to all tables with updated_at
CREATE TRIGGER update_profiles_updated_at BEFORE UPDATE ON profiles
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_cars_updated_at BEFORE UPDATE ON cars
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_leads_updated_at BEFORE UPDATE ON leads
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_bookings_updated_at BEFORE UPDATE ON bookings
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_branches_updated_at BEFORE UPDATE ON branches
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
```

---

## ROW LEVEL SECURITY (RLS) POLICIES

### Enable RLS on All Tables

```sql
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE branches ENABLE ROW LEVEL SECURITY;
ALTER TABLE cars ENABLE ROW LEVEL SECURITY;
ALTER TABLE leads ENABLE ROW LEVEL SECURITY;
ALTER TABLE lead_activities ENABLE ROW LEVEL SECURITY;
ALTER TABLE bookings ENABLE ROW LEVEL SECURITY;
ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;
```

### Policies by Table

#### PROFILES Table

```sql
-- Public: view own profile
CREATE POLICY "users_view_own_profile"
  ON profiles FOR SELECT
  USING (auth.uid() = id);

-- Admin: view all profiles
CREATE POLICY "admin_view_all_profiles"
  ON profiles FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM profiles p
      WHERE p.id = auth.uid() AND p.role = 'admin'
    )
  );

-- Manager: view profiles in own branch
CREATE POLICY "manager_view_branch_profiles"
  ON profiles FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM profiles p
      WHERE p.id = auth.uid()
      AND p.role = 'mgr'
      AND p.branch_id = profiles.branch_id
    )
  );

-- Users update own profile
CREATE POLICY "users_update_own_profile"
  ON profiles FOR UPDATE
  USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);
```

#### CARS Table

```sql
-- All authenticated users: read cars (no write)
CREATE POLICY "public_read_cars"
  ON cars FOR SELECT
  USING (true);

-- Admin only: manage cars
CREATE POLICY "admin_manage_cars"
  ON cars FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM profiles p
      WHERE p.id = auth.uid() AND p.role = 'admin'
    )
  );

CREATE POLICY "admin_update_cars"
  ON cars FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM profiles p
      WHERE p.id = auth.uid() AND p.role = 'admin'
    )
  );
```

#### LEADS Table

```sql
-- Sales: own leads (created or assigned)
CREATE POLICY "sales_own_leads"
  ON leads FOR SELECT
  USING (
    assigned_to = auth.uid() OR created_by = auth.uid()
  );

-- Sales: create leads in own branch
CREATE POLICY "sales_create_leads"
  ON leads FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM profiles p
      WHERE p.id = auth.uid()
      AND p.role = 'sales'
      AND p.branch_id = leads.branch_id
    )
  );

-- Sales: update own leads
CREATE POLICY "sales_update_own_leads"
  ON leads FOR UPDATE
  USING (assigned_to = auth.uid() OR created_by = auth.uid())
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM profiles p
      WHERE p.id = auth.uid()
      AND p.role = 'sales'
      AND p.branch_id = leads.branch_id
    )
  );

-- Manager: all leads in branch
CREATE POLICY "manager_view_branch_leads"
  ON leads FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM profiles p
      WHERE p.id = auth.uid()
      AND p.role = 'mgr'
      AND p.branch_id = leads.branch_id
    )
  );

-- Manager: reassign leads in branch
CREATE POLICY "manager_reassign_leads"
  ON leads FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM profiles p
      WHERE p.id = auth.uid()
      AND p.role = 'mgr'
      AND p.branch_id = leads.branch_id
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM profiles p
      WHERE p.id = auth.uid()
      AND p.role = 'mgr'
      AND p.branch_id = leads.branch_id
    )
  );

-- Admin: view all
CREATE POLICY "admin_view_all_leads"
  ON leads FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM profiles p
      WHERE p.id = auth.uid() AND p.role = 'admin'
    )
  );
```

#### LEAD_ACTIVITIES Table

```sql
-- User: view own activities
CREATE POLICY "view_own_activities"
  ON lead_activities FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM leads l
      WHERE l.id = lead_activities.lead_id
      AND (l.assigned_to = auth.uid() OR l.created_by = auth.uid())
    )
  );

-- Sales: create activity on own leads
CREATE POLICY "sales_create_activity"
  ON lead_activities FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM leads l
      WHERE l.id = lead_activities.lead_id
      AND (l.assigned_to = auth.uid() OR l.created_by = auth.uid())
    )
  );

-- Manager: view branch activities
CREATE POLICY "manager_view_branch_activities"
  ON lead_activities FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM leads l, profiles p
      WHERE l.id = lead_activities.lead_id
      AND p.id = auth.uid()
      AND p.role = 'mgr'
      AND p.branch_id = l.branch_id
    )
  );
```

#### BOOKINGS Table

```sql
-- Sales: own bookings
CREATE POLICY "sales_view_own_bookings"
  ON bookings FOR SELECT
  USING (salesperson_id = auth.uid());

-- Sales: create booking on own leads
CREATE POLICY "sales_create_booking"
  ON bookings FOR INSERT
  WITH CHECK (
    salesperson_id = auth.uid()
    AND EXISTS (
      SELECT 1 FROM leads l
      WHERE l.id = bookings.lead_id
      AND (l.assigned_to = auth.uid() OR l.created_by = auth.uid())
    )
  );

-- Manager: view branch bookings
CREATE POLICY "manager_view_branch_bookings"
  ON bookings FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM profiles p
      WHERE p.id = auth.uid()
      AND p.role = 'mgr'
      AND p.branch_id = bookings.branch_id
    )
  );

-- Admin: view all
CREATE POLICY "admin_view_all_bookings"
  ON bookings FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM profiles p
      WHERE p.id = auth.uid() AND p.role = 'admin'
    )
  );
```

#### NOTIFICATIONS Table

```sql
-- User: view own notifications
CREATE POLICY "users_view_own_notifications"
  ON notifications FOR SELECT
  USING (user_id = auth.uid());

-- User: update own notifications (mark as read)
CREATE POLICY "users_update_own_notifications"
  ON notifications FOR UPDATE
  USING (user_id = auth.uid())
  WITH CHECK (user_id = auth.uid());
```

---

## ZUSTAND STORE ARCHITECTURE

### Store #1: authStore.ts

```typescript
import { create } from 'zustand';
import { supabase } from '@/lib/supabase';

interface AuthState {
  user: any | null;
  session: any | null;
  role: 'sales' | 'mgr' | 'admin' | null;
  branch_id: string | null;
  loading: boolean;
  error: string | null;
  
  login: (email: string, password: string, role: string) => Promise<void>;
  logout: () => Promise<void>;
  setSession: (session: any) => void;
  getCurrentUser: () => Promise<void>;
  isAuthenticated: () => boolean;
}

export const useAuthStore = create<AuthState>((set, get) => ({
  user: null,
  session: null,
  role: null,
  branch_id: null,
  loading: false,
  error: null,

  login: async (email: string, password: string, role: string) => {
    set({ loading: true, error: null });
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      if (error) throw error;
      
      // Fetch profile to get role + branch_id
      const { data: profile } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', data.user.id)
        .single();
      
      set({
        user: data.user,
        session: data.session,
        role: profile?.role || null,
        branch_id: profile?.branch_id || null,
        loading: false,
      });
    } catch (err: any) {
      set({ error: err.message, loading: false });
    }
  },

  logout: async () => {
    await supabase.auth.signOut();
    set({ user: null, session: null, role: null, branch_id: null });
  },

  setSession: (session: any) => {
    set({ session, user: session?.user || null });
  },

  getCurrentUser: async () => {
    const { data: { session } } = await supabase.auth.getSession();
    if (session) {
      const { data: profile } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', session.user.id)
        .single();
      set({
        user: session.user,
        session,
        role: profile?.role || null,
        branch_id: profile?.branch_id || null,
      });
    }
  },

  isAuthenticated: () => !!get().user,
}));
```

### Store #2: carStore.ts

```typescript
import { create } from 'zustand';
import { supabase } from '@/lib/supabase';

interface Car {
  id: string;
  name: string;
  type: string;
  price: number;
  fuel: string;
  seats: number;
  gearbox: string;
  power: number;
  avail_status: string;
  stock_info: any;
  warranty: string;
  eco: string;
  category: string;
  bg_color: string;
  image_url: string;
  images: any;
  video_id: string;
  specs: any;
}

interface CarStore {
  cars: Car[];
  selectedCar: Car | null;
  filters: {
    type: string[];
    priceRange: [number, number];
    fuel: string[];
  };
  loading: boolean;
  
  fetchCars: () => Promise<void>;
  selectCar: (car: Car) => void;
  setFilters: (filters: any) => void;
  getFilteredCars: () => Car[];
}

export const useCarStore = create<CarStore>((set, get) => ({
  cars: [],
  selectedCar: null,
  filters: {
    type: [],
    priceRange: [0, 5000000],
    fuel: [],
  },
  loading: false,

  fetchCars: async () => {
    set({ loading: true });
    const { data, error } = await supabase.from('cars').select('*');
    if (!error) {
      set({ cars: data, loading: false });
    }
  },

  selectCar: (car: Car) => {
    set({ selectedCar: car });
  },

  setFilters: (filters: any) => {
    set({ filters: { ...get().filters, ...filters } });
  },

  getFilteredCars: () => {
    const { cars, filters } = get();
    return cars.filter((car) => {
      if (filters.type.length > 0 && !filters.type.includes(car.type)) return false;
      if (car.price < filters.priceRange[0] || car.price > filters.priceRange[1]) return false;
      if (filters.fuel.length > 0 && !filters.fuel.includes(car.fuel)) return false;
      return true;
    });
  },
}));
```

### Store #3: leadStore.ts

```typescript
import { create } from 'zustand';
import { supabase } from '@/lib/supabase';

interface Lead {
  id: string;
  name: string;
  initial: string;
  avatar_color: string;
  level: 'hot' | 'warm' | 'cool' | 'won';
  source: string;
  car_id: string | null;
  assigned_to: string | null;
  branch_id: string;
  phone: string;
  email: string;
  address: string;
  notes: string;
  created_at: string;
  updated_at: string;
}

interface LeadStore {
  leads: Lead[];
  selectedLead: Lead | null;
  loading: boolean;
  
  fetchLeads: (branchId: string) => Promise<void>;
  createLead: (lead: Partial<Lead>) => Promise<void>;
  updateLead: (id: string, updates: Partial<Lead>) => Promise<void>;
  selectLead: (lead: Lead) => void;
  updateLeadLevel: (id: string, level: string) => Promise<void>;
  getLeadsByStatus: (status: string) => Lead[];
}

export const useLeadStore = create<LeadStore>((set, get) => ({
  leads: [],
  selectedLead: null,
  loading: false,

  fetchLeads: async (branchId: string) => {
    set({ loading: true });
    const { data, error } = await supabase
      .from('leads')
      .select('*')
      .eq('branch_id', branchId)
      .order('updated_at', { ascending: false });
    if (!error) {
      set({ leads: data, loading: false });
    }
  },

  createLead: async (lead: Partial<Lead>) => {
    const { data, error } = await supabase
      .from('leads')
      .insert([lead])
      .select()
      .single();
    if (!error) {
      set({ leads: [...get().leads, data] });
    }
  },

  updateLead: async (id: string, updates: Partial<Lead>) => {
    const { error } = await supabase
      .from('leads')
      .update(updates)
      .eq('id', id);
    if (!error) {
      set({
        leads: get().leads.map((l) => (l.id === id ? { ...l, ...updates } : l)),
        selectedLead: get().selectedLead?.id === id ? { ...get().selectedLead!, ...updates } : get().selectedLead,
      });
    }
  },

  selectLead: (lead: Lead) => {
    set({ selectedLead: lead });
  },

  updateLeadLevel: async (id: string, level: string) => {
    await get().updateLead(id, { level } as any);
  },

  getLeadsByStatus: (status: string) => {
    return get().leads.filter((l) => l.level === status);
  },
}));
```

### Store #4: bookingStore.ts

```typescript
import { create } from 'zustand';

interface Booking {
  lead_id: string;
  car_id: string;
  down_payment: number;
  loan_term_months: number;
  interest_rate: number;
  monthly_amount: number;
}

interface BookingStore {
  currentBooking: Partial<Booking>;
  step: number;  // 1, 2, 3
  
  setBookingData: (data: Partial<Booking>) => void;
  setStep: (step: number) => void;
  calculateMonthly: (principal: number, rate: number, months: number) => number;
  reset: () => void;
}

export const useBookingStore = create<BookingStore>((set) => ({
  currentBooking: {},
  step: 1,

  setBookingData: (data: Partial<Booking>) => {
    set((state) => ({
      currentBooking: { ...state.currentBooking, ...data },
    }));
  },

  setStep: (step: number) => {
    set({ step });
  },

  calculateMonthly: (principal: number, rate: number, months: number) => {
    const monthlyRate = rate / 100 / 12;
    return (principal * monthlyRate * (1 + monthlyRate) ** months) / 
           ((1 + monthlyRate) ** months - 1);
  },

  reset: () => {
    set({ currentBooking: {}, step: 1 });
  },
}));
```

### Store #5: dashboardStore.ts

```typescript
import { create } from 'zustand';
import { supabase } from '@/lib/supabase';

interface KPI {
  units: number;
  revenue: number;
  conversionRate: number;
  totalLeads: number;
}

interface DashboardStore {
  kpis: KPI | null;
  teamData: any[];
  loading: boolean;
  
  fetchDashboard: (branchId: string) => Promise<void>;
  getKPIs: () => KPI | null;
}

export const useDashboardStore = create<DashboardStore>((set) => ({
  kpis: null,
  teamData: [],
  loading: false,

  fetchDashboard: async (branchId: string) => {
    set({ loading: true });
    // Fetch bookings + leads for KPIs
    const { data: bookings } = await supabase
      .from('bookings')
      .select('*')
      .eq('branch_id', branchId)
      .eq('status', 'completed');
    
    const { data: leads } = await supabase
      .from('leads')
      .select('*')
      .eq('branch_id', branchId);
    
    const units = bookings?.length || 0;
    const revenue = bookings?.reduce((sum: number, b: any) => sum + (b.monthly_amount * b.loan_term_months), 0) || 0;
    const conversionRate = leads && leads.length > 0 ? (units / leads.length) * 100 : 0;
    
    set({
      kpis: {
        units,
        revenue,
        conversionRate,
        totalLeads: leads?.length || 0,
      },
      loading: false,
    });
  },

  getKPIs: () => {
    return null; // Implement later
  },
}));
```

### Store #6: uiStore.ts

```typescript
import { create } from 'zustand';

type Device = 'mobile' | 'tablet' | 'desktop';

interface UIStore {
  device: Device;
  navHistory: string[];
  activeTab: 'cars' | 'leads' | 'reports' | 'profile';
  sidebarOpen: boolean;
  
  setDevice: (device: Device) => void;
  pushRoute: (route: string) => void;
  popRoute: () => void;
  setActiveTab: (tab: string) => void;
  toggleSidebar: () => void;
}

export const useUIStore = create<UIStore>((set) => ({
  device: 'mobile',
  navHistory: ['/'],
  activeTab: 'cars',
  sidebarOpen: false,

  setDevice: (device: Device) => set({ device }),
  
  pushRoute: (route: string) => {
    set((state) => ({ navHistory: [...state.navHistory, route] }));
  },
  
  popRoute: () => {
    set((state) => ({
      navHistory: state.navHistory.slice(0, -1),
    }));
  },
  
  setActiveTab: (tab: string) => {
    set({ activeTab: tab as any });
  },
  
  toggleSidebar: () => {
    set((state) => ({ sidebarOpen: !state.sidebarOpen }));
  },
}));
```

---

## REACT ROUTER CONFIGURATION

### Router Setup (src/App.jsx)

```jsx
import React, { useEffect } from 'react';
import { HashRouter, Routes, Route, Navigate } from 'react-router-dom';
import { useAuthStore } from '@/stores/authStore';

// Pages
import LoginPage from '@/pages/LoginPage';
import SalesDashboard from '@/pages/SalesDashboard';
import CatalogPage from '@/pages/CatalogPage';
import CarDetailPage from '@/pages/CarDetailPage';
import LeadListPage from '@/pages/LeadListPage';
import LeadDetailPage from '@/pages/LeadDetailPage';
import ACardPage from '@/pages/ACardPage';
import PaymentCalcPage from '@/pages/PaymentCalcPage';
import BookingPage from '@/pages/BookingPage';
import ManagerDashboard from '@/pages/ManagerDashboard';
import PipelinePage from '@/pages/PipelinePage';
import TargetsPage from '@/pages/TargetsPage';
import ReportsPage from '@/pages/ReportsPage';
import NotificationsPage from '@/pages/NotificationsPage';
import NotFoundPage from '@/pages/NotFoundPage';

// Protected Route Wrapper
const ProtectedRoute = ({ role, children }) => {
  const { user, role: userRole } = useAuthStore();
  
  if (!user) return <Navigate to="/" />;
  if (role && userRole !== role) return <Navigate to="/unauthorized" />;
  
  return children;
};

export default function App() {
  const { user, getCurrentUser } = useAuthStore();

  useEffect(() => {
    getCurrentUser();
  }, []);

  return (
    <HashRouter>
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<LoginPage />} />
        
        {/* Sales Routes */}
        <Route
          path="/sales"
          element={
            <ProtectedRoute role="sales">
              <SalesDashboard />
            </ProtectedRoute>
          }
        />
        <Route path="/catalog" element={<CatalogPage />} />
        <Route path="/car/:id" element={<CarDetailPage />} />
        <Route path="/lead/:id" element={<LeadDetailPage />} />
        <Route path="/acard" element={<ACardPage />} />
        <Route path="/calc" element={<PaymentCalcPage />} />
        <Route path="/booking" element={<BookingPage />} />
        
        {/* Manager Routes */}
        <Route
          path="/manager"
          element={
            <ProtectedRoute role="mgr">
              <ManagerDashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/pipeline"
          element={
            <ProtectedRoute role="mgr">
              <PipelinePage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/targets"
          element={
            <ProtectedRoute role="mgr">
              <TargetsPage />
            </ProtectedRoute>
          }
        />
        
        {/* Shared Routes */}
        <Route path="/reports" element={<ReportsPage />} />
        <Route path="/notifications" element={<NotificationsPage />} />
        
        {/* Fallback */}
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </HashRouter>
  );
}
```

---

## TAILWIND CSS THEME CONFIGURATION

### tailwind.config.js

```javascript
/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx,ts,tsx}'],
  theme: {
    extend: {
      colors: {
        // Primary brand colors
        primary: {
          DEFAULT: '#1B7A3F',
          dark: '#145E30',
          light: '#EBF7EF',
          medium: '#C4E3CE',
        },
        // Status colors
        avail: '#16A34A',      // Available green
        transit: '#EA580C',    // Transit orange
        // Lead temperature
        hot: '#DC2626',        // Hot red
        warm: '#D97706',       // Warm amber
        cool: '#2563EB',       // Cool blue
        won: '#10B981',        // Won emerald
        // Text colors
        t1: '#111827',         // Primary text (near-black)
        t2: '#6B7280',         // Secondary text (gray-500)
        t3: '#9CA3AF',         // Tertiary text (gray-400)
        // Background
        bg: '#F5F7F5',         // Page background
        card: '#FFFFFF',       // Card background
        border: '#E5E7EB',     // Border gray-200
      },
      borderRadius: {
        sm: '8px',
        md: '12px',
        lg: '16px',
        xl: '20px',
        pill: '100px',
      },
      fontFamily: {
        sarabun: ['Sarabun', '-apple-system', 'BlinkMacSystemFont', 'sans-serif'],
      },
      fontSize: {
        xs: ['12px', { lineHeight: '16px' }],
        sm: ['14px', { lineHeight: '20px' }],
        base: ['16px', { lineHeight: '24px' }],
        lg: ['18px', { lineHeight: '28px' }],
        xl: ['20px', { lineHeight: '28px' }],
        '2xl': ['24px', { lineHeight: '32px' }],
        '3xl': ['30px', { lineHeight: '36px' }],
      },
      spacing: {
        xs: '4px',
        sm: '8px',
        md: '12px',
        lg: '16px',
        xl: '20px',
        '2xl': '24px',
        '3xl': '32px',
      },
      boxShadow: {
        sm: '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
        md: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
        lg: '0 10px 15px -3px rgba(0, 0, 0, 0.1)',
        card: '0 1px 3px 0 rgba(0, 0, 0, 0.1)',
      },
      keyframes: {
        slideInRight: {
          'from': { transform: 'translateX(100%)', opacity: '0' },
          'to': { transform: 'translateX(0)', opacity: '1' },
        },
        slideOutLeft: {
          'from': { transform: 'translateX(0)', opacity: '1' },
          'to': { transform: 'translateX(-100%)', opacity: '0' },
        },
        fadeIn: {
          'from': { opacity: '0' },
          'to': { opacity: '1' },
        },
      },
      animation: {
        slideInRight: 'slideInRight 0.3s ease-out',
        slideOutLeft: 'slideOutLeft 0.3s ease-out',
        fadeIn: 'fadeIn 0.3s ease-out',
      },
      screens: {
        'mobile': '390px',     // iPhone 12
        'tablet': '768px',     // iPad
        'desktop': '1024px',
      },
    },
  },
  plugins: [],
};
```

---

## SERVICE WORKER & PWA

### public/manifest.json

```json
{
  "name": "Toyota Vorachakyont Sale Tool",
  "short_name": "Toyota Sale Tool",
  "description": "Digital sales platform for Toyota Vorachakyont dealership",
  "start_url": "/demo-app/#/",
  "display": "standalone",
  "scope": "/demo-app/",
  "theme_color": "#1B7A3F",
  "background_color": "#FFFFFF",
  "orientation": "portrait-primary",
  "icons": [
    {
      "src": "/icons/android-chrome-192x192.png",
      "sizes": "192x192",
      "type": "image/png",
      "purpose": "any"
    },
    {
      "src": "/icons/android-chrome-512x512.png",
      "sizes": "512x512",
      "type": "image/png",
      "purpose": "any"
    },
    {
      "src": "/icons/apple-touch-icon.png",
      "sizes": "180x180",
      "type": "image/png",
      "purpose": "maskable"
    }
  ],
  "screenshots": [
    {
      "src": "/screenshots/phone.png",
      "sizes": "540x720",
      "form_factor": "narrow"
    },
    {
      "src": "/screenshots/tablet.png",
      "sizes": "1280x720",
      "form_factor": "wide"
    }
  ]
}
```

### public/service-worker.js

```javascript
const CACHE_VERSION = 'v1';
const CACHE_NAME = `toyota-app-${CACHE_VERSION}`;

const STATIC_ASSETS = [
  '/#/',
  '/index.html',
  '/manifest.json',
  '/icons/android-chrome-192x192.png',
];

// Install event
self.addEventListener('install', (event) => {
  console.log('Service Worker installing...');
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      console.log('Caching static assets...');
      return cache.addAll(STATIC_ASSETS);
    })
  );
  self.skipWaiting();
});

// Activate event
self.addEventListener('activate', (event) => {
  console.log('Service Worker activating...');
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheName !== CACHE_NAME) {
            console.log('Deleting old cache:', cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
  self.clients.claim();
});

// Fetch event
self.addEventListener('fetch', (event) => {
  const { request } = event;
  const url = new URL(request.url);

  // Skip non-GET requests
  if (request.method !== 'GET') {
    return;
  }

  // Supabase API: network-first, fallback to offline message
  if (url.origin.includes('supabase.co')) {
    event.respondWith(
      fetch(request)
        .then((response) => {
          if (response.ok) {
            const cache = caches.open(CACHE_NAME);
            cache.then((c) => c.put(request, response.clone()));
          }
          return response;
        })
        .catch(() => {
          return new Response(
            JSON.stringify({ offline: true, message: 'App is offline' }),
            { status: 503, headers: { 'Content-Type': 'application/json' } }
          );
        })
    );
    return;
  }

  // CSS, JS, images: cache-first
  if (
    url.pathname.match(/\.(js|css|png|jpg|jpeg|svg|woff|woff2)$/)
  ) {
    event.respondWith(
      caches.match(request).then((response) => {
        return response || fetch(request).then((res) => {
          caches.open(CACHE_NAME).then((cache) => {
            cache.put(request, res.clone());
          });
          return res;
        });
      })
    );
    return;
  }

  // HTML: stale-while-revalidate
  event.respondWith(
    caches.match(request).then((response) => {
      const fetchPromise = fetch(request).then((res) => {
        caches.open(CACHE_NAME).then((cache) => {
          cache.put(request, res.clone());
        });
        return res;
      });
      return response || fetchPromise;
    })
  );
});
```

### src/main.jsx - Service Worker Registration

```jsx
import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './styles/globals.css';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);

// Register service worker for PWA
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/demo-app/service-worker.js')
      .then((reg) => console.log('SW registered:', reg))
      .catch((err) => console.log('SW registration failed:', err));
  });
}
```

---

## COMPONENT LIBRARY STRUCTURE

### Atomic Design Pattern

**Level 1: Atoms (UI Primitives)**
```
Button, Input, Select, Badge, Spinner, Avatar, Divider, Icon
```

**Level 2: Molecules (Simple Combinations)**
```
FilterPill, StatusBadge, TextInput, FormField, Card, Toast
```

**Level 3: Organisms (Complex Components)**
```
CarListItem, LeadForm, BookingSteps, SpecAccordion, KPIGrid
```

**Level 4: Templates (Page Layouts)**
```
AppShell, LoginLayout, CatalogLayout, ManagerLayout
```

### Component Example: Button.jsx

```jsx
import React from 'react';
import clsx from 'clsx';

export default function Button({
  variant = 'primary',
  size = 'md',
  disabled = false,
  fullWidth = false,
  children,
  onClick,
  ...props
}) {
  const baseStyles = 'font-sarabun font-medium rounded-md transition-colors focus:outline-none';
  
  const variantStyles = {
    primary: 'bg-primary text-white hover:bg-primary-dark',
    secondary: 'bg-gray-200 text-t1 hover:bg-gray-300',
    outline: 'border border-primary text-primary hover:bg-primary-light',
    danger: 'bg-red-500 text-white hover:bg-red-600',
  };

  const sizeStyles = {
    sm: 'px-3 py-2 text-sm',
    md: 'px-4 py-2 text-base',
    lg: 'px-6 py-3 text-lg',
  };

  return (
    <button
      className={clsx(
        baseStyles,
        variantStyles[variant],
        sizeStyles[size],
        fullWidth && 'w-full',
        disabled && 'opacity-50 cursor-not-allowed'
      )}
      disabled={disabled}
      onClick={onClick}
      {...props}
    >
      {children}
    </button>
  );
}
```

---

## STATE FLOW DIAGRAMS

### Lead Status Progression

```
Create Lead (pending)
      ↓
Assign to Sales Staff
      ↓
Sales Staff Sets Level: Cool/Warm/Hot
      ↓
Add Activities (calls, notes, meetings)
      ↓
Associate with Car
      ↓
Create Booking
      ↓
Booking Confirmed → Lead Status = Won
```

### App Authentication Flow

```
User Opens App
      ↓
Check Session (getCurrentUser)
      ↓
No Session → Show LoginPage
      ↓
User Enters Email + Password + Selects Role
      ↓
Supabase Auth: Verify Credentials
      ↓
Supabase: Fetch Profile (Role + Branch)
      ↓
Set AuthStore (user, role, branch_id)
      ↓
Redirect to Dashboard (/sales or /manager)
      ↓
RLS Policies Enforce Access
```

---

## MIGRATION PLAN

### Phase 1: Foundation (Days 1-2)

- [ ] Create Supabase project + PostgreSQL database
- [ ] Run SQL DDL: create all tables + RLS policies
- [ ] Seed demo data (6 cars, 4 leads, 4 user profiles)
- [ ] Setup GitHub repository + Actions pipeline
- [ ] Initialize Vite + React + Tailwind CSS
- [ ] Create Zustand stores skeleton

### Phase 2: Authentication & Data Layer (Days 2-3)

- [ ] Implement Supabase Auth login/logout
- [ ] Create authStore + Supabase client
- [ ] Test RLS policies (login as sales vs manager)
- [ ] Create React Router + Protected routes
- [ ] Implement carStore, leadStore, bookingStore

### Phase 3: Component Library (Days 3-4)

- [ ] Build atomic UI components (Button, Card, Input, Badge, etc.)
- [ ] Create layout components (AppShell, BottomNav, PageHeader)
- [ ] Build car components (CarListItem, CarDetail, Gallery, SpecAccordion)
- [ ] Build lead components (LeadForm, ACardForm, PipelineKanban)
- [ ] Build booking components (BookingSteps, PaymentCalculator, QRPayment)

### Phase 4: Pages & Features (Days 4-5)

- [ ] Implement LoginPage
- [ ] Implement CatalogPage + CarDetailPage
- [ ] Implement LeadListPage + LeadDetailPage
- [ ] Implement ACardPage + PaymentCalcPage + BookingPage
- [ ] Implement SalesDashboard + ManagerDashboard
- [ ] Implement PipelinePage + TargetsPage + ReportsPage

### Phase 5: PWA & Deployment (Days 5-6)

- [ ] Create manifest.json + service worker
- [ ] Test offline functionality
- [ ] Setup GitHub Actions CI/CD pipeline
- [ ] Deploy to GitHub Pages
- [ ] Test on iOS + Android (PWA install)
- [ ] Performance testing + Lighthouse audit

### Phase 6: Polish & Testing (Day 7)

- [ ] End-to-end testing (all user flows)
- [ ] Mobile responsive testing (390px, 768px)
- [ ] Security audit (RLS policies, data isolation)
- [ ] Performance optimization (bundle size < 200KB gzipped)
- [ ] Fix bugs + known issues
- [ ] Documentation + deployment runbook

---

## SEED DATA & SQL

### Demo Users (to insert via Supabase Auth UI)

```
Email: sales1@vorachakyont.local
Password: Demo@2026
Role: sales
Branch: วรจักร์ยนต์ บางกอก

Email: sales2@vorachakyont.local
Password: Demo@2026
Role: sales
Branch: วรจักร์ยนต์ เชียงใหม่

Email: manager@vorachakyont.local
Password: Demo@2026
Role: mgr
Branch: วรจักร์ยนต์ บางกอก
```

### SQL: Insert Demo Data

```sql
-- Get branch IDs first
SELECT id FROM branches;
-- Assuming: Bangkok = 'id1', Chiang Mai = 'id2', etc.

-- Insert Cars (6 models)
INSERT INTO cars (
  name, type, price, fuel, seats, gearbox, power, 
  avail_status, warranty, eco, category, 
  bg_color, image_url, video_id, specs
) VALUES
(
  'Toyota Corolla Altis',
  'Sedan',
  900000,
  'Petrol',
  5,
  'Automatic',
  110,
  'available',
  '3 years / 100,000 km',
  'Euro 5',
  'Popular',
  '#F5F5F5',
  '/images/corolla-main.jpg',
  'youtube_id_1',
  '{"engine": [["Displacement", "1596 cc"], ["Power", "110 HP"]], "dim": [["Length", "4.63 m"]], "safety": ["ABS", "EBD", "Dual Airbags"], "features": ["Touch Screen", "Bluetooth", "Rear Camera"]}'::jsonb
),
(
  'Toyota Camry',
  'Sedan',
  1800000,
  'Petrol',
  5,
  'Automatic',
  176,
  'available',
  '3 years / 100,000 km',
  'Euro 5',
  'Luxury',
  '#F5F5F5',
  '/images/camry-main.jpg',
  'youtube_id_2',
  '{"engine": [["Displacement", "2493 cc"], ["Power", "176 HP"]], "safety": ["ABS", "8 Airbags", "VSC"], "features": ["Panoramic Roof", "Premium Sound", "Power Seats"]}'::jsonb
),
(
  'Toyota Avanza',
  'SUV',
  750000,
  'Petrol',
  7,
  'Manual',
  109,
  'available',
  '3 years / 100,000 km',
  'Euro 4',
  'Popular',
  '#F5F5F5',
  '/images/avanza-main.jpg',
  'youtube_id_3',
  '{"engine": [["Displacement", "1496 cc"], ["Power", "109 HP"]], "features": ["Spacious", "Affordable", "Easy to Drive"]}'::jsonb
),
(
  'Toyota CHR',
  'SUV',
  1200000,
  'Petrol',
  5,
  'Automatic',
  146,
  'available',
  '3 years / 100,000 km',
  'Euro 5',
  'Premium',
  '#F5F5F5',
  '/images/chr-main.jpg',
  'youtube_id_4',
  '{"engine": [["Displacement", "1797 cc"], ["Power", "146 HP"]], "safety": ["Toyota Safety Sense", "7 Airbags"], "features": ["Hybrid Option", "Distinctive Design"]}'::jsonb
),
(
  'Toyota Fortuner',
  'SUV',
  2200000,
  'Diesel',
  7,
  'Automatic',
  177,
  'transit',
  '3 years / 100,000 km',
  'Euro 5',
  'Luxury',
  '#F5F5F5',
  '/images/fortuner-main.jpg',
  'youtube_id_5',
  '{"engine": [["Displacement", "2393 cc"], ["Power", "177 HP"]], "features": ["7-Seater", "Off-Road Capable", "Leather Interior"]}'::jsonb
),
(
  'Toyota Hilux',
  'Pickup',
  950000,
  'Diesel',
  5,
  'Manual',
  150,
  'available',
  '3 years / 100,000 km',
  'Euro 5',
  'Popular',
  '#F5F5F5',
  '/images/hilux-main.jpg',
  'youtube_id_6',
  '{"engine": [["Displacement", "2393 cc"], ["Power", "150 HP"]], "features": ["Durable", "Strong Towing", "High Ground Clearance"]}'::jsonb
);

-- Insert Demo Leads (4 leads)
INSERT INTO leads (
  name, initial, avatar_color, level, source, 
  assigned_to, branch_id, created_by, 
  phone, email, address, notes
) VALUES
(
  'สมชาย กุลวิบูลย์',
  'ส.ก',
  '#DC2626',
  'hot',
  'walk-in',
  (SELECT id FROM profiles WHERE role = 'sales' LIMIT 1),
  'id1',
  (SELECT id FROM profiles WHERE role = 'sales' LIMIT 1),
  '081-234-5678',
  'somchai@email.com',
  '123 Rama IX, Bangkok',
  'Interested in Camry, test drive scheduled'
),
(
  'จันทร์เพ็ญ หลวงศรี',
  'จ.ห',
  '#D97706',
  'warm',
  'phone',
  (SELECT id FROM profiles WHERE role = 'sales' LIMIT 1),
  'id1',
  (SELECT id FROM profiles WHERE role = 'sales' LIMIT 1),
  '089-876-5432',
  'janphen@email.com',
  '456 Sukhumvit, Bangkok',
  'Comparing Corolla and CHR'
),
(
  'ปรีชา วัฒนชัย',
  'ป.ว',
  '#2563EB',
  'cool',
  'online',
  (SELECT id FROM profiles WHERE role = 'sales' LIMIT 1),
  'id1',
  (SELECT id FROM profiles WHERE role = 'sales' LIMIT 1),
  '082-111-2222',
  'preechar@email.com',
  '789 Silom, Bangkok',
  'Browsing specs, not ready to buy yet'
),
(
  'สรัญญา เทพหัสดิน',
  'ส.เ',
  '#10B981',
  'won',
  'referral',
  (SELECT id FROM profiles WHERE role = 'sales' LIMIT 1),
  'id1',
  (SELECT id FROM profiles WHERE role = 'sales' LIMIT 1),
  '081-999-8888',
  'saranya@email.com',
  '321 Riverside, Bangkok',
  'Booking confirmed for Avanza, delivery next week'
);

-- Insert Sample Booking
INSERT INTO bookings (
  lead_id, car_id, branch_id, salesperson_id, booking_date,
  down_payment, loan_amount, loan_term_months, interest_rate, monthly_amount,
  payment_method, reference_number, status
) VALUES
(
  (SELECT id FROM leads WHERE level = 'won' LIMIT 1),
  (SELECT id FROM cars WHERE name = 'Toyota Avanza' LIMIT 1),
  'id1',
  (SELECT id FROM profiles WHERE role = 'sales' LIMIT 1),
  CURRENT_DATE,
  100000,
  650000,
  60,
  2.5,
  11875,
  'bank_loan',
  'REF-2026-001',
  'confirmed'
);

-- Insert Sample Activity
INSERT INTO lead_activities (
  lead_id, type, title, description, result, created_by
) VALUES
(
  (SELECT id FROM leads WHERE level = 'hot' LIMIT 1),
  'call',
  'Follow-up Call',
  'Called customer about Camry test drive',
  'interested',
  (SELECT id FROM profiles WHERE role = 'sales' LIMIT 1)
);
```

---

## RISKS & TRADE-OFFS

| Risk | Probability | Impact | Mitigation |
|---|---|---|---|
| Supabase free tier rate limits | Medium | High | Monitor usage; upgrade to paid if needed |
| RLS policy misconfiguration | Low | Critical | Thorough testing; security audit before launch |
| Service Worker caching issues | Medium | Medium | Comprehensive offline testing; versioning strategy |
| GitHub Pages 404 handling | Low | High | 404.html redirect already configured |
| Zustand state sync issues | Low | Medium | Devtools logging; clear isolation between stores |
| Tailwind CSS bloat | Low | Medium | PurgeCSS configured; monitor bundle size |
| Mobile responsive breakage | Medium | Medium | Continuous testing on iPhone + iPad simulators |
| Payment calculation precision | Low | High | Currency rounding to 2 decimals; unit tests |

---

## DEPENDENCIES & VERSIONS

| Package | Version | Purpose |
|---|---|---|
| react | 18.x | UI framework |
| vite | 5.x | Build tool |
| tailwindcss | 3.x | CSS framework |
| zustand | 4.x | State management |
| react-router-dom | 6.x | Client-side routing |
| @supabase/supabase-js | 2.x | Backend integration |
| chart.js | 4.x | Dashboard charts (optional) |
| clsx | 2.x | Conditional className utility |

---

## DEPLOYMENT CHECKLIST

- [ ] Supabase project created + SQL schema deployed
- [ ] RLS policies tested (sales/manager access controls)
- [ ] Seed data inserted (6 cars, 4 leads, 4 users)
- [ ] GitHub repository created
- [ ] `VITE_SUPABASE_URL` + `VITE_SUPABASE_ANON_KEY` added to GitHub Secrets
- [ ] `.github/workflows/deploy.yml` configured
- [ ] `vite.config.js` base URL set to `/repo-name/`
- [ ] `public/404.html` in place for SPA routing
- [ ] Service worker manifest + icons added
- [ ] App tested on iOS Safari (PWA install)
- [ ] App tested on Android Chrome (PWA install)
- [ ] Lighthouse audit passed (>80 score)
- [ ] Security audit completed (no PII leaks, RLS verified)

---

## NEXT STEPS

1. **Setup Supabase** — Create project, deploy SQL schema
2. **Create GitHub repo** — Clone template, setup GitHub Actions
3. **Start Vite scaffold** — `npm create vite@latest my-app -- --template react`
4. **Implement stores** — Create all 6 Zustand stores
5. **Build components** — Start with atoms, work up to organisms
6. **Create pages** — Implement route-level pages
7. **Integration testing** — End-to-end user flows
8. **Deploy** — GitHub Pages via Actions

---

**Document Version**: 1.0  
**Last Updated**: 2026-03-28  
**Maintained By**: iPassion Pre-Sale Engineering Team  
**Status**: READY FOR IMPLEMENTATION

---
