import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import Icon from '../components/icons/Icon';
import { CARS } from '../lib/mockData';
import { LOAN_TERMS, DEFAULT_INTEREST_RATE } from '../lib/constants';

export default function PaymentCalcPage() {
  const navigate = useNavigate();
  const car = CARS.corolla;
  const [downPct, setDownPct] = useState(20);
  const [term, setTerm] = useState(60);

  const calc = useMemo(() => {
    const down = car.price * downPct / 100;
    const financed = car.price - down;
    const r = DEFAULT_INTEREST_RATE / 100 / 12;
    const n = term;
    const monthly = financed * r * Math.pow(1 + r, n) / (Math.pow(1 + r, n) - 1);
    return { down, financed, monthly: Math.round(monthly) };
  }, [downPct, term, car.price]);

  const fmt = (n) => n.toLocaleString('th-TH');

  return (
    <div className="screen-enter flex flex-col h-full">
      <div className="bg-white px-4 py-[13px] flex items-center gap-[11px] border-b border-border flex-shrink-0">
        <button onClick={() => navigate(-1)} className="w-9 h-9 rounded-full flex items-center justify-center bg-bg border border-border text-t1 cursor-pointer"><Icon name="back" size={18} /></button>
        <div className="flex-1"><h2 className="text-[15px] font-extrabold text-t1">คำนวณสินเชื่อ</h2><p className="text-[11px] text-t2 mt-[1px]">Payment Calculator</p></div>
        <span className="text-t2"><Icon name="calc" size={20} /></span>
      </div>

      <div className="flex-1 overflow-y-auto px-4 pt-4 pb-24" style={{ WebkitOverflowScrolling: 'touch' }}>
        {/* Car summary */}
        <div className="flex items-center gap-3 p-3 bg-white rounded-lg border border-border mb-3">
          <div className="w-[80px] h-[64px] rounded-md border border-border flex items-center justify-center flex-shrink-0 overflow-hidden p-1" style={{ background: car.bg }}>
            <img src={car.img} alt={car.name} className="w-full h-full object-contain" />
          </div>
          <div className="flex-1">
            <p className="text-[14px] font-extrabold text-t1">{car.name}</p>
            <p className="text-[11px] text-t2">{car.type} · {car.fuel}</p>
          </div>
          <span className="inline-flex items-center gap-1 px-[9px] py-[2px] rounded-[20px] text-[11px] font-semibold text-t2 bg-bg border border-border">ราคาเต็ม</span>
        </div>

        {/* Payment Hero */}
        <div className="bg-primary rounded-lg p-5 text-center mb-3">
          <p className="text-[12px] text-white/70 mb-1">ผ่อนต่อเดือน / Monthly Payment</p>
          <p className="text-[36px] font-extrabold text-white leading-none">฿{fmt(calc.monthly)}</p>
          <p className="text-[11px] text-white/65 mt-[5px]">{car.name} · {term} เดือน · ดาวน์ {downPct}%</p>
        </div>

        {/* Down Payment */}
        <div className="card-base">
          <div className="card-hd">
            <span className="card-title">เงินดาวน์ / Down Payment</span>
            <span className="text-[13px] font-extrabold text-primary">฿{fmt(calc.down)} ({downPct}%)</span>
          </div>
          <input type="range" min={10} max={50} step={5} value={downPct} onChange={e => setDownPct(Number(e.target.value))} className="w-full accent-primary" />
          <div className="flex justify-between mt-1">
            <span className="text-[10px] text-t3">10%</span>
            <span className="text-[10px] text-t3">50%</span>
          </div>
        </div>

        {/* Loan Term */}
        <div className="card-base">
          <div className="card-hd"><span className="card-title">ระยะเวลาผ่อน / Loan Term</span></div>
          <div className="flex gap-2">
            {LOAN_TERMS.map(t => (
              <button key={t} onClick={() => setTerm(t)} className={`flex-1 p-3 rounded-md text-center font-extrabold text-[14px] border-[1.5px] transition-all cursor-pointer ${term === t ? 'bg-primary-light border-primary text-primary' : 'bg-bg border-border text-t2'}`} style={{ fontFamily: "'Sarabun', sans-serif" }}>
                {t}
                <span className="block text-[10px] font-semibold">เดือน</span>
              </button>
            ))}
          </div>
        </div>

        {/* Breakdown */}
        <div className="card-base">
          <div className="card-hd"><span className="card-title">รายละเอียด / Breakdown</span></div>
          {[
            { icon: 'card', label: 'ดาวน์ / Down Payment', val: `฿${fmt(calc.down)}` },
            { icon: 'bank', label: 'ยอดจัด / Financed Amount', val: `฿${fmt(calc.financed)}` },
            { icon: 'calendar', label: `ดอกเบี้ย ${DEFAULT_INTEREST_RATE}% / ${term} เดือน`, val: 'Toyota Leasing Thailand' },
          ].map(r => (
            <div key={r.label} className="flex items-center gap-3 py-3 border-b border-border last:border-b-0">
              <div className="w-9 h-9 bg-primary-light rounded-sm flex items-center justify-center text-primary flex-shrink-0"><Icon name={r.icon} size={16} /></div>
              <div className="flex-1"><p className="text-[13px] font-bold text-t1">{r.label}</p><p className="text-[11px] text-t2 mt-[1px]">{r.val}</p></div>
              <span className="text-t3"><Icon name="chevronRight" size={16} /></span>
            </div>
          ))}
        </div>

        {/* Actions */}
        <button onClick={() => alert('ส่ง LINE สำเร็จ ✓')} className="btn-o cursor-pointer mb-[10px]"><Icon name="chat" size={16} /> ส่งทาง LINE / Share via LINE</button>
        <button onClick={() => navigate('/booking')} className="btn-p cursor-pointer mb-4"><Icon name="book" size={16} /> Book Now</button>
      </div>
    </div>
  );
}
