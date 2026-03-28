import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import PageHeader from '../components/layout/PageHeader';
import Avatar from '../components/ui/Avatar';
import Badge from '../components/ui/Badge';
import Button from '../components/ui/Button';
import Modal from '../components/ui/Modal';
import Toast from '../components/ui/Toast';
import Icon from '../components/icons/Icon';
import { useLeadStore } from '../stores/leadStore';
import { useBookingStore } from '../stores/bookingStore';
import { LEADS, CARS } from '../lib/mockData';
import { LEAD_LEVELS } from '../lib/constants';

const ACTIVITY_ICONS = {
  call: 'phone',
  meeting: 'calendar',
  note: 'note',
  booking: 'check',
  status_change: 'target',
};

const ACTIVITY_COLORS = {
  call: '#4D96FF',
  meeting: '#FFD93D',
  note: '#A8A8A8',
  booking: '#10B981',
  status_change: '#8B5CF6',
};

const THAI_MONTHS = [
  'ม.ค.', 'ก.พ.', 'มี.ค.', 'เม.ย.', 'พ.ค.', 'มิ.ย.',
  'ก.ค.', 'ส.ค.', 'ก.ย.', 'ต.ค.', 'พ.ย.', 'ธ.ค.',
];

function formatThaiTime(dateStr) {
  const d = new Date(dateStr);
  const day = d.getDate();
  const month = THAI_MONTHS[d.getMonth()];
  const hours = String(d.getHours()).padStart(2, '0');
  const mins = String(d.getMinutes()).padStart(2, '0');
  return `${day} ${month} ${hours}:${mins}`;
}

const LEVEL_OPTIONS = [
  { key: 'hot', label: 'Hot', emoji: '\uD83D\uDD25', bg: 'bg-red-50', border: 'border-red-200', activeBorder: 'border-red-500', text: 'text-red-600' },
  { key: 'warm', label: 'Warm', emoji: '\uD83C\uDF21\uFE0F', bg: 'bg-amber-50', border: 'border-amber-200', activeBorder: 'border-amber-500', text: 'text-amber-600' },
  { key: 'cool', label: 'Cool', emoji: '\u2744\uFE0F', bg: 'bg-blue-50', border: 'border-blue-200', activeBorder: 'border-blue-500', text: 'text-blue-600' },
  { key: 'won', label: 'Won', emoji: '\u2713', bg: 'bg-emerald-50', border: 'border-emerald-200', activeBorder: 'border-emerald-500', text: 'text-emerald-600' },
  { key: 'lost', label: 'Lost', emoji: '\u2717', bg: 'bg-gray-50', border: 'border-gray-200', activeBorder: 'border-gray-500', text: 'text-gray-600' },
];

export default function LeadDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const storeLead = useLeadStore((s) => s.leads.find((l) => l.id === id));
  const addActivity = useLeadStore((s) => s.addActivity);
  const changeLevel = useLeadStore((s) => s.changeLevel);
  const setCarId = useBookingStore((s) => s.setCarId);
  const setLeadId = useBookingStore((s) => s.setLeadId);
  const setCustomerInfo = useBookingStore((s) => s.setCustomerInfo);

  const lead = storeLead || LEADS[id];

  const [toast, setToast] = useState({ visible: false, message: '', type: 'info' });
  const [noteModalOpen, setNoteModalOpen] = useState(false);
  const [appointmentModalOpen, setAppointmentModalOpen] = useState(false);
  const [noteText, setNoteText] = useState('');
  const [appointmentDate, setAppointmentDate] = useState('');
  const [appointmentTime, setAppointmentTime] = useState('');
  const [appointmentReason, setAppointmentReason] = useState('');

  if (!lead) {
    return (
      <div className="flex flex-col h-full bg-surface">
        <PageHeader title="ไม่พบข้อมูล" showBack />
        <div className="flex-1 flex items-center justify-center">
          <p className="text-sm text-t2">ไม่พบข้อมูลลูกค้า</p>
        </div>
      </div>
    );
  }

  const levelConfig = LEAD_LEVELS[lead.level] || LEAD_LEVELS.cool;
  const car = CARS[lead.car];

  const handleCall = () => {
    window.location.href = 'tel:' + lead.phone;
    addActivity(lead.id, {
      type: 'call',
      title: 'โทรหาลูกค้า',
      content: `โทรหา ${lead.name} (${lead.phone})`,
    });
    setToast({ visible: true, message: `กำลังโทรหา ${lead.name}...`, type: 'info' });
  };

  const handleLine = () => {
    window.open('https://line.me/R/', '_blank');
    addActivity(lead.id, {
      type: 'call',
      title: 'ติดต่อผ่าน LINE',
      content: `เปิด LINE สำหรับ ${lead.name}`,
    });
    setToast({ visible: true, message: `เปิด LINE สำหรับ ${lead.name}`, type: 'info' });
  };

  const handleSaveNote = () => {
    if (!noteText.trim()) return;
    addActivity(lead.id, {
      type: 'note',
      title: 'บันทึกข้อมูล',
      content: noteText.trim(),
    });
    setNoteText('');
    setNoteModalOpen(false);
    setToast({ visible: true, message: 'บันทึกสำเร็จ', type: 'success' });
  };

  const handleSaveAppointment = () => {
    if (!appointmentDate || !appointmentTime) return;
    const dateTimeStr = `${appointmentDate} ${appointmentTime}`;
    addActivity(lead.id, {
      type: 'meeting',
      title: 'นัดหมาย',
      content: `${appointmentReason || 'นัดหมายลูกค้า'} - ${dateTimeStr}`,
    });
    setAppointmentDate('');
    setAppointmentTime('');
    setAppointmentReason('');
    setAppointmentModalOpen(false);
    setToast({ visible: true, message: 'สร้างนัดหมายสำเร็จ', type: 'success' });
  };

  const handleChangeLevel = (newLevel) => {
    if (newLevel === lead.level) return;
    changeLevel(lead.id, newLevel);
    addActivity(lead.id, {
      type: 'status_change',
      title: 'เปลี่ยนสถานะ',
      content: `เปลี่ยนสถานะเป็น ${newLevel.toUpperCase()}`,
    });
    setToast({ visible: true, message: `เปลี่ยนสถานะเป็น ${newLevel.toUpperCase()}`, type: 'success' });
  };

  const handleEdit = () => {
    navigate(`/acard?edit=${lead.id}`);
  };

  const handleBook = () => {
    if (car) {
      setCarId(car.id);
    }
    setLeadId(lead.id);
    setCustomerInfo({
      name: lead.name,
      phone: lead.phone,
      email: lead.email || '',
    });
    navigate('/booking');
  };

  // Sort activities newest first
  const sortedActivities = [...(lead.activities || [])].sort(
    (a, b) => new Date(b.time) - new Date(a.time)
  );

  return (
    <div className="flex flex-col h-full bg-surface">
      <PageHeader title={lead.name} showBack />

      <div className="flex-1 overflow-y-auto">
        {/* Hero section */}
        <div className="bg-white py-[18px] px-4 border-b border-border flex items-center gap-[14px]">
          <div
            className="w-[52px] h-[52px] rounded-full flex items-center justify-center shrink-0"
            style={{ backgroundColor: lead.color || '#1B7A3F' }}
          >
            <span className="text-[20px] font-extrabold text-white">{lead.init}</span>
          </div>
          <div className="flex-1 min-w-0">
            <h2 className="text-[17px] font-extrabold text-t1">{lead.name}</h2>
            <p className="text-[12px] text-t2">{lead.source}</p>
            {lead.phone && (
              <p className="text-[11px] text-t3 mt-0.5">{lead.phone}</p>
            )}
          </div>
          <div className="flex flex-col items-end gap-1.5">
            <Badge level={lead.level}>{levelConfig.label}</Badge>
            <button
              onClick={handleEdit}
              className="flex items-center gap-1 text-[10px] text-primary font-bold cursor-pointer"
            >
              <Icon name="edit" size={12} />
              แก้ไข
            </button>
          </div>
        </div>

        <div className="px-4">
          {/* Action buttons */}
          <div className="grid grid-cols-4 gap-2 my-4">
            <button
              onClick={handleCall}
              className="flex flex-col items-center justify-center gap-1 py-3 px-[6px] rounded-lg border border-border bg-white cursor-pointer transition-all duration-150 active:scale-95"
            >
              <Icon name="phone" size={20} className="text-primary" />
              <span className="text-[10px] font-bold text-t2">โทร</span>
            </button>
            <button
              onClick={handleLine}
              className="flex flex-col items-center justify-center gap-1 py-3 px-[6px] rounded-lg border border-border bg-white cursor-pointer transition-all duration-150 active:scale-95"
            >
              <Icon name="line" size={20} className="text-primary" />
              <span className="text-[10px] font-bold text-t2">LINE</span>
            </button>
            <button
              onClick={() => setAppointmentModalOpen(true)}
              className="flex flex-col items-center justify-center gap-1 py-3 px-[6px] rounded-lg border border-border bg-white cursor-pointer transition-all duration-150 active:scale-95"
            >
              <Icon name="calendar" size={20} className="text-primary" />
              <span className="text-[10px] font-bold text-t2">นัดหมาย</span>
            </button>
            <button
              onClick={() => setNoteModalOpen(true)}
              className="flex flex-col items-center justify-center gap-1 py-3 px-[6px] rounded-lg border border-border bg-white cursor-pointer transition-all duration-150 active:scale-95"
            >
              <Icon name="note" size={20} className="text-primary" />
              <span className="text-[10px] font-bold text-t2">บันทึก</span>
            </button>
          </div>

          {/* Change Status */}
          <div className="card-base">
            <p className="text-xs font-bold text-t1 mb-2">เปลี่ยนสถานะ</p>
            <div className="flex flex-wrap gap-2">
              {LEVEL_OPTIONS.map((opt) => {
                const isActive = lead.level === opt.key;
                return (
                  <button
                    key={opt.key}
                    onClick={() => handleChangeLevel(opt.key)}
                    className={`
                      flex items-center gap-1 py-1.5 px-3 rounded-full text-[11px] font-bold
                      transition-all duration-150 cursor-pointer border
                      ${isActive ? `${opt.bg} ${opt.activeBorder} ${opt.text}` : `bg-white ${opt.border} text-t2`}
                    `.trim()}
                  >
                    <span>{opt.emoji}</span>
                    <span>{opt.label}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Car interest card */}
          {car && (
            <div
              className="card-base flex gap-3 cursor-pointer"
              onClick={() => navigate(`/car/${car.id}`)}
            >
              <img
                src={car.img}
                alt={car.name}
                className="w-16 h-12 rounded object-cover shrink-0"
              />
              <div className="flex-1 min-w-0">
                <p className="text-sm font-bold text-t1 truncate">{car.name}</p>
                <p className="text-xs text-t2">{car.priceLabel}</p>
              </div>
              <span className="text-xs text-primary font-bold self-center shrink-0">
                ดูรายละเอียด
              </span>
            </div>
          )}

          {/* Book button */}
          <div className="mt-2 mb-4">
            <Button variant="primary" fullWidth onClick={handleBook}>
              <Icon name="car" size={16} />
              จองรถให้ลูกค้า
            </Button>
          </div>

          {/* Activity timeline */}
          <div className="mt-2 mb-6">
            <h3 className="text-sm font-bold text-t1 mb-2">กิจกรรม</h3>
            {sortedActivities.length === 0 ? (
              <p className="text-xs text-t3 text-center py-4">ยังไม่มีกิจกรรม</p>
            ) : (
              <div className="mt-2">
                {sortedActivities.map((activity, index) => {
                  const isLast = index === sortedActivities.length - 1;
                  const iconName = ACTIVITY_ICONS[activity.type] || 'note';
                  const dotColor = ACTIVITY_COLORS[activity.type] || '#A8A8A8';

                  return (
                    <div
                      key={activity.id}
                      className="flex gap-[10px] py-[10px] border-b border-border last:border-0"
                    >
                      {/* Left: icon dot */}
                      <div className="flex flex-col items-center pt-0.5">
                        <div
                          className="w-6 h-6 rounded-full flex items-center justify-center shrink-0"
                          style={{ backgroundColor: dotColor + '22' }}
                        >
                          <Icon name={iconName} size={12} className="shrink-0" style={{ color: dotColor }} />
                        </div>
                        {!isLast && (
                          <div className="w-0.5 flex-1 bg-border mt-1" />
                        )}
                      </div>

                      {/* Right: content */}
                      <div className="flex-1">
                        <p className="text-[12px] font-bold text-t1">{activity.title}</p>
                        {activity.content && (
                          <p className="text-[11px] text-t2 mt-0.5">{activity.content}</p>
                        )}
                        <p className="text-[10px] text-t3 mt-1">
                          {formatThaiTime(activity.time)}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Note Modal */}
      <Modal
        isOpen={noteModalOpen}
        onClose={() => setNoteModalOpen(false)}
        title="เพิ่มบันทึก"
      >
        <textarea
          rows={4}
          placeholder="พิมพ์บันทึก..."
          value={noteText}
          onChange={(e) => setNoteText(e.target.value)}
          className="w-full border border-border rounded-sm py-3 px-3.5 text-sm bg-white text-t1 focus:border-primary focus:outline-none transition-colors resize-none mb-4"
        />
        <div className="flex gap-3">
          <Button variant="outline" fullWidth onClick={() => setNoteModalOpen(false)}>
            ยกเลิก
          </Button>
          <Button variant="primary" fullWidth onClick={handleSaveNote} disabled={!noteText.trim()}>
            บันทึก
          </Button>
        </div>
      </Modal>

      {/* Appointment Modal */}
      <Modal
        isOpen={appointmentModalOpen}
        onClose={() => setAppointmentModalOpen(false)}
        title="สร้างนัดหมาย"
      >
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-semibold text-t1 mb-1.5">วันที่</label>
            <input
              type="date"
              value={appointmentDate}
              onChange={(e) => setAppointmentDate(e.target.value)}
              className="w-full border border-border rounded-sm py-3 px-3.5 text-sm bg-white text-t1 focus:border-primary focus:outline-none transition-colors"
            />
          </div>
          <div>
            <label className="block text-sm font-semibold text-t1 mb-1.5">เวลา</label>
            <input
              type="time"
              value={appointmentTime}
              onChange={(e) => setAppointmentTime(e.target.value)}
              className="w-full border border-border rounded-sm py-3 px-3.5 text-sm bg-white text-t1 focus:border-primary focus:outline-none transition-colors"
            />
          </div>
          <div>
            <label className="block text-sm font-semibold text-t1 mb-1.5">เหตุผล</label>
            <textarea
              rows={2}
              placeholder="เช่น ทดสอบรถ, เจรจาราคา..."
              value={appointmentReason}
              onChange={(e) => setAppointmentReason(e.target.value)}
              className="w-full border border-border rounded-sm py-3 px-3.5 text-sm bg-white text-t1 focus:border-primary focus:outline-none transition-colors resize-none"
            />
          </div>
        </div>
        <div className="flex gap-3 mt-4">
          <Button variant="outline" fullWidth onClick={() => setAppointmentModalOpen(false)}>
            ยกเลิก
          </Button>
          <Button
            variant="primary"
            fullWidth
            onClick={handleSaveAppointment}
            disabled={!appointmentDate || !appointmentTime}
          >
            บันทึก
          </Button>
        </div>
      </Modal>

      <Toast
        message={toast.message}
        type={toast.type}
        isVisible={toast.visible}
        onClose={() => setToast((t) => ({ ...t, visible: false }))}
      />
    </div>
  );
}
