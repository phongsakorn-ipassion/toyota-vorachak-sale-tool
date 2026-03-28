# Lead Management Specification
## Toyota Sale Tool — Vorachakyont Dealer App

**Document Type:** OpenSpec (spec-driven)  
**Version:** 1.0  
**Last Updated:** 2026-03-28  
**Language:** Thai/English (Bilingual)

---

## Overview

Lead Management is a core feature of the Toyota Sale Tool that enables sales staff to:
- Capture and track customer leads in real-time
- Organize leads by engagement level (Hot/Warm/Cool/Won)
- Access quick contact and activity history
- (For Managers) monitor team pipeline and lead distribution

This specification covers the Lead Data Model, UI components, and interaction flows.

---

## ADDED Requirements

### Data Model

#### Lead Data Structure

```javascript
{
  id: string                    // UUID
  name: string                  // Customer name (Thai)
  init: string                  // Avatar initial (1 char)
  color: string                 // Avatar bg color (hex)
  level: 'hot' | 'warm' | 'cool' | 'won'
  source: 'walk-in' | 'LINE OA' | 'Facebook' | 'โทรศัพท์' | 'Website' | 'Referral'
  car: string                   // Car ID (reference to car catalog)
  carName: string               // Car model name (derived)
  phone: string                 // Contact phone
  createdAt: timestamp          // Creation date
  updatedAt: timestamp          // Last updated
  activities: Activity[]        // Timeline history
  notes: string                 // Internal notes
  representative: string        // Assigned sales staff name
  appointmentDate?: timestamp   // Scheduled appointment
}

Activity = {
  id: string
  type: 'call' | 'appointment' | 'note' | 'test_drive' | 'negotiation'
  timestamp: timestamp
  content: string               // Activity description
}
```

#### Demo Data Set (4 Leads)

| Name | Init | Color | Level | Source | Car | Phone | Status |
|------|------|-------|-------|--------|-----|-------|--------|
| ดวงใจ ทองดี | ด | #FF6B6B (Red) | hot | walk-in | Yaris | 081-XXXX-XXXX | Active |
| ประวิทย์ จันทร์ | ป | #FFD93D (Yellow) | warm | LINE OA | LC | 082-XXXX-XXXX | Active |
| อรณี สุขสม | อ | #FFD93D (Yellow) | warm | Facebook | BZ4X | 083-XXXX-XXXX | Active |
| จิรวัฒน์ ศรีรัตน์ | จ | #6BCB77 (Green) | won | walk-in | Corolla | 084-XXXX-XXXX | Closed |

---

### Requirement: Lead List View

Display all leads in a scrollable list with quick glance information.

#### UI Components

- **Avatar Circle** (40px)
  - Background color: from lead.color
  - Initial: lead.init (centered, white text, bold)
  - Border: 1px solid #E0E0E0

- **Lead Card** (full-width, 72px height)
  - Avatar + Name (line 1) + Time (right, gray)
  - Car badge (line 2, smaller text, gray)
  - Status badge (right, colored pill)

- **Status Badges**
  - Hot (🔥): Red bg, white text — "ร้อน / Hot"
  - Warm (🌡️): Yellow bg, dark text — "อุ่น / Warm"
  - Cool (❄️): Blue bg, white text — "เย็น / Cool"
  - Won (✓): Green bg, white text — "ชนะ / Won"

- **Time Format**
  - Same day: "HH:mm" (e.g., "14:30")
  - Different day: "d MMM" (e.g., "28 มี.ค." or "28 Mar")
  - Older: "d MMM YYYY"

#### Scenario: Load Lead List

**WHEN** a sales staff member opens the Lead Management tab  
**THEN** the app displays:
1. Header: "จัดการลีด / Lead Management"
2. Search/filter bar (optional, empty state)
3. List of all leads in descending order (newest first)
4. Each lead shows: avatar, name, car model, status badge, time
5. Tap on any lead → opens Lead Detail Screen

#### Scenario: Filter by Status (Manager View)

**WHEN** a manager views the Lead List  
**THEN** optional filter pills appear:
- "ทั้งหมด / All"
- "ร้อน / Hot" (red)
- "อุ่น / Warm" (yellow)
- "เย็น / Cool" (blue)
- "ชนะ / Won" (green)

**AND WHEN** manager taps a status pill  
**THEN** list filters to show only leads of that status

---

### Requirement: Lead Detail Screen

Display comprehensive information about a single lead with action buttons and activity timeline.

#### Layout Structure

**Hero Section** (100px height)
- Avatar (large, 80px)
- Name + Source (right of avatar)
- Status Badge (top-right)

**Action Buttons** (4 buttons, 56px each, grid 2x2)
- 📞 "โทร / Call" — triggers phone dial
- 💬 "LINE" — opens LINE OA chat
- 📅 "นัดหมาย / Appointment" — opens date/time picker
- 📝 "บันทึก / Note" — opens note input modal

**Car Card**
- Car image (if available) or placeholder
- Car name + variant (Thai + English)
- Price (THB)
- Color: "สี / Color"

**Timeline Section**
- Header: "กิจกรรม / Activity History"
- Vertical timeline with:
  - Circular dot indicator (color-coded by type)
  - Activity type label
  - Timestamp
  - Activity content (1-2 lines, truncated)
- Scrollable list

#### Scenario: View Lead Details

**WHEN** a sales staff taps a lead from the list  
**THEN** the app displays:
1. Hero section with avatar, name, source, and status badge
2. 4 action buttons below hero
3. Car card showing interested vehicle
4. Activity timeline below car card

**AND WHEN** the user scrolls  
**THEN** timeline extends and shows all past activities

#### Scenario: Call Lead (Lead Detail)

**WHEN** user taps "โทร / Call" button  
**THEN**:
1. App attempts to dial the lead's phone number
2. Call intent is triggered (native OS phone dialer)
3. Activity logged automatically after call ends:
   - Type: "call"
   - Content: "โทร [lead name] ฉันพูดคุยเกี่ยวกับ [car]"
   - Timestamp: call start time

#### Scenario: Schedule Appointment (Lead Detail)

**WHEN** user taps "นัดหมาย / Appointment" button  
**THEN**:
1. Modal opens with date + time picker
2. User selects date and time
3. Optional note field ("เหตุผล / Reason")
4. Confirm button saves appointment
5. Lead.appointmentDate is updated
6. Activity logged:
   - Type: "appointment"
   - Content: "นัดหมายวันที่ [date] เวลา [time]"
   - Timestamp: now

#### Scenario: Add Note to Lead (Lead Detail)

**WHEN** user taps "บันทึก / Note" button  
**THEN**:
1. Modal opens with rich text editor (CKEditor 5)
2. User types or pastes note content
3. Save button commits note to lead.notes
4. Activity logged:
   - Type: "note"
   - Content: first 100 chars of note (or full, if <100)
   - Timestamp: now

---

### Requirement: Lead Creation Form (A-Card Form)

Capture new customer lead with structured input fields.

#### Form Layout

**Interest Level Selector** (3 cards, full-width, stacked vertical)
- Each card shows:
  - Large emoji icon (🔥 / 🌡️ / ❄️)
  - Label (Thai + English): "ร้อน / Hot", "อุ่น / Warm", "เย็น / Cool"
  - Background: light shade of status color
  - Selected state: darker bg + checkmark ✓
- Only one card can be selected at a time

**Source Selector** (Pills, horizontal scroll/wrap)
- Pills: "Walk-in", "LINE OA", "Facebook", "โทรศัพท์ / Phone", "Website", "Referral"
- Display: light gray bg, dark text
- Selected: colored bg (match interest level color), white text
- Only one pill can be selected

**Form Fields** (stacked, each with optional icon prefix)
- **ชื่อลูกค้า / Customer Name** (required)
  - Icon: 👤
  - Placeholder: "ชื่อ-นามสกุล"

- **โทรศัพท์ / Phone** (required)
  - Icon: 📱
  - Placeholder: "+66 8X-XXXX-XXXX"
  - Validation: Thai phone format

- **รุ่นรถที่สนใจ / Car Interest** (required)
  - Icon: 🚗
  - Dropdown/Autocomplete showing car catalog
  - Display: "Car Model + Variant"

- **หมายเหตุ / Notes** (optional)
  - Icon: 📝
  - Placeholder: "เพิ่มหมายเหตุ..."
  - Multi-line text input

**Action Buttons**
- "บันทึก / Save" (primary, colored)
- "ยกเลิก / Cancel" (secondary)

#### Scenario: Create New Lead (Happy Path)

**WHEN** user taps floating action button (+) or "Lead → New Lead"  
**THEN**:
1. A-Card Form opens with blank fields
2. Interest level defaults to unselected (no card highlighted)
3. Source defaults to unselected
4. All fields are empty

**AND WHEN** user:
- Selects "ร้อน / Hot" interest level
- Selects "walk-in" source
- Enters "ดวงใจ ทองดี" as name
- Enters "081-2345-6789" as phone
- Selects "Yaris" from car dropdown
- Taps "บันทึก / Save"

**THEN**:
1. New lead object is created with:
   - name: "ดวงใจ ทองดี"
   - init: "ด" (first Thai character)
   - color: "#FF6B6B" (hot/red)
   - level: "hot"
   - source: "walk-in"
   - car: "yaris_id"
   - phone: "081-2345-6789"
   - createdAt: now
2. User is navigated to Lead List
3. New lead appears at top of list (newest first)
4. Optional toast notification: "สร้างลีดใหม่สำเร็จ / Lead created"

#### Scenario: Validation on Lead Creation

**WHEN** user taps "Save" with missing required fields  
**THEN**:
1. Form shows inline error messages:
   - Missing name: "กรุณากรอกชื่อลูกค้า / Required"
   - Missing phone: "กรุณากรอกเบอร์โทร / Required"
   - Missing car: "กรุณาเลือกรุ่นรถ / Required"
2. Fields are highlighted with red border
3. Save button remains disabled until all required fields filled

---

### Requirement: Pipeline View (Manager Dashboard)

Kanban-style board showing leads across sales stages.

#### Column Structure

**5 Columns** (horizontal scroll on mobile, grid on tablet)
- **New** (light gray header)
- **Test Drive** (light blue header)
- **Negotiation** (light yellow header)
- **Won** (light green header)
- **Lost** (light red header)

#### Column Header

- Title (Thai + English, e.g., "ใหม่ / New")
- Count pill with colored bg: "4 / 4 leads"
- Subtle background color hint

#### Lead Card in Pipeline

- **Compact Card** (180px width, 140px height on tablet)
  - Avatar + name (top)
  - Car model (one line, gray)
  - Rep name (one line, smaller, gray) — "นาย ..." (sales staff assigned)
  - Price (if available, smaller)
  - Light background color (slightly tinted per column)

#### Interaction

- Cards are **draggable** (drag to move between columns)
- Tap card → opens Lead Detail Screen
- Columns auto-scroll horizontally on mobile

#### Scenario: View Pipeline (Manager)

**WHEN** manager opens Pipeline View (tab or dedicated screen)  
**THEN**:
1. Kanban board displays with 5 columns
2. Column headers show title + lead count (total in system, per column)
3. Lead cards are distributed across columns based on stage
4. Example distribution:
   - New: 8 cards
   - Test Drive: 5 cards
   - Negotiation: 3 cards
   - Won: 12 cards
   - Lost: 2 cards

**AND** board is scrollable horizontally on mobile, full-width grid on tablet

#### Scenario: Move Lead in Pipeline (Manager)

**WHEN** manager drags a card from one column to another  
**THEN**:
1. Card visually moves to destination column
2. Lead stage is updated in database
3. Activity logged:
   - Type: "stage_change"
   - Content: "ย้ายไปยัง [new_stage] โดย [manager_name]"
   - Timestamp: now
4. Card count updates in both columns

---

### Requirement: Lead Avatar System

Visual representation of leads using initials and color coding.

#### Avatar Styling

- **Shape:** Circle
- **Size (variants):**
  - List view: 40px (12px font)
  - Detail hero: 80px (28px font)
  - Pipeline card: 32px (10px font)
  - Form: 48px (14px font)

- **Color Assignment:**
  - Hot (🔥): #FF6B6B (Red)
  - Warm (🌡️): #FFD93D (Yellow)
  - Cool (❄️): #4D96FF (Blue)
  - Won (✓): #6BCB77 (Green)
  - Color is derived from lead.level at creation

- **Initial:**
  - Extracted from first character of customer name (Thai)
  - Always white text, bold font
  - Fallback if no name: "?" (question mark)

- **Border:** 1px solid #E0E0E0 (light gray)

#### Scenario: Avatar Initial Extraction (Thai Names)

**WHEN** a lead is created with name "ดวงใจ ทองดี"  
**THEN**:
1. System extracts first Thai character: "ด"
2. Avatar.init = "ด"
3. Avatar background = color matching lead.level

**AND WHEN** lead is created with name "Juan Smith" (English)  
**THEN**:
1. System extracts first English letter: "J"
2. Avatar.init = "J"

---

### Requirement: Timeline Activity Indicators

Visual markers for different activity types in lead detail.

#### Activity Type Indicators

| Type | Icon/Dot | Color | Label |
|------|----------|-------|-------|
| call | 📞 | #4D96FF | โทร / Call |
| appointment | 📅 | #FFD93D | นัดหมาย / Appt |
| note | 📝 | #A8A8A8 | บันทึก / Note |
| test_drive | 🚗 | #6BCB77 | ทดสอบรถ / Test Drive |
| negotiation | 💬 | #FF9999 |协商 / Negotiation |

#### Timeline Rendering

- **Vertical line:** connects all activity dots
- **Dot:** 12px circle, color-coded per activity type
- **Activity content:** displayed right of dot (or below on narrow screens)
- **Timestamp:** displayed right-aligned or below content
- **Truncation:** activity content limited to 2 lines, overflow → "...อ่านเพิ่มเติม"

#### Scenario: Display Activity Timeline

**WHEN** user views a lead with 5+ activities  
**THEN**:
1. Timeline renders vertically with newest activity at top
2. Each activity shows:
   - Colored dot indicator
   - Activity type label (Thai)
   - Content (first 2 lines)
   - Timestamp (e.g., "28 มี.ค. 14:30")
3. Timeline is scrollable within the Lead Detail screen
4. Tap activity → expands to show full content (modal or expanded view)

---

## Summary of Screens & Flows

| Screen | Role(s) | Purpose |
|--------|---------|---------|
| Lead List | Sales Staff, Manager | Browse all leads, status overview |
| Lead Detail | Sales Staff, Manager | View lead info, take action, see history |
| Lead Form (A-Card) | Sales Staff | Create new lead |
| Pipeline View | Manager | Kanban board of lead stages |

### User Journey - Sales Staff

```
Login (Sales Staff role)
  ↓
Sales Dashboard (main)
  ↓
Lead Management Tab
  ├─ Lead List
  │  ├─ Tap lead → Lead Detail
  │  │  ├─ Call / LINE / Appointment / Note
  │  │  └─ Back → Lead List
  │  └─ Tap (+) → Lead Form (Create)
  │     └─ Save → Lead List
  └─ ...other tabs
```

### User Journey - Manager

```
Login (Manager role)
  ↓
Manager Dashboard (KPI overview)
  ↓
Lead Management Tab
  ├─ Lead List (with filters)
  │  └─ Tap lead → Lead Detail (view-only actions)
  └─ Pipeline View
     ├─ Drag cards between columns
     └─ Tap card → Lead Detail
```

---

## Design Tokens

### Colors (Lead Status)

```css
--color-hot:   #FF6B6B  /* Red */
--color-warm:  #FFD93D  /* Yellow */
--color-cool:  #4D96FF  /* Blue */
--color-won:   #6BCB77  /* Green */
--color-lost:  #A8A8A8  /* Gray */
```

### Spacing

- Avatar: 40px (list), 80px (detail), 32px (pipeline)
- Card height: 72px (lead list)
- Button: 56px (action buttons in detail)
- Padding: 16px (standard), 12px (compact)

### Typography

- Lead name: 16px bold (list), 20px bold (detail)
- Car model: 14px regular, #666
- Time: 12px regular, #999
- Badge: 12px bold, white text

---

## Edge Cases & Error Handling

### Case: Lead with No Phone Number

**WHEN** a lead is created without phone  
**THEN**:
1. Phone field is optional (not required in form)
2. "โทร / Call" button is disabled (grayed out)
3. Tooltip on hover: "ไม่มีเบอร์โทร / No phone"

### Case: Lead with Multiple Source Channels

**WHEN** a customer comes from both Facebook AND LINE OA  
**THEN**:
1. Lead.source captures primary source only
2. Additional context stored in lead.notes
3. (Future: support array of sources)

### Case: Deleted/Archived Leads

**WHEN** a lead is marked as "Lost" or manually archived  
**THEN**:
1. Lead appears in Pipeline "Lost" column
2. Lead can still be viewed but actions are limited
3. Reactivation requires manager approval (not in MVP)

### Case: Offline Lead Creation

**WHEN** sales staff creates lead while offline (no internet)  
**THEN**:
1. Lead is saved locally (IndexedDB / localStorage)
2. "Syncing..." indicator shown
3. Auto-syncs when connection restored
4. No duplicate creation on reconnect

---

## Acceptance Criteria

- [ ] Lead list displays all 4 demo leads with correct avatars, names, cars, status badges
- [ ] Lead detail screen shows all sections: hero, action buttons, car card, timeline
- [ ] A-Card form validates required fields and creates new leads correctly
- [ ] Pipeline view displays kanban columns with correct lead distribution
- [ ] Avatar initials extracted from Thai and English names correctly
- [ ] Timeline activities render with color-coded indicators and timestamps
- [ ] All UI labels render in both Thai and English
- [ ] Responsive layout works on iPhone (390x844) and iPad (768x960)
- [ ] Phone dial, LINE OA intent, appointment picker, note modal all trigger correctly
- [ ] Lead count pills update when leads are created or moved between pipeline stages

---

## Related Specifications

- [Car Catalog Spec](../car-catalog/spec.md) — Lead.car references car catalog
- [Navigation Spec](../navigation/spec.md) — Tab bar routing to Lead Management
- [Design System Spec](../design-system/spec.md) — Color tokens, avatar styles
- [Manager Dashboard Spec](../manager-dashboard/spec.md) — KPI view, lead metrics

---

**End of Lead Management Specification**
