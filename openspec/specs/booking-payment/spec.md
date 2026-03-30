# Booking-Payment Spec — Toyota Sale Tool
**OpenSpec Format** | v2.0 | 2026-03-28
**Status:** Implemented
*ระบบการจองรถและชำระเงิน สำหรับ Toyota Dealer Sale Tool*

---

## Overview

The **Booking-Payment** system converts customer interest into confirmed reservations through a 3-step booking wizard. It includes a real payment calculator with amortization formula, car selection from catalog, customer information capture, and booking confirmation with reference number generation. The system is connected to the lead management system, automatically updating lead status on successful booking.

---

## IMPLEMENTED: Payment Calculator (/calc)

### Calculator Features
- Car selection from full 6-car catalog
- Real-time monthly payment computation using amortization formula
- Down payment slider (0-50% of car price)
- Loan term selector (48, 60, 72, 84 months)
- Interest rate display (configurable, default 2.79% annual)

### Calculation Formula
```
Monthly = Loan x r x (1+r)^n / ((1+r)^n - 1)

Where:
  Loan = Car Price - Down Payment
  r = (Interest Rate / 12) / 100  (monthly decimal rate)
  n = Loan Term in Months
```

### Display Components
- **Hero card**: Large monthly payment amount (green)
- **Down payment**: Percentage slider + computed THB amount
- **Loan breakdown**: Down payment, financing amount, total interest
- **Term buttons**: 48 / 60 / 72 / 84 months with active state
- All values update in real-time as user adjusts inputs

---

## IMPLEMENTED: 3-Step Booking Wizard (/booking)

### Booking Store (Zustand)

```javascript
useBookingStore = {
  // Wizard state
  step: 1 | 2 | 3,
  carId: string | null,
  leadId: string | null,
  savedBooking: Booking | null,

  // Customer info
  customerName: string,
  customerPhone: string,
  customerEmail: string,

  // Payment config
  paymentMethod: 'installment' | 'cash' | 'qr' | 'transfer' | 'credit',
  downPaymentPct: number,     // 0-50
  loanTerm: number,           // months
  interestRate: number,       // annual %

  // Bookings collection
  bookings: Booking[],

  // Computed getters
  getSelectedCar(): Car,
  getDownPayment(): number,
  getLoanAmount(): number,
  getMonthlyPayment(): number,
  getTotalInterest(): number,

  // Actions
  setStep(step): void,
  setCarId(id): void,
  setLeadId(id): void,
  setCustomerInfo(info): void,
  setPaymentMethod(method): void,
  setDownPayment(pct): void,
  setLoanTerm(months): void,
  saveBooking(): Booking,
  reset(): void,
}
```

### Step 1: Select Car
- Browse car catalog
- Select car for booking
- Car data auto-populates from CARS catalog
- Advance to Step 2

### Step 2: Customer Information
- Customer name, phone, email fields
- Link to existing lead (optional)
- Payment method selection
- Down payment and loan term configuration

### Step 3: Payment Summary & Confirmation
- Car summary (name, price, image)
- Customer details review
- Payment breakdown (down payment, monthly, total interest)
- "ยืนยันการจอง" (Confirm Booking) button
- On confirm: generates booking with reference number

### Booking Reference Number
Format: `BK-YYYYMM-XXXXXX`
- YYYY: year
- MM: month (zero-padded)
- XXXXXX: 6-digit random number

---

## IMPLEMENTED: Booking Confirmation

### On Successful Booking
1. Booking object created with all details:
   - Unique ID and reference number
   - Car details (name, price)
   - Customer info
   - Payment configuration
   - Status: 'confirmed'
   - Timestamp
2. Booking saved to `bookings` array in store
3. `savedBooking` set for success screen display

### Lead Integration
WHEN a booking is linked to a lead (via `leadId`)
THEN:
1. Lead level changes to 'won'
2. Lead stage changes to 'won'
3. Booking activity is logged on the lead:
   - Type: 'booking'
   - Title: 'จองรถสำเร็จ'
   - Content: 'จองรถ {carName} — Ref: {bookingRef}'

### Notification Integration
WHEN booking is confirmed
THEN a notification can be triggered via `uiStore.addNotification()`

---

## IMPLEMENTED: Booking Data Model

```javascript
Booking = {
  id: string,              // 'booking_xxx'
  ref: string,             // 'BK-202603-123456'
  carId: string,
  carName: string,
  carPrice: number,
  leadId: string | null,
  customerName: string,
  customerPhone: string,
  customerEmail: string,
  paymentMethod: string,
  downPaymentPct: number,
  downPayment: number,     // computed THB
  loanAmount: number,      // computed THB
  loanTerm: number,        // months
  interestRate: number,    // annual %
  monthlyPayment: number,  // computed THB
  totalInterest: number,   // computed THB
  status: 'confirmed' | 'cancelled',
  createdAt: string,       // ISO timestamp
}
```

---

## Booking CRUD
- `saveBooking()`: Create new booking, returns booking object
- `getBookings()`: List all bookings
- `getBookingById(id)`: Find by ID or reference
- `cancelBooking(id)`: Set status to 'cancelled'

---

## Related Specifications

- [Car Catalog Spec](../car-catalog/spec.md) — Car data for booking
- [Lead Management Spec](../lead-management/spec.md) — Lead status update on booking
- [Navigation Spec](../navigation/spec.md) — Booking flow routing

---

## IMPLEMENTED: Sprint 4 — Inline Calculator & Concurrent Stock Check

### Inline Calculator on Car Detail Page
- Embedded directly in CarDetailPage below CTA buttons
- Uses flat-rate calculation (not amortization):
  ```
  financeAmount = carPrice - (carPrice * downPct / 100)
  totalInterest = financeAmount * (rate / 100) * (months / 12)
  monthly = Math.ceil((financeAmount + totalInterest) / months)
  ```
- Interest rate: text input with % suffix, default 2.49%
- Down payment: radio pill buttons (5/10/15/20/25%), default 15%
- Loan term: range slider 12-84 months, step 12, with tick labels
- Result card: monthly amount in green, breakdown grid, disclaimer
- Self-contained with local state (no store dependency)

### Constants
- `DOWN_PAYMENT_OPTIONS`: [5, 10, 15, 20, 25]
- `LOAN_TERM_RANGE`: { min: 12, max: 84, step: 12, default: 48 }
- `LOAN_TERMS`: [12, 24, 36, 48, 60, 72, 84]

### Concurrent Stock Check
- `saveBooking()` now checks existing confirmed bookings for the same car
- If car `stockCount` is exceeded, returns `{ conflict: true, message: 'สต็อครถถูกจองโดยผู้ใช้อื่น' }`
- All bookings stamped with `_updatedAt` timestamp via `stampRecord()`

---

**End of Booking-Payment Specification**
