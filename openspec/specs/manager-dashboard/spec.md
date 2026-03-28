# Manager Dashboard Specification
## Toyota Sale Tool — Vorachakyont Dealer App

**Document Type:** OpenSpec (spec-driven)
**Version:** 1.0
**Last Updated:** 2026-03-28
**Language:** Thai/English (Bilingual)

---

## Overview

Manager Dashboard is the central control panel for branch managers to monitor sales performance, team productivity, pipeline health, and set targets. It provides real-time KPIs, team performance visualizations, and actionable insights to drive sales strategy.

This specification covers four main sections:
1. **KPI Dashboard** — branch selector, key metrics grid
2. **Team Performance** — bar chart with team rankings
3. **Leaderboard** — individual sales staff rankings with progress
4. **Pipeline & Insights** — pipeline view, AI insights, quick actions

---

## ADDED Requirements

### Data Model

#### Manager Session Data Structure

```javascript
{
  managerId: string                // UUID
  branchId: string                 // Current selected branch
  role: 'manager'
  team: TeamMember[]
  branches: BranchInfo[]
  kpis: KPIData
  insights: AIInsight[]
  targets: TargetData
  pipeline: PipelineStage[]
}

BranchInfo = {
  id: string                       // Branch ID
  name: string                     // Thai branch name
  location: string                 // Location detail
  code: string                     // Short code (e.g., 'LP', 'BN', 'ON')
}

TeamMember = {
  id: string
  name: string                     // Sales staff name (Thai)
  init: string                     // Avatar initial
  color: string                    // Avatar bg color
  unitsSold: number                // Units sold this month
  target: number                   // Monthly target
  leadCount: number                // Number of active leads
  conversionRate: number           // % (0-100)
  performanceRank: number          // 1-5 ranking
  avatar?: string                  // Optional profile image URL
}

KPIData = {
  totalUnits: number               // Total units sold (month/period)
  revenue: number                  // Revenue in THB
  activeLeads: number              // Count of leads in pipeline
  conversionRate: number           // Avg conversion % (0-100)
  weeklyCounts: {
    w1: number
    w2: number
    w3: number
    w4: number
  }
  targetVsActual: {
    target: number
    actual: number
  }
}

AIInsight = {
  id: string
  type: 'alert' | 'warning' | 'info'  // Red / Orange / Green
  title: string                        // Thai title
  message: string                      // Actionable recommendation
  data?: any                           // Supporting metrics
  timestamp: timestamp
}

TargetData = {
  branchId: string
  month: string                    // "2026-03" format
  targetUnits: number              // Branch target
  currentUnits: number             // Units achieved
  achievementPct: number           // % of target achieved
  teamTargets: {
    [staffId]: number              // Individual targets
  }
}

PipelineStage = {
  stage: string                    // 'new' | 'test_drive' | 'negotiation' | 'won' | 'lost'
  count: number
  leads: Lead[]
}

Lead = {
  id: string
  name: string
  carModel: string
  repName: string
  price: number
  stage: string
}
```

#### Demo Data Set

**Branches:**
- สาขาลาดพร้าว (Ladphrao) — Code: LP
- สาขาบางนา (Bangna) — Code: BN
- สาขาอ่อนนุช (On Nut) — Code: ON

**Team Members (5 Salespeople):**

| Name | Init | Color | Units | Target | Rank | Conv.% |
|------|------|-------|-------|--------|------|--------|
| มาลี นวลสุข | ม | #FF6B6B | 8 | 10 | 🥇 1st | 32% |
| สุดา อิ่มสม | ส | #FFD93D | 6 | 10 | 🥈 2nd | 28% |
| สมชาย ชอบสัน | ส | #4D96FF | 5 | 10 | 🥉 3rd | 25% |
| ประยุทธ กิจวัฒน์ | ป | #6BCB77 | 4 | 10 | 4th | 20% |
| นภา รักษ์สม | น | #9B59B6 | 3 | 10 | 5th | 15% |

**KPIs (Current Month):**
- Total Units: 26 / 50 (52%)
- Revenue: 78,000,000 THB
- Active Leads: 42
- Avg Conversion: 24%

---

## ADDED Section: Layout & Navigation

### Manager Dashboard Main Screen

**Navigation Model:**
- Tab bar (bottom): Dashboard | Leads | Reports | Settings
- Active tab: Dashboard (highlighted)
- Back button: if on detail/drill-down view

**Scrollable Sections** (top to bottom):
1. Branch Selector (sticky, top-fixed)
2. KPI Grid (2x2)
3. Team Performance Bar Chart
4. Leaderboard Table
5. AI Insights Cards
6. Quick Actions

---

## ADDED Requirement: Branch Selector

Display branch selection as horizontal scroll pills. Manager can switch between branches to view branch-specific KPIs and team performance.

### UI Components

**Branch Pills:**
- Horizontal scrolling container
- Each pill: 120px width, 44px height
- Content:
  - Branch emoji/icon (optional)
  - Branch name (Thai, e.g., "สาขาลาดพร้าว")
  - Background: light gray (inactive) or colored (active)
- Selected state: primary color bg, white text, border highlight

**Container:**
- Full width, 12px padding left/right
- Overflow: scroll-x on mobile
- Snap-to-center on tablet

### Scenario: Select Branch

**WHEN** manager opens Dashboard
**THEN**:
1. Branch selector displays with 3 pills: สาขาลาดพร้าว | สาขาบางนา | สาขาอ่อนนุช
2. Current branch is highlighted (e.g., สาขาลาดพร้าว = active)
3. Pills are horizontally scrollable on mobile

**AND WHEN** manager taps a different branch pill (e.g., สาขาบางนา)
**THEN**:
1. Selected pill animates to highlight state
2. KPI grid, team chart, leaderboard, and insights update for new branch
3. Data fetches and renders (1-2 second load time)
4. All sub-screens below refresh with branch-specific data
5. URL/state updates to reflect selected branch

---

## ADDED Requirement: KPI Grid

Display key performance indicators in a 2x2 grid layout. Each KPI is a metric card showing current value, target, and progress.

### UI Components

**KPI Card (4 total, grid 2x2):**
- Dimensions: 160px x 140px (mobile), 200px x 160px (tablet)
- Border: 1px solid #E8E8E8
- Background: white with subtle shadow
- Content layout:
  - **Metric Title** (top, 12px bold gray): e.g., "รวมยอดขายทั้งหมด / Total Units"
  - **Large Value** (center, 32px bold, colored): e.g., "26"
  - **Subtitle** (below value, 12px gray): e.g., "/ Target: 50"
  - **Progress bar** (bottom, colored, 4px height)
  - **Percentage** (bottom-right, 10px bold): e.g., "52%"

**KPI Types (2x2 Grid):**
1. **Top-Left: Total Units** (blue)
   - Value: 26
   - Target: 50
   - Progress: 52%

2. **Top-Right: Revenue** (green)
   - Value: ฿ 78,000,000
   - Target: ฿ 150,000,000
   - Progress: 52%

3. **Bottom-Left: Active Leads** (orange)
   - Value: 42
   - Target: (no target, just count)
   - Label: "ลีดที่ยังเปิดอยู่ / Open Leads"

4. **Bottom-Right: Conversion Rate** (purple)
   - Value: 24%
   - Target: 30%
   - Progress: 80%

### Scenario: View KPI Grid

**WHEN** manager opens Dashboard for selected branch
**THEN**:
1. KPI grid loads with 4 cards
2. Each card displays:
   - Metric title (Thai + English)
   - Current value (large, bold)
   - Target value (if applicable)
   - Progress bar with percentage
3. Cards are arranged 2x2 and stacked vertically on mobile
4. Progress bars fill based on (actual / target * 100)
5. Color coding: blue (units), green (revenue), orange (leads), purple (conversion)

---

## ADDED Requirement: Team Performance Bar Chart

Horizontal bar chart showing each team member's units sold vs. target. Uses Chart.js library for rendering.

### UI Components

**Chart Container:**
- Full width, 300px height on mobile
- Responsive scaling on tablet
- Title (top): "ประสิทธิภาพทีมงาน / Team Performance"
- Legend (top-right, optional): two pills "ขายตามเป้า / Actual" | "เป้าหมาย / Target"

**Chart Bars:**
- Each team member gets one horizontal bar (5 bars total)
- Bar height: 40px per bar
- Label (left): team member name + avatar circle (24px)
- Two segments per bar:
  - **Actual units** (solid color, per staff color)
  - **Remaining to target** (light gray, faded)
- Value labels on right: "8/10" (units/target)

**Color Coding:**
- Green: ≥90% of target (on-track)
- Orange: 70-89% of target (at-risk)
- Red: <70% of target (behind)

**Staffing Order:**
- Sorted by units sold (descending): มาลี → สุดา → สมชาย → ประยุทธ → นภา

### Scenario: View Team Performance Chart

**WHEN** manager views Dashboard
**THEN**:
1. Bar chart renders with 5 horizontal bars (one per team member)
2. Each bar shows:
   - Team member name + avatar circle (left)
   - Colored bar segment (actual units)
   - Gray faded segment (remaining to target)
   - Units label on right: "8/10"
3. Bars are ordered by units sold (highest first)
4. Colors indicate performance level: green (มาลี) → orange (สอง) → red (นภา)
5. Chart is interactive (tap → drill-down to staff detail, optional)

---

## ADDED Requirement: Leaderboard Table

Ranked list of sales staff with progress indicators, achievements, and targets. Displays rank medal (gold/silver/bronze), avatar, name, progress bar, and units/target.

### UI Components

**Leaderboard Header:**
- Title: "อันดับการขาย / Sales Leaderboard"
- Optional filter: "This Month" / "This Quarter" (dropdown)

**Leaderboard Rows (5 rows):**
- Height: 64px per row
- Layout:
  - **Rank Medal** (left, 32px): 🥇 / 🥈 / 🥉 / "#4" / "#5"
  - **Avatar** (24px circle): team member avatar
  - **Name** (bold, 14px): team member name
  - **Progress Bar** (width 100px, right): filled bar showing (units / target)
  - **Units/Target** (12px, gray): e.g., "8 / 10"
  - **Achievement %** (12px bold, right-most): e.g., "80%"

**Color Scheme for Progress:**
- Bar fill color: same as team member color (or derived from performance)
- Background: light gray
- Border: 1px solid #E8E8E8

**Rank Medals:**
1. 🥇 Gold (1st): มาลี นวลสุข
2. 🥈 Silver (2nd): สุดา อิ่มสม
3. 🥉 Bronze (3rd): สมชาย ชอบสัน
4. #4 (text): ประยุทธ กิจวัฒน์
5. #5 (text): นภา รักษ์สม

### Scenario: View Leaderboard

**WHEN** manager scrolls down to Leaderboard section
**THEN**:
1. Table displays with 5 rows (all team members)
2. Each row shows:
   - Rank medal (gold/silver/bronze or number)
   - Team member avatar
   - Name
   - Progress bar (filled to achievement %)
   - Units sold / target (e.g., "8 / 10")
   - Achievement percentage (e.g., "80%")
3. Rows are sorted by rank (highest units first)
4. Progress bars are colored per team member theme

**AND WHEN** manager taps a row (staff name or progress bar)
**THEN**:
1. Drill-down to individual staff performance detail page
2. Shows: staff info, leads assigned, sales pipeline, conversion data
3. Back button returns to Dashboard

---

## ADDED Requirement: AI Insights Cards

Actionable recommendations based on sales data. Uses color-coded insight types (alert/warning/info).

### UI Components

**Insight Cards Container:**
- Title: "AI ข้อมูลเชิงลึก / AI Insights"
- Vertical stack of insight cards (scrollable)

**Insight Card Layout (3 types):**
- Height: 100px per card
- Background: light tint based on type
- Left border: 4px solid, color-coded

**Alert (.i-alert) — Red Border:**
- Border color: #FF6B6B
- Background: #FFF5F5
- Icon (left): ⚠️ (red)
- Title (bold, 14px): red text
- Message (12px, gray): 2-3 lines

**Warning (.i-warn) — Orange Border:**
- Border color: #FFD93D
- Background: #FFFAF0
- Icon: ⚡ (orange)
- Title: orange text
- Message: gray

**Info (.i-info) — Green Border:**
- Border color: #6BCB77
- Background: #F5FFF5
- Icon: ✓ (green)
- Title: green text
- Message: gray

**Example Insights:**

1. **Alert (Red):**
   - Title: "นภา อยู่หลังเป้าหมาย / Napa Behind Target"
   - Message: "นภา ขาย 3/10 เท่านั้น ต้องเพิ่ม 7 ยูนิตก่อนสิ้นเดือน"
   - Action: [View Profile]

2. **Warning (Orange):**
   - Title: "ลีดสูญหาย / Leads Aging"
   - Message: "8 ลีดอยู่ในขั้นเจรจา >7 วัน ต้องทำการติดตาม"
   - Action: [View Pipeline]

3. **Info (Green):**
   - Title: "มาลี เป็นตัวอักษร! / Mali on Track!"
   - Message: "มาลี ขาย 8/10 ยูนิต ยอดเยี่ยม!"
   - Action: None / Dismissible

### Scenario: View AI Insights

**WHEN** manager scrolls to Insights section
**THEN**:
1. Cards display in vertical stack (3-5 insights)
2. Each card shows:
   - Colored left border (red/orange/green)
   - Alert icon
   - Title (Thai + English)
   - Message (actionable recommendation)
   - Optional action button/link
3. Cards can be dismissed (swipe left or X button)
4. Insights are ordered by priority: alerts first, then warnings, then info

**AND WHEN** manager taps insight action button
**THEN**:
1. Navigate to related drill-down (e.g., staff profile, pipeline view)
2. Context is passed to highlight affected data

---

## ADDED Requirement: Quick Actions

Buttons for common manager tasks accessible from Dashboard.

### UI Components

**Action Buttons Container:**
- Bottom section of Dashboard (above tab bar)
- Title: "การกระทำอย่างรวดเร็ว / Quick Actions"
- Grid: 2 columns x 2 rows (4 buttons total)

**Button Styling:**
- Dimensions: 140px x 60px per button
- Background: light colored (per action theme)
- Text: centered, 12px bold
- Icon + label (2-line stacked)

**Quick Actions (4 total):**

1. **View Pipeline** (blue)
   - Icon: 🔗
   - Label: "ดูช่อง / Pipeline"
   - Action: Navigate to Pipeline View (Kanban)

2. **Set Targets** (orange)
   - Icon: 🎯
   - Label: "ตั้งเป้า / Targets"
   - Action: Open Target Setting modal/form

3. **Export Report** (green)
   - Icon: 📊
   - Label: "ส่งออก / Export"
   - Action: Generate and download PDF/Excel report

4. **Team Chat** (purple)
   - Icon: 💬
   - Label: "ส่งข่าว / Message"
   - Action: Open team messaging/broadcast interface

### Scenario: Use Quick Actions

**WHEN** manager taps "ดูช่อง / Pipeline" button
**THEN**:
1. Navigate to Pipeline View (s-pipeline section)
2. Display Kanban columns with lead distribution

**AND WHEN** manager taps "ตั้งเป้า / Targets" button
**THEN**:
1. Modal opens with Branch Targets form
2. Shows current branch targets and team member targets
3. Manager can edit and save updates

**AND WHEN** manager taps "ส่งออก / Export" button
**THEN**:
1. Report generation dialog appears
2. Options: Select date range, report type (Weekly/Monthly)
3. Generate PDF → download to device
4. Optional: email report to inbox

---

## ADDED Section: Pipeline View (s-pipeline)

Kanban-style pipeline board showing leads across sales stages.

### UI Components

**Pipeline Board:**
- Full width, horizontal scroll on mobile
- 5 columns, each 280px wide on desktop, 200px on mobile

**Column Headers:**
- Title (Thai + English, 14px bold)
- Count badge: colored pill with count, e.g., "4 ลีด / Leads"
- Subtle background tint per stage

**Columns (5 stages):**

1. **ใหม่ / New** (blue background tint, #E3F2FD)
   - Count example: "8"
   - Lead cards: new prospects

2. **ทดสอบรถ / Test Drive** (orange tint, #FFF3E0)
   - Count: "5"
   - Lead cards: scheduled test drives

3. **เจรจา / Negotiation** (purple tint, #F3E5F5)
   - Count: "3"
   - Lead cards: in active negotiation

4. **ชนะ / Won** (green tint, #E8F5E9)
   - Count: "12"
   - Lead cards: completed sales

5. **แพ้ / Lost** (gray tint, #F5F5F5)
   - Count: "2"
   - Lead cards: inactive/lost

**Pipeline Card:**
- Dimensions: 160px x 120px
- Content:
  - Avatar + name (top, 32px)
  - Car model (gray, 12px)
  - Rep name (gray, 10px, smaller)
  - Price (if available, 12px, bold)
  - Drag handle (icon, right corner)
- Draggable between columns
- Tap → opens Lead Detail screen

**Summary Pills (optional, below columns):**
- Small pills showing total by stage
- Example: "รวมทั้งหมด / Total: 30 ลีด / Leads"

### Scenario: View Pipeline (Kanban)

**WHEN** manager opens Pipeline View (from Quick Action or menu)
**THEN**:
1. Kanban board displays with 5 columns
2. Column headers show title + count badge
3. Lead cards are distributed across columns
4. Board is horizontally scrollable on mobile
5. Example data:
   - ใหม่: 8 cards
   - ทดสอบรถ: 5 cards
   - เจรจา: 3 cards
   - ชนะ: 12 cards
   - แพ้: 2 cards

**AND WHEN** manager drags a card from one column to another
**THEN**:
1. Card animates to destination column
2. Lead stage updates in database
3. Count badges update automatically
4. Activity logged: "ย้าย [lead_name] ไป [new_stage]"
5. Optional toast: "บันทึกแล้ว / Saved"

**AND WHEN** manager taps a card
**THEN**:
1. Lead Detail screen opens (read-only or editable per role)
2. Shows full lead info, activities, assigned rep, etc.
3. Back → returns to Pipeline View

---

## ADDED Section: Branch Targets (s-targets)

Form for setting and monitoring branch and individual staff targets.

### UI Components

**Target Header:**
- Title: "เป้าหมายของสาขา / Branch Targets"
- Current month/period: "มีนาคม 2026 / March 2026"

**Branch Target Card:**
- Large card (green background tint, #E8F5E9)
- Content:
  - **Current Progress:** "26 / 50 ยูนิต / Units" (bold, large)
  - **Progress Bar:** 52% filled
  - **Stats Grid (3 columns):**
    - ค่าเฉลี่ยต่อวัน / Avg/Day: "1.3"
    - วันที่เหลือ / Days Left: "8"
    - ต้องขายต่อวัน / Need/Day: "3"
  - Achievement percentage (top-right): "52%"

**Team Member Targets (rows):**
- Table/list of individual staff targets
- Columns:
  - Avatar + name (left)
  - Progress bar (current / target)
  - Units / Target (e.g., "8 / 10")
  - Achievement % (e.g., "80%")
- Rows sortable or filterable

**Action Buttons:**
- "บันทึก / Save" (primary, green)
- "ยกเลิก / Cancel" (secondary)
- "แก้ไข / Edit" (if in view mode)

### Scenario: View Branch Targets

**WHEN** manager opens "ตั้งเป้า / Targets" from Quick Actions
**THEN**:
1. Branch Targets screen displays
2. Shows:
   - Branch target card (large green card)
   - Team member target rows
   - All progress bars filled to achievement %
3. Data is read-only (view mode)

**AND WHEN** manager taps "แก้ไข / Edit" button
**THEN**:
1. Form becomes editable
2. Target fields allow input
3. Save/Cancel buttons appear

**AND WHEN** manager updates targets and taps "บันทึก / Save"
**THEN**:
1. Updated targets are persisted
2. Progress bars and percentages recalculate
3. Toast notification: "บันทึกเป้าหมายแล้ว / Targets saved"

---

## ADDED Section: Reports (s-reports)

Weekly/monthly sales report with charts, summary pills, and key metrics.

### UI Components

**Report Header:**
- Title: "รายงาน / Reports"
- Period selector: "สัปดาห์นี้ / This Week" / "เดือนนี้ / This Month"

**Weekly Chart (Chart.js line):**
- Title: "ยอดขายรายสัปดาห์ / Weekly Sales"
- X-axis: W1, W2, W3, W4 (or dates)
- Y-axis: units (0-30)
- Line chart with data points
- Example data: W1: 5, W2: 7, W3: 8, W4: 6
- Color: blue line, light blue fill under line

**Summary Pills (4 pills, horizontal scroll):**
- "ร้อน / Hot": 8 leads (red)
- "อุ่น / Warm": 15 leads (orange)
- "เย็น / Cool": 12 leads (blue)
- "ชนะ / Won": 12 units (green)
- "แพ้ / Lost": 2 units (gray)

**Report Cards (key metrics):**
- Avg. Lead Value: ฿ 3,000,000
- Conversion Rate: 24%
- Avg. Days in Pipeline: 12
- Customer Acquisition Cost: ฿ 50,000

**Export Options:**
- Button: "ดาวน์โหลด / Download" (PDF / Excel)

### Scenario: View Reports

**WHEN** manager taps "ส่งออก / Export" from Quick Actions
**THEN**:
1. Reports screen opens
2. Displays:
   - Weekly line chart
   - Summary pills (hot/warm/cool/won/lost)
   - Key metrics cards
3. Period selector visible (This Week / This Month)

**AND WHEN** manager taps "ดาวน์โหลด / Download" button
**THEN**:
1. Dialog appears: "เลือกรูปแบบ / Select Format"
2. Options: PDF / Excel
3. Report generates and downloads to device
4. Optional: email report

---

## Design Tokens

### Colors (Dashboard)

```css
--color-kpi-units: #4D96FF      /* Blue */
--color-kpi-revenue: #6BCB77    /* Green */
--color-kpi-leads: #FFD93D      /* Orange */
--color-kpi-conversion: #9B59B6 /* Purple */

--color-performance-green: #6BCB77  /* On-track (≥90%) */
--color-performance-orange: #FFD93D /* At-risk (70-89%) */
--color-performance-red: #FF6B6B    /* Behind (<70%) */

--color-insight-alert: #FF6B6B   /* Red */
--color-insight-warn: #FFD93D    /* Orange */
--color-insight-info: #6BCB77    /* Green */

--color-stage-new: #E3F2FD      /* Blue tint */
--color-stage-test: #FFF3E0     /* Orange tint */
--color-stage-negotiation: #F3E5F5 /* Purple tint */
--color-stage-won: #E8F5E9      /* Green tint */
--color-stage-lost: #F5F5F5     /* Gray tint */
```

### Spacing

- Branch pills: 12px padding
- KPI cards: 16px padding
- Chart height: 300px (mobile), 250px (tablet)
- Leaderboard row: 64px height
- Insight card: 100px height
- Quick action button: 140px x 60px

### Typography

- Dashboard title: 24px bold
- Section title: 16px bold
- KPI value: 32px bold
- Card label: 12px regular
- Leaderboard name: 14px regular
- Insight title: 14px bold
- Insight message: 12px regular

---

## Acceptance Criteria

- [ ] Dashboard loads with all 3 branches in selector pills
- [ ] Branch selector switches between branches and updates all data
- [ ] KPI grid displays 4 cards with correct values, targets, and progress bars
- [ ] Team performance bar chart renders with 5 staff members, colors, and units
- [ ] Leaderboard table displays rank medals, avatars, names, progress bars, and percentages
- [ ] AI Insights cards render with color-coded borders (red/orange/green) and actionable messages
- [ ] Quick Actions buttons navigate to Pipeline, Targets, Export, and Team Chat screens
- [ ] Pipeline view (Kanban) displays 5 columns with correct lead distribution
- [ ] Pipeline cards are draggable between columns and update lead stage
- [ ] Branch Targets card shows current progress, progress bar, and stats
- [ ] Reports screen displays weekly chart, summary pills, and key metrics
- [ ] All text renders in Thai + English bilingual format
- [ ] Dashboard is responsive on iPhone (390x844), iPad (768x960)
- [ ] All data updates reflect in real-time when leads are created/moved
- [ ] Export report generates PDF/Excel with branch and team data

---

## Related Specifications

- [Lead Management Spec](../lead-management/spec.md) — Lead data, pipeline integration
- [Car Catalog Spec](../car-catalog/spec.md) — Car models referenced in leads
- [Navigation Spec](../navigation/spec.md) — Tab bar routing to Dashboard
- [Design System Spec](../design-system/spec.md) — Color tokens, avatar styles, typography

---

**End of Manager Dashboard Specification**
