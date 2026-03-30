import React, { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import Icon from '../components/icons/Icon';
import { CARS, COLOR_OPTIONS } from '../lib/mockData';
import { DOWN_PAYMENT_OPTIONS, LOAN_TERM_RANGE, DEFAULT_INTEREST_RATE } from '../lib/constants';
import { formatNumber, flatRateMonthly } from '../lib/formats';
import { useBookingStore } from '../stores/bookingStore';
import { useLeadStore } from '../stores/leadStore';
import { useUiStore } from '../stores/uiStore';
import { useDraftStore } from '../stores/draftStore';
import { useVisibilityRefresh } from '../hooks/useVisibilityRefresh';

function defaultDeliveryDate() {
  const d = new Date();
  d.setDate(d.getDate() + 7);
  return d.toISOString().split('T')[0];
}

export default function BookingPage() {
  const [, forceUpdate] = useState(0);
  useVisibilityRefresh(useCallback(() => forceUpdate(n => n + 1), []));
  const navigate = useNavigate();

  // Booking store state
  const carId = useBookingStore((s) => s.carId);
  const leadId = useBookingStore((s) => s.leadId);
  const savedBooking = useBookingStore((s) => s.savedBooking);
  const saveBooking = useBookingStore((s) => s.saveBooking);
  const setCustomerInfo = useBookingStore((s) => s.setCustomerInfo);
  const reset = useBookingStore((s) => s.reset);
  const getLeadById = useLeadStore((s) => s.getLeadById);
  const addNotification = useUiStore((s) => s.addNotification);

  // Draft store for persistence
  const bookingDraft = useDraftStore((s) => s.bookingDraft);
  const setBookingDraft = useDraftStore((s) => s.setBookingDraft);
  const clearBookingDraft = useDraftStore((s) => s.clearBookingDraft);

  // Single formData state object — preserves data across step navigation
  const [formData, setFormData] = useState({
    step: 1,
    // Step 1 — customer info
    customerName: '',
    customerPhone: '',
    customerEmail: '',
    // Step 2 — confirmation / finance
    downPaymentPct: 15,
    interestRate: DEFAULT_INTEREST_RATE,
    loanTermMonths: LOAN_TERM_RANGE.default,
    deliveryDate: defaultDeliveryDate(),
    paymentMethod: 'qr',
    selectedColor: 'Pearl White',
    // Step 3 — credit card fields
    cardNumber: '',
    cardExpiry: '',
    cardCvv: '',
    cardName: '',
  });

  const updateForm = (updates) => setFormData(prev => ({ ...prev, ...updates }));

  // Timer for QR
  const [timer, setTimer] = useState(899);
  const timerRef = useRef(null);

  // Share modal
  const [showShareModal, setShowShareModal] = useState(false);

  const lead = leadId ? getLeadById(leadId) : null;
  const car = carId ? CARS[carId] : (lead?.car ? CARS[lead.car] : CARS.corolla);

  // Restore draft on mount
  useEffect(() => {
    if (bookingDraft) {
      setFormData(prev => ({ ...prev, ...bookingDraft }));
    }
  }, []);

  // Pre-fill customer info from lead
  useEffect(() => {
    if (lead) {
      setCustomerInfo({ name: lead.name, phone: lead.phone, email: lead.email || '' });
      updateForm({
        customerName: lead.name,
        customerPhone: lead.phone,
        customerEmail: lead.email || '',
        selectedColor: lead.selectedColor || formData.selectedColor,
      });
    }
  }, [leadId]);

  // Save draft on every change (small object, no debounce needed)
  useEffect(() => {
    if (formData.step < 4) {
      setBookingDraft(formData);
    }
  }, [formData]);

  // Clean up timer on unmount
  useEffect(() => {
    return () => { if (timerRef.current) clearInterval(timerRef.current); };
  }, []);

  // Calculations
  const calc = useMemo(() => {
    if (!car) return { downPayment: 0, financeAmount: 0, monthly: 0 };
    const downPayment = Math.round(car.price * formData.downPaymentPct / 100);
    const financeAmount = car.price - downPayment;
    const monthly = flatRateMonthly(financeAmount, formData.interestRate, formData.loanTermMonths);
    return { downPayment, financeAmount, monthly };
  }, [car, formData.downPaymentPct, formData.interestRate, formData.loanTermMonths]);

  // Term slider ticks
  const ticks = [];
  for (let m = LOAN_TERM_RANGE.min; m <= LOAN_TERM_RANGE.max; m += LOAN_TERM_RANGE.step) {
    ticks.push(m);
  }

  const fmt = (n) => formatNumber(n);
  const fmtTimer = (s) => `${Math.floor(s / 60).toString().padStart(2, '0')}:${(s % 60).toString().padStart(2, '0')}`;

  // ---- Step navigation ----

  const goToStep2 = () => {
    if (!lead && (!formData.customerName.trim() || !formData.customerPhone.trim())) {
      toast.error('กรุณากรอกชื่อและเบอร์โทร');
      return;
    }
    if (!lead) {
      setCustomerInfo({ name: formData.customerName.trim(), phone: formData.customerPhone.trim(), email: formData.customerEmail.trim() });
    }
    updateForm({ step: 2 });
  };

  const goToStep3 = () => {
    updateForm({ step: 3 });
    if (formData.paymentMethod === 'qr') {
      setTimer(899);
      if (timerRef.current) clearInterval(timerRef.current);
      timerRef.current = setInterval(() => {
        setTimer(prev => {
          if (prev <= 0) { clearInterval(timerRef.current); return 0; }
          return prev - 1;
        });
      }, 1000);
    }
  };

  const goToStep4 = () => {
    if (timerRef.current) clearInterval(timerRef.current);

    // Validate credit card form if credit method
    if (formData.paymentMethod === 'credit') {
      if (!formData.cardNumber.trim() || !formData.cardExpiry.trim() || !formData.cardCvv.trim() || !formData.cardName.trim()) {
        toast.error('กรุณากรอกข้อมูลบัตรเครดิตให้ครบ');
        return;
      }
    }

    // Save the booking with ALL data
    const result = saveBooking({
      color: formData.selectedColor,
      interestRate: formData.interestRate,
      deliveryDate: formData.deliveryDate,
      paymentMethod: formData.paymentMethod,
      downPaymentPct: formData.downPaymentPct,
      loanTermMonths: formData.loanTermMonths,
      loanTerm: formData.loanTermMonths,
      customerName: formData.customerName || (lead ? lead.name : ''),
      customerPhone: formData.customerPhone || (lead ? lead.phone : ''),
      customerEmail: formData.customerEmail || (lead ? lead.email : ''),
    });

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
    clearBookingDraft();
    updateForm({ step: 4 });
  };

  const goBack = () => {
    if (formData.step > 1 && formData.step < 4) {
      if (timerRef.current) clearInterval(timerRef.current);
      updateForm({ step: formData.step - 1 });
    } else {
      navigate(-1);
    }
  };

  const handleGoHome = () => {
    clearBookingDraft();
    reset();
    navigate('/sales-dash');
  };

  const handleCopyLink = () => {
    const ref = savedBooking?.ref || '';
    const url = `${window.location.origin}${import.meta.env.BASE_URL || '/'}#/booking-view/${ref}`;
    navigator.clipboard.writeText(url).then(() => {
      toast.success('คัดลอกลิงก์แล้ว');
    }).catch(() => {
      toast.error('ไม่สามารถคัดลอกได้');
    });
  };

  const bookingRef = savedBooking ? savedBooking.ref : '';
  const step = formData.step;

  const payMethodLabel = {
    qr: 'สร้าง QR ชำระเงิน ฿5,000',
    transfer: 'ดำเนินการโอนเงิน ฿5,000',
    credit: 'ชำระด้วยบัตรเครดิต ฿5,000',
  };

  const payMethodIcon = {
    qr: 'qr',
    transfer: 'bank',
    credit: 'card',
  };

  const steps = [
    { n: 1, label: 'ข้อมูลลูกค้า' },
    { n: 2, label: 'ยืนยัน' },
    { n: 3, label: 'ชำระเงิน' },
    { n: 4, label: 'สำเร็จ' },
  ];

  return (
    <div className="screen-enter flex flex-col h-full">
      {/* Header */}
      <div className="bg-white px-4 py-[13px] flex items-center gap-[11px] border-b border-border flex-shrink-0">
        <button onClick={goBack} className="w-9 h-9 rounded-full flex items-center justify-center bg-bg border border-border text-t1 cursor-pointer">
          <Icon name="back" size={18} />
        </button>
        <div className="flex-1">
          <h2 className="text-[15px] font-extrabold text-t1">การจอง</h2>
          <p className="text-[11px] text-t2 mt-[1px]">Booking Confirmation</p>
        </div>
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
              {i < steps.length - 1 && <div className={`w-8 h-[2px] mx-1 mb-4 ${step > s.n ? 'bg-primary' : 'bg-border'}`} />}
            </React.Fragment>
          ))}
        </div>

        {/* ================================================================ */}
        {/* Step 1: Customer Info */}
        {/* ================================================================ */}
        {step === 1 && (
          <>
            {lead ? (
              <>
                {/* Read-only info cards from lead */}
                <div className="card-base">
                  <div className="card-hd"><span className="card-title">ศูนย์บริการ</span></div>
                  <div className="flex justify-between py-[9px] text-[12px]">
                    <span className="text-t2 font-semibold">สาขา</span>
                    <span className="text-t1 font-bold">{lead.selectedCenter || 'วรจักร์ยนต์ สาขาลาดพร้าว'}</span>
                  </div>
                </div>

                <div className="card-base">
                  <div className="card-hd"><span className="card-title">ข้อมูลลูกค้า</span></div>
                  {[
                    ['ชื่อ', lead.name],
                    ['โทร', lead.phone],
                    lead.email && ['อีเมล', lead.email],
                  ].filter(Boolean).map(([lbl, val]) => (
                    <div key={lbl} className="flex justify-between py-[9px] border-b border-border last:border-b-0 text-[12px]">
                      <span className="text-t2 font-semibold">{lbl}</span>
                      <span className="text-t1 font-bold text-right">{val}</span>
                    </div>
                  ))}
                </div>

                {lead.source && (
                  <div className="card-base">
                    <div className="card-hd"><span className="card-title">ช่องทาง</span></div>
                    <div className="flex justify-between py-[9px] text-[12px]">
                      <span className="text-t2 font-semibold">แหล่งที่มา</span>
                      <span className="text-t1 font-bold">{lead.source}</span>
                    </div>
                  </div>
                )}

                <div className="card-base">
                  <div className="card-hd"><span className="card-title">ระดับความสนใจ</span></div>
                  <div className="py-[9px] text-[12px]">
                    <span className={`badge-${lead.level}`}>
                      {{ hot: 'HOT', warm: 'Warm', cool: 'Cool', won: 'Won', lost: 'Lost' }[lead.level] || lead.level}
                    </span>
                  </div>
                </div>

                {lead.notes && (
                  <div className="card-base">
                    <div className="card-hd"><span className="card-title">หมายเหตุ</span></div>
                    <p className="text-[12px] text-t2 leading-relaxed py-[6px]">{lead.notes}</p>
                  </div>
                )}
              </>
            ) : (
              /* Direct booking — customer form */
              <div className="card-base">
                <div className="card-hd"><span className="card-title">ข้อมูลลูกค้า</span></div>
                <div className="space-y-3 py-2">
                  <div>
                    <label className="text-[11px] font-bold text-t2 mb-1 block">ชื่อลูกค้า <span className="text-red-500">*</span></label>
                    <input
                      type="text"
                      value={formData.customerName}
                      onChange={(e) => updateForm({ customerName: e.target.value })}
                      placeholder="ชื่อ-นามสกุล"
                      className="w-full h-[42px] bg-bg border border-border rounded-md px-3 text-[13px] text-t1 outline-none focus:border-primary"
                    />
                  </div>
                  <div>
                    <label className="text-[11px] font-bold text-t2 mb-1 block">เบอร์โทร <span className="text-red-500">*</span></label>
                    <input
                      type="tel"
                      value={formData.customerPhone}
                      onChange={(e) => updateForm({ customerPhone: e.target.value })}
                      placeholder="0XX-XXX-XXXX"
                      className="w-full h-[42px] bg-bg border border-border rounded-md px-3 text-[13px] text-t1 outline-none focus:border-primary"
                    />
                  </div>
                  <div>
                    <label className="text-[11px] font-bold text-t2 mb-1 block">อีเมล</label>
                    <input
                      type="email"
                      value={formData.customerEmail}
                      onChange={(e) => updateForm({ customerEmail: e.target.value })}
                      placeholder="email@example.com"
                      className="w-full h-[42px] bg-bg border border-border rounded-md px-3 text-[13px] text-t1 outline-none focus:border-primary"
                    />
                  </div>
                </div>
              </div>
            )}

            <button onClick={goToStep2} className="btn-p cursor-pointer mt-2">
              ถัดไป <Icon name="chevronRight" size={16} />
            </button>
          </>
        )}

        {/* ================================================================ */}
        {/* Step 2: Confirm / Customize */}
        {/* ================================================================ */}
        {step === 2 && (
          <>
            {/* Car & Color */}
            <div className="card-base">
              <div className="card-hd"><span className="card-title">รายละเอียดรถ</span></div>
              <div className="flex justify-between py-[9px] border-b border-border text-[12px]">
                <span className="text-t2 font-semibold">รุ่น</span>
                <span className="text-t1 font-bold text-right">{car?.name || '-'}</span>
              </div>
              <div className="py-[9px] border-b border-border">
                <div className="flex justify-between text-[12px] mb-2">
                  <span className="text-t2 font-semibold">สี</span>
                  <span className="text-t1 font-bold">{formData.selectedColor}</span>
                </div>
                <div className="flex gap-2">
                  {COLOR_OPTIONS.map((c) => (
                    <button
                      key={c.name}
                      onClick={() => updateForm({ selectedColor: c.name })}
                      className={`w-7 h-7 rounded-full border-2 cursor-pointer transition-all ${formData.selectedColor === c.name ? 'border-primary scale-110 shadow' : 'border-border'}`}
                      style={{ backgroundColor: c.hex }}
                      title={c.name}
                    />
                  ))}
                </div>
              </div>
              <div className="flex justify-between py-[9px] text-[12px]">
                <span className="text-t2 font-semibold">ราคา</span>
                <span className="text-t1 font-bold">{car ? `฿${fmt(car.price)}` : '-'}</span>
              </div>
            </div>

            {/* Down Payment */}
            <div className="card-base">
              <div className="card-hd"><span className="card-title">เงินดาวน์</span></div>
              <div className="flex flex-wrap gap-2 mb-3">
                {DOWN_PAYMENT_OPTIONS.map((pct) => (
                  <button
                    key={pct}
                    onClick={() => updateForm({ downPaymentPct: pct })}
                    className={`px-4 py-[7px] rounded-full text-[12px] font-bold transition-all cursor-pointer border ${
                      formData.downPaymentPct === pct
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
                <span className="text-[12px] font-bold text-t1">฿{fmt(calc.downPayment)} บาท</span>
              </div>
            </div>

            {/* Interest Rate */}
            <div className="card-base">
              <div className="card-hd"><span className="card-title">ดอกเบี้ย % ต่อปี</span></div>
              <div className="relative">
                <input
                  type="number"
                  step="0.01"
                  min="0"
                  max="20"
                  value={formData.interestRate}
                  onChange={(e) => updateForm({ interestRate: parseFloat(e.target.value) || 0 })}
                  className="w-full h-[42px] bg-bg border border-border rounded-md px-3 pr-10 text-[14px] font-semibold text-t1 focus:border-primary focus:ring-1 focus:ring-primary outline-none"
                />
                <span className="absolute right-3 top-1/2 -translate-y-1/2 text-[13px] font-bold text-t3">%</span>
              </div>
            </div>

            {/* Loan Term & Monthly */}
            <div className="card-base">
              <div className="card-hd"><span className="card-title">ผ่อน/เดือน</span></div>
              <div className="flex items-center justify-between mb-2">
                <label className="text-[12px] font-bold text-t1">ระยะเวลาผ่อนชำระ</label>
                <span className="text-[13px] font-extrabold text-primary">{formData.loanTermMonths} เดือน</span>
              </div>

              {/* Term buttons */}
              <div className="flex flex-wrap gap-2 mb-3">
                {[48, 60, 72, 84].map((t) => (
                  <button
                    key={t}
                    onClick={() => updateForm({ loanTermMonths: t })}
                    className={`px-4 py-[7px] rounded-full text-[12px] font-bold transition-all cursor-pointer border ${
                      formData.loanTermMonths === t
                        ? 'bg-primary text-white border-primary shadow-sm'
                        : 'bg-white text-t2 border-border hover:border-primary hover:text-primary'
                    }`}
                  >
                    {t} เดือน
                  </button>
                ))}
              </div>

              {/* Slider */}
              <div className="relative px-1 mb-3">
                <input
                  type="range"
                  min={LOAN_TERM_RANGE.min}
                  max={LOAN_TERM_RANGE.max}
                  step={LOAN_TERM_RANGE.step}
                  value={formData.loanTermMonths}
                  onChange={(e) => updateForm({ loanTermMonths: parseInt(e.target.value) })}
                  className="w-full h-2 rounded-full appearance-none cursor-pointer accent-primary"
                  style={{
                    background: `linear-gradient(to right, #1B7A3F 0%, #1B7A3F ${((formData.loanTermMonths - LOAN_TERM_RANGE.min) / (LOAN_TERM_RANGE.max - LOAN_TERM_RANGE.min)) * 100}%, #E5E7EB ${((formData.loanTermMonths - LOAN_TERM_RANGE.min) / (LOAN_TERM_RANGE.max - LOAN_TERM_RANGE.min)) * 100}%, #E5E7EB 100%)`
                  }}
                />
                <div className="flex justify-between mt-1">
                  {ticks.map((t) => (
                    <span key={t} className={`text-[9px] font-semibold ${t === formData.loanTermMonths ? 'text-primary' : 'text-t3'}`}>{t}</span>
                  ))}
                </div>
              </div>
              <div className="bg-primary-light rounded-lg p-4 text-center">
                <p className="text-[10px] text-t2 mb-1">ค่างวดโดยประมาณ</p>
                <p className="text-[24px] font-extrabold text-primary">฿{fmt(calc.monthly)}</p>
                <p className="text-[10px] text-t3 mt-1">x {formData.loanTermMonths} เดือน</p>
              </div>
            </div>

            {/* Delivery Date */}
            <div className="card-base">
              <div className="card-hd"><span className="card-title">กำหนดส่งมอบ</span></div>
              <input
                type="date"
                value={formData.deliveryDate}
                onChange={(e) => updateForm({ deliveryDate: e.target.value })}
                className="w-full h-[42px] bg-bg border border-border rounded-md px-3 text-[13px] text-t1 outline-none focus:border-primary cursor-pointer"
              />
            </div>

            {/* Payment Method */}
            <div className="card-base">
              <div className="card-hd"><span className="card-title">วิธีชำระเงินจอง</span></div>
              <div className="flex gap-2 mb-3">
                {[
                  { id: 'qr', icon: 'qr', label: 'QR PromptPay' },
                  { id: 'transfer', icon: 'bank', label: 'โอนเงิน' },
                  { id: 'credit', icon: 'card', label: 'บัตรเครดิต' },
                ].map(m => (
                  <button
                    key={m.id}
                    onClick={() => updateForm({ paymentMethod: m.id })}
                    className={`flex-1 border-2 rounded-[10px] p-[10px] text-center cursor-pointer text-[11px] font-semibold transition-all ${formData.paymentMethod === m.id ? 'border-primary text-primary bg-emerald-50' : 'border-border text-t2'}`}
                  >
                    <div className="flex justify-center mb-1"><Icon name={m.icon} size={20} /></div>
                    {m.label}
                  </button>
                ))}
              </div>
            </div>

            <div className="flex gap-[10px] mt-2">
              <button onClick={goBack} className="btn-o flex-1 cursor-pointer">
                ย้อนกลับ
              </button>
              <button onClick={goToStep3} className="btn-p flex-1 cursor-pointer">
                <Icon name={payMethodIcon[formData.paymentMethod]} size={16} /> {payMethodLabel[formData.paymentMethod]}
              </button>
            </div>
          </>
        )}

        {/* ================================================================ */}
        {/* Step 3: Payment */}
        {/* ================================================================ */}
        {step === 3 && (
          <>
            {/* QR PromptPay */}
            {formData.paymentMethod === 'qr' && (
              <>
                <div className="flex flex-col items-center bg-white rounded-lg p-5 shadow-sm mb-3">
                  <img
                    src={`https://chart.googleapis.com/chart?cht=qr&chs=200x200&chl=promptpay%3A0000000000%26amount%3D5000`}
                    alt="QR"
                    className="w-[180px] h-[180px] rounded-lg"
                  />
                  <p className="text-[14px] font-bold text-t1 mt-3">สแกน QR เพื่อชำระ / Scan to Pay</p>
                  <p className="text-[11px] text-t3 mt-[3px] text-center">PromptPay — วรจักร์ยนต์ Co., Ltd.</p>
                  <p className="text-[24px] font-extrabold text-primary mt-2">฿5,000</p>
                  <div className="flex items-center gap-[5px] text-[11px] text-warm font-semibold mt-[6px]">
                    <Icon name="clock" size={12} /> หมดอายุใน {fmtTimer(timer)}
                  </div>
                </div>
                <div className="flex gap-[10px]">
                  <button onClick={goBack} className="btn-o flex-1 cursor-pointer">ย้อนกลับ</button>
                  <button onClick={goToStep4} className="btn-p flex-1 cursor-pointer">
                    <Icon name="check" size={16} /> ยืนยันการชำระเงิน
                  </button>
                </div>
              </>
            )}

            {/* Transfer */}
            {formData.paymentMethod === 'transfer' && (
              <>
                <div className="card-base">
                  <div className="card-hd"><span className="card-title">รายละเอียดการโอนเงิน</span></div>
                  {[
                    { bank: 'กสิกรไทย (KBank)', acct: '123-4-56789-0', name: 'บจก. วรจักร์ยนต์' },
                    { bank: 'ไทยพาณิชย์ (SCB)', acct: '987-6-54321-0', name: 'บจก. วรจักร์ยนต์' },
                  ].map((b, i) => (
                    <div key={b.bank} className={`py-3 ${i > 0 ? 'border-t border-border' : ''}`}>
                      <div className="flex items-center gap-3 mb-2">
                        <div className="w-9 h-9 bg-primary-light rounded-sm flex items-center justify-center text-primary flex-shrink-0">
                          <Icon name="bank" size={16} />
                        </div>
                        <div>
                          <p className="text-[13px] font-bold text-t1">{b.bank}</p>
                        </div>
                      </div>
                      <div className="ml-12 space-y-1">
                        <div className="flex justify-between text-[12px]">
                          <span className="text-t3">เลขที่บัญชี</span>
                          <span className="text-t1 font-bold">{b.acct}</span>
                        </div>
                        <div className="flex justify-between text-[12px]">
                          <span className="text-t3">ชื่อบัญชี</span>
                          <span className="text-t1 font-bold">{b.name}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                  <div className="border-t border-border pt-3 mt-2">
                    <div className="flex justify-between text-[12px]">
                      <span className="text-t3">จำนวนเงิน</span>
                      <span className="text-primary font-extrabold text-[14px]">฿5,000</span>
                    </div>
                    <div className="flex justify-between text-[12px] mt-1">
                      <span className="text-t3">หมายเลขอ้างอิง</span>
                      <span className="text-t1 font-bold">{bookingRef || 'จะสร้างหลังยืนยัน'}</span>
                    </div>
                  </div>
                </div>
                <div className="flex gap-[10px]">
                  <button onClick={goBack} className="btn-o flex-1 cursor-pointer">ย้อนกลับ</button>
                  <button onClick={goToStep4} className="btn-p flex-1 cursor-pointer">
                    <Icon name="check" size={16} /> ยืนยันการโอนเงิน
                  </button>
                </div>
              </>
            )}

            {/* Credit Card */}
            {formData.paymentMethod === 'credit' && (
              <>
                <div className="card-base">
                  <div className="card-hd">
                    <span className="card-title flex items-center gap-2">
                      <Icon name="card" size={16} /> ข้อมูลบัตรเครดิต
                    </span>
                    <span className="text-t3"><Icon name="lock" size={14} /></span>
                  </div>
                  <div className="space-y-3 py-2">
                    <div>
                      <label className="text-[11px] font-bold text-t2 mb-1 block">หมายเลขบัตร</label>
                      <input
                        type="text"
                        value={formData.cardNumber}
                        onChange={(e) => updateForm({ cardNumber: e.target.value })}
                        placeholder="XXXX XXXX XXXX XXXX"
                        maxLength={19}
                        className="w-full h-[42px] bg-bg border border-border rounded-md px-3 text-[13px] text-t1 outline-none focus:border-primary"
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="text-[11px] font-bold text-t2 mb-1 block">วันหมดอายุ</label>
                        <input
                          type="text"
                          value={formData.cardExpiry}
                          onChange={(e) => updateForm({ cardExpiry: e.target.value })}
                          placeholder="MM/YY"
                          maxLength={5}
                          className="w-full h-[42px] bg-bg border border-border rounded-md px-3 text-[13px] text-t1 outline-none focus:border-primary"
                        />
                      </div>
                      <div>
                        <label className="text-[11px] font-bold text-t2 mb-1 block">CVV</label>
                        <input
                          type="text"
                          value={formData.cardCvv}
                          onChange={(e) => updateForm({ cardCvv: e.target.value })}
                          placeholder="XXX"
                          maxLength={4}
                          className="w-full h-[42px] bg-bg border border-border rounded-md px-3 text-[13px] text-t1 outline-none focus:border-primary"
                        />
                      </div>
                    </div>
                    <div>
                      <label className="text-[11px] font-bold text-t2 mb-1 block">ชื่อบนบัตร</label>
                      <input
                        type="text"
                        value={formData.cardName}
                        onChange={(e) => updateForm({ cardName: e.target.value })}
                        placeholder="FULL NAME"
                        className="w-full h-[42px] bg-bg border border-border rounded-md px-3 text-[13px] text-t1 outline-none focus:border-primary"
                      />
                    </div>
                  </div>
                  <div className="flex items-center gap-2 text-[10px] text-t3 mt-2 pt-2 border-t border-border">
                    <Icon name="lock" size={12} />
                    <span>ข้อมูลถูกเข้ารหัสอย่างปลอดภัย</span>
                  </div>
                </div>
                <div className="flex gap-[10px]">
                  <button onClick={goBack} className="btn-o flex-1 cursor-pointer">ย้อนกลับ</button>
                  <button onClick={goToStep4} className="btn-p flex-1 cursor-pointer">
                    <Icon name="card" size={16} /> ชำระเงิน ฿5,000
                  </button>
                </div>
              </>
            )}
          </>
        )}

        {/* ================================================================ */}
        {/* Step 4: Success */}
        {/* ================================================================ */}
        {step === 4 && (
          <>
            <div className="text-center pt-6 pb-4">
              <div className="w-16 h-16 rounded-full bg-primary-light flex items-center justify-center mx-auto mb-4 text-primary animate-bounce">
                <Icon name="check" size={32} />
              </div>
              <h2 className="text-[20px] font-extrabold text-t1 mb-1">จองเรียบร้อย!</h2>
              <p className="text-[13px] text-t2">Booking confirmed & synced to DMS</p>
              <span className="inline-block mt-2 px-[14px] py-[6px] bg-primary-light text-primary text-[13px] font-extrabold rounded-pill">{bookingRef}</span>
              {formData.selectedColor && (
                <p className="text-[12px] text-t2 mt-2">{car?.name} - สี {formData.selectedColor}</p>
              )}
            </div>

            <div className="card-base mt-4">
              <div className="card-hd"><span className="card-title">ขั้นตอนถัดไป</span></div>
              {[
                { icon: 'check', label: 'ชำระเงินจอง ฿5,000', sub: 'ชำระแล้ว', done: true },
                { icon: 'report', label: 'ส่งเอกสารสินเชื่อ', sub: 'ภายใน 3 วันทำการ', done: false },
                { icon: 'car', label: 'นัดรับรถ', sub: formData.deliveryDate ? new Date(formData.deliveryDate).toLocaleDateString('th-TH', { day: 'numeric', month: 'long', year: 'numeric' }) : 'ภายใน 14-21 วัน', done: false },
              ].map(s => (
                <div key={s.label} className="flex items-center gap-3 py-3 border-b border-border last:border-b-0">
                  <div className={`w-9 h-9 rounded-sm flex items-center justify-center flex-shrink-0 ${s.done ? 'bg-primary text-white' : 'bg-primary-light text-primary'}`}>
                    <Icon name={s.icon} size={16} />
                  </div>
                  <div className="flex-1">
                    <p className="text-[13px] font-bold text-t1">{s.label}</p>
                    <p className="text-[11px] text-t2 mt-[1px]">{s.sub}</p>
                  </div>
                  <span className="text-t3"><Icon name="chevronRight" size={16} /></span>
                </div>
              ))}
            </div>

            <div className="flex gap-[10px] mt-4">
              <button onClick={() => setShowShareModal(true)} className="btn-o flex-1 cursor-pointer">
                <Icon name="share" size={16} /> แชร์ Booking
              </button>
              <button onClick={handleGoHome} className="btn-p flex-1 cursor-pointer">กลับหน้าหลัก</button>
            </div>

            {/* Share Modal */}
            {showShareModal && (
              <div className="fixed inset-0 bg-black/50 flex items-end justify-center z-50" onClick={() => setShowShareModal(false)}>
                <div className="bg-white rounded-t-2xl w-full max-w-md p-5 pb-8 animate-slide-up" onClick={(e) => e.stopPropagation()}>
                  <div className="flex justify-between items-center mb-4">
                    <h3 className="text-[15px] font-extrabold text-t1">แชร์ Booking</h3>
                    <button onClick={() => setShowShareModal(false)} className="w-8 h-8 rounded-full bg-bg flex items-center justify-center cursor-pointer">
                      <Icon name="close" size={16} />
                    </button>
                  </div>

                  <div className="space-y-2 mb-4">
                    <div className="flex justify-between text-[12px]">
                      <span className="text-t3">เลขที่จอง</span>
                      <span className="text-t1 font-bold">{bookingRef}</span>
                    </div>
                    <div className="flex justify-between text-[12px]">
                      <span className="text-t3">รุ่นรถ</span>
                      <span className="text-t1 font-bold">{car?.name}</span>
                    </div>
                    <div className="flex justify-between text-[12px]">
                      <span className="text-t3">สี</span>
                      <span className="text-t1 font-bold">{formData.selectedColor}</span>
                    </div>
                    <div className="flex justify-between text-[12px]">
                      <span className="text-t3">ราคา</span>
                      <span className="text-t1 font-bold">{car ? `฿${fmt(car.price)}` : '-'}</span>
                    </div>
                    <div className="flex justify-between text-[12px]">
                      <span className="text-t3">กำหนดส่งมอบ</span>
                      <span className="text-t1 font-bold">
                        {formData.deliveryDate ? new Date(formData.deliveryDate).toLocaleDateString('th-TH', { day: 'numeric', month: 'long', year: 'numeric' }) : '-'}
                      </span>
                    </div>
                  </div>

                  <div className="flex justify-center mb-4">
                    <img
                      src={`https://chart.googleapis.com/chart?cht=qr&chs=180x180&chl=${encodeURIComponent(`${window.location.origin}${import.meta.env.BASE_URL || '/'}#/booking-view/${bookingRef}`)}`}
                      alt="Booking QR"
                      className="w-[160px] h-[160px] rounded-lg border border-border"
                    />
                  </div>

                  <button onClick={handleCopyLink} className="btn-o w-full cursor-pointer mb-2">
                    <Icon name="clip" size={16} /> คัดลอกลิงก์
                  </button>
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
