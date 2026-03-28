import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Icon from '../components/icons/Icon';
import { CARS } from '../lib/mockData';
import { useLeadStore } from '../stores/leadStore';
import { useBookingStore } from '../stores/bookingStore';
import { useUiStore } from '../stores/uiStore';

export default function LeadDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();

  const getLeadById = useLeadStore((s) => s.getLeadById);
  const changeLevel = useLeadStore((s) => s.changeLevel);
  const addActivity = useLeadStore((s) => s.addActivity);
  const setCarId = useBookingStore((s) => s.setCarId);
  const setLeadId = useBookingStore((s) => s.setLeadId);
  const addNotification = useUiStore((s) => s.addNotification);

  const [noteText, setNoteText] = useState('');

  // Re-read lead from store on every render to get latest activities/level
  const lead = getLeadById(id);

  if (!lead) return <div className="p-4 text-t2">Lead not found</div>;

  const car = CARS[lead.car];
  const badgeClass = `badge-${lead.level}`;
  const badgeLabel = lead.level === 'won' ? 'Won' : lead.level === 'hot' ? 'HOT' : lead.level === 'warm' ? 'Warm' : 'Cool';

  const handleCall = () => {
    window.location.href = 'tel:' + lead.phone;
    addActivity(lead.id, { type: 'call', title: 'โทรหาลูกค้า', description: 'โทรติดตาม ' + lead.name });
  };

  const handleLine = () => {
    window.open('https://line.me/R/', '_blank');
    addActivity(lead.id, { type: 'line', title: 'ส่ง LINE', description: 'ส่งข้อความ LINE ถึง ' + lead.name });
  };

  const handleEdit = () => {
    navigate(`/acard?edit=${lead.id}`);
  };

  const handleBook = () => {
    if (lead.car) setCarId(lead.car);
    setLeadId(lead.id);
    navigate('/booking');
  };

  const handleChangeLevel = (newLevel) => {
    changeLevel(lead.id, newLevel);
    addNotification({ title: 'เปลี่ยนสถานะ', body: lead.name + ' เป็น ' + newLevel.toUpperCase(), type: 'info' });
  };

  const handleAddNote = () => {
    if (!noteText.trim()) return;
    addActivity(lead.id, { type: 'note', title: 'บันทึก', description: noteText.trim() });
    setNoteText('');
  };

  // Sort activities by time, newest first
  const activities = (lead.activities || []).slice().sort((a, b) => new Date(b.time) - new Date(a.time));

  const activityIcon = (type) => {
    switch (type) {
      case 'call': return 'phone';
      case 'line': return 'chat';
      case 'note': return 'edit';
      case 'booking': return 'book';
      default: return 'check';
    }
  };

  const formatTime = (t) => {
    if (!t) return '';
    const d = new Date(t);
    if (isNaN(d.getTime())) return t;
    return d.toLocaleString('th-TH', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' });
  };

  const levelButtons = [
    { id: 'hot', label: 'HOT', color: '#DC2626', bg: '#FEF2F2' },
    { id: 'warm', label: 'WARM', color: '#D97706', bg: '#FFFBEB' },
    { id: 'cool', label: 'COOL', color: '#2563EB', bg: '#EFF6FF' },
    { id: 'won', label: 'WON', color: '#16A34A', bg: '#F0FDF4' },
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

        {/* Level change pills */}
        <div className="bg-white px-4 py-2 border-b border-border flex gap-2 overflow-x-auto">
          {levelButtons.map((lb) => (
            <button
              key={lb.id}
              onClick={() => handleChangeLevel(lb.id)}
              className="px-3 py-[3px] rounded-full text-[10px] font-bold border transition-all cursor-pointer flex-shrink-0"
              style={{
                borderColor: lead.level === lb.id ? lb.color : '#E5E7EB',
                background: lead.level === lb.id ? lb.bg : '#fff',
                color: lead.level === lb.id ? lb.color : '#6B7280',
              }}
            >
              {lb.label}
            </button>
          ))}
        </div>

        <div className="px-4 pt-4">
          {/* Quick Actions */}
          <div className="grid grid-cols-4 gap-2 mb-[14px]">
            {[
              { icon: 'phone', label: 'โทร', action: handleCall },
              { icon: 'chat', label: 'LINE', action: handleLine },
              { icon: 'edit', label: 'แก้ไข', action: handleEdit },
              { icon: 'book', label: 'จอง', action: handleBook },
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
            {activities.length > 0 ? activities.map((act, i) => (
              <div key={act.id || i} className="flex gap-[10px] py-[10px] border-b border-border last:border-b-0">
                <span className="w-6 h-6 rounded-full flex-shrink-0 bg-primary-light flex items-center justify-center text-primary mt-[1px]">
                  <Icon name={activityIcon(act.type)} size={12} />
                </span>
                <div className="flex-1">
                  <p className="text-[12px] font-bold text-t1">{act.title || act.type}</p>
                  {act.description && <p className="text-[11px] text-t2 mt-[1px]">{act.description}</p>}
                  {act.content && <p className="text-[11px] text-t2 mt-[1px]">{act.content}</p>}
                  <p className="text-[10px] text-t3 mt-[2px]">{formatTime(act.time)}</p>
                </div>
              </div>
            )) : (
              <p className="text-[12px] text-t3 py-2">ยังไม่มีกิจกรรม</p>
            )}

            {/* Add Note */}
            <div className="flex gap-2 mt-3 pt-3 border-t border-border">
              <input
                type="text"
                placeholder="เพิ่มบันทึก..."
                value={noteText}
                onChange={(e) => setNoteText(e.target.value)}
                onKeyDown={(e) => { if (e.key === 'Enter') handleAddNote(); }}
                className="flex-1 py-2 px-3 bg-bg border border-border rounded-md text-[12px] text-t1 outline-none focus:border-primary"
                style={{ fontFamily: "'Sarabun', sans-serif" }}
              />
              <button onClick={handleAddNote} className="px-3 py-2 bg-primary text-white rounded-md text-[11px] font-bold cursor-pointer">
                <Icon name="check" size={14} />
              </button>
            </div>
          </div>

          {/* Notes */}
          <div className="card-base">
            <div className="card-hd"><span className="card-title">หมายเหตุ</span></div>
            <p className="text-[12px] text-t2 leading-relaxed">
              {lead.notes || (`ลูกค้าสนใจ ${car?.name || ''} สี Pearl White ต้องการดาวน์ 20% ผ่อน 60 เดือน ใช้ Toyota Leasing`)}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
