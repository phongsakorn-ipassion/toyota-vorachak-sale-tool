import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../stores/authStore';
import { CARS, LEADS } from '../lib/mockData';
import Icon from '../components/icons/Icon';

export default function SalesDashboard() {
  const navigate = useNavigate();
  const user = useAuthStore((s) => s.user);
  const featLead = LEADS.duangjai;
  const featCar = CARS[featLead.car];

  return (
    <div className="screen-enter">
      {/* Header */}
      <div className="bg-white px-4 py-[13px] flex items-center gap-[11px] border-b border-border">
        <div className="w-[42px] h-[42px] rounded-full bg-primary flex items-center justify-center text-[15px] font-extrabold text-white flex-shrink-0">
          {user?.init || 'ม'}
        </div>
        <div className="flex-1">
          <h2 className="text-[15px] font-extrabold text-t1">สวัสดี {user?.name || 'มาลี'}</h2>
          <p className="text-[11px] text-t2 mt-[1px]">วรจักร์ยนต์ · มีนาคม 2026</p>
        </div>
        <button onClick={() => navigate('/notifications')} className="relative text-t2 cursor-pointer">
          <Icon name="bell" size={22} />
          <span className="absolute top-0 right-0 w-[7px] h-[7px] rounded-full bg-hot" style={{ border: '1.5px solid white' }} />
        </button>
      </div>

      <div className="flex-1 overflow-y-auto px-4 pt-4 pb-24" style={{ WebkitOverflowScrolling: 'touch' }}>
        {/* Target Card */}
        <div className="bg-primary rounded-lg p-[18px] mb-3 relative overflow-hidden">
          <div className="absolute -top-5 -right-5 w-[120px] h-[120px] rounded-full bg-white/[.07]" />
          <div className="absolute -bottom-[30px] right-[30px] w-[80px] h-[80px] rounded-full bg-white/[.05]" />
          <p className="text-[11px] text-white/65 font-semibold">ยอดขายเดือนนี้ / Monthly Target</p>
          <p className="text-[34px] font-extrabold text-white leading-none">45 <span className="text-[14px]">units</span></p>
          <p className="text-[12px] text-white/60 mt-[1px]">เป้าหมาย / Target: 70 units</p>
          <div className="h-[5px] bg-white/20 rounded-[3px] mt-[11px] mb-[10px]">
            <div className="h-full bg-white rounded-[3px]" style={{ width: '64%' }} />
          </div>
          <div className="flex gap-6">
            <div><p className="text-[18px] font-extrabold text-white">3</p><p className="text-[10px] text-white/60">จองวันนี้</p></div>
            <div><p className="text-[18px] font-extrabold text-white">7</p><p className="text-[10px] text-white/60">Hot Leads</p></div>
            <div><p className="text-[18px] font-extrabold text-white">25</p><p className="text-[10px] text-white/60">เหลืออีก</p></div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="sec-lbl">Quick Actions</div>
        <div className="grid grid-cols-3 gap-2 mb-3">
          {[
            { label: 'A-Card ใหม่', icon: 'clip', path: '/acard' },
            { label: 'รุ่นรถ', icon: 'car', path: '/catalog' },
            { label: 'คำนวณผ่อน', icon: 'calc', path: '/calc' },
          ].map((a) => (
            <button key={a.label} onClick={() => navigate(a.path)} className="bg-white border border-border rounded-lg p-[14px] text-center cursor-pointer active:opacity-70 transition-opacity">
              <div className="flex justify-center mb-[5px] text-primary"><Icon name={a.icon} size={22} /></div>
              <div className="text-[11px] font-bold text-t1 leading-tight">{a.label}</div>
            </button>
          ))}
        </div>

        {/* Hot Leads */}
        <div className="flex items-center justify-between mb-[10px] mt-1">
          <div className="card-title"><Icon name="flame" size={16} className="text-hot" /> Hot Leads</div>
          <button onClick={() => navigate('/pipeline')} className="text-[12px] font-bold text-primary cursor-pointer">ดูทั้งหมด →</button>
        </div>

        {/* Featured Lead */}
        <div onClick={() => navigate(`/lead/${featLead.id}`)} className="bg-white border border-border rounded-lg overflow-hidden mb-3 cursor-pointer active:opacity-80 transition-opacity">
          <div className="relative h-[160px] flex items-center justify-center border-b border-border" style={{ background: 'linear-gradient(135deg,#F0FAF3 0%,#E8F5EC 50%,#DCF0E2 100%)' }}>
            <img src={featCar.img} alt={featCar.name} className="w-[65%] max-w-[220px] object-contain" style={{ filter: 'drop-shadow(0 6px 20px rgba(0,0,0,.12))' }} />
            <span className="absolute top-3 left-3 px-[10px] py-1 rounded-pill text-[10px] font-bold text-white bg-transit flex items-center gap-1"><Icon name="flame" size={10} /> HOT</span>
            <span className="absolute top-3 right-3 px-[10px] py-1 rounded-pill text-[10px] font-bold text-white bg-primary">ตัดสินใจวันนี้</span>
          </div>
          <div className="p-[14px]">
            <p className="text-[16px] font-extrabold text-t1">{featLead.name}</p>
            <p className="text-[12px] text-t2 mt-[2px] flex items-center gap-1"><Icon name="walk" size={12} /> Walk-in · สาขาลาดพร้าว</p>
            <div className="flex items-center justify-between mt-[10px] mb-2">
              <span className="badge-hot">HOT</span>
              <span className="text-[10px] text-t3">10:30 น. วันนี้</span>
            </div>
            <div className="flex gap-[6px] flex-wrap">
              {['งบ 800K', 'Toyota Leasing', 'วันนี้'].map(t => (
                <span key={t} className="inline-flex items-center gap-1 px-[9px] py-1 rounded-[20px] text-[11px] font-semibold text-t2 bg-bg border border-border">{t}</span>
              ))}
            </div>
          </div>
        </div>

        {/* Lead List */}
        <div className="card-base">
          <div className="card-hd">
            <span className="card-title">Lead ทั้งหมดวันนี้</span>
            <button onClick={() => navigate('/pipeline')} className="text-[12px] font-bold text-primary cursor-pointer">See All</button>
          </div>
          {[
            { ...LEADS.prawit, car: CARS.lc, time: '14:00' },
            { ...LEADS.oranee, car: CARS.bz4x, time: '15:30' },
            { ...LEADS.jirawat, car: CARS.corolla, time: '11:45' },
          ].map((lead) => (
            <div key={lead.id} onClick={() => navigate(`/lead/${lead.id}`)} className="flex items-center gap-[11px] py-[11px] border-b border-border last:border-b-0 cursor-pointer">
              <div className="w-[42px] h-[42px] rounded-full flex items-center justify-center text-[15px] font-extrabold text-white flex-shrink-0" style={{ background: lead.color }}>{lead.init}</div>
              <div className="flex-1 min-w-0">
                <p className="text-[13px] font-bold text-t1">{lead.name}</p>
                <p className="text-[11px] text-t2 mt-[2px] flex items-center gap-1"><Icon name="car" size={11} /> {lead.car.name} · {lead.car.priceLabel}</p>
              </div>
              <div className="flex flex-col items-end gap-1 flex-shrink-0">
                <span className={`badge-${lead.level}`}>{lead.level === 'won' ? 'Won' : lead.level === 'hot' ? 'Hot' : 'Warm'}</span>
                <span className="text-[10px] text-t3">{lead.time}</span>
              </div>
            </div>
          ))}
        </div>

        {/* Commission */}
        <div className="bg-primary rounded-lg p-4 relative overflow-hidden">
          <div className="absolute -top-[15px] -right-[15px] w-[90px] h-[90px] rounded-full bg-white/[.07]" />
          <p className="text-[11px] text-white/65">คอมมิชชั่นเดือนนี้ / My Commission</p>
          <p className="text-[26px] font-extrabold text-white">฿34,500</p>
          <p className="text-[10px] text-white/50 mt-[2px]">ประมาณการ 2% x 45 units</p>
        </div>
      </div>
    </div>
  );
}
