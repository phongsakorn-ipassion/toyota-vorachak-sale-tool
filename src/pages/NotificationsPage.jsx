import { useUiStore } from '../stores/uiStore'
import PageHeader from '../components/layout/PageHeader'
import Icon from '../components/icons/Icon'

export default function NotificationsPage() {
  const { notifications, markRead, markAllRead, getUnreadCount } = useUiStore()
  const unread = getUnreadCount()

  const typeIcon = { lead_update: 'users', booking: 'check', info: 'bell', success: 'check', warning: 'flame', error: 'close' }
  const typeBg = { lead_update: 'bg-blue-50 text-cool', booking: 'bg-emerald-50 text-won', info: 'bg-gray-50 text-t2', success: 'bg-emerald-50 text-won', warning: 'bg-amber-50 text-warm', error: 'bg-red-50 text-hot' }

  function formatTime(t) {
    const d = new Date(t)
    const day = d.getDate()
    const months = ['ม.ค.','ก.พ.','มี.ค.','เม.ย.','พ.ค.','มิ.ย.','ก.ค.','ส.ค.','ก.ย.','ต.ค.','พ.ย.','ธ.ค.']
    return `${day} ${months[d.getMonth()]} ${d.getHours().toString().padStart(2,'0')}:${d.getMinutes().toString().padStart(2,'0')}`
  }

  return (
    <div className="screen-enter">
      <PageHeader
        title="การแจ้งเตือน"
        showBack
        rightAction={unread > 0 ? (
          <button onClick={markAllRead} className="text-xs text-primary font-bold">อ่านทั้งหมด</button>
        ) : null}
      />
      <div className="p-4">
        {notifications.length === 0 ? (
          <div className="text-center py-12">
            <Icon name="bell" size={48} className="text-t3 mx-auto mb-3" />
            <p className="text-sm text-t2">ไม่มีการแจ้งเตือน</p>
          </div>
        ) : (
          <div className="space-y-2">
            {notifications.map(n => (
              <button
                key={n.id}
                onClick={() => markRead(n.id)}
                className={`w-full text-left bg-card rounded-lg border p-3 flex gap-3 items-start transition-colors ${n.read ? 'border-border opacity-70' : 'border-primary/30 bg-primary/[0.02]'}`}
              >
                <div className={`w-9 h-9 rounded-full flex items-center justify-center flex-shrink-0 ${typeBg[n.type] || 'bg-gray-50 text-t2'}`}>
                  <Icon name={typeIcon[n.type] || 'bell'} size={16} />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-2">
                    <p className="text-sm font-bold text-t1 truncate">{n.title}</p>
                    {!n.read && <span className="w-2 h-2 rounded-full bg-primary flex-shrink-0 mt-1.5" />}
                  </div>
                  <p className="text-xs text-t2 mt-0.5 line-clamp-2">{n.body}</p>
                  <p className="text-[10px] text-t3 mt-1">{formatTime(n.time)}</p>
                </div>
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
