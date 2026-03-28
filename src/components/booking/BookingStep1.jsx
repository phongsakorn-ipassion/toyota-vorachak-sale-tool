import React, { useState } from 'react'
import Input from '../ui/Input'
import Card from '../ui/Card'
import Button from '../ui/Button'
import { useBookingStore } from '../../stores/bookingStore'
import { formatPrice } from '../../lib/formats'

const PAYMENT_METHODS = [
  { id: 'cash', label: 'สด' },
  { id: 'installment', label: 'ผ่อน' },
  { id: 'lease', label: 'เช่า' },
]

export default function BookingStep1() {
  const {
    customerInfo,
    setCustomerInfo,
    paymentMethod,
    setPaymentMethod,
    setStep,
    getSelectedCar,
    downPaymentPct,
    loanTerm,
    getMonthlyPayment,
  } = useBookingStore()

  const car = getSelectedCar()
  const monthly = getMonthlyPayment()

  const [errors, setErrors] = useState({})

  const handleNext = () => {
    const newErrors = {}
    if (!customerInfo.name.trim()) newErrors.name = 'กรุณากรอกชื่อ-นามสกุล'
    if (!customerInfo.phone.trim()) newErrors.phone = 'กรุณากรอกเบอร์โทรศัพท์'

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors)
      return
    }

    setErrors({})
    setStep(2)
  }

  return (
    <div className="p-4 space-y-5">
      {/* Customer Info */}
      <div>
        <h2 className="text-sm font-bold text-t1 mb-3">ข้อมูลผู้จอง</h2>
        <Input
          label="ชื่อ-นามสกุล"
          icon="profile"
          placeholder="กรอกชื่อ-นามสกุล"
          value={customerInfo.name}
          onChange={(e) => setCustomerInfo({ name: e.target.value })}
          error={errors.name}
        />
        <Input
          label="โทรศัพท์"
          icon="phone"
          placeholder="08X-XXX-XXXX"
          type="tel"
          value={customerInfo.phone}
          onChange={(e) => setCustomerInfo({ phone: e.target.value })}
          error={errors.phone}
        />
        <Input
          label="อีเมล"
          icon="mail"
          placeholder="email@example.com"
          type="email"
          value={customerInfo.email}
          onChange={(e) => setCustomerInfo({ email: e.target.value })}
        />
      </div>

      {/* Order Summary */}
      <div>
        <h2 className="text-sm font-bold text-t1 mb-3">สรุปรายการ</h2>
        <Card>
          {car && (
            <div className="mb-3">
              <p className="font-bold text-t1 text-sm">{car.name}</p>
              <p className="text-primary font-extrabold text-base">{formatPrice(car.price)}</p>
            </div>
          )}

          {/* Payment method pills */}
          <p className="text-xs text-t2 mb-2">วิธีการชำระเงิน</p>
          <div className="flex gap-2 mb-3">
            {PAYMENT_METHODS.map((m) => (
              <button
                key={m.id}
                onClick={() => setPaymentMethod(m.id)}
                className={`
                  py-1.5 px-4 rounded-full text-xs font-semibold transition-colors cursor-pointer
                  ${paymentMethod === m.id
                    ? 'bg-primary text-white'
                    : 'bg-gray-100 text-t2 hover:bg-gray-200'}
                `.trim()}
              >
                {m.label}
              </button>
            ))}
          </div>

          {/* Installment details */}
          {paymentMethod === 'installment' && car && (
            <div className="bg-gray-50 rounded-md p-3 space-y-1.5 text-sm">
              <div className="flex justify-between">
                <span className="text-t2">เงินดาวน์</span>
                <span className="font-semibold text-t1">{downPaymentPct}%</span>
              </div>
              <div className="flex justify-between">
                <span className="text-t2">ระยะเวลาผ่อน</span>
                <span className="font-semibold text-t1">{loanTerm} เดือน</span>
              </div>
              <div className="flex justify-between">
                <span className="text-t2">ผ่อนเดือนละ</span>
                <span className="font-bold text-primary">{formatPrice(monthly)}</span>
              </div>
            </div>
          )}
        </Card>
      </div>

      {/* CTA */}
      <Button fullWidth size="lg" onClick={handleNext}>
        ยืนยันข้อมูล
      </Button>
    </div>
  )
}
