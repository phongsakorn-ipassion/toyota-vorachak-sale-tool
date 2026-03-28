# Booking-Payment Spec — Toyota Sale Tool
**OpenSpec Format** | v1.0 | 2026-03-28
*ระบบการจองรถและชำระเงิน สำหรับ Toyota Dealer Sale Tool*

---

## Overview

The **Booking-Payment** system is the transactional flow that converts customer interest (from car catalog browsing) into confirmed reservations. It encompasses three phases: **(1) Payment Calculator** (upfront financing estimation), **(2) 3-Step Booking Journey** (booking creation, payment initiation, confirmation), and **(3) Booking Confirmation** (success & reference). The system uses interactive sliders, QR code payment via PromptPay, countdown timers, and progressive disclosure to guide users through a frictionless booking experience.

**Primary Audience:** Customers (mobile/web), Sales staff (iPad)
**Context:** Post car selection → booking confirmation → payment initiation

---

## ## ADDED Requirements

### Requirement: Payment Calculator Component
The calculator module provides real-time loan/financing visualization for the selected car:

#### Data Model & Inputs
- **Loan Amount:** Base price = ฿909,000 (Corolla base reference; varies by car selected)
- **Down Payment Slider:** 0–50% of vehicle price; user-adjustable via slider or numeric input
- **Term Selection:** 4 button options (48, 60, 72, 84 months); `.term-btn` with `.on` active state
- **Interest Rate:** Fixed 2.49% per annum (hardcoded; configurable in admin)

#### Formula & Calculation
**Monthly Payment Formula:**
```
Monthly = Loan × r × (1+r)^n / ((1+r)^n - 1)

Where:
  Loan = Price − Down Payment
  r = (Interest Rate ÷ 12) ÷ 100  [convert annual % to monthly decimal]
  n = Loan Term in Months
```

**Example Calculation (Corolla Base):**
```
Price: ฿909,000
Down: 30% = ฿272,700
Loan: ฿636,300
Rate: 2.49% annual = 0.2075% monthly = 0.002075 decimal
Term: 60 months

Monthly = 636,300 × 0.002075 × (1.002075)^60 / ((1.002075)^60 − 1)
        ≈ ฿11,450 per month
```

#### Display Components

**Slider:**
- Horizontal slider; range 0–50; displays current %
- Label: "ดาวน์พেมนท์ / Down Payment"
- Displays both percentage (e.g., "30%") and amount (e.g., "฿272,700")
- Real-time update on drag

**Term Buttons:**
```
[48]  [60]  [72]  [84]
```
- Each button labeled with month count
- `.term-btn` class for styling
- `.on` state (e.g., `btn.on` or `btn--active`) when selected
- Default selected: 60 months
- Visual feedback: color change or border highlight (e.g., Tailwind `ring-2 ring-blue-600`)

**Hero Card (Green Payment Display):**
```
┌─────────────────────────────┐
│  Monthly Payment            │
│  ฿11,450                    │  (large, bold, green)
│  ────────────────────────   │
│  Down Payment:  ฿272,700    │  (secondary info)
│  Financing:     ฿636,300    │
│  Term:          60 months   │
└─────────────────────────────┘
```
- **Colors:** Light green background (e.g., `bg-green-50`); text in dark green (`text-green-700`)
- **Layout:** Centered, card-style with rounded corners & shadow
- **Updates:** Real-time as slider/buttons change
- **Typography:** Monthly amount in 32px bold; details in 14px regular

#### Scenario: Calculate monthly payment
**WHEN** user opens calculator for Corolla (฿909,000)
**THEN** default values appear: Down 0%, Term 60 months
**AND** initial Monthly = ฿16,000 (approx; no down payment)
**AND** slider defaults to 0%, displays "฿0"
**WHEN** user drags slider to 30%
**THEN** Down Payment updates to "฿272,700"
**AND** Loan reduces to "฿636,300"
**AND** Monthly recalculates to "฿11,450"
**AND** display updates without lag (debounced at 50ms)

#### Scenario: Change loan term
**WHEN** user clicks "84" month button
**THEN** button shows `.on` active state
**AND** Monthly Payment recalculates (term extends → lower monthly)
**AND** example: 84 months → ฿8,650/month (approx)

---

### Requirement: 3-Step Booking Journey — Step 1 (bstep-1)

**Route:** `/booking/step1` or modal overlay
**Context:** User has selected car from catalog; calculator open or closed

#### Progress Bar
```
1 ●───── 2 ○───── 3 ○
(Booking Info)
```
- Three circles: 1, 2, 3
- Current step highlighted in **green** (● filled or bold)
- Completed steps: lighter fill or checkmark
- Separator lines between circles
- Visual indicator of progress (small, top of screen or card header)

#### Booking Details Card
Displays pre-filled information about the car, dealership, and sales interaction:

```
┌────────────────────────────┐
│  Booking Details           │
├────────────────────────────┤
│ Car:         Corolla Altis │
│ Branch:      Bangkok Store │
│ Date:        28 Mar 2026   │
│ Sales Person: John Smith   │
└────────────────────────────┘
```

**Data Mapping:**
| Label | Source | Notes |
|-------|--------|-------|
| Car | Selected car name | From catalog selection |
| Branch | User's current dealership | From app context or user profile |
| Date | Today's date | ISO format or localized Thai |
| Sales Person | Current login or session | From staff login; "Guest" if customer-initiated |

**Styling:**
- Card container with light gray background (`bg-gray-50`)
- 2-column layout: labels on left, values on right
- Responsive: Stack vertically on mobile (<768px)

#### Payment Method Selector
Three payment options presented as horizontal pills or cards:

```
[icon] QR PromptPay          [icon] โอนเงิน/Transfer    [icon] บัตรเครดิต/Credit Card
   (Pay Now)                    (Bank Transfer)               (Credit Card)
```

**Options:**
1. **QR PromptPay** — "สร้าง QR / Generate QR"
   - Class: `.pay-method`; active state: `.on`
   - Image/icon: QR code symbol or PromptPay logo

2. **โอนเงิน (Bank Transfer)** — Manual bank deposit
   - Label: "โอนเงิน" (Transfer)
   - Shows account details on Step 2 (fallback if QR unavailable)

3. **บัตรเครดิต (Credit Card)** — Card payment (future; disabled in v1.0)
   - Label: "บัตรเครดิต"
   - Icon: Credit card symbol
   - State: Disabled/grayed (v1.0 scope)

**Selection Behavior:**
- `.pay-method.on` indicates active selection
- Click to toggle selection
- QR PromptPay selected by default
- Only one method selectable at a time

#### Primary Button
**Label:** "สร้าง QR / Generate QR"
**Action:** Advance to Step 2 (generate QR code or display transfer details)
**Style:** Primary color (blue); full width on mobile, 50% on desktop
**State:** Disabled if no payment method selected
**Text:** Thai + English (if space permits, or tooltip)

#### Scenario: Select payment method and proceed
**WHEN** user lands on Step 1
**THEN** Booking Details auto-populate
**AND** QR PromptPay is selected by default
**AND** "Generate QR" button is enabled
**WHEN** user clicks "Generate QR" button
**THEN** system advances to Step 2
**AND** QR code is generated via Google Charts API
**AND** countdown timer starts (15 minutes)

---

### Requirement: 3-Step Booking Journey — Step 2 (bstep-2)

**Route:** `/booking/step2` or modal
**Context:** Payment method confirmed; QR code generation triggered

#### QR Code Display
**QR Generation:**
```
URL: https://chart.googleapis.com/chart?cht=qr&chs=200x200&chl=[payload]
```

**Payload Construction:**
- Encode booking reference + amount + merchant ID
- Standard format: `[Booking-ID]|[Amount]|[Merchant]`
- Example: `BK202603280001|45000|TOYOTA_DEALER_BKK`

**Rendering:**
```
┌─────────────────────────────┐
│                             │
│        [QR CODE 200×200]    │
│        Generated via        │
│        Google Charts API    │
│                             │
└─────────────────────────────┘
```

**QR Wrapper Styling:**
- White background (`bg-white`)
- Rounded corners (12px border-radius)
- Box shadow (subtle, e.g., Tailwind `shadow-lg`)
- Padding: 24px
- Centered in card container

#### Amount Display
```
Amount Due
฿45,000
(Green, large, bold)
```

**Styling:**
- Font size: 32px–40px bold
- Color: Green (`text-green-700`)
- Positioned above QR code or in separate info section
- Currency symbol (฿) required

#### 15-Minute Countdown Timer
```
Payment Expires In
13:45
(Orange / Red alert color)
```

**Implementation:**
- Displays MM:SS format (e.g., "13:45" → 13 minutes 45 seconds)
- Countdown interval: Updates every 1 second
- Color: Orange initially (`text-orange-500`), changes to Red (`text-red-600`) at <3 minutes
- Label: "Payment Expires In" or "Time Remaining"
- Behavior: Once timer reaches 0:00, payment invalidates; prompt to regenerate QR

**Code Pattern (JavaScript):**
```javascript
const startTime = Date.now();
const duration = 15 * 60 * 1000;  // 15 minutes in ms

const interval = setInterval(() => {
  const elapsed = Date.now() - startTime;
  const remaining = duration - elapsed;

  if (remaining <= 0) {
    clearInterval(interval);
    // QR expired; show "regenerate" prompt
    return;
  }

  const minutes = Math.floor(remaining / 60000);
  const seconds = Math.floor((remaining % 60000) / 1000);

  timerDisplay.textContent = `${minutes}:${seconds.toString().padStart(2, '0')}`;

  // Update color at 3-minute threshold
  if (remaining < 3 * 60 * 1000) {
    timerDisplay.classList.add('text-red-600');
  }
}, 1000);
```

#### Alternative Payment Info (Bank Transfer)
If user selected "โอนเงิน" on Step 1, display:

```
Bank Transfer Details
───────────────────
Bank Name:     Kasikornbank
Account Name:  Toyota Dealer Co., Ltd.
Account No.:   111-2-22222-2
Branch:        Bangkok
Amount:        ฿45,000

(Copy buttons or read-only text)
```

- Static display (not behind Step 2 QR)
- Copy-to-clipboard functionality (optional)
- Appears in secondary card or collapsed section

#### Confirmation Button
**Label:** "ยืนยันชำระเงิน / Confirm Payment"
**Action:**
- Verify payment receipt from PromptPay gateway (webhook/polling)
- OR accept manual confirmation (staff enters receipt number)
- Advance to Step 3 on success

**Disabled State:**
- Button remains disabled until payment confirmed OR user manually confirms
- Optional: Show "Waiting for payment..." status message

#### Scenario: Scan QR and confirm payment
**WHEN** user enters Step 2
**THEN** QR code displays (200×200px, Google Charts)
**AND** Amount shows "฿45,000" in green
**AND** Countdown timer starts: "15:00"
**WHEN** user scans QR with mobile banking app
**THEN** system detects payment via PromptPay webhook (or staff confirms manually)
**AND** "Confirm Payment" button enables
**WHEN** user clicks "Confirm Payment" (or system auto-confirms)
**THEN** advance to Step 3

#### Scenario: Payment times out
**WHEN** countdown timer reaches "0:00"
**THEN** QR code fades or shows overlay "QR Code Expired"
**AND** button changes to "Generate New QR"
**WHEN** user clicks button
**THEN** new QR generated; timer restarts

---

### Requirement: 3-Step Booking Journey — Step 3 (bstep-3)

**Route:** `/booking/step3` or final modal
**Context:** Payment confirmed; booking finalized

#### Success Animation
```
     ╭─────╮
     │  ✓  │  (Green checkmark in circle)
     ╰─────╯

     Spinning/bouncing animation on first load (1–1.5s)
     Then static display
```

**Styling:**
- Green circle background (`bg-green-500` or `bg-green-600`)
- White checkmark (SVG or Unicode ✓)
- Size: 60px–80px diameter
- Animation: CSS `@keyframes` (scale-up or bounce)
- Positioned at top-center of card

#### Success Title
```
จองสำเร็จ!
(Booking Successful!)
```

**Styling:**
- Font size: 28px–32px bold
- Color: Dark gray or green (`text-gray-800` or `text-green-800`)
- Centered below checkmark
- Margin top: 16px

#### Booking Reference Number
```
Reference Number
BK-202603-280001

(Monospace font, copyable)
```

**Data Mapping:**
- Format: `BK-YYYYMM-######` (auto-generated by backend)
- Style: Monospace font (e.g., `font-mono`)
- Optional: Copy-to-clipboard button (📋 icon)
- QR code of reference (optional, secondary)

#### Progress Bar (Final State)
```
1 ✓───── 2 ✓───── 3 ●
(All steps complete; Step 3 highlighted green)
```

- All 3 circles filled or checked (✓)
- Or: Circles 1–2 show checkmarks; Circle 3 highlighted green (●)
- Visual confirmation of completion

#### Next Steps Card
A timeline card displaying post-booking actions:

```
Next Steps
────────────────────────────
✓ Booking Confirmed
  Reference: BK-202603-280001

→ Dealership Contact (Within 2 hours)
  Sales staff will call/SMS to confirm details

→ Payment Settlement (Within 24 hours)
  Balance due: ฿[remaining amount]
  Contact: [dealer phone] / [dealer email]

→ Document Signing & Delivery
  Visit branch to finalize paperwork
  Estimated: 3–5 business days
```

**Timeline Item Format:**
- Icon (checkmark, arrow, or number: ①②③)
- Title (localized Thai label)
- Description/details (1–2 lines)
- Estimated timeframe (if applicable)
- Optional: Expandable details or contact info

**Styling:**
- Vertical timeline layout (left border with colored dots/lines)
- Cards or rows for each step
- Icons left-aligned; text right-aligned
- Secondary text color (`text-gray-600`) for descriptions

#### Back to Home Button
**Label:** "กลับหน้าแรก / Back to Home"
**Action:** Navigate to catalog list view (`/catalog` or `/`)
**Style:** Secondary button (`bg-gray-100 text-gray-800`); full width on mobile
**Placement:** Bottom of card

#### Scenario: View booking confirmation
**WHEN** Step 3 loads
**THEN** checkmark animation plays (1.5s)
**AND** "จองสำเร็จ!" title displays
**AND** Reference number shows "BK-202603-280001"
**AND** Progress bar shows all 3 steps complete (✓✓●)
**AND** Next Steps card outlines post-booking timeline
**WHEN** user clicks "Back to Home"
**THEN** navigate to catalog

---

### Requirement: Booking Confirm (Legacy Success Screen)

**Route:** `/booking/confirm` (alternate endpoint; used in v0.x or fallback)
**Context:** Legacy booking flow completion

#### Layout
```
┌──────────────────────────────┐
│                              │
│        ✓ (checkmark icon)    │  (centered, large green)
│                              │
│   Booking Successful!        │  (title)
│                              │
│   Booking Number             │  (label)
│   BK-202603-280001           │  (monospace reference)
│                              │
│──────────────────────────────│
│                              │
│   Booking Details            │  (summary card)
│   ─────────────────          │
│   Car:        Corolla Altis  │
│   Branch:     Bangkok Store  │
│   Date:       28 Mar 2026    │
│   Sales Pers: John Smith     │
│   Down Pmnt:  ฿272,700       │
│   Financing:  ฿636,300       │
│   Term:       60 months      │
│                              │
│        [Back Home]           │
└──────────────────────────────┘
```

#### Check Icon
- Large green checkmark (✓) or circle with checkmark
- Size: 60px–80px
- Color: Green (`text-green-600`)
- No animation (static display)

#### Title
**Text:** "Booking Successful!" (English) or "จองสำเร็จ!" (Thai)
**Style:** 24px–28px bold; center-aligned

#### Booking Number Display
```
Booking Number
BK-202603-280001
```
- Label: "Booking Number" (smaller text; gray)
- Value: Reference (monospace, bold)
- Copyable (optional)

#### Detail Rows
Key-value pairs in a card or table:

| Field | Value |
|-------|-------|
| Car | Corolla Altis |
| Branch | Bangkok Store |
| Date | 28 Mar 2026 |
| Sales Person | John Smith |
| Down Payment | ฿272,700 |
| Financing | ฿636,300 |
| Term | 60 months |

**Styling:**
- 2-column layout (label / value)
- Light gray background card (`bg-gray-50`)
- Borders or subtle dividers between rows
- Right-align values

#### Back Home Button
**Label:** "Back Home" or "Back to Catalog"
**Action:** Navigate to `/catalog` or home
**Style:** Primary button

#### Scenario: Legacy confirmation flow
**WHEN** user completes payment (legacy v0.x flow)
**THEN** redirect to `/booking/confirm`
**AND** check icon displays
**AND** booking number and details shown
**WHEN** user clicks "Back Home"
**THEN** navigate to catalog

---

### Requirement: Data Model & State Management

#### Booking State Structure
```javascript
{
  // Session & Context
  sessionId: string,        // Unique session ID
  userId: string | null,    // Customer or staff user ID
  carId: string,            // Selected car from catalog
  branchId: string,         // Dealership branch
  timestamp: ISO8601,       // Booking creation time

  // Booking Details
  bookingRef: string,       // BK-YYYYMM-######
  carName: string,          // e.g., "Corolla Altis"
  carPrice: number,         // Base price in THB
  salesPerson: string,      // Staff name or "Guest"

  // Payment Calculator
  downPaymentPercent: 0–50, // 0–50%
  downPaymentAmount: number,
  loanAmount: number,       // price - down
  loanTerm: 48|60|72|84,    // months
  interestRate: 2.49,       // % annual
  monthlyPayment: number,   // Calculated

  // Payment Method
  paymentMethod: "qr-promptpay" | "bank-transfer" | "credit-card",

  // QR Code / Transaction
  qrCode: string,           // Google Charts URL
  qrPayload: string,        // Encoded booking + amount
  qrGeneratedAt: ISO8601,
  qrExpiresAt: ISO8601,     // generatedAt + 15 min
  paymentStatus: "pending" | "confirmed" | "failed",
  transactionId: string,    // PromptPay ref (if payment confirmed)

  // Workflow State
  currentStep: 1 | 2 | 3,
  step1Complete: boolean,
  step2Complete: boolean,
  step3Complete: boolean,

  // Errors & Messages
  errorMessage: string | null,
  successMessage: string | null
}
```

#### State Management Tool
- **Framework:** Zustand 4 (per tech stack)
- **Store:** `useBookingStore` with slices:
  - `booking` (main booking object)
  - `calculator` (down%, term, monthly calc)
  - `ui` (currentStep, loading, error)
  - `actions` (setDownPayment, selectTerm, generateQR, confirmPayment, etc.)

#### Supabase Tables
1. **bookings** table:
   - Columns: id, session_id, user_id, car_id, branch_id, booking_ref, car_name, car_price, sales_person, down_payment_pct, down_payment_amt, loan_amt, loan_term, interest_rate, monthly_payment, payment_method, payment_status, transaction_id, created_at, updated_at

2. **qr_codes** table:
   - Columns: id, booking_id, qr_payload, qr_url, generated_at, expires_at, status

3. **payment_transactions** table:
   - Columns: id, booking_id, transaction_ref, amount, status, gateway_response, created_at, confirmed_at

---

### Requirement: QR Code & PromptPay Integration

#### QR Generation
**Provider:** Google Charts API (free, no authentication needed)

**Endpoint:**
```
GET https://chart.googleapis.com/chart?cht=qr&chs=WIDTHxHEIGHT&chl=PAYLOAD
```

**Parameters:**
- `cht=qr` → Chart type (QR code)
- `chs=200x200` → Size (width × height in pixels; e.g., 200×200)
- `chl=[payload]` → Data to encode (URL-encoded string)

**Payload Example:**
```
BK-202603-280001|45000|TOYOTA_DEALER_BKK
```

**Full URL Example:**
```
https://chart.googleapis.com/chart?cht=qr&chs=200x200&chl=BK-202603-280001%7C45000%7CTOYOTA_DEALER_BKK
```

**Rendering:**
```html
<img
  src="https://chart.googleapis.com/chart?cht=qr&chs=200x200&chl=..."
  alt="PromptPay QR Code"
  className="w-48 h-48 rounded-lg"
/>
```

#### PromptPay Integration (Future / Phase 2)
- **Provider:** Bank of Thailand's PromptPay gateway (via payment provider SDK)
- **Webhook:** Receive payment confirmation to update `paymentStatus` to "confirmed"
- **v1.0 Scope:** Display QR only; manual confirmation or staff-entered receipt
- **v1.1+:** Auto-detect payment via Krungsri / Kasikornbank APIs

#### Bank Transfer Details (Fallback)
Hardcoded or configurable in admin:
```javascript
bankTransfer: {
  bankName: "Kasikornbank",
  accountName: "Toyota Dealer Co., Ltd.",
  accountNumber: "111-2-22222-2",
  branch: "Bangkok",
  swiftCode: "KASITHBK"
}
```

#### Scenario: Generate and display QR
**WHEN** user advances to Step 2 after confirming payment method
**THEN** backend generates booking reference "BK-202603-280001"
**AND** creates QR payload: "BK-202603-280001|45000|TOYOTA_BKK"
**AND** constructs Google Charts URL with encoded payload
**AND** frontend displays `<img>` tag with QR
**AND** timer starts: expires in 15 minutes

---

### Requirement: Responsive Design & Mobile Optimization

#### Breakpoints
- **Mobile (< 640px):** Single column; full-width cards
- **Tablet (640px–1024px):** 2-column layout (optional); adjusted card widths
- **Desktop (> 1024px):** Centered card (max-width 600px); centered on screen

#### Mobile-Specific UX
```
Mobile Layout (390px):
─────────────────────
│ Progress: 1 ● 2 ○ 3 ○
│
│ [Card: Booking Details]
│ [Card: Payment Methods]
│
│ [Full-width Button: Generate QR]
│
```

- Single column; cards stack vertically
- Progress bar wraps text (horizontal dots only)
- Buttons full-width with adequate touch targets (44px+ height)
- Padding: 16px sides; 12px between components

#### Tablet Layout (768px)
- Cards side-by-side (optional; payment method + booking details)
- Progress bar horizontal with more spacing
- Button width 50% or full-width (context-dependent)

#### Landscape Mobile (e.g., iPhone landscape)
- QR code centered with reduced size
- Timer & amount above QR
- Scrollable content if needed

#### Scenario: Book on mobile
**WHEN** user opens booking flow on 390px mobile
**THEN** Step 1 shows stacked cards (details + methods)
**WHEN** proceed to Step 2
**THEN** QR displays at ~200×200px; vertically centered
**AND** timer + amount stack above QR
**WHEN** Step 3
**THEN** checkmark + title + ref + details all readable in portrait

---

### Requirement: Accessibility & Localization

#### Accessibility
- **Color Contrast:** All text ≥ 4.5:1 ratio (WCAG AA)
- **Focus States:** Keyboard-navigable buttons with `:focus` ring
- **ARIA Labels:** Buttons have `aria-label` (e.g., "Select 60 month term")
- **Alt Text:** QR image has `alt="PromptPay QR Code"`
- **Timer:** Aria-live region announces "Payment expires in 13:45"
- **Form Fields:** Labels associated with `<input>` (down payment slider)

**Keyboard Navigation:**
- Tab through buttons (Term, Payment Method, Primary CTA)
- Enter to activate buttons
- Escape to cancel (optional; varies by implementation)

#### Localization (Thai + English Mix)
- **Primary:** Thai language for labels & buttons
- **Secondary:** English in parentheses (optional, for clarity)
- **Number Formatting:** Thai baht symbol (฿), comma thousands separator
  - Example: "฿636,300" (not "636300")
- **Date Format:** "28 Mar 2026" or "28/03/2026" (Thai context may prefer Thai Buddhist Era)
- **Time:** 24-hour clock; HH:MM format (e.g., "13:45")

**UI Text Examples:**
```
English → Thai (Primary) / English (Secondary)
────────────────────────────────────────
Down Payment → ดาวน์พเมนท์ / Down Payment
Loan Term → ระยะการผ่อน / Loan Term
Monthly Payment → ชำระเงินรายเดือน / Monthly Payment
Booking Details → รายละเอียดการจอง / Booking Details
Generate QR → สร้าง QR / Generate QR
Confirm Payment → ยืนยันชำระเงิน / Confirm Payment
Booking Successful → จองสำเร็จ / Booking Successful
```

#### Scenario: User with Thai locale
**WHEN** user sets app language to Thai
**THEN** all labels display Thai text
**AND** numbers format as Thai baht (฿) with comma separators
**AND** dates follow Thai context (if Buddhist Era enabled)

---

### Requirement: Error Handling & Edge Cases

#### Calculator Errors
| Error | Handling |
|-------|----------|
| Invalid loan amount (≤ 0) | Display "Loan amount must be > 0"; disable calculate |
| Down payment > 100% | Slider caps at 100%; show warning |
| Negative interest rate | Default to 2.49% (hardcoded fallback) |
| Calculation overflow | Show "Unable to calculate; contact support" |

#### QR Code Errors
| Error | Handling |
|-------|----------|
| Google Charts API unavailable | Fallback to bank transfer details; show message "QR temporarily unavailable" |
| Invalid payload format | Retry QR generation; log error |
| QR expires before payment | Prompt "QR Code Expired; Generate New QR" |

#### Payment Errors
| Error | Handling |
|-------|----------|
| PromptPay gateway timeout | Show "Payment verification pending; confirm manually" |
| Transaction declined | Display error message; allow retry or switch payment method |
| Webhook missing | Manual confirmation by staff (staff enters receipt number) |

#### State Errors
| Error | Handling |
|-------|----------|
| No car selected (e.g., direct URL) | Redirect to catalog; show "Please select a car first" |
| Session expired (> 30 min idle) | Clear booking state; prompt "Your session expired; start over" |
| Missing branch or salesperson | Use defaults ("Guest Branch", "Unknown Staff"); log warning |

#### Scenario: QR code expires
**WHEN** user sees "0:00" on countdown timer
**THEN** QR code image fades or shows overlay "QR Code Expired"
**AND** button text changes to "Generate New QR"
**WHEN** user clicks button
**THEN** new QR generated; new timestamp set; timer restarts at 15:00

#### Scenario: Payment gateway timeout
**WHEN** system waits >10s for PromptPay confirmation
**THEN** show message "Verifying payment... Please wait or confirm manually"
**AND** disable "Confirm Payment" button temporarily
**WHEN** user clicks "Confirm Manually"
**THEN** prompt for receipt number input; staff or customer enters reference
**WHEN** receipt submitted
**THEN** advance to Step 3 (with note: "Payment pending verification")

---

### Requirement: Performance & Security

#### Performance
- **Load Time:** Initial render < 2s (Steps 1–3 lazy-load)
- **Calculator Update:** Slider drag → monthly payment updates within 100ms (debounced)
- **QR Generation:** Image loads within 500ms
- **State Updates:** React re-renders only affected components (use `useCallback`, `useMemo`)

#### Security
- **Booking Reference:** Server-generated; not predictable (use UUID + timestamp salt)
- **QR Payload:** Encrypted optional; minimum: hash booking ID + amount
- **Payment Data:** Never store card numbers; use tokenization (v1.1+)
- **HTTPS:** All API calls over HTTPS; QR image loaded from HTTPS CDN
- **CSRF Protection:** Form tokens on state updates (if applicable)
- **XSS Prevention:** Sanitize user input (if any; limited in booking flow)

#### Scenario: Secure QR generation
**WHEN** backend generates QR payload
**THEN** hash booking reference + amount + timestamp
**AND** include merchant ID (verified on gateway)
**AND** payload expires after 15 minutes (no longer valid after QR expires)

---

## ## REMOVED Requirements

(None at this time; this is an initial spec.)

---

## ## CHANGED Requirements

(None at this time; this is an initial spec.)

---

## ## DEFERRED Requirements

The following items are **out of scope** for v1.0 and deferred to future releases:

1. **Credit Card Payment Integration**
   - Full credit card processing via Stripe / 2C2P
   - Deferred to v1.1 (requires PCI compliance & payment provider integration)

2. **Installment Plan Variants**
   - Multiple financing offers (3% vs. 2.49% rates, vendor financing)
   - Deferred to v1.1 (depends on partner bank agreements)

3. **Insurance Add-Ons**
   - Option to add extended warranty / insurance during booking
   - Deferred to v1.1 (requires insurance partner API)

4. **Document E-Signature**
   - Digital signature capture for terms & conditions
   - Deferred to v1.1 (requires e-signature provider; legal review needed)

5. **Multi-Language Support**
   - Full support for English, Japanese, Chinese (beyond Thai + English labels)
   - Deferred to v2.0 (lower priority for regional expansion)

6. **Rebooking & Modification**
   - Ability to modify down payment / term after initial booking
   - Deferred to v1.1 (feature flag pending)

7. **Batch QR Generation (Admin)**
   - Generate multiple QR codes for bulk booking events
   - Deferred to v2.0 (admin panel feature; out of v1.0 customer flow)

---

## Implementation Notes

### Code Structure
```
/booking/
├── components/
│   ├── Calculator.jsx         // Payment calculator slider + buttons
│   ├── Step1.jsx              // Booking details + payment method selector
│   ├── Step2.jsx              // QR code display + timer + confirm button
│   ├── Step3.jsx              // Success animation + reference + next steps
│   ├── BookingConfirm.jsx     // Legacy confirm screen
│   └── ProgressBar.jsx        // Reusable progress indicator
├── hooks/
│   ├── useBookingCalculator.js // Monthly payment calculation logic
│   ├── useQRGenerator.js        // QR code generation (Google Charts API)
│   ├── useCountdownTimer.js     // 15-minute countdown
│   └── useBookingState.js       // Zustand store integration
├── services/
│   ├── bookingAPI.js          // Supabase CRUD for bookings
│   ├── paymentAPI.js          // PromptPay webhook + payment status
│   └── qrAPI.js               // Google Charts QR endpoint wrapper
└── styles/
    └── booking.module.css     // Tailwind utility overrides (if needed)
```

### State Management (Zustand)
```javascript
// /stores/bookingStore.js
import create from 'zustand';

export const useBookingStore = create((set) => ({
  // State
  booking: { /* initial structure */ },
  calculator: { downPercent: 0, term: 60, monthlyPayment: 0 },
  ui: { currentStep: 1, loading: false, error: null },

  // Actions
  setDownPayment: (percent) => set(state => ({
    calculator: {
      ...state.calculator,
      downPercent: percent,
      downPaymentAmount: state.booking.carPrice * (percent / 100),
      loanAmount: state.booking.carPrice * (1 - percent / 100)
    }
  })),

  selectTerm: (months) => set(state => ({
    calculator: { ...state.calculator, term: months }
  })),

  calculateMonthly: () => { /* formula logic */ },

  generateQR: () => { /* API call to backend */ },

  confirmPayment: () => { /* mark step 2 complete */ },

  // ... more actions
}));
```

### API Endpoints (Backend)

**POST /api/bookings**
Create booking:
```json
{
  "carId": "corolla-altis",
  "carPrice": 909000,
  "downPaymentPercent": 30,
  "loanTerm": 60,
  "paymentMethod": "qr-promptpay",
  "branchId": "bkk-1",
  "salesPersonId": "staff-001"
}
```
Response:
```json
{
  "bookingId": "bk-202603-280001",
  "bookingRef": "BK-202603-280001",
  "carName": "Corolla Altis",
  "monthlyPayment": 11450,
  "status": "pending"
}
```

**POST /api/qr-codes/generate**
Generate QR:
```json
{
  "bookingId": "bk-202603-280001",
  "amount": 45000
}
```
Response:
```json
{
  "qrUrl": "https://chart.googleapis.com/chart?cht=qr&chs=200x200&chl=...",
  "qrPayload": "BK-202603-280001|45000|TOYOTA_BKK",
  "expiresAt": "2026-03-28T14:25:00Z"
}
```

**POST /api/payments/confirm**
Confirm payment:
```json
{
  "bookingId": "bk-202603-280001",
  "transactionId": "promptpay-ref-123456",
  "amount": 45000
}
```
Response:
```json
{
  "status": "confirmed",
  "bookingRef": "BK-202603-280001",
  "nextStep": 3
}
```

### Styling (Tailwind CSS)
```css
/* Key color tokens */
:root {
  --color-payment-hero: #ECFDF5;  /* light green bg */
  --color-text-green: #15803D;    /* dark green text */
  --color-timer-default: #F97316; /* orange */
  --color-timer-alert: #DC2626;   /* red (<3 min) */
}

/* Hero card */
.payment-hero {
  @apply bg-green-50 rounded-lg p-6 text-center shadow-sm;
}

.payment-hero-amount {
  @apply text-4xl font-bold text-green-700 mb-2;
}

/* Term buttons */
.term-btn {
  @apply px-4 py-2 border border-gray-300 rounded-lg transition-all;
}

.term-btn.on {
  @apply bg-blue-600 text-white ring-2 ring-blue-400;
}

/* Payment method pills */
.pay-method {
  @apply flex-1 p-4 border border-gray-300 rounded-lg cursor-pointer transition-all;
}

.pay-method.on {
  @apply border-blue-600 bg-blue-50 ring-2 ring-blue-400;
}

/* Timer */
.timer {
  @apply text-3xl font-mono font-bold text-orange-500;
}

.timer.alert {
  @apply text-red-600;
}

/* QR wrapper */
.qr-wrapper {
  @apply bg-white rounded-lg p-6 shadow-lg flex items-center justify-center;
}

/* Progress bar */
.progress-bar {
  @apply flex justify-between items-center gap-2 mb-6;
}

.progress-dot {
  @apply w-8 h-8 rounded-full border-2 flex items-center justify-center;
}

.progress-dot.active {
  @apply bg-green-500 border-green-500 text-white;
}

.progress-dot.done {
  @apply bg-green-100 border-green-300 text-green-600;
}
```

### Testing Strategy

**Unit Tests:**
- Monthly payment formula (edge cases: 0 down, max down, all terms)
- Down payment % → amount conversion
- Timer countdown logic (accuracy every 1s)
- QR payload encoding (valid format)

**Integration Tests:**
- Booking creation → QR generation
- Step progression (1 → 2 → 3)
- Payment status update → Step 3 unlock
- Mobile responsive breakpoints

**E2E Tests:**
- Full booking flow: Select car → Calculator → Step 1 → Generate QR → Step 2 → Confirm → Step 3
- Timeout scenarios (QR expires, session timeout)
- Payment gateway webhook integration (v1.1+)

**Performance:**
- Lighthouse score ≥ 80 (Performance, Accessibility)
- Monthly calc update < 100ms
- QR image load < 500ms
- No layout shift on button state changes

---

## Release Schedule

- **v1.0 (MVP):** 2026-04-15
  - Payment calculator, 3-step booking (Steps 1–3), QR via Google Charts, manual confirmation, legacy confirm screen

- **v1.1:** 2026-05-30
  - PromptPay webhook integration, credit card payment stub, booking modification, insurance add-ons

- **v2.0:** 2026-07-31
  - Full payment gateway integration (Stripe / 2C2P), e-signature, batch admin features, analytics dashboard

---

**Spec Version:** 1.0
**Last Updated:** 2026-03-28
**Status:** Ready for Development
