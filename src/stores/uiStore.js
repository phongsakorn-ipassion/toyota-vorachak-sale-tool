import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { NOTIFICATIONS } from '../lib/mockData'
import { syncTable, pushRecord, notificationToRemote, remoteToNotification } from '../lib/dataSync'

export const useUiStore = create(persist((set, get) => ({
  device: 'phone', // 'phone' | 'tablet' | 'desktop'
  navHistory: [],
  activeTab: 'home',
  sidebarOpen: false,
  notifications: NOTIFICATIONS,
  notificationsEnabled: false,

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

  setNotificationsEnabled: (enabled) => set({ notificationsEnabled: enabled }),

  addNotification: (notification) => {
    const state = get()
    const newNotification = {
      id: `n${Date.now()}`,
      read: false,
      time: new Date().toISOString(),
      ...notification,
    }

    // Trigger system notification if enabled
    if (state.notificationsEnabled && typeof Notification !== 'undefined' && Notification.permission === 'granted') {
      new Notification(notification.title || 'Toyota Sale Tool', { body: notification.body || '' })
    }

    set({
      notifications: [newNotification, ...state.notifications],
    })
    // Push to Supabase
    pushRecord('notifications', newNotification, notificationToRemote);
  },

  markRead: (id) => {
    set((state) => ({
      notifications: state.notifications.map((n) =>
        n.id === id ? { ...n, read: true } : n
      ),
    }));
    // Push updated notification to Supabase
    const updated = get().notifications.find((n) => n.id === id);
    if (updated) pushRecord('notifications', updated, notificationToRemote);
  },

  markAllRead: () =>
    set((state) => ({
      notifications: state.notifications.map((n) => ({ ...n, read: true })),
    })),

  deleteNotification: (id) =>
    set((state) => ({
      notifications: state.notifications.filter((n) => n.id !== id),
    })),

  clearAllNotifications: () => set({ notifications: [] }),

  syncFromServer: async () => {
    const result = await syncTable({
      tableName: 'notifications',
      localData: get().notifications,
      mapToRemote: notificationToRemote,
      mapToLocal: remoteToNotification,
    });
    if (result.pulled > 0 || result.pushed > 0) {
      set({ notifications: result.data });
    }
  },

  getUnreadCount: () => {
    return get().notifications.filter((n) => !n.read).length
  },
}), {
  name: 'toyota-ui',
  partialize: (state) => ({
    notifications: state.notifications,
    notificationsEnabled: state.notificationsEnabled,
  }),
  onRehydrateStorage: () => (state) => {
    // If no persisted notifications, seed from mock data
    if (state && (!state.notifications || state.notifications.length === 0)) {
      state.notifications = NOTIFICATIONS
    }
  },
}))
