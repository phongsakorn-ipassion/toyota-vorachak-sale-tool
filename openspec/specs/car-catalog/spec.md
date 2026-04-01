# Car Catalog Spec — Toyota Sale Tool
**OpenSpec Format** | v1.0 | 2026-03-28  
*ระบบ Car Catalog สำหรับ Toyota Dealer Sale Tool*

---

## Overview

The **Car Catalog** is the primary showroom discovery interface in the Toyota Sale Tool. It enables sales staff (iPad) and customers (mobile/web) to browse, filter, and explore Toyota vehicle models with rich details, imagery, and specifications. The catalog features a 3-level hierarchical filter system (Type → Model → Budget) combined with live search, supporting dealership inventory integration.

**Primary Audience:** Sales staff (iPad), Customers (mobile/web)  
**Context:** Showroom → customer-facing discovery before lead capture or booking

---

## ## ADDED Requirements

### Requirement: Car Data Model
The system must maintain a comprehensive car entity with the following properties:

```javascript
{
  // Identity & Classification
  name: string,              // ชื่อรุ่น (e.g., "Corolla Altis")
  type: string,              // ประเภทรถ enum: sedan|crossover|suv|ev|pickup|sport
  cat: string,               // หมวดหมู่ (type alias for consistency)
  
  // Pricing & Availability
  price: number,             // ราคา (THB; primary sort key)
  avail: string,             // สถานะคงคลัง: in-stock|order|unavail
  stock: number,             // จำนวนคงคลัง (for manager visibility)
  
  // Physical Attributes
  shape: string,             // รูปลักษณ์ (sedan/crossover/suv/pickup/sport)
  fuel: string,              // เชื้อเพลิง: petrol|diesel|hybrid|electric
  seats: number,             // ที่นั่ง (4-8 seater)
  power: number | string,    // แรงม้า (kW / PS; engine power)
  gearbox: string,           // กระปุกเกียร์: manual|automatic|cvt
  
  // Specifications & Compliance
  eco: string | number,      // ค่าโปรแกรม/ค่า Euro (emission rating or consumption)
  warranty: string | number, // ประกันชั้น (years; e.g., "3 ปี" or 3)
  
  // Media Assets
  img: string,               // รูปหลัก (primary thumbnail URL)
  imgs: {                    // รูปเพิ่มเติม (5-view gallery)
    ext: string,             // Exterior
    side: string,            // Side view
    rear: string,            // Rear view
    int: string              // Interior
  },
  video: string,             // YouTube video URL (embed-ready ID or full URL)
  bg: string                 // Background color / accent (hex or name)
}
```

#### Scenario: Store car data in state & database
**WHEN** the app initializes  
**THEN** all 6 car models are loaded from Supabase (or local JSON fallback)  
**AND** each car object must have all required fields; missing fields default to empty string or 0  
**AND** the catalog remains responsive even if media assets load asynchronously

#### Scenario: Support car variants (future)
**WHEN** a car model has multiple color/trim options  
**THEN** the base model card shows the most popular variant (price-ranked)  
**AND** variant selection happens in the detail screen, not the list

---

### Requirement: Six Canonical Car Models
The catalog must feature exactly 6 flagship Toyota models representing the full lineup:

| Model | Type | Body | Representative (ตัวแทน) |
|-------|------|------|---|
| **Corolla Altis** | Sedan | 4-door sedan | City/family sedan leader |
| **Yaris Cross** | Crossover | Compact SUV | SUV entry-level; trend-driven youth |
| **Land Cruiser FJ** | SUV | Premium SUV | Adventure/off-road; luxury segment |
| **bZ4X** | EV | Electric SUV | Sustainability/tech; future-forward |
| **Hilux Revo** | Pickup | 2-door pickup | Work/commercial; fleet use |
| **GR 86** | Sport | Coupe | Performance; enthusiast segment |

Each model must have:
- Realistic Thai market pricing (฿600K–฿3.2M range)
- Full spec data (engine, dimensions, safety, features)
- Complete 5-view image gallery + YouTube video
- Availability status per dealership stock

---

### Requirement: Three-Level Filter Hierarchy
The catalog must implement a cascading 3-level filter with cross-linked logic:

#### Level 1: ประเภทรถ (Type Filter)
A horizontal pill/tab group allowing users to narrow by vehicle segment:

**Options:**
- ทั้งหมด (All) — shows all 6 cars; default state
- Sedan — Corolla Altis
- Crossover — Yaris Cross
- SUV — Land Cruiser FJ
- EV — bZ4X
- Pickup — Hilux Revo
- Sport — GR 86

**Behavior:**
- Click a type pill to filter Level 2 (Model) and reset Level 3 (Budget) to "All"
- Active pill shows highlighted state (bg-blue-600 / text-white or Tailwind `ring-2`)
- Pill order: fixed left-to-right as listed; no alphabetical reorder

#### Level 2: รุ่นรถ (Model Filter)
A secondary pill/badge group showing only models matching the selected Level 1 type:

**Behavior:**
- Populated dynamically based on Level 1 selection
- When Level 1 = "ทั้งหมด", all 6 model pills appear
- When Level 1 = "Sedan", only "Corolla Altis" appears
- Each pill displays: model name + icon/emoji (optional)
- Pill carries a `data-cat` attribute matching the Level 1 type for CSS cross-filtering
- Clicking a model pill applies a secondary filter to the car list
- If Level 1 changes, Level 2 is recalculated and Level 3 (Budget) is reset

#### Level 3: งบประมาณ (Budget Filter)
A tertiary pill/dropdown group allowing price-range selection:

**Options (Fixed Price Brackets):**
- ต่ำกว่า ฿800K — up to 800,000 THB
- ฿800K–฿1.3M — 800,000 to 1,300,000 THB
- ฿1.3M+ — above 1,300,000 THB

**Behavior:**
- Displayed as pills or a select dropdown (responsive choice)
- Independent from Levels 1 & 2; can be combined with any type/model
- Clicking a budget pill filters the car list to show only cars in that price range
- "Show N results" counter updates in real-time as filters change

#### Combined Filter Logic
**WHEN** user selects Type = "SUV" AND Model = "Land Cruiser FJ" AND Budget = "฿1.3M+"  
**THEN** car list updates to show only Land Cruiser FJ variants ≥ ฿1.3M  
**AND** pill colors update to show all 3 active levels  
**AND** a "Clear Filters" button appears (or resets to "ทั้งหมด" + "All" + "All")

**WHEN** user clears a filter level  
**THEN** lower-level filters remain but recalculate their options (don't show 0-result models)

---

### Requirement: Text Search Filter
A search input field that performs free-text filtering across all car fields:

**Behavior:**
- Input field at top of filter area; label "ค้นหารถ..." (Search cars...)
- Searches against: `name`, `type`, `fuel`, `gearbox`, `warranty`, `features` (text substring match)
- **Combines with Levels 1–3**: typing "hybrid" while Level 1 = "SUV" shows only SUV models with hybrid fuel
- Real-time debounced search (300ms delay before filter applies)
- Display: "X results found" below the input
- Clear button (⊗) inside search input to reset search term
- If search yields 0 results: show "ไม่พบรถที่ตรงกับการค้นหา" (No cars match your search) message

**Scenario: Search + Type filter combination**  
**WHEN** user types "hybrid" in search  
**THEN** the system filters all cars containing "hybrid" in any field  
**AND** if Level 1 = "SUV" is selected, only hybrid SUVs are shown  
**AND** the result count updates in real-time

---

### Requirement: Car List Item Card
Each car in the filtered list must display a consistent card layout with thumbnail, summary info, and quick tags:

**Card Layout (Mobile 390px, Tablet 768px):**
```
┌──────────────────────────────┐
│  ▲ Thumbnail (aspect 4:3)    │  (height: auto; image lazy-loads)
│  IMAGE (with play icon ▶)    │  (▶ only if video exists)
├──────────────────────────────┤
│ [●] Corolla Altis            │  (● = availability dot; color-coded)
│ ฿649,000                      │  (price; text-green-600 or highlight)
│ Sedan • Petrol • 5-seater    │  (category + 2–3 quick tags)
│ Automatic • 173 kW           │  (gearbox + power; secondary line)
├──────────────────────────────┤
│                              │
│   [More Details →]           │  (optional CTA; navigates to detail screen)
└──────────────────────────────┘
```

**Content Mapping:**
- **Thumbnail:** `img` field; must show immediately; overlay play icon if `video` exists
- **Availability Dot:** 
  - Green (●) = "in-stock" → "คงคลัง"
  - Yellow (●) = "order" → "สั่งได้"
  - Gray (●) = "unavail" → "สินค้าหมด"
- **Name:** `name` (e.g., "Corolla Altis")
- **Price:** `price` formatted with comma separators (e.g., "฿649,000"); green text or badge
- **Quick Tags:** `type` + `fuel` + `seats` seater (auto-generated from model data)
- **Secondary Line:** `gearbox` (manual/automatic/CVT) + `power` (kW / PS)
- **Optional CTA:** "More Details →" or "ดูรายละเอียด" link to detail screen

**Responsive Behavior:**
- **Mobile (390px):** 1 column; card width 100% - padding
- **Tablet (768px):** 2–3 columns; card flex layout with gap
- **Desktop (1024px):** 3–4 columns (stretch-to-fit)

**States:**
- **Hover:** Background color shift (e.g., Tailwind `hover:bg-gray-50`) + shadow increase
- **Unavailable (avail = "unavail"):** Opacity 60%; "Sold Out" badge overlay; link disabled
- **Loading:** Skeleton card (gray placeholder bars) until image loads

**Scenario: Display car list with filters applied**  
**WHEN** user applies filters or searches  
**THEN** the car list re-renders with matching cars only  
**AND** each card thumbnail displays the main image or a spinner if loading  
**AND** availability dot color reflects real-time stock status  
**AND** cards are sorted by price (ascending) by default

---

### Requirement: Car Detail Screen
When a user clicks a car card, a dedicated detail view displays comprehensive information:

#### Detail Screen Header
```
[< Back]  Car Name                [Share ↗]
┌─────────────────────────────────────┐
│  5-View Gallery (Carousel)          │
│  ┌─────┬─────┬─────┬─────┬─────┐   │
│  │ Ext │ Side│ Rear│ Int │ Video│   │  (tap/click to switch view)
│  └─────┴─────┴─────┴─────┴─────┘   │
└─────────────────────────────────────┘
```

**Gallery Features:**
- **Main Display:** Large image/video frame (full width or 3:4 aspect ratio)
- **Thumbnail Strip:** 5 thumbnails (Exterior, Side, Rear, Interior, Video)
- **Video Embed:** YouTube player (embed via `iframe` with YouTube video ID from `video` field)
- **Tap/Click to Switch:** Clicking a thumbnail loads that view in the main frame
- **Swipe Support (Mobile):** Left/right swipe navigates between views
- **Indicators:** Current view number (e.g., "1/5") or highlighted thumbnail border

#### Car Info Section
Below the gallery, show key identification & availability:

```
Toyota                           (brand label)
Corolla Altis
Sedan • Petrol • 5-seater
฿649,000                         (text-green-600; bold, larger)

Availability: ○ In Stock (XX units)   (● color-coded per avail field)
or "Made to Order (5-7 weeks)"
or "Sold Out"
```

**Content Mapping:**
- **Brand:** Static "Toyota" (logo optional)
- **Name:** `name`
- **Quick Specs:** `type` + `fuel` + `seats` seater
- **Price:** `price` (green, bold, large font)
- **Availability:** Text derived from `avail` + `stock` (e.g., "In Stock (3 units)")

#### Specification Grid (2 Columns)
A responsive grid showing 6 key specs in 2 columns:

```
┌───────────────────┬───────────────────┐
│ Fuel Type         │ Power (kW/PS)     │
│ Petrol            │ 173 kW / 235 PS   │
├───────────────────┼───────────────────┤
│ Seating           │ Gearbox           │
│ 5 Seater          │ Automatic 8-speed │
├───────────────────┼───────────────────┤
│ Eco Rating        │ Warranty          │
│ Euro 5            │ 3 Years / 100K km │
└───────────────────┴───────────────────┘
```

**Grid Data Mapping:**
| Label | Source | Format |
|-------|--------|--------|
| Fuel Type | `fuel` | petrol / diesel / hybrid / electric |
| Power (kW/PS) | `power` | combined format; e.g., "173 kW / 235 PS" |
| Seating | `seats` | number + " Seater"; e.g., "5 Seater" |
| Gearbox | `gearbox` | manual / automatic / CVT + optional speeds |
| Eco Rating | `eco` | e.g., "Euro 5", "Euro 6", or consumption value |
| Warranty | `warranty` | text or number + years; e.g., "3 Years / 100,000 km" |

**Responsive:**
- **Mobile (390px):** 2 columns; full width labels + values stacked
- **Tablet (768px):** 2 columns; label on top row, value on bottom row
- **Desktop:** 2–3 columns; flexible

#### Specification Accordion (4 Collapsible Sections)
Below the 2-col grid, display 4 expandable sections with detailed specs:

**Sections:**
1. **Engine (เครื่องยนต์)**
   - Contains key-value pairs: Displacement, Max Power, Max Torque, Fuel Type, Emission Standard, etc.
   - Data source: car `specs.engine` object
   
2. **Dimensions (ขนาด)**
   - Length, Width, Height, Wheelbase, Ground Clearance, Curb Weight, Max Load Capacity, etc.
   - Data source: car `specs.dim` object
   
3. **Safety (ความปลอดภัย)**
   - List of safety features as tags/badges: ABS, Airbags (dual/8), ESC, Hill Assist, ISOFIX, Blind Spot Monitor, etc.
   - Data source: car `specs.safety` array
   
4. **Features (ฟีเจอร์)**
   - List of convenience/tech features as tags/badges: Cruise Control, Climate Control, Touchscreen, Apple CarPlay, Android Auto, Panoramic Roof, etc.
   - Data source: car `specs.features` array

**Accordion Behavior:**
```
▼ Engine (เครื่องยนต์)
  Displacement: 1598 cc
  Max Power: 173 kW @ 6500 rpm
  [more fields...]

▲ Dimensions (ขนาด)
  Length: 4630 mm
  [collapsed; click to expand]
```

- Default state: All sections **collapsed** (▲ indicator)
- Click section header to toggle open/closed
- Icon: ▼ (open) / ▲ (closed)
- Only one section can be open at a time (optional; can allow multiple)
- Smooth expand/collapse animation (e.g., Tailwind `transition-all`)

**Scenario: View detailed engine specs**  
**WHEN** user clicks on "▲ Engine (เครื่องยนต์)"  
**THEN** the section expands (▼) and displays all key-value pairs  
**AND** other open sections collapse (if single-open mode)  
**AND** smooth animation provides visual feedback

#### Advisory Notice
A notice box below the accordion (optional but recommended):

```
📌 Advisory / ข้อมูล
Please contact the sales staff for the latest specifications, pricing, 
and promotional offers. Specifications subject to change.
```

- Non-critical design element; subtle colors (gray bg, small text)
- Can be toggled on/off per dealership

#### Call-to-Action Buttons
Two primary action buttons at the bottom of the detail screen:

**Layout:**
```
┌──────────────────┬──────────────────┐
│  จองรถ (Book)    │  คำนวณผ่อน       │
│                  │  (Calculate)     │
└──────────────────┴──────────────────┘
```

**Button 1: จองรถ (Book Car)**
- **Label:** "จองรถ" (Book Car) in Thai
- **Action:** Navigate to Booking flow (booking screen or modal)
- **Style:** Primary color (e.g., Tailwind `bg-blue-600 text-white`)
- **State:** Disabled if `avail` = "unavail"

**Button 2: คำนวณผ่อน (Calculate Payment)**
- **Label:** "คำนวณผ่อน" (Calculate Installment/EMI) in Thai
- **Action:** Open a calculator modal showing estimated monthly payment
  - Input: Down payment (%) or amount
  - Input: Loan term (months; e.g., 24, 36, 48, 60)
  - Calc: Monthly payment = (price - down) / term * (1 + interest_rate)
  - Display: Monthly amount, total interest, final amount
  - (Interest rate can be hardcoded or fetched from config)
- **Style:** Secondary color (e.g., Tailwind `bg-gray-100 text-gray-800`)

**Responsive:**
- **Mobile (390px):** Stack vertically; full width each
- **Tablet+:** Side-by-side; 1fr 1fr flex layout

**Scenario: Book a car from detail screen**  
**WHEN** user clicks "จองรถ" button  
**THEN** the system navigates to the Booking screen (or opens a booking modal)  
**AND** the car model & price are pre-filled in the booking form  
**AND** the user is prompted to enter customer contact info

---

### Requirement: SPECS Data Structure (Per Car Model)

Each car must have a `specs` object containing detailed information for the accordion sections:

```javascript
specs: {
  engine: {
    displacement: "1598 cc",
    maxPowerKW: 173,
    maxPowerPS: 235,
    maxPowerRPM: "6500 rpm",
    maxTorqueNm: 202,
    maxTorqueRPM: "5200 rpm",
    fuelType: "Petrol",
    fuelTank: 50,
    emissionStandard: "Euro 5",
    // ... more engine key-value pairs
  },
  
  dim: {
    length: "4630 mm",
    width: "1780 mm",
    height: "1440 mm",
    wheelbase: "2700 mm",
    groundClearance: "190 mm",
    curbWeight: "1200 kg",
    maxLoadCapacity: "450 kg",
    trunkVolume: "420 L",
    // ... more dimension key-value pairs
  },
  
  safety: [  // array of safety feature tags
    "Anti-Lock Braking System (ABS)",
    "Dual SRS Airbags",
    "Vehicle Stability Control (VSC)",
    "Hill Assist",
    "Brake Assist",
    "ISOFIX Child Seat Anchor"
  ],
  
  features: [  // array of convenience/tech feature tags
    "Automatic Climate Control",
    "8-inch Touchscreen",
    "Bluetooth Audio",
    "Apple CarPlay",
    "Android Auto",
    "Multi-function Steering Wheel",
    "Keyless Entry"
  ]
}
```

**Data Entry Notes:**
- All numeric values should be stored as numbers; display with formatted units in the UI
- String values (e.g., "1598 cc") can be pre-formatted or formatted in the template
- Safety & features are arrays of tag strings; no structure required
- **Important:** Not all cars need identical keys; the UI gracefully handles missing fields (shows "—" or skips)

**Scenario: Display engine specs for Corolla Altis**  
**WHEN** user opens Corolla Altis detail screen and expands "Engine"  
**THEN** all key-value pairs from `specs.engine` are rendered as rows  
**AND** format is "Key: Value" (e.g., "Max Power: 173 kW @ 6500 rpm")  
**AND** missing keys are skipped without errors

---

### Requirement: Real-Time Availability Integration
The catalog must reflect current stock status from the dealership backend:

**Data Flow:**
1. On app init, fetch car inventory from Supabase (`cars` table)
2. Populate `avail` & `stock` fields for each model
3. Display availability dot in car list and detail screen
4. Update in real-time if backend triggers sync (optional; can poll every 5 min)

**Business Logic:**
- **In Stock (avail = "in-stock"):** `stock > 0` → Green dot (●) → "In Stock (X units)"
- **Order (avail = "order"):** `stock ≤ 0` → Yellow dot (●) → "Available by order (5-7 weeks)"
- **Unavailable (avail = "unavail"):** Sold out or discontinued → Gray dot (●) → "Sold Out" + disabled Book button

**Scenario: Update stock in real-time**  
**WHEN** sales staff books a Corolla Altis from another iPad  
**THEN** the stock count for Corolla Altis decrements by 1 in the backend  
**AND** all active catalog instances refresh availability within 5 minutes (or on next filter change)  
**AND** the availability dot changes color if stock falls to 0

---

### Requirement: Search & Filter Performance
The catalog must handle filtering and search without lag:

**Requirements:**
- Filter/search result updates within 300ms (debounced)
- Car list re-renders smoothly without flicker
- Lazy-load images; show skeleton loader while loading
- Limit initial render to visible cards + 2 offscreen (virtual scrolling optional for 100+ cars)
- No full-page reload on filter change (SPA behavior)

**Scenario: Filter 6 cars by type**  
**WHEN** user clicks "SUV" filter  
**THEN** the list immediately shows only 2 cars (Land Cruiser FJ, bZ4X)  
**AND** the render completes within 300ms  
**AND** images lazy-load in the background

---

### Requirement: Mobile & Tablet Responsiveness
The catalog must provide an optimized experience across all device sizes:

**Breakpoints:**
- **Mobile (390px):** 1 column; filter pills scroll horizontally; images 4:3 aspect
- **Tablet (768px):** 2–3 columns; filter pills wrap vertically; larger thumbnails
- **Desktop (1024px):** 3–4 columns; full-width filters; maximum content visibility

**Detail Screen Responsiveness:**
- **Mobile:** Gallery full-width; buttons stack vertically
- **Tablet+:** Gallery 2/3 width with info panel sidebar (optional; can stack)

**Touch Interactions (Mobile/Tablet):**
- Swipe left/right to navigate gallery views
- Long-press car card to show quick preview (optional)
- Tap-to-zoom on gallery images (optional)

**Scenario: Browse cars on iPad**  
**WHEN** user opens the catalog on a tablet (768px)  
**THEN** filter pills display in a responsive 2-column wrap  
**AND** car cards show 2–3 per row  
**AND** gallery swipe gestures work smoothly

---

### Requirement: Accessibility & Localization
The catalog must meet basic accessibility standards and support Thai/English:

**Accessibility:**
- All interactive elements (pills, buttons, cards) have `aria-label` or descriptive text
- Color alone does not convey meaning; combine with icons/text
- Keyboard navigation: Tab through filters, Enter to select, Escape to close modals
- Images have `alt` text (e.g., "Corolla Altis front exterior view")
- Availability dot has a tooltip or aria-label (e.g., "In stock")

**Localization:**
- UI labels in Thai (primary); English as secondary
- All filter names, button labels, and messages translated
- Number formatting: Thai baht (฿) symbol; comma thousands separator (e.g., "฿649,000")
- Date/time (if shown): Thai calendar convention or ISO 8601 (context-dependent)

**Scenario: Navigate catalog with keyboard only**  
**WHEN** user tabs through the page  
**THEN** filter pills receive focus in order  
**AND** pressing Enter activates a pill filter  
**AND** pressing Escape closes any open modals  
**AND** all text is readable and descriptive

---

### Requirement: Data Validation & Error Handling
The system must gracefully handle missing or invalid data:

**Validation Rules:**
- Missing `img` → Display placeholder image (e.g., "No Image Available")
- Missing `video` → Hide video thumbnail from gallery; show only 4 views (Exterior, Side, Rear, Interior)
- Missing `price` → Show "Contact for pricing" or "Price on Request"
- Missing spec data → Display "—" or skip field entirely in accordion
- Invalid `avail` value → Default to "order"

**Error Handling:**
- If Supabase fetch fails → Display cached data or placeholder 6-car list
- If an image fails to load → Show broken-image icon + alt text
- If a filter query yields no results → Show "ไม่พบรถที่ตรงกับการค้นหา" message + "Clear Filters" button

**Scenario: Missing video for a car**  
**WHEN** user opens detail screen for a car without a video URL  
**THEN** the gallery displays 4 thumbnails (no Video tab)  
**AND** no error is shown to the user

---

### Requirement: Analytics & Tracking (Optional but Recommended)
The system should track user interactions for sales insights:

**Events to Track:**
- `car_list_viewed` → Type, Model, Budget filters applied
- `car_detail_opened` → Car name, source (list card click)
- `book_button_clicked` → Car name, availability status
- `payment_calculator_opened` → Car name
- `search_performed` → Search term, result count
- `filter_applied` → Filter level (Type/Model/Budget), value

**Implementation:**
- Use Supabase Analytics or Google Analytics 4
- Send events asynchronously (non-blocking)
- Include session ID & timestamp

---

## ## REMOVED Requirements

(None at this time; this is an initial spec.)

---

## ## CHANGED Requirements

(None at this time; this is an initial spec.)

---

## ## DEFERRED Requirements

The following items are **out of scope** for v1.0 and deferred to future releases:

1. **Car Configuration (Colors/Trims)**  
   - Allowing users to select specific color/trim combinations and see custom pricing
   - Deferred to v1.1 (depends on extended data model and backend support)

2. **Comparison View**  
   - Side-by-side comparison of 2–3 cars on a separate screen
   - Deferred to v1.1 (low initial priority)

3. **Wishlist / Save for Later**  
   - Ability to save cars to a personal wishlist (requires user auth)
   - Deferred to v1.1 (auth framework needed first)

4. **360-Degree Spin View**  
   - Interactive 3D car model rotation (requires 3D asset preparation)
   - Deferred to v2.0 (cost/complexity trade-off)

5. **Advanced Filtering (Engine Size, Year, Mileage)**  
   - Beyond the 3-level type/model/budget hierarchy
   - Deferred to v2.0 (UI complexity; requires deeper UX testing)

6. **Reviews & Ratings**  
   - Customer reviews, star ratings, comment threads per car
   - Deferred to v1.1+ (requires moderation and backend schema)

---

## Implementation Notes

### Data Source & Schema
- **Table:** `cars` (Supabase PostgreSQL)
- **Columns:** Align with Car Data Model (name, type, price, shape, fuel, seats, gearbox, power, avail, stock, warranty, eco, bg, cat, img, imgs.ext, imgs.side, imgs.rear, imgs.int, video, specs.engine, specs.dim, specs.safety, specs.features)
- **Fallback:** If Supabase unavailable, load from local JSON (`/data/cars.json`)

### State Management
- **Tool:** Zustand 4 (as per tech stack)
- **Store:** `useCatalogStore` with slices:
  - `cars` (array of car objects)
  - `filters` (type, model, budget)
  - `search` (search term)
  - `selectedCar` (for detail view)
  - `loading` (boolean)
  - `error` (string or null)

### Routing
- **List View:** `/catalog` (or `/` as home)
- **Detail View:** `/catalog/:carId` or `/catalog/:carName`
- React Router 6 with HashRouter

### Styling
- **Framework:** Tailwind CSS 3
- **Color Scheme:**
  - Primary: Blue (`bg-blue-600`, `text-blue-700`)
  - Success: Green (`text-green-600` for price/in-stock)
  - Warning: Yellow (`text-yellow-500` for order status)
  - Neutral: Gray (`text-gray-600` for secondary text)
- **Responsive:** Mobile-first approach; utility classes for breakpoints

### Image Optimization
- **Format:** WebP preferred; fallback to JPEG/PNG
- **Sizes:** Thumbnail (200×150), Medium (400×300), Large (800×600)
- **Lazy Loading:** Native `loading="lazy"` attribute or Intersection Observer
- **CDN:** Host on GitHub Pages or external CDN (e.g., Cloudinary)

### Video Integration
- **Platform:** YouTube
- **Embed:** `<iframe>` with video ID from `car.video` field
- **Aspect Ratio:** 16:9
- **Responsive:** Use Tailwind `aspect-video` or wrapper div

### Browser Support
- Modern browsers (Chrome 90+, Firefox 88+, Safari 14+, Edge 90+)
- iOS Safari 14+
- Android Chrome/Firefox (latest 2 versions)

---

## Testing Strategy

### Unit Tests
- Filter logic (type + model + budget combinations)
- Price formatting with Thai currency
- Search string matching (case-insensitive, substring)

### Integration Tests
- Supabase fetch & fallback to local data
- Filter application on car list (verify correct cars shown)
- Navigation between list and detail view

### E2E Tests
- User flow: Filter → Click car → View gallery → Open calculator → Book
- Responsive breakpoints (mobile, tablet, desktop)
- Keyboard navigation (Tab, Enter, Escape)
- Image lazy loading & error states

### Performance
- Lighthouse score ≥ 80 (Performance, Accessibility, Best Practices, SEO)
- FCP (First Contentful Paint) < 2s
- LCP (Largest Contentful Paint) < 3s
- CLS (Cumulative Layout Shift) < 0.1

---

## Design System & UI Components

### Colors
- **Primary Blue:** `#3B82F6` (Tailwind `bg-blue-600`)
- **Success Green:** `#16A34A` (for price, in-stock)
- **Warning Yellow:** `#EAB308` (for order status)
- **Error Red:** `#DC2626` (for errors, unavailable)
- **Neutral Gray:** `#6B7280` (secondary text)
- **Background:** `#FFFFFF` or `#F9FAFB` (light gray for sections)

### Typography
- **Heading 1 (H1):** 28px, Bold, Dark gray
- **Heading 2 (H2):** 24px, Bold, Dark gray
- **Body (P):** 16px, Regular, Gray
- **Small (Caption):** 12px, Regular, Light gray
- **Price:** 20px, Bold, Green (`text-green-600`)

### Spacing
- **Padding:** 16px (mobile), 24px (tablet/desktop)
- **Gap (cards):** 16px (mobile), 24px (tablet/desktop)
- **Border Radius:** 8px (cards), 12px (buttons)

### Icons (Optional)
- Fuel icon (⛽ or custom)
- Gearbox icon (⚙️ or custom)
- Availability dot (● colored)
- Share icon (↗)
- Play icon (▶) for video
- Expand/collapse (▼ / ▲)

---

## Release Schedule

- **v1.0 (MVP):** 2026-04-15
  - 6 car models, 3-level filters, search, detail view, basic gallery, payment calculator
  
- **v1.1:** 2026-05-30
  - Color/trim selection, comparison view, wishlist, reviews
  
- **v2.0:** 2026-07-31
  - 360-degree view, advanced filters, CRM integration, analytics dashboard

---

## IMPLEMENTED: Sprint 3-4 Enhancements

### Dropdown Filters (Sprint 3)
- Type and Budget filters changed from horizontal pills to dropdown selects
- Title Case labels for filter options
- Cleaner UI on mobile with less horizontal scrolling

### Inline Calculator (Sprint 4)
- CarDetailPage now embeds an InlineCalculator component below CTA buttons
- "คำนวณผ่อน" button scrolls to calculator section instead of navigating to /calc
- Calculator uses flat-rate formula matching Toyota dealership style
- 2-column layout on md+, stacked on mobile
- Left panel: interest rate input, down payment radio pills, loan term slider
- Right panel: monthly amount result card with breakdown grid

---

## IMPLEMENTED: Sub-Model / Grade Hierarchy (Sprint 5)

### Sub-Model Data Structure
Each car may have a `subModels` array representing trim levels / grades:

```javascript
subModels: [
  {
    id: string,           // unique grade ID (e.g., "corolla-smart")
    name: string,         // display name (e.g., "Smart 1.8")
    price: number,        // THB price for this grade
    stock: string,        // optional stock info override
    specDiffs: {          // optional spec overrides vs base model
      fuel: string,
      seats: number,
      gearbox: string,
      power: string,
    },
  },
  // ... more grades
]
```

### Grade Compare Modal
- `GradeCompareModal` component shows side-by-side comparison of all grades for a car
- Accessible via "เปรียบเทียบรุ่นย่อย / Compare Grades" button on CarDetailPage
- Displays price, key specs, and differences between grades

### SubModelSelector Component
- Horizontal scrollable card selector below the car info bar on CarDetailPage
- Each card shows grade name and price
- Selected grade updates: displayed price, stock info, and quick specs
- Falls back to car.price if no grades exist

### Flow: Model -> Grade -> Color -> Price
1. User browses catalog (CatalogPage shows "เริ่มต้น" starting price via `getStartingPrice()`)
2. User opens CarDetailPage, selects a grade from SubModelSelector
3. Price, specs, and stock update to reflect the selected grade
4. User proceeds to calculator or booking; grade selection carries through via bookingStore.selectedGrade
5. ACardPage includes sub-model dropdown for lead creation/edit
6. BookingPage Step 2 shows grade name and uses grade price for calculations
7. BookingViewPage displays grade name if present
8. LeadDetailPage, PipelinePage, SalesDashboard show grade info on lead/card displays

### Pages Integrated
- **CarDetailPage**: SubModelSelector, GradeCompareModal, grade-aware price/specs/stock
- **CatalogPage**: Starting price display via `getStartingPrice()`
- **PaymentCalcPage**: Uses grade price for calculations, shows grade name
- **ACardPage**: Sub-model dropdown in model selection for both purchase and test drive
- **BookingPage**: Grade row in Step 2 confirm, grade price for finance calculations
- **BookingViewPage**: Grade name row in booking details
- **LeadDetailPage**: Grade name in car interest card
- **PipelinePage**: Grade name on pipeline cards
- **SalesDashboard**: Grade name on hot lead carousel cards

---

**Spec Version:** 3.0
**Last Updated:** 2026-04-01
**Status:** Implemented

