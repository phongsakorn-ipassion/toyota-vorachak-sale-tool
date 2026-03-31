import React, { useMemo, useState, useCallback, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../stores/authStore';
import { useLeadStore } from '../stores/leadStore';
import { useBookingStore } from '../stores/bookingStore';
import { CARS, carPlaceholder } from '../lib/mockData';
import { TEST_DRIVE_STATUSES } from '../lib/constants';
import { SERVICE_CENTERS } from '../lib/thaiProvinces';
import { formatNumber, formatCurrency } from '../lib/formats';
import Icon from '../components/icons/Icon';
import { useVisibilityRefresh } from '../hooks/useVisibilityRefresh';

export default function SalesDashboard() {
  const [, forceUpdate] = useState(0);
  useVisibilityRefresh(useCallback(() => forceUpdate(n => n + 1), []));
  const navigate = useNavigate();
  const user = useAuthStore((s) => s.user);
  const leads = useLeadStore((s) => s.leads);
  const getLeadStats = useLeadStore((s) => s.getLeadStats);
  const setFilterType = useLeadStore((s) => s.setFilterType);
  const bookings = useBookingStore((s) => s.bookings);
  const stats = getLeadStats();

  // Commission reveal state
  const [showCommission, setShowCommission] = useState(false);
  const commissionTimerRef = useRef(null);
  const carouselRef = useRef(null);
  const [carouselIdx, setCarouselIdx] = useState(0);

  // Dashboard lead type filter
  const [dashLeadType, setDashLeadType] = useState('purchase');

  useEffect(() => {
    return () => {
      if (commissionTimerRef.current) clearTimeout(commissionTimerRef.current);
    };
  }, []);

  const handleRevealCommission = async () => {
    try {
      // Try Web Authentication API (biometric: Face ID, Touch ID, fingerprint)
      if (window.PublicKeyCredential && navigator.credentials) {
        const credential = await navigator.credentials.create({
          publicKey: {
            challenge: crypto.getRandomValues(new Uint8Array(32)),
            rp: { name: 'Toyota Sale Tool' },
            user: {
              id: new Uint8Array(16),
              name: user?.name || 'user',
              displayName: user?.name || 'User',
            },
            pubKeyCredParams: [{ alg: -7, type: 'public-key' }],
            authenticatorSelection: {
              authenticatorAttachment: 'platform',
              userVerification: 'required',
            },
            timeout: 60000,
          },
        });
        if (credential) {
          setShowCommission(true);
          if (commissionTimerRef.current) clearTimeout(commissionTimerRef.current);
          commissionTimerRef.current = setTimeout(() => setShowCommission(false), 10000);
          return;
        }
      }
    } catch (e) {
      // Biometric not available or user cancelled — fall through to PIN
      console.log('Biometric auth unavailable:', e.message);
    }

    // Fallback: PIN entry if biometric unavailable
    const pin = prompt('ไม่สามารถใช้ Biometric ได้\nกรุณาใส่รหัส PIN (4 หลัก)');
    if (pin === '1234') {
      setShowCommission(true);
      if (commissionTimerRef.current) clearTimeout(commissionTimerRef.current);
      commissionTimerRef.current = setTimeout(() => setShowCommission(false), 10000);
    } else if (pin !== null) {
      alert('รหัส PIN ไม่ถูกต้อง');
    }
  };

  // 3.1.1: Commission from actual Won purchase leads only
  const wonLeads = useMemo(() =>
    leads.filter((l) => (l.leadType || 'purchase') === 'purchase' && l.level === 'won'),
    [leads]
  );
  const unitsSold = wonLeads.length;
  const personalTarget = 70;
  const remaining = Math.max(0, personalTarget - unitsSold);
  const progressPct = personalTarget > 0 ? Math.round((unitsSold / personalTarget) * 100) : 0;

  // Commission: 2% of total car prices for won purchase leads
  const commission = useMemo(() => {
    return wonLeads.reduce((sum, l) => {
      const car = l.car ? CARS[l.car] : null;
      return sum + (car ? Math.round(car.price * 0.02) : 0);
    }, 0);
  }, [wonLeads]);

  // Today's bookings
  const todayBookings = useMemo(() => {
    const today = new Date().toISOString().slice(0, 10);
    return bookings.filter((b) => b.status === 'confirmed' && b.createdAt && b.createdAt.slice(0, 10) === today);
  }, [bookings]);

  // Today's test drives
  const todayDrives = useMemo(() => {
    const today = new Date().toISOString().slice(0, 10);
    return leads
      .filter((l) => l.leadType === 'test_drive' && l.testDriveDate === today && l.level !== 'cancelled' && l.level !== 'no_show')
      .sort((a, b) => (a.testDriveTime || '').localeCompare(b.testDriveTime || ''));
  }, [leads]);

  // Sort helper: by serviceDate+serviceTime ascending (upcoming first), fallback to createdAt
  const sortByServiceDate = (a, b) => {
    const dateA = a.serviceDate || '';
    const dateB = b.serviceDate || '';
    if (dateA && dateB) {
      const cmp = dateA.localeCompare(dateB);
      if (cmp !== 0) return cmp;
      const timeA = a.serviceTime || '99:99';
      const timeB = b.serviceTime || '99:99';
      return timeA.localeCompare(timeB);
    }
    if (dateA && !dateB) return -1;
    if (!dateA && dateB) return 1;
    // Both no serviceDate: sort by createdAt descending
    const ca = a.createdAt || '';
    const cb = b.createdAt || '';
    return cb.localeCompare(ca);
  };

  // Hot leads sorted by service date/time
  const hotLeads = useMemo(() =>
    leads.filter((l) => l.level === 'hot').sort(sortByServiceDate),
    [leads]
  );
  const featLead = hotLeads[0] || leads[0];
  const featCar = featLead ? CARS[featLead.car] : null;

  // 3.2.1: Filtered lead list for "รายการล่าสุด" section
  const purchaseLeads = useMemo(() =>
    leads.filter((l) => (l.leadType || 'purchase') === 'purchase' && ['hot', 'warm', 'cool'].includes(l.level))
      .sort(sortByServiceDate),
    [leads]
  );

  const testDriveLeads = useMemo(() =>
    leads.filter((l) => l.leadType === 'test_drive' && ['scheduled', 'confirmed'].includes(l.level))
      .sort((a, b) => {
        // Sort by testDriveDate + testDriveTime ascending
        const dateA = a.testDriveDate || '';
        const dateB = b.testDriveDate || '';
        if (dateA !== dateB) return dateA.localeCompare(dateB);
        return (a.testDriveTime || '').localeCompare(b.testDriveTime || '');
      }),
    [leads]
  );

  const dashLeadList = dashLeadType === 'purchase' ? purchaseLeads.slice(0, 5) : testDriveLeads.slice(0, 5);
  const purchaseCount = purchaseLeads.length;
  const testDriveCount = testDriveLeads.length;

  // Image error fallback handler
  const handleImgError = (e, carName) => {
    e.target.onerror = null;
    e.target.src = carPlaceholder(carName || 'Toyota', '#f0f0f0');
  };

  // Helper: get service center name by id
  const getCenterName = (centerId) => {
    const center = SERVICE_CENTERS.find(c => c.id === centerId);
    return center ? center.name.replace('โตโยต้า วรจักร์ยนต์ ', '') : '';
  };

  // Navigate to leads with filter type set
  const handleViewAll = () => {
    setFilterType(dashLeadType);
    navigate('/leads');
  };

  return (
    <div className="screen-enter">
      {/* Header */}
      <div className="bg-white px-4 py-[13px] flex items-center gap-[11px] border-b border-border">
        <div className="w-[42px] h-[42px] rounded-full bg-primary flex items-center justify-center text-[15px] font-extrabold text-white flex-shrink-0">
          {user?.init || 'ม'}
        </div>
        <div className="flex-1">
          <h2 className="text-[15px] font-extrabold text-t1">สวัสดี {user?.name || 'มาลี'}</h2>
          <p className="text-[11px] text-t2 mt-[1px]">วรจักร์ยนต์ · มีนาคม 2026</p>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto px-4 pt-4 pb-24" style={{ WebkitOverflowScrolling: 'touch' }}>
        {/* Target Card */}
        <div className="bg-primary rounded-lg p-[18px] mb-3 relative overflow-hidden">
          <div className="absolute -top-5 -right-5 w-[120px] h-[120px] rounded-full bg-white/[.07]" />
          <div className="absolute -bottom-[30px] right-[30px] w-[80px] h-[80px] rounded-full bg-white/[.05]" />
          <p className="text-[11px] text-white/65 font-semibold">ยอดขายเดือนนี้ / Monthly Target</p>
          <p className="text-[34px] font-extrabold text-white leading-none">{unitsSold} <span className="text-[14px]">units</span></p>
          <p className="text-[12px] text-white/60 mt-[1px]">เป้าหมาย / Target: {personalTarget} units</p>
          <div className="h-[5px] bg-white/20 rounded-[3px] mt-[11px] mb-[10px]">
            <div className="h-full bg-white rounded-[3px]" style={{ width: `${Math.min(progressPct, 100)}%` }} />
          </div>
          <div className="flex gap-6">
            <div><p className="text-[18px] font-extrabold text-white">{todayBookings.length}</p><p className="text-[10px] text-white/60">จองวันนี้</p></div>
            <div><p className="text-[18px] font-extrabold text-white">{stats.hot}</p><p className="text-[10px] text-white/60">Hot Leads</p></div>
            <div><p className="text-[18px] font-extrabold text-white">{remaining}</p><p className="text-[10px] text-white/60">เหลืออีก</p></div>
          </div>
        </div>

        {/* Quick Actions — only A-Card and รุ่นรถ */}
        <div className="sec-lbl">Quick Actions</div>
        <div className="grid grid-cols-2 gap-2 mb-3">
          {[
            { label: 'A-Card ใหม่', icon: 'clip', path: '/acard' },
            { label: 'รุ่นรถ', icon: 'car', path: '/catalog' },
          ].map((a) => (
            <button key={a.label} onClick={() => navigate(a.path)} className="bg-white border border-border rounded-lg p-[14px] text-center cursor-pointer active:opacity-70 transition-opacity">
              <div className="flex justify-center mb-[5px] text-primary"><Icon name={a.icon} size={22} /></div>
              <div className="text-[11px] font-bold text-t1 leading-tight">{a.label}</div>
            </button>
          ))}
        </div>

        {/* Hot Leads */}
        <div className="flex items-center justify-between mb-[10px] mt-1">
          <div className="card-title"><Icon name="flame" size={16} className="text-hot" /> Hot Leads</div>
          <button onClick={() => navigate('/leads')} className="text-[12px] font-bold text-primary cursor-pointer">ดูทั้งหมด &rarr;</button>
        </div>

        {/* Hot Leads Carousel */}
        {hotLeads.length > 0 && (
          <>
            <div
              ref={carouselRef}
              className="flex gap-3 overflow-x-auto pb-2 mb-1"
              style={{ scrollSnapType: 'x mandatory', WebkitOverflowScrolling: 'touch', scrollbarWidth: 'none', msOverflowStyle: 'none' }}
              onScroll={() => {
                if (!carouselRef.current) return;
                const idx = Math.round(carouselRef.current.scrollLeft / carouselRef.current.offsetWidth);
                setCarouselIdx(idx);
              }}
            >
              {hotLeads.slice(0, 8).map((hl) => {
                const hlCar = CARS[hl.car];
                return (
                  <div
                    key={hl.id}
                    onClick={() => navigate(`/lead/${hl.id}`)}
                    className="bg-white border border-border rounded-lg overflow-hidden cursor-pointer active:opacity-80 transition-opacity flex-shrink-0"
                    style={{ scrollSnapAlign: 'start', width: 'calc(100% - 16px)', minWidth: 'calc(100% - 16px)' }}
                  >
                    <div className="relative h-[140px] flex items-center justify-center border-b border-border" style={{ background: 'linear-gradient(135deg,#F0FAF3 0%,#E8F5EC 50%,#DCF0E2 100%)' }}>
                      {hlCar && (
                        <img
                          src={hlCar.img}
                          alt={hlCar.name}
                          className="w-[60%] max-w-[200px] object-cover"
                          style={{ filter: 'drop-shadow(0 6px 20px rgba(0,0,0,.12))' }}
                          onError={(e) => handleImgError(e, hlCar.name)}
                        />
                      )}
                      <span className="absolute top-3 left-3 px-[10px] py-1 rounded-pill text-[10px] font-bold text-white bg-transit flex items-center gap-1"><Icon name="flame" size={10} /> HOT</span>
                    </div>
                    <div className="p-[12px]">
                      <p className="text-[15px] font-extrabold text-t1">{hl.name}</p>
                      <p className="text-[11px] text-t2 mt-[2px] flex items-center gap-1"><Icon name="walk" size={11} /> {hl.source || 'Walk-in'}</p>
                      <div className="flex items-center justify-between mt-[8px]">
                        <span className="badge-hot">HOT</span>
                        <span className="text-[10px] text-t3">
                          {hl.serviceTime ? `${hl.serviceTime} น.` : ''}{hl.serviceDate ? ` ${hl.serviceDate.slice(5)}` : ''}
                        </span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
            {/* Dot indicators */}
            {hotLeads.length > 1 && (
              <div className="flex justify-center gap-[6px] mb-3">
                {hotLeads.slice(0, 8).map((_, i) => (
                  <span key={i} className={`w-[6px] h-[6px] rounded-full transition-colors ${i === carouselIdx ? 'bg-primary' : 'bg-border'}`} />
                ))}
              </div>
            )}
          </>
        )}

        {/* 3.2.1: รายการล่าสุด (Latest Records) with filter tabs */}
        <div className="card-base">
          <div className="card-hd">
            <span className="card-title">รายการล่าสุด</span>
            <button onClick={handleViewAll} className="text-[12px] font-bold text-primary cursor-pointer">ดูทั้งหมด</button>
          </div>

          {/* Toggle filter tabs */}
          <div className="flex gap-2 mb-3">
            <button
              onClick={() => setDashLeadType('purchase')}
              className={`flex-1 py-[7px] rounded-lg text-[11px] font-bold text-center cursor-pointer transition-all ${dashLeadType === 'purchase' ? 'bg-primary text-white' : 'bg-white border border-border text-t2'}`}
            >
              ลูกค้า ({purchaseCount})
            </button>
            <button
              onClick={() => setDashLeadType('test_drive')}
              className={`flex-1 py-[7px] rounded-lg text-[11px] font-bold text-center cursor-pointer transition-all ${dashLeadType === 'test_drive' ? 'bg-primary text-white' : 'bg-white border border-border text-t2'}`}
            >
              ทดลองขับ ({testDriveCount})
            </button>
          </div>

          {/* Filtered lead list */}
          {dashLeadList.length === 0 && (
            <div className="py-6 text-center">
              <Icon name={dashLeadType === 'test_drive' ? 'steering' : 'users'} size={24} className="text-t3 mx-auto mb-2" />
              <p className="text-[12px] text-t3">ไม่มีรายการ</p>
            </div>
          )}

          {dashLeadType === 'purchase' && dashLeadList.map((lead) => {
            const car = lead.car ? CARS[lead.car] : null;
            return (
              <div key={lead.id} onClick={() => navigate(`/lead/${lead.id}`)} className="flex items-center gap-[11px] py-[11px] border-b border-border last:border-b-0 cursor-pointer">
                <div className="w-[42px] h-[42px] rounded-full flex items-center justify-center text-[15px] font-extrabold text-white flex-shrink-0" style={{ background: lead.color || '#6B7280' }}>{lead.init || lead.name?.charAt(0) || '?'}</div>
                <div className="flex-1 min-w-0">
                  <p className="text-[13px] font-bold text-t1">{lead.name}</p>
                  <p className="text-[11px] text-t2 mt-[2px] flex items-center gap-1"><Icon name="car" size={11} /> {car ? car.name : 'N/A'} · {car ? car.priceLabel : ''}</p>
                </div>
                <div className="flex flex-col items-end gap-1 flex-shrink-0">
                  <span className={`badge-${lead.level}`}>{lead.level === 'hot' ? 'Hot' : lead.level === 'cool' ? 'Cool' : 'Warm'}</span>
                  <span className="text-[10px] text-t3">
                    {lead.serviceTime || ''}{lead.serviceDate ? ` · ${lead.serviceDate.slice(5)}` : ''}
                  </span>
                </div>
              </div>
            );
          })}

          {dashLeadType === 'test_drive' && dashLeadList.map((lead) => {
            const car = lead.car ? CARS[lead.car] : null;
            const statusInfo = TEST_DRIVE_STATUSES[lead.level] || {};
            return (
              <div key={lead.id} onClick={() => navigate(`/lead/${lead.id}`)} className="flex items-center gap-[11px] py-[11px] border-b border-border last:border-b-0 cursor-pointer">
                <div className="w-[42px] h-[42px] rounded-full flex items-center justify-center text-[15px] font-extrabold text-white flex-shrink-0" style={{ background: lead.color || '#6B7280' }}>{lead.init || lead.name?.charAt(0) || '?'}</div>
                <div className="flex-1 min-w-0">
                  <p className="text-[13px] font-bold text-t1">{lead.name}</p>
                  <p className="text-[11px] text-t2 mt-[2px] flex items-center gap-1"><Icon name="car" size={11} /> {car ? car.name : 'N/A'}</p>
                  <p className="text-[10px] text-t3 mt-[1px] flex items-center gap-1">
                    <Icon name="pin" size={10} /> {getCenterName(lead.serviceCenter) || 'สาขาลาดพร้าว'}
                  </p>
                </div>
                <div className="flex flex-col items-end gap-1 flex-shrink-0">
                  <span className={`badge-${lead.level}`}>
                    {statusInfo.label || lead.level}
                  </span>
                  <span className="text-[10px] text-t3">
                    {lead.testDriveTime || ''}{lead.testDriveDate ? ` · ${lead.testDriveDate.slice(5)}` : ''}
                  </span>
                </div>
              </div>
            );
          })}
        </div>

        {/* Test Drives Today */}
        {todayDrives.length > 0 && (
          <div className="card-base">
            <div className="card-hd">
              <span className="card-title flex items-center gap-2"><Icon name="steering" size={16} /> ทดลองขับวันนี้</span>
            </div>
            {todayDrives.map(td => (
              <div key={td.id} onClick={() => navigate(`/lead/${td.id}`)} className="flex items-center gap-3 py-3 border-b border-border last:border-b-0 cursor-pointer">
                <div className="text-[14px] font-bold text-primary w-[50px]">{td.testDriveTime}</div>
                <div className="flex-1">
                  <p className="text-[12px] font-bold text-t1">{td.name}</p>
                  <p className="text-[10px] text-t3">{CARS[td.car]?.name || td.car}</p>
                </div>
                <span className={`badge-${td.level}`}>
                  {(TEST_DRIVE_STATUSES[td.level] || {}).label || td.level}
                </span>
              </div>
            ))}
          </div>
        )}

        {/* Commission — hidden behind PIN */}
        <div className="bg-primary rounded-lg p-4 relative overflow-hidden">
          <div className="absolute -top-[15px] -right-[15px] w-[90px] h-[90px] rounded-full bg-white/[.07]" />
          <p className="text-[11px] text-white/65">คอมมิชชั่นเดือนนี้ / My Commission</p>
          <div className="flex items-center gap-2">
            <span className="text-[22px] font-extrabold text-white">
              {showCommission ? `฿${formatNumber(commission)}` : '฿***,***'}
            </span>
            <button onClick={handleRevealCommission} className="ml-1 text-white/70 hover:text-white cursor-pointer transition-colors">
              <Icon name={showCommission ? 'check' : 'lock'} size={16} />
            </button>
          </div>
          <p className="text-[10px] text-white/50 mt-[2px]">ประมาณการ 2% x {unitsSold} units</p>
        </div>
      </div>
    </div>
  );
}
