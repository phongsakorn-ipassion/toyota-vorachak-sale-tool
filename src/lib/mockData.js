// ============================================================================
// Mock data matching Toyota-SaleTool-Prototype-v5.html exactly
// ============================================================================

export const CARS = {
  corolla: {
    id: 'corolla', name: 'Corolla Altis 2026', type: 'Sedan', cat: 'sedan',
    price: 909000, priceLabel: '฿909,000',
    fuel: '1.8L Hybrid', seats: '5', gearbox: 'CVT Auto', power: '140 hp',
    avail: 'In Stock', stock: '3 units — สาขาลาดพร้าว',
    warranty: '3 ปี / 100,000 กม.', eco: '23.3 km/L', bg: '#EEF2FF',
    shape: 'sedan',
    img: 'https://tmna.aemassets.toyota.com/is/image/toyota/toyota_2025_camry_702_exterior_1?wid=640&hei=480&fmt=webp',
    imgs: {
      ext: 'https://tmna.aemassets.toyota.com/is/image/toyota/toyota_2025_camry_702_exterior_1?wid=640&hei=480&fmt=webp',
      side: 'https://tmna.aemassets.toyota.com/is/image/toyota/toyota_2025_camry_702_exterior_2?wid=640&hei=480&fmt=webp',
      rear: 'https://tmna.aemassets.toyota.com/is/image/toyota/toyota_2025_camry_702_exterior_3?wid=640&hei=480&fmt=webp',
      int: 'https://tmna.aemassets.toyota.com/is/image/toyota/toyota_2025_camry_702_interior_1?wid=640&hei=480&fmt=webp',
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
    img: 'https://tmna.aemassets.toyota.com/is/image/toyota/toyota_2025_corollacross_702_exterior_1?wid=640&hei=480&fmt=webp',
    imgs: {
      ext: 'https://tmna.aemassets.toyota.com/is/image/toyota/toyota_2025_corollacross_702_exterior_1?wid=640&hei=480&fmt=webp',
      side: 'https://tmna.aemassets.toyota.com/is/image/toyota/toyota_2025_corollacross_702_exterior_2?wid=640&hei=480&fmt=webp',
      rear: 'https://tmna.aemassets.toyota.com/is/image/toyota/toyota_2025_corollacross_702_exterior_3?wid=640&hei=480&fmt=webp',
      int: 'https://tmna.aemassets.toyota.com/is/image/toyota/toyota_2025_corollacross_702_interior_1?wid=640&hei=480&fmt=webp',
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
    img: 'https://tmna.aemassets.toyota.com/is/image/toyota/toyota_2024_landcruiser_702_exterior_1?wid=640&hei=480&fmt=webp',
    imgs: {
      ext: 'https://tmna.aemassets.toyota.com/is/image/toyota/toyota_2024_landcruiser_702_exterior_1?wid=640&hei=480&fmt=webp',
      side: 'https://tmna.aemassets.toyota.com/is/image/toyota/toyota_2024_landcruiser_702_exterior_2?wid=640&hei=480&fmt=webp',
      rear: 'https://tmna.aemassets.toyota.com/is/image/toyota/toyota_2024_landcruiser_702_exterior_3?wid=640&hei=480&fmt=webp',
      int: 'https://tmna.aemassets.toyota.com/is/image/toyota/toyota_2024_landcruiser_702_interior_1?wid=640&hei=480&fmt=webp',
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
    img: 'https://tmna.aemassets.toyota.com/is/image/toyota/toyota_2024_bz4x_702_exterior_1?wid=640&hei=480&fmt=webp',
    imgs: {
      ext: 'https://tmna.aemassets.toyota.com/is/image/toyota/toyota_2024_bz4x_702_exterior_1?wid=640&hei=480&fmt=webp',
      side: 'https://tmna.aemassets.toyota.com/is/image/toyota/toyota_2024_bz4x_702_exterior_2?wid=640&hei=480&fmt=webp',
      rear: 'https://tmna.aemassets.toyota.com/is/image/toyota/toyota_2024_bz4x_702_exterior_3?wid=640&hei=480&fmt=webp',
      int: 'https://tmna.aemassets.toyota.com/is/image/toyota/toyota_2024_bz4x_702_interior_1?wid=640&hei=480&fmt=webp',
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
    img: 'https://tmna.aemassets.toyota.com/is/image/toyota/toyota_2024_tacoma_702_exterior_1?wid=640&hei=480&fmt=webp',
    imgs: {
      ext: 'https://tmna.aemassets.toyota.com/is/image/toyota/toyota_2024_tacoma_702_exterior_1?wid=640&hei=480&fmt=webp',
      side: 'https://tmna.aemassets.toyota.com/is/image/toyota/toyota_2024_tacoma_702_exterior_2?wid=640&hei=480&fmt=webp',
      rear: 'https://tmna.aemassets.toyota.com/is/image/toyota/toyota_2024_tacoma_702_exterior_3?wid=640&hei=480&fmt=webp',
      int: 'https://tmna.aemassets.toyota.com/is/image/toyota/toyota_2024_tacoma_702_interior_1?wid=640&hei=480&fmt=webp',
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
    img: 'https://tmna.aemassets.toyota.com/is/image/toyota/toyota_2024_gr86_702_exterior_1?wid=640&hei=480&fmt=webp',
    imgs: {
      ext: 'https://tmna.aemassets.toyota.com/is/image/toyota/toyota_2024_gr86_702_exterior_1?wid=640&hei=480&fmt=webp',
      side: 'https://tmna.aemassets.toyota.com/is/image/toyota/toyota_2024_gr86_702_exterior_2?wid=640&hei=480&fmt=webp',
      rear: 'https://tmna.aemassets.toyota.com/is/image/toyota/toyota_2024_gr86_702_exterior_3?wid=640&hei=480&fmt=webp',
      int: 'https://tmna.aemassets.toyota.com/is/image/toyota/toyota_2024_gr86_702_interior_1?wid=640&hei=480&fmt=webp',
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
    level: 'hot', source: 'Walk-in · สาขาลาดพร้าว', car: 'yaris',
    phone: '081-234-5678', email: 'duangjai@email.com',
  },
  prawit: {
    id: 'prawit', name: 'ประวิทย์ จันทร์', init: 'ป', color: '#8B5CF6',
    level: 'warm', source: 'LINE OA', car: 'lc',
    phone: '089-876-5432', email: 'prawit@email.com',
  },
  oranee: {
    id: 'oranee', name: 'อรณี สุขสม', init: 'อ', color: '#F59E0B',
    level: 'warm', source: 'Facebook Lead', car: 'bz4x',
    phone: '062-345-6789', email: 'oranee@email.com',
  },
  jirawat: {
    id: 'jirawat', name: 'จิรวัฒน์ ศรีรัตน์', init: 'จ', color: '#10B981',
    level: 'won', source: 'Referral', car: 'corolla',
    phone: '095-678-1234', email: 'jirawat@email.com',
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

export const DEMO_USERS = {
  sales: { id: 'demo-sales', email: 'malee.sales', name: 'มาลี', role: 'sales', init: 'ม' },
  mgr: { id: 'demo-mgr', email: 'manager', name: 'วิชัย', role: 'mgr', init: 'ว' },
}
