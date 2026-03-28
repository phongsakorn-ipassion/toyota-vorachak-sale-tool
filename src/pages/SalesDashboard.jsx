import React from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuthStore } from '../stores/authStore'
import { CARS_LIST, LEADS_LIST, NOTIFICATIONS } from '../lib/mockData'
import { formatPrice } from '../lib/formats'
import Icon from '../components/icons/Icon'
import Avatar from '../components/ui/Avatar'
import Badge from '../components/ui/Badge'

export default function SalesDashboard() {
  const navigate = useNavigate()
  const user = useAuthStore((s) => s.user)
  const userName = user?.name || 'Sales'

  const featuredCar = CARS_LIST[0]
  const hotLeads = LEADS_LIST.filter(
    (l) => l.level === 'hot' || l.level === 'warm'
  ).slice(0, 3)
  const unreadCount = NOTIFICATIONS.filter((n) => !n.read).length

  const quickActions = [
    { label: 'ค้นหารถ', path: '/catalog', icon: 'car' },
    { label: 'สร้าง Lead', path: '/acard', icon: 'plus' },
    { label: 'คำนวณผ่อน', path: '/calc', icon: 'target' },
  ]

  /* Target card mock data */
  const targetCurrent = 8
  const targetGoal = 15
  const targetPct = Math.round((targetCurrent / targetGoal) * 100)

  return (
    <div className="pb-24">
      {/* Custom page header */}
      <div className="bg-white py-[13px] px-4 flex items-center gap-[11px] border-b border-border">
        {/* Avatar */}
        <div className="w-[38px] h-[38px] rounded-full bg-primary flex items-center justify-center shrink-0">
          <span className="text-white text-[15px] font-extrabold">{userName.charAt(0)}</span>
        </div>
        {/* Name */}
        <div className="flex-1 min-w-0">
          <div className="text-[15px] font-extrabold text-t1 truncate">สวัสดี, {userName}</div>
          <div className="text-[11px] text-t2">วรจักร์ยนต์ สาขาลาดพร้าว</div>
        </div>
        {/* Bell */}
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
          {/* Decorative circles */}
          <div className="absolute top-[-20px] right-[-20px] w-[120px] h-[120px] rounded-full bg-white/[0.07]" />
          <div className="absolute bottom-[-30px] right-[30px] w-20 h-20 rounded-full bg-white/[0.05]" />
          <div className="relative z-10">
            <div className="text-[11px] font-semibold text-white/65">เป้าหมายเดือนนี้</div>
            <div className="flex items-baseline gap-1 mt-1">
              <span className="text-[34px] font-extrabold text-white leading-none">{targetCurrent}</span>
              <span className="text-[12px] text-white/60">of {targetGoal} คัน</span>
            </div>
            {/* Progress bar */}
            <div className="h-[5px] bg-white/20 rounded-[3px] mt-3">
              <div className="h-full bg-white rounded-[3px]" style={{ width: `${targetPct}%` }} />
            </div>
            {/* Stats row */}
            <div className="flex gap-6 mt-4">
              <div>
                <div className="text-[18px] font-extrabold text-white">3</div>
                <div className="text-[10px] text-white/60">จอง</div>
              </div>
              <div>
                <div className="text-[18px] font-extrabold text-white">12</div>
                <div className="text-[10px] text-white/60">ลีดใหม่</div>
              </div>
              <div>
                <div className="text-[18px] font-extrabold text-white">53%</div>
                <div className="text-[10px] text-white/60">Conversion</div>
              </div>
            </div>
          </div>
        </div>

        {/* Quick Actions - 3 columns */}
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

        {/* Featured Car */}
        {featuredCar && (
          <div
            className="bg-white rounded-lg border border-border overflow-hidden cursor-pointer"
            onClick={() => navigate(`/car/${featuredCar.id}`)}
          >
            {/* Image area */}
            <div className="h-[160px] bg-gradient-to-br from-green-50 via-green-50 to-green-100 flex items-center justify-center relative">
              <img
                src={featuredCar.img}
                alt={featuredCar.name}
                className="max-w-[85%] max-h-[140px] object-contain drop-shadow-md"
              />
              <span className="badge-avail absolute top-3 left-3">In Stock</span>
              <span className="badge-transit absolute top-3 right-3 text-[10px]">{featuredCar.category || 'SUV'}</span>
            </div>
            {/* Body */}
            <div style={{ padding: '14px 15px' }}>
              <div className="text-[16px] font-extrabold text-t1">{featuredCar.name}</div>
              <div className="text-[12px] text-t2">{featuredCar.category || 'SUV / Crossover'}</div>
              <div className="text-[14px] font-extrabold text-primary mt-1">{featuredCar.priceLabel}</div>
            </div>
          </div>
        )}

        {/* Hot Leads */}
        <div>
          <div className="card-hd">
            <h3 className="card-title">ลีดร้อน 🔥</h3>
            <button
              className="text-[12px] font-bold text-primary cursor-pointer"
              onClick={() => navigate('/leads')}
            >
              ดูทั้งหมด
            </button>
          </div>
          <div>
            {hotLeads.map((lead) => (
              <div
                key={lead.id}
                className="flex gap-[11px] py-[11px] border-b border-border cursor-pointer items-center"
                onClick={() => navigate(`/lead/${lead.id}`)}
              >
                <div className="w-[42px] h-[42px] rounded-full flex items-center justify-center shrink-0" style={{ backgroundColor: lead.color || '#1B7A3F' }}>
                  <span className="text-[15px] font-extrabold text-white">{lead.init}</span>
                </div>
                <div className="flex-1 min-w-0">
                  <div className="text-[13px] font-bold text-t1 truncate">
                    {lead.name}
                  </div>
                  <div className="text-[11px] text-t2">
                    สนใจ {CARS_LIST.find((c) => c.id === lead.car)?.name || lead.car}
                  </div>
                </div>
                <div className="flex flex-col items-end gap-1 shrink-0">
                  <Badge level={lead.level}>
                    {lead.level === 'hot' ? 'Hot' : lead.level === 'warm' ? 'Warm' : lead.level}
                  </Badge>
                  <span className="text-[10px] text-t3">2 ชม.</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
