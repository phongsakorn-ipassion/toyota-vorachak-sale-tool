export const ROLES = { SALES: 'sales', MANAGER: 'mgr' }

export const LEAD_LEVELS = {
  hot: { label: 'Hot', labelTh: 'พร้อมซื้อ', color: '#DC2626', bg: '#FEF2F2', border: '#DC2626' },
  warm: { label: 'Warm', labelTh: 'สนใจ', color: '#D97706', bg: '#FFFBEB', border: '#D97706' },
  cool: { label: 'Cool', labelTh: 'สำรวจ', color: '#2563EB', bg: '#EFF6FF', border: '#2563EB' },
  won: { label: 'Won', labelTh: 'ปิดการขาย', color: '#16A34A', bg: '#F0FDF4', border: '#16A34A' },
}

export const CAR_TYPES = [
  { id: 'all', label: 'ทั้งหมด' },
  { id: 'sedan', label: 'Sedan' },
  { id: 'crossover', label: 'Crossover' },
  { id: 'suv', label: 'SUV' },
  { id: 'ev', label: 'EV', icon: 'power' },
  { id: 'pickup', label: 'Pickup' },
  { id: 'sport', label: 'Sport' },
]

export const BUDGET_RANGES = [
  { id: 'all', label: 'ทั้งหมด' },
  { id: 'under800', label: 'ต่ำกว่า ฿800K', fn: v => v < 800000 },
  { id: '800to1300', label: '฿800K-฿1.3M', fn: v => v >= 800000 && v <= 1300000 },
  { id: 'over1300', label: '฿1.3M+', fn: v => v > 1300000 },
]

export const LOAN_TERMS = [48, 60, 72]
export const DEFAULT_INTEREST_RATE = 2.49

export const LEAD_SOURCES = ['Walk-in', 'LINE OA', 'Facebook', 'Instagram', 'Event', 'Referral']
