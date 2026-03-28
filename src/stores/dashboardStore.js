import { create } from 'zustand'
import {
  BRANCHES,
  DASHBOARD_KPIS,
  TEAM_MEMBERS,
  AI_INSIGHTS,
  WEEKLY_DATA,
  CARS,
} from '../lib/mockData'

export const useDashboardStore = create((set, get) => ({
  selectedBranch: 'all',
  kpis: DASHBOARD_KPIS,
  teamMembers: TEAM_MEMBERS,
  insights: AI_INSIGHTS,
  weeklyData: WEEKLY_DATA,
  branches: BRANCHES,

  setSelectedBranch: (branchId) => set({ selectedBranch: branchId }),

  updateTeamMemberTarget: (memberId, newTarget) =>
    set((state) => ({
      teamMembers: state.teamMembers.map((m) =>
        m.id === memberId ? { ...m, target: newTarget } : m
      ),
    })),

  updateBranchTarget: (newTarget) =>
    set((state) => ({
      kpis: {
        ...state.kpis,
        totalUnits: { ...state.kpis.totalUnits, target: newTarget },
      },
    })),

  getSelectedBranchInfo: () => {
    const { selectedBranch, branches } = get()
    if (selectedBranch === 'all') return { id: 'all', name: 'ทุกสาขา', code: 'ALL', location: 'ทั้งหมด' }
    return branches.find((b) => b.id === selectedBranch) || branches[0]
  },

  getTopPerformer: () => {
    const { teamMembers } = get()
    return [...teamMembers].sort((a, b) => b.units - a.units)[0]
  },

  getTeamTotalUnits: () => {
    const { teamMembers } = get()
    return teamMembers.reduce((sum, m) => sum + m.units, 0)
  },

  getTeamTotalTarget: () => {
    const { teamMembers } = get()
    return teamMembers.reduce((sum, m) => sum + m.target, 0)
  },

  // ---------------------------------------------------------------------------
  // Computed KPIs from live lead / booking store data
  // ---------------------------------------------------------------------------

  getSalesKpis: (leadStore, bookingStore) => {
    const leads = leadStore ? leadStore.leads : []
    const bookings = bookingStore ? bookingStore.bookings : []

    const activeLeads = leads.filter(
      (l) => l.stage !== 'won' && l.stage !== 'lost'
    ).length

    const wonLeads = leads.filter((l) => l.level === 'won').length
    const totalLeads = leads.length
    const conversionRate = totalLeads > 0 ? Math.round((wonLeads / totalLeads) * 100) : 0

    const confirmedBookings = bookings.filter((b) => b.status === 'confirmed')
    const totalRevenue = confirmedBookings.reduce((sum, b) => sum + (b.carPrice || 0), 0)
    const totalUnits = confirmedBookings.length

    return {
      totalUnits: { value: totalUnits, label: 'ยอดจองของฉัน', unit: 'คัน' },
      revenue: { value: totalRevenue, label: 'มูลค่ารวม', unit: '฿' },
      activeLeads: { value: activeLeads, label: 'ลีดที่เปิดอยู่', unit: 'ราย' },
      conversion: { value: conversionRate, label: 'อัตราการแปลง', unit: '%' },
      wonLeads: { value: wonLeads, label: 'ปิดการขายได้', unit: 'ราย' },
    }
  },

  getManagerKpis: (leadStore, bookingStore) => {
    const leads = leadStore ? leadStore.leads : []
    const bookings = bookingStore ? bookingStore.bookings : []
    const { teamMembers } = get()

    const activeLeads = leads.filter(
      (l) => l.stage !== 'won' && l.stage !== 'lost'
    ).length

    const wonLeads = leads.filter((l) => l.level === 'won').length
    const lostLeads = leads.filter((l) => l.level === 'lost').length
    const totalLeads = leads.length
    const conversionRate = totalLeads > 0 ? Math.round((wonLeads / totalLeads) * 100) : 0

    const confirmedBookings = bookings.filter((b) => b.status === 'confirmed')
    const totalRevenue = confirmedBookings.reduce((sum, b) => sum + (b.carPrice || 0), 0)
    const totalUnits = confirmedBookings.length

    const teamTotalUnits = teamMembers.reduce((sum, m) => sum + m.units, 0) + totalUnits
    const teamTotalTarget = teamMembers.reduce((sum, m) => sum + m.target, 0)

    // Leads per sales rep
    const leadsPerRep = {}
    leads.forEach((l) => {
      if (l.assignedTo) {
        leadsPerRep[l.assignedTo] = (leadsPerRep[l.assignedTo] || 0) + 1
      }
    })

    return {
      teamUnits: { value: teamTotalUnits, target: teamTotalTarget, label: 'ยอดขายทีม', unit: 'คัน' },
      revenue: { value: totalRevenue, label: 'รายได้จากการจอง', unit: '฿' },
      activeLeads: { value: activeLeads, label: 'ลีดที่เปิดอยู่', unit: 'ราย' },
      wonLeads: { value: wonLeads, label: 'ปิดการขายได้', unit: 'ราย' },
      lostLeads: { value: lostLeads, label: 'เสียลีด', unit: 'ราย' },
      conversion: { value: conversionRate, target: 35, label: 'อัตราการแปลง', unit: '%' },
      totalLeads: { value: totalLeads, label: 'ลีดทั้งหมด', unit: 'ราย' },
      leadsPerRep,
    }
  },
}))
