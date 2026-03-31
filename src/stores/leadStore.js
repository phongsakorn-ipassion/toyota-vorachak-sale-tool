import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { LEADS, LEADS_LIST } from '../lib/mockData'
import { stampRecord, hasConflict, conflictMessage } from '../lib/concurrentCheck'
import { pushLead, syncLeads } from '../lib/dataSync'

export const useLeadStore = create(persist((set, get) => ({
  leads: LEADS_LIST,
  selectedLead: null,
  filterLevel: 'all', // 'all' | 'hot' | 'warm' | 'cool' | 'won' | 'lost'
  filterStage: 'all', // 'all' | 'new' | 'test_drive' | 'negotiation' | 'won' | 'lost'
  filterType: 'purchase', // 'purchase' | 'test_drive'
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

  setFilterType: (type) => set({ filterType: type }),

  setSearch: (term) => set({ searchTerm: term }),

  // ---------------------------------------------------------------------------
  // CRUD
  // ---------------------------------------------------------------------------

  addLead: (lead) => {
    const newLead = stampRecord({
      id: `lead_${Date.now()}`,
      leadType: 'purchase',
      createdAt: new Date().toISOString(),
      activities: [],
      stage: 'new',
      level: 'warm',
      ...lead,
    });
    set((state) => ({
      leads: [newLead, ...state.leads],
    }));
    pushLead(newLead);
    return newLead;
  },

  updateLead: (id, data, _readAt) => {
    const state = get()
    const existing = state.leads.find((l) => l.id === id)
    if (!existing) return { notFound: true }

    // Concurrent check: if caller provides _readAt, verify no conflict
    if (_readAt && hasConflict(_readAt, existing._updatedAt)) {
      return { conflict: true, message: conflictMessage('ลีด') }
    }

    const updated = stampRecord({ ...existing, ...data })
    set({
      leads: state.leads.map((l) => (l.id === id ? updated : l)),
      selectedLead:
        state.selectedLead?.id === id ? updated : state.selectedLead,
    })
    pushLead(updated);
    return { success: true }
  },

  deleteLead: (id) =>
    set((state) => ({
      leads: state.leads.filter((l) => l.id !== id),
      selectedLead: state.selectedLead?.id === id ? null : state.selectedLead,
    })),

  // ---------------------------------------------------------------------------
  // Specific field mutations
  // ---------------------------------------------------------------------------

  changeLevel: (id, newLevel, note, _readAt) => {
    const result = get().updateLead(id, { level: newLevel }, _readAt)
    if (result?.conflict) return result
    // Auto-add activity for won/lost transitions
    if (newLevel === 'won' || newLevel === 'lost') {
      const levelLabel = newLevel === 'won' ? 'Won — ปิดการขาย' : 'Lost — สูญเสีย'
      get().addActivity(id, {
        type: newLevel,
        title: `เปลี่ยนสถานะเป็น ${levelLabel}`,
        description: note || `สถานะถูกเปลี่ยนเป็น ${levelLabel}`,
        createdBy: 'system',
      })
    } else if (note) {
      get().addActivity(id, {
        type: 'note',
        title: 'หมายเหตุการเปลี่ยนสถานะ',
        description: note,
        createdBy: 'system',
      })
    }
    return result
  },

  changeStage: (id, newStage, _readAt) => {
    return get().updateLead(id, { stage: newStage }, _readAt)
  },

  assignLead: (id, salesId, _readAt) => {
    return get().updateLead(id, { assignedTo: salesId }, _readAt)
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

  editActivity: (leadId, activityId, updates) => set((state) => ({
    leads: state.leads.map(l => l.id === leadId ? {
      ...l,
      activities: (l.activities || []).map(a => a.id === activityId ? { ...a, ...updates, _updatedAt: Date.now() } : a)
    } : l)
  })),

  deleteActivity: (leadId, activityId) => set((state) => ({
    leads: state.leads.map(l => l.id === leadId ? {
      ...l,
      activities: (l.activities || []).filter(a => a.id !== activityId)
    } : l)
  })),

  // ---------------------------------------------------------------------------
  // Getters / computed
  // ---------------------------------------------------------------------------

  getFilteredLeads: () => {
    const { leads, filterLevel, filterStage, filterType, searchTerm } = get()
    let result = leads

    // Filter by lead type first (default to 'purchase' for leads without leadType)
    result = result.filter((l) => (l.leadType || 'purchase') === filterType)

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

  convertToCustomer: (leadId) => {
    const state = get();
    const tdLead = state.leads.find(l => l.id === leadId);
    if (!tdLead || tdLead.leadType !== 'test_drive') return null;

    // Create new purchase lead from test drive data
    const newLead = stampRecord({
      id: `lead_${Date.now()}`,
      leadType: 'purchase',
      name: tdLead.name,
      phone: tdLead.phone,
      email: tdLead.email,
      lineId: tdLead.lineId,
      source: tdLead.source,
      car: tdLead.car,
      selectedColor: tdLead.selectedColor,
      serviceCenter: tdLead.serviceCenter,
      level: 'hot',
      stage: 'negotiation',
      notes: `แปลงจากทดลองขับ ${tdLead.testDriveDate}`,
      createdAt: new Date().toISOString(),
      activities: [{
        id: `act_${Date.now()}`,
        type: 'status_change',
        title: 'แปลงเป็นลูกค้า',
        description: `จากการทดลองขับ ${tdLead.name}`,
        createdAt: new Date().toISOString(),
        createdBy: 'มาลี',
      }],
    });

    // Update original test drive lead to completed
    set((state) => ({
      leads: [newLead, ...state.leads.map(l =>
        l.id === leadId ? { ...l, level: 'completed', _updatedAt: Date.now() } : l
      )],
    }));

    pushLead(newLead);
    return newLead;
  },

  syncFromServer: async () => {
    const merged = await syncLeads(get().leads);
    set({ leads: merged });
  },
}), {
  name: 'toyota-leads',
  partialize: (state) => ({ leads: state.leads }),
  onRehydrateStorage: () => (state) => {
    // If no persisted leads or empty array, seed from mock data
    if (state && (!state.leads || state.leads.length === 0)) {
      state.leads = LEADS_LIST
    }
  },
}))
