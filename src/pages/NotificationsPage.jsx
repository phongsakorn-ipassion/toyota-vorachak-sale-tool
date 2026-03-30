import React, { useMemo, useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import Icon from '../components/icons/Icon';
import { useUiStore } from '../stores/uiStore';
import { useVisibilityRefresh } from '../hooks/useVisibilityRefresh';

export default function NotificationsPage() {
  const [, forceUpdate] = useState(0);
  useVisibilityRefresh(useCallback(() => forceUpdate(n => n + 1), []));
  const navigate = useNavigate();
  const notifications = useUiStore((s) => s.notifications);
  const markRead = useUiStore((s) => s.markRead);
  const markAllRead = useUiStore((s) => s.markAllRead);
  const deleteNotification = useUiStore((s) => s.deleteNotification);

  // Group notifications by date
  const grouped = useMemo(() => {
    const today = new Date();
    const todayStr = today.toISOString().slice(0, 10);
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);
    const yesterdayStr = yesterday.toISOString().slice(0, 10);

    const groups = { today: [], yesterday: [], earlier: [] };

    notifications.forEach((n) => {
      const nDate = n.time && n.time.includes('T') ? n.time.slice(0, 10) : null;
      if (nDate === todayStr) {
        groups.today.push(n);
      } else if (nDate === yesterdayStr) {
        groups.yesterday.push(n);
      } else {
        // Check Thai text hints for grouping
        const timeStr = (n.time || '').toLowerCase();
        if (timeStr.includes('นาที') || timeStr.includes('ชั่วโมง') || timeStr.includes('วันนี้')) {
          groups.today.push(n);
        } else if (timeStr.includes('เมื่อวาน')) {
          groups.yesterday.push(n);
        } else {
          groups.earlier.push(n);
        }
      }
    });

    return groups;
  }, [notifications]);

  const handleNotificationClick = (n) => {
    markRead(n.id);
    // Deep-link navigation based on type
    if (n.type === 'hot' || n.type === 'warn') {
      navigate('/pipeline');
    } else if (n.type === 'success') {
      navigate('/pipeline');
    } else {
      // Default: stay or go to dashboard
    }
  };

  const renderNotification = (n) => (
    <div
      key={n.id}
      className="bg-white rounded-lg border border-border p-[14px] mb-3 cursor-pointer transition-opacity"
      style={{
        borderLeft: `3px solid ${n.borderColor}`,
        opacity: n.read ? 0.6 : 1,
      }}
      onClick={() => handleNotificationClick(n)}
    >
      <div className="flex items-start gap-[10px]">
        <span style={{ color: n.color }}><Icon name={n.icon} size={18} /></span>
        <div className="flex-1">
          <p className="text-[13px] font-bold text-t1">{n.title}</p>
          <p className="text-[12px] text-t2 mt-1 leading-relaxed">{n.body}</p>
          <p className="text-[10px] text-t3 mt-2">{n.time}</p>
        </div>
        <button
          onClick={(e) => { e.stopPropagation(); deleteNotification(n.id); }}
          className="text-t3 hover:text-hot cursor-pointer flex-shrink-0 text-[14px] leading-none"
        >
          ×
        </button>
      </div>
    </div>
  );

  const hasNotifications = notifications.length > 0;

  return (
    <div className="screen-enter flex flex-col h-full">
      <div className="bg-white px-4 py-[13px] flex items-center gap-[11px] border-b border-border flex-shrink-0">
        <button onClick={() => navigate(-1)} className="w-9 h-9 rounded-full flex items-center justify-center bg-bg border border-border text-t1 cursor-pointer"><Icon name="back" size={18} /></button>
        <div className="flex-1"><h2 className="text-[15px] font-extrabold text-t1">การแจ้งเตือน</h2><p className="text-[11px] text-t2 mt-[1px]">Notifications</p></div>
        {hasNotifications && (
          <button onClick={markAllRead} className="text-[12px] font-bold text-primary cursor-pointer">อ่านทั้งหมด</button>
        )}
      </div>

      <div className="flex-1 overflow-y-auto px-4 pt-4 pb-24" style={{ WebkitOverflowScrolling: 'touch' }}>
        {!hasNotifications ? (
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <Icon name="bell" size={48} className="text-t3 mb-3" />
            <p className="text-[14px] font-bold text-t2">ไม่มีการแจ้งเตือน</p>
            <p className="text-[12px] text-t3 mt-1">คุณยังไม่มีการแจ้งเตือนใหม่</p>
          </div>
        ) : (
          <>
            {grouped.today.length > 0 && (
              <>
                <div className="text-[11px] font-bold text-t3 uppercase mb-2">วันนี้</div>
                {grouped.today.map(renderNotification)}
              </>
            )}
            {grouped.yesterday.length > 0 && (
              <>
                <div className="text-[11px] font-bold text-t3 uppercase mb-2 mt-2">เมื่อวาน</div>
                {grouped.yesterday.map(renderNotification)}
              </>
            )}
            {grouped.earlier.length > 0 && (
              <>
                <div className="text-[11px] font-bold text-t3 uppercase mb-2 mt-2">ก่อนหน้า</div>
                {grouped.earlier.map(renderNotification)}
              </>
            )}
          </>
        )}
      </div>
    </div>
  );
}
