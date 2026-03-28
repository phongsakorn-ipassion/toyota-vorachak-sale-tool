# Agent Instructions — Toyota Sale Tool Demo App

> คำแนะนำสำหรับ AI Coding Agent (Claude Code) ในการสร้าง Live Demo จาก OpenSpec นี้

## Project Identity

- **App**: Toyota Vorachakyont (วรจักร์ยนต์) Sale Tool
- **Type**: PWA Demo Application
- **Client**: Toyota Dealer — วรจักร์ยนต์
- **Vendor**: iPassion Co., Ltd.
- **Language**: Thai (primary UI) + English (technical terms)

## Reference Prototype

**CRITICAL**: ทุก component, journey, vibe, atmosphere ต้อง **identical** กับ prototype
- File: `../Toyota-SaleTool-Prototype-v5.html`
- เปิดไฟล์นี้ในเบราว์เซอร์เพื่อเป็น visual reference ตลอดการ implement
- Design tokens, spacing, colors, typography ทุกค่ามาจาก prototype CSS
- ทุก screen, transition, interaction ต้องตรงกับ prototype

## Tech Stack (MUST USE)

| Layer | Technology | Version |
|---|---|---|
| Frontend | React | 18 |
| Build Tool | Vite | 5 |
| Styling | Tailwind CSS | 3 |
| State Management | Zustand | 4 |
| Routing | React Router (HashRouter) | 6 |
| Backend-as-a-Service | Supabase JS | 2 |
| Auth | Supabase Auth | — |
| Database | PostgreSQL (via Supabase) | 15 |
| Charts | Chart.js | 4.4 |
| CI/CD | GitHub Actions | — |
| Hosting | GitHub Pages | — |

## Working Directory

All code goes in: `04 - Demo/` (same folder as this openspec)

```
04 - Demo/
├── openspec/           # ← You are here (specs, DO NOT modify)
├── src/
│   ├── components/
│   │   ├── ui/         # Button, Card, Badge, Input, FilterPill, StatusDot, Avatar
│   │   ├── layout/     # AppShell, BottomNav, PageHeader, StatusBar
│   │   ├── car/        # CarListItem, CarDetail, Gallery, SpecAccordion, FilterBar
│   │   ├── lead/       # LeadItem, LeadDetail, ACardForm, Pipeline
│   │   ├── booking/    # BookingSteps, QRPayment, PaymentCalc
│   │   └── dashboard/  # KPIGrid, TeamChart, Leaderboard, InsightCards
│   ├── pages/          # LoginPage, SalesDashboard, CatalogPage, CarDetailPage, etc.
│   ├── stores/         # Zustand: useAuthStore, useCarStore, useLeadStore, etc.
│   ├── lib/            # supabase.js client, helpers, constants
│   ├── hooks/          # useAuth, useNavigateBack, useDevice, useCountdown
│   ├── assets/         # SVG icons (extract from prototype sprite)
│   └── styles/         # Global CSS, Tailwind extensions
├── public/
│   ├── manifest.json
│   ├── sw.js
│   ├── 404.html
│   └── icons/          # PWA icons 192x192, 512x512
├── .github/
│   └── workflows/
│       └── deploy.yml
├── .env.local          # Supabase credentials (DO NOT commit)
├── index.html
├── package.json
├── vite.config.js
├── tailwind.config.js
├── postcss.config.js
└── Demo_App_Tech_Stack.md
```

## Implementation Order

Follow `openspec/tasks.md` strictly in order:
1. Project Setup → 2. Supabase Backend → 3. Core Infrastructure → 4. Design System →
5. Auth → 6. Car Catalog → 7. Lead Management → 8. Booking → 9. Manager Dashboard →
10. Notifications → 11. PWA → 12. CI/CD → 13. Testing

## Design System Rules

### Colors (Tailwind Config)
```js
colors: {
  primary: { DEFAULT: '#1B7A3F', dark: '#145E30', light: '#EBF7EF', medium: '#C4E3CE' },
  avail: '#16A34A',
  transit: '#EA580C',
  hot: '#DC2626',
  warm: '#D97706',
  cool: '#2563EB',
  t1: '#111827',
  t2: '#6B7280',
  t3: '#9CA3AF',
  bg: '#F5F7F5',
  card: '#FFFFFF',
  border: '#E5E7EB',
  bdr2: '#D1D5DB',
}
```

### Border Radius
```js
borderRadius: {
  sm: '8px',
  md: '12px',
  lg: '16px',
  xl: '20px',
  pill: '100px',
}
```

### Typography
- Font: `'Sarabun', -apple-system, sans-serif`
- Weights: 300 (light), 400 (regular), 500 (medium), 600 (semibold), 700 (bold), 800 (extrabold)
- Load from Google Fonts: `https://fonts.googleapis.com/css2?family=Sarabun:wght@300;400;500;600;700;800`

### Component Patterns
- **Cards**: `bg-card rounded-lg border border-border p-4 mb-3`
- **Primary Button**: `bg-primary text-white rounded-pill py-4 px-5 font-bold w-full`
- **Filter Pill**: `px-4 py-2 rounded-pill text-sm font-bold border` + `.on: bg-primary text-white`
- **Badge Hot**: `bg-red-50 text-hot px-2 py-1 rounded-pill text-xs font-bold`
- **Input**: `border border-border rounded-md py-3 px-3.5 pl-10 text-sm focus:border-primary`

## Responsive Breakpoints

| Device | Width | Shell Height | Border Radius |
|---|---|---|---|
| Phone | 390px | 844px | 46px |
| Tablet | 768px | 960px | 24px |

- Phone: single column, compact spacing (16px padding)
- Tablet: wider cards, 2-column layouts where appropriate (24px padding)
- Demo mode wraps the app in a device frame on dark background (same as prototype)

## Key Implementation Notes

### Navigation
- Use `HashRouter` (required for GitHub Pages)
- Maintain a `navHistory` stack in Zustand for `goBack()` behavior
- Bottom nav has 5 tabs with active dot indicator
- Screen transitions: fade-in with slight translateX animation (0.22s ease)

### Data Flow
- All data from Supabase (no hardcoded data in components)
- Zustand stores fetch from Supabase on mount
- Optimistic UI updates for lead status changes
- Real-time subscriptions for notifications (Supabase Realtime)

### QR Code Generation
- Use Google Charts API: `https://chart.googleapis.com/chart?cht=qr&chs=200x200&chl={data}`
- Client-side only, no backend function needed
- Include `onerror` fallback with canvas-drawn placeholder

### Charts (Chart.js 4.4)
- Team performance: horizontal bar chart with green/orange/red bars
- Weekly report: line chart with area fill
- Initialize charts after screen transition (`setTimeout(init, 120)`)
- Destroy previous chart instance before creating new one

### YouTube Videos
- Embed via iframe: `https://www.youtube.com/embed/{videoId}?autoplay=0&rel=0`
- Video IDs per car: corolla=suqtQAPxiBM, yaris=Yj1YmRrAQao, lc=ZE6MkxVRKXM, bz4x=Yj1YmRrAQao, hilux=suqtQAPxiBM, gr86=ZE6MkxVRKXM

### SVG Icons
- Extract all `<symbol>` elements from prototype's SVG sprite
- Convert to individual React components or use an icon system
- Icons used: ic-home, ic-car, ic-lead, ic-report, ic-profile, ic-bell, ic-search, ic-back, ic-fuel, ic-seat, ic-gear, ic-power, ic-shield, ic-eco, ic-calendar, ic-phone, ic-note, ic-target, ic-chart, ic-pipeline, ic-star, ic-qr, ic-check, ic-play

### Car Images
- Use Toyota CDN URLs from prototype CARS data
- TMNA: `tmna.aemassets.toyota.com/is/image/toyota/...`
- Toyota TH: `toyota.co.th/media/product/series/gallery/...`
- Include loading skeleton while images load

## Security Checklist

- [ ] RLS enabled on ALL Supabase tables
- [ ] No Supabase service_role key in frontend code
- [ ] Only anon key in .env.local
- [ ] Protected routes check role before rendering
- [ ] API calls use Supabase client (auto-attaches auth token)
- [ ] .env.local in .gitignore

## Quality Checklist

- [ ] All screens match prototype pixel-for-pixel
- [ ] 3-level filter works: Type > Model > Budget + search
- [ ] Spec accordion opens/closes with ▼▲ toggle
- [ ] QR code generates and displays correctly
- [ ] 15-minute countdown timer works
- [ ] Chart.js renders on dashboard and reports
- [ ] PWA installable (Lighthouse PWA score ≥ 90)
- [ ] Works offline (cached shell + fallback screen)
- [ ] Responsive: phone (390px) + tablet (768px)
- [ ] Thai text renders correctly (Sarabun font loaded)
- [ ] Navigation history stack works (goBack)
- [ ] Role-based access enforced (manager-only screens)

## Commands Reference

When using OpenSpec workflow:
- `/opsx:propose` — Already done (see proposal.md)
- `/opsx:apply` — Start implementing from tasks.md
- `/opsx:verify` — Validate implementation against specs
- `/opsx:archive` — Finalize when all tasks complete
