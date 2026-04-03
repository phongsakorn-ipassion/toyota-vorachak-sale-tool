import React, { useState, useCallback, useRef, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { useParams, useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import Icon from '../components/icons/Icon';
import ConfirmDialog from '../components/ui/ConfirmDialog';
import { CARS, COLOR_OPTIONS } from '../lib/mockData';
import { LEAD_STAGES, LEAD_CATEGORIES, TEST_DRIVE_STATUSES } from '../lib/constants';
import { SERVICE_CENTERS } from '../lib/thaiProvinces';
import { formatNumber } from '../lib/formats';
import { useLeadStore, deriveCategory } from '../stores/leadStore';
import { useBookingStore } from '../stores/bookingStore';
import { useUiStore } from '../stores/uiStore';
import { useAuthStore } from '../stores/authStore';
import { useVisibilityRefresh } from '../hooks/useVisibilityRefresh';

export default function LeadDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [, forceUpdate] = useState(0);
  useVisibilityRefresh(useCallback(() => forceUpdate(n => n + 1), []));

  // Concurrent check: capture read timestamp
  const readTimestamp = useRef(Date.now());
  useEffect(() => { readTimestamp.current = Date.now(); }, [id]);

  const role = useAuthStore((s) => s.role);
  const leads = useLeadStore((s) => s.leads); // subscribe to leads array for reactivity
  const getLeadById = useLeadStore((s) => s.getLeadById);
  const advanceStage = useLeadStore((s) => s.advanceStage);
  const changeTestDriveStatus = useLeadStore((s) => s.changeTestDriveStatus);
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
  const [showCloseDialog, setShowCloseDialog] = useState(false);
  const [showWonDialog, setShowWonDialog] = useState(false);

  // Confirm dialog state
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [confirmConfig, setConfirmConfig] = useState({});

  // Activity editing state
  const [editingActivityId, setEditingActivityId] = useState(null);
  const [editingText, setEditingText] = useState('');

  // Re-read lead from store on every render to get latest activities/stage
  const lead = getLeadById(id);

  // Update read timestamp whenever lead data changes
  useEffect(() => { if (lead) readTimestamp.current = Date.now(); }, [lead?._updatedAt]);

  if (!lead) return <div className="p-4 text-t2">Lead not found</div>;

  const isTestDrive = lead.leadType === 'test_drive';
  const car = CARS[lead.car];
  const isTerminal = lead.stage === 'close_won' || lead.stage === 'close_lost';
  const category = deriveCategory(lead);

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

  const isViewOnly = ['evaluation', 'close_won', 'close_lost'].includes(lead.stage);

  const handleEdit = () => {
    navigate(`/acard?${isViewOnly ? 'view' : 'edit'}=${lead.id}`);
  };

  const handleBook = () => {
    setShowBookingInfo(!showBookingInfo);
  };

  const handleGoToBooking = () => {
    if (lead.car) setCarId(lead.car);
    setLeadId(lead.id);
    navigate('/booking');
  };

  // --- Stage advancement (purchase leads) ---
  const handleAdvanceStage = (targetStage) => {
    if (targetStage === 'close_lost') {
      setShowCloseDialog(true);
      return;
    }
    const result = advanceStage(lead.id, targetStage, '', readTimestamp.current);
    if (result?.conflict) {
      toast((t) => (
        <div className="flex items-center gap-3">
          <span className="text-sm">{result.message}</span>
          <button onClick={() => { readTimestamp.current = Date.now(); forceUpdate(n => n + 1); toast.dismiss(t.id); }} className="text-xs px-2 py-1 bg-primary text-white rounded whitespace-nowrap">โหลดใหม่</button>
        </div>
      ), { duration: 5000, icon: '\u26A0\uFE0F' });
    } else if (result?.error) {
      toast.error(result.error);
    } else {
      toast.success(`เปลี่ยนสถานะเป็น ${LEAD_STAGES[targetStage]?.labelTh}`);
      addNotification({ title: 'เปลี่ยนสถานะ', body: `${lead.name} → ${LEAD_STAGES[targetStage]?.labelTh}`, type: 'lead_update' });
      readTimestamp.current = Date.now();
    }
  };

  // --- Close Won with optional note ---
  const handleCloseWon = (note) => {
    const result = advanceStage(lead.id, 'close_won', note || '', readTimestamp.current);
    if (result?.conflict) {
      toast((t) => (
        <div className="flex items-center gap-3">
          <span className="text-sm">{result.message}</span>
          <button onClick={() => { readTimestamp.current = Date.now(); forceUpdate(n => n + 1); toast.dismiss(t.id); }} className="text-xs px-2 py-1 bg-primary text-white rounded whitespace-nowrap">โหลดใหม่</button>
        </div>
      ), { duration: 5000, icon: '\u26A0\uFE0F' });
    } else if (result?.error) {
      toast.error(result.error);
    } else {
      toast.success('ปิดการขายสำเร็จ!');
      addNotification({ title: 'ปิดการขายสำเร็จ', body: `${lead.name} → Won`, type: 'lead_update' });
      readTimestamp.current = Date.now();
    }
    setShowWonDialog(false);
  };

  // --- Close Lost with required note ---
  const handleCloseLost = (note) => {
    const result = advanceStage(lead.id, 'close_lost', note, readTimestamp.current);
    if (result?.conflict) {
      toast((t) => (
        <div className="flex items-center gap-3">
          <span className="text-sm">{result.message}</span>
          <button onClick={() => { readTimestamp.current = Date.now(); forceUpdate(n => n + 1); toast.dismiss(t.id); }} className="text-xs px-2 py-1 bg-primary text-white rounded whitespace-nowrap">โหลดใหม่</button>
        </div>
      ), { duration: 5000, icon: '\u26A0\uFE0F' });
    } else if (result?.error) {
      toast.error(result.error);
    } else {
      toast.success('เปลี่ยนสถานะเป็น Lost');
      addNotification({ title: 'เปลี่ยนสถานะ', body: `${lead.name} → สูญเสีย`, type: 'lead_update' });
      readTimestamp.current = Date.now();
    }
    setShowCloseDialog(false);
  };

  // --- Test drive status changes ---
  const handleTestDriveStatusChange = (newStatus) => {
    const statusLabel = TEST_DRIVE_STATUSES[newStatus]?.label || newStatus;
    setConfirmConfig({
      title: 'ยืนยันเปลี่ยนสถานะ',
      message: `เปลี่ยนสถานะเป็น "${statusLabel}"`,
      showNotes: true,
      requireNotes: newStatus === 'cancelled',
      confirmLabel: `ยืนยัน ${statusLabel}`,
      confirmColor: TEST_DRIVE_STATUSES[newStatus]?.color || '#2563EB',
      onConfirm: (note) => {
        const result = changeTestDriveStatus(lead.id, newStatus, note || '', readTimestamp.current);
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
        addNotification({ title: 'เปลี่ยนสถานะทดลองขับ', body: `${lead.name} — ${statusLabel}`, type: 'info' });
        toast.success('เปลี่ยนสถานะแล้ว');
        readTimestamp.current = Date.now();
        setConfirmOpen(false);
      },
    });
    setConfirmOpen(true);
  };

  // Promote test drive to Proposal
  const handlePromoteToProposal = () => {
    const result = advanceStage(lead.id, 'proposal', 'เลื่อนจากทดลองขับ', readTimestamp.current);
    if (result?.conflict) {
      toast.error(result.message);
    } else if (result?.error) {
      toast.error(result.error);
    } else {
      toast.success('เลื่อนเป็น Proposal แล้ว');
      addNotification({ title: 'เลื่อนสถานะ', body: `${lead.name} → เสนอราคา`, type: 'lead_update' });
      readTimestamp.current = Date.now();
    }
  };

  const handleAddNote = () => {
    if (!noteText.trim()) return;
    addActivity(lead.id, { type: 'note', title: 'บันทึก', description: noteText.trim() });
    toast.success('บันทึกเรียบร้อย');
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
      toast.success('แก้ไขเรียบร้อย');
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
        toast.success('ลบเรียบร้อย');
        setConfirmOpen(false);
      },
    });
    setConfirmOpen(true);
  };

  // Sort activities by time, newest first
  const activities = (lead.activities || []).slice().sort((a, b) => new Date(b.time || b.createdAt) - new Date(a.time || a.createdAt));

  const activityIcon = (type) => {
    switch (type) {
      case 'call': return 'phone';
      case 'line': return 'chat';
      case 'note': return 'edit';
      case 'booking': return 'book';
      case 'won': case 'stage_change': return 'trophy';
      case 'lost': return 'flag';
      case 'test_drive_status': return 'steering';
      case 'status_change': return 'check';
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

  return (
    <div className="screen-enter flex flex-col h-full">
      <div className="bg-white px-4 py-[13px] flex items-center gap-[11px] border-b border-border flex-shrink-0">
        <button onClick={() => navigate(-1)} className="w-9 h-9 rounded-full flex items-center justify-center bg-bg border border-border text-t1 cursor-pointer"><Icon name="back" size={18} /></button>
        <div className="flex-1"><h2 className="text-[15px] font-extrabold text-t1">{lead.name}</h2><p className="text-[11px] text-t2 mt-[1px]">{isTestDrive ? 'Test Drive Profile' : 'Customer Profile'}</p></div>
        <span className="text-t2 cursor-pointer"><Icon name="more" size={20} /></span>
      </div>

      <div className="flex-1 overflow-y-auto pb-24" style={{ WebkitOverflowScrolling: 'touch' }}>
        {/* Hero */}
        <div className="bg-white px-4 py-[18px] border-b border-border flex items-center gap-[14px]">
          <div className="w-[52px] h-[52px] rounded-full flex items-center justify-center text-[20px] font-extrabold text-white flex-shrink-0" style={{ background: lead.color }}>{lead.init}</div>
          <div className="flex-1">
            <p className="text-[17px] font-extrabold text-t1">{lead.name}</p>
            <p className="text-[12px] text-t2 flex items-center gap-1 mt-[2px]">
              <Icon name={isTestDrive ? 'steering' : 'walk'} size={12} /> {isTestDrive ? 'ทดลองขับ' : lead.source}
            </p>
          </div>
          <div className="flex flex-col items-end gap-1">
            {isTestDrive ? (
              <span className="px-3 py-1 rounded-full text-[10px] font-bold" style={{ backgroundColor: TEST_DRIVE_STATUSES[lead.testDriveStatus]?.bg, color: TEST_DRIVE_STATUSES[lead.testDriveStatus]?.color }}>
                {TEST_DRIVE_STATUSES[lead.testDriveStatus]?.label || lead.testDriveStatus}
              </span>
            ) : (
              <>
                <span className={`badge-${lead.stage}`}>{LEAD_STAGES[lead.stage]?.labelTh || lead.stage}</span>
                {category && <span className={`badge-${category} text-[9px]`}>{LEAD_CATEGORIES[category]?.label}</span>}
              </>
            )}
          </div>
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
            {!isTestDrive && lead.email && (
              <div className="flex items-center gap-2 text-[12px]">
                <span className="text-t3 w-10">อีเมล</span>
                <span className="text-t1">{lead.email}</span>
              </div>
            )}
            {!isTestDrive && lead.lineId && (
              <div className="flex items-center gap-2 text-[12px]">
                <span className="text-t3 w-10">LINE</span>
                <span className="text-t1">{lead.lineId}</span>
              </div>
            )}
          </div>
        </div>

        {/* Salesperson in charge — visible to manager only */}
        {role === 'mgr' && <div className="bg-white px-4 py-3 border-b border-border">
          <div className="text-[11px] font-bold text-t3 mb-2">พนักงานขายที่ดูแล</div>
          <div className="grid grid-cols-1 gap-2">
            <div className="flex items-center gap-2 text-[12px]">
              <span className="text-t3 w-10">ชื่อ</span>
              <span className="text-t1 font-bold">มาลี รักดี</span>
            </div>
            <div className="flex items-center gap-2 text-[12px]">
              <span className="text-t3 w-10">โทร</span>
              <a href="tel:081-234-5678" className="text-primary font-bold">081-234-5678</a>
            </div>
            <div className="flex items-center gap-2 text-[12px]">
              <span className="text-t3 w-10">อีเมล</span>
              <span className="text-t1">malee@vorachak.co.th</span>
            </div>
          </div>
        </div>}

        {/* Status management section — different for test drive vs purchase */}
        {isTestDrive ? (
          lead.stage !== 'new_lead' ? (
            /* Test drive lead has been promoted — show purchase pipeline stepper */
            <div className="bg-white px-4 py-3 border-b border-border">
              <div className="flex items-center justify-between mb-3">
                {['new_lead', 'proposal', 'evaluation', 'close_won'].map((s, i, arr) => (
                  <React.Fragment key={s}>
                    <div className={`flex flex-col items-center ${lead.stage === s || (s === 'close_won' && lead.stage === 'close_lost') ? 'text-primary' : (LEAD_STAGES[lead.stage]?.order || 0) >= (LEAD_STAGES[s]?.order || 0) ? 'text-primary' : 'text-t3'}`}>
                      <div className={`w-7 h-7 rounded-full flex items-center justify-center text-[11px] font-bold ${(LEAD_STAGES[lead.stage]?.order || 0) >= (LEAD_STAGES[s]?.order || 0) ? 'bg-primary text-white' : 'bg-gray-100 text-t3'}`}>
                        {(LEAD_STAGES[lead.stage]?.order || 0) > (LEAD_STAGES[s]?.order || 0) ? '\u2713' : i + 1}
                      </div>
                      <span className="text-[9px] font-bold mt-1">{LEAD_STAGES[s]?.labelTh}</span>
                    </div>
                    {i < arr.length - 1 && <div className={`flex-1 h-[2px] mx-1 mb-4 ${(LEAD_STAGES[lead.stage]?.order || 0) > (LEAD_STAGES[s]?.order || 0) ? 'bg-primary' : 'bg-gray-200'}`} />}
                  </React.Fragment>
                ))}
              </div>

              {lead.stage === 'proposal' && (
                <div className="flex gap-2">
                  <button onClick={handleGoToBooking} className="flex-1 py-2.5 bg-primary text-white rounded-lg text-[12px] font-bold cursor-pointer">
                    จองรถ (Evaluation)
                  </button>
                </div>
              )}
              {lead.stage === 'evaluation' && (
                <div className="flex gap-2">
                  <button onClick={() => setShowWonDialog(true)} className="flex-1 py-2.5 border-2 border-green-500 text-green-600 bg-white rounded-lg text-[12px] font-bold cursor-pointer active:opacity-70">
                    ปิดการขายสำเร็จ (Won)
                  </button>
                  <button onClick={() => setShowCloseDialog(true)} className="flex-1 py-2.5 border-2 border-gray-400 text-gray-500 bg-white rounded-lg text-[12px] font-bold cursor-pointer active:opacity-70">
                    ปิดไม่สำเร็จ (Lost)
                  </button>
                </div>
              )}
              {(lead.stage === 'close_won' || lead.stage === 'close_lost') && (
                <div className="text-center">
                  <span className={`badge-${lead.stage}`}>{LEAD_STAGES[lead.stage]?.labelTh} (ถาวร)</span>
                </div>
              )}
            </div>
          ) : (
            /* Test drive lead still at new_lead — show TD status management */
            <div className="bg-white px-4 py-3 border-b border-border">
              {lead.testDriveStatus === 'scheduled' && (
                <div className="flex gap-2">
                  <button onClick={() => handleTestDriveStatusChange('completed')} className="flex-1 py-2.5 rounded-lg text-[12px] font-bold text-center cursor-pointer bg-emerald-50 text-emerald-600 border border-emerald-200 active:opacity-70">
                    เสร็จสิ้น
                  </button>
                  <button onClick={() => handleTestDriveStatusChange('cancelled')} className="flex-1 py-2.5 rounded-lg text-[12px] font-bold text-center cursor-pointer bg-red-50 text-red-500 border border-red-200 active:opacity-70">
                    ยกเลิก
                  </button>
                </div>
              )}
              {lead.testDriveStatus === 'completed' && lead.stage === 'new_lead' && (
                <button onClick={handlePromoteToProposal} className="w-full py-2.5 rounded-lg text-[12px] font-bold text-center cursor-pointer bg-purple-500 text-white active:opacity-70">
                  <span className="flex items-center justify-center gap-1"><Icon name="users" size={14} /> เลื่อนเป็น Proposal</span>
                </button>
              )}
              {lead.testDriveStatus === 'cancelled' && (
                <div className="text-center py-1">
                  <span className="px-3 py-1 rounded-full text-[11px] font-bold" style={{ backgroundColor: TEST_DRIVE_STATUSES.cancelled?.bg, color: TEST_DRIVE_STATUSES.cancelled?.color }}>
                    ยกเลิก (ถาวร)
                  </span>
                </div>
              )}
            </div>
          )
        ) : (
          /* Purchase lead — Stage Progress Stepper */
          <div className="bg-white px-4 py-3 border-b border-border">
            <div className="flex items-center justify-between mb-3">
              {['new_lead', 'proposal', 'evaluation', 'close_won'].map((s, i, arr) => (
                <React.Fragment key={s}>
                  <div className={`flex flex-col items-center ${lead.stage === s || (s === 'close_won' && lead.stage === 'close_lost') ? 'text-primary' : (LEAD_STAGES[lead.stage]?.order || 0) >= (LEAD_STAGES[s]?.order || 0) ? 'text-primary' : 'text-t3'}`}>
                    <div className={`w-7 h-7 rounded-full flex items-center justify-center text-[11px] font-bold ${(LEAD_STAGES[lead.stage]?.order || 0) >= (LEAD_STAGES[s]?.order || 0) ? 'bg-primary text-white' : 'bg-gray-100 text-t3'}`}>
                      {(LEAD_STAGES[lead.stage]?.order || 0) > (LEAD_STAGES[s]?.order || 0) ? '\u2713' : i + 1}
                    </div>
                    <span className="text-[9px] font-bold mt-1">{LEAD_STAGES[s]?.labelTh}</span>
                  </div>
                  {i < arr.length - 1 && <div className={`flex-1 h-[2px] mx-1 mb-4 ${(LEAD_STAGES[lead.stage]?.order || 0) > (LEAD_STAGES[s]?.order || 0) ? 'bg-primary' : 'bg-gray-200'}`} />}
                </React.Fragment>
              ))}
            </div>

            {/* Action buttons based on current stage */}
            {lead.stage === 'new_lead' && (
              <button onClick={() => handleAdvanceStage('proposal')} className="w-full py-2.5 bg-purple-500 text-white rounded-lg text-[12px] font-bold cursor-pointer">
                เสนอราคา (Proposal)
              </button>
            )}
            {lead.stage === 'proposal' && (
              <div className="flex gap-2">
                <button onClick={handleGoToBooking} className="flex-1 py-2.5 bg-primary text-white rounded-lg text-[12px] font-bold cursor-pointer">
                  จองรถ (Evaluation)
                </button>
              </div>
            )}
            {lead.stage === 'evaluation' && (
              <div className="flex gap-2">
                <button onClick={() => setShowWonDialog(true)} className="flex-1 py-2.5 border-2 border-green-500 text-green-600 bg-white rounded-lg text-[12px] font-bold cursor-pointer active:opacity-70">
                  ปิดการขายสำเร็จ (Won)
                </button>
                <button onClick={() => setShowCloseDialog(true)} className="flex-1 py-2.5 border-2 border-gray-400 text-gray-500 bg-white rounded-lg text-[12px] font-bold cursor-pointer active:opacity-70">
                  ปิดไม่สำเร็จ (Lost)
                </button>
              </div>
            )}
            {(lead.stage === 'close_won' || lead.stage === 'close_lost') && (
              <div className="text-center">
                <span className={`badge-${lead.stage}`}>{LEAD_STAGES[lead.stage]?.labelTh} (ถาวร)</span>
              </div>
            )}
          </div>
        )}

        {/* Status Change Notes */}
        {lead.activities?.filter(a => a.type === 'stage_change' || a.type === 'test_drive_status' || a.type === 'status_change' || a.type === 'won' || a.type === 'lost').length > 0 && (
          <div className="px-4 pt-3">
            <div className="card-base">
              <div className="card-hd"><span className="card-title">บันทึกการเปลี่ยนสถานะ</span></div>
              {lead.activities.filter(a => a.type === 'stage_change' || a.type === 'test_drive_status' || a.type === 'status_change' || a.type === 'won' || a.type === 'lost').map(a => (
                <div key={a.id} className="py-2 border-b border-gray-100 last:border-b-0">
                  <p className="text-[11px] text-t3">{a.title}</p>
                  {a.description && <p className="text-[12px] text-t1 mt-1">{a.description}</p>}
                </div>
              ))}
            </div>
          </div>
        )}

        <div className="px-4 pt-4">
          {/* Test drive info card */}
          {isTestDrive && (lead.testDriveDate || lead.testDriveTime || lead.serviceCenter) && (
            <div className="card-base">
              <div className="card-hd"><span className="card-title flex items-center gap-2"><Icon name="steering" size={14} /> ข้อมูลทดลองขับ</span></div>
              <div className="grid grid-cols-1 gap-2">
                {lead.testDriveDate && (
                  <div className="flex items-center justify-between text-[12px]">
                    <span className="text-t3 flex items-center gap-1"><Icon name="calendar" size={12} /> วันที่</span>
                    <span className="text-t1 font-bold">{formatThaiDate(lead.testDriveDate)}</span>
                  </div>
                )}
                {lead.testDriveTime && (
                  <div className="flex items-center justify-between text-[12px]">
                    <span className="text-t3 flex items-center gap-1"><Icon name="clock" size={12} /> เวลา</span>
                    <span className="text-t1 font-bold">{lead.testDriveTime} น.</span>
                  </div>
                )}
                {lead.serviceCenter && (
                  <div className="flex items-center justify-between text-[12px]">
                    <span className="text-t3 flex items-center gap-1"><Icon name="location" size={12} /> ศูนย์บริการ</span>
                    <span className="text-t1 font-bold">{SERVICE_CENTERS.find(c => c.id === lead.serviceCenter)?.name || lead.serviceCenter || '-'}</span>
                  </div>
                )}
                {lead.notes && (
                  <div className="flex items-start justify-between text-[12px] pt-1 border-t border-border mt-1">
                    <span className="text-t3 flex items-center gap-1"><Icon name="edit" size={12} /> หมายเหตุ</span>
                    <span className="text-t1 text-right max-w-[60%]">{lead.notes}</span>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Quick Actions */}
          {isTestDrive ? (
            /* Test drive: only call + LINE */
            <div className="grid grid-cols-2 gap-2 mb-[14px]">
              {[
                { icon: 'phone', label: 'โทร', action: handleCall },
                { icon: 'chat', label: 'LINE', action: handleLine },
              ].map(a => (
                <button key={a.label} onClick={a.action} className="flex flex-col items-center gap-1 p-3 bg-white border border-border rounded-md cursor-pointer active:opacity-70 transition-opacity">
                  <span className="text-primary"><Icon name={a.icon} size={18} /></span>
                  <span className="text-[10px] font-bold text-t2">{a.label}</span>
                </button>
              ))}
            </div>
          ) : (
            /* Purchase: โทร / LINE / จอง / แก้ไข */
            <div className="grid grid-cols-4 gap-2 mb-[14px]">
              {[
                { icon: 'phone', label: 'โทร', action: handleCall },
                { icon: 'chat', label: 'LINE', action: handleLine },
                { icon: 'book', label: 'จอง', action: handleBook },
                { icon: isViewOnly ? 'search' : 'edit', label: isViewOnly ? 'ดูข้อมูล' : 'แก้ไข', action: handleEdit },
              ].map(a => (
                <button key={a.label} onClick={a.action} className="flex flex-col items-center gap-1 p-3 bg-white border border-border rounded-md cursor-pointer active:opacity-70 transition-opacity">
                  <span className="text-primary"><Icon name={a.icon} size={18} /></span>
                  <span className="text-[10px] font-bold text-t2">{a.label}</span>
                </button>
              ))}
            </div>
          )}

          {/* Booking Info Section (purchase leads only) */}
          {!isTestDrive && showBookingInfo && (
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
                  {showShareModal && createPortal(
                    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-[200] p-4" onClick={() => setShowShareModal(false)}>
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
                          className="w-full py-2.5 border border-primary text-primary rounded-md text-[12px] font-bold cursor-pointer mb-2"
                        >
                          <span className="flex items-center justify-center gap-1"><Icon name="clip" size={14} /> คัดลอกลิงก์</span>
                        </button>
                        <button
                          onClick={async () => {
                            if (navigator.share) {
                              try {
                                await navigator.share({ title: 'Toyota Booking', text: `รายละเอียดการจอง ${bookingRef}`, url: shareUrl });
                              } catch (e) { if (e.name !== 'AbortError') toast.error('ไม่สามารถแชร์ได้'); }
                            } else {
                              navigator.clipboard.writeText(shareUrl).then(() => toast.success('คัดลอกลิงก์แล้ว'));
                            }
                          }}
                          className="w-full py-2.5 bg-primary text-white rounded-md text-[12px] font-bold cursor-pointer"
                        >
                          <span className="flex items-center justify-center gap-1"><Icon name="share" size={14} /> แชร์ลิงก์</span>
                        </button>
                      </div>
                    </div>,
                    document.body
                  )}
                </div>
                );
              })() : (
                <div className="text-center py-4">
                  <p className="text-[12px] text-t3 mb-3">ยังไม่มีข้อมูลการจอง</p>
                  <button
                    onClick={handleGoToBooking}
                    className="px-4 py-2 bg-primary text-white rounded-md text-[12px] font-bold cursor-pointer"
                  >
                    สร้างการจอง
                  </button>
                </div>
              )}
            </div>
          )}

          {/* Car Interest */}
          <div className="card-base">
            <div className="card-hd"><span className="card-title">รุ่นรถที่สนใจ</span></div>
            {car && (
              <div onClick={() => navigate(`/car/${car.id}?readonly=true${lead.selectedColor ? `&color=${encodeURIComponent(lead.selectedColor)}` : ''}`)} className="flex items-center gap-3 p-3 bg-white rounded-lg border border-border cursor-pointer active:opacity-70">
                <div className="w-[80px] h-[64px] rounded-md border border-border flex items-center justify-center flex-shrink-0 overflow-hidden p-1" style={{ background: car.bg }}>
                  <img src={car.img} alt={car.name} className="w-full h-full object-cover" onError={(e) => { e.target.style.display = 'none'; e.target.parentElement.innerHTML = '<div class="flex items-center justify-center w-full h-full text-t3"><svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M5 17h1m12 0h1M6 17H3V12l2.5-5h13L21 12v5h-3M6 17a2 2 0 104 0m4 0a2 2 0 104 0"/></svg></div>'; }} />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-[14px] font-extrabold text-t1">{car.name}{lead.selectedGrade && <span className="text-[10px] text-t3"> · {car?.subModels?.find(g => g.id === lead.selectedGrade)?.name || lead.selectedGrade}</span>}</p>
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
                      <p className="text-[10px] text-t3 mt-[2px]">{formatTime(act.time || act.createdAt)}</p>
                    </>
                  )}
                </div>
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
            <div className="flex gap-2 mt-3 pt-3">
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

          {/* Notes (purchase leads only — test drive notes shown in drive info card) */}
          {!isTestDrive && (
            <div className="card-base">
              <div className="card-hd"><span className="card-title">หมายเหตุ</span></div>
              <p className="text-[12px] text-t2 leading-relaxed">
                {lead.notes || (`ลูกค้าสนใจ ${car?.name || ''} สี Pearl White ต้องการดาวน์ 20% ผ่อน 60 เดือน ใช้ Toyota Leasing`)}
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Close Won Dialog */}
      <ConfirmDialog
        isOpen={showWonDialog}
        onClose={() => setShowWonDialog(false)}
        onConfirm={(note) => handleCloseWon(note)}
        title="ปิดการขายสำเร็จ"
        message="ยืนยันปิดการขายสำเร็จ?"
        confirmLabel="ยืนยัน Won"
        cancelLabel="ยกเลิก"
        showNotes={true}
        requireNotes={false}
        confirmColor="#22C55E"
      />

      {/* Close Lost Dialog */}
      <ConfirmDialog
        isOpen={showCloseDialog}
        onClose={() => setShowCloseDialog(false)}
        onConfirm={(note) => handleCloseLost(note)}
        title="ยืนยันปิดไม่สำเร็จ"
        message="เมื่อเปลี่ยนเป็น Lost จะไม่สามารถเปลี่ยนกลับได้"
        confirmLabel="ยืนยัน Lost"
        cancelLabel="ยกเลิก"
        showNotes={true}
        requireNotes={true}
        confirmColor="#6B7280"
      />

      {/* General Confirm Dialog */}
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
