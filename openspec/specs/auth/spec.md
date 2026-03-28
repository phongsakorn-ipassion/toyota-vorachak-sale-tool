# Auth Specification: Toyota Dealer Sale Tool
**ระบบการยืนยันตัวตน**

Version: 1.0  
Last Updated: 2026-03-28  
Status: Draft  

---

## ADDED Requirements
Authentication system for Toyota Dealer Sale Tool enables role-based access with two distinct user types: Sales Staff (พนักงานขาย) and Managers (ผู้จัดการ). Integration with Supabase Auth provides secure email/password and magic link authentication. Row Level Security (RLS) policies ensure data isolation based on user roles and organizational hierarchy.

---

## AUTHENTICATION FLOW

### Requirement: Login Screen with Role Selection
Users select their role before authentication to enable role-based routing and interface personalization.

#### Scenario: Role Selection Grid Display
WHEN the user navigates to the login page  
THEN the screen displays a 2-column grid layout containing two role options:
- Column 1: Sales Staff (พนักงานขาย) with role icon, label, and subtitle "View your leads"
- Column 2: Manager (ผู้จัดการ) with role icon, label, and subtitle "Manage team pipeline"

#### Scenario: Role Selection State
WHEN the user clicks on a role option  
THEN the selected role displays highlighted state:
- Border color changes to #1B7A3F (Toyota Green)
- Background color changes to rgba(27, 122, 63, 0.08)
- Icon and text display active styling
- "Disabled" state styling for unselected option

#### Scenario: Role Persistence
WHEN the user selects a role  
THEN the selection persists across the login workflow  
AND the role value is passed to the authentication handler  
AND informs post-login routing decision

---

### Requirement: Login Button and Credentials Input
Primary action button enables email/password authentication flow after role selection.

#### Scenario: Login Button Styling
WHEN the user is on the login screen  
THEN the primary action button displays:
- Label: "เข้าสู่ระบบ" (Enter System)
- Background color: #1B7A3F (Toyota Green)
- Text color: #FFFFFF (White)
- Font weight: 600
- Padding: 12px 24px
- Border radius: 8px
- Hover state: #15623F (darker green)
- Disabled state: opacity 0.5 with cursor-not-allowed

#### Scenario: Email Input Field
WHEN the user enters credentials  
THEN the email input displays:
- Placeholder: "อีเมล / Email"
- Type: email with validation
- Required field indicator
- Error state: red border #DC2626 with error message

#### Scenario: Password Input Field
WHEN the user enters credentials  
THEN the password input displays:
- Placeholder: "รหัสผ่าน / Password"
- Type: password with masked input
- Show/hide toggle icon
- Required field indicator
- Minimum length validation: 8 characters

---

## SUPABASE AUTH INTEGRATION

### Requirement: Email/Password Authentication
Supabase Auth handles credential verification and session creation.

#### Scenario: Successful Authentication
WHEN the user submits valid email and password  
THEN Supabase Auth validates credentials  
AND creates a session with JWT token  
AND stores auth token in localStorage as `sb-[project-id]-auth-token`  
AND triggers post-login role-based routing

#### Scenario: Invalid Credentials
WHEN the user submits invalid email or password  
THEN Supabase Auth returns error  
AND error message displays: "อีเมลหรือรหัสผ่านไม่ถูกต้อง / Invalid email or password"  
AND form remains on login screen  
AND password field clears for security

#### Scenario: Account Not Found
WHEN the user submits an unregistered email  
THEN Supabase Auth returns user_not_found error  
AND message displays: "ไม่พบบัญชีผู้ใช้ / User account not found"  
AND prompt suggests creating account or using magic link

---

### Requirement: Magic Link Authentication (Optional)
Alternative passwordless authentication method for user convenience.

#### Scenario: Magic Link Request
WHEN the user clicks "Send Magic Link" option  
THEN system captures email address  
AND Supabase sends magic link to registered email  
AND confirmation message displays: "ลิงก์ได้ถูกส่งไปยังอีเมลของคุณ / Magic link sent to your email"

#### Scenario: Magic Link Verification
WHEN the user clicks magic link in email  
THEN system extracts token from URL parameter  
AND Supabase Auth verifies token validity  
AND creates session automatically  
AND redirects to role-based dashboard

---

## ROLE-BASED ROUTING

### Requirement: Login Route Resolution
Post-authentication routing directs users to appropriate dashboard based on selected role.

#### Scenario: Sales Staff Routing
WHEN a Sales user (role: "sales") successfully authenticates  
THEN system redirects to: `/s-sales-dash`  
AND interface displays Sales Dashboard with:
- Personal lead list
- Lead interaction history
- Sales targets for assigned leads
- Lead status updates

#### Scenario: Manager Routing
WHEN a Manager user (role: "manager") successfully authenticates  
THEN system redirects to: `/s-mgr-dash`  
AND interface displays Manager Dashboard with:
- Branch pipeline overview
- Team member performance
- Team targets and KPIs
- Lead distribution controls
- Team management features

#### Scenario: Role Mismatch Redirect
WHEN a user attempts to access a protected route not matching their role  
THEN system redirects to appropriate dashboard for their role  
AND displays: "ไม่สามารถเข้าถึงหน้าได้ / Page access denied"

---

## SESSION MANAGEMENT

### Requirement: Session Persistence
Authentication tokens maintain user sessions across page reloads and application closures.

#### Scenario: Token Storage
WHEN authentication succeeds  
THEN JWT token stores in localStorage:
- Key: `sb-[project-id]-auth-token`
- Value: JWT token with 1-hour expiry
- Path: accessible to entire application domain

#### Scenario: Session Restoration
WHEN the user reopens the application  
THEN system checks localStorage for valid token  
AND Supabase Auth validates token with server  
AND automatically logs user in if token valid  
AND bypasses login screen for existing sessions

#### Scenario: Token Refresh
WHEN JWT token approaches expiry (< 5 minutes remaining)  
THEN Supabase Auth automatically refreshes token  
AND updates localStorage with new token  
AND maintains uninterrupted session

#### Scenario: Session Expiry
WHEN JWT token expires (> 1 hour old)  
THEN localStorage token is cleared  
AND user is redirected to login screen  
AND message displays: "เซสชั่นหมดอายุ / Session expired"

---

## DEMO MODE & DEVELOPMENT

### Requirement: Demo Bar Interface
Development and demo environments display control bar for testing role-based features.

#### Scenario: Device Switcher
WHEN demo mode is active  
THEN demo bar includes device switcher:
- Options: iPhone (390px) / iPad (768px) / Desktop (1024px)
- Current selection highlighted
- Viewport immediately resizes on selection
- Responsive layout updates accordingly

#### Scenario: Role Switcher
WHEN demo mode is active  
THEN demo bar includes role switcher:
- Options: Sales (พนักงานขาย) / Manager (ผู้จัดการ)
- Current role displays with badge
- Clicking role option updates Supabase user metadata
- Dashboard content updates immediately without page reload

#### Scenario: Demo Mode Visibility
WHEN application runs in development environment  
THEN demo bar displays at top of screen:
- Background: rgba(27, 122, 63, 0.1)
- Border-bottom: 1px #1B7A3F
- Fixed positioning above all content
- Clear label: "Demo Mode - Testing Only"
- Easily toggleable to show/hide

---

## ROW LEVEL SECURITY (RLS)

### Requirement: Sales User Data Isolation
Supabase RLS policies restrict sales users to access only their own leads and interactions.

#### Scenario: Sales User Lead Access
WHEN a Sales user queries the `leads` table  
THEN Supabase RLS policy allows SELECT only where:
- `assigned_to_user_id = auth.uid()` (user's own leads)
- Status is active or in-progress
- Created timestamp within last 90 days

#### Scenario: Sales User Cannot View Other Sales Data
WHEN a Sales user attempts to query leads assigned to other sales staff  
THEN Supabase RLS policy denies access  
AND returns empty result set  
AND no error message is displayed (silent denial)

#### Scenario: Sales User Cannot Modify Others' Leads
WHEN a Sales user attempts to UPDATE or DELETE leads not assigned to them  
THEN Supabase RLS policy blocks modification  
AND returns: "You do not have permission to update this record"

---

### Requirement: Manager Data Access
Supabase RLS policies allow managers full visibility of branch data and team metrics.

#### Scenario: Manager Views All Branch Leads
WHEN a Manager queries the `leads` table  
THEN Supabase RLS policy allows SELECT where:
- `branch_id = auth.user_metadata.branch_id` (same branch)
- No lead-level restrictions
- Access to historical data (no date filter)

#### Scenario: Manager Modifies Team Lead Assignments
WHEN a Manager updates lead assignment  
THEN Supabase RLS policy allows UPDATE where:
- `branch_id = auth.user_metadata.branch_id`
- Only `assigned_to_user_id` field can be modified (not lead details)
- Audit log captures modification with manager ID and timestamp

#### Scenario: Manager Cannot Access Other Branch Data
WHEN a Manager attempts to query leads from different branch  
THEN Supabase RLS policy denies access  
AND returns empty result set  
AND application displays: "ไม่มีสิทธิ์เข้าถึงข้อมูล / Insufficient permissions"

---

## PROTECTED ROUTES

### Requirement: Manager-Only Screens
Pipeline, targets, and team management screens are accessible only to managers.

#### Scenario: Pipeline Screen Access Control
WHEN a Sales user navigates to `/s-pipeline`  
THEN system checks user role from JWT token  
AND denies access if role !== "manager"  
AND redirects to `/s-sales-dash`  
AND displays: "หน้านี้สำหรับผู้จัดการเท่านั้น / This page is for managers only"

#### Scenario: Targets Screen Access Control
WHEN a Sales user navigates to `/s-targets`  
THEN system checks user role from JWT token  
AND denies access if role !== "manager"  
AND redirects to `/s-sales-dash`  
AND displays toast notification: "ไม่มีสิทธิ์เข้าถึง / Access denied"

#### Scenario: Team Management Screen Access Control
WHEN a Sales user navigates to `/s-team-mgmt`  
THEN system checks user role from JWT token  
AND denies access if role !== "manager"  
AND redirects to `/s-sales-dash`  
AND logs unauthorized access attempt in audit log

#### Scenario: Manager Full Access
WHEN a Manager navigates to any protected route  
THEN system verifies role = "manager"  
AND allows full access to all dashboards and controls  
AND no redirects or permission messages display

---

## SECURITY CONSIDERATIONS

### Requirement: Token Security
Auth tokens are handled securely to prevent exposure or theft.

#### Scenario: HttpOnly Cookie Option
WHEN Supabase Auth is configured with httpOnly cookies  
THEN tokens are not accessible to JavaScript  
AND CSRF protection is enabled  
AND credentials: include for cross-origin requests

#### Scenario: Logout and Token Cleanup
WHEN user clicks logout button  
THEN system calls Supabase Auth.signOut()  
AND removes token from localStorage  
AND clears session state in application  
AND redirects to login screen  
AND displays: "ออกจากระบบสำเร็จ / Logged out successfully"

### Requirement: Password Requirements
Supabase Auth enforces password security standards.

#### Scenario: Password Policy
WHEN user creates account or resets password  
THEN Supabase enforces:
- Minimum length: 8 characters
- Must contain: uppercase, lowercase, number, special character (recommended)
- No dictionary words or common patterns
- Error messages guide user on requirements

---

## ERROR HANDLING

### Requirement: Authentication Error Messages
Clear, user-friendly error messages guide users through authentication issues.

#### Scenario: Network Error
WHEN authentication request fails due to network issue  
THEN system displays: "เชื่อมต่ออินเทอร์เน็ตไม่ได้ / Network connection error"  
AND provides "Retry" button  
AND logs error to monitoring service

#### Scenario: Server Error
WHEN Supabase Auth service is unavailable  
THEN system displays: "ระบบไม่พร้อมใช้งาน / Service temporarily unavailable"  
AND disables login form  
AND provides "Try Again" button  
AND logs error with timestamp

#### Scenario: Rate Limiting
WHEN user exceeds login attempts (5+ in 15 minutes)  
THEN Supabase enforces rate limit  
AND displays: "พยายามเกินจำนวน / Too many attempts. Try again later."  
AND disables login form for 15 minutes  
AND shows countdown timer

---

## INTEGRATION REQUIREMENTS

### Requirement: Supabase Project Configuration
Application requires specific Supabase configuration for authentication.

#### Scenario: Environment Variables
WHEN application starts  
THEN environment variables must be configured:
- `NEXT_PUBLIC_SUPABASE_URL`: project URL
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`: anonymous key for public access
- `SUPABASE_SERVICE_ROLE_KEY`: service role key for backend (never expose)

#### Scenario: Supabase Client Initialization
WHEN application initializes  
THEN Supabase client is created with:
```javascript
const supabase = createClient(supabaseUrl, supabaseAnonKey)
```
AND auth state listener is attached:
```javascript
supabase.auth.onAuthStateChange((event, session) => {...})
```

---

## ACCESSIBILITY & COMPLIANCE

### Requirement: Login Form Accessibility
Authentication interface meets WCAG 2.1 AA standards.

#### Scenario: Keyboard Navigation
WHEN user navigates login form with keyboard  
THEN all interactive elements are focusable in logical order:
1. Role selection buttons
2. Email input field
3. Password input field
4. Login button
5. Magic link toggle (if present)
- Visual focus indicator displays (outline 2px #1B7A3F)
- Tab order follows visual layout

#### Scenario: Screen Reader Support
WHEN screen reader user navigates login form  
THEN elements include proper labels and ARIA attributes:
- `<label htmlFor="email">` for email input
- `<label htmlFor="password">` for password input
- `role="group"` for role selection grid
- `aria-pressed` for selected role button
- `aria-describedby` for error messages

---

