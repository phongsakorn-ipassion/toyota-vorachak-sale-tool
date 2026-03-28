import React from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuthStore } from '../stores/authStore'
import { useDashboardStore } from '../stores/dashboardStore'
import Icon from '../components/icons/Icon'
import BranchSelector from '../components/dashboard/BranchSelector'
import KPIGrid from '../components/dashboard/KPIGrid'
import TeamChart from '../components/dashboard/TeamChart'
import Leaderboard from '../components/dashboard/Leaderboard'
import InsightCards from '../components/dashboard/InsightCards'

export default function ManagerDashboard() {
  const navigate = useNavigate()
  const user = useAuthStore((s) => s.user)
  const userName = user?.name || 'Manager'

  const { kpis, teamMembers, insights } = useDashboardStore()

  const quickActions = [
    { label: 'ดู Pipeline', path: '/pipeline', icon: 'pipeline', bg: 'bg-blue-50', color: 'text-blue-600' },
    { label: 'ตั้งเป้าหมาย', path: '/targets', icon: 'target', bg: 'bg-green-50', color: 'text-green-600' },
  ]

  return (
    <div className="p-4 pb-24 space-y-4">
      {/* Greeting */}
      <div>
        <div className="text-lg font-bold text-t1">
          สวัสดี, {userName}
        </div>
        <div className="text-xs text-t2">วรจักร์ยนต์ สาขาลาดพร้าว</div>
      </div>

      {/* Branch Selector */}
      <BranchSelector />

      {/* KPIs */}
      <KPIGrid kpis={kpis} />

      {/* Team Chart */}
      <TeamChart teamMembers={teamMembers} />

      {/* Leaderboard */}
      <Leaderboard teamMembers={teamMembers} />

      {/* Insights */}
      <InsightCards insights={insights} />

      {/* Quick Actions */}
      <div className="grid grid-cols-2 gap-3 mt-4">
        {quickActions.map((action) => (
          <div
            key={action.path}
            className={`${action.bg} bg-card rounded-lg border border-border flex flex-col items-center justify-center py-4 gap-2 cursor-pointer`}
            onClick={() => navigate(action.path)}
          >
            <Icon name={action.icon} size={24} className={action.color} />
            <span className="text-sm font-medium text-t1">{action.label}</span>
          </div>
        ))}
      </div>
    </div>
  )
}
