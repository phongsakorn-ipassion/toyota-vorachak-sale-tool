// ============================================================================
// Mock data matching Toyota-SaleTool-Prototype-v5.html exactly
// ============================================================================

// SVG placeholder generator for reliable car images
export function carPlaceholder(name, color) {
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="640" height="480" viewBox="0 0 640 480"><rect width="640" height="480" fill="${color || '#f5f5f5'}"/><text x="320" y="200" text-anchor="middle" font-family="sans-serif" font-size="28" font-weight="bold" fill="#333">${name}</text><text x="320" y="240" text-anchor="middle" font-family="sans-serif" font-size="16" fill="#666">Toyota</text><path d="M180 320 Q220 280 260 300 L280 310 Q300 290 340 290 Q380 290 400 310 L420 300 Q460 280 500 320 L500 340 Q500 360 480 360 L200 360 Q180 360 180 340 Z" fill="#999" opacity="0.3"/><circle cx="240" cy="360" r="25" fill="#666"/><circle cx="240" cy="360" r="12" fill="#999"/><circle cx="440" cy="360" r="25" fill="#666"/><circle cx="440" cy="360" r="12" fill="#999"/></svg>`;
  return `data:image/svg+xml,${encodeURIComponent(svg)}`;
}

// Unsplash free car images (CORS-friendly, reliable CDN)
const CAR_IMAGES = {
  corolla: 'https://images.unsplash.com/photo-1621007947382-bb3c3994e3fb?w=640&h=480&fit=crop',
  yaris: 'https://images.unsplash.com/photo-1609521263047-f8f205293f24?w=640&h=480&fit=crop',
  lc: 'https://images.unsplash.com/photo-1519641471654-76ce0107ad1b?w=640&h=480&fit=crop',
  bz4x: 'https://images.unsplash.com/photo-1560958089-b8a1929cea89?w=640&h=480&fit=crop',
  hilux: 'https://images.unsplash.com/photo-1559416523-140ddc3d238c?w=640&h=480&fit=crop',
  gr86: 'https://images.unsplash.com/photo-1544636331-e26879cd4d9b?w=640&h=480&fit=crop',
};

export const CARS = {
  corolla: {
    id: 'corolla', name: 'Corolla Altis 2026', type: 'Sedan', cat: 'sedan',
    price: 909000, priceLabel: '฿909,000',
    fuel: '1.8L Hybrid', seats: '5', gearbox: 'CVT Auto', power: '140 hp',
    avail: 'In Stock', stock: '3 units — สาขาลาดพร้าว',
    warranty: '3 ปี / 100,000 กม.', eco: '23.3 km/L', bg: '#EEF2FF',
    shape: 'sedan',
    img: CAR_IMAGES.corolla,
    imgs: {
      ext: CAR_IMAGES.corolla,
      side: CAR_IMAGES.corolla,
      rear: CAR_IMAGES.corolla,
      int: CAR_IMAGES.corolla,
    },
    video: 'suqtQAPxiBM',
    specs: {
      engine: [['เครื่องยนต์', '1.8L 4-Cylinder Hybrid'], ['แรงม้า', '140 hp @ 5,200 rpm'], ['แรงบิด', '177 Nm @ 3,600 rpm'], ['ระบบเกียร์', 'CVT อัตโนมัติ'], ['ระบบขับเคลื่อน', 'FWD'], ['อัตราสิ้นเปลือง', '23.3 km/L']],
      dim: [['ความยาว', '4,620 mm'], ['ความกว้าง', '1,780 mm'], ['ความสูง', '1,435 mm'], ['ฐานล้อ', '2,700 mm'], ['ความจุถังน้ำมัน', '50 L'], ['น้ำหนัก', '1,335 kg']],
      safety: ['7 ถุงลม SRS', 'Toyota Safety Sense 3.0', 'ระบบเบรก ABS + EBD + BA', 'ระบบควบคุมเสถียรภาพ VSC', 'กล้องมองหลัง', 'เซ็นเซอร์ถอยหลัง'],
      features: ['จอ 9" ระบบสัมผัส', 'Apple CarPlay / Android Auto', 'เบาะหนังแท้', 'ระบบปรับอากาศอัตโนมัติ 2 โซน', 'สตาร์ทด้วยปุ่มกด', 'กุญแจอัจฉริยะ Smart Key'],
    },
  },
  yaris: {
    id: 'yaris', name: 'Yaris Cross 2026', type: 'Crossover', cat: 'crossover',
    price: 799000, priceLabel: '฿799,000',
    fuel: '1.5L Hybrid', seats: '5', gearbox: 'CVT Auto', power: '116 hp',
    avail: 'In Transit', stock: 'คาดว่าถึง 2 สัปดาห์',
    warranty: '3 ปี / 100,000 กม.', eco: '30.2 km/L', bg: '#FEF3C7',
    shape: 'cross',
    img: CAR_IMAGES.yaris,
    imgs: {
      ext: CAR_IMAGES.yaris,
      side: CAR_IMAGES.yaris,
      rear: CAR_IMAGES.yaris,
      int: CAR_IMAGES.yaris,
    },
    video: 'Yj1YmRrAQao',
    specs: {
      engine: [['เครื่องยนต์', '1.5L 3-Cylinder Hybrid'], ['แรงม้า', '116 hp'], ['แรงบิด', '145 Nm'], ['ระบบเกียร์', 'CVT'], ['ระบบขับเคลื่อน', 'FWD / AWD'], ['อัตราสิ้นเปลือง', '30.2 km/L']],
      dim: [['ความยาว', '4,180 mm'], ['ความกว้าง', '1,765 mm'], ['ความสูง', '1,560 mm'], ['ฐานล้อ', '2,560 mm'], ['ความจุถังน้ำมัน', '36 L'], ['น้ำหนัก', '1,190 kg']],
      safety: ['7 ถุงลม SRS', 'Toyota Safety Sense', 'Pre-Collision System', 'Lane Departure Alert', 'Auto High Beam', 'กล้องมองหลัง'],
      features: ['จอ 8" ระบบสัมผัส', 'Apple CarPlay / Android Auto', 'ไฟ LED ออโต้', 'ระบบปรับอากาศอัตโนมัติ', 'Wireless Charger', 'สตาร์ทด้วยปุ่มกด'],
    },
  },
  lc: {
    id: 'lc', name: 'Land Cruiser FJ', type: 'SUV', cat: 'suv',
    price: 1269000, priceLabel: '฿1,269,000',
    fuel: '2.8L Diesel', seats: '7', gearbox: '6AT', power: '204 hp',
    avail: 'In Stock', stock: '1 unit — สาขาบางนา',
    warranty: '5 ปี / 150,000 กม.', eco: '12.5 km/L', bg: '#FEE2E2',
    shape: 'suv',
    img: CAR_IMAGES.lc,
    imgs: {
      ext: CAR_IMAGES.lc,
      side: CAR_IMAGES.lc,
      rear: CAR_IMAGES.lc,
      int: CAR_IMAGES.lc,
    },
    video: 'ZE6MkxVRKXM',
    specs: {
      engine: [['เครื่องยนต์', '2.8L 4-Cylinder Turbo Diesel'], ['แรงม้า', '204 hp @ 3,000 rpm'], ['แรงบิด', '500 Nm @ 1,600 rpm'], ['ระบบเกียร์', '6-Speed Auto'], ['ระบบขับเคลื่อน', '4WD'], ['อัตราสิ้นเปลือง', '12.5 km/L']],
      dim: [['ความยาว', '4,925 mm'], ['ความกว้าง', '1,980 mm'], ['ความสูง', '1,935 mm'], ['ฐานล้อ', '2,850 mm'], ['ความจุถังน้ำมัน', '80 L'], ['น้ำหนัก', '2,490 kg']],
      safety: ['8 ถุงลม SRS', 'Toyota Safety Sense', 'Multi-Terrain Select', 'Crawl Control', 'กล้อง 360°', 'ระบบช่วยเบรกฉุกเฉิน'],
      features: ['จอ 12.3" ระบบสัมผัส', 'JBL Premium Audio 14 ลำโพง', 'เบาะหนังแท้ 3 แถว', 'ซันรูฟไฟฟ้า', 'หน้าจอหลังเบาะ', 'Wireless Charger'],
    },
  },
  bz4x: {
    id: 'bz4x', name: 'bZ4X Electric', type: 'EV', cat: 'ev',
    price: 1529000, priceLabel: '฿1,529,000',
    fuel: 'Electric', seats: '5', gearbox: 'Single Speed', power: '218 hp',
    avail: 'In Stock', stock: '2 units — สาขาลาดพร้าว',
    warranty: '5 ปี / 150,000 กม.', eco: '6.2 km/kWh', bg: '#DBEAFE',
    shape: 'ev',
    img: CAR_IMAGES.bz4x,
    imgs: {
      ext: CAR_IMAGES.bz4x,
      side: CAR_IMAGES.bz4x,
      rear: CAR_IMAGES.bz4x,
      int: CAR_IMAGES.bz4x,
    },
    video: 'Yj1YmRrAQao',
    specs: {
      engine: [['มอเตอร์', 'Dual Motor AWD'], ['แรงม้า', '218 hp'], ['แรงบิด', '337 Nm'], ['แบตเตอรี่', '71.4 kWh Lithium-ion'], ['ระยะทาง', '500 km (WLTP)'], ['ชาร์จเร็ว', 'DC 150kW (80% ใน 30 นาที)']],
      dim: [['ความยาว', '4,690 mm'], ['ความกว้าง', '1,860 mm'], ['ความสูง', '1,650 mm'], ['ฐานล้อ', '2,850 mm'], ['ความจุเก็บสัมภาระ', '452 L'], ['น้ำหนัก', '2,010 kg']],
      safety: ['8 ถุงลม SRS', 'Toyota Safety Sense 3.0', 'ระบบเบรกฉุกเฉิน PCS', 'ระบบช่วยรักษาช่องทาง LTA', 'ระบบตรวจจุดบอด BSM', 'กล้อง Panoramic View'],
      features: ['จอ 12.3" ระบบสัมผัส', 'Harman Kardon Audio', 'หลังคา Solar Panel', 'Heat Pump A/C', 'Wireless Charger + CarPlay', 'Digital Key'],
    },
  },
  hilux: {
    id: 'hilux', name: 'Hilux Revo 2026', type: 'Pickup', cat: 'pickup',
    price: 649000, priceLabel: '฿649,000',
    fuel: '2.8L Diesel', seats: '5', gearbox: '6MT / 6AT', power: '204 hp',
    avail: 'In Stock', stock: '5 units — หลายสาขา',
    warranty: '3 ปี / 100,000 กม.', eco: '11.6 km/L', bg: '#F0FDF4',
    shape: 'pickup',
    img: CAR_IMAGES.hilux,
    imgs: {
      ext: CAR_IMAGES.hilux,
      side: CAR_IMAGES.hilux,
      rear: CAR_IMAGES.hilux,
      int: CAR_IMAGES.hilux,
    },
    video: 'suqtQAPxiBM',
    specs: {
      engine: [['เครื่องยนต์', '2.8L 4-Cylinder Turbo Diesel'], ['แรงม้า', '204 hp @ 3,400 rpm'], ['แรงบิด', '500 Nm @ 1,600 rpm'], ['ระบบเกียร์', '6-Speed Auto / Manual'], ['ระบบขับเคลื่อน', '4WD'], ['อัตราสิ้นเปลือง', '11.6 km/L']],
      dim: [['ความยาว', '5,325 mm'], ['ความกว้าง', '1,855 mm'], ['ความสูง', '1,815 mm'], ['ฐานล้อ', '3,085 mm'], ['ความจุถังน้ำมัน', '80 L'], ['น้ำหนัก', '2,080 kg']],
      safety: ['6 ถุงลม SRS', 'Toyota Safety Sense', 'Hill Assist Control', 'Trailer Sway Control', 'กล้องมองหลัง', 'เซ็นเซอร์ถอยหลัง'],
      features: ['จอ 8" ระบบสัมผัส', 'Apple CarPlay / Android Auto', 'เบาะหนังสังเคราะห์', 'Diff Lock หลัง', 'ระบบปรับอากาศอัตโนมัติ', 'USB-C ชาร์จเร็ว'],
    },
  },
  gr86: {
    id: 'gr86', name: 'GR 86 2026', type: 'Sport', cat: 'sport',
    price: 1899000, priceLabel: '฿1,899,000',
    fuel: '2.4L Petrol', seats: '4', gearbox: '6MT / 6AT', power: '235 hp',
    avail: 'In Stock', stock: '1 unit — Limited Edition',
    warranty: '3 ปี / 100,000 กม.', eco: '12.0 km/L', bg: '#FDF2F8',
    shape: 'sport',
    img: CAR_IMAGES.gr86,
    imgs: {
      ext: CAR_IMAGES.gr86,
      side: CAR_IMAGES.gr86,
      rear: CAR_IMAGES.gr86,
      int: CAR_IMAGES.gr86,
    },
    video: 'ZE6MkxVRKXM',
    specs: {
      engine: [['เครื่องยนต์', '2.4L Flat-4 Boxer'], ['แรงม้า', '235 hp @ 7,000 rpm'], ['แรงบิด', '250 Nm @ 3,700 rpm'], ['ระบบเกียร์', '6-Speed Manual / Auto'], ['ระบบขับเคลื่อน', 'RWD'], ['อัตราสิ้นเปลือง', '12.0 km/L']],
      dim: [['ความยาว', '4,265 mm'], ['ความกว้าง', '1,775 mm'], ['ความสูง', '1,310 mm'], ['ฐานล้อ', '2,575 mm'], ['ความจุถังน้ำมัน', '50 L'], ['น้ำหนัก', '1,270 kg']],
      safety: ['6 ถุงลม SRS', 'Toyota Safety Sense', 'Track Mode', 'Sport ABS', 'กล้องมองหลัง', 'ระบบควบคุมเสถียรภาพ VSC Sport'],
      features: ['จอ 8" ระบบสัมผัส', 'Apple CarPlay / Android Auto', 'เบาะ Sport แบบ Alcantara', 'ระบบไอเสียคู่ Sports', 'เกจ์วัดแบบ Digital', 'Push Start / Smart Key'],
    },
  },
}

export const CARS_LIST = Object.values(CARS)

// Model filter options (associated with car types for 3-level filtering)
export const MODEL_FILTERS = [
  { id: 'all', label: 'ทั้งหมด', cat: null },
  { id: 'corolla', label: 'Corolla Altis', cat: 'sedan' },
  { id: 'yaris', label: 'Yaris Cross', cat: 'crossover' },
  { id: 'lc', label: 'Land Cruiser FJ', cat: 'suv' },
  { id: 'bz4x', label: 'bZ4X', cat: 'ev' },
  { id: 'hilux', label: 'Hilux Revo', cat: 'pickup' },
  { id: 'gr86', label: 'GR 86', cat: 'sport' },
]

// Leads matching prototype exactly
export const LEADS = {
  duangjai: {
    id: 'duangjai', name: 'ดวงใจ ทองดี', init: 'ด', color: '#DC2626',
    leadType: 'purchase', level: 'hot', source: 'Walk-in · สาขาลาดพร้าว', car: 'yaris',
    phone: '081-234-5678', email: 'duangjai@email.com',
  },
  prawit: {
    id: 'prawit', name: 'ประวิทย์ จันทร์', init: 'ป', color: '#8B5CF6',
    leadType: 'purchase', level: 'warm', source: 'LINE OA', car: 'lc',
    phone: '089-876-5432', email: 'prawit@email.com',
  },
  oranee: {
    id: 'oranee', name: 'อรณี สุขสม', init: 'อ', color: '#F59E0B',
    leadType: 'purchase', level: 'warm', source: 'Facebook Lead', car: 'bz4x',
    phone: '062-345-6789', email: 'oranee@email.com',
  },
  jirawat: {
    id: 'jirawat', name: 'จิรวัฒน์ ศรีรัตน์', init: 'จ', color: '#10B981',
    leadType: 'purchase', level: 'won', source: 'Referral', car: 'corolla',
    phone: '095-678-1234', email: 'jirawat@email.com',
  },
  // Test Drive Leads
  td_somchai: {
    id: 'td_somchai', name: 'สมชาย พลายงาม', init: 'ส', color: '#3B82F6',
    leadType: 'test_drive', level: 'scheduled', source: 'Walk-in', car: 'yaris',
    phone: '089-111-2222', email: 'somchai@email.com',
    testDriveDate: '2026-04-02', testDriveTime: '10:00', serviceCenter: 'sc1',
    notes: 'สนใจ Yaris Cross สีขาว',
    createdAt: '2026-03-31T09:00:00+07:00',
    activities: [
      { id: 'act_td1', type: 'test_drive', title: 'นัดทดลองขับ', description: 'Yaris Cross วันที่ 2 เม.ย. 10:00', createdAt: '2026-03-31T09:00:00+07:00', createdBy: 'มาลี' }
    ],
  },
  td_nisa: {
    id: 'td_nisa', name: 'นิสา แก้วมณี', init: 'น', color: '#8B5CF6',
    leadType: 'test_drive', level: 'confirmed', source: 'LINE OA', car: 'corolla',
    phone: '091-333-4444',
    testDriveDate: '2026-04-01', testDriveTime: '14:00', serviceCenter: 'sc2',
    notes: '',
    createdAt: '2026-03-30T14:00:00+07:00',
    activities: [
      { id: 'act_td2', type: 'test_drive', title: 'นัดทดลองขับ', description: 'Corolla Altis วันที่ 1 เม.ย. 14:00', createdAt: '2026-03-30T14:00:00+07:00', createdBy: 'มาลี' }
    ],
  },
  td_wichai: {
    id: 'td_wichai', name: 'วิชัย สุขสันต์', init: 'ว', color: '#10B981',
    leadType: 'test_drive', level: 'completed', source: 'Facebook', car: 'hilux',
    phone: '085-555-6666',
    testDriveDate: '2026-03-28', testDriveTime: '11:00', serviceCenter: 'sc1',
    notes: 'ทดลองขับเสร็จ สนใจซื้อ',
    createdAt: '2026-03-27T10:00:00+07:00',
    activities: [
      { id: 'act_td3', type: 'test_drive', title: 'ทดลองขับเสร็จสิ้น', description: 'Hilux Revo ทดสอบแล้ว ลูกค้าพอใจ', createdAt: '2026-03-28T12:00:00+07:00', createdBy: 'มาลี' }
    ],
  },
}

export const LEADS_LIST = Object.values(LEADS)

// Gallery views for car detail
export const GALLERY_VIEWS = [
  { id: 'ext', label: 'Exterior', bg: 'linear-gradient(160deg,#F0FAF3 0%,#E2F2E8 100%)' },
  { id: 'side', label: 'Side View', bg: 'linear-gradient(160deg,#F0FAF3 0%,#E8F0FA 100%)' },
  { id: 'rear', label: 'Rear', bg: 'linear-gradient(160deg,#FAF0F3 0%,#F0F3FA 100%)' },
  { id: 'int', label: 'Interior', bg: 'linear-gradient(160deg,#F5F0FA 0%,#FAF0F3 100%)' },
  { id: 'vid', label: 'Video', bg: '#111827' },
]

// Color options for car detail
export const COLOR_OPTIONS = [
  { name: 'Pearl White', hex: '#F5F5F0' },
  { name: 'Black Mica', hex: '#1a1a1a' },
  { name: 'Silver Metallic', hex: '#C0C0C0' },
  { name: 'Blue Metallic', hex: '#2563EB' },
  { name: 'Red Mica', hex: '#DC2626' },
]

// Lead sources for A-Card form
export const LEAD_SOURCES = ['Walk-in', 'LINE OA', 'Facebook', 'Instagram', 'Event', 'Referral']

// Team members matching prototype leaderboard
export const TEAM_MEMBERS = [
  { id: 'malee', name: 'มาลี รักดี', init: 'ม', color: '#1B7A3F', units: 61, target: 70 },
  { id: 'suda', name: 'สุดา เจริญผล', init: 'ส', color: '#FFD93D', units: 52, target: 70 },
  { id: 'somchai', name: 'สมชาย วงษ์ดี', init: 'ส', color: '#4D96FF', units: 45, target: 70 },
  { id: 'prayut', name: 'ประยุทธ สมใจ', init: 'ป', color: '#6BCB77', units: 38, target: 70 },
  { id: 'napa', name: 'นภา สุขสม', init: 'น', color: '#9B59B6', units: 29, target: 70 },
]

// Pipeline data matching prototype
export const PIPELINE_DATA = {
  hot: {
    label: 'HOT', count: 7, color: '#DC2626', bg: '#FEF2F2', border: '#FECACA',
    cards: [
      { name: 'ดวงใจ ทองดี', car: 'Yaris Cross', rep: 'มาลี', price: '฿799K' },
      { name: 'ธนวัฒน์ มีชัย', car: 'Land Cruiser FJ', rep: 'สุดา', price: '฿1,269K' },
      { name: 'สิริพร วรรณา', car: 'bZ4X', rep: 'สมชาย', price: '฿1,529K' },
    ],
  },
  warm: {
    label: 'WARM', count: 12, color: '#D97706', bg: '#FFFBEB', border: '#FDE68A',
    cards: [
      { name: 'ประวิทย์ จันทร์', car: 'Land Cruiser FJ', rep: 'สุดา', price: '฿1,269K' },
      { name: 'อรณี สุขสม', car: 'bZ4X', rep: 'สมชาย', price: '฿1,529K' },
      { name: 'กมลชนก รุ่งเรือง', car: 'Corolla Altis', rep: 'มาลี', price: '฿909K' },
    ],
  },
  cool: {
    label: 'COOL', count: 23, color: '#2563EB', bg: '#EFF6FF', border: '#BFDBFE',
    cards: [
      { name: 'วิรัตน์ บุญมา', car: 'Hilux Revo', rep: 'ประยุทธ', price: '฿649K' },
      { name: 'ศิริลักษณ์ ดำรงค์', car: 'GR 86', rep: 'นภา', price: '฿1,899K' },
    ],
  },
  won: {
    label: 'WON', count: 45, color: '#16A34A', bg: '#F0FDF4', border: '#BBF7D0',
    cards: [
      { name: 'จิรวัฒน์ ศรีรัตน์', car: 'Corolla Altis 2026', rep: 'มาลี', price: '฿909K', won: true },
      { name: 'พรพิมล วงษ์ทอง', car: 'Yaris Cross', rep: 'สุดา', price: '฿799K', won: true },
    ],
  },
}

// Notifications matching prototype
export const NOTIFICATIONS = [
  { id: 'n1', type: 'hot', icon: 'flame', color: '#DC2626', borderColor: '#DC2626', title: 'Hot Lead: ดวงใจ ทองดี', body: 'ตัดสินใจซื้อ Yaris Cross วันนี้ — ต้องติดตามด่วน', time: '10 นาทีที่แล้ว' },
  { id: 'n2', type: 'warn', icon: 'calendar', color: '#D97706', borderColor: '#EA580C', title: 'นัดหมาย 14:00 วันนี้', body: 'ประวิทย์ จันทร์ — Land Cruiser FJ Test Drive', time: '3 ชั่วโมงที่แล้ว' },
  { id: 'n3', type: 'success', icon: 'check', color: '#16A34A', borderColor: '#16A34A', title: 'จิรวัฒน์ ศรีรัตน์ — WON', body: 'Corolla Altis 2026 Pearl White — ฿909,000', time: 'เมื่อวาน 16:30' },
  { id: 'n4', type: 'info', icon: 'car', color: '#6B7280', borderColor: '#E5E7EB', title: 'สต็อค Yaris Cross อัปเดต', body: '3 คัน สี Pearl White พร้อมส่ง 2 เม.ย.', time: 'เมื่อวาน 09:00' },
  { id: 'n5', type: 'info', icon: 'target', color: '#6B7280', borderColor: '#E5E7EB', title: 'เป้าหมายรายสัปดาห์', body: 'ต้องปิดอีก 25 units ภายใน 3 วัน — สู้ๆ!', time: '2 วันที่แล้ว' },
]

// Weekly data for chart
export const WEEKLY_DATA = {
  labels: ['W1', 'W2', 'W3', 'W4'],
  units: [48, 62, 71, 64],
}

// Top models for reports
export const TOP_MODELS = [
  { name: 'Yaris Cross', units: 38 },
  { name: 'Corolla Altis', units: 32 },
  { name: 'Hilux Revo', units: 28 },
  { name: 'Land Cruiser FJ', units: 18 },
  { name: 'bZ4X EV', units: 14 },
  { name: 'GR 86', units: 8 },
]

// Branch targets for targets page
export const BRANCH_TARGETS = [
  { name: 'สาขาลาดพร้าว', units: 117, target: 150 },
  { name: 'สาขาอ่อนนุช', units: 62, target: 100 },
  { name: 'สาขาบางนา', units: 66, target: 100 },
]

export const BRANCHES = [
  { id: 'lp', name: 'สาขาลาดพร้าว', code: 'LP', location: 'ลาดพร้าว' },
  { id: 'on', name: 'สาขาอ่อนนุช', code: 'ON', location: 'อ่อนนุช' },
  { id: 'bn', name: 'สาขาบางนา', code: 'BN', location: 'บางนา' },
]

export const DASHBOARD_KPIS = {
  totalUnits: { value: 245, target: 350, label: 'ยอดขายรวม', unit: 'คัน' },
  revenue: { value: 218500000, label: 'รายได้รวม', unit: '฿' },
  activeLeads: { value: 42, label: 'ลีดที่เปิดอยู่', unit: 'ราย' },
  conversion: { value: 32, target: 35, label: 'อัตราการแปลง', unit: '%' },
}

export const AI_INSIGHTS = [
  { id: 'ai1', title: 'แนะนำติดตาม ดวงใจ ทองดี', body: 'Hot lead ยังไม่ได้ติดตาม 2 วัน — ควรโทรติดตามวันนี้', type: 'urgent' },
  { id: 'ai2', title: 'Yaris Cross ขายดีสุดสัปดาห์นี้', body: '38 คัน สูงกว่าเป้า 15% — แนะนำเพิ่มสต็อค', type: 'insight' },
  { id: 'ai3', title: 'อัตราปิดการขายดีขึ้น', body: 'เพิ่มขึ้น 5% จากสัปดาห์ที่แล้ว — ทีมทำได้ดี!', type: 'positive' },
]

export const DEMO_USERS = {
  sales: { id: 'demo-sales', email: 'malee.sales', name: 'มาลี', role: 'sales', init: 'ม' },
  mgr: { id: 'demo-mgr', email: 'manager', name: 'วิชัย', role: 'mgr', init: 'ว' },
}
