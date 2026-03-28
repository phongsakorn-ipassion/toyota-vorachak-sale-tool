export const ROLES = { SALES: 'sales', MANAGER: 'mgr' }

export const LEAD_LEVELS = {
  hot: { label: 'Hot', labelTh: 'ร้อน', color: '#DC2626', bg: 'bg-red-50', text: 'text-hot', icon: '🔥' },
  warm: { label: 'Warm', labelTh: 'อุ่น', color: '#D97706', bg: 'bg-amber-50', text: 'text-warm', icon: '🌡️' },
  cool: { label: 'Cool', labelTh: 'เย็น', color: '#2563EB', bg: 'bg-blue-50', text: 'text-cool', icon: '❄️' },
  won: { label: 'Won', labelTh: 'ชนะ', color: '#10B981', bg: 'bg-emerald-50', text: 'text-won', icon: '✓' },
}

export const CAR_TYPES = [
  { id: 'all', label: 'ทั้งหมด' },
  { id: 'sedan', label: 'Sedan' },
  { id: 'crossover', label: 'Crossover' },
  { id: 'suv', label: 'SUV' },
  { id: 'ev', label: 'EV' },
  { id: 'pickup', label: 'Pickup' },
  { id: 'sport', label: 'Sport' },
]

export const BUDGET_RANGES = [
  { id: 'all', label: 'ทั้งหมด' },
  { id: 'under800', label: '< ฿800K', fn: v => v < 800000 },
  { id: '800to1300', label: '฿800K–1.3M', fn: v => v >= 800000 && v <= 1300000 },
  { id: 'over1300', label: '> ฿1.3M', fn: v => v > 1300000 },
]

export const LOAN_TERMS = [12, 24, 36, 48, 60, 72, 84]
export const DEFAULT_INTEREST_RATE = 2.79

export const LEAD_SOURCES = ['Walk-in', 'LINE OA', 'Facebook', 'โทรศัพท์', 'Website', 'Referral']

export const PIPELINE_STAGES = [
  { id: 'new', label: 'ใหม่', color: '#3B82F6' },
  { id: 'test_drive', label: 'ทดสอบรถ', color: '#F59E0B' },
  { id: 'negotiation', label: 'เจรจา', color: '#8B5CF6' },
  { id: 'won', label: 'ชนะ', color: '#10B981' },
  { id: 'lost', label: 'แพ้', color: '#6B7280' },
]
