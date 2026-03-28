import React from 'react'
import PageHeader from '../components/layout/PageHeader'
import Avatar from '../components/ui/Avatar'
import { useDashboardStore } from '../stores/dashboardStore'

export default function TargetsPage() {
  const { teamMembers, kpis } = useDashboardStore()

  const branchUnits = kpis.totalUnits.value
  const branchTarget = kpis.totalUnits.target
  const branchPct = Math.round((branchUnits / branchTarget) * 100)
  const daysLeft = 12
  const avgPerDay = (branchTarget - branchUnits) > 0
    ? ((branchTarget - branchUnits) / daysLeft).toFixed(1)
    : 0

  return (
    <div>
      <PageHeader title="เป้าหมาย" showBack />
      <div className="p-4 pb-24 space-y-4">
        {/* Branch Target Card */}
        <div className="bg-card rounded-lg border border-border p-5">
          <div className="text-center mb-4">
            <div className="text-3xl font-extrabold text-t1">
              {branchUnits}
              <span className="text-lg text-t3 font-normal">
                /{branchTarget} คัน
              </span>
            </div>
            <div className="text-xs text-t2 mt-1">เป้าหมายสาขา ประจำเดือน</div>
          </div>

          {/* Progress bar */}
          <div className="w-full h-3 bg-gray-100 rounded-full overflow-hidden mb-3">
            <div
              className="h-full rounded-full transition-all duration-500"
              style={{
                width: `${branchPct}%`,
                backgroundColor: branchPct >= 70 ? '#1B7A3F' : branchPct >= 40 ? '#D97706' : '#DC2626',
              }}
            />
          </div>

          <div className="flex justify-between text-xs text-t2">
            <span>{branchPct}% สำเร็จ</span>
            <span>เหลือ {daysLeft} วัน</span>
          </div>

          {/* Stats row */}
          <div className="grid grid-cols-2 gap-3 mt-4">
            <div className="bg-gray-50 rounded-lg p-3 text-center">
              <div className="text-lg font-bold text-t1">{avgPerDay}</div>
              <div className="text-xs text-t3">คัน/วัน ที่ต้องทำ</div>
            </div>
            <div className="bg-gray-50 rounded-lg p-3 text-center">
              <div className="text-lg font-bold text-t1">{branchTarget - branchUnits}</div>
              <div className="text-xs text-t3">คันที่เหลือ</div>
            </div>
          </div>
        </div>

        {/* Team Targets */}
        <h3 className="text-sm font-bold text-t1">เป้าหมายรายบุคคล</h3>
        <div className="space-y-3">
          {teamMembers.map((member) => {
            const pct = Math.round((member.units / member.target) * 100)
            const barColor =
              pct >= 70 ? '#1B7A3F' : pct >= 40 ? '#D97706' : '#DC2626'

            return (
              <div
                key={member.id}
                className="bg-card rounded-lg border border-border p-4"
              >
                <div className="flex items-center gap-3 mb-3">
                  <Avatar initial={member.init} color={member.color} size="sm" />
                  <div className="flex-1 min-w-0">
                    <div className="text-sm font-medium text-t1 truncate">
                      {member.name}
                    </div>
                    <div className="text-xs text-t3">
                      {member.units}/{member.target} คัน
                    </div>
                  </div>
                  <div
                    className="text-sm font-bold"
                    style={{ color: barColor }}
                  >
                    {pct}%
                  </div>
                </div>
                <div className="w-full h-2 bg-gray-100 rounded-full overflow-hidden">
                  <div
                    className="h-full rounded-full transition-all duration-500"
                    style={{
                      width: `${pct}%`,
                      backgroundColor: barColor,
                    }}
                  />
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}
