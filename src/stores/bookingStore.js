import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { monthlyPayment } from '../lib/formats'
import { CARS } from '../lib/mockData'
import { useLeadStore } from './leadStore'
import { stampRecord } from '../lib/concurrentCheck'
import { syncTable, pushRecord, bookingToRemote, remoteToBooking } from '../lib/dataSync'

function generateBookingRef() {
  const now = new Date()
  const yyyy = now.getFullYear()
  const mm = String(now.getMonth() + 1).padStart(2, '0')
  const rand = String(Math.floor(Math.random() * 1000000)).padStart(6, '0')
  return `BK-${yyyy}${mm}-${rand}`
}

export const useBookingStore = create(persist((set, get) => ({
  // ---------------------------------------------------------------------------
  // Wizard / calculator state
  // ---------------------------------------------------------------------------
  step: 1, // 1=Select Car, 2=Customer Info, 3=Payment/Summary
  carId: null,
  leadId: null,
  savedBooking: null,
  customerName: '',
  customerPhone: '',
  customerEmail: '',
  customerInfo: { name: '', phone: '', email: '' },
  paymentMethod: 'installment', // 'installment' | 'cash' | 'qr' | 'transfer' | 'credit'
  downPaymentPct: 20,
  loanTerm: 60, // months
  loanTermMonths: 60, // alias for loanTerm
  interestRate: 2.79, // annual %
  selectedColor: 'Pearl White',
  deliveryDate: '',

  // ---------------------------------------------------------------------------
  // Bookings collection
  // ---------------------------------------------------------------------------
  bookings: [],

  // ---------------------------------------------------------------------------
  // Wizard setters
  // ---------------------------------------------------------------------------

  setStep: (step) => set({ step }),

  setCarId: (carId) => set({ carId }),

  setLeadId: (leadId) => set({ leadId }),

  setCustomerName: (name) => set({ customerName: name }),

  setCustomerPhone: (phone) => set({ customerPhone: phone }),

  setCustomerEmail: (email) => set({ customerEmail: email }),

  setCustomerInfo: (info) =>
    set((state) => ({
      customerInfo: { ...state.customerInfo, ...info },
      customerName: info.name !== undefined ? info.name : state.customerName,
      customerPhone: info.phone !== undefined ? info.phone : state.customerPhone,
      customerEmail: info.email !== undefined ? info.email : state.customerEmail,
    })),

  setPaymentMethod: (method) => set({ paymentMethod: method }),

  setDownPayment: (pct) => set({ downPaymentPct: pct }),

  setLoanTerm: (months) => set({ loanTerm: months }),

  setInterestRate: (rate) => set({ interestRate: rate }),

  setSelectedColor: (color) => set({ selectedColor: color }),

  setDeliveryDate: (date) => set({ deliveryDate: date }),

  setLoanTermMonths: (months) => set({ loanTermMonths: months, loanTerm: months }),

  reset: () =>
    set({
      step: 1,
      carId: null,
      leadId: null,
      savedBooking: null,
      customerName: '',
      customerPhone: '',
      customerEmail: '',
      customerInfo: { name: '', phone: '', email: '' },
      paymentMethod: 'installment',
      downPaymentPct: 20,
      loanTerm: 60,
      loanTermMonths: 60,
      interestRate: 2.79,
      selectedColor: 'Pearl White',
      deliveryDate: '',
    }),

  // ---------------------------------------------------------------------------
  // Calculator getters
  // ---------------------------------------------------------------------------

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

  getTotalInterest: () => {
    const { carId, downPaymentPct, loanTerm, interestRate } = get()
    const car = carId ? CARS[carId] : null
    if (!car) return 0
    const down = Math.round(car.price * (downPaymentPct / 100))
    const principal = car.price - down
    if (principal <= 0) return 0
    const monthly = monthlyPayment(principal, interestRate, loanTerm)
    return Math.round(monthly * loanTerm - principal)
  },

  // ---------------------------------------------------------------------------
  // Booking CRUD
  // ---------------------------------------------------------------------------

  saveBooking: (bookingData = {}) => {
    const state = get()
    const car = state.carId ? CARS[state.carId] : null

    // Stock check: verify the car is still available before booking
    if (car) {
      const existingBookingsForCar = state.bookings.filter(
        (b) => b.carId === state.carId && b.status === 'confirmed'
      )
      // If car has a numeric stock value and all are booked, reject
      if (car.stockCount !== undefined && existingBookingsForCar.length >= car.stockCount) {
        return { conflict: true, message: 'สต็อครถถูกจองโดยผู้ใช้อื่น' }
      }
    }

    const name = state.customerName || state.customerInfo.name
    const phone = state.customerPhone || state.customerInfo.phone
    const email = state.customerEmail || state.customerInfo.email

    const booking = stampRecord({
      id: (typeof crypto !== 'undefined' && crypto.randomUUID) ? crypto.randomUUID() : `booking_${Date.now()}`,
      ref: generateBookingRef(),
      carId: state.carId,
      carName: car ? car.name : '',
      carPrice: car ? car.price : 0,
      leadId: state.leadId,
      customerName: name,
      customerPhone: phone,
      customerEmail: email,
      customerInfo: { name, phone, email },
      paymentMethod: state.paymentMethod,
      downPaymentPct: state.downPaymentPct,
      downPayment: state.getDownPayment(),
      loanAmount: state.getLoanAmount(),
      loanTerm: state.loanTerm,
      loanTermMonths: state.loanTermMonths || state.loanTerm,
      interestRate: state.interestRate,
      monthlyPayment: state.getMonthlyPayment(),
      totalInterest: state.getTotalInterest(),
      color: state.selectedColor,
      selectedColor: state.selectedColor,
      deliveryDate: state.deliveryDate,
      status: 'confirmed', // 'confirmed' | 'cancelled'
      createdAt: new Date().toISOString(),
      ...bookingData,
    })

    set((s) => ({
      bookings: [booking, ...s.bookings],
      savedBooking: booking,
    }))

    // Async push to Supabase
    pushRecord('bookings', booking, bookingToRemote);

    // Update lead status if linked
    if (booking.leadId) {
      const leadStore = useLeadStore.getState()
      leadStore.changeLevel(booking.leadId, 'won')
      leadStore.changeStage(booking.leadId, 'won')
      leadStore.addActivity(booking.leadId, {
        type: 'booking',
        title: 'จองรถสำเร็จ',
        content: `จองรถ ${booking.carName} — Ref: ${booking.ref}`,
        createdBy: 'system',
      })
    }

    return booking
  },

  getBookings: () => {
    return get().bookings
  },

  getBookingById: (id) => {
    return get().bookings.find((b) => b.id === id || b.ref === id) || null
  },

  cancelBooking: (id) => {
    set((state) => ({
      bookings: state.bookings.map((b) =>
        b.id === id || b.ref === id ? { ...b, status: 'cancelled', _updatedAt: Date.now() } : b
      ),
    }));
    // Async push cancelled booking to Supabase
    const cancelled = get().bookings.find((b) => b.id === id || b.ref === id);
    if (cancelled) pushRecord('bookings', cancelled, bookingToRemote);
  },

  syncFromServer: async () => {
    const result = await syncTable({
      tableName: 'bookings',
      localData: get().bookings,
      mapToRemote: bookingToRemote,
      mapToLocal: remoteToBooking,
    });
    if (result.pulled > 0 || result.pushed > 0) {
      set({ bookings: result.data });
    }
  },
}), {
  name: 'toyota-bookings',
  partialize: (state) => ({
    bookings: state.bookings,
    carId: state.carId,
    leadId: state.leadId,
  }),
}))
