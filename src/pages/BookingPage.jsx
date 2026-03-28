import React, { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import PageHeader from '../components/layout/PageHeader'
import StepIndicator from '../components/ui/StepIndicator'
import { useBookingStore } from '../stores/bookingStore'
import { useLeadStore } from '../stores/leadStore'
import BookingStep1 from '../components/booking/BookingStep1'
import BookingStep2 from '../components/booking/BookingStep2'
import BookingStep3 from '../components/booking/BookingStep3'

export default function BookingPage() {
  const { step, leadId, carId } = useBookingStore()
  const navigate = useNavigate()

  // Pre-fill customer info from linked lead if leadId is set
  const leads = useLeadStore((s) => s.leads)
  const setCustomerInfo = useBookingStore((s) => s.setCustomerInfo)

  useEffect(() => {
    if (leadId) {
      const lead = leads.find((l) => l.id === leadId)
      if (lead) {
        setCustomerInfo({
          name: lead.name || '',
          phone: lead.phone || '',
          email: lead.email || '',
        })
      }
    }
  }, [leadId, leads, setCustomerInfo])

  return (
    <div className="flex flex-col h-full bg-surface">
      <PageHeader title="จองรถ" showBack />
      <StepIndicator currentStep={step} totalSteps={3} />

      <div className="flex-1 overflow-y-auto">
        {step === 1 && <BookingStep1 />}
        {step === 2 && <BookingStep2 />}
        {step === 3 && <BookingStep3 />}
      </div>
    </div>
  )
}
