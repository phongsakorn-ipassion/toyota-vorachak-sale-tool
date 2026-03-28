# Manager Dashboard Specification
## Toyota Sale Tool — Vorachakyont Dealer App

**Document Type:** OpenSpec (spec-driven)
**Version:** 2.0
**Last Updated:** 2026-03-28
**Status:** Implemented
**Language:** Thai/English (Bilingual)

---

## Overview

Manager Dashboard is the central control panel for branch managers to monitor sales performance, team productivity, pipeline health, and set targets. All KPIs are dynamically computed from Zustand stores (leadStore, bookingStore) rather than static mock data.

**Implemented Sections:**
1. **KPI Dashboard** — branch selector, dynamic key metrics grid
2. **Team Performance** — Chart.js bar chart with live data
3. **Leaderboard** — ranked sales staff with progress bars
4. **Dynamic Insights** — auto-generated actionable insights from data
5. **Pipeline Kanban** — interactive pipeline with stage management
6. **Targets** — view + edit mode for branch and individual targets
7. **Reports** — computed metrics, charts, export functionality

---

## IMPLEMENTED: Manager Dashboard (/mgr-dash)

### Branch Selector
- 3 branch pills: สาขาลาดพร้าว | สาขาอ่อนนุช | สาขาบางนา
- Horizontal scrollable on mobile
- Selected branch highlighted with primary color
- All KPIs, charts, and leaderboard update on branch change

### KPI Grid (2x2)
Dynamic computation from stores:
- **Total Units**: Count of won leads from leadStore
- **Revenue**: Computed from won leads x car prices
- **Active Leads**: Count of non-won/lost leads
- **Conversion Rate**: (won / total) percentage

### Team Performance Chart
- Chart.js horizontal bar chart
- 5 team members from TEAM_MEMBERS data
- Each bar shows units sold vs. target
- Color coding: green (on-track), orange (at-risk), red (behind)
- Sorted by units sold (descending)

### Leaderboard
- Ranked list of 5 sales staff
- Rank medals: gold/silver/bronze for top 3
- Avatar + name + progress bar + units/target + achievement %
- Live data from TEAM_MEMBERS

### Dynamic Insights
- Auto-generated based on real data:
  - Alert (red): staff behind target
  - Warning (orange): aging leads in pipeline
  - Info (green): top performer recognition
- Color-coded cards with left border accent

---

## IMPLEMENTED: Pipeline Kanban (/pipeline)

### Columns
5 pipeline stages:
| Stage | Label | Color |
|-------|-------|-------|
| new | ใหม่ | Blue |
| test_drive | ทดสอบ | Orange |
| negotiation | เจรจา | Purple |
| won | ชนะ | Green |
| lost | แพ้ | Gray |

### Pipeline Cards
- Avatar + customer name
- Car model
- Sales rep name
- Price badge (if available)
- Clickable: navigates to /lead/:id

### Stage Change
- Cards can change stage via interaction
- `leadStore.changeStage(id, newStage)` called
- Column counts update automatically
- Activity logged on lead

---

## IMPLEMENTED: Targets Page (/targets)

### View Mode
- Branch target card (large, green tint)
- Current progress: X / Y units with progress bar
- Stats grid: average/day, days remaining, units needed/day
- Team member individual targets with progress bars

### Edit Mode
- "แก้ไข" (Edit) button toggles to edit mode
- Target fields become editable inputs
- "บันทึก" (Save) and "ยกเลิก" (Cancel) buttons appear
- On save: targets updated, progress bars recalculate

---

## IMPLEMENTED: Reports Page (/reports)

### Weekly Chart
- Chart.js bar/line chart
- Weekly data: W1, W2, W3, W4
- Units sold per week

### Key Metrics
- Summary pills: Hot / Warm / Cool / Won lead counts
- Computed metrics:
  - Average lead value
  - Conversion rate
  - Top models by units sold

### Export Functionality
- CSV export: generates downloadable CSV file
- PDF export: generates printable report
- "ดาวน์โหลด" (Download) button with format selection

---

## Data Sources

### Team Members (5 Salespeople)
| Name | Initial | Color | Units | Target |
|------|---------|-------|-------|--------|
| มาลี รักดี | ม | #1B7A3F | 61 | 70 |
| สุดา เจริญผล | ส | #FFD93D | 52 | 70 |
| สมชาย วงษ์ดี | ส | #4D96FF | 45 | 70 |
| ประยุทธ สมใจ | ป | #6BCB77 | 38 | 70 |
| นภา สุขสม | น | #9B59B6 | 29 | 70 |

### Branch Targets
| Branch | Units | Target |
|--------|-------|--------|
| สาขาลาดพร้าว | 117 | 150 |
| สาขาอ่อนนุช | 62 | 100 |
| สาขาบางนา | 66 | 100 |

### Weekly Data
| Week | Units |
|------|-------|
| W1 | 48 |
| W2 | 62 |
| W3 | 71 |
| W4 | 64 |

---

## Manager Bottom Navigation

| Tab | Label | Route | Icon |
|-----|-------|-------|------|
| 1 | Dashboard | /mgr-dash | chart |
| 2 | Pipeline | /pipeline | pipeline |
| 3 | Targets | /targets | target |
| 4 | Reports | /reports | report |

---

## Related Specifications

- [Lead Management Spec](../lead-management/spec.md) — Lead data, pipeline integration
- [Car Catalog Spec](../car-catalog/spec.md) — Car models referenced in leads
- [Navigation Spec](../navigation/spec.md) — Tab bar routing to Dashboard
- [Design System Spec](../design-system/spec.md) — Color tokens, Chart.js styling

---

**End of Manager Dashboard Specification**
