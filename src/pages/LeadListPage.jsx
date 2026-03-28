import React from 'react';
import { useNavigate } from 'react-router-dom';
import PageHeader from '../components/layout/PageHeader';
import FilterPill from '../components/ui/FilterPill';
import LeadListItem from '../components/lead/LeadListItem';
import Icon from '../components/icons/Icon';
import { useLeadStore } from '../stores/leadStore';

const FILTER_OPTIONS = [
  { key: 'all', label: 'ทั้งหมด' },
  { key: 'hot', label: 'Hot 🔥' },
  { key: 'warm', label: 'Warm 🌡️' },
  { key: 'cool', label: 'Cool ❄️' },
  { key: 'won', label: 'Won ✓' },
];

export default function LeadListPage() {
  const navigate = useNavigate();
  const filterLevel = useLeadStore((s) => s.filterLevel);
  const setFilterLevel = useLeadStore((s) => s.setFilterLevel);
  const getFilteredLeads = useLeadStore((s) => s.getFilteredLeads);

  const leads = getFilteredLeads();

  return (
    <div className="flex flex-col h-full bg-surface">
      <PageHeader
        title="Leads"
        rightAction={
          <button
            onClick={() => navigate('/acard')}
            className="p-1 cursor-pointer"
          >
            <Icon name="plus" size={22} className="text-t1" />
          </button>
        }
      />

      {/* Filter pills */}
      <div className="flex gap-2 px-4 py-3 overflow-x-auto no-scrollbar">
        {FILTER_OPTIONS.map((opt) => (
          <FilterPill
            key={opt.key}
            label={opt.label}
            active={filterLevel === opt.key}
            onClick={() => setFilterLevel(opt.key)}
          />
        ))}
      </div>

      {/* Lead list */}
      <div className="flex-1 overflow-y-auto px-4 pb-4">
        {leads.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 text-center">
            <Icon name="users" size={40} className="text-t3 mb-3" />
            <p className="text-sm text-t2">ไม่พบลูกค้าที่ตรงกับตัวกรอง</p>
          </div>
        ) : (
          <div className="flex flex-col gap-3">
            {leads.map((lead) => (
              <LeadListItem
                key={lead.id}
                lead={lead}
                onClick={() => navigate(`/lead/${lead.id}`)}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
