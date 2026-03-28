import { create } from 'zustand'
import { monthlyPayment } from '../lib/formats'
import { CARS } from '../lib/mockData'

export const useBookingStore = create((set, get) => ({
  step: 1, // 1=Select Car, 2=Customer Info, 3=Payment/Summary
  carId: null,
  customerInfo: {
    name: '',
    phone: '',
    email: '',
  },
  paymentMethod: 'installment', // 'installment' | 'cash'
  downPaymentPct: 20,
  loanTerm: 60, // months
  interestRate: 2.79, // annual %

  setStep: (step) => set({ step }),

  setCarId: (carId) => set({ carId }),

  setCustomerInfo: (info) =>
    set((state) => ({
      customerInfo: { ...state.customerInfo, ...info },
    })),

  setPaymentMethod: (method) => set({ paymentMethod: method }),

  setDownPayment: (pct) => set({ downPaymentPct: pct }),

  setLoanTerm: (months) => set({ loanTerm: months }),

  setInterestRate: (rate) => set({ interestRate: rate }),

  reset: () =>
    set({
      step: 1,
      carId: null,
      customerInfo: { name: '', phone: '', email: '' },
      paymentMethod: 'installment',
      downPaymentPct: 20,
      loanTerm: 60,
      interestRate: 2.79,
    }),

  // Computed getters
  getSelectedCar: () => {
    const { carId } = get()
    return carId ? CARS[carId] : null
  },

  getDownPayment: () => {
    const { carId, downPaymentPct } = get()
    const car = carId ? CARS[carId] : null
    if (!car) return 0
    return Math.round(car.price * (downPaymentPct / 100))
  },

  getLoanAmount: () => {
    const { carId, downPaymentPct } = get()
    const car = carId ? CARS[carId] : null
    if (!car) return 0
    const down = Math.round(car.price * (downPaymentPct / 100))
    return car.price - down
  },

  getMonthlyPayment: () => {
    const { carId, downPaymentPct, loanTerm, interestRate } = get()
    const car = carId ? CARS[carId] : null
    if (!car) return 0
    const down = Math.round(car.price * (downPaymentPct / 100))
    const principal = car.price - down
    if (principal <= 0) return 0
    return Math.round(monthlyPayment(principal, interestRate, loanTerm))
  },
}))
