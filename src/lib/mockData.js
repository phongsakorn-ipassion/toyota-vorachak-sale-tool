// ============================================================================
// Complete mock data extracted from Toyota-SaleTool-Prototype-v5.html
// ============================================================================

export const CARS = {
  corolla: {
    id: 'corolla', name: 'Corolla Altis 2026', type: 'Sedan', cat: 'sedan',
    price: 909000, priceLabel: '฿909,000',
    fuel: 'Hybrid', seats: '5', gearbox: 'CVT Auto', power: '140 hp',
    avail: 'In Stock', stock: '3 units — สาขาลาดพร้าว',
    warranty: '3 ปี / 100,000 กม.', eco: '23.3 km/L', bg: '#EEF2FF',
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
    fuel: 'Hybrid', seats: '5', gearbox: 'CVT Auto', power: '116 hp',
    avail: 'In Transit', stock: 'คาดว่าถึง 2 สัปดาห์',
    warranty: '3 ปี / 100,000 กม.', eco: '30.2 km/L', bg: '#FEF3C7',
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
    fuel: 'Diesel', seats: '7', gearbox: '6AT', power: '204 hp',
    avail: 'In Stock', stock: '1 unit — สาขาบางนา',
    warranty: '5 ปี / 150,000 กม.', eco: '12.5 km/L', bg: '#FEE2E2',
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
    fuel: 'Diesel', seats: '5', gearbox: '6MT / 6AT', power: '204 hp',
    avail: 'In Stock', stock: '5 units — หลายสาขา',
    warranty: '3 ปี / 100,000 กม.', eco: '11.6 km/L', bg: '#F0FDF4',
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
    fuel: 'Petrol', seats: '4', gearbox: '6MT / 6AT', power: '235 hp',
    avail: 'In Stock', stock: '1 unit — Limited Edition',
    warranty: '3 ปี / 100,000 กม.', eco: '12.0 km/L', bg: '#FDF2F8',
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

export const LEADS = {
  duangjai: {
    id: 'duangjai', name: 'ดวงใจ ทองดี', init: 'ด', color: '#DC2626',
    level: 'hot', source: 'Walk-in · สาขาลาดพร้าว', car: 'yaris',
    phone: '081-234-5678', email: 'duangjai@email.com',
    createdAt: '2026-03-25T10:00:00',
    activities: [
      { id: 'a1', type: 'call', title: 'โทรติดตามลูกค้า', content: 'ลูกค้าสนใจ Yaris Cross สี Burgundy — นัดทดสอบ วันเสาร์', time: '2026-03-27T14:30:00' },
      { id: 'a2', type: 'note', title: 'บันทึกข้อมูล', content: 'ลูกค้ามีรถเก่าต้องการเทิร์น — ประเมินราคา ฿180,000', time: '2026-03-26T11:00:00' },
      { id: 'a3', type: 'meeting', title: 'Walk-in สาขาลาดพร้าว', content: 'ลูกค้าเข้าชมโชว์รูม สนใจ Yaris Cross และ Corolla Altis', time: '2026-03-25T10:00:00' },
    ],
  },
  prawit: {
    id: 'prawit', name: 'ประวิทย์ จันทร์แจ่ม', init: 'ป', color: '#8B5CF6',
    level: 'warm', source: 'LINE OA', car: 'lc',
    phone: '089-876-5432', email: 'prawit@email.com',
    createdAt: '2026-03-20T09:00:00',
    activities: [
      { id: 'a4', type: 'call', title: 'โทรแจ้งราคาพิเศษ', content: 'เสนอแพ็กเกจดาวน์ 10% สำหรับ Land Cruiser', time: '2026-03-26T16:00:00' },
      { id: 'a5', type: 'note', title: 'ข้อมูลเพิ่มเติม', content: 'ลูกค้าเป็นเจ้าของธุรกิจ ต้องการรถ SUV สำหรับครอบครัว', time: '2026-03-22T10:30:00' },
    ],
  },
  oranee: {
    id: 'oranee', name: 'อรณี สุขสม', init: 'อ', color: '#F59E0B',
    level: 'warm', source: 'Facebook Lead', car: 'corolla',
    phone: '062-345-6789', email: 'oranee@email.com',
    createdAt: '2026-03-22T14:00:00',
    activities: [
      { id: 'a6', type: 'meeting', title: 'นัดหมายที่โชว์รูม', content: 'นัดทดสอบ Corolla Altis วันอาทิตย์ เวลา 13:00', time: '2026-03-24T09:00:00' },
    ],
  },
  jirawat: {
    id: 'jirawat', name: 'จิรวัฒน์ ศรีรัตน์', init: 'จ', color: '#10B981',
    level: 'won', source: 'Referral', car: 'hilux',
    phone: '095-678-1234', email: 'jirawat@email.com',
    createdAt: '2026-03-15T11:00:00',
    activities: [
      { id: 'a7', type: 'booking', title: 'จองรถสำเร็จ', content: 'ชำระเงินจอง ฿5,000 — Hilux Revo Double Cab', time: '2026-03-26T15:00:00' },
      { id: 'a8', type: 'meeting', title: 'ทดสอบรถ', content: 'ทดสอบ Hilux Revo บนเส้นทางจริง', time: '2026-03-20T10:00:00' },
      { id: 'a9', type: 'call', title: 'โทรนัดหมาย', content: 'นัดทดสอบรถ Hilux Revo', time: '2026-03-18T14:00:00' },
    ],
  },
}

export const LEADS_LIST = Object.values(LEADS)

export const BRANCHES = [
  { id: 'lp', name: 'สาขาลาดพร้าว', code: 'LP', location: 'ลาดพร้าว, กทม.' },
  { id: 'bn', name: 'สาขาบางนา', code: 'BN', location: 'บางนา, กทม.' },
  { id: 'on', name: 'สาขาอ่อนนุช', code: 'ON', location: 'อ่อนนุช, กทม.' },
]

export const TEAM_MEMBERS = [
  { id: 'malee', name: 'มาลี นวลสุข', init: 'ม', color: '#FF6B6B', units: 8, target: 10, leads: 12, conversion: 67 },
  { id: 'suda', name: 'สุดา อิ่มสม', init: 'ส', color: '#FFD93D', units: 6, target: 10, leads: 10, conversion: 60 },
  { id: 'somchai', name: 'สมชาย ชอบสัน', init: 'ส', color: '#4D96FF', units: 5, target: 10, leads: 14, conversion: 36 },
  { id: 'prayut', name: 'ประยุทธ กิจวัฒน์', init: 'ป', color: '#6BCB77', units: 4, target: 10, leads: 8, conversion: 50 },
  { id: 'napa', name: 'นภา รักษ์สม', init: 'น', color: '#9B59B6', units: 3, target: 10, leads: 6, conversion: 50 },
]

export const DASHBOARD_KPIS = {
  totalUnits: { value: 26, target: 50, label: 'ยอดขายรวม', unit: 'คัน' },
  revenue: { value: 23400000, target: 50000000, label: 'รายได้', unit: '฿' },
  activeLeads: { value: 42, target: 0, label: 'ลีดที่เปิดอยู่', unit: 'ราย' },
  conversion: { value: 24, target: 35, label: 'อัตราการแปลง', unit: '%' },
}

export const WEEKLY_DATA = {
  labels: ['W1', 'W2', 'W3', 'W4'],
  units: [48, 62, 71, 64],
}

export const AI_INSIGHTS = [
  { id: 'i1', type: 'alert', title: 'สมชายมียอดขายต่ำกว่าเป้า 50%', message: 'แนะนำให้จัดอบรมเทคนิคการปิดการขาย', icon: '🚨' },
  { id: 'i2', type: 'warning', title: 'Lead จาก Facebook ลดลง 15%', message: 'ตรวจสอบ campaign โฆษณาและ budget', icon: '⚠️' },
  { id: 'i3', type: 'info', title: 'Yaris Cross มียอดจองสูงสุด', message: 'พิจารณาสต็อกเพิ่มเติมสำหรับเดือนหน้า', icon: '💡' },
]

export const NOTIFICATIONS = [
  { id: 'n1', title: 'ลีดใหม่จาก Facebook', body: 'คุณสมศักดิ์ สนใจ Corolla Altis — โปรดติดต่อภายใน 24 ชม.', type: 'lead_update', read: false, time: '2026-03-28T09:00:00' },
  { id: 'n2', title: 'จองสำเร็จ!', body: 'คุณจิรวัฒน์ จอง Hilux Revo เรียบร้อยแล้ว', type: 'booking', read: false, time: '2026-03-27T15:30:00' },
  { id: 'n3', title: 'เป้าหมายประจำสัปดาห์', body: 'ทีมขายสาขาลาดพร้าว ทำได้ 70% ของเป้า', type: 'info', read: true, time: '2026-03-27T08:00:00' },
  { id: 'n4', title: 'นัดหมายพรุ่งนี้', body: 'คุณดวงใจ นัดทดสอบ Yaris Cross เวลา 10:00', type: 'info', read: true, time: '2026-03-26T18:00:00' },
]

export const DEMO_USERS = {
  sales: { id: 'demo-sales', email: 'sales@demo.com', name: 'สมศักดิ์ ดีงาม', role: 'sales', branch: 'lp' },
  mgr: { id: 'demo-mgr', email: 'manager@demo.com', name: 'วิชัย ผู้จัดการ', role: 'mgr', branch: 'lp' },
}
