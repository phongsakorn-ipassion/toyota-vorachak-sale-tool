import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { DEMO_USERS } from '../lib/mockData'
import { supabase } from '../lib/supabase'

export const useAuthStore = create(persist((set, get) => ({
  user: null,
  role: null, // 'sales' | 'mgr'
  isLoggedIn: false,
  isDemo: false,
  _hasHydrated: false,

  login: (role) => {
    const user = DEMO_USERS[role]
    if (!user) return
    set({
      user,
      role: user.role,
      isLoggedIn: true,
      isDemo: true,
    })
  },

  loginWithSupabase: async (email, password, role) => {
    if (!supabase) {
      console.warn('Supabase not configured, falling back to demo login')
      get().login(role)
      return
    }
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      })
      if (error) throw error
      set({
        user: {
          id: data.user.id,
          email: data.user.email,
          name: data.user.user_metadata?.name || email,
          role,
          branch: data.user.user_metadata?.branch || 'lp',
        },
        role,
        isLoggedIn: true,
        isDemo: false,
      })
    } catch (err) {
      console.error('Login failed:', err.message)
      throw err
    }
  },

  logout: async () => {
    if (!get().isDemo && supabase) {
      await supabase.auth.signOut().catch(() => {})
    }
    set({
      user: null,
      role: null,
      isLoggedIn: false,
      isDemo: false,
    })
  },

  updateProfile: (updates) =>
    set((state) => ({
      user: state.user ? { ...state.user, ...updates } : state.user,
    })),

  switchRole: (newRole) => {
    const current = get()
    if (!current.isLoggedIn) return
    const user = DEMO_USERS[newRole]
    if (!user) return
    set({
      user: { ...current.user, ...user },
      role: newRole,
    })
  },

  checkSession: async () => {
    if (!supabase) return
    try {
      const { data } = await supabase.auth.getSession()
      if (data.session?.user) {
        const u = data.session.user
        set({
          user: {
            id: u.id,
            email: u.email,
            name: u.user_metadata?.name || u.email,
            role: u.user_metadata?.role || 'sales',
            branch: u.user_metadata?.branch || 'lp',
          },
          role: u.user_metadata?.role || 'sales',
          isLoggedIn: true,
          isDemo: false,
        })
      }
    } catch (err) {
      console.error('Session check failed:', err.message)
    }
  },
}), {
  name: 'toyota-auth',
  partialize: (state) => ({
    user: state.user,
    role: state.role,
    isLoggedIn: state.isLoggedIn,
    isDemo: state.isDemo,
  }),
  onRehydrateStorage: () => () => {
    useAuthStore.setState({ _hasHydrated: true })
  },
}))
