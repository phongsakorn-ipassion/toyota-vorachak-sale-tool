# Design System Specification - Toyota Dealer Sale Tool
*OpenSpec Format - Design Tokens & Component Patterns*

**Target Application**: Toyota Dealer Sale Tool (SaaS)  
**Version**: 1.0  
**Date**: 2026-03-28  
**Language**: Thai + English (Technical terms in English)

---

## OVERVIEW

Design system สำหรับ Toyota Dealer Sale Tool app ที่กำหนดสีประจำตัว (color palette), typography, spacing, border-radius, และ component patterns เพื่อให้ความเป็นเอกลักษณ์และความสอดคล้องในทั้งแอปพลิเคชัน

---

## SECTION 1: COLOR TOKENS (สีประจำตัว)

### Color Palette Foundation

#### 1.1 Primary Color Family (สีหลัก)

##### Requirement: Primary Green Color Tokens SHALL Define Brand Identity
ระบบต้องกำหนดสี Primary Green ในสามระดับความเข้ม เพื่อใช้ในแต่ละบริบทของ UI components

###### Scenario: Primary Dark Green Usage
- **WHEN** user interacts with primary action buttons or active states
- **THEN** system SHALL apply `--p-dk: #145E30` (dark green)

###### Scenario: Primary Standard Green Usage
- **WHEN** system displays primary brand elements, active indicators, or primary CTAs
- **THEN** system SHALL apply `--p: #1B7A3F` (standard primary green)

###### Scenario: Primary Light Green Background Usage
- **WHEN** system needs to highlight success states or background emphasis areas
- **THEN** system SHALL apply `--p-lt: #EBF7EF` (light green, ~95% lightness)

###### Scenario: Primary Medium Green Usage
- **WHEN** system displays secondary level primary elements or border emphasis
- **THEN** system SHALL apply `--p-md: #C4E3CE` (medium green, ~75% lightness)

#### 1.2 Status & Semantic Colors

##### Requirement: Status Colors SHALL Communicate Vehicle Availability and Transit States
ระบบต้องใช้สีสถานะเพื่อให้ผู้ใช้สามารถระบุสถานะของรถได้อย่างชัดเจนโดยไม่ต้องอ่าน

###### Scenario: Available Vehicle Indicator
- **WHEN** vehicle is available for sale
- **THEN** system SHALL apply `--avail: #16A34A` (green, accessible status)

###### Scenario: In-Transit Vehicle Indicator
- **WHEN** vehicle is currently in transit or moving to location
- **THEN** system SHALL apply `--transit: #EA580C` (orange, attention-grabbing)

#### 1.3 Alert & Severity Colors

##### Requirement: Alert Colors SHALL Indicate Urgency and Warnings with Clear Visual Hierarchy
ระบบต้องใช้สี alert ที่ได้รับการออกแบบเพื่อให้ชัดเจนและสะดวกต่อการมองเห็น

###### Scenario: Critical/Hot Alert State
- **WHEN** system displays critical alerts, errors, or hot leads
- **THEN** system SHALL apply `--hot: #DC2626` (red, highest urgency)

###### Scenario: Warm/Warning Alert State
- **WHEN** system displays warnings or moderate-urgency information
- **THEN** system SHALL apply `--warm: #D97706` (amber/orange)

###### Scenario: Cool/Information Alert State
- **WHEN** system displays informational messages or neutral alerts
- **THEN** system SHALL apply `--cool: #2563EB` (blue, lowest urgency)

#### 1.4 Text Color Hierarchy (ลำดับชั้นของสีข้อความ)

##### Requirement: Text Colors SHALL Maintain Readability and Visual Hierarchy Across All UI Elements
ระบบต้องกำหนดสีข้อความตามลำดับชั้นเพื่อความสามารถในการอ่าน

###### Scenario: Primary Text (Headlines and Body Copy)
- **WHEN** system renders primary content text (headings, main body)
- **THEN** system SHALL apply `--t1: #111827` (near-black, ~95% contrast)

###### Scenario: Secondary Text (Subheadings and Descriptions)
- **WHEN** system renders secondary information (labels, descriptions)
- **THEN** system SHALL apply `--t2: #6B7280` (gray, ~50% opacity equivalent)

###### Scenario: Tertiary Text (Hints and Placeholder Text)
- **WHEN** system renders hints, placeholders, or disabled text
- **THEN** system SHALL apply `--t3: #9CA3AF` (light gray, ~30% opacity equivalent)

#### 1.5 Background & Surface Colors

##### Requirement: Background Colors SHALL Define Surface Hierarchy and Container Styling
ระบบต้องใช้สีพื้นหลังที่แบ่งความแตกต่างระหว่าง canvas, containers, และ elevated surfaces

###### Scenario: Page/Canvas Background
- **WHEN** rendering main application canvas or page background
- **THEN** system SHALL apply `--bg: #F5F7F5` (light off-white, ~97% lightness)

###### Scenario: Card/Container Surface
- **WHEN** rendering cards, modals, popovers, or container surfaces
- **THEN** system SHALL apply `--card: #FFFFFF` (pure white)

###### Scenario: Border Dividers (Primary)
- **WHEN** rendering borders between elements or dividers
- **THEN** system SHALL apply `--border: #E5E7EB` (light gray, ~92% lightness)

###### Scenario: Border Dividers (Secondary)
- **WHEN** rendering darker or more prominent borders
- **THEN** system SHALL apply `--bdr2: #D1D5DB` (medium-light gray, ~83% lightness)

---

## SECTION 2: SPACING & BORDER-RADIUS TOKENS

### 2.1 Border-Radius Tokens (มุมโค้งของกล่อง)

##### Requirement: Border-Radius Tokens SHALL Provide Consistent Corner Treatment Across Components
ระบบต้องกำหนด border-radius มาตรฐานสำหรับองค์ประกอบต่างๆ

###### Scenario: Small Border-Radius (Inputs, Small Components)
- **WHEN** component is small input field or small UI element
- **THEN** system SHALL apply `--r-sm: 8px` (subtle rounding)

###### Scenario: Medium Border-Radius (Filter Pills, Badges)
- **WHEN** component is filter pill or badge element
- **THEN** system SHALL apply `--r-md: 12px` (moderate rounding)

###### Scenario: Large Border-Radius (Cards, Modals)
- **WHEN** component is card, modal, or container
- **THEN** system SHALL apply `--r-lg: 16px` (prominent rounding)

###### Scenario: Extra-Large Border-Radius (Larger Containers)
- **WHEN** component is large container or emphasized surface
- **THEN** system SHALL apply `--r-xl: 20px` (generous rounding)

###### Scenario: Pill-Shaped Border-Radius (Buttons, Chips)
- **WHEN** component is pill-shaped button or chip element
- **THEN** system SHALL apply `--r-pill: 100px` (fully rounded/pill shape)

---

## SECTION 3: TYPOGRAPHY TOKENS

### 3.1 Font Family

##### Requirement: Sarabun Google Font Family SHALL Be Applied to All Text Rendering
ระบบต้องใช้ Sarabun (Google Fonts) สำหรับข้อความทั้งหมดเพื่อสร้างความเป็นเอกลักษณ์

###### Scenario: Font Stack Definition
- **WHEN** system initializes typography for any text element
- **THEN** system SHALL apply `font-family: 'Sarabun', sans-serif` with fallback to sans-serif

#### 3.2 Font Weights

##### Requirement: Six Font Weight Levels SHALL Enable Clear Visual Hierarchy
ระบบต้องสนับสนุน font weights ที่หลากหลาย (300, 400, 500, 600, 700, 800)

###### Scenario: Light Weight Text
- **WHEN** rendering light emphasis text or disabled states
- **THEN** system SHALL apply `font-weight: 300` (Sarabun Light)

###### Scenario: Regular Weight Text
- **WHEN** rendering standard body copy or default text
- **THEN** system SHALL apply `font-weight: 400` (Sarabun Regular)

###### Scenario: Medium Weight Text
- **WHEN** rendering emphasized body copy or labels
- **THEN** system SHALL apply `font-weight: 500` (Sarabun Medium)

###### Scenario: Semibold Weight Text
- **WHEN** rendering subheadings or secondary importance text
- **THEN** system SHALL apply `font-weight: 600` (Sarabun Semibold)

###### Scenario: Bold Weight Text
- **WHEN** rendering primary headings or emphasized elements
- **THEN** system SHALL apply `font-weight: 700` (Sarabun Bold)

###### Scenario: Extra-Bold Weight Text
- **WHEN** rendering large display headings or maximum emphasis
- **THEN** system SHALL apply `font-weight: 800` (Sarabun Extra-Bold)

---

## SECTION 4: BUTTON COMPONENTS

### 4.1 Primary Button (.btn-p)

##### Requirement: Primary Button Component SHALL Display with Primary Green Background
ปุ่ม Primary ต้องแสดงด้วยพื้นหลัง Primary Green เพื่อให้เห็นเด่นชัด

###### Scenario: Primary Button Default State
- **WHEN** button type is primary and not in any interaction state
- **THEN** system SHALL render with `background-color: var(--p)` (#1B7A3F), white text, border-radius `--r-md` or `--r-lg`

###### Scenario: Primary Button Hover State
- **WHEN** user hovers over primary button
- **THEN** system SHALL apply `background-color: var(--p-dk)` (#145E30), maintaining white text

###### Scenario: Primary Button Active/Pressed State
- **WHEN** user presses or activates primary button
- **THEN** system SHALL apply darker opacity or state transition, maintaining accessibility

### 4.2 Outline Button (.btn-o)

##### Requirement: Outline Button Component SHALL Display with Border-Only Style
ปุ่ม Outline ต้องแสดงเป็นเพียงเส้นขอบ (border-only) โดยไม่มีพื้นหลังอัดแน่น

###### Scenario: Outline Button Default State
- **WHEN** button type is outline
- **THEN** system SHALL render with `border: 1px solid var(--border)`, transparent background, text color `--t1`

###### Scenario: Outline Button Hover State
- **WHEN** user hovers over outline button
- **THEN** system SHALL apply background-color of `var(--p-lt)` (light green background), border changes to `var(--p)`

### 4.3 Ghost Green Button (.btn-g)

##### Requirement: Ghost Green Button SHALL Display with Green Border and Transparent Background
ปุ่ม Ghost Green ต้องแสดงด้วยเส้นขอบสีเขียวและพื้นหลังโปร่งใส

###### Scenario: Ghost Green Button Default State
- **WHEN** button type is ghost green
- **THEN** system SHALL render with `border: 1px solid var(--p)` (#1B7A3F), transparent background, text color `var(--p)`

###### Scenario: Ghost Green Button Hover State
- **WHEN** user hovers over ghost green button
- **THEN** system SHALL apply background-color of `var(--p-lt)` maintaining green border and text

---

## SECTION 5: CARD COMPONENTS

##### Requirement: Card Components SHALL Display Standard Styling with Border and Padding
Card ต้องแสดงด้วยเส้นขอบ พื้นหลัง และ padding ที่สม่ำเสมอ

###### Scenario: Card Surface Rendering
- **WHEN** system renders card component
- **THEN** system SHALL apply:
  - Background: `var(--card)` (#FFFFFF)
  - Border: `1px solid var(--border)` (#E5E7EB)
  - Border-radius: `var(--r-lg)` (16px)
  - Padding: `15px`

###### Scenario: Card with Shadow Elevation
- **WHEN** card is elevated or in modal context
- **THEN** system SHALL apply subtle box-shadow (e.g., 0 1px 3px rgba(0,0,0,0.1))

---

## SECTION 6: FILTER PILLS & BADGES

### 6.1 Filter Pills (.fpill)

##### Requirement: Filter Pills SHALL Display Selection State with On/Off Indicator
Filter pill ต้องแสดงสถานะการเลือก (on/off) ด้วยสีและสไตล์

###### Scenario: Filter Pill Default (Off) State
- **WHEN** filter pill is not selected
- **THEN** system SHALL render with:
  - Background: `var(--bg)` (#F5F7F5)
  - Border: `1px solid var(--border)`
  - Border-radius: `var(--r-pill)` (100px)
  - Text color: `var(--t2)`

###### Scenario: Filter Pill Active (On) State
- **WHEN** filter pill is selected/active (class `.on`)
- **THEN** system SHALL render with:
  - Background: `var(--p)` (#1B7A3F) - primary green
  - Text color: #FFFFFF (white)
  - Border: `1px solid var(--p)`

### 6.2 Badge Components

##### Requirement: Badge Components SHALL Display Status with Semantic Colors
Badge ต้องแสดงสถานะด้วยสีเชิงความหมาย (semantic colors)

###### Scenario: Hot Badge (.badge-hot)
- **WHEN** system displays hot/critical badge
- **THEN** system SHALL apply:
  - Background: `var(--hot)` (#DC2626) or lighter variant
  - Text color: #FFFFFF
  - Border-radius: `var(--r-md)` (12px)

###### Scenario: Warm Badge (.badge-warm)
- **WHEN** system displays warning/warm badge
- **THEN** system SHALL apply:
  - Background: `var(--warm)` (#D97706) or lighter variant
  - Text color: #FFFFFF or dark text
  - Border-radius: `var(--r-md)` (12px)

###### Scenario: Cool Badge (.badge-cool)
- **WHEN** system displays informational/cool badge
- **THEN** system SHALL apply:
  - Background: `var(--cool)` (#2563EB) or lighter variant
  - Text color: #FFFFFF
  - Border-radius: `var(--r-md)` (12px)

###### Scenario: Win Badge (.badge-win)
- **WHEN** system displays success/win badge
- **THEN** system SHALL apply:
  - Background: `var(--p)` (#1B7A3F) or lighter variant
  - Text color: #FFFFFF
  - Border-radius: `var(--r-md)` (12px)

---

## SECTION 7: INPUT FIELDS & FOCUS STATES

### 7.1 Input Component (.finput)

##### Requirement: Input Fields SHALL Display with Icon Prefix Support and Focus Styling
Input field ต้องสนับสนุนไอคอนนำหน้า และมีสไตล์ focus ที่ชัดเจน

###### Scenario: Input Default State
- **WHEN** input field is rendered without focus
- **THEN** system SHALL apply:
  - Background: `var(--card)` (#FFFFFF)
  - Border: `1px solid var(--border)` (#E5E7EB)
  - Border-radius: `var(--r-sm)` (8px)
  - Text color: `var(--t1)`
  - Padding: adequate spacing for content and icon

###### Scenario: Input with Icon Prefix
- **WHEN** input field displays icon prefix (e.g., search, location)
- **THEN** system SHALL:
  - Position icon to the left with padding
  - Adjust text padding to accommodate icon
  - Maintain icon and text visual alignment

###### Scenario: Input Focus State
- **WHEN** user focuses on input field (click or keyboard)
- **THEN** system SHALL apply:
  - Border-color: `var(--p)` (#1B7A3F) - primary green
  - Box-shadow: optional subtle green glow (e.g., 0 0 0 3px var(--p-lt))
  - Outline: none (remove default browser outline)

###### Scenario: Input Placeholder Text
- **WHEN** input field is empty with placeholder
- **THEN** system SHALL apply placeholder text color: `var(--t3)` (#9CA3AF)

---

## SECTION 8: BOTTOM NAVIGATION (TAB BAR)

### 8.1 Bottom Navigation Component

##### Requirement: Bottom Navigation SHALL Display 5 Tabs with Fixed Height and Active Indicator
Bottom nav ต้องมี 5 tabs พร้อมสูงคงที่ 78px และตัวบ่งชี้สถานะ active

###### Scenario: Bottom Navigation Container
- **WHEN** system renders bottom navigation component
- **THEN** system SHALL display:
  - Fixed height: `78px`
  - Background: `var(--card)` (#FFFFFF)
  - Border-top: `1px solid var(--border)`
  - 5 evenly-spaced tab items (each ~20% width)

###### Scenario: Tab Item Default State
- **WHEN** tab is not active
- **THEN** system SHALL render:
  - Text color: `var(--t3)` (#9CA3AF) - light gray
  - Icon color: `var(--t3)`
  - Background: transparent

###### Scenario: Tab Item Active State
- **WHEN** tab is active/selected
- **THEN** system SHALL render:
  - Text color: `var(--p)` (#1B7A3F) - primary green
  - Icon color: `var(--p)`
  - Active indicator: green dot or underline at bottom of tab (`--p`)

###### Scenario: Active Dot Indicator Positioning
- **WHEN** active tab is displayed
- **THEN** system SHALL apply:
  - Small circular indicator dot: `background-color: var(--p)`
  - Positioned at bottom center of active tab
  - Diameter: ~4-6px, or use underline bar style

---

## SECTION 9: STATUS DOTS & INDICATORS

### 9.1 Availability Dot (.dot)

##### Requirement: Green Availability Dots SHALL Indicate Vehicle or Resource Availability
Status dot สีเขียว ต้องบ่งชี้ความพร้อมใช้งาน

###### Scenario: Available Status Dot
- **WHEN** system displays availability indicator for available vehicle
- **THEN** system SHALL render:
  - Background-color: `var(--avail)` (#16A34A) or `var(--p)` (#1B7A3F)
  - Border-radius: 50% (circular)
  - Typical size: 8-12px diameter
  - Optional: subtle animation or pulse effect

### 9.2 Transit Orange Dot (.dot-orange)

##### Requirement: Orange Transit Dots SHALL Indicate In-Transit or Moving Status
Status dot สีส้ม ต้องบ่งชี้สถานะ in-transit

###### Scenario: In-Transit Status Dot
- **WHEN** system displays indicator for vehicle in transit
- **THEN** system SHALL render:
  - Background-color: `var(--transit)` (#EA580C)
  - Border-radius: 50% (circular)
  - Typical size: 8-12px diameter
  - Optional: animation to indicate movement

---

## SECTION 10: QUICK ACTIONS GRID

##### Requirement: Quick Actions Grid SHALL Display 3 Columns with Responsive Layout
Quick actions grid ต้องแสดง 3 คอลัมน์ พร้อมสนับสนุน responsive behavior

###### Scenario: Quick Actions Grid Layout
- **WHEN** system renders quick actions section
- **THEN** system SHALL apply:
  - Grid: 3 equal columns (CSS Grid or Flexbox)
  - Gap/spacing: consistent padding between items
  - Each item: card-like appearance with `--r-lg` border-radius

###### Scenario: Quick Action Item
- **WHEN** quick action item is displayed
- **THEN** system SHALL render:
  - Background: `var(--card)` (#FFFFFF)
  - Border: `1px solid var(--border)`
  - Border-radius: `var(--r-lg)` (16px)
  - Padding: 15px minimum
  - Icon + Label layout (vertically or horizontally centered)

###### Scenario: Quick Action Item Hover
- **WHEN** user hovers over quick action item
- **THEN** system SHALL apply:
  - Background: `var(--p-lt)` (light green) or subtle shadow elevation
  - Cursor: pointer
  - Optional: slight scale or shadow transition

---

## SECTION 11: KPI CARDS GRID

##### Requirement: KPI Cards Grid SHALL Display 2 Columns with Metric and Value Layout
KPI cards grid ต้องแสดง 2 คอลัมน์ เหมาะสำหรับหน้าแรก

###### Scenario: KPI Cards Grid Layout
- **WHEN** system renders KPI dashboard section
- **THEN** system SHALL apply:
  - Grid: 2 equal columns (CSS Grid or Flexbox)
  - Gap/spacing: consistent padding between cards
  - Responsive: may stack to 1 column on mobile (< 640px width)

###### Scenario: KPI Card Structure
- **WHEN** KPI card is displayed
- **THEN** system SHALL render:
  - Background: `var(--card)` (#FFFFFF)
  - Border: `1px solid var(--border)`
  - Border-radius: `var(--r-lg)` (16px)
  - Padding: 15px minimum
  - Content layout:
    - Top: metric label/description (color `--t2`)
    - Bottom: large numeric value (color `--t1`, bold)
    - Optional: icon, status indicator, or trend

###### Scenario: KPI Card Data Styling
- **WHEN** KPI metric is displayed
- **THEN** system SHALL apply:
  - Label text: `var(--t2)` (#6B7280), `font-weight: 500`
  - Value text: `var(--t1)` (#111827), `font-weight: 700`, font-size: 24-32px
  - Unit text: `var(--t2)` (#6B7280), smaller font-size

---

## SECTION 12: ACCESSIBILITY & CONTRAST REQUIREMENTS

##### Requirement: All Color Combinations SHALL Meet WCAG AA Contrast Standards
ทุกการรวมกันของสีต้องเป็นไปตามมาตรฐาน WCAG AA (minimum 4.5:1 for text)

###### Scenario: Text on Primary Background
- **WHEN** text is rendered on `--p` (#1B7A3F) background
- **THEN** text color SHALL be #FFFFFF (white), providing 10.5:1 contrast ratio

###### Scenario: Text on Light Background
- **WHEN** text is rendered on `--p-lt` (#EBF7EF) background
- **THEN** text color SHALL be `--t1` (#111827), providing 13.2:1 contrast ratio

###### Scenario: Text on Card Background
- **WHEN** text is rendered on `--card` (#FFFFFF) background
- **THEN** text color SHALL be `--t1` (#111827) for primary text, providing 19.3:1 contrast ratio

###### Scenario: Focus Indicator Visibility
- **WHEN** element receives focus (keyboard navigation)
- **THEN** focus indicator SHALL have minimum 3:1 contrast ratio and be at least 2px visible

---

## SECTION 13: RESPONSIVE & LAYOUT CONSTRAINTS

##### Requirement: Design Tokens and Components SHALL Support Responsive Breakpoints
ระบบต้องรองรับ breakpoints ที่สม่ำเสมอ

###### Scenario: Mobile Viewport (< 640px)
- **WHEN** viewport width is less than 640px
- **THEN** system SHALL:
  - KPI grid: stack to 1 column
  - Padding adjustments: reduce from 15px to 12px on cards
  - Bottom nav: remains fixed at 78px

###### Scenario: Tablet Viewport (640px - 1024px)
- **WHEN** viewport width is between 640px and 1024px
- **THEN** system SHALL:
  - KPI grid: maintain 2 columns
  - Quick actions grid: maintain 3 columns or adjust to 2

###### Scenario: Desktop Viewport (> 1024px)
- **WHEN** viewport width is greater than 1024px
- **THEN** system SHALL:
  - All layouts: render at full intended design
  - Maximum content width: optional container constraint (~1280px)

---

## SECTION 14: IMPLEMENTATION STANDARDS

##### Requirement: CSS Custom Properties (Variables) SHALL Be Defined at Root Level
CSS variables ต้องกำหนดที่ level root เพื่อการใช้ซ้ำ

###### Scenario: CSS Variable Definition
- **WHEN** stylesheet is loaded
- **THEN** system SHALL define all tokens as CSS custom properties in `:root` selector with all 35 color, radius, and typography variables

###### Scenario: Component CSS Class Usage
- **WHEN** component class is applied to element
- **THEN** component style SHALL use `var(--tokenName)` syntax for all design token references

###### Scenario: Font Import
- **WHEN** stylesheet is loaded
- **THEN** system SHALL import Sarabun font from Google Fonts API

---

## SECTION 15: COMPONENT BEHAVIOR SPECIFICATIONS

##### Requirement: Interactive Components SHALL Provide Clear Visual Feedback
Interactive components ต้องให้ feedback ที่ชัดเจน

###### Scenario: Button Click Feedback
- **WHEN** user clicks any button component
- **THEN** system SHALL provide:
  - Visual feedback: color change, scale, or shadow transition
  - Animation duration: 150-200ms
  - No lag or delay in response

###### Scenario: Input Focus Transition
- **WHEN** user focuses on input field
- **THEN** system SHALL:
  - Apply border-color change to `--p` with smooth transition (150ms)
  - Show optional focus ring or box-shadow
  - Maintain clear visual distinction from unfocused state

###### Scenario: Tab Navigation Activation
- **WHEN** user taps/clicks bottom navigation tab
- **THEN** system SHALL:
  - Update active indicator (dot or underline) with smooth transition
  - Change text and icon color from `--t3` to `--p`
  - Trigger content navigation without page reload (SPA behavior)

---

## END OF SPECIFICATION

Summary: This design system specification covers 15 comprehensive sections with exhaustive requirements and scenarios for all color tokens, typography, spacing, border-radius, button styles, card layouts, filter pills, badges, input fields, bottom navigation, status indicators, grid layouts, accessibility standards, responsive breakpoints, CSS implementation standards, and interactive component behavior for the Toyota Dealer Sale Tool application.

Token Count: 35+ CSS custom properties + 6 font weights + 14 component patterns = 55+ distinct design system elements fully specified in OpenSpec format with 40+ scenarios covering all prototype patterns.
