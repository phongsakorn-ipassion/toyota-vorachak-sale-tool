import { create } from 'zustand'
import { LEADS, LEADS_LIST } from '../lib/mockData'

export const useLeadStore = create((set, get) => ({
  leads: LEADS_LIST,
  selectedLead: null,
  filterLevel: 'all', // 'all' | 'hot' | 'warm' | 'cool' | 'won' | 'lost'
  filterStage: 'all', // 'all' | 'new' | 'test_drive' | 'negotiation' | 'won' | 'lost'
  searchTerm: '',

  // ---------------------------------------------------------------------------
  // Setters
  // ---------------------------------------------------------------------------

  setLeads: (leads) => set({ leads }),

  selectLead: (id) => {
    const lead = id
      ? LEADS[id] || get().leads.find((l) => l.id === id)
      : null
    set({ selectedLead: lead })
  },

  setFilterLevel: (level) => set({ filterLevel: level }),

  setFilterStage: (stage) => set({ filterStage: stage }),

  setSearch: (term) => set({ searchTerm: term }),

  // ---------------------------------------------------------------------------
  // CRUD
  // ---------------------------------------------------------------------------

  addLead: (lead) =>
    set((state) => ({
      leads: [
        {
          id: `lead_${Date.now()}`,
          createdAt: new Date().toISOString(),
          activities: [],
          stage: 'new',
          level: 'warm',
          ...lead,
        },
        ...state.leads,
      ],
    })),

  updateLead: (id, data) =>
    set((state) => ({
      leads: state.leads.map((l) => (l.id === id ? { ...l, ...data } : l)),
      selectedLead:
        state.selectedLead?.id === id
          ? { ...state.selectedLead, ...data }
          : state.selectedLead,
    })),

  deleteLead: (id) =>
    set((state) => ({
      leads: state.leads.filter((l) => l.id !== id),
      selectedLead: state.selectedLead?.id === id ? null : state.selectedLead,
    })),

  // ---------------------------------------------------------------------------
  // Specific field mutations
  // ---------------------------------------------------------------------------

  changeLevel: (id, newLevel) => {
    get().updateLead(id, { level: newLevel })
  },

  changeStage: (id, newStage) => {
    get().updateLead(id, { stage: newStage })
  },

  assignLead: (id, salesId) => {
    get().updateLead(id, { assignedTo: salesId })
  },

  // ---------------------------------------------------------------------------
  // Activities
  // ---------------------------------------------------------------------------

  addActivity: (leadId, activity) =>
    set((state) => {
      const newActivity = {
        id: `a${Date.now()}`,
        time: new Date().toISOString(),
        createdBy: activity.createdBy || 'system',
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

  // ---------------------------------------------------------------------------
  // Getters / computed
  // ---------------------------------------------------------------------------

  getFilteredLeads: () => {
    const { leads, filterLevel, filterStage, searchTerm } = get()
    let result = leads

    if (filterLevel !== 'all') {
      result = result.filter((l) => l.level === filterLevel)
    }

    if (filterStage !== 'all') {
      result = result.filter((l) => l.stage === filterStage)
    }

    if (searchTerm && searchTerm.trim() !== '') {
      const term = searchTerm.trim().toLowerCase()
      result = result.filter(
        (l) =>
          l.name.toLowerCase().includes(term) ||
          (l.phone && l.phone.includes(term)) ||
          (l.email && l.email.toLowerCase().includes(term)) ||
          (l.source && l.source.toLowerCase().includes(term))
      )
    }

    return result
  },

  getLeadById: (id) => {
    return get().leads.find((l) => l.id === id) || LEADS[id] || null
  },

  getPipelineData: () => {
    const { leads } = get()
    const stages = ['new', 'test_drive', 'negotiation', 'won', 'lost']
    const pipeline = {}
    stages.forEach((stage) => {
      pipeline[stage] = leads.filter((l) => l.stage === stage)
    })
    return pipeline
  },

  getLeadStats: () => {
    const { leads } = get()
    const stats = { hot: 0, warm: 0, cool: 0, won: 0, lost: 0, total: leads.length }
    leads.forEach((l) => {
      if (stats[l.level] !== undefined) {
        stats[l.level]++
      }
    })
    return stats
  },
}))
