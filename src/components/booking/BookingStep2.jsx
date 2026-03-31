import React, { useState, useMemo } from 'react'
import Button from '../ui/Button'
import { useBookingStore } from '../../stores/bookingStore'
import useCountdown from '../../hooks/useCountdown'

export default function BookingStep2() {
  const { setStep, saveBooking } = useBookingStore()

  // Generate reference number once
  const refNumber = useMemo(
    () => `WRJ-2026-${Math.floor(Math.random() * 9000 + 1000)}`,
    []
  )

  // QR data
  const qrData = `${refNumber} THB5000 VORACHAKYONT`
  const qrUrl = `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(qrData)}`

  // 15-minute countdown
  const { formatted, isExpired } = useCountdown(15 * 60)

  const [qrError, setQrError] = useState(false)

  const handleConfirmPayment = () => {
    // Save booking to store (this also updates linked lead status if applicable)
    saveBooking()
    setStep(3)
  }

  const handleCancel = () => {
    setStep(1)
  }

  return (
    <div className="p-4 space-y-5">
      {/* Header */}
      <h2 className="text-[14px] font-bold text-t1 text-center">ชำระเงินจอง</h2>

      {/* Amount */}
      <p className="text-2xl font-extrabold text-primary text-center">
        ฿5,000
      </p>

      {/* QR Code wrapper */}
      <div className="flex flex-col items-center bg-white rounded-lg p-5" style={{ boxShadow: '0 2px 12px rgba(0,0,0,.08)' }}>
        {!qrError ? (
          <img
            src={qrUrl}
            alt="QR Payment"
            className="w-[180px] h-[180px] rounded-sm"
            onError={() => setQrError(true)}
          />
        ) : (
          <div className="w-[180px] h-[180px] rounded-sm flex items-center justify-center bg-gray-50">
            <span className="text-t3 text-sm">QR Code</span>
          </div>
        )}
      </div>

      {/* PromptPay label */}
      <p className="text-[14px] text-t1 font-bold text-center">
        PromptPay / QR Payment
      </p>

      {/* Reference number */}
      <p className="text-xs text-t2 text-center">
        Ref: {refNumber}
      </p>

      {/* Countdown timer */}
      <div className="text-center">
        {isExpired ? (
          <p className="text-[11px] font-semibold text-red-500">หมดอายุ</p>
        ) : (
          <p className="text-[11px] font-semibold text-warm">
            หมดอายุใน{' '}
            <span className="font-bold">{formatted}</span>
          </p>
        )}
      </div>

      {/* Alternative payment */}
      <p className="text-xs text-t2 text-center">
        หรือโอนเข้าบัญชี ธ.กสิกรไทย 038-2-XXXXX
      </p>

      {/* Action buttons */}
      <div className="flex gap-3">
        <Button
          variant="outline"
          fullWidth
          size="lg"
          onClick={handleCancel}
        >
          ยกเลิก
        </Button>
        <Button
          fullWidth
          size="lg"
          onClick={handleConfirmPayment}
          disabled={isExpired}
        >
          ยืนยันการชำระ
        </Button>
      </div>
    </div>
  )
}
