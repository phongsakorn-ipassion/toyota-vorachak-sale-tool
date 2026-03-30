import React, { useState, useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import PageHeader from '../components/layout/PageHeader'
import Icon from '../components/icons/Icon'
import { useAuthStore } from '../stores/authStore'
import { useLeadStore } from '../stores/leadStore'
import { useBookingStore } from '../stores/bookingStore'
import { useVisibilityRefresh } from '../hooks/useVisibilityRefresh'

export default function ProfilePage() {
  const [, forceUpdate] = useState(0)
  useVisibilityRefresh(useCallback(() => forceUpdate(n => n + 1), []))
  const navigate = useNavigate()
  const { user, role, logout, updateProfile, login } = useAuthStore()
  const { leads } = useLeadStore()
  const { bookings } = useBookingStore()

  const [editing, setEditing] = useState(false)
  const [editName, setEditName] = useState(user?.name || '')
  const [notificationsEnabled, setNotificationsEnabled] = useState(true)

  if (!user) {
    return (
      <div className="p-4 text-center">
        <p className="text-t2">กรุณาเข้าสู่ระบบ</p>
      </div>
    )
  }

  // Stats
  const totalLeads = leads.length
  const wonDeals = leads.filter((l) => l.level === 'won').length
  const conversionRate = totalLeads > 0 ? Math.round((wonDeals / totalLeads) * 100) : 0
  const totalBookings = bookings.length

  const roleLabel = role === 'mgr' ? 'ผู้จัดการ' : 'พนักงานขาย'
  const roleBadgeColor = role === 'mgr' ? 'bg-purple-100 text-purple-700' : 'bg-blue-100 text-blue-700'
  const initial = user.init || user.name?.charAt(0) || 'U'
  const branchName = 'วรจักร์ยนต์ สาขาลาดพร้าว'

  function handleSave() {
    updateProfile({ name: editName })
    setEditing(false)
  }

  function handleCancel() {
    setEditName(user.name || '')
    setEditing(false)
  }

  function handleSwitchRole(newRole) {
    if (newRole === role) return
    login(newRole)
    navigate(newRole === 'mgr' ? '/mgr-dash' : '/sales-dash')
  }

  async function handleLogout() {
    await logout()
    navigate('/login')
  }

  return (
    <div className="screen-enter">
      <PageHeader title="โปรไฟล์" showBack />
      <div className="p-4 pb-24 space-y-4">
        {/* Avatar + user info */}
        <div className="flex flex-col items-center py-4">
          <div className="w-20 h-20 rounded-full bg-primary flex items-center justify-center text-white text-3xl font-extrabold shadow-lg mb-3">
            {initial}
          </div>
          {editing ? (
            <input
              type="text"
              value={editName}
              onChange={(e) => setEditName(e.target.value)}
              className="text-lg font-extrabold text-t1 text-center bg-gray-50 border border-border rounded-lg px-3 py-1 w-48 mb-1"
            />
          ) : (
            <h2 className="text-lg font-extrabold text-t1">{user.name}</h2>
          )}
          <span className={`mt-1 px-3 py-0.5 rounded-full text-[11px] font-bold ${roleBadgeColor}`}>
            {roleLabel}
          </span>
          <p className="text-xs text-t3 mt-1">{branchName}</p>
          {!editing ? (
            <button
              onClick={() => setEditing(true)}
              className="mt-2 text-xs text-primary font-bold flex items-center gap-1"
            >
              <Icon name="edit" size={13} />
              แก้ไขชื่อ
            </button>
          ) : (
            <div className="flex gap-3 mt-2">
              <button onClick={handleCancel} className="text-xs text-t3 font-bold">
                ยกเลิก
              </button>
              <button onClick={handleSave} className="text-xs text-primary font-bold">
                บันทึก
              </button>
            </div>
          )}
        </div>

        {/* Role switching */}
        <div className="card-base">
          <h3 className="text-sm font-bold text-t1 mb-3 flex items-center gap-1.5">
            <Icon name="rotate" size={14} className="text-primary" />
            สลับบทบาท
          </h3>
          <div className="grid grid-cols-2 gap-3">
            {/* Sales card */}
            <button
              onClick={() => handleSwitchRole('sales')}
              className={`rounded-xl p-3.5 text-center transition-all cursor-pointer border-2 ${
                role === 'sales'
                  ? 'border-primary bg-primary/5'
                  : 'border-border bg-white hover:bg-gray-50'
              }`}
            >
              <div className={`w-10 h-10 rounded-full mx-auto mb-2 flex items-center justify-center ${
                role === 'sales' ? 'bg-primary text-white' : 'bg-gray-100 text-t3'
              }`}>
                <Icon name="user" size={20} />
              </div>
              <div className={`text-sm font-bold ${role === 'sales' ? 'text-primary' : 'text-t2'}`}>
                พนักงานขาย
              </div>
              <div className="text-[10px] text-t3 mt-0.5">Sales</div>
              {role === 'sales' && (
                <div className="mt-1.5">
                  <span className="text-[9px] font-bold text-primary bg-primary/10 px-2 py-0.5 rounded-full">
                    ใช้งานอยู่
                  </span>
                </div>
              )}
            </button>

            {/* Manager card */}
            <button
              onClick={() => handleSwitchRole('mgr')}
              className={`rounded-xl p-3.5 text-center transition-all cursor-pointer border-2 ${
                role === 'mgr'
                  ? 'border-primary bg-primary/5'
                  : 'border-border bg-white hover:bg-gray-50'
              }`}
            >
              <div className={`w-10 h-10 rounded-full mx-auto mb-2 flex items-center justify-center ${
                role === 'mgr' ? 'bg-primary text-white' : 'bg-gray-100 text-t3'
              }`}>
                <Icon name="chart" size={20} />
              </div>
              <div className={`text-sm font-bold ${role === 'mgr' ? 'text-primary' : 'text-t2'}`}>
                ผู้จัดการ
              </div>
              <div className="text-[10px] text-t3 mt-0.5">Manager</div>
              {role === 'mgr' && (
                <div className="mt-1.5">
                  <span className="text-[9px] font-bold text-primary bg-primary/10 px-2 py-0.5 rounded-full">
                    ใช้งานอยู่
                  </span>
                </div>
              )}
            </button>
          </div>
        </div>

        {/* Stats card */}
        <div className="card-base">
          <h3 className="text-sm font-bold text-t1 mb-3 flex items-center gap-1.5">
            <Icon name="chart" size={14} className="text-primary" />
            สถิติของฉัน
          </h3>
          <div className="grid grid-cols-2 gap-3">
            <div className="bg-blue-50 rounded-lg p-3 text-center">
              <div className="text-xl font-extrabold text-blue-700">{totalLeads}</div>
              <div className="text-[10px] text-blue-600 font-bold">ลีดทั้งหมด</div>
            </div>
            <div className="bg-emerald-50 rounded-lg p-3 text-center">
              <div className="text-xl font-extrabold text-emerald-700">{wonDeals}</div>
              <div className="text-[10px] text-emerald-600 font-bold">ปิดการขายได้</div>
            </div>
            <div className="bg-purple-50 rounded-lg p-3 text-center">
              <div className="text-xl font-extrabold text-purple-700">{totalBookings}</div>
              <div className="text-[10px] text-purple-600 font-bold">การจอง</div>
            </div>
            <div className="bg-amber-50 rounded-lg p-3 text-center">
              <div className="text-xl font-extrabold text-amber-700">{conversionRate}%</div>
              <div className="text-[10px] text-amber-600 font-bold">อัตราการแปลง</div>
            </div>
          </div>
        </div>

        {/* Quick Settings */}
        <div className="card-base">
          <h3 className="text-sm font-bold text-t1 mb-3 flex items-center gap-1.5">
            <Icon name="gear" size={14} className="text-primary" />
            ตั้งค่า
          </h3>
          <div className="space-y-3">
            {/* Notifications toggle */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-full bg-blue-50 flex items-center justify-center">
                  <Icon name="bell" size={14} className="text-blue-500" />
                </div>
                <span className="text-sm text-t1">การแจ้งเตือน</span>
              </div>
              <button
                onClick={() => setNotificationsEnabled(!notificationsEnabled)}
                className={`w-11 h-6 rounded-full transition-colors relative ${
                  notificationsEnabled ? 'bg-primary' : 'bg-gray-300'
                }`}
              >
                <span
                  className={`absolute top-0.5 w-5 h-5 rounded-full bg-white shadow transition-transform ${
                    notificationsEnabled ? 'translate-x-[22px]' : 'translate-x-0.5'
                  }`}
                />
              </button>
            </div>

            {/* Language */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-full bg-emerald-50 flex items-center justify-center">
                  <span className="text-xs font-bold text-emerald-500">TH</span>
                </div>
                <span className="text-sm text-t1">ภาษา</span>
              </div>
              <span className="text-xs text-t3 font-bold bg-gray-100 px-2.5 py-1 rounded-lg">
                ไทย
              </span>
            </div>
          </div>
        </div>

        {/* Logout */}
        <button
          onClick={handleLogout}
          className="w-full bg-red-50 text-red-600 border border-red-200 rounded-xl py-3.5 font-bold text-sm flex items-center justify-center gap-2 transition-colors hover:bg-red-100"
        >
          <Icon name="lock" size={16} />
          ออกจากระบบ
        </button>

        {/* App version */}
        <p className="text-center text-[10px] text-t3 pt-2">
          Toyota Sale Tool v1.0 | วรจักร์ยนต์
        </p>
      </div>
    </div>
  )
}
