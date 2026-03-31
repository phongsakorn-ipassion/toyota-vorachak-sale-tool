import React from 'react';
import { useParams } from 'react-router-dom';
import { useBookingStore } from '../stores/bookingStore';
import { CARS } from '../lib/mockData';
import { formatNumber } from '../lib/formats';

export default function BookingViewPage() {
  const { ref } = useParams();
  const getBookingById = useBookingStore((s) => s.getBookingById);
  const booking = getBookingById(ref);

  const car = booking?.carId ? CARS[booking.carId] : null;
  const fmt = (n) => formatNumber(n);

  const formatThaiDate = (dateStr) => {
    if (!dateStr) return '-';
    const d = new Date(dateStr);
    if (isNaN(d.getTime())) return dateStr;
    const months = ['มกราคม','กุมภาพันธ์','มีนาคม','เมษายน','พฤษภาคม','มิถุนายน','กรกฎาคม','สิงหาคม','กันยายน','ตุลาคม','พฤศจิกายน','ธันวาคม'];
    return `${d.getDate()} ${months[d.getMonth()]} ${d.getFullYear() + 543}`;
  };

  const statusBadge = {
    confirmed: { label: 'ยืนยันแล้ว', bg: '#F0FDF4', color: '#16A34A', border: '#BBF7D0' },
    pending: { label: 'รอดำเนินการ', bg: '#FFFBEB', color: '#D97706', border: '#FDE68A' },
    cancelled: { label: 'ยกเลิก', bg: '#FEF2F2', color: '#DC2626', border: '#FECACA' },
  };

  if (!booking) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col">
        <div className="bg-white border-b border-gray-200 px-4 py-4 flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-red-500 to-red-600 flex items-center justify-center text-white font-bold text-sm shadow">T</div>
          <div>
            <h1 className="text-[16px] font-extrabold text-gray-900">รายละเอียดการจอง</h1>
            <p className="text-[11px] text-gray-500">Booking Details</p>
          </div>
        </div>
        <div className="flex-1 flex flex-col items-center justify-center p-6">
          <div className="w-16 h-16 rounded-full bg-gray-100 flex items-center justify-center mb-4">
            <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#9CA3AF" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="11" cy="11" r="8" />
              <line x1="21" y1="21" x2="16.65" y2="16.65" />
            </svg>
          </div>
          <h2 className="text-[16px] font-extrabold text-gray-700 mb-1">ไม่พบข้อมูลการจอง</h2>
          <p className="text-[12px] text-gray-400">Booking reference "{ref}" not found</p>
        </div>
        <div className="px-4 py-4 text-center border-t border-gray-200 bg-white">
          <p className="text-[11px] text-gray-400">Toyota Sale Tool v1.0 | วรจักร์ยนต์</p>
        </div>
      </div>
    );
  }

  const st = statusBadge[booking.status] || statusBadge.pending;

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 px-4 py-4 flex items-center gap-3">
        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-red-500 to-red-600 flex items-center justify-center text-white font-bold text-sm shadow">T</div>
        <div>
          <h1 className="text-[16px] font-extrabold text-gray-900">รายละเอียดการจอง</h1>
          <p className="text-[11px] text-gray-500">Booking Details</p>
        </div>
      </div>

      <div className="flex-1 px-4 py-5 space-y-3">
        {/* Ref & Status */}
        <div className="bg-white rounded-xl border border-gray-200 p-4 shadow-sm">
          <div className="flex items-center justify-between mb-3">
            <span className="text-[11px] text-gray-400 font-semibold">เลขที่จอง</span>
            <span className="text-[14px] font-extrabold text-green-700 bg-green-50 px-3 py-1 rounded-full">{booking.ref}</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-[11px] text-gray-400 font-semibold">สถานะ</span>
            <span
              className="text-[12px] font-bold px-3 py-1 rounded-full"
              style={{ backgroundColor: st.bg, color: st.color, border: `1px solid ${st.border}` }}
            >
              {st.label}
            </span>
          </div>
          <div className="flex items-center justify-between mt-3">
            <span className="text-[11px] text-gray-400 font-semibold">วันที่จอง</span>
            <span className="text-[13px] font-bold text-gray-900">{formatThaiDate(booking.createdAt)}</span>
          </div>
        </div>

        {/* Car details */}
        <div className="bg-white rounded-xl border border-gray-200 p-4 shadow-sm">
          <h3 className="text-[13px] font-extrabold text-gray-900 mb-3">ข้อมูลรถ</h3>
          {[
            ['รุ่น', booking.carName || car?.name || '-'],
            ['สี', booking.color || '-'],
            ['ราคา', car ? `฿${fmt(car.price)}` : (booking.carPrice ? `฿${fmt(booking.carPrice)}` : '-')],
          ].map(([label, value]) => (
            <div key={label} className="flex justify-between py-2 border-b border-gray-100 last:border-b-0 text-[12px]">
              <span className="text-gray-500">{label}</span>
              <span className="text-gray-900 font-bold">{value}</span>
            </div>
          ))}
        </div>

        {/* Finance details */}
        <div className="bg-white rounded-xl border border-gray-200 p-4 shadow-sm">
          <h3 className="text-[13px] font-extrabold text-gray-900 mb-3">รายละเอียดการผ่อน</h3>
          {[
            ['เงินดาวน์', booking.downPayment ? `฿${fmt(booking.downPayment)} (${booking.downPaymentPct || '-'}%)` : '-'],
            ['ผ่อน/เดือน', booking.monthlyPayment ? `฿${fmt(booking.monthlyPayment)} x ${booking.loanTermMonths || booking.loanTerm || '-'} เดือน` : '-'],
            ['กำหนดส่งมอบ', booking.deliveryDate ? new Date(booking.deliveryDate).toLocaleDateString('th-TH', { day: 'numeric', month: 'long', year: 'numeric' }) : '-'],
          ].map(([label, value]) => (
            <div key={label} className="flex justify-between py-2 border-b border-gray-100 last:border-b-0 text-[12px]">
              <span className="text-gray-500">{label}</span>
              <span className="text-gray-900 font-bold">{value}</span>
            </div>
          ))}
        </div>

        {/* ศูนย์บริการ */}
        <div className="bg-white rounded-xl border border-gray-200 p-4 shadow-sm">
          <h3 className="text-[13px] font-extrabold text-gray-900 mb-3">ศูนย์บริการ</h3>
          <div className="flex justify-between py-2 text-[12px]">
            <span className="text-gray-500">สาขา</span>
            <span className="text-gray-900 font-bold">{booking.customerInfo?.selectedCenter || 'วรจักร์ยนต์ สาขาลาดพร้าว'}</span>
          </div>
        </div>

        {/* Customer */}
        <div className="bg-white rounded-xl border border-gray-200 p-4 shadow-sm">
          <h3 className="text-[13px] font-extrabold text-gray-900 mb-3">ลูกค้า</h3>
          {[
            ['ชื่อ', booking.customerName || booking.customerInfo?.name || '-'],
            ['โทร', booking.customerPhone || booking.customerInfo?.phone || '-'],
            ['อีเมล', booking.customerEmail || booking.customerInfo?.email || '-'],
          ].map(([label, value]) => (
            <div key={label} className="flex justify-between py-2 border-b border-gray-100 last:border-b-0 text-[12px]">
              <span className="text-gray-500">{label}</span>
              <span className="text-gray-900 font-bold">{value}</span>
            </div>
          ))}
        </div>

        {/* พนักงานขาย */}
        <div className="bg-white rounded-xl border border-gray-200 p-4 shadow-sm">
          <h3 className="text-[13px] font-extrabold text-gray-900 mb-3">พนักงานขาย</h3>
          {[
            ['ชื่อ', 'มาลี รักดี'],
            ['โทร', '081-234-5678'],
            ['อีเมล', 'malee@vorachak.co.th'],
          ].map(([label, value]) => (
            <div key={label} className="flex justify-between py-2 border-b border-gray-100 last:border-b-0 text-[12px]">
              <span className="text-gray-500">{label}</span>
              <span className="text-gray-900 font-bold">{value}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Footer */}
      <div className="px-4 py-4 text-center border-t border-gray-200 bg-white">
        <p className="text-[11px] text-gray-400">Toyota Sale Tool v1.0 | วรจักร์ยนต์</p>
      </div>
    </div>
  );
}
