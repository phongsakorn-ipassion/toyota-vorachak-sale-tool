# Toyota Vorachakyont Sale Tool Demo App - Implementation Tasks

## 1. Project Setup & Configuration
- [ ] 1.1 Create Vite + React scaffold with `npm create vite@latest`
- [ ] 1.2 Install dependencies: react-router-dom, zustand, @supabase/supabase-js, chart.js, react-chartjs-2, tailwindcss, postcss, autoprefixer
- [ ] 1.3 Configure Tailwind with Toyota design tokens (colors, fonts, spacing)
- [ ] 1.4 Update vite.config.js with base path for GitHub Pages deployment
- [ ] 1.5 Create .env.local with Supabase URL and anon key
- [ ] 1.6 Generate and add PWA manifest.json with app name, icons, theme colors
- [ ] 1.7 Create public/icons/ directory with 192x192 and 512x512 app icons
- [ ] 1.8 Implement service worker (public/sw.js) with cache-first strategy
- [ ] 1.9 Create public/404.html for SPA routing on GitHub Pages
- [ ] 1.10 Register service worker in main.jsx

## 2. Supabase Backend Setup
- [ ] 2.1 Create Supabase project and note URL + anon key
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
- [ ] 2.13 Seed 6 sample cars with specs and image URLs
- [ ] 2.14 Seed 3 branches with locations and managers
- [ ] 2.15 Seed 4 sample leads assigned to different staff
- [ ] 2.16 Create demo user accounts (sales staff, manager, admin)
- [ ] 2.17 Test all queries via Supabase dashboard

## 3. Core Infrastructure
- [ ] 3.1 Create lib/supabase.js with Supabase client initialization
- [ ] 3.2 Create zustand store for auth (user, role, login, logout, isLoading)
- [ ] 3.3 Create zustand store for cars (carList, selectedCar, filters, setCar)
- [ ] 3.4 Create zustand store for leads (leadList, selectedLead, setLead)
- [ ] 3.5 Create zustand store for bookings (currentBooking, setBooking, step)
- [ ] 3.6 Create zustand store for dashboard (kpis, charts, selectedBranch)
- [ ] 3.7 Create zustand store for UI (isMobile, sidebarOpen, theme)
- [ ] 3.8 Set up React Router with HashRouter and main route structure
- [ ] 3.9 Create ProtectedRoute component that checks auth and role
- [ ] 3.10 Create AppShell layout component (header, nav, main, bottom nav)
- [ ] 3.11 Create StatusBar component (battery, signal, time)
- [ ] 3.12 Create BottomNav component with role-based tabs
- [ ] 3.13 Create PageHeader component with title and back button
- [ ] 3.14 Create useAuth custom hook for auth operations
- [ ] 3.15 Create useNavigateBack custom hook for SPA navigation
- [ ] 3.16 Create useDevice custom hook for device detection (iPhone, iPad)

## 4. Design System Components
- [ ] 4.1 Create Button component (variants: primary, outline, ghost; sizes: sm, md, lg)
- [ ] 4.2 Create Card component with padding and shadow
- [ ] 4.3 Create CardHeader component with title and action slot
- [ ] 4.4 Create Badge component (variants: hot, warm, cool, win)
- [ ] 4.5 Create FilterPill component with selected state
- [ ] 4.6 Create Input component with icon prefix and label support
- [ ] 4.7 Create Select component for dropdowns
- [ ] 4.8 Create StatusDot component (available, transit, sold states)
- [ ] 4.9 Create Avatar component with initials and color mapping
- [ ] 4.10 Create KPICard component (number, label, trend indicator)
- [ ] 4.11 Create QuickAction grid item component
- [ ] 4.12 Create Modal component for dialogs
- [ ] 4.13 Create Toast/Notification component for feedback

## 5. Auth & Login
- [ ] 5.1 Create LoginPage with email and password inputs
- [ ] 5.2 Add role selector (Sales, Manager, Admin) on login page
- [ ] 5.3 Implement Supabase Auth login flow with error handling
- [ ] 5.4 Implement session persistence in localStorage
- [ ] 5.5 Create DemoBar component (top-right, device + role switcher)
- [ ] 5.6 Implement auto-redirect after login based on user role
- [ ] 5.7 Add logout functionality to nav menu
- [ ] 5.8 Create auth guard for protected routes
- [ ] 5.9 Implement password reset flow
- [ ] 5.10 Add "demo mode" login with pre-seeded accounts

## 6. Car Catalog Feature
- [ ] 6.1 Create CatalogPage layout with filter bar and car list
- [ ] 6.2 Create CarListItem component showing image, name, price, badge
- [ ] 6.3 Create FilterBar component with 3-level hierarchy: Type > Model > Budget
- [ ] 6.4 Implement search functionality across car names
- [ ] 6.5 Create CarDetailPage with hero image and spec tabs
- [ ] 6.6 Create Gallery component with 5 views (exterior, side, rear, interior, video)
- [ ] 6.7 Implement gallery thumbnail strip with active state
- [ ] 6.8 Create SpecGrid component showing quick 2-column specs (engine, dims, etc)
- [ ] 6.9 Create SpecAccordion component with 4 expandable sections (Engine, Dimensions, Safety, Features)
- [ ] 6.10 Embed YouTube video player for car demo video
- [ ] 6.11 Create CTA button section (Book Now, Calculate Payment)
- [ ] 6.12 Implement car filtering logic in zustand
- [ ] 6.13 Add "favorite" toggle on car cards
- [ ] 6.14 Create comparison view for 2-3 cars side-by-side

## 7. Lead Management Feature
- [ ] 7.1 Create LeadListPage with list of assigned leads
- [ ] 7.2 Create LeadListItem component with name, status badge, contact info
- [ ] 7.3 Implement lead filtering (status, source, interest level)
- [ ] 7.4 Create LeadDetailPage with full lead information
- [ ] 7.5 Create LeadHero component (avatar, name, badge, contact info)
- [ ] 7.6 Create LeadActions component (Call, LINE, Schedule Appointment, Add Note)
- [ ] 7.7 Create LeadTimeline component showing activity history
- [ ] 7.8 Create ACardForm page for lead qualification form (interest level, source)
- [ ] 7.9 Create InterestLevelPicker component (0-10 scale or Hot/Warm/Cool)
- [ ] 7.10 Create SourcePills component to set lead source
- [ ] 7.11 Implement lead activity logging to database
- [ ] 7.12 Add note input and save functionality
- [ ] 7.13 Create appointment scheduler integration
- [ ] 7.14 Add LINE integration for messaging
- [ ] 7.15 Add phone call logging with timestamp

## 8. Booking & Payment Feature
- [ ] 8.1 Create PaymentCalculatorPage with car selection
- [ ] 8.2 Create DownPaymentSlider component (0-100% range)
- [ ] 8.3 Create TermSelector component (12, 24, 36, 48, 60 months)
- [ ] 8.4 Implement interest rate calculation logic
- [ ] 8.5 Create payment breakdown display (down payment, monthly, total)
- [ ] 8.6 Create BookingPage with 3-step form flow
- [ ] 8.7 Create BookingStep1 component (personal details + payment method selection)
- [ ] 8.8 Create BookingStep2 component (QR code display + countdown timer)
- [ ] 8.9 Implement QR code generation using Google Charts API
- [ ] 8.10 Create countdown timer component (5-10 minute expiry)
- [ ] 8.11 Create BookingStep3 component (success screen + next steps)
- [ ] 8.12 Implement booking submission to Supabase
- [ ] 8.13 Add confirmation email trigger
- [ ] 8.14 Create booking receipt PDF generation
- [ ] 8.15 Add "save quote" functionality

## 9. Manager Dashboard Feature
- [ ] 9.1 Create ManagerDashboardPage main layout
- [ ] 9.2 Create BranchSelector pills component for multi-branch view
- [ ] 9.3 Create KPIGrid component (2x2 layout: revenue, leads, conversions, pipeline)
- [ ] 9.4 Create TeamChart component using Chart.js (bar chart of sales by staff)
- [ ] 9.5 Create Leaderboard component showing top sales staff
- [ ] 9.6 Create InsightCards component (alert, warning, info styles)
- [ ] 9.7 Create PipelinePage with kanban-style columns (Prospect, Engaged, Booking, Won)
- [ ] 9.8 Create PipelineCard component for draggable lead cards
- [ ] 9.9 Implement drag-and-drop between pipeline columns
- [ ] 9.10 Create TargetsPage showing sales targets and progress
- [ ] 9.11 Create individual staff target cards with progress bars
- [ ] 9.12 Create ReportsPage with multiple chart views
- [ ] 9.13 Create WeeklyChart component (revenue trend over 7 days)
- [ ] 9.14 Create MonthlyChart component (monthly performance comparison)
- [ ] 9.15 Add report download/export functionality

## 10. Notifications
- [ ] 10.1 Create NotificationsPage with notification list
- [ ] 10.2 Create NotificationItem component (title, message, timestamp)
- [ ] 10.3 Implement notification filtering (unread, read, all)
- [ ] 10.4 Add unread badge counter on nav tab
- [ ] 10.5 Implement mark-as-read functionality
- [ ] 10.6 Create real-time notification listener using Supabase
- [ ] 10.7 Add notification toast/popup for incoming notifications
- [ ] 10.8 Implement notification sound alert
- [ ] 10.9 Add "clear all" functionality

## 11. PWA & Responsive
- [ ] 11.1 Configure service worker caching strategy (cache-first for assets, network-first for API)
- [ ] 11.2 Create offline fallback screen
- [ ] 11.3 Implement install prompt component for "Add to Home Screen"
- [ ] 11.4 Test responsive design on iPhone SE (375px width)
- [ ] 11.5 Test responsive design on iPad (768px width)
- [ ] 11.6 Implement safe area insets for notched phones
- [ ] 11.7 Ensure touch target minimum size (44x44px)
- [ ] 11.8 Test landscape orientation on mobile
- [ ] 11.9 Implement status bar color adaptation
- [ ] 11.10 Add viewport meta tags for proper scaling
- [ ] 11.11 Test font scaling and readability
- [ ] 11.12 Verify bottom nav doesn't overlap content on all devices

## 12. GitHub Actions CI/CD
- [ ] 12.1 Create .github/workflows/deploy.yml
- [ ] 12.2 Configure workflow to run on push to main branch
- [ ] 12.3 Add Node.js setup step with version 18+
- [ ] 12.4 Add npm install step
- [ ] 12.5 Add npm run build step for Vite
- [ ] 12.6 Configure deployment to gh-pages branch
- [ ] 12.7 Set GitHub Pages source to gh-pages branch in repo settings
- [ ] 12.8 Add environment secrets (VITE_SUPABASE_URL, VITE_SUPABASE_ANON_KEY)
- [ ] 12.9 Test deployment workflow on test branch
- [ ] 12.10 Verify deployed app is accessible at GitHub Pages URL

## 13. Testing & QA
- [ ] 13.1 Test full flow on iPhone Safari (login > catalog > booking > dashboard)
- [ ] 13.2 Test full flow on iPad Safari (tablet layout)
- [ ] 13.3 Test all filter combinations on catalog page
- [ ] 13.4 Test car detail gallery with all 5 views
- [ ] 13.5 Test payment calculator with various down payment/term combinations
- [ ] 13.6 Verify QR code generation and display
- [ ] 13.7 Test Chart.js rendering on mobile (team chart, weekly chart)
- [ ] 13.8 Test drag-and-drop on pipeline view (tablet-optimized)
- [ ] 13.9 Test cross-browser (Chrome desktop, Firefox, Safari)
- [ ] 13.10 Run Lighthouse PWA audit (target 90+ score)
- [ ] 13.11 Verify all navigation flows and back button behavior
- [ ] 13.12 Test auth flow (login, logout, session persistence)
- [ ] 13.13 Test offline mode with service worker
- [ ] 13.14 Verify notifications arrive in real-time
- [ ] 13.15 Test responsive images and lazy loading
- [ ] 13.16 Performance audit (First Contentful Paint, Largest Contentful Paint)
- [ ] 13.17 Test form validation and error messages
- [ ] 13.18 Test accessibility (keyboard nav, screen reader, contrast)
