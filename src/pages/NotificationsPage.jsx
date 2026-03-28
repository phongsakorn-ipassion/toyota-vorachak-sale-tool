import React, { useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import { useUiStore } from '../stores/uiStore'
import PageHeader from '../components/layout/PageHeader'
import Icon from '../components/icons/Icon'

const typeConfig = {
  lead_update: { icon: 'users', bg: 'bg-blue-50', text: 'text-blue-600' },
  booking: { icon: 'check', bg: 'bg-emerald-50', text: 'text-emerald-600' },
  info: { icon: 'bell', bg: 'bg-gray-100', text: 'text-gray-500' },
  warning: { icon: 'flame', bg: 'bg-amber-50', text: 'text-amber-600' },
  success: { icon: 'check', bg: 'bg-emerald-50', text: 'text-emerald-600' },
  error: { icon: 'close', bg: 'bg-red-50', text: 'text-red-600' },
}

function formatTime(t) {
  const d = new Date(t)
  const months = ['ม.ค.', 'ก.พ.', 'มี.ค.', 'เม.ย.', 'พ.ค.', 'มิ.ย.', 'ก.ค.', 'ส.ค.', 'ก.ย.', 'ต.ค.', 'พ.ย.', 'ธ.ค.']
  return `${d.getDate()} ${months[d.getMonth()]} ${d.getHours().toString().padStart(2, '0')}:${d.getMinutes().toString().padStart(2, '0')}`
}

function getDateGroup(t) {
  const d = new Date(t)
  const today = new Date()
  today.setHours(0, 0, 0, 0)
  const notifDate = new Date(d)
  notifDate.setHours(0, 0, 0, 0)
  const diff = (today - notifDate) / (1000 * 60 * 60 * 24)
  if (diff < 1) return 'วันนี้'
  if (diff < 2) return 'เมื่อวาน'
  return 'ก่อนหน้า'
}

export default function NotificationsPage() {
  const navigate = useNavigate()
  const {
    notifications,
    markRead,
    markAllRead,
    deleteNotification,
    clearAllNotifications,
    getUnreadCount,
  } = useUiStore()
  const unread = getUnreadCount()

  // Group notifications by date
  const grouped = useMemo(() => {
    const groups = {}
    const order = ['วันนี้', 'เมื่อวาน', 'ก่อนหน้า']
    order.forEach((g) => { groups[g] = [] })
    notifications.forEach((n) => {
      const group = getDateGroup(n.time)
      if (!groups[group]) groups[group] = []
      groups[group].push(n)
    })
    return order.filter((g) => groups[g].length > 0).map((g) => ({
      label: g,
      items: groups[g],
    }))
  }, [notifications])

  function handleClick(n) {
    markRead(n.id)
    if (n.type === 'lead_update') {
      // Try to extract lead id from body or use a default route
      const leadMatch = n.body?.match(/lead_\w+/) || n.leadId
      if (leadMatch) {
        navigate(`/lead/${typeof leadMatch === 'string' ? leadMatch : leadMatch[0]}`)
      } else {
        navigate('/leads')
      }
    } else if (n.type === 'booking') {
      navigate('/booking')
    }
    // info, warning, success, error — just mark as read
  }

  function handleDelete(e, id) {
    e.stopPropagation()
    deleteNotification(id)
  }

  return (
    <div className="screen-enter">
      <PageHeader
        title="การแจ้งเตือน"
        showBack
        rightAction={
          notifications.length > 0 ? (
            <div className="flex items-center gap-3">
              {unread > 0 && (
                <button onClick={markAllRead} className="text-xs text-primary font-bold">
                  อ่านทั้งหมด
                </button>
              )}
              <button onClick={clearAllNotifications} className="text-xs text-red-500 font-bold">
                ล้างทั้งหมด
              </button>
            </div>
          ) : null
        }
      />
      <div className="p-4 pb-24">
        {notifications.length === 0 ? (
          /* Empty state */
          <div className="text-center py-16">
            <div className="w-20 h-20 rounded-full bg-gray-100 flex items-center justify-center mx-auto mb-4">
              <Icon name="bell" size={36} className="text-gray-300" />
            </div>
            <p className="text-base font-bold text-t2">ไม่มีการแจ้งเตือน</p>
            <p className="text-xs text-t3 mt-1">เมื่อมีการอัปเดตใหม่ จะแสดงที่นี่</p>
          </div>
        ) : (
          <div className="space-y-5">
            {grouped.map((group) => (
              <div key={group.label}>
                <h3 className="text-xs font-bold text-t3 uppercase tracking-wider mb-2">
                  {group.label}
                </h3>
                <div className="space-y-2">
                  {group.items.map((n) => {
                    const cfg = typeConfig[n.type] || typeConfig.info
                    return (
                      <div
                        key={n.id}
                        onClick={() => handleClick(n)}
                        className={`relative w-full text-left bg-card rounded-lg border p-3 flex gap-3 items-start transition-colors cursor-pointer group ${
                          n.read
                            ? 'border-border opacity-70'
                            : 'border-primary/30 bg-primary/[0.02]'
                        }`}
                      >
                        {/* Type icon */}
                        <div
                          className={`w-9 h-9 rounded-full flex items-center justify-center flex-shrink-0 ${cfg.bg} ${cfg.text}`}
                        >
                          <Icon name={cfg.icon} size={16} />
                        </div>

                        {/* Content */}
                        <div className="flex-1 min-w-0">
                          <div className="flex items-start justify-between gap-2">
                            <p className="text-sm font-bold text-t1 truncate">{n.title}</p>
                            <div className="flex items-center gap-1.5 flex-shrink-0">
                              {!n.read && (
                                <span className="w-2 h-2 rounded-full bg-primary" />
                              )}
                            </div>
                          </div>
                          <p className="text-xs text-t2 mt-0.5 line-clamp-2">{n.body}</p>
                          <div className="flex items-center justify-between mt-1.5">
                            <p className="text-[10px] text-t3">{formatTime(n.time)}</p>
                            {(n.type === 'lead_update' || n.type === 'booking') && (
                              <span className="text-[10px] text-primary font-bold">
                                ดูรายละเอียด &rsaquo;
                              </span>
                            )}
                          </div>
                        </div>

                        {/* Delete button */}
                        <button
                          onClick={(e) => handleDelete(e, n.id)}
                          className="absolute top-2 right-2 w-6 h-6 rounded-full bg-gray-100 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity text-t3 hover:text-red-500 hover:bg-red-50"
                        >
                          <Icon name="close" size={12} />
                        </button>
                      </div>
                    )
                  })}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
