import React, { useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuthStore } from '../stores/authStore'
import { useLeadStore } from '../stores/leadStore'
import { useBookingStore } from '../stores/bookingStore'
import { useDashboardStore } from '../stores/dashboardStore'
import { CARS } from '../lib/mockData'
import { formatCurrency } from '../lib/formats'
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

  const leads = useLeadStore((s) => s.leads)
  const bookings = useBookingStore((s) => s.bookings)
  const selectedBranch = useDashboardStore((s) => s.selectedBranch)
  const teamMembersAll = useDashboardStore((s) => s.teamMembers)
  const getSelectedBranchInfo = useDashboardStore((s) => s.getSelectedBranchInfo)

  const branchInfo = getSelectedBranchInfo()

  // ---------------------------------------------------------------------------
  // Filter everything by selected branch
  // ---------------------------------------------------------------------------
  const filteredLeads = useMemo(() => {
    if (selectedBranch === 'all') return leads
    return leads.filter((l) => l.branch === selectedBranch)
  }, [leads, selectedBranch])

  const filteredTeam = useMemo(() => {
    if (selectedBranch === 'all') return teamMembersAll
    return teamMembersAll.filter((m) => m.branch === selectedBranch)
  }, [teamMembersAll, selectedBranch])

  const filteredBookings = useMemo(() => {
    if (selectedBranch === 'all') return bookings
    // Filter bookings by checking if the linked lead belongs to the branch
    const branchLeadIds = new Set(filteredLeads.map((l) => l.id))
    return bookings.filter((b) => b.leadId && branchLeadIds.has(b.leadId))
  }, [bookings, selectedBranch, filteredLeads])

  // ---------------------------------------------------------------------------
  // Compute KPIs dynamically
  // ---------------------------------------------------------------------------
  const kpis = useMemo(() => {
    const wonLeads = filteredLeads.filter((l) => l.level === 'won')
    const hotLeads = filteredLeads.filter((l) => l.level === 'hot')
    const newLeads = filteredLeads.filter((l) => l.stage === 'new')

    // Revenue from won leads (car prices)
    const revenue = wonLeads.reduce((sum, l) => {
      const car = CARS[l.car]
      return sum + (car ? car.price : 0)
    }, 0)

    // Also add revenue from confirmed bookings
    const bookingRevenue = filteredBookings
      .filter((b) => b.status === 'confirmed')
      .reduce((sum, b) => sum + (b.carPrice || 0), 0)

    const totalRevenue = revenue + bookingRevenue

    // Team target
    const teamTarget = filteredTeam.reduce((sum, m) => sum + m.target, 0)

    return {
      teamUnits: {
        value: wonLeads.length,
        target: teamTarget || 50,
        label: 'ยอดขาย',
        unit: 'คัน',
      },
      revenue: {
        value: totalRevenue,
        target: 0,
        label: 'รายได้',
        unit: '฿',
      },
      newLeads: {
        value: newLeads.length,
        target: 0,
        label: 'Lead ใหม่',
        unit: 'ราย',
      },
      hotLeads: {
        value: hotLeads.length,
        target: 0,
        label: 'Hot Lead',
        unit: 'ราย',
      },
    }
  }, [filteredLeads, filteredBookings, filteredTeam])

  // ---------------------------------------------------------------------------
  // Compute team member stats from leads (won count per member)
  // ---------------------------------------------------------------------------
  const teamWithDynamic = useMemo(() => {
    return filteredTeam.map((member) => {
      const memberLeads = filteredLeads.filter((l) => l.assignedTo === member.id)
      const wonCount = memberLeads.filter((l) => l.level === 'won').length
      return {
        ...member,
        units: member.units + wonCount, // base units + dynamic won leads
        leads: memberLeads.length || member.leads,
      }
    })
  }, [filteredTeam, filteredLeads])

  // ---------------------------------------------------------------------------
  // Dynamic insights
  // ---------------------------------------------------------------------------
  const insights = useMemo(() => {
    const result = []

    // Check team members below 50% target
    teamWithDynamic.forEach((m) => {
      const pct = m.target > 0 ? Math.round((m.units / m.target) * 100) : 0
      if (pct < 50) {
        result.push({
          id: `alert-${m.id}`,
          type: 'alert',
          icon: '\uD83D\uDEA8',
          title: `${m.name} ยอดขายต่ำกว่าเป้า 50%`,
          message: `ทำได้ ${m.units}/${m.target} คัน (${pct}%) — แนะนำให้จัดอบรมหรือ coaching`,
        })
      }
    })

    // Hot leads not followed up (no activity in last 24hrs)
    const now = Date.now()
    const oneDayMs = 24 * 60 * 60 * 1000
    const staleHotLeads = filteredLeads.filter((l) => {
      if (l.level !== 'hot') return false
      const lastActivity = l.activities?.[0]?.time
      if (!lastActivity) return true
      return now - new Date(lastActivity).getTime() > oneDayMs
    })
    if (staleHotLeads.length > 0) {
      result.push({
        id: 'warn-stale-hot',
        type: 'warning',
        icon: '\u26A0\uFE0F',
        title: `Hot Lead ${staleHotLeads.length} ราย ไม่มีกิจกรรมใน 24 ชม.`,
        message: staleHotLeads.map((l) => l.name).join(', ') + ' — ควรติดตามทันที',
      })
    }

    // Best selling car model
    const carCount = {}
    filteredLeads
      .filter((l) => l.level === 'won')
      .forEach((l) => {
        const car = CARS[l.car]
        const name = car ? car.name : l.car
        carCount[name] = (carCount[name] || 0) + 1
      })
    const bestCar = Object.entries(carCount).sort((a, b) => b[1] - a[1])[0]
    if (bestCar) {
      result.push({
        id: 'info-best-car',
        type: 'info',
        icon: '\uD83D\uDCA1',
        title: `${bestCar[0]} มียอดจองสูงสุด`,
        message: `${bestCar[1]} คัน — พิจารณาสต็อกเพิ่มเติมสำหรับเดือนหน้า`,
      })
    }

    // If no insights, add a default positive one
    if (result.length === 0) {
      result.push({
        id: 'info-default',
        type: 'info',
        icon: '\uD83D\uDCA1',
        title: 'ทีมงานทำงานได้ดี',
        message: 'ยังไม่มีประเด็นที่ต้องเฝ้าระวัง — รักษาผลงานต่อไป',
      })
    }

    return result
  }, [teamWithDynamic, filteredLeads])

  // ---------------------------------------------------------------------------
  // Quick actions
  // ---------------------------------------------------------------------------
  const quickActions = [
    { label: 'ดู Pipeline', path: '/pipeline', icon: 'pipeline', bg: 'bg-blue-50', color: 'text-blue-600' },
    { label: 'ตั้งเป้าหมาย', path: '/targets', icon: 'target', bg: 'bg-green-50', color: 'text-green-600' },
    { label: 'Export Report', path: '/reports', icon: 'download', bg: 'bg-purple-50', color: 'text-purple-600' },
  ]

  return (
    <div className="p-4 pb-24 space-y-4">
      {/* Greeting */}
      <div>
        <div className="text-lg font-bold text-t1">
          สวัสดี, {userName}
        </div>
        <div className="text-xs text-t2">
          {branchInfo.id === 'all' ? 'วรจักร์ยนต์ — ทุกสาขา' : `วรจักร์ยนต์ ${branchInfo.name}`}
        </div>
      </div>

      {/* Branch Selector */}
      <BranchSelector />

      {/* KPIs */}
      <KPIGrid kpis={kpis} keys={['teamUnits', 'revenue', 'newLeads', 'hotLeads']} />

      {/* Team Chart */}
      <TeamChart teamMembers={teamWithDynamic} />

      {/* Leaderboard */}
      <Leaderboard teamMembers={teamWithDynamic} />

      {/* Insights */}
      <InsightCards insights={insights} />

      {/* Quick Actions */}
      <div className="grid grid-cols-3 gap-3 mt-4">
        {quickActions.map((action) => (
          <div
            key={action.path}
            className={`${action.bg} bg-card rounded-lg border border-border flex flex-col items-center justify-center py-4 gap-2 cursor-pointer`}
            onClick={() => navigate(action.path)}
          >
            <Icon name={action.icon} size={24} className={action.color} />
            <span className="text-[11px] font-medium text-t1 text-center">{action.label}</span>
          </div>
        ))}
      </div>
    </div>
  )
}
