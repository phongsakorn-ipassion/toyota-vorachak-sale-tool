import React, { useState, useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import PageHeader from '../components/layout/PageHeader'
import Icon from '../components/icons/Icon'
import { useAuthStore } from '../stores/authStore'
import { useLeadStore } from '../stores/leadStore'
import { useBookingStore } from '../stores/bookingStore'
import { useUiStore } from '../stores/uiStore'
import { useVisibilityRefresh } from '../hooks/useVisibilityRefresh'

export default function ProfilePage() {
  const [, forceUpdate] = useState(0)
  useVisibilityRefresh(useCallback(() => forceUpdate(n => n + 1), []))
  const navigate = useNavigate()
  const { user, role, logout, updateProfile } = useAuthStore()
  const { leads } = useLeadStore()
  const { bookings } = useBookingStore()
  const notificationsEnabled = useUiStore((s) => s.notificationsEnabled)
  const setNotificationsEnabled = useUiStore((s) => s.setNotificationsEnabled)

  const [editing, setEditing] = useState(false)
  const [editName, setEditName] = useState(user?.name || '')

  if (!user) {
    return (
      <div className="p-4 text-center">
        <p className="text-t2">กรุณาเข้าสู่ระบบ</p>
      </div>
    )
  }

  // Stats
  const totalLeads = leads.length
  const wonDeals = leads.filter((l) => l.stage === 'close_won').length
  const conversionRate = totalLeads > 0 ? Math.round((wonDeals / totalLeads) * 100) : 0
  const totalBookings = bookings.length

  const roleLabel = role === 'mgr' ? 'ผู้จัดการ' : 'พนักงานขาย'
  const roleBadgeColor = role === 'mgr' ? 'bg-purple-100 text-purple-700' : 'bg-blue-100 text-blue-700'
  const initial = user.init || user.name?.charAt(0) || 'U'
  const branchName = 'วรจักร์ยนต์ สาขาลาดพร้าว'
  const managerName = 'วิชัย ผู้จัดการ'

  function handleSave() {
    updateProfile({ name: editName })
    setEditing(false)
  }

  function handleCancel() {
    setEditName(user.name || '')
    setEditing(false)
  }

  async function handleToggleNotifications() {
    const newValue = !notificationsEnabled
    if (newValue && typeof Notification !== 'undefined') {
      // Request permission on first enable
      const permission = await Notification.requestPermission()
      if (permission !== 'granted') {
        // Permission denied, don't enable
        return
      }
    }
    setNotificationsEnabled(newValue)
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
          {role === 'sales' && (
            <p className="text-xs text-t3 mt-0.5">ผู้จัดการ: {managerName}</p>
          )}
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
                onClick={handleToggleNotifications}
                className={`w-10 h-5 rounded-full transition-all relative flex-shrink-0 ${
                  notificationsEnabled ? 'bg-primary' : 'bg-gray-300'
                }`}
              >
                <span
                  className={`absolute top-0.5 w-4 h-4 rounded-full bg-white shadow transition-all ${
                    notificationsEnabled ? 'left-[22px]' : 'left-0.5'
                  }`}
                />
              </button>
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
