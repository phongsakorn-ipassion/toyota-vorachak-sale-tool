import React from 'react'
import PageHeader from '../components/layout/PageHeader'
import WeeklyChart from '../components/dashboard/WeeklyChart'
import { useDashboardStore } from '../stores/dashboardStore'
import { LEADS_LIST } from '../lib/mockData'

export default function ReportsPage() {
  const { weeklyData, kpis } = useDashboardStore()

  const hotCount = LEADS_LIST.filter((l) => l.level === 'hot').length
  const warmCount = LEADS_LIST.filter((l) => l.level === 'warm').length
  const coolCount = LEADS_LIST.filter((l) => l.level === 'cool').length
  const wonCount = LEADS_LIST.filter((l) => l.level === 'won').length

  const pills = [
    { label: 'Hot', count: hotCount, bg: 'bg-red-50', text: 'text-red-600' },
    { label: 'Warm', count: warmCount, bg: 'bg-amber-50', text: 'text-amber-600' },
    { label: 'Cool', count: coolCount, bg: 'bg-blue-50', text: 'text-blue-600' },
    { label: 'Won', count: wonCount, bg: 'bg-green-50', text: 'text-green-600' },
  ]

  const metrics = [
    { label: 'อัตราการแปลง', value: `${kpis.conversion.value}%`, icon: '📊' },
    { label: 'มูลค่าลีดเฉลี่ย', value: '฿920K', icon: '💰' },
    { label: 'วันเฉลี่ยใน Pipeline', value: '8.5 วัน', icon: '📅' },
  ]

  return (
    <div>
      <PageHeader title="รายงาน" showBack />
      <div className="p-4 pb-24 space-y-4">
        {/* Summary Pills */}
        <div className="flex gap-2 overflow-x-auto">
          {pills.map((pill) => (
            <div
              key={pill.label}
              className={`${pill.bg} rounded-lg px-4 py-2 flex-shrink-0 text-center`}
            >
              <div className={`text-lg font-bold ${pill.text}`}>
                {pill.count}
              </div>
              <div className="text-xs text-t2">{pill.label}</div>
            </div>
          ))}
        </div>

        {/* Weekly Chart */}
        <WeeklyChart data={weeklyData} />

        {/* Key Metrics */}
        <h3 className="text-sm font-bold text-t1">ตัวชี้วัดสำคัญ</h3>
        <div className="space-y-2">
          {metrics.map((metric) => (
            <div
              key={metric.label}
              className="bg-card rounded-lg border border-border p-4 flex items-center gap-3"
            >
              <span className="text-2xl">{metric.icon}</span>
              <div className="flex-1">
                <div className="text-xs text-t3">{metric.label}</div>
                <div className="text-lg font-bold text-t1">{metric.value}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
