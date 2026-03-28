import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Icon from '../components/icons/Icon';
import { LEADS, CARS } from '../lib/mockData';

export default function LeadDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const lead = LEADS[id];

  if (!lead) return <div className="p-4 text-t2">Lead not found</div>;

  const car = CARS[lead.car];
  const badgeClass = `badge-${lead.level}`;
  const badgeLabel = lead.level === 'won' ? 'Won' : lead.level === 'hot' ? 'HOT' : lead.level === 'warm' ? 'Warm' : 'Cool';

  const timeline = [
    { title: 'Walk-in เยี่ยมชมโชว์รูม', time: 'วันนี้ 10:30 น.', active: true },
    { title: 'สร้าง A-Card', time: 'วันนี้ 10:35 น.', active: true },
    { title: 'ทดลองขับ ' + (car?.name || ''), time: 'วันนี้ 11:00 น.', active: false },
    { title: 'คำนวณสินเชื่อ — ฿10,980/เดือน', time: 'วันนี้ 11:30 น.', active: false },
  ];

  return (
    <div className="screen-enter flex flex-col h-full">
      <div className="bg-white px-4 py-[13px] flex items-center gap-[11px] border-b border-border flex-shrink-0">
        <button onClick={() => navigate(-1)} className="w-9 h-9 rounded-full flex items-center justify-center bg-bg border border-border text-t1 cursor-pointer"><Icon name="back" size={18} /></button>
        <div className="flex-1"><h2 className="text-[15px] font-extrabold text-t1">{lead.name}</h2><p className="text-[11px] text-t2 mt-[1px]">Customer Profile</p></div>
        <span className="text-t2 cursor-pointer"><Icon name="more" size={20} /></span>
      </div>

      <div className="flex-1 overflow-y-auto pb-24" style={{ WebkitOverflowScrolling: 'touch' }}>
        {/* Hero */}
        <div className="bg-white px-4 py-[18px] border-b border-border flex items-center gap-[14px]">
          <div className="w-[52px] h-[52px] rounded-full flex items-center justify-center text-[20px] font-extrabold text-white flex-shrink-0" style={{ background: lead.color }}>{lead.init}</div>
          <div className="flex-1">
            <p className="text-[17px] font-extrabold text-t1">{lead.name}</p>
            <p className="text-[12px] text-t2 flex items-center gap-1 mt-[2px]"><Icon name="walk" size={12} /> {lead.source}</p>
          </div>
          <span className={badgeClass}>{badgeLabel}</span>
        </div>

        <div className="px-4 pt-4">
          {/* Quick Actions */}
          <div className="grid grid-cols-4 gap-2 mb-[14px]">
            {[
              { icon: 'phone', label: 'โทร', action: () => alert('Calling...') },
              { icon: 'chat', label: 'LINE', action: () => alert('Opening LINE...') },
              { icon: 'edit', label: 'แก้ไข', action: () => navigate('/acard') },
              { icon: 'book', label: 'จอง', action: () => navigate('/booking') },
            ].map(a => (
              <button key={a.label} onClick={a.action} className="flex flex-col items-center gap-1 p-3 bg-white border border-border rounded-md cursor-pointer active:opacity-70 transition-opacity">
                <span className="text-primary"><Icon name={a.icon} size={18} /></span>
                <span className="text-[10px] font-bold text-t2">{a.label}</span>
              </button>
            ))}
          </div>

          {/* Car Interest */}
          <div className="card-base">
            <div className="card-hd"><span className="card-title">รุ่นรถที่สนใจ</span></div>
            {car && (
              <div onClick={() => navigate(`/car/${car.id}`)} className="flex items-center gap-3 p-3 bg-white rounded-lg border border-border cursor-pointer active:opacity-70">
                <div className="w-[80px] h-[64px] rounded-md border border-border flex items-center justify-center flex-shrink-0 overflow-hidden p-1" style={{ background: car.bg }}>
                  <img src={car.img} alt={car.name} className="w-full h-full object-contain" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-[14px] font-extrabold text-t1">{car.name}</p>
                  <p className="text-[11px] text-t2">{car.type} · {car.priceLabel}</p>
                </div>
                <span className="text-[12px] font-bold text-primary flex-shrink-0">Details</span>
              </div>
            )}
          </div>

          {/* Timeline */}
          <div className="card-base">
            <div className="card-hd"><span className="card-title">Timeline</span></div>
            {timeline.map((t, i) => (
              <div key={i} className="flex gap-[10px] py-[10px] border-b border-border last:border-b-0">
                <span className={`w-2 h-2 rounded-full flex-shrink-0 mt-[5px] ${t.active ? 'bg-primary' : 'bg-t3'}`} />
                <div className="flex-1">
                  <p className="text-[12px] font-bold text-t1">{t.title}</p>
                  <p className="text-[10px] text-t3 mt-[2px]">{t.time}</p>
                </div>
              </div>
            ))}
          </div>

          {/* Notes */}
          <div className="card-base">
            <div className="card-hd"><span className="card-title">หมายเหตุ</span></div>
            <p className="text-[12px] text-t2 leading-relaxed">
              ลูกค้าสนใจ {car?.name || ''} สี Pearl White ต้องการดาวน์ 20% ผ่อน 60 เดือน ใช้ Toyota Leasing
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
