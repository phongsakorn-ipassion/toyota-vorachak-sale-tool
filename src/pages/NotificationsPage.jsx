import React from 'react';
import { useNavigate } from 'react-router-dom';
import Icon from '../components/icons/Icon';
import { NOTIFICATIONS } from '../lib/mockData';

export default function NotificationsPage() {
  const navigate = useNavigate();

  return (
    <div className="screen-enter flex flex-col h-full">
      <div className="bg-white px-4 py-[13px] flex items-center gap-[11px] border-b border-border flex-shrink-0">
        <button onClick={() => navigate(-1)} className="w-9 h-9 rounded-full flex items-center justify-center bg-bg border border-border text-t1 cursor-pointer"><Icon name="back" size={18} /></button>
        <div className="flex-1"><h2 className="text-[15px] font-extrabold text-t1">การแจ้งเตือน</h2><p className="text-[11px] text-t2 mt-[1px]">Notifications</p></div>
      </div>

      <div className="flex-1 overflow-y-auto px-4 pt-4 pb-24" style={{ WebkitOverflowScrolling: 'touch' }}>
        {NOTIFICATIONS.map(n => (
          <div key={n.id} className="bg-white rounded-lg border border-border p-[14px] mb-3" style={{ borderLeft: `3px solid ${n.borderColor}` }}>
            <div className="flex items-start gap-[10px]">
              <span style={{ color: n.color }}><Icon name={n.icon} size={18} /></span>
              <div className="flex-1">
                <p className="text-[13px] font-bold text-t1">{n.title}</p>
                <p className="text-[12px] text-t2 mt-1 leading-relaxed">{n.body}</p>
                <p className="text-[10px] text-t3 mt-2">{n.time}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
