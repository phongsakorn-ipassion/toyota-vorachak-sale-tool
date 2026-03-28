import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import PageHeader from '../components/layout/PageHeader'
import Icon from '../components/icons/Icon'
import { useAuthStore } from '../stores/authStore'
import { useLeadStore } from '../stores/leadStore'
import { useBookingStore } from '../stores/bookingStore'
import { BRANCHES } from '../lib/mockData'

export default function ProfilePage() {
  const navigate = useNavigate()
  const { user, role, logout, updateProfile } = useAuthStore()
  const { leads } = useLeadStore()
  const { bookings } = useBookingStore()

  const [editing, setEditing] = useState(false)
  const [editName, setEditName] = useState(user?.name || '')
  const [editPhone, setEditPhone] = useState(user?.phone || '081-000-0000')
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
  const thisMonthBookings = bookings.filter((b) => {
    if (!b.createdAt) return false
    const d = new Date(b.createdAt)
    const now = new Date()
    return d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear()
  }).length

  const branch = BRANCHES.find((b) => b.id === user.branch)
  const roleLabel = role === 'mgr' ? 'ผู้จัดการ' : 'พนักงานขาย'
  const roleBadgeColor = role === 'mgr' ? 'bg-purple-100 text-purple-700' : 'bg-blue-100 text-blue-700'
  const initial = user.name?.charAt(0) || 'U'

  function handleSave() {
    updateProfile({ name: editName, phone: editPhone })
    setEditing(false)
  }

  function handleCancel() {
    setEditName(user.name || '')
    setEditPhone(user.phone || '081-000-0000')
    setEditing(false)
  }

  async function handleLogout() {
    await logout()
    navigate('/login')
  }

  return (
    <div className="screen-enter">
      <PageHeader title="โปรไฟล์" showBack />
      <div className="p-4 pb-24 space-y-4">
        {/* Avatar section */}
        <div className="flex flex-col items-center py-4">
          <div className="w-20 h-20 rounded-full bg-primary flex items-center justify-center text-white text-3xl font-extrabold shadow-lg mb-3">
            {initial}
          </div>
          <h2 className="text-lg font-extrabold text-t1">{user.name}</h2>
          <span className={`mt-1 px-3 py-0.5 rounded-full text-[11px] font-bold ${roleBadgeColor}`}>
            {roleLabel}
          </span>
          <p className="text-xs text-t3 mt-1">{user.email}</p>
        </div>

        {/* Info card */}
        <div className="bg-card rounded-xl border border-border p-4">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-sm font-bold text-t1">ข้อมูลส่วนตัว</h3>
            {!editing ? (
              <button
                onClick={() => setEditing(true)}
                className="text-xs text-primary font-bold flex items-center gap-1"
              >
                <Icon name="edit" size={13} />
                แก้ไข
              </button>
            ) : (
              <div className="flex gap-2">
                <button
                  onClick={handleCancel}
                  className="text-xs text-t3 font-bold"
                >
                  ยกเลิก
                </button>
                <button
                  onClick={handleSave}
                  className="text-xs text-primary font-bold"
                >
                  บันทึก
                </button>
              </div>
            )}
          </div>

          <div className="space-y-3">
            {/* Name */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-full bg-blue-50 flex items-center justify-center">
                  <Icon name="profile" size={14} className="text-blue-500" />
                </div>
                <span className="text-xs text-t3">ชื่อ</span>
              </div>
              {editing ? (
                <input
                  type="text"
                  value={editName}
                  onChange={(e) => setEditName(e.target.value)}
                  className="text-sm font-bold text-t1 text-right bg-gray-50 border border-border rounded-lg px-2 py-1 w-40"
                />
              ) : (
                <span className="text-sm font-bold text-t1">{user.name}</span>
              )}
            </div>

            {/* Email */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-full bg-emerald-50 flex items-center justify-center">
                  <Icon name="mail" size={14} className="text-emerald-500" />
                </div>
                <span className="text-xs text-t3">อีเมล</span>
              </div>
              <span className="text-sm text-t2">{user.email}</span>
            </div>

            {/* Phone */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-full bg-amber-50 flex items-center justify-center">
                  <Icon name="phone" size={14} className="text-amber-500" />
                </div>
                <span className="text-xs text-t3">เบอร์โทร</span>
              </div>
              {editing ? (
                <input
                  type="tel"
                  value={editPhone}
                  onChange={(e) => setEditPhone(e.target.value)}
                  className="text-sm font-bold text-t1 text-right bg-gray-50 border border-border rounded-lg px-2 py-1 w-40"
                />
              ) : (
                <span className="text-sm font-bold text-t1">{user.phone || '081-000-0000'}</span>
              )}
            </div>

            {/* Branch */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-full bg-purple-50 flex items-center justify-center">
                  <Icon name="home" size={14} className="text-purple-500" />
                </div>
                <span className="text-xs text-t3">สาขา</span>
              </div>
              <span className="text-sm text-t2">{branch ? branch.name : user.branch}</span>
            </div>

            {/* Role */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-full bg-gray-50 flex items-center justify-center">
                  <Icon name="shield" size={14} className="text-gray-500" />
                </div>
                <span className="text-xs text-t3">บทบาท</span>
              </div>
              <span className={`px-2.5 py-0.5 rounded-full text-[11px] font-bold ${roleBadgeColor}`}>
                {roleLabel}
              </span>
            </div>
          </div>
        </div>

        {/* Stats card */}
        <div className="bg-card rounded-xl border border-border p-4">
          <h3 className="text-sm font-bold text-t1 mb-3">สถิติการขาย</h3>
          <div className="grid grid-cols-2 gap-3">
            <div className="bg-blue-50 rounded-lg p-3 text-center">
              <div className="text-xl font-extrabold text-blue-700">{totalLeads}</div>
              <div className="text-[10px] text-blue-600 font-bold">ลีดทั้งหมด</div>
            </div>
            <div className="bg-emerald-50 rounded-lg p-3 text-center">
              <div className="text-xl font-extrabold text-emerald-700">{wonDeals}</div>
              <div className="text-[10px] text-emerald-600 font-bold">ปิดการขายได้</div>
            </div>
            <div className="bg-amber-50 rounded-lg p-3 text-center">
              <div className="text-xl font-extrabold text-amber-700">{conversionRate}%</div>
              <div className="text-[10px] text-amber-600 font-bold">อัตราการแปลง</div>
            </div>
            <div className="bg-purple-50 rounded-lg p-3 text-center">
              <div className="text-xl font-extrabold text-purple-700">{thisMonthBookings}</div>
              <div className="text-[10px] text-purple-600 font-bold">จองเดือนนี้</div>
            </div>
          </div>
        </div>

        {/* Settings */}
        <div className="bg-card rounded-xl border border-border p-4">
          <h3 className="text-sm font-bold text-t1 mb-3">ตั้งค่า</h3>
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

            {/* Theme */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-full bg-amber-50 flex items-center justify-center">
                  <Icon name="sun" size={14} className="text-amber-500" />
                </div>
                <span className="text-sm text-t1">ธีม</span>
              </div>
              <span className="text-xs text-t3 font-bold bg-gray-100 px-2.5 py-1 rounded-lg">
                สว่าง (Light)
              </span>
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
