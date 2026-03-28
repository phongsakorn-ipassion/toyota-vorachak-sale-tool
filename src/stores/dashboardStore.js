import { create } from 'zustand'
import {
  BRANCHES,
  DASHBOARD_KPIS,
  TEAM_MEMBERS,
  AI_INSIGHTS,
  WEEKLY_DATA,
} from '../lib/mockData'

export const useDashboardStore = create((set, get) => ({
  selectedBranch: 'lp',
  kpis: DASHBOARD_KPIS,
  teamMembers: TEAM_MEMBERS,
  insights: AI_INSIGHTS,
  weeklyData: WEEKLY_DATA,
  branches: BRANCHES,

  setSelectedBranch: (branchId) => set({ selectedBranch: branchId }),

  getSelectedBranchInfo: () => {
    const { selectedBranch, branches } = get()
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
}))
