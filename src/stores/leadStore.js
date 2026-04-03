import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { LEADS, LEADS_LIST } from '../lib/mockData'
import { LEAD_STAGES, TEST_DRIVE_STATUSES } from '../lib/constants'
import { stampRecord, hasConflict, conflictMessage } from '../lib/concurrentCheck'
import { syncTable, pushRecord, deleteRecord, leadToRemote, remoteToLead, pushLead } from '../lib/dataSync'

// ---------------------------------------------------------------------------
// Derived category — pure function, exported for use by pages
// ---------------------------------------------------------------------------

export function deriveCategory(lead) {
  if (!lead) return null;
  if (lead.stage === 'close_won' || lead.stage === 'close_lost') return null;
  const src = (lead.source || '').toLowerCase();
  if (src.includes('walk-in') || src.includes('walk in')) return 'hot';
  if (lead.stage !== 'new_lead') return 'warm';
  return 'cool';
}

// ---------------------------------------------------------------------------
// Store
// ---------------------------------------------------------------------------

export const useLeadStore = create(persist((set, get) => ({
  leads: LEADS_LIST,
  selectedLead: null,
  filterStage: 'all', // 'all' | 'new_lead' | 'proposal' | 'evaluation' | 'close_won' | 'close_lost'
  filterCategory: 'all', // 'all' | 'hot' | 'warm' | 'cool'
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

  setFilterStage: (stage) => set({ filterStage: stage }),

  setFilterCategory: (cat) => set({ filterCategory: cat }),

  setFilterType: (type) => set({ filterType: type }),

  setSearch: (term) => set({ searchTerm: term }),

  // ---------------------------------------------------------------------------
  // CRUD
  // ---------------------------------------------------------------------------

  addLead: (lead) => {
    const isTestDrive = (lead.leadType || 'purchase') === 'test_drive';
    const newLead = stampRecord({
      id: (typeof crypto !== 'undefined' && crypto.randomUUID) ? crypto.randomUUID() : `lead_${Date.now()}`,
      leadType: 'purchase',
      createdAt: new Date().toISOString(),
      activities: [],
      stage: 'new_lead',
      ...(isTestDrive ? { testDriveStatus: 'scheduled' } : {}),
      ...lead,
    });
    set((state) => ({
      leads: [newLead, ...state.leads],
    }));
    // Async push to Supabase
    pushRecord('leads', newLead, leadToRemote);
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
    // Async push to Supabase
    pushRecord('leads', updated, leadToRemote);
    return { success: true }
  },

  deleteLead: (id) => {
    set((state) => ({
      leads: state.leads.filter((l) => l.id !== id),
      selectedLead: state.selectedLead?.id === id ? null : state.selectedLead,
    }));
    // Async delete from Supabase
    deleteRecord('leads', id);
  },

  // ---------------------------------------------------------------------------
  // Stage transitions
  // ---------------------------------------------------------------------------

  advanceStage: (id, targetStage, note, _readAt) => {
    const STAGE_ORDER = ['new_lead', 'proposal', 'evaluation', 'close_won', 'close_lost'];
    const state = get();
    const lead = state.leads.find(l => l.id === id);
    if (!lead) return { error: 'not_found' };

    const currentIdx = STAGE_ORDER.indexOf(lead.stage);
    const targetIdx = STAGE_ORDER.indexOf(targetStage);

    // Allow close_lost from any non-terminal stage
    if (targetStage === 'close_lost') {
      if (lead.stage === 'close_won' || lead.stage === 'close_lost') return { error: 'already_closed' };
      if (!note?.trim()) return { error: 'note_required' };
    } else if (targetStage === 'close_won') {
      if (lead.stage === 'close_won' || lead.stage === 'close_lost') return { error: 'already_closed' };
    } else {
      // For non-close stages, must be forward
      if (targetIdx <= currentIdx) return { error: 'cannot_reverse' };
    }

    // Concurrent check
    if (_readAt && lead._updatedAt && lead._updatedAt > _readAt) {
      return { conflict: true, message: 'ข้อมูลถูกแก้ไขโดยผู้ใช้อื่น' };
    }

    const updatedLead = stampRecord({ ...lead, stage: targetStage });
    const activity = {
      id: `act_${Date.now()}`,
      type: 'stage_change',
      title: `เปลี่ยนสถานะเป็น ${LEAD_STAGES[targetStage]?.labelTh || targetStage}`,
      description: note || '',
      createdAt: new Date().toISOString(),
      createdBy: 'มาลี',
    };
    updatedLead.activities = [activity, ...(updatedLead.activities || [])];

    set((state) => ({
      leads: state.leads.map(l => l.id === id ? updatedLead : l),
    }));
    pushLead(updatedLead);
    return updatedLead;
  },

  changeTestDriveStatus: (id, newStatus, note, _readAt) => {
    const state = get();
    const lead = state.leads.find(l => l.id === id);
    if (!lead) return { error: 'not_found' };
    if (_readAt && lead._updatedAt && lead._updatedAt > _readAt) {
      return { conflict: true, message: 'ข้อมูลถูกแก้ไขโดยผู้ใช้อื่น' };
    }

    const updatedLead = stampRecord({ ...lead, testDriveStatus: newStatus });
    const activity = {
      id: `act_${Date.now()}`,
      type: 'test_drive_status',
      title: `ทดลองขับ: ${TEST_DRIVE_STATUSES[newStatus]?.label || newStatus}`,
      description: note || '',
      createdAt: new Date().toISOString(),
      createdBy: 'มาลี',
    };
    updatedLead.activities = [activity, ...(updatedLead.activities || [])];

    set((state) => ({
      leads: state.leads.map(l => l.id === id ? updatedLead : l),
    }));
    pushLead(updatedLead);
    return updatedLead;
  },

  assignLead: (id, salesId, _readAt) => {
    return get().updateLead(id, { assignedTo: salesId }, _readAt)
  },

  // ---------------------------------------------------------------------------
  // Activities
  // ---------------------------------------------------------------------------

  addActivity: (leadId, activity) => {
    const newActivity = {
      id: `a${Date.now()}`,
      time: new Date().toISOString(),
      createdBy: activity.createdBy || 'system',
      ...activity,
    }
    set((state) => {
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
    });
    // Push parent lead to Supabase (activities stored in JSONB)
    const parentLead = get().leads.find((l) => l.id === leadId);
    if (parentLead) pushRecord('leads', parentLead, leadToRemote);
  },

  editActivity: (leadId, activityId, updates) => {
    set((state) => ({
      leads: state.leads.map(l => l.id === leadId ? {
        ...l,
        activities: (l.activities || []).map(a => a.id === activityId ? { ...a, ...updates, _updatedAt: Date.now() } : a)
      } : l)
    }));
    // Push parent lead to Supabase
    const parentLead = get().leads.find((l) => l.id === leadId);
    if (parentLead) pushRecord('leads', parentLead, leadToRemote);
  },

  deleteActivity: (leadId, activityId) => {
    set((state) => ({
      leads: state.leads.map(l => l.id === leadId ? {
        ...l,
        activities: (l.activities || []).filter(a => a.id !== activityId)
      } : l)
    }));
    // Push parent lead to Supabase
    const parentLead = get().leads.find((l) => l.id === leadId);
    if (parentLead) pushRecord('leads', parentLead, leadToRemote);
    return true;
  },

  // ---------------------------------------------------------------------------
  // Getters / computed
  // ---------------------------------------------------------------------------

  getFilteredLeads: () => {
    const { leads, filterStage, filterCategory, filterType, searchTerm } = get()
    let result = leads

    // Filter by lead type first (default to 'purchase' for leads without leadType)
    result = result.filter((l) => (l.leadType || 'purchase') === filterType)

    if (filterType === 'purchase') {
      // Stage filter for purchase leads
      if (filterStage !== 'all') {
        result = result.filter((l) => l.stage === filterStage)
      }
      // Category filter (derived)
      if (filterCategory !== 'all') {
        result = result.filter((l) => deriveCategory(l) === filterCategory)
      }
    } else {
      // Test drive tab: filter by testDriveStatus
      if (filterStage !== 'all') {
        result = result.filter((l) => l.testDriveStatus === filterStage)
      }
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
    const purchaseLeads = leads.filter(l => (l.leadType || 'purchase') === 'purchase')
    const testDriveLeads = leads.filter(l => l.leadType === 'test_drive')

    // Purchase pipeline: group by stage
    const purchasePipeline = {}
    const stages = ['new_lead', 'proposal', 'evaluation', 'close_won', 'close_lost']
    stages.forEach((stage) => {
      purchasePipeline[stage] = purchaseLeads.filter((l) => l.stage === stage)
    })

    // Test drive pipeline: group by testDriveStatus
    const testDrivePipeline = {}
    const tdStatuses = ['scheduled', 'completed', 'cancelled']
    tdStatuses.forEach((status) => {
      testDrivePipeline[status] = testDriveLeads.filter((l) => l.testDriveStatus === status)
    })

    return { purchase: purchasePipeline, testDrive: testDrivePipeline }
  },

  getLeadStats: () => {
    const leads = get().leads;
    const stats = { new_lead: 0, proposal: 0, evaluation: 0, close_won: 0, close_lost: 0, hot: 0, warm: 0, cool: 0, total: leads.length };
    leads.forEach(l => {
      if (l.stage && stats[l.stage] !== undefined) stats[l.stage]++;
      const cat = deriveCategory(l);
      if (cat && stats[cat] !== undefined) stats[cat]++;
    });
    return stats;
  },

  syncFromServer: async () => {
    const result = await syncTable({
      tableName: 'leads',
      localData: get().leads,
      mapToRemote: leadToRemote,
      mapToLocal: remoteToLead,
    });
    if (result.pulled > 0 || result.pushed > 0) {
      set({ leads: result.data });
    }
  },
}), {
  name: 'toyota-leads',
  partialize: (state) => ({ leads: state.leads }),
  onRehydrateStorage: () => (state) => {
    if (state?.leads) {
      state.leads = state.leads.map(l => {
        if (l.stage) return l; // already migrated
        // Migrate old level-based leads
        let stage = 'new_lead';
        if (l.level === 'won') stage = 'close_won';
        else if (l.level === 'lost') stage = 'close_lost';
        else if (l.level === 'hot' && l.source?.toLowerCase().includes('walk-in')) stage = 'proposal';

        const migrated = { ...l, stage };
        // Migrate test drive status
        if (l.leadType === 'test_drive') {
          if (!l.testDriveStatus) {
            if (l.level === 'completed') migrated.testDriveStatus = 'completed';
            else if (l.level === 'cancelled' || l.level === 'no_show') migrated.testDriveStatus = 'cancelled';
            else migrated.testDriveStatus = 'scheduled';
          }
        }
        return migrated;
      });
    }
    if (!state?.leads?.length) state.leads = LEADS_LIST;
  },
}))
