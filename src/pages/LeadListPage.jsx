import React, { useState, useCallback } from 'react';
import { createPortal } from 'react-dom';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import PageHeader from '../components/layout/PageHeader';
import Icon from '../components/icons/Icon';
import { useLeadStore, deriveCategory } from '../stores/leadStore';
import { CARS } from '../lib/mockData';
import { LEAD_STAGES, LEAD_CATEGORIES, TEST_DRIVE_STATUSES } from '../lib/constants';
import { useVisibilityRefresh } from '../hooks/useVisibilityRefresh';

const PURCHASE_FILTERS = [
  { key: 'all', label: 'ทั้งหมด' },
  { key: 'new_lead', label: 'ลีดใหม่' },
  { key: 'proposal', label: 'เสนอราคา' },
  { key: 'evaluation', label: 'ประเมิน' },
  { key: 'close_won', label: 'Won' },
  { key: 'close_lost', label: 'Lost' },
];

const TD_FILTERS = [
  { key: 'all', label: 'ทั้งหมด' },
  { key: 'scheduled', label: 'นัดหมาย' },
  { key: 'completed', label: 'เสร็จสิ้น' },
  { key: 'cancelled', label: 'ยกเลิก' },
];

const AVATAR_COLORS = ['#DC2626', '#8B5CF6', '#F59E0B', '#10B981', '#3B82F6', '#EC4899'];

function getAvatarColor(name) {
  if (!name) return AVATAR_COLORS[0];
  let hash = 0;
  for (let i = 0; i < name.length; i++) {
    hash = name.charCodeAt(i) + ((hash << 5) - hash);
  }
  return AVATAR_COLORS[Math.abs(hash) % AVATAR_COLORS.length];
}

export default function LeadListPage() {
  const [, forceUpdate] = useState(0);
  useVisibilityRefresh(useCallback(() => forceUpdate(n => n + 1), []));

  const navigate = useNavigate();
  const filterStage = useLeadStore((s) => s.filterStage);
  const setFilterStage = useLeadStore((s) => s.setFilterStage);
  const filterType = useLeadStore((s) => s.filterType);
  const setFilterType = useLeadStore((s) => s.setFilterType);
  const searchTerm = useLeadStore((s) => s.searchTerm);
  const setSearch = useLeadStore((s) => s.setSearch);
  const getFilteredLeads = useLeadStore((s) => s.getFilteredLeads);
  const addActivity = useLeadStore((s) => s.addActivity);
  const allLeads = useLeadStore((s) => s.leads);

  const leads = getFilteredLeads();

  // Counts for type toggle
  const purchaseCount = allLeads.filter(l => (l.leadType || 'purchase') === 'purchase').length;
  const testDriveCount = allLeads.filter(l => l.leadType === 'test_drive').length;

  // Type selector popup state
  const [showTypePopup, setShowTypePopup] = useState(false);

  const handleCall = (e, lead) => {
    e.stopPropagation();
    window.location.href = 'tel:' + lead.phone;
    addActivity(lead.id, { type: 'call', title: 'โทรหาลูกค้า', description: 'โทรติดตาม ' + lead.name });
    toast.success('บันทึกกิจกรรมแล้ว');
  };

  const handleLine = (e, lead) => {
    e.stopPropagation();
    window.open('https://line.me/R/', '_blank');
    addActivity(lead.id, { type: 'line', title: 'ส่ง LINE', description: 'ส่งข้อความ LINE ถึง ' + lead.name });
    toast.success('บันทึกกิจกรรมแล้ว');
  };

  const handleTypeSwitch = (type) => {
    setFilterType(type);
    setFilterStage('all');
  };

  const filterOptions = filterType === 'test_drive' ? TD_FILTERS : PURCHASE_FILTERS;

  return (
    <div className="screen-enter flex flex-col h-full">
      <PageHeader
        title="Lead ทั้งหมด"
        rightAction={
          <button
            onClick={() => setShowTypePopup(true)}
            className="w-8 h-8 rounded-full bg-primary flex items-center justify-center cursor-pointer"
          >
            <Icon name="plus" size={16} className="text-white" />
          </button>
        }
      />

      {/* Type toggle tabs */}
      <div className="px-4 pt-3 pb-1">
        <div className="flex gap-2 mb-3">
          <button onClick={() => handleTypeSwitch('purchase')} className={`flex-1 py-2 rounded-lg text-[12px] font-bold text-center cursor-pointer transition-all ${filterType === 'purchase' ? 'bg-primary text-white' : 'bg-white border border-border text-t2'}`}>
            ลูกค้า ({purchaseCount})
          </button>
          <button onClick={() => handleTypeSwitch('test_drive')} className={`flex-1 py-2 rounded-lg text-[12px] font-bold text-center cursor-pointer transition-all ${filterType === 'test_drive' ? 'bg-primary text-white' : 'bg-white border border-border text-t2'}`}>
            ทดลองขับ ({testDriveCount})
          </button>
        </div>

        {/* Search bar */}
        <div className="relative">
          <div className="absolute left-3 top-1/2 -translate-y-1/2 text-t3">
            <Icon name="search" size={16} />
          </div>
          <input
            type="text"
            placeholder="ค้นหาชื่อ, เบอร์โทร, อีเมล..."
            value={searchTerm}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-3 py-2.5 bg-bg border border-border rounded-xl text-sm text-t1 placeholder:text-t3 focus:outline-none focus:border-primary"
            style={{ fontFamily: "'Sarabun', sans-serif" }}
          />
          {searchTerm && (
            <button
              onClick={() => setSearch('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-t3"
            >
              <Icon name="close" size={14} />
            </button>
          )}
        </div>
      </div>

      {/* Filter pills */}
      <div className="flex gap-2 px-4 py-2.5 overflow-x-auto" style={{ scrollbarWidth: 'none' }}>
        {filterOptions.map((opt) => (
          <button
            key={opt.key}
            onClick={() => setFilterStage(opt.key)}
            className={`pill-filter whitespace-nowrap ${filterStage === opt.key ? 'on' : ''}`}
          >
            {opt.label}
          </button>
        ))}
      </div>

      {/* Lead list */}
      <div className="flex-1 overflow-y-auto px-4 pb-24">
        {leads.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 text-center">
            <div className="w-14 h-14 rounded-full bg-gray-100 flex items-center justify-center mb-3">
              <Icon name={filterType === 'test_drive' ? 'steering' : 'users'} size={28} className="text-t3" />
            </div>
            <p className="text-sm font-bold text-t2">ไม่พบลีด</p>
            <p className="text-xs text-t3 mt-1">ลองเปลี่ยนตัวกรองหรือค้นหาใหม่</p>
          </div>
        ) : (
          <div className="flex flex-col gap-2">
            {leads.map((lead) => {
              const isTestDrive = lead.leadType === 'test_drive';
              const color = lead.color || getAvatarColor(lead.name);
              const initial = lead.init || lead.name?.charAt(0) || '?';
              const carName = lead.car ? (CARS[lead.car]?.name || lead.car) : '';
              const hasNotes = lead.activities?.some(a => a.type === 'note');

              if (isTestDrive) {
                // Test drive card layout
                const tdStatus = TEST_DRIVE_STATUSES[lead.testDriveStatus] || TEST_DRIVE_STATUSES.scheduled;
                return (
                  <button
                    key={lead.id}
                    onClick={() => navigate(`/lead/${lead.id}`)}
                    className="card-base flex items-center gap-3 cursor-pointer hover:shadow-sm transition-shadow text-left"
                    style={{ marginBottom: 0 }}
                  >
                    {/* Avatar */}
                    <div
                      className="w-10 h-10 rounded-full flex items-center justify-center text-white text-sm font-bold shrink-0"
                      style={{ backgroundColor: color }}
                    >
                      {initial}
                    </div>

                    {/* Info */}
                    <div className="flex-1 min-w-0">
                      <span className="text-sm font-bold text-t1 truncate flex items-center gap-1">
                        {lead.name}
                      </span>
                      <div className="flex items-center gap-1.5 mt-0.5">
                        {carName && (
                          <span className="text-xs text-t3 truncate">
                            <Icon name="car" size={11} className="inline mr-0.5 -mt-px" />
                            {carName}{lead.selectedGrade && CARS[lead.car]?.subModels &&
                              <span className="text-t3"> · {CARS[lead.car].subModels.find(g => g.id === lead.selectedGrade)?.name || ''}</span>
                            }
                          </span>
                        )}
                      </div>
                      {(lead.testDriveDate || lead.testDriveTime) && (
                        <div className="flex items-center gap-1 mt-0.5">
                          <Icon name="calendar" size={10} className="text-t3" />
                          <span className="text-[10px] text-t3">
                            {lead.testDriveDate && new Date(lead.testDriveDate).toLocaleDateString('th-TH', { day: 'numeric', month: 'short' })}
                            {lead.testDriveTime && ` ${lead.testDriveTime}`}
                          </span>
                          {lead.serviceCenter && (
                            <span className="text-[10px] text-t3 ml-1 truncate">
                              <Icon name="location" size={10} className="inline -mt-px" /> {lead.serviceCenter}
                            </span>
                          )}
                        </div>
                      )}
                    </div>

                    {/* Status badge + quick actions */}
                    <div className="flex items-center gap-1.5 shrink-0">
                      <span className={`badge-${lead.testDriveStatus || 'scheduled'}`}>
                        {tdStatus.label}
                      </span>
                      <span
                        onClick={(e) => handleCall(e, lead)}
                        className="w-7 h-7 rounded-full flex items-center justify-center bg-green-50 text-green-600 active:opacity-60 cursor-pointer"
                      >
                        <Icon name="phone" size={12} />
                      </span>
                      <span
                        onClick={(e) => handleLine(e, lead)}
                        className="w-7 h-7 rounded-full flex items-center justify-center bg-emerald-50 text-emerald-600 active:opacity-60 cursor-pointer"
                      >
                        <Icon name="chat" size={12} />
                      </span>
                    </div>
                  </button>
                );
              }

              // Purchase lead card
              const category = deriveCategory(lead);
              const stageInfo = LEAD_STAGES[lead.stage] || LEAD_STAGES.new_lead;
              return (
                <button
                  key={lead.id}
                  onClick={() => navigate(`/lead/${lead.id}`)}
                  className="card-base flex items-center gap-3 cursor-pointer hover:shadow-sm transition-shadow text-left"
                  style={{ marginBottom: 0 }}
                >
                  {/* Avatar */}
                  <div
                    className="w-10 h-10 rounded-full flex items-center justify-center text-white text-sm font-bold shrink-0"
                    style={{ backgroundColor: color }}
                  >
                    {initial}
                  </div>

                  {/* Info */}
                  <div className="flex-1 min-w-0">
                    <span className="text-sm font-bold text-t1 truncate flex items-center gap-1">
                      {lead.name}
                      {hasNotes && (
                        <span
                          className="text-primary"
                          onClick={(e) => { e.stopPropagation(); navigate(`/lead/${lead.id}`); }}
                        >
                          <Icon name="document" size={12} />
                        </span>
                      )}
                    </span>
                    <div className="flex items-center mt-0.5">
                      <span className="text-xs text-t3 truncate">
                        {carName && (
                          <>
                            <Icon name="car" size={11} className="inline mr-0.5 -mt-px" />
                            {carName}{lead.selectedGrade && CARS[lead.car]?.subModels &&
                              <span className="text-t3"> · {CARS[lead.car].subModels.find(g => g.id === lead.selectedGrade)?.name || ''}</span>
                            }
                          </>
                        )}
                        {!carName && lead.source && lead.source}
                      </span>
                      {lead.createdAt && (
                        <span className="text-[10px] text-t3 shrink-0 ml-2">
                          {new Date(lead.createdAt).toLocaleDateString('th-TH', { day: 'numeric', month: 'short' })}
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Badge + Quick action buttons in same row */}
                  <div className="flex items-center gap-1.5 shrink-0">
                    <div className="flex flex-col items-end gap-0.5">
                      <span className={`badge-${lead.stage}`}>
                        {stageInfo.labelTh}
                      </span>
                      {category && (
                        <span className={`badge-${category} text-[9px]`}>
                          {LEAD_CATEGORIES[category]?.label}
                        </span>
                      )}
                    </div>
                    <span
                      onClick={(e) => handleCall(e, lead)}
                      className="w-7 h-7 rounded-full flex items-center justify-center bg-green-50 text-green-600 active:opacity-60 cursor-pointer"
                    >
                      <Icon name="phone" size={12} />
                    </span>
                    <span
                      onClick={(e) => handleLine(e, lead)}
                      className="w-7 h-7 rounded-full flex items-center justify-center bg-emerald-50 text-emerald-600 active:opacity-60 cursor-pointer"
                    >
                      <Icon name="chat" size={12} />
                    </span>
                  </div>
                </button>
              );
            })}
          </div>
        )}
      </div>

      {/* Type selector popup */}
      {showTypePopup && createPortal(
        <div className="fixed inset-0 bg-black/50 z-[200] flex items-center justify-center p-4" onClick={() => setShowTypePopup(false)}>
          <div className="bg-white rounded-2xl p-5 max-w-sm w-full" onClick={(e) => e.stopPropagation()}>
            <h3 className="text-[15px] font-extrabold text-t1 mb-4">เลือกประเภท</h3>
            <div className="flex flex-col gap-3">
              <button
                onClick={() => { setShowTypePopup(false); navigate('/acard?type=purchase'); }}
                className="flex items-center gap-3 p-4 rounded-lg border border-border bg-white hover:bg-green-50 cursor-pointer transition-colors"
              >
                <span className="w-10 h-10 rounded-full bg-primary-light flex items-center justify-center text-primary"><Icon name="users" size={20} /></span>
                <div className="text-left">
                  <p className="text-[13px] font-bold text-t1">ลงทะเบียนลูกค้า</p>
                  <p className="text-[11px] text-t3">เพิ่ม Lead ใหม่เข้าระบบ</p>
                </div>
              </button>
              <button
                onClick={() => { setShowTypePopup(false); navigate('/acard?type=test_drive'); }}
                className="flex items-center gap-3 p-4 rounded-lg border border-border bg-white hover:bg-blue-50 cursor-pointer transition-colors"
              >
                <span className="w-10 h-10 rounded-full bg-blue-50 flex items-center justify-center text-blue-600"><Icon name="steering" size={20} /></span>
                <div className="text-left">
                  <p className="text-[13px] font-bold text-t1">นัดทดลองขับ</p>
                  <p className="text-[11px] text-t3">สร้างนัดหมายทดลองขับ</p>
                </div>
              </button>
            </div>
            <button onClick={() => setShowTypePopup(false)} className="w-full mt-4 py-2 text-[12px] font-bold text-t3 text-center cursor-pointer">
              ยกเลิก
            </button>
          </div>
        </div>,
        document.body
      )}
    </div>
  );
}
