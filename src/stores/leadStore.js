import { create } from 'zustand'
import { LEADS, LEADS_LIST } from '../lib/mockData'

export const useLeadStore = create((set, get) => ({
  leads: LEADS_LIST,
  selectedLead: null,
  filterLevel: 'all', // 'all' | 'hot' | 'warm' | 'won'

  setLeads: (leads) => set({ leads }),

  selectLead: (id) => {
    const lead = id
      ? LEADS[id] || get().leads.find((l) => l.id === id)
      : null
    set({ selectedLead: lead })
  },

  addLead: (lead) =>
    set((state) => ({
      leads: [lead, ...state.leads],
    })),

  updateLead: (id, data) =>
    set((state) => ({
      leads: state.leads.map((l) => (l.id === id ? { ...l, ...data } : l)),
      selectedLead:
        state.selectedLead?.id === id
          ? { ...state.selectedLead, ...data }
          : state.selectedLead,
    })),

  setFilterLevel: (level) => set({ filterLevel: level }),

  getFilteredLeads: () => {
    const { leads, filterLevel } = get()
    if (filterLevel === 'all') return leads
    return leads.filter((l) => l.level === filterLevel)
  },

  addActivity: (leadId, activity) =>
    set((state) => {
      const newActivity = {
        id: `a${Date.now()}`,
        time: new Date().toISOString(),
        ...activity,
      }
      const updatedLeads = state.leads.map((l) => {
        if (l.id !== leadId) return l
        return {
          ...l,
          activities: [newActivity, ...(l.activities || [])],
        }
      })
      const updatedSelected =
        state.selectedLead?.id === leadId
          ? {
              ...state.selectedLead,
              activities: [
                newActivity,
                ...(state.selectedLead.activities || []),
              ],
            }
          : state.selectedLead
      return { leads: updatedLeads, selectedLead: updatedSelected }
    }),
}))
