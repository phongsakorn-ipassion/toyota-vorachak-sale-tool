## Why

Toyota Vorachakyont (วรจักร์ยนต์) ต้องการระบบ **Sale Tool** สำหรับพนักงานขายและผู้จัดการสาขา
เพื่อยกระดับประสบการณ์การขายรถยนต์ Toyota ให้เป็น Digital-First — ตั้งแต่การค้นหารถ,
จัดการ Lead, คำนวณผ่อน, จองรถพร้อม QR Payment ไปจนถึง Dashboard สำหรับผู้จัดการ

ระบบ Prototype (Toyota-SaleTool-Prototype-v5.html) ผ่านการตรวจสอบ UX/UI แล้ว
ขั้นตอนต่อไปคือการสร้าง **Live Demo App** เป็น PWA ที่ทำงานได้จริงบน iPad/Tablet
และ iPhone/Mobile พร้อม Supabase backend

## What Changes

- **NEW** — React 18 + Vite 5 PWA application replicating prototype pixel-for-pixel
- **NEW** — Supabase backend: Auth, PostgreSQL database, Row Level Security, Realtime
- **NEW** — Responsive layouts: phone (390px) and tablet (768px) breakpoints
- **NEW** — Service Worker with offline-first caching strategy
- **NEW** — CI/CD pipeline via GitHub Actions → GitHub Pages deployment
- **NEW** — Zustand state management replacing vanilla JS global state
- **NEW** — React Router v6 HashRouter replacing DOM class toggling navigation

## Capabilities

### New Capabilities
- `design-system`: Design tokens, typography, color palette, component library ที่ extract จาก prototype CSS ทั้งหมด
- `navigation`: Screen routing, bottom tab navigation, history stack, role-based access
- `car-catalog`: Car inventory browsing, 3-level filter hierarchy (Type > Model > Budget), car detail with gallery/specs/video
- `lead-management`: Lead list, lead detail, A-Card creation, pipeline kanban, status tracking
- `booking-payment`: Payment calculator, 3-step booking flow, QR code generation, payment confirmation
- `manager-dashboard`: KPI grid, team performance charts, AI insights, branch targets, weekly reports
- `auth`: Login with role selection, Supabase Auth integration, RLS policies, session management
- `pwa`: PWA manifest, service worker, offline fallback, responsive iPad + iPhone support

### Modified Capabilities
<!-- N/A — greenfield demo app, no existing codebase -->

## Impact

- **Frontend**: สร้างใหม่ทั้งหมดเป็น React + Tailwind CSS จาก prototype HTML/CSS/JS
- **Backend**: Supabase project ใหม่ — tables: cars, leads, bookings, users, activities
- **Auth**: Supabase Auth with email/password + role metadata
- **Deployment**: GitHub Pages via GitHub Actions CI/CD
- **Data**: Seed data ย้ายจาก prototype JS objects เข้า Supabase PostgreSQL
- **Dependencies**: react, react-router-dom, zustand, @supabase/supabase-js, chart.js, tailwindcss, vite
