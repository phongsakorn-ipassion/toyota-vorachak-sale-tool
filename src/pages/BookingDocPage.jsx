import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import SignatureCanvas from '../components/booking/SignatureCanvas';
import { useBookingStore } from '../stores/bookingStore';
import { CARS } from '../lib/mockData';
import { formatNumber } from '../lib/formats';
import { SERVICE_CENTERS } from '../lib/thaiProvinces';

function formatThaiDateDoc(dateStr) {
  if (!dateStr) return '-';
  const d = new Date(dateStr);
  if (isNaN(d)) return '-';
  return d.toLocaleDateString('th-TH', { day: 'numeric', month: 'long', year: 'numeric' });
}

function numberToThaiText(num) {
  if (!num || num === 0) return 'ศูนย์บาทถ้วน';
  return `${formatNumber(num)} บาท`;
}

export default function BookingDocPage() {
  const { ref } = useParams();
  const navigate = useNavigate();
  const getBookingById = useBookingStore((s) => s.getBookingById);
  const updateBookingSignature = useBookingStore((s) => s.updateBookingSignature);
  const booking = getBookingById(ref);

  const [customerSig, setCustomerSig] = useState(null);
  const [isSigned, setIsSigned] = useState(false);
  const [savedSigUrl, setSavedSigUrl] = useState(booking?.signature || null);

  if (!booking) {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#F9FAFB', fontFamily: "'Sarabun', sans-serif" }}>
        <div style={{ textAlign: 'center', padding: 32 }}>
          <p style={{ fontSize: 18, fontWeight: 700, color: '#111827', marginBottom: 8 }}>ไม่พบข้อมูลการจอง</p>
          <p style={{ fontSize: 13, color: '#6B7280', marginBottom: 24 }}>Ref: {ref}</p>
          <button onClick={() => navigate(-1)} style={btnOutline}>ย้อนกลับ</button>
        </div>
      </div>
    );
  }

  const car = booking.carId ? CARS[booking.carId] : null;
  const grade = car?.subModels?.find((s) => s.id === booking.selectedGrade || s.name === booking.selectedGrade);
  const gradeName = grade ? grade.name : '';
  const gradePrice = grade ? grade.price : (car?.price || 0);
  const branch = SERVICE_CENTERS[0]; // Default to first branch
  const alreadySigned = isSigned || !!savedSigUrl;

  const handleSign = () => {
    if (!customerSig) {
      toast.error('กรุณาลงลายเซ็นก่อน');
      return;
    }
    if (updateBookingSignature) {
      updateBookingSignature(ref, customerSig);
    }
    setSavedSigUrl(customerSig);
    setIsSigned(true);
    toast.success('ลงนามเรียบร้อย');
  };

  const handlePrint = () => {
    window.print();
  };

  const handleShare = async () => {
    const url = window.location.href;
    if (navigator.share) {
      try {
        await navigator.share({
          title: `สัญญาจองรถ ${booking.ref}`,
          text: `เอกสารจองรถ Toyota - ${booking.carName} - Ref: ${booking.ref}`,
          url,
        });
      } catch (e) {
        if (e.name !== 'AbortError') toast.error('ไม่สามารถแชร์ได้');
      }
    } else {
      try {
        await navigator.clipboard.writeText(url);
        toast.success('คัดลอกลิงก์แล้ว');
      } catch {
        toast.error('ไม่สามารถคัดลอกได้');
      }
    }
  };

  return (
    <>
      <style>{`
        @media print {
          .no-print { display: none !important; }
          body { margin: 0; padding: 0; -webkit-print-color-adjust: exact; print-color-adjust: exact; }
          .doc-page { box-shadow: none !important; margin: 0 !important; border-radius: 0 !important; max-width: 100% !important; }
        }
        .doc-page { font-family: 'Sarabun', sans-serif; }
        .doc-table { width: 100%; border-collapse: collapse; }
        .doc-table td { padding: 6px 8px; font-size: 13px; vertical-align: top; }
        .doc-table .label { color: #6B7280; width: 140px; white-space: nowrap; }
        .doc-table .value { color: #111827; font-weight: 600; border-bottom: 1px dotted #D1D5DB; }
        .section-title { font-size: 14px; font-weight: 800; color: #111827; padding: 10px 0 6px; border-bottom: 2px solid #E50012; margin-bottom: 4px; }
      `}</style>

      <div style={{ minHeight: '100vh', background: '#F3F4F6', padding: '16px 8px 100px' }}>
        <div className="doc-page" style={{
          maxWidth: 720, margin: '0 auto', background: '#fff',
          borderRadius: 12, boxShadow: '0 1px 4px rgba(0,0,0,0.08)',
          padding: '32px 28px',
        }}>
          {/* Header */}
          <div style={{ textAlign: 'center', marginBottom: 24 }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 12, marginBottom: 8 }}>
              <img
                src="https://upload.wikimedia.org/wikipedia/commons/thumb/e/ee/Toyota_logo_%28Red%29.svg/200px-Toyota_logo_%28Red%29.svg.png"
                alt="Toyota"
                style={{ height: 40 }}
                onError={(e) => { e.target.style.display = 'none'; }}
              />
            </div>
            <h1 style={{ fontSize: 20, fontWeight: 800, color: '#111827', margin: '4px 0' }}>
              สัญญาจองรถยนต์ใหม่ TOYOTA
            </h1>
            <p style={{ fontSize: 12, color: '#6B7280', margin: 0 }}>NEW CAR BOOKING AGREEMENT</p>
          </div>

          {/* Doc Meta */}
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12, color: '#374151', marginBottom: 16, padding: '8px 12px', background: '#F9FAFB', borderRadius: 8 }}>
            <div>
              <span style={{ color: '#6B7280' }}>เลขที่: </span>
              <span style={{ fontWeight: 700, color: '#E50012' }}>{booking.ref}</span>
            </div>
            <div>
              <span style={{ color: '#6B7280' }}>วันที่จอง: </span>
              <span style={{ fontWeight: 700 }}>{formatThaiDateDoc(booking.createdAt)}</span>
            </div>
          </div>

          {/* Dealer Info */}
          <div style={{ fontSize: 12, color: '#374151', marginBottom: 20, padding: '10px 12px', border: '1px solid #E5E7EB', borderRadius: 8 }}>
            <p style={{ margin: '0 0 2px', fontWeight: 700 }}>ผู้จำหน่าย (Dealer)</p>
            <p style={{ margin: '0 0 2px' }}>บริษัท โตโยต้า วรจักร์ยนต์ จำกัด</p>
            <p style={{ margin: '0 0 2px', color: '#6B7280' }}>{branch?.address || '123 ถ.ลาดพร้าว แขวงจอมพล เขตจตุจักร กรุงเทพฯ 10900'}</p>
            <p style={{ margin: 0, color: '#6B7280' }}>โทร: {branch?.phone || '02-123-4567'} | ผู้รับจอง: มาลี รักดี</p>
          </div>

          {/* Section 1: Customer Info */}
          <div className="section-title">1. รายละเอียดลูกค้า (ผู้จอง)</div>
          <table className="doc-table">
            <tbody>
              <tr>
                <td className="label">ชื่อผู้จอง</td>
                <td className="value">{booking.customerName || booking.customerInfo?.name || '-'}</td>
              </tr>
              <tr>
                <td className="label">โทรศัพท์มือถือ</td>
                <td className="value">{booking.customerPhone || booking.customerInfo?.phone || '-'}</td>
              </tr>
              <tr>
                <td className="label">Email</td>
                <td className="value">{booking.customerEmail || booking.customerInfo?.email || '-'}</td>
              </tr>
            </tbody>
          </table>

          {/* Section 2: Car Details */}
          <div className="section-title" style={{ marginTop: 16 }}>2. รายละเอียดรถยนต์ที่จอง</div>
          <table className="doc-table">
            <tbody>
              <tr>
                <td className="label">ยี่ห้อ</td>
                <td className="value">TOYOTA</td>
              </tr>
              <tr>
                <td className="label">รุ่น</td>
                <td className="value">{car?.name || booking.carName || '-'}{gradeName ? ` — ${gradeName}` : ''}</td>
              </tr>
              <tr>
                <td className="label">สีรถยนต์</td>
                <td className="value">
                  <span style={{ display: 'inline-flex', alignItems: 'center', gap: 6 }}>
                    {booking.selectedColor || booking.color || 'Pearl White'}
                  </span>
                </td>
              </tr>
              <tr>
                <td className="label">แบบ</td>
                <td className="value">{car?.type || '-'}</td>
              </tr>
            </tbody>
          </table>

          {/* Section 3: Deposit Details */}
          <div className="section-title" style={{ marginTop: 16 }}>3. รายละเอียดเงินมัดจำ</div>
          <table className="doc-table">
            <tbody>
              <tr>
                <td className="label">จำนวนเงินมัดจำ</td>
                <td className="value">฿5,000</td>
              </tr>
              <tr>
                <td className="label">ชำระโดย</td>
                <td className="value">
                  {booking.paymentMethod === 'qr' ? 'QR PromptPay' :
                   booking.paymentMethod === 'transfer' ? 'โอนเงิน' :
                   booking.paymentMethod === 'cash' ? 'เงินสด' :
                   booking.paymentMethod === 'installment' ? 'สินเชื่อ' : booking.paymentMethod || '-'}
                </td>
              </tr>
              <tr>
                <td className="label">วันที่ชำระ</td>
                <td className="value">{formatThaiDateDoc(booking.createdAt)}</td>
              </tr>
            </tbody>
          </table>

          {/* Section 4: Payment Details */}
          <div className="section-title" style={{ marginTop: 16 }}>4. รายละเอียดราคา</div>
          <table className="doc-table">
            <tbody>
              <tr>
                <td className="label">ราคารถยนต์</td>
                <td className="value">฿{formatNumber(gradePrice || booking.carPrice || 0)}</td>
              </tr>
              <tr>
                <td className="label">เงินดาวน์</td>
                <td className="value">฿{formatNumber(booking.downPayment || 0)} ({booking.downPaymentPct || 0}%)</td>
              </tr>
              <tr>
                <td className="label">ดอกเบี้ย</td>
                <td className="value">{booking.interestRate || 0}% ต่อปี</td>
              </tr>
              <tr>
                <td className="label">ผ่อน/เดือน</td>
                <td className="value">฿{formatNumber(booking.monthlyPayment || 0)} x {booking.loanTermMonths || booking.loanTerm || 60} เดือน</td>
              </tr>
              <tr>
                <td className="label">กำหนดส่งมอบ</td>
                <td className="value">{booking.deliveryDate ? formatThaiDateDoc(booking.deliveryDate) : 'ภายใน 14-21 วัน'}</td>
              </tr>
            </tbody>
          </table>

          {/* Section 5: Signatures */}
          <div className="section-title" style={{ marginTop: 24 }}>5. ลงชื่อ (Signatures)</div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 24, marginTop: 12 }}>
            {/* Customer Signature */}
            <div>
              <p style={{ fontSize: 12, fontWeight: 700, color: '#374151', marginBottom: 8 }}>ผู้จอง (Customer)</p>
              {alreadySigned && savedSigUrl ? (
                <div style={{ border: '1.5px solid #D1D5DB', borderRadius: 12, padding: 8, background: '#FAFAFA', minHeight: 140, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <img src={savedSigUrl} alt="Customer Signature" style={{ maxWidth: '100%', maxHeight: 130 }} />
                </div>
              ) : (
                <SignatureCanvas
                  onSignatureChange={setCustomerSig}
                  height={140}
                  disabled={alreadySigned}
                />
              )}
              <p style={{ fontSize: 11, color: '#6B7280', marginTop: 6, textAlign: 'center' }}>
                ({booking.customerName || booking.customerInfo?.name || '.........................'})
              </p>
            </div>

            {/* Sales Signature */}
            <div>
              <p style={{ fontSize: 12, fontWeight: 700, color: '#374151', marginBottom: 8 }}>ผู้รับจอง (Sales)</p>
              <div style={{
                border: '1.5px solid #D1D5DB', borderRadius: 12, padding: 8,
                background: '#FAFAFA', minHeight: 140, display: 'flex',
                alignItems: 'center', justifyContent: 'center',
              }}>
                <p style={{ fontFamily: "'Sarabun', cursive", fontSize: 22, fontWeight: 700, color: '#374151', fontStyle: 'italic' }}>
                  มาลี รักดี
                </p>
              </div>
              <p style={{ fontSize: 11, color: '#6B7280', marginTop: 6, textAlign: 'center' }}>
                (มาลี รักดี)
              </p>
            </div>
          </div>

          {/* Terms */}
          <div style={{ marginTop: 24, padding: '12px 16px', background: '#F9FAFB', borderRadius: 8, fontSize: 11, color: '#6B7280', lineHeight: 1.6 }}>
            <p style={{ fontWeight: 700, color: '#374151', marginBottom: 4 }}>เงื่อนไขการจอง</p>
            <p style={{ margin: 0 }}>1. เงินมัดจำจะไม่สามารถขอคืนได้ หากผู้จองยกเลิกการจอง</p>
            <p style={{ margin: 0 }}>2. ผู้จองต้องชำระเงินส่วนที่เหลือภายในระยะเวลาที่กำหนด</p>
            <p style={{ margin: 0 }}>3. ราคารถยนต์อาจเปลี่ยนแปลงตามประกาศของ บริษัท โตโยต้า มอเตอร์ ประเทศไทย จำกัด</p>
            <p style={{ margin: 0 }}>4. กำหนดส่งมอบอาจเปลี่ยนแปลงตามสถานการณ์การผลิตและจัดส่ง</p>
          </div>

          {/* Signed badge */}
          {alreadySigned && (
            <div style={{ textAlign: 'center', marginTop: 20 }}>
              <span style={{
                display: 'inline-block', padding: '6px 20px',
                background: '#DEF7EC', color: '#03543F', fontSize: 13,
                fontWeight: 700, borderRadius: 20, border: '1px solid #A7F3D0',
              }}>
                ลงนามเรียบร้อยแล้ว
              </span>
            </div>
          )}
        </div>

        {/* Action Buttons */}
        <div className="no-print" style={{
          maxWidth: 720, margin: '16px auto 0', display: 'flex', flexDirection: 'column', gap: 8,
          padding: '0 8px',
        }}>
          {!alreadySigned && (
            <button onClick={handleSign} style={btnPrimary}>
              ยืนยันและลงนาม
            </button>
          )}
          <button onClick={handlePrint} style={btnOutline}>
            พิมพ์ / Print
          </button>
          <button onClick={handleShare} style={btnOutline}>
            แชร์
          </button>
          <button onClick={() => navigate(-1)} style={{ ...btnOutline, color: '#6B7280', borderColor: '#D1D5DB' }}>
            ย้อนกลับ
          </button>
        </div>
      </div>
    </>
  );
}

const btnPrimary = {
  width: '100%', padding: '12px 0', fontSize: 14, fontWeight: 700,
  color: '#fff', background: '#E50012', border: 'none', borderRadius: 10,
  cursor: 'pointer', fontFamily: "'Sarabun', sans-serif",
};

const btnOutline = {
  width: '100%', padding: '12px 0', fontSize: 14, fontWeight: 700,
  color: '#E50012', background: '#fff', border: '1.5px solid #E50012',
  borderRadius: 10, cursor: 'pointer', fontFamily: "'Sarabun', sans-serif",
};
