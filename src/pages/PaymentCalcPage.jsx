import React from 'react'
import { useNavigate } from 'react-router-dom'
import PageHeader from '../components/layout/PageHeader'
import Card from '../components/ui/Card'
import Button from '../components/ui/Button'
import { useBookingStore } from '../stores/bookingStore'
import { CARS, CARS_LIST } from '../lib/mockData'
import { LOAN_TERMS } from '../lib/constants'
import { formatPrice, monthlyPayment } from '../lib/formats'

export default function PaymentCalcPage() {
  const navigate = useNavigate()
  const {
    carId,
    setCarId,
    downPaymentPct,
    setDownPayment,
    loanTerm,
    setLoanTerm,
    interestRate,
    getSelectedCar,
    getDownPayment,
    getLoanAmount,
    getMonthlyPayment,
  } = useBookingStore()

  const car = getSelectedCar()
  const downAmount = getDownPayment()
  const loanAmount = getLoanAmount()
  const monthly = getMonthlyPayment()

  // Calculate total interest and total payment
  const totalPayment = car ? monthly * loanTerm : 0
  const totalInterest = car ? totalPayment - loanAmount : 0

  const handleProceedBooking = () => {
    if (!carId) return
    navigate('/booking')
  }

  return (
    <div className="flex flex-col h-full bg-surface">
      <PageHeader title="คำนวณสินเชื่อ" showBack />

      <div className="flex-1 overflow-y-auto pb-6">
        <div className="p-4 space-y-5">

          {/* Car Selector */}
          {car ? (
            <Card className="flex items-center gap-3">
              <img
                src={car.img}
                alt={car.name}
                className="w-20 h-14 object-cover rounded-md"
              />
              <div className="flex-1 min-w-0">
                <p className="font-bold text-t1 text-sm">{car.name}</p>
                <p className="text-primary font-extrabold text-base">{formatPrice(car.price)}</p>
              </div>
              <button
                onClick={() => setCarId(null)}
                className="text-xs text-t3 underline cursor-pointer"
              >
                เปลี่ยน
              </button>
            </Card>
          ) : (
            <Card>
              <label className="block text-sm font-semibold text-t1 mb-2">เลือกรถ</label>
              <select
                value=""
                onChange={(e) => setCarId(e.target.value)}
                className="w-full border border-border rounded-lg py-3 px-3 text-sm bg-white text-t1 focus:border-primary focus:outline-none"
              >
                <option value="" disabled>-- เลือกรุ่นรถ --</option>
                {CARS_LIST.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.name} — {c.priceLabel}
                  </option>
                ))}
              </select>
            </Card>
          )}

          {/* Down Payment */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-semibold text-t1">เงินดาวน์</span>
              <span className="text-sm font-bold text-primary">{downPaymentPct}%</span>
            </div>
            <input
              type="range"
              min={0}
              max={100}
              step={5}
              value={downPaymentPct}
              onChange={(e) => setDownPayment(Number(e.target.value))}
              className="w-full accent-primary"
            />
            <p className="text-sm text-t2 mt-1">
              {car ? formatPrice(downAmount) : '฿0'}
            </p>
          </div>

          {/* Loan Term */}
          <div>
            <p className="text-sm font-semibold text-t1 mb-2">ระยะเวลาผ่อน</p>
            <div className="flex flex-wrap gap-2">
              {LOAN_TERMS.map((term) => (
                <button
                  key={term}
                  onClick={() => setLoanTerm(term)}
                  className={`
                    py-2 px-3 rounded-full text-xs font-semibold transition-colors cursor-pointer
                    ${loanTerm === term
                      ? 'bg-primary text-white'
                      : 'bg-gray-100 text-t2 hover:bg-gray-200'}
                  `.trim()}
                >
                  {term} เดือน
                </button>
              ))}
            </div>
          </div>

          {/* Interest Rate */}
          <p className="text-sm text-t2">
            อัตราดอกเบี้ย {interestRate}% ต่อปี
          </p>

          {/* Results Card */}
          {car && (
            <div className="bg-primary-light rounded-lg p-4">
              <p className="text-2xl font-extrabold text-primary text-center">
                {formatPrice(monthly)}/เดือน
              </p>

              <div className="grid grid-cols-3 gap-3 mt-4">
                <div className="text-center">
                  <p className="text-xs text-t2">ยอดจัดไฟแนนซ์</p>
                  <p className="text-sm font-bold text-t1 mt-0.5">{formatPrice(loanAmount)}</p>
                </div>
                <div className="text-center">
                  <p className="text-xs text-t2">ดอกเบี้ยรวม</p>
                  <p className="text-sm font-bold text-t1 mt-0.5">{formatPrice(totalInterest)}</p>
                </div>
                <div className="text-center">
                  <p className="text-xs text-t2">ยอดรวมทั้งหมด</p>
                  <p className="text-sm font-bold text-t1 mt-0.5">{formatPrice(totalPayment)}</p>
                </div>
              </div>
            </div>
          )}

          {/* CTA Button */}
          <Button
            fullWidth
            size="lg"
            disabled={!carId}
            onClick={handleProceedBooking}
          >
            ดำเนินการจอง
          </Button>

        </div>
      </div>
    </div>
  )
}
