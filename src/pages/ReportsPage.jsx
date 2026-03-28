import React, { useState, useMemo } from 'react'
import PageHeader from '../components/layout/PageHeader'
import WeeklyChart from '../components/dashboard/WeeklyChart'
import Icon from '../components/icons/Icon'
import { useLeadStore } from '../stores/leadStore'
import { useBookingStore } from '../stores/bookingStore'
import { CARS } from '../lib/mockData'
import { formatPrice } from '../lib/formats'

export default function ReportsPage() {
  const { leads, getLeadStats } = useLeadStore()
  const { bookings } = useBookingStore()

  // Month filter
  const now = new Date()
  const [selectedMonth, setSelectedMonth] = useState(
    `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`
  )

  // Filter leads by selected month
  const filteredLeads = useMemo(() => {
    return leads.filter((l) => {
      if (!l.createdAt) return false
      const d = new Date(l.createdAt)
      const ym = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`
      return ym === selectedMonth
    })
  }, [leads, selectedMonth])

  // Summary stats
  const wonLeads = filteredLeads.filter((l) => l.level === 'won')
  const unitsSold = wonLeads.length
  const revenue = wonLeads.reduce((sum, l) => {
    const car = l.car ? CARS[l.car] : null
    return sum + (car ? car.price : 0)
  }, 0)
  const avgDeal = unitsSold > 0 ? Math.round(revenue / unitsSold) : 0

  // Lead level stats (all leads, not filtered)
  const stats = getLeadStats()
  const levelPills = [
    { label: 'Hot', count: stats.hot, dot: 'bg-red-500' },
    { label: 'Warm', count: stats.warm, dot: 'bg-amber-500' },
    { label: 'Cool', count: stats.cool, dot: 'bg-blue-500' },
    { label: 'Won', count: stats.won, dot: 'bg-emerald-500' },
    { label: 'Lost', count: stats.lost, dot: 'bg-gray-400' },
  ]

  // Weekly trend data from leads
  const weeklyData = useMemo(() => {
    const weeks = {}
    filteredLeads.forEach((l) => {
      if (!l.createdAt) return
      const d = new Date(l.createdAt)
      const startOfYear = new Date(d.getFullYear(), 0, 1)
      const weekNum = Math.ceil(((d - startOfYear) / 86400000 + startOfYear.getDay() + 1) / 7)
      const key = `W${weekNum}`
      weeks[key] = (weeks[key] || 0) + 1
    })
    const sortedKeys = Object.keys(weeks).sort(
      (a, b) => parseInt(a.slice(1)) - parseInt(b.slice(1))
    )
    return {
      labels: sortedKeys.length > 0 ? sortedKeys : ['W1'],
      units: sortedKeys.length > 0 ? sortedKeys.map((k) => weeks[k]) : [0],
    }
  }, [filteredLeads])

  // Top models from won leads
  const topModels = useMemo(() => {
    const counts = {}
    wonLeads.forEach((l) => {
      const car = l.car ? CARS[l.car] : null
      const name = car ? car.name : 'ไม่ระบุ'
      counts[name] = (counts[name] || 0) + 1
    })
    return Object.entries(counts)
      .map(([model, count]) => ({ model, count }))
      .sort((a, b) => b.count - a.count)
  }, [wonLeads])
  const maxModelCount = topModels.length > 0 ? topModels[0].count : 1

  // Key metrics
  const totalLeads = filteredLeads.length
  const avgLeadValue = totalLeads > 0 ? Math.round(revenue / totalLeads) : 0
  const conversionRate = totalLeads > 0 ? ((unitsSold / totalLeads) * 100).toFixed(1) : '0.0'
  const avgDaysInPipeline = useMemo(() => {
    const activeDays = filteredLeads
      .filter((l) => l.createdAt)
      .map((l) => {
        const created = new Date(l.createdAt)
        const diff = (new Date() - created) / (1000 * 60 * 60 * 24)
        return diff
      })
    if (activeDays.length === 0) return '0'
    return (activeDays.reduce((a, b) => a + b, 0) / activeDays.length).toFixed(1)
  }, [filteredLeads])
  const activeLeads = filteredLeads.filter(
    (l) => l.stage !== 'won' && l.stage !== 'lost'
  ).length

  const keyMetrics = [
    { label: 'มูลค่าลีดเฉลี่ย', value: formatPrice(avgLeadValue), icon: 'chart' },
    { label: 'อัตราการแปลง', value: `${conversionRate}%`, icon: 'target' },
    { label: 'วันเฉลี่ยใน Pipeline', value: `${avgDaysInPipeline} วัน`, icon: 'calendar' },
    { label: 'ลีดที่เปิดอยู่', value: `${activeLeads} ราย`, icon: 'users' },
  ]

  // Month options
  const monthOptions = useMemo(() => {
    const opts = []
    for (let i = 0; i < 6; i++) {
      const d = new Date(now.getFullYear(), now.getMonth() - i, 1)
      const val = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`
      const thaiMonths = [
        'ม.ค.', 'ก.พ.', 'มี.ค.', 'เม.ย.', 'พ.ค.', 'มิ.ย.',
        'ก.ค.', 'ส.ค.', 'ก.ย.', 'ต.ค.', 'พ.ย.', 'ธ.ค.',
      ]
      opts.push({ value: val, label: `${thaiMonths[d.getMonth()]} ${d.getFullYear() + 543}` })
    }
    return opts
  }, [])

  // Export CSV
  function handleExportCSV() {
    const headers = ['ชื่อลูกค้า', 'ระดับ', 'สถานะ', 'รุ่นรถ', 'แหล่งที่มา', 'วันที่สร้าง']
    const rows = filteredLeads.map((l) => {
      const car = l.car ? CARS[l.car] : null
      return [
        l.name,
        l.level,
        l.stage,
        car ? car.name : '',
        l.source || '',
        l.createdAt || '',
      ].join(',')
    })

    // Add bookings section
    const bHeaders = ['Ref', 'ลูกค้า', 'รุ่นรถ', 'ราคา', 'สถานะ', 'วันที่']
    const bRows = bookings.map((b) => [
      b.ref, b.customerName, b.carName, b.carPrice, b.status, b.createdAt,
    ].join(','))

    const csv = [
      'ข้อมูลลีด',
      headers.join(','),
      ...rows,
      '',
      'ข้อมูลการจอง',
      bHeaders.join(','),
      ...bRows,
    ].join('\n')

    const blob = new Blob(['\uFEFF' + csv], { type: 'text/csv;charset=utf-8;' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `report_${selectedMonth}.csv`
    a.click()
    URL.revokeObjectURL(url)
  }

  // Export PDF (print)
  function handleExportPDF() {
    window.print()
  }

  return (
    <div className="screen-enter">
      <PageHeader title="รายงาน" showBack />
      <div className="p-4 pb-24 space-y-4">
        {/* Date filter */}
        <div className="flex items-center gap-2">
          <Icon name="calendar" size={16} className="text-t3" />
          <select
            value={selectedMonth}
            onChange={(e) => setSelectedMonth(e.target.value)}
            className="flex-1 bg-card border border-border rounded-lg px-3 py-2 text-sm text-t1 font-bold"
          >
            {monthOptions.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
        </div>

        {/* Summary Stats - 3 cards */}
        <div className="grid grid-cols-3 gap-2">
          <div className="bg-emerald-50 rounded-xl p-3 text-center">
            <div className="text-xl font-extrabold text-emerald-700">{unitsSold}</div>
            <div className="text-[10px] text-emerald-600 font-bold mt-0.5">ยอดขาย (คัน)</div>
          </div>
          <div className="bg-blue-50 rounded-xl p-3 text-center">
            <div className="text-lg font-extrabold text-blue-700">{formatPrice(revenue)}</div>
            <div className="text-[10px] text-blue-600 font-bold mt-0.5">รายได้รวม</div>
          </div>
          <div className="bg-purple-50 rounded-xl p-3 text-center">
            <div className="text-lg font-extrabold text-purple-700">{formatPrice(avgDeal)}</div>
            <div className="text-[10px] text-purple-600 font-bold mt-0.5">ดีลเฉลี่ย</div>
          </div>
        </div>

        {/* Lead Level Summary Pills */}
        <div>
          <h3 className="text-xs font-bold text-t3 uppercase tracking-wider mb-2">สรุประดับลีด</h3>
          <div className="flex gap-2 overflow-x-auto">
            {levelPills.map((p) => (
              <div
                key={p.label}
                className="bg-card border border-border rounded-lg px-3 py-2 flex items-center gap-2 flex-shrink-0"
              >
                <span className={`w-2.5 h-2.5 rounded-full ${p.dot}`} />
                <span className="text-sm font-bold text-t1">{p.count}</span>
                <span className="text-xs text-t3">{p.label}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Weekly Trend Chart */}
        <WeeklyChart data={weeklyData} />

        {/* Top Models */}
        {topModels.length > 0 && (
          <div className="bg-card rounded-lg border border-border p-4">
            <h3 className="text-sm font-bold text-t1 mb-3">รุ่นยอดนิยม (ยอดขาย)</h3>
            <div className="space-y-2.5">
              {topModels.map((m, i) => (
                <div key={m.model} className="flex items-center gap-3">
                  <span className="w-5 text-xs font-bold text-t3 text-right">#{i + 1}</span>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-sm font-bold text-t1 truncate">{m.model}</span>
                      <span className="text-xs font-bold text-primary ml-2">{m.count} คัน</span>
                    </div>
                    <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-primary rounded-full transition-all"
                        style={{ width: `${(m.count / maxModelCount) * 100}%` }}
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Key Metrics */}
        <h3 className="text-xs font-bold text-t3 uppercase tracking-wider">ตัวชี้วัดสำคัญ</h3>
        <div className="grid grid-cols-2 gap-2">
          {keyMetrics.map((metric) => (
            <div
              key={metric.label}
              className="bg-card rounded-lg border border-border p-3 flex items-center gap-3"
            >
              <div className="w-9 h-9 rounded-full bg-primary/10 flex items-center justify-center text-primary flex-shrink-0">
                <Icon name={metric.icon} size={16} />
              </div>
              <div className="flex-1 min-w-0">
                <div className="text-[10px] text-t3 font-bold">{metric.label}</div>
                <div className="text-sm font-extrabold text-t1">{metric.value}</div>
              </div>
            </div>
          ))}
        </div>

        {/* Export Buttons */}
        <div className="flex gap-2 pt-2">
          <button
            onClick={handleExportPDF}
            className="flex-1 btn-o gap-2 text-sm"
          >
            <Icon name="download" size={16} />
            PDF Report
          </button>
          <button
            onClick={handleExportCSV}
            className="flex-1 btn-p gap-2 text-sm"
          >
            <Icon name="download" size={16} />
            Excel (CSV)
          </button>
        </div>
      </div>
    </div>
  )
}
