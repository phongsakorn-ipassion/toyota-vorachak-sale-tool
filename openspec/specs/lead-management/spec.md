# Lead Management Specification
## Toyota Sale Tool — Vorachakyont Dealer App

**Document Type:** OpenSpec (spec-driven)
**Version:** 3.0
**Last Updated:** 2026-04-03
**Status:** Implemented
**Language:** Thai/English (Bilingual)

---

## Overview

Lead Management is a core feature of the Toyota Sale Tool that enables sales staff to:
- Browse and search all leads with filtering by stage and auto-derived category
- Create new leads via A-Card form (full CRUD)
- Edit existing leads
- View lead detail with activities timeline
- Advance leads through a stage-based pipeline (new_lead > proposal > evaluation > close_won / close_lost)
- Manage test drive sub-statuses (scheduled > completed / cancelled)
- Add activities (call, LINE, note, appointment)
- Pipeline kanban with stage management (manager view)

---

## Stage-Based Pipeline (v3.0)

### Purchase Lead Stages

Leads progress through a linear sales pipeline:

| Stage | Label (TH) | Order | Color | Description |
|-------|-------------|-------|-------|-------------|
| `new_lead` | ลีดใหม่ | 1 | #3B82F6 | Initial state for all new purchase leads |
| `proposal` | เสนอราคา | 2 | #8B5CF6 | Price proposal sent to customer |
| `evaluation` | ประเมิน/จอง | 3 | #D97706 | Customer evaluating, may have booking |
| `close_won` | ปิดการขาย | 4 | #16A34A | Sale completed (permanent) |
| `close_lost` | สูญเสีย | 4 | #6B7280 | Sale lost (permanent, requires note) |

**Stage Advancement Rules:**
- Stages can only advance forward (no backward moves)
- `close_lost` can be triggered from any non-terminal stage
- `close_lost` requires a note explaining the reason
- `close_won` and `close_lost` are permanent (terminal states)
- Booking creation triggers advancement to `evaluation`

### Auto-Derived Categories

Categories (hot/warm/cool) are **derived automatically** from lead data, not manually set:

```javascript
function deriveCategory(lead) {
  if (lead.stage === 'close_won' || lead.stage === 'close_lost') return null;
  if (source includes 'walk-in') return 'hot';
  if (lead.stage !== 'new_lead') return 'warm';
  return 'cool';
}
```

| Category | Label (TH) | Derivation Rule |
|----------|-------------|-----------------|
| `hot` | พร้อมซื้อ | Walk-in source |
| `warm` | สนใจ | Any stage beyond new_lead |
| `cool` | สำรวจ | New lead, non-walk-in source |

Categories are shown as secondary badges alongside the stage badge.

### Test Drive Sub-Statuses

Test drive leads use `testDriveStatus` (separate from `stage`):

| Status | Label (TH) | Color | Description |
|--------|-------------|-------|-------------|
| `scheduled` | นัดหมาย | #3B82F6 | Test drive appointment created |
| `completed` | เสร็จสิ้น | #10B981 | Test drive completed |
| `cancelled` | ยกเลิก | #EF4444 | Test drive cancelled |

**Test Drive Status Transitions:**
- `scheduled` -> `completed` or `cancelled`
- `completed` -> can promote to `proposal` stage (advances the lead)
- `cancelled` is permanent

---

## IMPLEMENTED: Lead Data Model

### Lead Store (Zustand)

```javascript
// Exported pure function
export function deriveCategory(lead): 'hot' | 'warm' | 'cool' | null

useLeadStore = {
  // State
  leads: Lead[],
  selectedLead: Lead | null,
  filterStage: 'all' | 'new_lead' | 'proposal' | 'evaluation' | 'close_won' | 'close_lost',
  filterCategory: 'all' | 'hot' | 'warm' | 'cool',
  filterType: 'purchase' | 'test_drive',
  searchTerm: string,

  // CRUD
  addLead(lead): Lead,
  updateLead(id, data, _readAt?): Result,
  deleteLead(id): void,

  // Stage transitions
  advanceStage(id, targetStage, note?, _readAt?): Result,
  changeTestDriveStatus(id, newStatus, note?, _readAt?): Result,

  // Activities
  addActivity(leadId, activity): void,
  editActivity(leadId, activityId, updates): void,
  deleteActivity(leadId, activityId): boolean,

  // Getters
  getFilteredLeads(): Lead[],
  getLeadById(id): Lead | null,
  getPipelineData(): { purchase: {}, testDrive: {} },
  getLeadStats(): { new_lead, proposal, evaluation, close_won, close_lost, hot, warm, cool, total },
}
```

### Lead Object Structure
```javascript
{
  id: string,
  name: string,
  init: string,           // Avatar initial (1 char)
  color: string,          // Avatar bg color (hex)
  stage: string,          // 'new_lead' | 'proposal' | 'evaluation' | 'close_won' | 'close_lost'
  leadType: string,       // 'purchase' | 'test_drive'
  testDriveStatus: string, // 'scheduled' | 'completed' | 'cancelled' (test drives only)
  source: string,         // 'Walk-in' | 'LINE OA' | 'Facebook' | etc.
  car: string,            // Car ID reference
  selectedGrade: string,  // Sub-model/grade ID
  selectedColor: string,  // Color name
  phone: string,
  email: string,
  lineId: string,
  notes: string,
  activities: Activity[],
  createdAt: string,      // ISO timestamp
  _updatedAt: number,     // Timestamp for concurrent check
  assignedTo: string,     // Sales staff ID (optional)
  // Test drive specific
  testDriveDate: string,
  testDriveTime: string,
  serviceCenter: string,
}
```

---

## IMPLEMENTED: Lead List Page (/leads)

### Filter Pills
- **Purchase tab**: ทั้งหมด / ลีดใหม่ / เสนอราคา / ประเมิน / Won / Lost (filters by `lead.stage`)
- **Test drive tab**: ทั้งหมด / นัดหมาย / เสร็จสิ้น / ยกเลิก (filters by `lead.testDriveStatus`)

### Card Badges
- Purchase cards: primary badge `badge-{stage}` + secondary small `badge-{category}`
- Test drive cards: badge `badge-{testDriveStatus}`

---

## IMPLEMENTED: Lead Detail Page (/lead/:id)

### Stage Progress Stepper (Purchase Leads)
Visual stepper showing: ลีดใหม่ -> เสนอราคา -> ประเมิน/จอง -> ปิดการขาย

Action buttons change based on current stage:
- `new_lead`: "เสนอราคา (Proposal)" button
- `proposal`: "จองรถ (Evaluation)" button (navigates to booking)
- `evaluation`: "ปิดการขาย (Won)" + "ปิดไม่สำเร็จ (Lost)" buttons
- Terminal: read-only badge showing final status

### Test Drive Status Management
- `scheduled`: "เสร็จสิ้น" and "ยกเลิก" buttons
- `completed`: "เลื่อนเป็น Proposal" button (promotes lead)
- `cancelled`: read-only badge

---

## IMPLEMENTED: A-Card Form (/acard)

### Changes in v3.0
- **Removed**: Interest level selector (Hot/Warm/Cool)
- Purchase leads saved with `stage: 'new_lead'` (category auto-derived)
- Test drive leads saved with `stage: 'new_lead'`, `testDriveStatus: 'scheduled'`

---

## IMPLEMENTED: Pipeline Kanban (/pipeline)

### Purchase Pipeline Columns
5 columns: ลีดใหม่ / เสนอราคา / ประเมิน/จอง / Won / Lost

### Test Drive Pipeline Columns
3 columns: นัดหมาย / เสร็จสิ้น / ยกเลิก

### Move Rules
- Purchase: only forward stage moves allowed (via `advanceStage`)
- Test drive: status changes via `changeTestDriveStatus`
- Category dot indicator shown on each purchase card

---

## IMPLEMENTED: Dashboard Integration

### Sales Dashboard
- Won leads: `l.stage === 'close_won'`
- Hot leads: `deriveCategory(l) === 'hot'`
- Active leads: `!['close_won', 'close_lost'].includes(l.stage)`
- Test drives: `l.testDriveStatus === 'scheduled'`

### Manager Dashboard
- Won count: `l.stage === 'close_won'`
- New leads: `l.stage === 'new_lead'`
- Hot leads: `deriveCategory(l) === 'hot'`
- TD completed: `l.testDriveStatus === 'completed'`

---

## Integration Points

- **Booking**: When a booking is created, the linked lead advances to `evaluation` stage
- **Notifications**: Lead-related notifications link to lead detail via deep navigation
- **Dashboard**: Sales/Manager dashboards use stage-based and category-based filtering
- **Reports**: Won leads filtered by `stage === 'close_won'`

---

## Related Specifications

- [Car Catalog Spec](../car-catalog/spec.md) — Lead.car references car catalog
- [Booking-Payment Spec](../booking-payment/spec.md) — Booking flow updates lead stage
- [Navigation Spec](../navigation/spec.md) — Tab bar routing to Lead List
- [Design System Spec](../design-system/spec.md) — Color tokens, badge styles, avatar patterns

---

## Migration from v2.0

The store includes automatic migration on rehydration:
- `l.level === 'won'` -> `stage: 'close_won'`
- `l.level === 'lost'` -> `stage: 'close_lost'`
- Walk-in hot leads -> `stage: 'proposal'`
- Other levels -> `stage: 'new_lead'`
- Test drive `l.level` -> `testDriveStatus` field

---

**End of Lead Management Specification**
