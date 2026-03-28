import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import PageHeader from '../components/layout/PageHeader';
import Avatar from '../components/ui/Avatar';
import Badge from '../components/ui/Badge';
import Toast from '../components/ui/Toast';
import LeadActions from '../components/lead/LeadActions';
import ActivityTimeline from '../components/lead/ActivityTimeline';
import { useLeadStore } from '../stores/leadStore';
import { LEADS, CARS } from '../lib/mockData';
import { LEAD_LEVELS } from '../lib/constants';

export default function LeadDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const storeLead = useLeadStore((s) => s.leads.find((l) => l.id === id));
  const lead = storeLead || LEADS[id];
  const [toast, setToast] = useState({ visible: false, message: '', type: 'info' });

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

  const handleAction = (type) => {
    const messages = {
      call: `กำลังโทรหา ${lead.name}...`,
      line: `เปิด LINE สำหรับ ${lead.name}`,
      appointment: `สร้างนัดหมายกับ ${lead.name}`,
      note: `บันทึกข้อมูล ${lead.name}`,
    };
    setToast({ visible: true, message: messages[type] || type, type: 'info' });
  };

  return (
    <div className="flex flex-col h-full bg-surface">
      <PageHeader title={lead.name} showBack />

      <div className="flex-1 overflow-y-auto">
        {/* Hero section */}
        <div className="bg-white py-[18px] px-4 border-b border-border flex items-center gap-[14px]">
          <div className="w-[52px] h-[52px] rounded-full flex items-center justify-center shrink-0" style={{ backgroundColor: lead.color || '#1B7A3F' }}>
            <span className="text-[20px] font-extrabold text-white">{lead.init}</span>
          </div>
          <div className="flex-1 min-w-0">
            <h2 className="text-[17px] font-extrabold text-t1">{lead.name}</h2>
            <p className="text-[12px] text-t2">{lead.source}</p>
          </div>
          <Badge level={lead.level}>{levelConfig.label}</Badge>
        </div>

        <div className="px-4">
          {/* Action buttons */}
          <LeadActions lead={lead} onAction={handleAction} />

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

          {/* Activity timeline */}
          <div className="mt-6 mb-6">
            <h3 className="text-sm font-bold text-t1 mb-2">กิจกรรม</h3>
            <ActivityTimeline activities={lead.activities || []} />
          </div>
        </div>
      </div>

      <Toast
        message={toast.message}
        type={toast.type}
        isVisible={toast.visible}
        onClose={() => setToast((t) => ({ ...t, visible: false }))}
      />
    </div>
  );
}
