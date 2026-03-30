import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { NOTIFICATIONS } from '../lib/mockData'

export const useUiStore = create(persist((set, get) => ({
  device: 'phone', // 'phone' | 'tablet' | 'desktop'
  navHistory: [],
  activeTab: 'home',
  sidebarOpen: false,
  notifications: NOTIFICATIONS,

  setDevice: (device) => set({ device }),

  pushNav: (path) =>
    set((state) => ({
      navHistory: [...state.navHistory, path],
    })),

  popNav: () =>
    set((state) => {
      const history = [...state.navHistory]
      history.pop()
      return { navHistory: history }
    }),

  setActiveTab: (tab) => set({ activeTab: tab }),

  setSidebarOpen: (open) => set({ sidebarOpen: open }),

  toggleSidebar: () =>
    set((state) => ({ sidebarOpen: !state.sidebarOpen })),

  addNotification: (notification) =>
    set((state) => ({
      notifications: [
        {
          id: `n${Date.now()}`,
          read: false,
          time: new Date().toISOString(),
          ...notification,
        },
        ...state.notifications,
      ],
    })),

  markRead: (id) =>
    set((state) => ({
      notifications: state.notifications.map((n) =>
        n.id === id ? { ...n, read: true } : n
      ),
    })),

  markAllRead: () =>
    set((state) => ({
      notifications: state.notifications.map((n) => ({ ...n, read: true })),
    })),

  deleteNotification: (id) =>
    set((state) => ({
      notifications: state.notifications.filter((n) => n.id !== id),
    })),

  clearAllNotifications: () => set({ notifications: [] }),

  getUnreadCount: () => {
    return get().notifications.filter((n) => !n.read).length
  },
}), {
  name: 'toyota-ui',
  partialize: (state) => ({
    notifications: state.notifications,
  }),
  onRehydrateStorage: () => (state) => {
    // If no persisted notifications, seed from mock data
    if (state && (!state.notifications || state.notifications.length === 0)) {
      state.notifications = NOTIFICATIONS
    }
  },
}))
