import React, { useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuthStore } from '../stores/authStore'
import { useLeadStore } from '../stores/leadStore'
import { useBookingStore } from '../stores/bookingStore'
import { useUiStore } from '../stores/uiStore'
import { CARS } from '../lib/mockData'
import { formatPrice, formatCurrency } from '../lib/formats'
import Icon from '../components/icons/Icon'
import Badge from '../components/ui/Badge'

export default function SalesDashboard() {
  const navigate = useNavigate()
  const user = useAuthStore((s) => s.user)
  const userName = user?.name || 'Sales'
  const leads = useLeadStore((s) => s.leads)
  const bookings = useBookingStore((s) => s.bookings)
  const getUnreadCount = useUiStore((s) => s.getUnreadCount)

  const unreadCount = getUnreadCount()

  // ---------------------------------------------------------------------------
  // Computed data from stores
  // ---------------------------------------------------------------------------
  const stats = useMemo(() => {
    const wonLeads = leads.filter((l) => l.level === 'won')
    const hotLeads = leads.filter((l) => l.level === 'hot')

    // Today's bookings
    const today = new Date().toDateString()
    const todayBookings = bookings.filter(
      (b) => b.status === 'confirmed' && new Date(b.createdAt).toDateString() === today
    )

    // Commission: 2% of total car prices for won leads
    const wonCarPrices = wonLeads.reduce((sum, l) => {
      const car = CARS[l.car]
      return sum + (car ? car.price : 0)
    }, 0)
    const commission = Math.round(wonCarPrices * 0.02)

    // Remaining target
    const target = 15
    const remaining = Math.max(0, target - wonLeads.length)
    const targetPct = Math.min(100, Math.round((wonLeads.length / target) * 100))

    return {
      wonCount: wonLeads.length,
      hotCount: hotLeads.length,
      todayBookings: todayBookings.length,
      target,
      remaining,
      targetPct,
      commission,
      wonCarPrices,
    }
  }, [leads, bookings])

  // First HOT lead as featured
  const featuredHotLead = useMemo(() => {
    return leads.find((l) => l.level === 'hot') || null
  }, [leads])

  const featuredCar = featuredHotLead ? CARS[featuredHotLead.car] : null

  // Recent leads sorted by lastContact (latest activity time) or createdAt, newest first
  const recentLeads = useMemo(() => {
    return [...leads]
      .filter((l) => l.level !== 'lost')
      .sort((a, b) => {
        const aTime = a.activities?.[0]?.time || a.createdAt || ''
        const bTime = b.activities?.[0]?.time || b.createdAt || ''
        return bTime.localeCompare(aTime)
      })
      .slice(0, 5)
  }, [leads])

  // Time-ago helper
  const timeAgo = (dateStr) => {
    if (!dateStr) return ''
    const diff = Date.now() - new Date(dateStr).getTime()
    const mins = Math.floor(diff / 60000)
    if (mins < 60) return `${mins} นาที`
    const hrs = Math.floor(mins / 60)
    if (hrs < 24) return `${hrs} ชม.`
    const days = Math.floor(hrs / 24)
    return `${days} วัน`
  }

  const quickActions = [
    { label: 'สร้าง Lead', path: '/acard', icon: 'plus' },
    { label: 'ค้นหารถ', path: '/catalog', icon: 'car' },
    { label: 'คำนวณผ่อน', path: '/calc', icon: 'target' },
  ]

  return (
    <div className="pb-24">
      {/* Custom page header */}
      <div className="bg-white py-[13px] px-4 flex items-center gap-[11px] border-b border-border">
        <div className="w-[38px] h-[38px] rounded-full bg-primary flex items-center justify-center shrink-0">
          <span className="text-white text-[15px] font-extrabold">{userName.charAt(0)}</span>
        </div>
        <div className="flex-1 min-w-0">
          <div className="text-[15px] font-extrabold text-t1 truncate">สวัสดี, {userName}</div>
          <div className="text-[11px] text-t2">วรจักร์ยนต์ สาขาลาดพร้าว</div>
        </div>
        <button
          className="relative p-1 cursor-pointer shrink-0"
          onClick={() => navigate('/notifications')}
        >
          <Icon name="bell" size={22} className="text-t1" />
          {unreadCount > 0 && (
            <span className="absolute -top-0.5 -right-0.5 w-5 h-5 bg-hot text-white text-[10px] font-bold rounded-full flex items-center justify-center">
              {unreadCount}
            </span>
          )}
        </button>
      </div>

      <div className="px-4 pt-4 space-y-4">
        {/* Target card (green) */}
        <div
          className="bg-primary rounded-lg relative overflow-hidden"
          style={{ padding: 18 }}
        >
          <div className="absolute top-[-20px] right-[-20px] w-[120px] h-[120px] rounded-full bg-white/[0.07]" />
          <div className="absolute bottom-[-30px] right-[30px] w-20 h-20 rounded-full bg-white/[0.05]" />
          <div className="relative z-10">
            <div className="text-[11px] font-semibold text-white/65">เป้าหมายเดือนนี้</div>
            <div className="flex items-baseline gap-1 mt-1">
              <span className="text-[34px] font-extrabold text-white leading-none">{stats.wonCount}</span>
              <span className="text-[12px] text-white/60">of {stats.target} คัน</span>
            </div>
            {/* Progress bar */}
            <div className="h-[5px] bg-white/20 rounded-[3px] mt-3">
              <div className="h-full bg-white rounded-[3px]" style={{ width: `${stats.targetPct}%` }} />
            </div>
            {/* Stats row */}
            <div className="flex gap-6 mt-4">
              <div>
                <div className="text-[18px] font-extrabold text-white">{stats.todayBookings}</div>
                <div className="text-[10px] text-white/60">จองวันนี้</div>
              </div>
              <div>
                <div className="text-[18px] font-extrabold text-white">{stats.hotCount}</div>
                <div className="text-[10px] text-white/60">ลีดร้อน</div>
              </div>
              <div>
                <div className="text-[18px] font-extrabold text-white">{stats.remaining}</div>
                <div className="text-[10px] text-white/60">เหลืออีก</div>
              </div>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-3 gap-2">
          {quickActions.map((action) => (
            <div
              key={action.path}
              className="bg-white border border-border rounded-lg py-[14px] px-2 text-center cursor-pointer"
              onClick={() => navigate(action.path)}
            >
              <div className="text-primary mb-[5px] flex justify-center">
                <Icon name={action.icon} size={22} />
              </div>
              <span className="text-[11px] font-bold text-t1">{action.label}</span>
            </div>
          ))}
        </div>

        {/* Commission card */}
        <div className="bg-gradient-to-r from-amber-50 to-yellow-50 rounded-lg border border-amber-200 p-4">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-[11px] font-semibold text-amber-600">คอมมิชชั่นสะสม (2%)</div>
              <div className="text-[22px] font-extrabold text-amber-800 mt-1">
                {formatCurrency(stats.commission)}
              </div>
              <div className="text-[10px] text-amber-600/70 mt-0.5">
                จากยอดขาย {formatCurrency(stats.wonCarPrices)}
              </div>
            </div>
            <div className="w-10 h-10 bg-amber-100 rounded-full flex items-center justify-center">
              <Icon name="star" size={20} className="text-amber-500" />
            </div>
          </div>
        </div>

        {/* Featured Hot Lead Card */}
        {featuredHotLead && featuredCar && (
          <div
            className="bg-white rounded-lg border border-border overflow-hidden cursor-pointer"
            onClick={() => navigate(`/lead/${featuredHotLead.id}`)}
          >
            <div className="h-[160px] bg-gradient-to-br from-red-50 via-orange-50 to-yellow-50 flex items-center justify-center relative">
              <img
                src={featuredCar.img}
                alt={featuredCar.name}
                className="max-w-[85%] max-h-[140px] object-contain drop-shadow-md"
              />
              <Badge level="hot">
                <span className="absolute top-3 left-3 badge-hot">Hot Lead</span>
              </Badge>
              <span className="absolute top-3 right-3 text-[10px] bg-white/80 backdrop-blur rounded-full px-2 py-0.5 font-semibold text-t2">
                {featuredHotLead.source}
              </span>
            </div>
            <div style={{ padding: '14px 15px' }}>
              <div className="flex items-center gap-2">
                <div className="text-[16px] font-extrabold text-t1">{featuredHotLead.name}</div>
                <Badge level="hot">Hot</Badge>
              </div>
              <div className="text-[12px] text-t2 mt-0.5">สนใจ {featuredCar.name}</div>
              <div className="text-[14px] font-extrabold text-primary mt-1">{featuredCar.priceLabel}</div>
            </div>
          </div>
        )}

        {/* Recent Leads */}
        <div>
          <div className="card-hd">
            <h3 className="card-title">ลีดล่าสุด</h3>
            <button
              className="text-[12px] font-bold text-primary cursor-pointer"
              onClick={() => navigate('/leads')}
            >
              ดูทั้งหมด
            </button>
          </div>
          <div>
            {recentLeads.map((lead) => {
              const car = CARS[lead.car]
              const lastTime = lead.activities?.[0]?.time || lead.createdAt
              return (
                <div
                  key={lead.id}
                  className="flex gap-[11px] py-[11px] border-b border-border cursor-pointer items-center"
                  onClick={() => navigate(`/lead/${lead.id}`)}
                >
                  <div
                    className="w-[42px] h-[42px] rounded-full flex items-center justify-center shrink-0"
                    style={{ backgroundColor: lead.color || '#1B7A3F' }}
                  >
                    <span className="text-[15px] font-extrabold text-white">{lead.init}</span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="text-[13px] font-bold text-t1 truncate">{lead.name}</div>
                    <div className="text-[11px] text-t2">
                      สนใจ {car?.name || lead.car}
                    </div>
                  </div>
                  <div className="flex flex-col items-end gap-1 shrink-0">
                    <Badge level={lead.level}>
                      {lead.level === 'hot' ? 'Hot' : lead.level === 'warm' ? 'Warm' : lead.level === 'cool' ? 'Cool' : lead.level === 'won' ? 'Won' : lead.level}
                    </Badge>
                    <span className="text-[10px] text-t3">{timeAgo(lastTime)}</span>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </div>
    </div>
  )
}
