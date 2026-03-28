# Toyota Vorachakyont Sale Tool Demo App - Implementation Tasks

## 1. Project Setup & Configuration
- [x] 1.1 Create Vite + React scaffold with `npm create vite@latest`
- [x] 1.2 Install dependencies: react-router-dom, zustand, @supabase/supabase-js, chart.js, react-chartjs-2, tailwindcss, postcss, autoprefixer
- [x] 1.3 Configure Tailwind with Toyota design tokens (colors, fonts, spacing)
- [x] 1.4 Update vite.config.js with base path for GitHub Pages deployment
- [x] 1.5 Create .env.local with Supabase URL and anon key
- [x] 1.6 Generate and add PWA manifest.json with app name, icons, theme colors
- [x] 1.7 Create public/icons/ directory with 192x192 and 512x512 app icons
- [x] 1.8 Implement service worker (public/sw.js) with cache-first strategy
- [x] 1.9 Create public/404.html for SPA routing on GitHub Pages
- [x] 1.10 Register service worker in main.jsx

## 2. Supabase Backend Setup
- [x] 2.1 Create Supabase project and note URL + anon key
- [ ] 2.2 Create `profiles` table (id, user_id, full_name, role, branch_id, created_at)
- [ ] 2.3 Create `branches` table (id, name, location, manager_id, phone, created_at)
- [ ] 2.4 Create `cars` table (id, type, model, year, price, spec_json, image_urls, availability, created_at)
- [ ] 2.5 Create `leads` table (id, name, phone, email, source, interest_level, car_id, assigned_to, created_at, updated_at)
- [ ] 2.6 Create `lead_activities` table (id, lead_id, activity_type, description, created_at)
- [ ] 2.7 Create `bookings` table (id, lead_id, car_id, down_payment, term_months, total_price, status, created_at)
- [ ] 2.8 Create `notifications` table (id, user_id, title, message, is_read, created_at)
- [ ] 2.9 Enable Row Level Security (RLS) on all tables
- [ ] 2.10 Write RLS policy for sales staff (own leads, assigned cars)
- [ ] 2.11 Write RLS policy for managers (all leads in branch)
- [ ] 2.12 Create auth trigger to auto-create profile on user signup
- [x] 2.13 Seed 6 sample cars with specs and image URLs (via mockData.js)
- [x] 2.14 Seed 3 branches with locations and managers (via mockData.js)
- [x] 2.15 Seed 4 sample leads assigned to different staff (via mockData.js)
- [x] 2.16 Create demo user accounts (sales staff, manager) (via DEMO_USERS)
- [ ] 2.17 Test all queries via Supabase dashboard

## 3. Core Infrastructure
- [x] 3.1 Create lib/supabase.js with Supabase client initialization
- [x] 3.2 Create zustand store for auth (user, role, login, logout, switchRole)
- [x] 3.3 Create zustand store for cars (via CatalogPage state)
- [x] 3.4 Create zustand store for leads (leadList, selectedLead, CRUD, activities)
- [x] 3.5 Create zustand store for bookings (3-step wizard, calculator, booking CRUD)
- [x] 3.6 Create zustand store for dashboard (via ManagerDashboard computed KPIs)
- [x] 3.7 Create zustand store for UI (notifications, device, nav)
- [x] 3.8 Set up React Router with HashRouter and main route structure
- [x] 3.9 Create ProtectedRoute component that checks auth and role
- [x] 3.10 Create AppShell layout component (header, nav, main, bottom nav)
- [x] 3.11 Create BottomNav component with role-based tabs
- [x] 3.12 Create PageHeader component with title and back button
- [x] 3.13 Create Icon component with full SVG icon set (30+ icons)

## 4. Design System Components
- [x] 4.1 Create Button component variants (btn-p, btn-o, btn-g via globals.css)
- [x] 4.2 Create Card component (card-base pattern via globals.css)
- [x] 4.3 Create Badge components (badge-hot, badge-warm, badge-cool, badge-won)
- [x] 4.4 Create FilterPill component with selected state (pill-filter)
- [x] 4.5 Create section label (sec-lbl) and card header (card-hd) patterns
- [x] 4.6 Screen transition animation (screen-enter)

## 5. Auth & Login
- [x] 5.1 Create LoginPage with role selection cards (Sales/Manager)
- [x] 5.2 Implement demo login with DEMO_USERS (instant role-based access)
- [x] 5.3 Implement Supabase Auth login flow with fallback to demo
- [x] 5.4 Implement auto-redirect after login based on user role
- [x] 5.5 Add logout functionality via Profile page
- [x] 5.6 Create auth guard for protected routes (ProtectedRoute component)
- [x] 5.7 Add in-app role switching via Profile page (switchRole / login with new role)
- [x] 5.8 Implement session check on app load (checkSession)

## 6. Car Catalog Feature
- [x] 6.1 Create CatalogPage layout with filter bar and car grid
- [x] 6.2 Create CarListItem component showing image, name, price, badge
- [x] 6.3 Create FilterBar with 3-level hierarchy: Type > Model > Budget
- [x] 6.4 Implement text search functionality across car names
- [x] 6.5 Create CarDetailPage with hero image and spec sections
- [x] 6.6 Create Gallery component with 5 views (exterior, side, rear, interior, video)
- [x] 6.7 Implement gallery thumbnail strip with active state
- [x] 6.8 Create SpecGrid component showing quick 2-column specs
- [x] 6.9 Create expandable spec sections (Engine, Dimensions, Safety, Features)
- [x] 6.10 Embed YouTube video player for car demo video
- [x] 6.11 Create CTA buttons (Book Now, Calculate Payment) with navigation
- [x] 6.12 Create color picker with 5 color options

## 7. Lead Management Feature
- [x] 7.1 Create LeadListPage with search, filter, and lead list
- [x] 7.2 Create lead list items with avatar, name, car, level badge, date
- [x] 7.3 Implement lead filtering by level (hot/warm/cool/won) and text search
- [x] 7.4 Create LeadDetailPage with full lead information and activities
- [x] 7.5 Create lead hero section (avatar, name, badge, contact info)
- [x] 7.6 Create lead action buttons (Call, LINE, Appointment, Note)
- [x] 7.7 Create activity timeline with color-coded indicators
- [x] 7.8 Create ACardForm page for lead creation (name, phone, email, LINE, source, level, car, budget, notes)
- [x] 7.9 Implement A-Card edit mode (?edit=ID parameter)
- [x] 7.10 Implement lead level change (hot/warm/cool/won/lost)
- [x] 7.11 Implement add activities (call, LINE, note, appointment)
- [x] 7.12 Create Pipeline Kanban with stage management (new/test_drive/negotiation/won/lost)
- [x] 7.13 Pipeline cards are clickable with stage change support

## 8. Booking & Payment Feature
- [x] 8.1 Create PaymentCalculatorPage with car selection and real computation
- [x] 8.2 Create down payment slider (0-50% range)
- [x] 8.3 Create loan term selector (48, 60, 72, 84 months)
- [x] 8.4 Implement real interest rate calculation logic (amortization formula)
- [x] 8.5 Create payment breakdown display (down payment, monthly, total interest)
- [x] 8.6 Create BookingPage with 3-step wizard flow
- [x] 8.7 Step 1: Car selection from catalog
- [x] 8.8 Step 2: Customer information form
- [x] 8.9 Step 3: Payment summary and confirmation
- [x] 8.10 Implement booking persistence with reference number generation
- [x] 8.11 Auto-update lead status to "won" on booking confirmation
- [x] 8.12 Auto-create notification on booking success

## 9. Manager Dashboard Feature
- [x] 9.1 Create ManagerDashboardPage with dynamic KPIs from stores
- [x] 9.2 Create BranchSelector pills with working branch filter
- [x] 9.3 Create KPIGrid with computed metrics (units, revenue, leads, conversion)
- [x] 9.4 Create Team Performance bar chart using Chart.js
- [x] 9.5 Create Leaderboard with live data from team members
- [x] 9.6 Create dynamic Insights generation based on data
- [x] 9.7 Create PipelinePage with kanban columns and clickable cards
- [x] 9.8 Implement stage change via pipeline card interaction
- [x] 9.9 Create TargetsPage with view + edit mode
- [x] 9.10 Create individual staff target cards with progress bars
- [x] 9.11 Create ReportsPage with computed metrics and chart
- [x] 9.12 Implement report export (CSV/PDF)

## 10. Notifications
- [x] 10.1 Create NotificationsPage with notification list
- [x] 10.2 Create notification items with type icons, color coding
- [x] 10.3 Implement mark-as-read functionality (single + all)
- [x] 10.4 Add unread badge counter on bottom nav (reactive)
- [x] 10.5 Implement delete notification
- [x] 10.6 Implement deep-link navigation from notifications
- [x] 10.7 Implement clear all notifications

## 11. Profile Page
- [x] 11.1 Create ProfilePage with user info section (avatar, name, role badge, branch)
- [x] 11.2 Implement editable user name
- [x] 11.3 Create role switching section (Sales/Manager cards)
- [x] 11.4 Display My Stats (leads, won deals, bookings, conversion rate)
- [x] 11.5 Quick Settings (notifications toggle, language display)
- [x] 11.6 Logout button with navigation to login
- [x] 11.7 App version footer

## 12. PWA & Offline
- [x] 12.1 Configure service worker with versioned cache (toyota-sale-v2)
- [x] 12.2 Implement cache-first for static assets, network-first for API
- [x] 12.3 Add offline fallback page support
- [x] 12.4 Clean old caches on activate
- [x] 12.5 Web app manifest with standalone display, portrait orientation
- [x] 12.6 App icons (192x192, 512x512, maskable)
- [x] 12.7 Viewport meta tags for proper mobile scaling

## 13. GitHub Pages Deployment
- [x] 13.1 Create .github/workflows/deploy.yml
- [x] 13.2 Configure workflow to run on push to main branch
- [x] 13.3 Add Node.js setup, npm install, npm build steps
- [x] 13.4 Configure deployment to gh-pages branch
- [x] 13.5 Set base path in vite.config.js for GitHub Pages
- [x] 13.6 Verify deployed app is accessible

## 14. Testing & QA
- [ ] 14.1 Test full flow on iPhone Safari (login > catalog > booking > dashboard)
- [ ] 14.2 Test full flow on iPad Safari (tablet layout)
- [ ] 14.3 Test all filter combinations on catalog page
- [ ] 14.4 Test car detail gallery with all 5 views
- [ ] 14.5 Test payment calculator with various down payment/term combinations
- [ ] 14.6 Test Chart.js rendering on mobile (team chart, weekly chart)
- [ ] 14.7 Test cross-browser (Chrome desktop, Firefox, Safari)
- [ ] 14.8 Run Lighthouse PWA audit (target 90+ score)
- [ ] 14.9 Verify all navigation flows and back button behavior
- [ ] 14.10 Test auth flow (login, logout, role switching, session persistence)
- [ ] 14.11 Test offline mode with service worker
- [ ] 14.12 Test form validation and error messages
