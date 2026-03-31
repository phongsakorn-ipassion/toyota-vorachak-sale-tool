import React, { useState, useMemo, useEffect, useRef } from 'react'
import Icon from '../icons/Icon'
import { formatNumber, flatRateMonthly } from '../../lib/formats'
import { DOWN_PAYMENT_OPTIONS, LOAN_TERM_RANGE, DEFAULT_INTEREST_RATE } from '../../lib/constants'

/**
 * InlineCalculator — embedded flat-rate loan calculator for CarDetailPage
 * Props: carPrice (number), carName (string), onValuesChange (optional callback)
 */
export default function InlineCalculator({ carPrice, carName, onValuesChange }) {
  const [interestRate, setInterestRate] = useState(DEFAULT_INTEREST_RATE)
  const [downPaymentPct, setDownPaymentPct] = useState(15)
  const [loanTermMonths, setLoanTermMonths] = useState(LOAN_TERM_RANGE.default)

  // Fire callback when values change
  const isFirstRender = useRef(true)
  useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false
      return
    }
    if (onValuesChange) {
      onValuesChange({ downPaymentPct, interestRate, loanTermMonths })
    }
  }, [downPaymentPct, interestRate, loanTermMonths])

  const calc = useMemo(() => {
    const downPayment = Math.round(carPrice * downPaymentPct / 100)
    const financeAmount = carPrice - downPayment
    const totalInterest = financeAmount * (interestRate / 100) * (loanTermMonths / 12)
    const totalLoan = financeAmount + totalInterest
    const monthly = loanTermMonths > 0 ? Math.ceil(totalLoan / loanTermMonths) : 0
    return { downPayment, financeAmount, totalInterest, totalLoan, monthly }
  }, [carPrice, interestRate, downPaymentPct, loanTermMonths])

  // Generate tick labels for the slider
  const ticks = []
  for (let m = LOAN_TERM_RANGE.min; m <= LOAN_TERM_RANGE.max; m += LOAN_TERM_RANGE.step) {
    ticks.push(m)
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {/* Left Panel — Controls */}
      <div className="space-y-5">
        {/* Interest Rate */}
        <div>
          <label className="flex items-center gap-2 text-[12px] font-bold text-t1 mb-2">
            <span className="w-6 h-6 rounded-full bg-primary-light flex items-center justify-center">
              <Icon name="percent" size={12} className="text-primary" />
            </span>
            กำหนดดอกเบี้ย % ต่อปี
          </label>
          <div className="relative">
            <input
              type="number"
              step="0.01"
              min="0"
              max="20"
              value={interestRate}
              onChange={(e) => setInterestRate(parseFloat(e.target.value) || 0)}
              className="w-full h-[44px] bg-bg border border-border rounded-md px-3 pr-10 text-[14px] font-semibold text-t1 focus:border-primary focus:ring-1 focus:ring-primary outline-none"
            />
            <span className="absolute right-3 top-1/2 -translate-y-1/2 text-[13px] font-bold text-t3">%</span>
          </div>
        </div>

        {/* Down Payment */}
        <div>
          <label className="text-[12px] font-bold text-t1 mb-2 block">เงินดาวน์</label>
          <div className="flex flex-wrap gap-2 mb-3">
            {DOWN_PAYMENT_OPTIONS.map((pct) => (
              <button
                key={pct}
                onClick={() => setDownPaymentPct(pct)}
                className={`px-4 py-[7px] rounded-full text-[12px] font-bold transition-all cursor-pointer border ${
                  downPaymentPct === pct
                    ? 'bg-primary text-white border-primary shadow-sm'
                    : 'bg-white text-t2 border-border hover:border-primary hover:text-primary'
                }`}
              >
                {pct}%
              </button>
            ))}
          </div>
          <div className="flex items-center justify-between bg-bg rounded-md px-3 py-2">
            <span className="text-[11px] text-t3">เงินดาวน์</span>
            <span className="text-[12px] font-bold text-t1">฿{formatNumber(calc.downPayment)}</span>
          </div>
          <div className="flex items-center justify-between bg-bg rounded-md px-3 py-2 mt-1">
            <span className="text-[11px] text-t3">ยอดจัด</span>
            <span className="text-[12px] font-bold text-t1">฿{formatNumber(calc.financeAmount)}</span>
          </div>
        </div>

        {/* Loan Term Slider */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <label className="text-[12px] font-bold text-t1">ระยะเวลาผ่อนชำระ</label>
            <span className="text-[13px] font-extrabold text-primary">{loanTermMonths} เดือน</span>
          </div>
          <div className="relative px-1">
            <input
              type="range"
              min={LOAN_TERM_RANGE.min}
              max={LOAN_TERM_RANGE.max}
              step={LOAN_TERM_RANGE.step}
              value={loanTermMonths}
              onChange={(e) => setLoanTermMonths(parseInt(e.target.value))}
              className="w-full h-2 rounded-full appearance-none cursor-pointer accent-primary"
              style={{
                background: `linear-gradient(to right, #1B7A3F 0%, #1B7A3F ${((loanTermMonths - LOAN_TERM_RANGE.min) / (LOAN_TERM_RANGE.max - LOAN_TERM_RANGE.min)) * 100}%, #E5E7EB ${((loanTermMonths - LOAN_TERM_RANGE.min) / (LOAN_TERM_RANGE.max - LOAN_TERM_RANGE.min)) * 100}%, #E5E7EB 100%)`
              }}
            />
            <div className="flex justify-between mt-1">
              {ticks.map((t) => (
                <span
                  key={t}
                  className={`text-[9px] font-semibold ${t === loanTermMonths ? 'text-primary' : 'text-t3'}`}
                >
                  {t}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Right Panel — Results Card */}
      <div className="bg-primary-light border border-primary-medium rounded-xl p-5">
        <p className="text-[11px] font-semibold text-t2 mb-1">ค่างวดต่อเดือน (โดยประมาณ)</p>
        <p className="text-[28px] font-extrabold text-primary leading-tight mb-4">
          ฿{formatNumber(calc.monthly)}
        </p>

        <div className="grid grid-cols-2 gap-x-4 gap-y-3 mb-4">
          <div>
            <p className="text-[10px] text-t3">ดอกเบี้ย</p>
            <p className="text-[12px] font-bold text-t1">{interestRate}%</p>
          </div>
          <div>
            <p className="text-[10px] text-t3">ราคารถ</p>
            <p className="text-[12px] font-bold text-t1">฿{formatNumber(carPrice)}</p>
          </div>
          <div>
            <p className="text-[10px] text-t3">เงินดาวน์</p>
            <p className="text-[12px] font-bold text-t1">฿{formatNumber(calc.downPayment)} ({downPaymentPct}%)</p>
          </div>
          <div>
            <p className="text-[10px] text-t3">ยอดจัด</p>
            <p className="text-[12px] font-bold text-t1">฿{formatNumber(calc.financeAmount)}</p>
          </div>
          <div className="col-span-2">
            <p className="text-[10px] text-t3">ระยะเวลา</p>
            <p className="text-[12px] font-bold text-t1">{loanTermMonths} งวด</p>
          </div>
        </div>

        <p className="text-[9px] text-t3 leading-relaxed border-t border-primary-medium pt-3">
          การคำนวณนี้เป็นเพียงการประมาณการเบื้องต้น ดอกเบี้ยและเงื่อนไขจริงขึ้นอยู่กับสถาบันการเงิน
        </p>
      </div>
    </div>
  )
}
