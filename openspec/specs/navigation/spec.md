# Navigation Specification
## Toyota Dealer Sale Tool PWA

**Version:** 1.0  
**Status:** Active  
**Last Updated:** 2026-03-28  
**Format:** OpenSpec (Scenario-Based Requirements)

---

## Overview

Navigation architecture for Toyota Dealer Sale Tool PWA using React Router v6 with HashRouter (GitHub Pages compatibility). The app supports dual role-based dashboards (Sales/Manager) with role-aware routing, persistent browser history stack, and Thai+English localization in bottom navigation tabs.

---

## ADDED Requirements

### Navigation Architecture
- **Router Type:** React Router v6 with HashRouter for GitHub Pages deployment
- **Navigation Model:** Browser history stack with `goBack()` function
- **Tab Navigation:** 5 persistent bottom nav tabs with role-based home route
- **Internationalization:** Thai-English mixed navigation labels
- **Route Pattern:** Hash-based URLs (#/login, #/sales-dash, etc.)

### Role-Based Routing
- Login screen determines user role (Sales/Manager)
- Role-based home dashboard (s-sales-dash vs s-mgr-dash)
- Consistent bottom nav across all roles
- Role-specific screens (Manager: s-mgr-dash, s-pipeline, s-targets; Sales: s-sales-dash, s-calc)

### Navigation State Management
- Browser back button integration
- History stack preservation across screen transitions
- Deep linking support for direct URL access
- Session persistence for role and login state

---

## Routes & Screen Map

| Route | Screen ID | Screen Name | Role(s) | Nav Tab |
|-------|-----------|------------|---------|---------|
| /login | s-login | Login with Role Selection | All | None |
| /sales-dash | s-sales-dash | Sales Dashboard | Sales | หน้าหลัก (Home) |
| /mgr-dash | s-mgr-dash | Manager Dashboard | Manager | หน้าหลัก (Home) |
| /catalog | s-catalog | Car Catalog | All | รถยนต์ (Car) |
| /car-detail/:carId | s-car-detail | Car Detail View | All | - |
| /calc | s-calc | Payment Calculator | Sales | - |
| /leads | s-lead-detail | Lead Detail List | All | Leads |
| /lead/:leadId | s-lead-detail | Lead Detail (Single) | All | - |
| /acard | s-acard | A-Card Form | Sales | - |
| /booking | s-booking | Booking Flow (3-step) | Sales | - |
| /booking/review | s-booking | Step 1: Review | Sales | - |
| /booking/qr-payment | s-booking | Step 2: QR Payment | Sales | - |
| /booking/success | s-booking | Step 3: Success | Sales | - |
| /pipeline | s-pipeline | Pipeline Kanban | Manager | Leads |
| /targets | s-targets | Branch Targets | Manager | - |
| /reports | s-reports | Weekly Reports | All | รายงาน (Reports) |
| /notifications | s-notif | Notifications | All | - |
| /profile | - | Profile (Future) | All | โปรไฟล์ (Profile) |

---

## Screen Definitions

### Requirement: Login & Authentication
Authentication flow with role selection for Sales and Manager users.

#### Scenario: User Logs In
**WHEN** user navigates to /login  
**THEN** display s-login screen with:
- Username/password input fields
- Role radio buttons (Sales/Manager)
- "เข้าสู่ระบบ" (Login) button
- Form validation error messages

**WHEN** user selects role and submits form  
**THEN** 
- Validate credentials
- Store role in session state
- Navigate to role-appropriate dashboard (s-sales-dash for Sales, s-mgr-dash for Manager)
- Enable bottom navigation

---

### Requirement: Sales Role Navigation
Sales representatives access dashboards, car catalog, lead management, and booking flows.

#### Scenario: Sales User Navigates Dashboard
**WHEN** Sales user logs in with Sales role  
**THEN** 
- Navigate to /sales-dash (s-sales-dash screen)
- Display in "หน้าหลัก" (Home) tab as active
- Show featured car, hot leads, and quick action cards
- Display 5 bottom nav tabs

**WHEN** user taps "รถยนต์" (Car) tab  
**THEN** navigate to /catalog (s-catalog screen)

**WHEN** user taps "Leads" tab  
**THEN** navigate to /leads (s-lead-detail list view)

**WHEN** user taps "รายงาน" (Reports) tab  
**THEN** navigate to /reports (s-reports screen)

**WHEN** user taps "โปรไฟล์" (Profile) tab  
**THEN** display future profile screen (TBD)

#### Scenario: Sales User Browses Catalog
**WHEN** user opens /catalog (s-catalog)  
**THEN** display 3-level filter interface:
- Level 1: Car Type filter (e.g., Sedan, SUV, Truck)
- Level 2: Model filter (dependent on Type selection)
- Level 3: Budget filter

**WHEN** user selects Type > Model > Budget  
**THEN** filter car list and display matching vehicles

**WHEN** user taps on a car card  
**THEN** navigate to /car-detail/:carId (s-car-detail screen)

#### Scenario: Sales User Views Car Details
**WHEN** user opens /car-detail/:carId  
**THEN** display s-car-detail with:
- Image gallery (swipeable)
- Accordion-style specifications
- Key features list
- "คำนวณสินเชื่อ" (Calculate Loan) CTA button
- "จองรถ" (Book Car) CTA button

**WHEN** user taps "คำนวณสินเชื่อ" button  
**THEN** navigate to /calc (s-calc payment calculator)

**WHEN** user taps "จองรถ" button  
**THEN** navigate to /booking (s-booking flow) with car ID pre-filled

#### Scenario: Sales User Uses Payment Calculator
**WHEN** user opens /calc (s-calc)  
**THEN** display payment calculator with:
- Loan term selector (12, 24, 36, 48, 60 months)
- Down payment slider (0-100%)
- Monthly payment calculation display
- Total loan amount display
- "ดำเนินการจอง" (Proceed to Booking) button

**WHEN** user adjusts loan term or down payment  
**THEN** recalculate and update monthly payment in real-time

**WHEN** user taps "ดำเนินการจอง" button  
**THEN** navigate to /booking (s-booking) with loan parameters pre-filled

#### Scenario: Sales User Manages Leads
**WHEN** user taps "Leads" tab  
**THEN** navigate to /leads and display list of lead items with:
- Lead name
- Contact info
- Associated car (if any)
- Last interaction timestamp
- Lead status indicator

**WHEN** user taps on a lead item  
**THEN** navigate to /lead/:leadId (s-lead-detail) displaying:
- Lead timeline (interactions, notes, calls)
- Associated car information
- Action buttons (call, message, schedule, convert)

**WHEN** user taps "สร้างลีด" (Create Lead) button  
**THEN** navigate to /acard (s-acard form)

#### Scenario: Sales User Creates Lead via A-Card
**WHEN** user opens /acard  
**THEN** display s-acard form with fields:
- Full name
- Phone number
- Email
- Interested car model
- Budget range
- "บันทึกลีด" (Save Lead) button

**WHEN** user fills form and taps "บันทึกลีด"  
**THEN** 
- Validate required fields
- Create new lead in system
- Navigate back to /leads (s-lead-detail list)

#### Scenario: Sales User Completes Booking Flow
**WHEN** user navigates to /booking  
**THEN** display s-booking with 3-step flow:

**Step 1: Review (/booking/review)**
- Display selected car summary
- Show calculated loan terms
- List buyer information
- "ยืนยัน" (Confirm) button

**WHEN** user reviews and taps "ยืนยัน"  
**THEN** navigate to /booking/qr-payment (Step 2)

**Step 2: QR Payment (/booking/qr-payment)**
- Display QR code for payment
- Show payment amount
- Show payment deadline
- "ดูเสร็จแล้ว" (Payment Done) button

**WHEN** payment is scanned and completed externally  
**THEN** user taps "ดูเสร็จแล้ว"

**Step 3: Success (/booking/success)**
- Display booking confirmation message
- Show booking reference number
- Show next steps
- "กลับไปยังหน้าหลัก" (Return to Home) button

**WHEN** user taps return button  
**THEN** navigate to /sales-dash

---

### Requirement: Manager Role Navigation
Manager users access dashboards, KPI tracking, team insights, and reporting.

#### Scenario: Manager User Navigates Dashboard
**WHEN** Manager user logs in with Manager role  
**THEN** 
- Navigate to /mgr-dash (s-mgr-dash screen)
- Display in "หน้าหลัก" (Home) tab as active
- Show KPIs (sales count, targets, team performance)
- Show team performance chart
- Display 5 bottom nav tabs

**WHEN** user taps "รถยนต์" (Car) tab  
**THEN** navigate to /catalog (same s-catalog as Sales)

**WHEN** user taps "Leads" tab  
**THEN** navigate to /pipeline (s-pipeline kanban view)

**WHEN** user taps "รายงาน" (Reports) tab  
**THEN** navigate to /reports (s-reports screen)

#### Scenario: Manager Views Pipeline
**WHEN** user opens /pipeline (s-pipeline)  
**THEN** display kanban board with columns:
- New Leads
- Contacted
- Interested
- Negotiating
- Closed

**WHEN** manager views pipeline  
**THEN** display team leads organized by stage with:
- Lead name and contact info
- Associated car
- Days in current stage
- Team member assigned
- Drag-to-move functionality (if enabled)

**WHEN** manager taps on a lead card  
**THEN** navigate to /lead/:leadId (s-lead-detail) with manager view options

#### Scenario: Manager Views Branch Targets
**WHEN** user taps breadcrumb or navigates to /targets  
**THEN** display s-targets screen with:
- Monthly/quarterly sales target KPI
- Current progress bar
- Achievement percentage
- Team member contribution breakdown (chart)
- "รายละเอียด" (Details) button per team member

**WHEN** manager taps on team member row  
**THEN** display individual target details and progress

#### Scenario: Manager Views Reports
**WHEN** user taps "รายงาน" (Reports) tab  
**THEN** navigate to /reports (s-reports)

**WHEN** reports screen loads  
**THEN** display:
- Weekly sales summary chart
- Top performing sales staff
- Lead conversion metrics
- Car model popularity
- Revenue trend chart
- Export/print buttons

---

### Requirement: Shared Screens (All Roles)

#### Scenario: User Views Car Catalog
All users (Sales, Manager) can access /catalog with same experience:
- Display car list with Type > Model > Budget filters
- Tapping car navigates to /car-detail/:carId
- Back button returns to /catalog with filter state preserved

#### Scenario: User Views Notifications
**WHEN** user taps notification bell or navigates to /notifications  
**THEN** display s-notif with:
- Notification list (newest first)
- Notification type icons (message, alert, reminder)
- Timestamp for each notification
- "ทำเครื่องหมายอ่านแล้วทั้งหมด" (Mark All Read) button

**WHEN** user taps a notification  
**THEN** navigate to relevant screen based on notification type:
- Lead update → /lead/:leadId
- Car update → /car-detail/:carId
- Report ready → /reports

---

## Bottom Navigation Tabs

| Tab Order | Label (Thai) | Label (English) | Route |
|-----------|-------------|-----------------|-------|
| 1 | หน้าหลัก | Home | /sales-dash (Sales) or /mgr-dash (Manager) |
| 2 | รถยนต์ | Car | /catalog |
| 3 | - | Leads | /leads (Sales) or /pipeline (Manager) |
| 4 | รายงาน | Reports | /reports |
| 5 | โปรไฟล์ | Profile | (Future) |

---

## Navigation Patterns

### Requirement: Browser History Management
History stack preserved across all navigation transitions.

#### Scenario: User Navigates Back
**WHEN** user taps Android back button or browser back button  
**THEN** call `goBack()` function which:
- Navigate to previous screen in stack
- Preserve filter/scroll state if supported
- Return to /login if stack is empty (logout required)

#### Scenario: User Uses Bottom Tab Navigation
**WHEN** user taps a bottom nav tab  
**THEN** 
- Navigate to tab's route
- Add to history stack (unless already on that route)
- Update active tab indicator
- Do not duplicate history entry if already on route

#### Scenario: User Deep Links
**WHEN** user opens direct URL (e.g., #/car-detail/TCL001)  
**THEN** 
- Check authentication (redirect to /login if not authenticated)
- Render requested screen with URL parameters
- Initialize history stack with current screen

---

### Requirement: Screen-Specific Navigation

#### Scenario: Car Detail → Booking Flow
**WHEN** user taps "จองรถ" in /car-detail/:carId  
**THEN** 
- Navigate to /booking
- Pre-fill car ID, car details, and price
- Initialize booking flow at Step 1 (Review)

#### Scenario: Booking Flow → Payment
**WHEN** user taps "ยืนยัน" in /booking/review  
**THEN** 
- Validate booking data
- Navigate to /booking/qr-payment
- Generate QR code for payment

#### Scenario: Booking Success → Home
**WHEN** user completes /booking/success  
**THEN** 
- Clear booking session data
- Tap "กลับไปยังหน้าหลัก" returns to /sales-dash or /mgr-dash
- Add success toast notification

---

## Implementation Notes

### React Router v6 Configuration
```
<HashRouter>
  <Routes>
    <Route path="/login" element={<LoginScreen />} />
    <Route path="/sales-dash" element={<SalesDashboard />} />
    <Route path="/mgr-dash" element={<ManagerDashboard />} />
    <Route path="/catalog" element={<CatalogScreen />} />
    <Route path="/car-detail/:carId" element={<CarDetailScreen />} />
    <Route path="/calc" element={<PaymentCalculator />} />
    <Route path="/leads" element={<LeadListScreen />} />
    <Route path="/lead/:leadId" element={<LeadDetailScreen />} />
    <Route path="/acard" element={<ACardForm />} />
    <Route path="/booking" element={<BookingFlow />}>
      <Route path="review" element={<BookingReview />} />
      <Route path="qr-payment" element={<BookingQRPayment />} />
      <Route path="success" element={<BookingSuccess />} />
    </Route>
    <Route path="/pipeline" element={<PipelineScreen />} />
    <Route path="/targets" element={<TargetsScreen />} />
    <Route path="/reports" element={<ReportsScreen />} />
    <Route path="/notifications" element={<NotificationsScreen />} />
  </Routes>
  <BottomNavigation />
</HashRouter>
```

### Navigation Hook Usage
- `useNavigate()` for programmatic navigation
- `useParams()` to access URL parameters (e.g., :carId, :leadId)
- `useLocation()` to get current route and query params
- `useNavigate()` with negative index for back navigation: `navigate(-1)`

### Session State
- Store user role in Context API or Redux
- Preserve authentication state across navigation
- Clear sensitive data on logout

---

## Accessibility & Localization

### Navigation Labels
- Thai labels primary for top tabs
- English labels secondary (below or in tooltips)
- ARIA labels for screen readers
- Tab indices for keyboard navigation

### Keyboard Navigation
- Tab key cycles through bottom nav tabs
- Enter/Space to activate tab
- Back button accessible via keyboard
- Forms keyboard-accessible with proper focus management

---

## Testing Checklist

- [ ] All routes resolve with correct screen
- [ ] Role-based home route works (Sales → /sales-dash, Manager → /mgr-dash)
- [ ] Bottom nav tabs active state reflects current route
- [ ] Browser back button navigates through history
- [ ] Deep linking works for all routes
- [ ] Booking flow steps navigate in correct order
- [ ] Lead detail navigates from list with correct ID
- [ ] Car detail parameters load correct vehicle data
- [ ] Tab switching preserves scroll position (if applicable)
- [ ] No duplicate history entries on same route tap
- [ ] Logout clears history and returns to /login
- [ ] Mobile bottom nav responsive and accessible
- [ ] Thai/English labels display correctly

---

**Document Metadata**  
OpenSpec Format v2.0 | Scenario-Based Navigation Specification  
Author: Pre-Sale Engineering  
Owner: Toyota Dealer Sale Tool Project Team
