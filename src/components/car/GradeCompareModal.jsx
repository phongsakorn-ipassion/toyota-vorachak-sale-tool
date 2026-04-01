import { useEffect } from 'react'

const fmt = (n) => typeof n === 'number' ? n.toLocaleString('th-TH') : n

// Spec comparison sections — each row maps a label to a specDiffs key or a shared car spec
const COMPARE_SECTIONS = [
  {
    title: 'PRICING / ราคา',
    rows: [
      { label: 'ราคา', key: '_price' },
    ],
  },
  {
    title: 'EXTERIOR / ภายนอก',
    rows: [
      { label: 'ล้ออัลลอย', key: 'wheels' },
      { label: 'ไฟหน้า', shared: 'LED Projector' },
      { label: 'ไฟท้าย', shared: 'LED' },
      { label: 'กระจกมองข้าง', shared: 'พับไฟฟ้า' },
      { label: 'เสาอากาศ', shared: 'Shark Fin' },
      { label: 'สปอยเลอร์', shared: 'Integrated' },
    ],
  },
  {
    title: 'INTERIOR / ภายใน',
    rows: [
      { label: 'เบาะ', key: 'seats' },
      { label: 'เบาะคนขับ', key: 'driverSeat' },
      { label: 'จอแสดงผล', key: 'display' },
      { label: 'พวงมาลัย', shared: 'หนัง Multi-function' },
      { label: 'กระจกมองหลัง', shared: 'หรี่แสงอัตโนมัติ' },
      { label: 'สีภายใน', shared: 'ดำ' },
    ],
  },
  {
    title: 'TECHNOLOGY / เทคโนโลยี',
    rows: [
      { label: 'ระบบเสียง', key: 'speakers' },
      { label: 'Apple CarPlay', shared: 'รองรับ' },
      { label: 'Android Auto', shared: 'รองรับ' },
      { label: 'Bluetooth', shared: 'รองรับ' },
      { label: 'USB / USB-C', shared: 'รองรับ' },
      { label: 'Wireless Charger', shared: 'รองรับ (เฉพาะรุ่นบน)', dynamic: true },
      { label: 'สตาร์ทด้วยปุ่มกด', shared: 'รองรับ' },
      { label: 'กุญแจอัจฉริยะ', shared: 'Smart Key' },
      { label: 'โหมดการขับขี่', key: 'driveModes' },
    ],
  },
  {
    title: 'SAFETY / ความปลอดภัย',
    rows: [
      { label: 'Toyota Safety Sense', shared: 'รองรับ' },
      { label: 'ถุงลม', shared: '7 ตำแหน่ง' },
      { label: 'ABS + EBD', shared: 'รองรับ' },
      { label: 'VSC', shared: 'รองรับ' },
      { label: 'HAC', shared: 'รองรับ' },
      { label: 'กล้องมองหลัง', shared: 'รองรับ' },
      { label: 'เซ็นเซอร์ถอยหลัง', shared: 'รองรับ' },
      { label: 'BSM (จุดบอด)', shared: 'รองรับ (เฉพาะรุ่นบน)', dynamic: true },
      { label: 'RCTA', shared: 'รองรับ (เฉพาะรุ่นบน)', dynamic: true },
      { label: 'กล้อง 360°', shared: 'รองรับ (เฉพาะรุ่นท็อป)', dynamic: true },
    ],
  },
  {
    title: 'PERFORMANCE / สมรรถนะ',
    rows: [
      { label: 'เครื่องยนต์', carSpec: 'fuel' },
      { label: 'แรงม้า', carSpec: 'power' },
      { label: 'ระบบเกียร์', carSpec: 'gearbox' },
      { label: 'ระบบปรับอากาศ', key: 'ac' },
      { label: 'อัตราสิ้นเปลือง', carSpec: 'eco' },
      { label: 'ระบบขับเคลื่อน', shared: 'ตามรุ่น' },
      { label: 'ถังน้ำมัน / แบตเตอรี่', shared: 'ตามสเปค' },
    ],
  },
  {
    title: 'DIMENSIONS / มิติ',
    rows: [
      { label: 'ความยาว', dimIdx: 0 },
      { label: 'ความกว้าง', dimIdx: 1 },
      { label: 'ความสูง', dimIdx: 2 },
      { label: 'ฐานล้อ', dimIdx: 3 },
    ],
  },
]

function getCellValue(row, grade, car, gradeIdx, totalGrades) {
  // Pricing row
  if (row.key === '_price') {
    return `฿${fmt(grade.price)}`
  }
  // specDiffs key
  if (row.key && grade.specDiffs?.[row.key]) {
    return grade.specDiffs[row.key]
  }
  // car-level spec
  if (row.carSpec && car[row.carSpec]) {
    return car[row.carSpec]
  }
  // dimensions from car.specs.dim
  if (row.dimIdx !== undefined && car.specs?.dim?.[row.dimIdx]) {
    return car.specs.dim[row.dimIdx][1]
  }
  // dynamic shared (feature availability varies by grade)
  if (row.dynamic) {
    const fc = grade.featureClass
    if (fc === 'top') return 'รองรับ'
    if (fc === 'mid') return row.shared?.includes('ท็อป') ? '-' : 'รองรับ'
    return '-'
  }
  // static shared value
  if (row.shared) return row.shared
  return '-'
}

function isUpgraded(row, grade, allGrades, gradeIdx) {
  if (row.shared && !row.dynamic && !row.key) return false
  if (row.dimIdx !== undefined) return false
  if (row.carSpec) return false
  if (gradeIdx === 0) return false

  const currentVal = grade.specDiffs?.[row.key]
  const baseVal = allGrades[0]?.specDiffs?.[row.key]
  if (row.key === '_price') return false
  if (row.dynamic) {
    return grade.featureClass !== 'standard'
  }
  if (currentVal && baseVal && currentVal !== baseVal) return true
  return false
}

export default function GradeCompareModal({ isOpen, onClose, car }) {
  // Prevent body scroll when modal is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden'
      return () => { document.body.style.overflow = '' }
    }
  }, [isOpen])

  if (!isOpen || !car?.subModels?.length) return null

  const grades = car.subModels

  return (
    <div className="fixed inset-0 z-[100] flex items-end justify-center">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Bottom sheet */}
      <div className="relative w-full max-w-lg bg-white rounded-t-2xl max-h-[90vh] flex flex-col animate-slide-up">
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100 flex-shrink-0">
          <h2 className="text-lg font-bold text-gray-900">เปรียบเทียบรุ่นย่อย</h2>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center hover:bg-gray-200 transition-colors"
          >
            <svg className="w-5 h-5 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Scrollable content */}
        <div className="overflow-auto flex-1 pb-8">
          {/* Grade header row (sticky) */}
          <div className="sticky top-0 z-10 bg-white border-b border-gray-200">
            <div className="grid" style={{ gridTemplateColumns: `140px repeat(${grades.length}, 1fr)` }}>
              <div className="px-3 py-3 text-xs font-medium text-gray-500">รุ่นย่อย</div>
              {grades.map((g) => (
                <div key={g.id} className="px-2 py-3 text-center">
                  <p className="font-bold text-sm text-gray-900">{g.name}</p>
                  <p className="text-green-600 font-semibold text-xs mt-0.5">฿{fmt(g.price)}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Sections */}
          {COMPARE_SECTIONS.map((section) => (
            <div key={section.title}>
              {/* Section header */}
              <div className="bg-gray-50 px-3 py-2 border-y border-gray-100">
                <p className="text-xs font-bold text-gray-500 tracking-wide">{section.title}</p>
              </div>

              {/* Rows */}
              {section.rows.map((row, ri) => (
                <div
                  key={ri}
                  className={`grid border-b border-gray-50 ${row.key === '_price' ? 'bg-green-50/50' : ''}`}
                  style={{ gridTemplateColumns: `140px repeat(${grades.length}, 1fr)` }}
                >
                  <div className="px-3 py-2.5 text-xs text-gray-600 font-medium flex items-center">
                    {row.label}
                  </div>
                  {grades.map((g, gi) => {
                    const val = getCellValue(row, g, car, gi, grades.length)
                    const upgraded = isUpgraded(row, g, grades, gi)
                    return (
                      <div
                        key={g.id}
                        className={`px-2 py-2.5 text-xs text-center flex items-center justify-center ${
                          upgraded
                            ? 'text-green-700 font-semibold bg-green-50/70'
                            : val === '-'
                            ? 'text-gray-300'
                            : 'text-gray-700'
                        } ${row.key === '_price' ? 'font-bold text-green-600 text-sm' : ''}`}
                      >
                        {val}
                      </div>
                    )
                  })}
                </div>
              ))}
            </div>
          ))}
        </div>
      </div>

      {/* Slide-up animation */}
      <style>{`
        @keyframes slideUp {
          from { transform: translateY(100%); }
          to { transform: translateY(0); }
        }
        .animate-slide-up {
          animation: slideUp 0.3s ease-out;
        }
      `}</style>
    </div>
  )
}
