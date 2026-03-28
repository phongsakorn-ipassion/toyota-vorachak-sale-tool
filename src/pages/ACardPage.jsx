import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Icon from '../components/icons/Icon';
import { CARS_LIST, LEAD_SOURCES } from '../lib/mockData';

export default function ACardPage() {
  const navigate = useNavigate();
  const [source, setSource] = useState('Walk-in');
  const [interest, setInterest] = useState('hot');

  const saveACard = () => {
    alert('บันทึกสำเร็จ! ✓\nA-Card synced to Toyota NextGen');
  };

  return (
    <div className="screen-enter flex flex-col h-full">
      {/* Header */}
      <div className="bg-white px-4 py-[13px] flex items-center gap-[11px] border-b border-border flex-shrink-0">
        <button onClick={() => navigate(-1)} className="w-9 h-9 rounded-full flex items-center justify-center bg-bg border border-border text-t1 cursor-pointer"><Icon name="back" size={18} /></button>
        <div className="flex-1"><h2 className="text-[15px] font-extrabold text-t1">ลงทะเบียนลูกค้า</h2><p className="text-[11px] text-t2 mt-[1px]">New Lead — A-Card Digital</p></div>
        <span className="text-t2"><Icon name="clip" size={20} /></span>
      </div>

      <div className="flex-1 overflow-y-auto px-4 pt-4 pb-24" style={{ WebkitOverflowScrolling: 'touch' }}>
        {/* Customer Info */}
        <div className="card-base">
          <div className="card-hd"><span className="card-title">ข้อมูลลูกค้า | Customer Info</span></div>
          {[
            { label: 'ชื่อ-นามสกุล / Full Name *', icon: 'user', type: 'text', ph: 'กรอกชื่อลูกค้า' },
            { label: 'เบอร์โทร / Phone *', icon: 'phone', type: 'tel', ph: '08X-XXX-XXXX' },
            { label: 'อีเมล / Email', icon: 'mail', type: 'email', ph: 'example@email.com' },
            { label: 'LINE ID', icon: 'chat', type: 'text', ph: '@lineid' },
          ].map((f) => (
            <div key={f.label} className="mb-3">
              <label className="block text-[10px] font-extrabold text-t2 tracking-wider uppercase mb-[5px]">{f.label}</label>
              <div className="relative">
                <span className="absolute left-[13px] top-1/2 -translate-y-1/2 text-t3"><Icon name={f.icon} size={15} /></span>
                <input type={f.type} placeholder={f.ph} className="w-full py-3 pl-[38px] pr-3 bg-white border border-border rounded-md text-[13px] text-t1 outline-none focus:border-primary" style={{ fontFamily: "'Sarabun', sans-serif" }} />
              </div>
            </div>
          ))}
        </div>

        {/* Lead Source */}
        <div className="card-base">
          <div className="card-hd"><span className="card-title">ช่องทาง | Lead Source</span></div>
          <div className="flex flex-wrap gap-[7px]">
            {LEAD_SOURCES.map((s) => (
              <button key={s} onClick={() => setSource(s)} className={`pill-filter ${source === s ? 'on' : ''}`}>{s}</button>
            ))}
          </div>
        </div>

        {/* Interest Level */}
        <div className="card-base">
          <div className="card-hd"><span className="card-title">ระดับความสนใจ | Interest Level</span></div>
          <div className="grid grid-cols-3 gap-2">
            {[
              { id: 'hot', icon: 'flame', label: 'HOT', sub: 'พร้อมซื้อ', sel: 'border-hot bg-red-50' },
              { id: 'warm', icon: 'sun', label: 'WARM', sub: 'สนใจ', sel: 'border-warm bg-amber-50' },
              { id: 'cool', icon: 'snow', label: 'COOL', sub: 'สำรวจ', sel: 'border-cool bg-blue-50' },
            ].map((l) => (
              <button key={l.id} onClick={() => setInterest(l.id)} className={`p-3 rounded-md text-center border-[1.5px] transition-all cursor-pointer ${interest === l.id ? l.sel : 'border-border bg-white'}`} style={{ fontFamily: "'Sarabun', sans-serif" }}>
                <div className="flex justify-center mb-[3px]"><Icon name={l.icon} size={20} /></div>
                <div className="text-[12px] font-extrabold text-t1">{l.label}</div>
                <div className="text-[10px] text-t2">{l.sub}</div>
              </button>
            ))}
          </div>
        </div>

        {/* Model + Budget */}
        <div className="card-base">
          <div className="card-hd"><span className="card-title">รุ่นรถที่สนใจ | Model of Interest</span></div>
          <div className="mb-3">
            <label className="block text-[10px] font-extrabold text-t2 tracking-wider uppercase mb-[5px]">Model</label>
            <select className="w-full py-3 px-3 bg-white border border-border rounded-md text-[13px] text-t1 outline-none focus:border-primary appearance-none cursor-pointer" style={{ fontFamily: "'Sarabun', sans-serif" }}>
              <option>เลือกรุ่นรถ</option>
              {CARS_LIST.map(c => <option key={c.id} value={c.id}>{c.name} — {c.priceLabel}</option>)}
            </select>
          </div>
          <div>
            <label className="block text-[10px] font-extrabold text-t2 tracking-wider uppercase mb-[5px]">Budget</label>
            <select className="w-full py-3 px-3 bg-white border border-border rounded-md text-[13px] text-t1 outline-none focus:border-primary appearance-none cursor-pointer" style={{ fontFamily: "'Sarabun', sans-serif" }}>
              <option>ต่ำกว่า 500K</option>
              <option>500K-1M</option>
              <option>1M-2M</option>
              <option>มากกว่า 2M</option>
            </select>
          </div>
        </div>

        {/* Notes */}
        <div className="card-base">
          <div className="card-hd"><span className="card-title">หมายเหตุ / Notes</span></div>
          <textarea placeholder="บันทึกรายละเอียดเพิ่มเติม..." rows={3} className="w-full py-3 px-3 bg-white border border-border rounded-md text-[13px] text-t1 outline-none focus:border-primary resize-none" style={{ fontFamily: "'Sarabun', sans-serif" }} />
        </div>

        <button onClick={saveACard} className="btn-p cursor-pointer mb-4">
          <Icon name="check" size={16} /> บันทึก Lead / Save A-Card
        </button>
      </div>
    </div>
  );
}
