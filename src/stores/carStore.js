import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { CARS, CARS_LIST } from '../lib/mockData'

export const useCarStore = create(persist((set, get) => ({
  cars: CARS_LIST,
  selectedCar: null,
  filters: {
    type: 'all',
    model: 'all',
    budget: 'all',
    search: '',
  },

  setCars: (cars) => set({ cars }),

  setFilter: (key, value) =>
    set((state) => ({
      filters: { ...state.filters, [key]: value },
    })),

  resetFilters: () =>
    set({
      filters: { type: 'all', model: 'all', budget: 'all', search: '' },
    }),

  selectCar: (id) => {
    const car = id ? CARS[id] || get().cars.find((c) => c.id === id) : null
    set({ selectedCar: car })
  },

  get filteredCars() {
    return get().getFilteredCars()
  },

  getFilteredCars: () => {
    const { cars, filters } = get()
    let result = [...cars]

    // Filter by type/category
    if (filters.type !== 'all') {
      result = result.filter(
        (c) => c.cat === filters.type || c.type === filters.type
      )
    }

    // Filter by model
    if (filters.model !== 'all') {
      result = result.filter((c) => c.id === filters.model)
    }

    // Filter by budget range
    if (filters.budget !== 'all') {
      switch (filters.budget) {
        case 'under700':
          result = result.filter((c) => c.price < 700000)
          break
        case '700to1m':
          result = result.filter((c) => c.price >= 700000 && c.price <= 1000000)
          break
        case '1mto1.5m':
          result = result.filter(
            (c) => c.price > 1000000 && c.price <= 1500000
          )
          break
        case 'over1.5m':
          result = result.filter((c) => c.price > 1500000)
          break
      }
    }

    // Search by name/type
    if (filters.search.trim()) {
      const q = filters.search.toLowerCase()
      result = result.filter(
        (c) =>
          c.name.toLowerCase().includes(q) ||
          c.type.toLowerCase().includes(q) ||
          c.id.toLowerCase().includes(q)
      )
    }

    return result
  },
}), {
  name: 'toyota-cars',
  partialize: (state) => ({
    selectedCar: state.selectedCar,
    filters: state.filters,
  }),
}))
