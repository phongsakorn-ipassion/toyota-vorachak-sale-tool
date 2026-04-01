export const ROLES = { SALES: 'sales', MANAGER: 'mgr' }

export const LEAD_LEVELS = {
  hot: { label: 'Hot', labelTh: 'พร้อมซื้อ', color: '#DC2626', bg: '#FEF2F2', border: '#DC2626' },
  warm: { label: 'Warm', labelTh: 'สนใจ', color: '#D97706', bg: '#FFFBEB', border: '#D97706' },
  cool: { label: 'Cool', labelTh: 'สำรวจ', color: '#2563EB', bg: '#EFF6FF', border: '#2563EB' },
  won: { label: 'Won', labelTh: 'ปิดการขาย', color: '#16A34A', bg: '#F0FDF4', border: '#16A34A' },
  lost: { label: 'Lost', labelTh: 'สูญเสีย', color: '#6B7280', bg: '#F3F4F6', border: '#6B7280' },
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

export const LOAN_TERMS = [12, 24, 36, 48, 60, 72, 84]
export const DEFAULT_INTEREST_RATE = 2.49
export const DOWN_PAYMENT_OPTIONS = [5, 10, 15, 20, 25]
export const LOAN_TERM_RANGE = { min: 12, max: 84, step: 12, default: 48 }

export const GRADE_FEATURE_CLASSES = {
  standard: { label: 'มาตรฐาน', bg: '#F3F4F6', color: '#6B7280' },
  mid: { label: 'อัพเกรด', bg: '#EFF6FF', color: '#3B82F6' },
  top: { label: 'ท็อป', bg: '#FDF4FF', color: '#A855F7' },
};

export const LEAD_SOURCES = ['Walk-in', 'LINE OA', 'Facebook', 'Instagram', 'Event', 'Referral']

export const LEAD_TYPES = {
  purchase: { label: 'ลูกค้า', labelEn: 'Customer', icon: 'users' },
  test_drive: { label: 'ทดลองขับ', labelEn: 'Test Drive', icon: 'car' },
};

export const TEST_DRIVE_STATUSES = {
  scheduled: { label: 'นัดหมาย', labelEn: 'Scheduled', color: '#3B82F6', bg: '#EFF6FF' },
  confirmed: { label: 'ยืนยัน', labelEn: 'Confirmed', color: '#8B5CF6', bg: '#F5F3FF' },
  completed: { label: 'เสร็จสิ้น', labelEn: 'Completed', color: '#10B981', bg: '#ECFDF5' },
  cancelled: { label: 'ยกเลิก', labelEn: 'Cancelled', color: '#EF4444', bg: '#FEF2F2' },
  no_show: { label: 'ไม่มา', labelEn: 'No Show', color: '#6B7280', bg: '#F3F4F6' },
};
