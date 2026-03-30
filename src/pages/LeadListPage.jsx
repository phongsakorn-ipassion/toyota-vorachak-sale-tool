import React from 'react';
import { useNavigate } from 'react-router-dom';
import PageHeader from '../components/layout/PageHeader';
import Icon from '../components/icons/Icon';
import { useLeadStore } from '../stores/leadStore';
import { useBookingStore } from '../stores/bookingStore';
import { CARS } from '../lib/mockData';

const FILTER_OPTIONS = [
  { key: 'all', label: 'ทั้งหมด' },
  { key: 'hot', label: 'Hot' },
  { key: 'warm', label: 'Warm' },
  { key: 'cool', label: 'Cool' },
  { key: 'won', label: 'Won' },
  { key: 'lost', label: 'Lost' },
];

const LEVEL_STYLES = {
  hot: { bg: 'bg-red-50', text: 'text-hot', label: 'Hot' },
  warm: { bg: 'bg-amber-50', text: 'text-warm', label: 'Warm' },
  cool: { bg: 'bg-blue-50', text: 'text-cool', label: 'Cool' },
  won: { bg: 'bg-emerald-50', text: 'text-won', label: 'Won' },
  lost: { bg: 'bg-gray-100', text: 'text-t3', label: 'Lost' },
};

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
  const navigate = useNavigate();
  const filterLevel = useLeadStore((s) => s.filterLevel);
  const setFilterLevel = useLeadStore((s) => s.setFilterLevel);
  const searchTerm = useLeadStore((s) => s.searchTerm);
  const setSearch = useLeadStore((s) => s.setSearch);
  const getFilteredLeads = useLeadStore((s) => s.getFilteredLeads);
  const addActivity = useLeadStore((s) => s.addActivity);
  const setCarId = useBookingStore((s) => s.setCarId);
  const setLeadId = useBookingStore((s) => s.setLeadId);

  const leads = getFilteredLeads();

  const handleCall = (e, lead) => {
    e.stopPropagation();
    window.location.href = 'tel:' + lead.phone;
    addActivity(lead.id, { type: 'call', title: 'โทรหาลูกค้า', description: 'โทรติดตาม ' + lead.name });
  };

  const handleLine = (e, lead) => {
    e.stopPropagation();
    window.open('https://line.me/R/', '_blank');
    addActivity(lead.id, { type: 'line', title: 'ส่ง LINE', description: 'ส่งข้อความ LINE ถึง ' + lead.name });
  };

  const handleBook = (e, lead) => {
    e.stopPropagation();
    if (lead.car) setCarId(lead.car);
    setLeadId(lead.id);
    navigate('/booking');
  };

  return (
    <div className="screen-enter flex flex-col h-full">
      <PageHeader
        title="Lead ทั้งหมด"
        rightAction={
          <button
            onClick={() => navigate('/acard')}
            className="w-8 h-8 rounded-full bg-primary flex items-center justify-center cursor-pointer"
          >
            <Icon name="plus" size={16} className="text-white" />
          </button>
        }
      />

      {/* Search bar */}
      <div className="px-4 pt-3 pb-1">
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
        {FILTER_OPTIONS.map((opt) => (
          <button
            key={opt.key}
            onClick={() => setFilterLevel(opt.key)}
            className={`pill-filter whitespace-nowrap ${filterLevel === opt.key ? 'on' : ''}`}
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
              <Icon name="users" size={28} className="text-t3" />
            </div>
            <p className="text-sm font-bold text-t2">ไม่พบลีด</p>
            <p className="text-xs text-t3 mt-1">ลองเปลี่ยนตัวกรองหรือค้นหาใหม่</p>
          </div>
        ) : (
          <div className="flex flex-col gap-2">
            {leads.map((lead) => {
              const style = LEVEL_STYLES[lead.level] || LEVEL_STYLES.cool;
              const color = lead.color || getAvatarColor(lead.name);
              const initial = lead.init || lead.name?.charAt(0) || '?';
              const carName = lead.car ? (CARS[lead.car]?.name || lead.car) : '';
              const hasNotes = lead.activities?.some(a => a.type === 'note');

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
                    <div className="flex items-center justify-between gap-2">
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
                      <span className={`shrink-0 px-2 py-0.5 rounded-full text-[10px] font-bold ${style.bg} ${style.text}`}>
                        {style.label}
                      </span>
                    </div>
                    <div className="flex items-center justify-between mt-0.5">
                      <span className="text-xs text-t3 truncate">
                        {carName && (
                          <>
                            <Icon name="car" size={11} className="inline mr-0.5 -mt-px" />
                            {carName}
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

                  {/* Quick action buttons */}
                  <div className="flex items-center gap-1 shrink-0">
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
                    <span
                      onClick={(e) => handleBook(e, lead)}
                      className="w-7 h-7 rounded-full flex items-center justify-center bg-blue-50 text-blue-600 active:opacity-60 cursor-pointer"
                    >
                      <Icon name="book" size={12} />
                    </span>
                  </div>
                </button>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
