import React, { useState, useCallback, useRef, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import Icon from '../components/icons/Icon';
import ConfirmDialog from '../components/ui/ConfirmDialog';
import { CARS, COLOR_OPTIONS } from '../lib/mockData';
import { formatNumber } from '../lib/formats';
import { useLeadStore } from '../stores/leadStore';
import { useBookingStore } from '../stores/bookingStore';
import { useUiStore } from '../stores/uiStore';
import { useVisibilityRefresh } from '../hooks/useVisibilityRefresh';

export default function LeadDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [, forceUpdate] = useState(0);
  useVisibilityRefresh(useCallback(() => forceUpdate(n => n + 1), []));

  // Concurrent check: capture read timestamp
  const readTimestamp = useRef(Date.now());
  useEffect(() => { readTimestamp.current = Date.now(); }, [id]);

  const getLeadById = useLeadStore((s) => s.getLeadById);
  const changeLevel = useLeadStore((s) => s.changeLevel);
  const updateLead = useLeadStore((s) => s.updateLead);
  const addActivity = useLeadStore((s) => s.addActivity);
  const editActivity = useLeadStore((s) => s.editActivity);
  const deleteActivity = useLeadStore((s) => s.deleteActivity);
  const setCarId = useBookingStore((s) => s.setCarId);
  const setLeadId = useBookingStore((s) => s.setLeadId);
  const getBookings = useBookingStore((s) => s.getBookings);
  const addNotification = useUiStore((s) => s.addNotification);

  const [noteText, setNoteText] = useState('');
  const [showBookingInfo, setShowBookingInfo] = useState(false);
  const [showShareModal, setShowShareModal] = useState(false);

  // Confirm dialog state
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [confirmConfig, setConfirmConfig] = useState({});

  // Activity editing state
  const [editingActivityId, setEditingActivityId] = useState(null);
  const [editingText, setEditingText] = useState('');

  // Won/Lost note expand state
  const [showStatusNote, setShowStatusNote] = useState(false);

  // Re-read lead from store on every render to get latest activities/level
  const lead = getLeadById(id);

  // Update read timestamp whenever lead data changes
  useEffect(() => { if (lead) readTimestamp.current = Date.now(); }, [lead?._updatedAt]);

  if (!lead) return <div className="p-4 text-t2">Lead not found</div>;

  const car = CARS[lead.car];
  const isTerminal = lead.level === 'won' || lead.level === 'lost';
  const badgeClass = `badge-${lead.level}`;
  const badgeLabel = {
    won: 'Won', lost: 'Lost', hot: 'HOT', warm: 'Warm', cool: 'Cool'
  }[lead.level] || lead.level;

  // Find status change note for won/lost
  const statusChangeActivity = isTerminal
    ? (lead.activities || []).find(a =>
        a.type === 'won' || a.type === 'lost' ||
        (a.type === 'status' && (a.description || a.content || '').length > 0)
      )
    : null;
  const statusNote = statusChangeActivity?.description || statusChangeActivity?.content || '';

  // Find existing booking for this lead
  const existingBooking = (getBookings() || []).find(b => b.leadId === lead.id);

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
    setShowBookingInfo(!showBookingInfo);
  };

  // --- Level change with confirmation ---
  const handleLevelClick = (newLevel) => {
    if (isTerminal) return; // Cannot change from won/lost

    if (newLevel === 'won') {
      setConfirmConfig({
        title: 'ยืนยันเปลี่ยนสถานะ',
        message: 'เมื่อเปลี่ยนเป็น Won จะไม่สามารถเปลี่ยนกลับได้',
        showNotes: true,
        requireNotes: false,
        confirmLabel: 'ยืนยัน Won',
        confirmColor: '#16A34A',
        onConfirm: (note) => {
          const result = changeLevel(lead.id, 'won', note || undefined, readTimestamp.current);
          if (result?.conflict) {
            toast((t) => (
              <div className="flex items-center gap-3">
                <span className="text-sm">{result.message}</span>
                <button onClick={() => { readTimestamp.current = Date.now(); forceUpdate(n => n + 1); toast.dismiss(t.id); }} className="text-xs px-2 py-1 bg-primary text-white rounded whitespace-nowrap">โหลดใหม่</button>
              </div>
            ), { duration: 5000, icon: '\u26A0\uFE0F' });
            setConfirmOpen(false);
            return;
          }
          addNotification({ title: 'เปลี่ยนสถานะ', body: lead.name + ' เป็น WON', type: 'info' });
          readTimestamp.current = Date.now();
          setConfirmOpen(false);
        },
      });
      setConfirmOpen(true);
    } else if (newLevel === 'lost') {
      setConfirmConfig({
        title: 'ยืนยันเปลี่ยนสถานะ',
        message: 'เมื่อเปลี่ยนเป็น Lost จะไม่สามารถเปลี่ยนกลับได้',
        showNotes: true,
        requireNotes: true,
        confirmLabel: 'ยืนยัน Lost',
        confirmColor: '#6B7280',
        onConfirm: (note) => {
          const result = changeLevel(lead.id, 'lost', note, readTimestamp.current);
          if (result?.conflict) {
            toast((t) => (
              <div className="flex items-center gap-3">
                <span className="text-sm">{result.message}</span>
                <button onClick={() => { readTimestamp.current = Date.now(); forceUpdate(n => n + 1); toast.dismiss(t.id); }} className="text-xs px-2 py-1 bg-primary text-white rounded whitespace-nowrap">โหลดใหม่</button>
              </div>
            ), { duration: 5000, icon: '\u26A0\uFE0F' });
            setConfirmOpen(false);
            return;
          }
          addNotification({ title: 'เปลี่ยนสถานะ', body: lead.name + ' เป็น LOST', type: 'info' });
          readTimestamp.current = Date.now();
          setConfirmOpen(false);
        },
      });
      setConfirmOpen(true);
    } else {
      // hot/warm/cool — simple confirm with optional note
      setConfirmConfig({
        title: 'ยืนยันเปลี่ยนสถานะ',
        message: `เปลี่ยนสถานะเป็น ${newLevel.toUpperCase()}`,
        showNotes: true,
        requireNotes: false,
        confirmLabel: 'ยืนยัน',
        confirmColor: '#2563EB',
        onConfirm: (note) => {
          const result = changeLevel(lead.id, newLevel, note || undefined, readTimestamp.current);
          if (result?.conflict) {
            toast((t) => (
              <div className="flex items-center gap-3">
                <span className="text-sm">{result.message}</span>
                <button onClick={() => { readTimestamp.current = Date.now(); forceUpdate(n => n + 1); toast.dismiss(t.id); }} className="text-xs px-2 py-1 bg-primary text-white rounded whitespace-nowrap">โหลดใหม่</button>
              </div>
            ), { duration: 5000, icon: '\u26A0\uFE0F' });
            setConfirmOpen(false);
            return;
          }
          addNotification({ title: 'เปลี่ยนสถานะ', body: lead.name + ' เป็น ' + newLevel.toUpperCase(), type: 'info' });
          readTimestamp.current = Date.now();
          setConfirmOpen(false);
        },
      });
      setConfirmOpen(true);
    }
  };

  const handleAddNote = () => {
    if (!noteText.trim()) return;
    addActivity(lead.id, { type: 'note', title: 'บันทึก', description: noteText.trim() });
    setNoteText('');
  };

  // --- Activity CRUD ---
  const handleEditActivity = (act) => {
    setEditingActivityId(act.id);
    setEditingText(act.description || act.content || '');
  };

  const handleSaveEditActivity = (actId) => {
    if (editingText.trim()) {
      editActivity(lead.id, actId, { description: editingText.trim() });
    }
    setEditingActivityId(null);
    setEditingText('');
  };

  const handleDeleteActivity = (act) => {
    setConfirmConfig({
      title: 'ยืนยันลบกิจกรรมนี้?',
      message: act.title || act.type,
      showNotes: false,
      requireNotes: false,
      confirmLabel: 'ลบ',
      confirmColor: '#DC2626',
      onConfirm: () => {
        deleteActivity(lead.id, act.id);
        setConfirmOpen(false);
      },
    });
    setConfirmOpen(true);
  };

  // Sort activities by time, newest first
  const activities = (lead.activities || []).slice().sort((a, b) => new Date(b.time) - new Date(a.time));

  const activityIcon = (type) => {
    switch (type) {
      case 'call': return 'phone';
      case 'line': return 'chat';
      case 'note': return 'edit';
      case 'booking': return 'book';
      case 'won': return 'trophy';
      case 'lost': return 'flag';
      default: return 'check';
    }
  };

  const formatTime = (t) => {
    if (!t) return '';
    const d = new Date(t);
    if (isNaN(d.getTime())) return t;
    return d.toLocaleString('th-TH', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' });
  };

  const formatThaiDate = (dateStr) => {
    if (!dateStr) return '-';
    const d = new Date(dateStr);
    if (isNaN(d.getTime())) return dateStr;
    const months = ['มกราคม','กุมภาพันธ์','มีนาคม','เมษายน','พฤษภาคม','มิถุนายน','กรกฎาคม','สิงหาคม','กันยายน','ตุลาคม','พฤศจิกายน','ธันวาคม'];
    return `${d.getDate()} ${months[d.getMonth()]} ${d.getFullYear() + 543}`;
  };

  const levelButtons = [
    { id: 'hot', label: 'HOT', color: '#DC2626', bg: '#FEF2F2' },
    { id: 'warm', label: 'WARM', color: '#D97706', bg: '#FFFBEB' },
    { id: 'cool', label: 'COOL', color: '#2563EB', bg: '#EFF6FF' },
    { id: 'won', label: 'WON', color: '#16A34A', bg: '#F0FDF4' },
    { id: 'lost', label: 'LOST', color: '#6B7280', bg: '#F3F4F6' },
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

        {/* Customer Info Card */}
        <div className="bg-white px-4 py-3 border-b border-border">
          <div className="grid grid-cols-1 gap-2">
            <div className="flex items-center gap-2 text-[12px]">
              <span className="text-t3 w-10">ชื่อ</span>
              <span className="text-t1 font-bold">{lead.name}</span>
            </div>
            {lead.phone && (
              <div className="flex items-center gap-2 text-[12px]">
                <span className="text-t3 w-10">โทร</span>
                <a href={`tel:${lead.phone}`} className="text-primary font-bold">{lead.phone}</a>
              </div>
            )}
            {lead.email && (
              <div className="flex items-center gap-2 text-[12px]">
                <span className="text-t3 w-10">อีเมล</span>
                <span className="text-t1">{lead.email}</span>
              </div>
            )}
            {lead.lineId && (
              <div className="flex items-center gap-2 text-[12px]">
                <span className="text-t3 w-10">LINE</span>
                <span className="text-t1">{lead.lineId}</span>
              </div>
            )}
          </div>
        </div>

        {/* Level change pills */}
        <div className="bg-white px-4 py-2 border-b border-border flex gap-2 overflow-x-auto">
          {isTerminal ? (
            // Terminal state: show permanent badge using same badge-* class as list
            <div className="flex flex-col gap-2">
              <div className="flex items-center gap-2">
                <span className={badgeClass}>{badgeLabel} (ถาวร)</span>
              </div>
              {/* 2.3.2: Show status change note for won/lost */}
              {statusNote && (
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setShowStatusNote(!showStatusNote)}
                    className="flex items-center gap-1 text-[10px] text-t3 hover:text-t1 cursor-pointer"
                  >
                    <Icon name="edit" size={10} />
                    <span>{showStatusNote ? 'ซ่อนบันทึก' : 'ดูบันทึก'}</span>
                    <Icon name="chevronDown" size={10} className={`transition-transform ${showStatusNote ? 'rotate-180' : ''}`} />
                  </button>
                </div>
              )}
              {showStatusNote && statusNote && (
                <div className="bg-bg border border-border rounded-md p-2">
                  <p className="text-[11px] text-t2">{statusNote}</p>
                </div>
              )}
            </div>
          ) : (
            levelButtons.map((lb) => (
              <button
                key={lb.id}
                onClick={() => handleLevelClick(lb.id)}
                className="px-3 py-[3px] rounded-full text-[10px] font-bold border transition-all cursor-pointer flex-shrink-0"
                style={{
                  borderColor: lead.level === lb.id ? lb.color : '#E5E7EB',
                  background: lead.level === lb.id ? lb.bg : '#fff',
                  color: lead.level === lb.id ? lb.color : '#6B7280',
                }}
              >
                {lb.label}
              </button>
            ))
          )}
        </div>

        <div className="px-4 pt-4">
          {/* Quick Actions — reordered: โทร / LINE / จอง / แก้ไข */}
          <div className="grid grid-cols-4 gap-2 mb-[14px]">
            {[
              { icon: 'phone', label: 'โทร', action: handleCall },
              { icon: 'chat', label: 'LINE', action: handleLine },
              { icon: 'book', label: 'จอง', action: handleBook },
              { icon: 'edit', label: 'แก้ไข', action: handleEdit },
            ].map(a => (
              <button key={a.label} onClick={a.action} className="flex flex-col items-center gap-1 p-3 bg-white border border-border rounded-md cursor-pointer active:opacity-70 transition-opacity">
                <span className="text-primary"><Icon name={a.icon} size={18} /></span>
                <span className="text-[10px] font-bold text-t2">{a.label}</span>
              </button>
            ))}
          </div>

          {/* 2.3.4.1: Booking Info Section (shown when จอง is clicked) */}
          {showBookingInfo && (
            <div className="card-base">
              <div className="card-hd"><span className="card-title">ข้อมูลการจอง</span></div>
              {existingBooking ? (() => {
                const bookingRef = existingBooking.ref || existingBooking.refNumber || existingBooking.id;
                const bookingCar = existingBooking.carId ? CARS[existingBooking.carId] : null;
                const shareUrl = `https://phongsakorn-ipassion.github.io/toyota-vorachak-sale-tool/#/booking-view/${bookingRef}`;
                return (
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-[12px]">
                    <span className="text-t3">เลขที่จอง</span>
                    <span className="text-t1 font-bold">{bookingRef}</span>
                  </div>
                  {bookingCar && (
                    <div className="flex items-center justify-between text-[12px]">
                      <span className="text-t3">รุ่นรถ</span>
                      <span className="text-t1 font-bold">{bookingCar.name}</span>
                    </div>
                  )}
                  <div className="flex items-center justify-between text-[12px]">
                    <span className="text-t3">สี</span>
                    <div className="flex items-center gap-1.5">
                      <span className="w-3 h-3 rounded-full border border-gray-300 flex-shrink-0" style={{ background: COLOR_OPTIONS.find(c => c.name === (existingBooking.selectedColor || existingBooking.color || lead.selectedColor))?.hex || '#ccc' }} />
                      <span className="text-t1 font-bold">{existingBooking.selectedColor || existingBooking.color || 'Pearl White'}</span>
                    </div>
                  </div>
                  <div className="flex items-center justify-between text-[12px]">
                    <span className="text-t3">ราคา</span>
                    <span className="text-t1 font-bold">{formatNumber(existingBooking.carPrice || bookingCar?.price)} บาท</span>
                  </div>
                  <div className="flex items-center justify-between text-[12px]">
                    <span className="text-t3">กำหนดส่งมอบ</span>
                    <span className="text-t1 font-bold">{formatThaiDate(existingBooking.deliveryDate)}</span>
                  </div>
                  <div className="flex items-center justify-between text-[12px]">
                    <span className="text-t3">วันที่จอง</span>
                    <span className="text-t1 font-bold">{formatThaiDate(existingBooking.createdAt)}</span>
                  </div>
                  <div className="flex items-center justify-between text-[12px]">
                    <span className="text-t3">สถานะ</span>
                    <span className="text-primary font-bold">{existingBooking.status === 'confirmed' ? 'ยืนยันแล้ว' : existingBooking.status === 'cancelled' ? 'ยกเลิก' : 'รอดำเนินการ'}</span>
                  </div>
                  <div className="flex gap-2 mt-2">
                    <button
                      onClick={() => navigate(`/booking-view/${bookingRef}`)}
                      className="flex-1 px-4 py-2 bg-primary-light text-primary border border-primary-medium rounded-md text-[12px] font-bold cursor-pointer text-center"
                    >
                      ดูรายละเอียด
                    </button>
                    <button
                      onClick={() => setShowShareModal(true)}
                      className="flex-1 px-4 py-2 bg-white text-primary border border-primary-medium rounded-md text-[12px] font-bold cursor-pointer text-center flex items-center justify-center gap-1"
                    >
                      <Icon name="share" size={14} /> แชร์ Booking
                    </button>
                  </div>

                  {/* Share Modal */}
                  {showShareModal && (
                    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4" onClick={() => setShowShareModal(false)}>
                      <div className="bg-white rounded-xl p-5 w-full max-w-sm shadow-xl" onClick={(e) => e.stopPropagation()}>
                        <div className="flex items-center justify-between mb-4">
                          <h3 className="text-[15px] font-extrabold text-t1">แชร์ Booking</h3>
                          <button onClick={() => setShowShareModal(false)} className="w-8 h-8 rounded-full bg-bg flex items-center justify-center cursor-pointer">
                            <Icon name="close" size={16} />
                          </button>
                        </div>
                        <div className="space-y-2 mb-4 text-[12px]">
                          <div className="flex justify-between"><span className="text-t3">Ref</span><span className="text-t1 font-bold">{bookingRef}</span></div>
                          <div className="flex justify-between"><span className="text-t3">รุ่นรถ</span><span className="text-t1 font-bold">{bookingCar?.name || '-'}</span></div>
                          <div className="flex justify-between"><span className="text-t3">สี</span><span className="text-t1 font-bold">{existingBooking.selectedColor || existingBooking.color || 'Pearl White'}</span></div>
                          <div className="flex justify-between"><span className="text-t3">ราคา</span><span className="text-t1 font-bold">{formatNumber(existingBooking.carPrice || bookingCar?.price)} บาท</span></div>
                          <div className="flex justify-between"><span className="text-t3">กำหนดส่งมอบ</span><span className="text-t1 font-bold">{formatThaiDate(existingBooking.deliveryDate)}</span></div>
                        </div>
                        <div className="flex justify-center mb-4">
                          <img
                            src={`https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(shareUrl)}`}
                            alt="QR Code"
                            className="w-[160px] h-[160px] border border-border rounded-md"
                          />
                        </div>
                        <button
                          onClick={() => {
                            navigator.clipboard.writeText(shareUrl).then(() => {
                              toast.success('คัดลอกลิงก์แล้ว');
                            });
                          }}
                          className="w-full py-2.5 bg-primary text-white rounded-md text-[12px] font-bold cursor-pointer"
                        >
                          คัดลอกลิงก์
                        </button>
                      </div>
                    </div>
                  )}
                </div>
                );
              })() : (
                <div className="text-center py-4">
                  <p className="text-[12px] text-t3 mb-3">ยังไม่มีข้อมูลการจอง</p>
                  <button
                    onClick={() => {
                      if (lead.car) setCarId(lead.car);
                      setLeadId(lead.id);
                      navigate('/booking');
                    }}
                    className="px-4 py-2 bg-primary text-white rounded-md text-[12px] font-bold cursor-pointer"
                  >
                    สร้างการจอง
                  </button>
                </div>
              )}
            </div>
          )}

          {/* Car Interest — 2.2.4.1: chevron icon only, no text */}
          <div className="card-base">
            <div className="card-hd"><span className="card-title">รุ่นรถที่สนใจ</span></div>
            {car && (
              <div onClick={() => navigate(`/car/${car.id}?readonly=true${lead.selectedColor ? `&color=${encodeURIComponent(lead.selectedColor)}` : ''}`)} className="flex items-center gap-3 p-3 bg-white rounded-lg border border-border cursor-pointer active:opacity-70">
                <div className="w-[80px] h-[64px] rounded-md border border-border flex items-center justify-center flex-shrink-0 overflow-hidden p-1" style={{ background: car.bg }}>
                  <img src={car.img} alt={car.name} className="w-full h-full object-contain" onError={(e) => { e.target.style.display = 'none'; e.target.parentElement.innerHTML = '<div class="flex items-center justify-center w-full h-full text-t3"><svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M5 17h1m12 0h1M6 17H3V12l2.5-5h13L21 12v5h-3M6 17a2 2 0 104 0m4 0a2 2 0 104 0"/></svg></div>'; }} />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-[14px] font-extrabold text-t1">{car.name}</p>
                  <p className="text-[11px] text-t2">{car.type} · {car.priceLabel}</p>
                  {lead.selectedColor && (
                    <div className="flex items-center gap-1.5 mt-1">
                      <span className="w-3 h-3 rounded-full border border-gray-300 flex-shrink-0" style={{ background: COLOR_OPTIONS.find(c => c.name === lead.selectedColor)?.hex || '#ccc' }} />
                      <span className="text-[10px] text-t2 font-medium">{lead.selectedColor}</span>
                    </div>
                  )}
                </div>
                <span className="text-primary flex-shrink-0">
                  <Icon name="chevronRight" size={16} />
                </span>
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
                  {editingActivityId === act.id ? (
                    <div className="flex gap-1">
                      <input
                        type="text"
                        value={editingText}
                        onChange={(e) => setEditingText(e.target.value)}
                        onKeyDown={(e) => { if (e.key === 'Enter') handleSaveEditActivity(act.id); }}
                        className="flex-1 py-1 px-2 bg-bg border border-border rounded text-[11px] text-t1 outline-none focus:border-primary"
                        autoFocus
                      />
                      <button
                        onClick={() => handleSaveEditActivity(act.id)}
                        className="text-primary px-1"
                      >
                        <Icon name="check" size={12} />
                      </button>
                      <button
                        onClick={() => { setEditingActivityId(null); setEditingText(''); }}
                        className="text-t3 px-1"
                      >
                        <Icon name="close" size={12} />
                      </button>
                    </div>
                  ) : (
                    <>
                      <p className="text-[12px] font-bold text-t1">{act.title || act.type}</p>
                      {act.description && <p className="text-[11px] text-t2 mt-[1px]">{act.description}</p>}
                      {act.content && <p className="text-[11px] text-t2 mt-[1px]">{act.content}</p>}
                      <p className="text-[10px] text-t3 mt-[2px]">{formatTime(act.time)}</p>
                    </>
                  )}
                </div>
                {/* Edit / Delete buttons — 2.3.3.1+2: larger 28x28 touch targets, X icon for delete */}
                {editingActivityId !== act.id && (
                  <div className="flex items-start gap-1 flex-shrink-0 mt-[2px]">
                    <button
                      onClick={(e) => { e.stopPropagation(); handleEditActivity(act); }}
                      className="w-7 h-7 rounded flex items-center justify-center text-t3 hover:text-primary cursor-pointer"
                    >
                      <Icon name="edit" size={14} />
                    </button>
                    <button
                      onClick={(e) => { e.stopPropagation(); handleDeleteActivity(act); }}
                      className="w-7 h-7 rounded flex items-center justify-center text-t3 hover:text-red-500 cursor-pointer"
                    >
                      <Icon name="close" size={16} />
                    </button>
                  </div>
                )}
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
              <button
                onClick={handleAddNote}
                disabled={!noteText.trim()}
                className="px-3 py-2 bg-primary text-white rounded-md text-[11px] font-bold cursor-pointer disabled:opacity-30 disabled:cursor-not-allowed"
              >
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

      {/* Confirm Dialog */}
      <ConfirmDialog
        isOpen={confirmOpen}
        onClose={() => setConfirmOpen(false)}
        onConfirm={confirmConfig.onConfirm || (() => setConfirmOpen(false))}
        title={confirmConfig.title}
        message={confirmConfig.message}
        confirmLabel={confirmConfig.confirmLabel}
        cancelLabel="ยกเลิก"
        showNotes={confirmConfig.showNotes}
        requireNotes={confirmConfig.requireNotes}
        confirmColor={confirmConfig.confirmColor}
      />
    </div>
  );
}
