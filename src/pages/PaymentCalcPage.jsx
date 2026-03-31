import React, { useCallback, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Icon from '../components/icons/Icon';
import InlineCalculator from '../components/car/InlineCalculator';
import { CARS, COLOR_OPTIONS } from '../lib/mockData';
import { useBookingStore } from '../stores/bookingStore';
import { useVisibilityRefresh } from '../hooks/useVisibilityRefresh';

export default function PaymentCalcPage() {
  const [, forceUpdate] = useState(0);
  useVisibilityRefresh(useCallback(() => forceUpdate(n => n + 1), []));
  const navigate = useNavigate();

  const bkCarId = useBookingStore((s) => s.carId);
  const setCarIdStore = useBookingStore((s) => s.setCarId);
  const selectedColor = useBookingStore((s) => s.selectedColor) || 'Pearl White';
  const setDownPayment = useBookingStore((s) => s.setDownPayment);
  const setInterestRate = useBookingStore((s) => s.setInterestRate);
  const setLoanTermMonths = useBookingStore((s) => s.setLoanTermMonths);

  const car = bkCarId ? CARS[bkCarId] : CARS.corolla;

  const colorObj = COLOR_OPTIONS.find(c => c.name === selectedColor);

  const handleCalcValuesChange = useCallback(({ downPaymentPct, interestRate, loanTermMonths }) => {
    if (downPaymentPct !== undefined) setDownPayment(downPaymentPct);
    if (interestRate !== undefined) setInterestRate(interestRate);
    if (loanTermMonths !== undefined) setLoanTermMonths(loanTermMonths);
  }, [setDownPayment, setInterestRate, setLoanTermMonths]);

  const handleBookNow = () => {
    if (!bkCarId) setCarIdStore(car.id);
    navigate('/booking');
  };

  return (
    <div className="screen-enter flex flex-col h-full">
      {/* Header */}
      <div className="bg-white px-4 py-[13px] flex items-center gap-[11px] border-b border-border flex-shrink-0">
        <button onClick={() => navigate(-1)} className="w-9 h-9 rounded-full flex items-center justify-center bg-bg border border-border text-t1 cursor-pointer"><Icon name="back" size={18} /></button>
        <div className="flex-1"><h2 className="text-[15px] font-extrabold text-t1">คำนวณสินเชื่อ</h2><p className="text-[11px] text-t2 mt-[1px]">Calculate Installment</p></div>
        <span className="text-t2"><Icon name="calc" size={20} /></span>
      </div>

      <div className="flex-1 overflow-y-auto px-4 pt-4 pb-24" style={{ WebkitOverflowScrolling: 'touch' }}>
        {/* Car summary */}
        {car && (
          <div className="flex items-center gap-3 p-3 bg-white rounded-lg border border-border mb-4">
            <div className="w-[80px] h-[64px] rounded-md border border-border flex items-center justify-center flex-shrink-0 overflow-hidden p-1" style={{ background: car.bg }}>
              <img
                src={car.img}
                alt={car.name}
                className="w-full h-full object-contain"
                onError={(e) => { e.target.style.display = 'none'; }}
              />
            </div>
            <div className="flex-1">
              <p className="text-[14px] font-extrabold text-t1">{car.name}</p>
              <div className="flex items-center gap-1 text-[11px] text-t2">
                <span>{car.type} · {car.fuel}</span>
                {selectedColor && (
                  <>
                    <span className="mx-1">·</span>
                    <span>สี:</span>
                    {colorObj && (
                      <span
                        className="w-3 h-3 rounded-full border border-border inline-block"
                        style={{ backgroundColor: colorObj.hex }}
                      />
                    )}
                    <span className="font-semibold text-t1">{selectedColor}</span>
                  </>
                )}
              </div>
              <p className="text-[13px] font-extrabold text-primary mt-[2px]">{car.priceLabel}</p>
            </div>
          </div>
        )}

        {/* Calculator */}
        <div className="card-base">
          <div className="card-hd"><span className="card-title">คำนวณสินเชื่อ / Calculate Installment</span></div>
          <InlineCalculator carPrice={car.price} carName={car.name} onValuesChange={handleCalcValuesChange} />
        </div>

        {/* Actions */}
        <button onClick={() => alert('ส่ง LINE สำเร็จ')} className="btn-o cursor-pointer mb-[10px]"><Icon name="chat" size={16} /> ส่งทาง LINE / Share via LINE</button>
        <button onClick={handleBookNow} className="btn-p cursor-pointer mb-4"><Icon name="book" size={16} /> จองรถ / Book Now</button>
      </div>
    </div>
  );
}
