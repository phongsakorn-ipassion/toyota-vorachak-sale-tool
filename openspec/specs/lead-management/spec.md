# Lead Management Specification
## Toyota Sale Tool — Vorachakyont Dealer App

**Document Type:** OpenSpec (spec-driven)
**Version:** 2.0
**Last Updated:** 2026-03-28
**Status:** Implemented
**Language:** Thai/English (Bilingual)

---

## Overview

Lead Management is a core feature of the Toyota Sale Tool that enables sales staff to:
- Browse and search all leads with filtering by level
- Create new leads via A-Card form (full CRUD)
- Edit existing leads
- View lead detail with activities timeline
- Change lead level (hot/warm/cool/won/lost)
- Add activities (call, LINE, note, appointment)
- Pipeline kanban with stage management (manager view)

---

## IMPLEMENTED: Lead Data Model

### Lead Store (Zustand)

```javascript
useLeadStore = {
  // State
  leads: Lead[],
  selectedLead: Lead | null,
  filterLevel: 'all' | 'hot' | 'warm' | 'cool' | 'won' | 'lost',
  filterStage: 'all' | 'new' | 'test_drive' | 'negotiation' | 'won' | 'lost',
  searchTerm: string,

  // CRUD
  addLead(lead): void,
  updateLead(id, data): void,
  deleteLead(id): void,
  selectLead(id): void,

  // Field mutations
  changeLevel(id, level): void,
  changeStage(id, stage): void,
  assignLead(id, salesId): void,

  // Activities
  addActivity(leadId, activity): void,

  // Getters
  getFilteredLeads(): Lead[],
  getLeadById(id): Lead | null,
  getPipelineData(): { [stage]: Lead[] },
  getLeadStats(): { hot, warm, cool, won, lost, total },
}
```

### Lead Object Structure
```javascript
{
  id: string,          // 'lead_xxx' or mock ID
  name: string,        // Customer name (Thai)
  init: string,        // Avatar initial (1 char)
  color: string,       // Avatar bg color (hex)
  level: string,       // 'hot' | 'warm' | 'cool' | 'won' | 'lost'
  stage: string,       // 'new' | 'test_drive' | 'negotiation' | 'won' | 'lost'
  source: string,      // 'Walk-in' | 'LINE OA' | 'Facebook' | etc.
  car: string,         // Car ID reference
  phone: string,
  email: string,
  line: string,        // LINE ID (optional)
  budget: string,      // Budget range (optional)
  notes: string,       // Notes text
  activities: Activity[],
  createdAt: string,   // ISO timestamp
  assignedTo: string,  // Sales staff ID (optional)
}

Activity = {
  id: string,
  type: 'call' | 'line' | 'note' | 'appointment' | 'booking' | 'stage_change',
  title: string,
  content: string,
  time: string,        // ISO timestamp
  createdBy: string,
}
```

### Demo Data (4 Leads)

| Name | Level | Source | Car | Phone |
|------|-------|--------|-----|-------|
| ดวงใจ ทองดี | hot | Walk-in | Yaris Cross | 081-234-5678 |
| ประวิทย์ จันทร์ | warm | LINE OA | Land Cruiser FJ | 089-876-5432 |
| อรณี สุขสม | warm | Facebook | bZ4X | 062-345-6789 |
| จิรวัฒน์ ศรีรัตน์ | won | Referral | Corolla Altis | 095-678-1234 |

---

## IMPLEMENTED: Lead List Page (/leads)

### Route & Navigation
- Route: `/leads`
- Accessible by: Sales and Manager roles
- Tab: "Leads" in Sales bottom nav

### UI Components

**Header:**
- Title: "Lead ทั้งหมด"
- "+" button (green circle) navigates to /acard for new lead creation

**Search Bar:**
- Text input with search icon
- Searches across name, phone, email, source
- Clear button when text is present
- Calls `leadStore.setSearch(term)`

**Filter Pills:**
- Horizontal scroll: ทั้งหมด / Hot / Warm / Cool / Won
- Uses `pill-filter` and `pill-filter.on` CSS classes
- Calls `leadStore.setFilterLevel(level)`

**Lead List Items:**
Each item displays:
- Avatar circle (colored, with initial)
- Name (bold, truncated)
- Level badge (colored pill: hot=red, warm=orange, cool=blue, won=green)
- Car interest with car icon
- Created date
- Chevron right indicator
- Tap navigates to `/lead/:id`

**Empty State:**
- Users icon in gray circle
- "ไม่พบลีด" message
- Suggestion to change filters

---

## IMPLEMENTED: Lead Detail Page (/lead/:id)

### Layout
- PageHeader with back button and lead name
- Hero section: large avatar, name, level badge, source
- Action buttons: Call, LINE, Schedule, Note
- Car interest card
- Level change selector
- Activities timeline

### Actions
- **Call**: Creates 'call' activity
- **LINE**: Creates 'line' activity
- **Appointment**: Creates 'appointment' activity
- **Note**: Opens note input, creates 'note' activity

### Level Change
- Tappable level pills (hot/warm/cool/won/lost)
- Calls `leadStore.changeLevel(id, newLevel)`
- Visual feedback on selection

---

## IMPLEMENTED: A-Card Form (/acard)

### Create Mode
- Route: `/acard`
- Blank form with all fields

### Edit Mode
- Route: `/acard?edit=LEAD_ID`
- Pre-populates form with existing lead data

### Form Fields
| Field | Type | Required | Placeholder |
|-------|------|----------|-------------|
| ชื่อลูกค้า | text | Yes | ชื่อ-นามสกุล |
| โทรศัพท์ | tel | Yes | 08X-XXX-XXXX |
| อีเมล | email | No | email@example.com |
| LINE ID | text | No | @line_id |
| แหล่งที่มา | pills | No | Walk-in, LINE OA, Facebook, etc. |
| ระดับความสนใจ | cards | No | Hot / Warm / Cool |
| รุ่นรถที่สนใจ | select | No | Car catalog dropdown |
| งบประมาณ | text | No | Free text |
| หมายเหตุ | textarea | No | Notes |

### Submit
- Creates lead via `leadStore.addLead(data)`
- Auto-generates ID, timestamp, initial from name
- Navigates to lead list or lead detail

---

## IMPLEMENTED: Pipeline Kanban (/pipeline)

### Manager-Only View
- Route: `/pipeline`
- 5 columns: New / Test Drive / Negotiation / Won / Lost
- Each column header shows stage name, count, and color coding

### Pipeline Cards
- Avatar + name
- Car model
- Sales rep name
- Price badge
- Clickable: navigates to lead detail

### Stage Management
- Cards can be moved between stages
- Calls `leadStore.changeStage(id, newStage)`
- Count badges update automatically

---

## Lead Sources
Available sources for A-Card form:
- Walk-in
- LINE OA
- Facebook
- Instagram
- Event
- Referral

---

## Integration Points

- **Booking**: When a booking is confirmed, the linked lead's level changes to 'won' and stage changes to 'won', with a booking activity logged automatically
- **Notifications**: Lead-related notifications (e.g., hot lead alert) link to lead detail via deep navigation
- **Dashboard**: Sales Dashboard shows lead stats (KPIs), Manager Dashboard shows pipeline overview

---

## Related Specifications

- [Car Catalog Spec](../car-catalog/spec.md) — Lead.car references car catalog
- [Booking-Payment Spec](../booking-payment/spec.md) — Booking flow updates lead status
- [Navigation Spec](../navigation/spec.md) — Tab bar routing to Lead List
- [Design System Spec](../design-system/spec.md) — Color tokens, badge styles, avatar patterns

---

## IMPLEMENTED: Sprint 2-4 Enhancements

### Lost Lead Status
- Lead levels now include 'lost' in addition to hot/warm/cool/won
- Won and Lost are permanent statuses with confirm dialog + required note
- Filter pills include Lost for filtering

### Lead List Action Shortcuts
- Swipe or tap action buttons on list cards for quick call/LINE/note
- Direct actions without navigating to detail page

### Confirm Dialogs for Status Change
- Changing to Won or Lost requires confirmation dialog
- Optional note field in confirm dialog
- Activity auto-logged on status change with note

### Timeline CRUD
- Edit existing activities (editActivity in store)
- Delete activities (deleteActivity in store)
- Activities stamped with _updatedAt for concurrent check

### Service Center Selection
- Service center map with Leaflet integration
- Province/postal code search
- Geolocation for nearest service center

### Concurrent Check System
- Leads stamped with `_updatedAt` on create/update
- `updateLead` checks `_readAt` vs `_updatedAt` to detect conflicts
- Returns `{ conflict: true, message }` on concurrent modification
- ConflictNotification UI component for user feedback

---

**End of Lead Management Specification**
