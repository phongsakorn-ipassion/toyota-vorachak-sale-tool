import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export const useDraftStore = create(persist((set, get) => ({
  // A-Card form draft
  acardDraft: null,
  setAcardDraft: (draft) => set({ acardDraft: draft }),
  clearAcardDraft: () => set({ acardDraft: null }),

  // Booking form draft
  bookingDraft: null,
  setBookingDraft: (draft) => set({ bookingDraft: draft }),
  clearBookingDraft: () => set({ bookingDraft: null }),
}), {
  name: 'toyota-drafts',
}))
