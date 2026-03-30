import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import Icon from '../components/icons/Icon';
import { CARS } from '../lib/mockData';
import { useBookingStore } from '../stores/bookingStore';
import { useLeadStore } from '../stores/leadStore';
import { useUiStore } from '../stores/uiStore';
import { useVisibilityRefresh } from '../hooks/useVisibilityRefresh';

export default function BookingPage() {
  const [, forceUpdate] = useState(0);
  useVisibilityRefresh(useCallback(() => forceUpdate(n => n + 1), []));
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [payMethod, setPayMethod] = useState('qr');
  const [timer, setTimer] = useState(899); // 14:59
  const timerRef = useRef(null);

  const carId = useBookingStore((s) => s.carId);
  const leadId = useBookingStore((s) => s.leadId);
  const downPaymentPct = useBookingStore((s) => s.downPaymentPct);
  const loanTerm = useBookingStore((s) => s.loanTerm);
  const savedBooking = useBookingStore((s) => s.savedBooking);
  const saveBooking = useBookingStore((s) => s.saveBooking);
  const setCustomerInfo = useBookingStore((s) => s.setCustomerInfo);
  const reset = useBookingStore((s) => s.reset);
  const getMonthlyPayment = useBookingStore((s) => s.getMonthlyPayment);
  const getDownPayment = useBookingStore((s) => s.getDownPayment);

  const getLeadById = useLeadStore((s) => s.getLeadById);
  const addNotification = useUiStore((s) => s.addNotification);

  const car = carId ? CARS[carId] : CARS.corolla;
  const lead = leadId ? getLeadById(leadId) : null;

  // Pre-fill customer info from lead
  useEffect(() => {
    if (lead) {
      setCustomerInfo({ name: lead.name, phone: lead.phone, email: lead.email || '' });
    }
  }, [leadId]);

  useEffect(() => {
    return () => { if (timerRef.current) clearInterval(timerRef.current); };
  }, []);

  const fmt = (n) => n.toLocaleString('th-TH');

  // Compute values from store or fallback
  const monthlyPay = carId ? getMonthlyPayment() : (() => {
    const p = car.price;
    const down = p * downPaymentPct / 100;
    const financed = p - down;
    const r = 2.79 / 100 / 12;
    return Math.round(financed * r * Math.pow(1 + r, loanTerm) / (Math.pow(1 + r, loanTerm) - 1));
  })();
  const downPay = carId ? getDownPayment() : Math.round(car.price * downPaymentPct / 100);

  const goStep2 = () => {
    setStep(2);
    timerRef.current = setInterval(() => {
      setTimer(prev => {
        if (prev <= 0) { clearInterval(timerRef.current); return 0; }
        return prev - 1;
      });
    }, 1000);
  };

  const goStep3 = () => {
    if (timerRef.current) clearInterval(timerRef.current);
    // Save the booking — this also updates lead to 'won'
    const result = saveBooking();
    if (result?.conflict) {
      toast((t) => (
        <div className="flex items-center gap-3">
          <span className="text-sm">{result.message}</span>
          <button onClick={() => { navigate(-1); toast.dismiss(t.id); }} className="text-xs px-2 py-1 bg-primary text-white rounded whitespace-nowrap">กลับ</button>
        </div>
      ), { duration: 5000, icon: '\u26A0\uFE0F' });
      return;
    }
    addNotification({ title: 'จองสำเร็จ!', body: car.name + ' จองเรียบร้อย', type: 'booking' });
    setStep(3);
  };

  const handleGoHome = () => {
    reset();
    navigate('/sales-dash');
  };

  const fmtTimer = (s) => `${Math.floor(s / 60).toString().padStart(2, '0')}:${(s % 60).toString().padStart(2, '0')}`;

  const bookingRef = savedBooking ? savedBooking.ref : '#WRJ-2026-0384';

  const steps = [
    { n: 1, label: 'ยืนยัน' },
    { n: 2, label: 'ชำระเงิน' },
    { n: 3, label: 'สำเร็จ' },
  ];

  return (
    <div className="screen-enter flex flex-col h-full">
      <div className="bg-white px-4 py-[13px] flex items-center gap-[11px] border-b border-border flex-shrink-0">
        <button onClick={() => navigate(-1)} className="w-9 h-9 rounded-full flex items-center justify-center bg-bg border border-border text-t1 cursor-pointer"><Icon name="back" size={18} /></button>
        <div className="flex-1"><h2 className="text-[15px] font-extrabold text-t1">การจอง</h2><p className="text-[11px] text-t2 mt-[1px]">Booking Confirmation</p></div>
      </div>

      <div className="flex-1 overflow-y-auto px-4 pt-4 pb-24" style={{ WebkitOverflowScrolling: 'touch' }}>
        {/* Step Indicator */}
        <div className="flex items-center justify-center gap-0 mb-5">
          {steps.map((s, i) => (
            <React.Fragment key={s.n}>
              <div className="flex flex-col items-center gap-1">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-[12px] font-extrabold ${step > s.n ? 'bg-primary text-white' : step === s.n ? 'bg-primary text-white' : 'bg-border text-t3'}`}>
                  {step > s.n ? <Icon name="check" size={14} /> : s.n}
                </div>
                <span className="text-[10px] font-bold text-t2">{s.label}</span>
              </div>
              {i < 2 && <div className={`w-12 h-[2px] mx-1 mb-4 ${step > s.n ? 'bg-primary' : 'bg-border'}`} />}
            </React.Fragment>
          ))}
        </div>

        {/* Step 1: Review */}
        {step === 1 && (
          <>
            <div className="card-base">
              <div className="card-hd"><span className="card-title">รายละเอียดการจอง</span></div>
              {[
                ['รุ่น', car.name],
                ['สี', 'Pearl White'],
                ['ราคา', car.priceLabel],
                ['เงินดาวน์', `฿${fmt(downPay)} (${downPaymentPct}%)`],
                ['ผ่อน/เดือน', `฿${fmt(monthlyPay)} × ${loanTerm} เดือน`],
                ['กำหนดส่งมอบ', '14-21 วัน'],
              ].map(([lbl, val]) => (
                <div key={lbl} className="flex justify-between py-[9px] border-b border-border last:border-b-0 text-[12px]">
                  <span className="text-t2 font-semibold">{lbl}</span>
                  <span className="text-t1 font-bold text-right">{val}</span>
                </div>
              ))}
            </div>
            <div className="card-base">
              <div className="card-hd"><span className="card-title">วิธีชำระเงินจอง</span></div>
              <div className="flex gap-2 mb-3">
                {[
                  { id: 'qr', icon: 'qr', label: 'QR PromptPay' },
                  { id: 'transfer', icon: 'bank', label: 'โอนเงิน' },
                  { id: 'credit', icon: 'card', label: 'บัตรเครดิต' },
                ].map(m => (
                  <button key={m.id} onClick={() => setPayMethod(m.id)} className={`flex-1 border-2 rounded-[10px] p-[10px] text-center cursor-pointer text-[11px] font-semibold transition-all ${payMethod === m.id ? 'border-primary text-primary bg-emerald-50' : 'border-border text-t2'}`}>
                    <div className="flex justify-center mb-1"><Icon name={m.icon} size={20} /></div>
                    {m.label}
                  </button>
                ))}
              </div>
            </div>
            <button onClick={goStep2} className="btn-p cursor-pointer"><Icon name="qr" size={16} /> สร้าง QR ชำระเงิน ฿5,000</button>
          </>
        )}

        {/* Step 2: Payment */}
        {step === 2 && (
          <>
            <div className="flex flex-col items-center bg-white rounded-lg p-5 shadow-sm mb-3">
              <img src={`https://chart.googleapis.com/chart?cht=qr&chs=200x200&chl=promptpay%3A0000000000%26amount%3D5000`} alt="QR" className="w-[180px] h-[180px] rounded-lg" />
              <p className="text-[14px] font-bold text-t1 mt-3">สแกน QR เพื่อชำระ / Scan to Pay</p>
              <p className="text-[11px] text-t3 mt-[3px] text-center">PromptPay — วรจักร์ยนต์ Co., Ltd.</p>
              <p className="text-[24px] font-extrabold text-primary mt-2">฿5,000</p>
              <p className="text-[11px] text-t3 mt-1">Booking {bookingRef}</p>
              <div className="flex items-center gap-[5px] text-[11px] text-warm font-semibold mt-[6px]">
                <Icon name="calendar" size={12} /> หมดอายุใน {fmtTimer(timer)}
              </div>
            </div>

            <div className="card-base">
              <div className="card-hd"><span className="card-title">ช่องทางชำระอื่น ๆ</span></div>
              {[
                { bank: 'กสิกรไทย / KBank', acct: '123-4-56789-0' },
                { bank: 'ไทยพาณิชย์ / SCB', acct: '987-6-54321-0' },
              ].map(b => (
                <div key={b.bank} className="flex items-center gap-3 py-3 border-b border-border last:border-b-0">
                  <div className="w-9 h-9 bg-primary-light rounded-sm flex items-center justify-center text-primary flex-shrink-0"><Icon name="bank" size={16} /></div>
                  <div className="flex-1"><p className="text-[13px] font-bold text-t1">{b.bank}</p><p className="text-[11px] text-t2 mt-[1px]">{b.acct}</p></div>
                </div>
              ))}
            </div>

            <button onClick={goStep3} className="btn-p cursor-pointer mb-[10px]"><Icon name="check" size={16} /> ยืนยันการชำระเงิน</button>
            <button onClick={() => alert('ส่ง QR ทาง LINE สำเร็จ ✓')} className="btn-o cursor-pointer"><Icon name="chat" size={16} /> ส่ง QR ให้ลูกค้าทาง LINE</button>
          </>
        )}

        {/* Step 3: Success */}
        {step === 3 && (
          <>
            <div className="text-center pt-6 pb-4">
              <div className="w-16 h-16 rounded-full bg-primary-light flex items-center justify-center mx-auto mb-4 text-primary"><Icon name="check" size={32} /></div>
              <h2 className="text-[20px] font-extrabold text-t1 mb-1">จองเรียบร้อย!</h2>
              <p className="text-[13px] text-t2">Booking confirmed & synced to DMS</p>
              <span className="inline-block mt-2 px-[14px] py-[6px] bg-primary-light text-primary text-[13px] font-extrabold rounded-pill">{bookingRef}</span>
            </div>

            <div className="card-base mt-4">
              <div className="card-hd"><span className="card-title">ขั้นตอนถัดไป</span></div>
              {[
                { icon: 'check', label: 'ชำระเงินจอง ฿5,000', sub: 'ชำระแล้ว', done: true },
                { icon: 'report', label: 'ส่งเอกสารสินเชื่อ', sub: 'ภายใน 3 วันทำการ', done: false },
                { icon: 'car', label: 'นัดรับรถ', sub: 'ภายใน 14-21 วัน', done: false },
              ].map(s => (
                <div key={s.label} className="flex items-center gap-3 py-3 border-b border-border last:border-b-0">
                  <div className={`w-9 h-9 rounded-sm flex items-center justify-center flex-shrink-0 ${s.done ? 'bg-primary text-white' : 'bg-primary-light text-primary'}`}><Icon name={s.icon} size={16} /></div>
                  <div className="flex-1"><p className="text-[13px] font-bold text-t1">{s.label}</p><p className="text-[11px] text-t2 mt-[1px]">{s.sub}</p></div>
                  <span className="text-t3"><Icon name="chevronRight" size={16} /></span>
                </div>
              ))}
            </div>

            <div className="flex gap-[10px] mt-4">
              <button onClick={() => alert('แชร์ Booking ทาง LINE ✓')} className="btn-o flex-1 cursor-pointer"><Icon name="share" size={16} /> แชร์ Booking</button>
              <button onClick={handleGoHome} className="btn-p flex-1 cursor-pointer">กลับหน้าหลัก</button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
