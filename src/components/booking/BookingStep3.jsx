import React, { useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import Icon from '../icons/Icon'
import Card from '../ui/Card'
import Button from '../ui/Button'
import { useBookingStore } from '../../stores/bookingStore'

export default function BookingStep3() {
  const navigate = useNavigate()
  const { getSelectedCar, reset } = useBookingStore()

  const car = getSelectedCar()

  const refNumber = useMemo(
    () => `WRJ-2026-${Math.floor(Math.random() * 9000 + 1000)}`,
    []
  )

  const handleBrowseMore = () => {
    reset()
    navigate('/catalog')
  }

  const handleGoHome = () => {
    reset()
    navigate('/sales-dash')
  }

  return (
    <div className="p-4 flex flex-col items-center pt-8 space-y-5">
      {/* Success icon */}
      <div className="w-16 h-16 rounded-full bg-primary-light flex items-center justify-center text-primary">
        <Icon name="check" size={32} />
      </div>

      {/* Success text */}
      <div className="text-center">
        <h2 className="text-xl font-extrabold text-t1">จองสำเร็จ!</h2>
        <p className="text-sm text-t2 mt-1">ขอบคุณที่เลือก Toyota วรจักร์ยนต์</p>
        <span className="inline-block mt-2 text-[13px] font-extrabold text-primary bg-primary-light rounded-full px-[14px] py-[6px]">{refNumber}</span>
      </div>

      {/* Order details */}
      <Card className="w-full">
        <div className="space-y-3">
          <div className="flex justify-between text-sm">
            <span className="text-t2">รถยนต์</span>
            <span className="font-semibold text-t1">{car?.name || '-'}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-t2">เลขที่จอง</span>
            <span className="font-semibold text-t1">{refNumber}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-t2">ยอดชำระ</span>
            <span className="font-semibold text-t1">฿5,000</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-t2">สถานะ</span>
            <span className="font-semibold text-amber-600">รอดำเนินการ</span>
          </div>
        </div>
      </Card>

      {/* Action buttons */}
      <div className="w-full space-y-3">
        <Button variant="outline" fullWidth size="lg" onClick={handleBrowseMore}>
          ดูรถเพิ่มเติม
        </Button>
        <Button fullWidth size="lg" onClick={handleGoHome}>
          กลับหน้าหลัก
        </Button>
      </div>
    </div>
  )
}
