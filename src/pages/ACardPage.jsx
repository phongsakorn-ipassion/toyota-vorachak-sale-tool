import React, { useState, useEffect, useMemo } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import toast from 'react-hot-toast';
import Icon from '../components/icons/Icon';
import { CARS, CARS_LIST, LEAD_SOURCES } from '../lib/mockData';
import { CAR_TYPES } from '../lib/constants';
import { THAI_PROVINCES, SERVICE_CENTERS } from '../lib/thaiProvinces';
import { useLeadStore } from '../stores/leadStore';
import { useUiStore } from '../stores/uiStore';
import ServiceCenterMap from '../components/map/ServiceCenterMap';

export default function ACardPage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const editId = searchParams.get('edit');

  const addLead = useLeadStore((s) => s.addLead);
  const updateLead = useLeadStore((s) => s.updateLead);
  const getLeadById = useLeadStore((s) => s.getLeadById);
  const addNotification = useUiStore((s) => s.addNotification);

  // Customer info
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [lineId, setLineId] = useState('');
  const [province, setProvince] = useState('');
  const [serviceDate, setServiceDate] = useState('');
  const [serviceTime, setServiceTime] = useState('');
  const [source, setSource] = useState('Walk-in');
  const [interest, setInterest] = useState('hot');
  const [carType, setCarType] = useState('all');
  const [model, setModel] = useState('');
  const [budget, setBudget] = useState('ต่ำกว่า 500K');
  const [notes, setNotes] = useState('');
  const [errors, setErrors] = useState({});

  // Service center
  const [selectedCenter, setSelectedCenter] = useState('');
  const [postalSearch, setPostalSearch] = useState('');
  const [provinceSearch, setProvinceSearch] = useState('');
  const [userLocation, setUserLocation] = useState(null);
  const [locating, setLocating] = useState(false);

  // Dropdown open states
  const [postalOpen, setPostalOpen] = useState(false);
  const [provinceFilterOpen, setProvinceFilterOpen] = useState(false);
  const [customerProvinceOpen, setCustomerProvinceOpen] = useState(false);
  const [customerProvinceSearch, setCustomerProvinceSearch] = useState('');

  // Load lead data for edit mode
  useEffect(() => {
    if (editId) {
      const lead = getLeadById(editId);
      if (lead) {
        setName(lead.name || '');
        setPhone(lead.phone || '');
        setEmail(lead.email || '');
        setLineId(lead.lineId || '');
        setSource(lead.source || 'Walk-in');
        setInterest(lead.level || 'hot');
        setModel(lead.car || '');
        setBudget(lead.budget || 'ต่ำกว่า 500K');
        setNotes(lead.notes || '');
        setProvince(lead.province || '');
        setServiceDate(lead.serviceDate || '');
        setServiceTime(lead.serviceTime || '');
        setSelectedCenter(lead.serviceCenter || '');
        if (lead.car) {
          const car = CARS[lead.car];
          if (car) setCarType(car.cat || 'all');
        }
      }
    }
  }, [editId]);

  // Filter service centers by province/postal
  const filteredCenters = useMemo(() => {
    let centers = SERVICE_CENTERS;
    if (provinceSearch) {
      centers = centers.filter(c => c.province.includes(provinceSearch));
    }
    if (postalSearch) {
      // Find provinces matching postal code, then filter centers by those provinces
      const matchingProvinces = THAI_PROVINCES
        .filter(p => p.postalCodes.some(pc => pc.startsWith(postalSearch)))
        .map(p => p.name);
      if (matchingProvinces.length > 0) {
        centers = centers.filter(c => matchingProvinces.includes(c.province));
      }
    }
    return centers;
  }, [provinceSearch, postalSearch]);

  // Filter car models by type
  const filteredModels = useMemo(() => {
    if (carType === 'all') return CARS_LIST;
    return CARS_LIST.filter(c => c.cat === carType);
  }, [carType]);

  // Selected car data for preview
  const selectedCar = model ? CARS[model] : null;

  // Filtered postal codes for dropdown
  const filteredPostalCodes = useMemo(() => {
    if (!postalSearch) return [];
    const codes = [];
    THAI_PROVINCES.forEach(p => {
      p.postalCodes.forEach(pc => {
        if (pc.startsWith(postalSearch)) {
          codes.push({ code: pc, province: p.name });
        }
      });
    });
    return codes.slice(0, 20);
  }, [postalSearch]);

  // Filtered provinces for service center filter
  const filteredProvinceOptions = useMemo(() => {
    if (!provinceSearch) return THAI_PROVINCES;
    return THAI_PROVINCES.filter(p =>
      p.name.includes(provinceSearch) || p.nameEn.toLowerCase().includes(provinceSearch.toLowerCase())
    );
  }, [provinceSearch]);

  // Filtered provinces for customer province dropdown
  const filteredCustomerProvinces = useMemo(() => {
    if (!customerProvinceSearch) return THAI_PROVINCES;
    return THAI_PROVINCES.filter(p =>
      p.name.includes(customerProvinceSearch) || p.nameEn.toLowerCase().includes(customerProvinceSearch.toLowerCase())
    );
  }, [customerProvinceSearch]);

  const handleUseLocation = () => {
    if (!navigator.geolocation) {
      toast.error('เบราว์เซอร์ไม่รองรับ Geolocation');
      return;
    }
    setLocating(true);
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setUserLocation({ lat: pos.coords.latitude, lng: pos.coords.longitude });
        setLocating(false);
        toast.success('พบตำแหน่งของคุณแล้ว');
      },
      () => {
        setLocating(false);
        toast.error('ไม่สามารถระบุตำแหน่งได้');
      }
    );
  };

  const validate = () => {
    const missing = [];
    if (!name.trim()) missing.push('ชื่อ-นามสกุล');
    if (!phone.trim()) missing.push('เบอร์โทร');
    if (!province) missing.push('จังหวัด');
    if (!serviceDate) missing.push('วันที่จะเข้ารับบริการ');
    if (!serviceTime) missing.push('เวลาที่สะดวก');
    if (!selectedCenter) missing.push('ศูนย์บริการ');
    if (!model) missing.push('รุ่นรถ');

    if (missing.length > 0) {
      toast.error(`กรุณากรอกข้อมูลให้ครบถ้วน: ${missing.join(', ')}`);
      const errs = {};
      if (!name.trim()) errs.name = true;
      if (!phone.trim()) errs.phone = true;
      setErrors(errs);
      return false;
    }
    setErrors({});
    return true;
  };

  const fields = [
    { key: 'name', label: 'ชื่อ-นามสกุล / Full Name *', icon: 'user', type: 'text', ph: 'กรอกชื่อลูกค้า', value: name, setter: setName },
    { key: 'phone', label: 'เบอร์โทร / Phone *', icon: 'phone', type: 'tel', ph: '08X-XXX-XXXX', value: phone, setter: setPhone },
    { key: 'email', label: 'อีเมล / Email', icon: 'mail', type: 'email', ph: 'example@email.com', value: email, setter: setEmail },
    { key: 'lineId', label: 'LINE ID', icon: 'chat', type: 'text', ph: '@lineid', value: lineId, setter: setLineId },
  ];

  const saveACard = () => {
    if (!validate()) return;

    const initChar = name.trim().charAt(0);
    const colors = ['#DC2626', '#8B5CF6', '#F59E0B', '#10B981', '#2563EB', '#EC4899'];
    const color = colors[Math.floor(Math.random() * colors.length)];

    const leadData = {
      name: name.trim(),
      phone: phone.trim(),
      email: email.trim(),
      lineId: lineId.trim(),
      province,
      serviceDate,
      serviceTime,
      serviceCenter: selectedCenter,
      source,
      level: interest,
      car: model || undefined,
      budget,
      notes: notes.trim(),
      init: initChar,
      color,
    };

    if (editId) {
      updateLead(editId, leadData);
      addNotification({ title: 'แก้ไข Lead สำเร็จ', body: name.trim() + ' อัปเดตข้อมูลเรียบร้อย', type: 'success' });
      navigate(`/lead/${editId}`);
    } else {
      addLead(leadData);
      addNotification({ title: 'Lead ใหม่!', body: name.trim() + ' เพิ่มลงระบบเรียบร้อย', type: 'success' });
      navigate('/sales-dash');
    }
  };

  const inputCls = "w-full py-3 px-3 bg-white border border-border rounded-md text-[13px] text-t1 outline-none focus:border-primary";
  const inputStyle = { fontFamily: "'Sarabun', sans-serif" };
  const labelCls = "block text-[10px] font-extrabold text-t2 tracking-wider uppercase mb-[5px]";

  return (
    <div className="screen-enter flex flex-col h-full">
      {/* Header */}
      <div className="bg-white px-4 py-[13px] flex items-center gap-[11px] border-b border-border flex-shrink-0">
        <button onClick={() => navigate(-1)} className="w-9 h-9 rounded-full flex items-center justify-center bg-bg border border-border text-t1 cursor-pointer"><Icon name="back" size={18} /></button>
        <div className="flex-1"><h2 className="text-[15px] font-extrabold text-t1">{editId ? 'แก้ไขข้อมูลลูกค้า' : 'ลงทะเบียนลูกค้า'}</h2><p className="text-[11px] text-t2 mt-[1px]">{editId ? 'Edit Lead — A-Card Digital' : 'New Lead — A-Card Digital'}</p></div>
        <span className="text-t2"><Icon name="clip" size={20} /></span>
      </div>

      <div className="flex-1 overflow-y-auto px-4 pt-4 pb-24" style={{ WebkitOverflowScrolling: 'touch' }}>

        {/* ====== Service Center Selection ====== */}
        <div className="card-base">
          <div className="card-hd"><span className="card-title">เลือกศูนย์บริการ | Select Service Center</span></div>

          <div className="md:flex md:gap-4">
            {/* Left: filters + list */}
            <div className="md:w-1/2">
              {/* Postal code search */}
              <div className="mb-3 relative">
                <label className={labelCls}>รหัสไปรษณีย์ / Postal Code</label>
                <input
                  type="text"
                  placeholder="ค้นหาด้วยรหัสไปรษณีย์..."
                  value={postalSearch}
                  onChange={(e) => { setPostalSearch(e.target.value); setPostalOpen(true); }}
                  onFocus={() => postalSearch && setPostalOpen(true)}
                  onBlur={() => setTimeout(() => setPostalOpen(false), 200)}
                  className={inputCls}
                  style={inputStyle}
                />
                {postalOpen && filteredPostalCodes.length > 0 && (
                  <div className="absolute z-20 left-0 right-0 mt-1 bg-white border border-border rounded-md shadow-lg max-h-40 overflow-y-auto">
                    {filteredPostalCodes.map((item, i) => (
                      <button key={i} className="w-full text-left px-3 py-2 text-[12px] hover:bg-green-50 cursor-pointer" onMouseDown={() => { setPostalSearch(item.code); setPostalOpen(false); }}>
                        {item.code} — {item.province}
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* Province search */}
              <div className="mb-3 relative">
                <label className={labelCls}>จังหวัด / Province</label>
                <input
                  type="text"
                  placeholder="ค้นหาด้วยจังหวัด..."
                  value={provinceSearch}
                  onChange={(e) => { setProvinceSearch(e.target.value); setProvinceFilterOpen(true); }}
                  onFocus={() => setProvinceFilterOpen(true)}
                  onBlur={() => setTimeout(() => setProvinceFilterOpen(false), 200)}
                  className={inputCls}
                  style={inputStyle}
                />
                {provinceFilterOpen && filteredProvinceOptions.length > 0 && (
                  <div className="absolute z-20 left-0 right-0 mt-1 bg-white border border-border rounded-md shadow-lg max-h-40 overflow-y-auto">
                    {filteredProvinceOptions.map((p) => (
                      <button key={p.name} className="w-full text-left px-3 py-2 text-[12px] hover:bg-green-50 cursor-pointer" onMouseDown={() => { setProvinceSearch(p.name); setProvinceFilterOpen(false); }}>
                        {p.name} ({p.nameEn})
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* Use current location */}
              <button onClick={handleUseLocation} disabled={locating} className="w-full flex items-center justify-center gap-2 py-2.5 mb-3 rounded-md border border-primary text-primary text-[12px] font-bold bg-green-50 hover:bg-green-100 transition-colors cursor-pointer disabled:opacity-50" style={inputStyle}>
                <Icon name="location" size={14} />
                {locating ? 'กำลังค้นหาตำแหน่ง...' : 'ใช้ตำแหน่งปัจจุบัน / Use my current location'}
              </button>

              {/* Center list */}
              <div className="max-h-[200px] overflow-y-auto space-y-2 mb-3 md:mb-0">
                {filteredCenters.length === 0 && (
                  <p className="text-[11px] text-t3 text-center py-4">ไม่พบศูนย์บริการในพื้นที่ที่เลือก</p>
                )}
                {filteredCenters.map((c) => (
                  <button
                    key={c.id}
                    onClick={() => setSelectedCenter(c.id)}
                    className={`w-full text-left p-3 rounded-lg border-[1.5px] transition-all cursor-pointer ${selectedCenter === c.id ? 'border-primary bg-green-50' : 'border-border bg-white hover:border-gray-300'}`}
                    style={inputStyle}
                  >
                    <div className="text-[12px] font-extrabold text-t1">{c.name}</div>
                    <div className="text-[10px] text-t2 mt-[2px]">{c.address}</div>
                    <div className="flex items-center gap-3 mt-[3px]">
                      <span className="text-[10px] text-t3 flex items-center gap-1"><Icon name="phone" size={10} /> {c.phone}</span>
                      <span className="text-[10px] text-t3 flex items-center gap-1"><Icon name="clock" size={10} /> {c.hours}</span>
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* Right: Map */}
            <div className="md:w-1/2 mt-3 md:mt-0">
              <ServiceCenterMap
                centers={filteredCenters}
                selectedCenter={selectedCenter}
                onSelectCenter={setSelectedCenter}
                userLocation={userLocation}
              />
            </div>
          </div>
        </div>

        {/* ====== Customer Info ====== */}
        <div className="card-base">
          <div className="card-hd"><span className="card-title">ข้อมูลลูกค้า | Customer Info</span></div>
          {fields.map((f) => (
            <div key={f.label} className="mb-3">
              <label className={labelCls}>{f.label}</label>
              <div className="relative">
                <span className="absolute left-[13px] top-1/2 -translate-y-1/2 text-t3"><Icon name={f.icon} size={15} /></span>
                <input type={f.type} placeholder={f.ph} value={f.value} onChange={(e) => f.setter(e.target.value)} className="w-full py-3 pl-[38px] pr-3 bg-white border border-border rounded-md text-[13px] text-t1 outline-none focus:border-primary" style={inputStyle} />
              </div>
              {errors[f.key] && <p className="text-[10px] text-red-500 mt-1">กรุณากรอกข้อมูล</p>}
            </div>
          ))}

          {/* Province dropdown-search */}
          <div className="mb-3 relative">
            <label className={labelCls}>จังหวัด / Province *</label>
            <div className="relative">
              <span className="absolute left-[13px] top-1/2 -translate-y-1/2 text-t3"><Icon name="location" size={15} /></span>
              <input
                type="text"
                placeholder="เลือกจังหวัด..."
                value={province || customerProvinceSearch}
                onChange={(e) => { setCustomerProvinceSearch(e.target.value); setProvince(''); setCustomerProvinceOpen(true); }}
                onFocus={() => setCustomerProvinceOpen(true)}
                onBlur={() => setTimeout(() => setCustomerProvinceOpen(false), 200)}
                className="w-full py-3 pl-[38px] pr-3 bg-white border border-border rounded-md text-[13px] text-t1 outline-none focus:border-primary"
                style={inputStyle}
              />
            </div>
            {customerProvinceOpen && (
              <div className="absolute z-20 left-0 right-0 mt-1 bg-white border border-border rounded-md shadow-lg max-h-40 overflow-y-auto">
                {filteredCustomerProvinces.map((p) => (
                  <button key={p.name} className="w-full text-left px-3 py-2 text-[12px] hover:bg-green-50 cursor-pointer" onMouseDown={() => { setProvince(p.name); setCustomerProvinceSearch(''); setCustomerProvinceOpen(false); }}>
                    {p.name} ({p.nameEn})
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Date + Time row */}
          <div className="flex gap-3 mb-3">
            <div className="flex-1">
              <label className={labelCls}>วันที่จะเข้ารับบริการ / Date *</label>
              <div className="relative">
                <span className="absolute left-[13px] top-1/2 -translate-y-1/2 text-t3"><Icon name="calendar" size={15} /></span>
                <input type="date" value={serviceDate} onChange={(e) => setServiceDate(e.target.value)} className="w-full py-3 pl-[38px] pr-3 bg-white border border-border rounded-md text-[13px] text-t1 outline-none focus:border-primary" style={inputStyle} />
              </div>
            </div>
            <div className="flex-1">
              <label className={labelCls}>เวลาที่สะดวก / Time *</label>
              <div className="relative">
                <span className="absolute left-[13px] top-1/2 -translate-y-1/2 text-t3"><Icon name="clock" size={15} /></span>
                <input type="time" value={serviceTime} onChange={(e) => setServiceTime(e.target.value)} className="w-full py-3 pl-[38px] pr-3 bg-white border border-border rounded-md text-[13px] text-t1 outline-none focus:border-primary" style={inputStyle} />
              </div>
            </div>
          </div>
        </div>

        {/* ====== Lead Source ====== */}
        <div className="card-base">
          <div className="card-hd"><span className="card-title">ช่องทาง | Lead Source</span></div>
          <div className="flex flex-wrap gap-[7px]">
            {LEAD_SOURCES.map((s) => (
              <button key={s} onClick={() => setSource(s)} className={`pill-filter ${source === s ? 'on' : ''}`}>{s}</button>
            ))}
          </div>
        </div>

        {/* ====== Interest Level ====== */}
        <div className="card-base">
          <div className="card-hd"><span className="card-title">ระดับความสนใจ | Interest Level</span></div>
          <div className="grid grid-cols-3 gap-2">
            {[
              { id: 'hot', icon: 'flame', label: 'HOT', sub: 'พร้อมซื้อ', sel: 'border-hot bg-red-50' },
              { id: 'warm', icon: 'sun', label: 'WARM', sub: 'สนใจ', sel: 'border-warm bg-amber-50' },
              { id: 'cool', icon: 'snow', label: 'COOL', sub: 'สำรวจ', sel: 'border-cool bg-blue-50' },
            ].map((l) => (
              <button key={l.id} onClick={() => setInterest(l.id)} className={`p-3 rounded-md text-center border-[1.5px] transition-all cursor-pointer ${interest === l.id ? l.sel : 'border-border bg-white'}`} style={inputStyle}>
                <div className="flex justify-center mb-[3px]"><Icon name={l.icon} size={20} /></div>
                <div className="text-[12px] font-extrabold text-t1">{l.label}</div>
                <div className="text-[10px] text-t2">{l.sub}</div>
              </button>
            ))}
          </div>
        </div>

        {/* ====== Model + Budget ====== */}
        <div className="card-base">
          <div className="card-hd"><span className="card-title">รุ่นรถที่สนใจ | Model of Interest</span></div>

          <div className="md:flex md:gap-4">
            {/* Left: form fields */}
            <div className="md:w-1/2">
              {/* Car type */}
              <div className="mb-3">
                <label className={labelCls}>ประเภทรถ / Type</label>
                <select value={carType} onChange={(e) => { setCarType(e.target.value); setModel(''); }} className={`${inputCls} appearance-none cursor-pointer`} style={inputStyle}>
                  {CAR_TYPES.map(t => <option key={t.id} value={t.id}>{t.label}</option>)}
                </select>
              </div>

              {/* Model */}
              <div className="mb-3">
                <label className={labelCls}>รุ่น / Model *</label>
                <select value={model} onChange={(e) => setModel(e.target.value)} className={`${inputCls} appearance-none cursor-pointer`} style={inputStyle}>
                  <option value="">เลือกรุ่นรถ</option>
                  {filteredModels.map(c => <option key={c.id} value={c.id}>{c.name} — {c.priceLabel}</option>)}
                </select>
              </div>

              {/* Budget */}
              <div className="mb-3 md:mb-0">
                <label className={labelCls}>งบประมาณ / Budget</label>
                <select value={budget} onChange={(e) => setBudget(e.target.value)} className={`${inputCls} appearance-none cursor-pointer`} style={inputStyle}>
                  <option>ต่ำกว่า 500K</option>
                  <option>500K-1M</option>
                  <option>1M-2M</option>
                  <option>มากกว่า 2M</option>
                </select>
              </div>
            </div>

            {/* Right: car preview card */}
            <div className="md:w-1/2 mt-3 md:mt-0">
              {selectedCar && selectedCar.avail === 'In Stock' ? (
                <div className="p-3 bg-white rounded-lg border border-border">
                  <div className="w-full h-[140px] rounded-md flex items-center justify-center overflow-hidden mb-2" style={{ background: selectedCar.bg }}>
                    <img src={selectedCar.img} alt={selectedCar.name} className="max-w-full max-h-full object-contain" style={{ filter: 'drop-shadow(0 2px 8px rgba(0,0,0,.1))' }} />
                  </div>
                  <div className="text-[14px] font-extrabold text-t1">{selectedCar.name}</div>
                  <div className="text-[13px] font-extrabold text-primary mt-[2px]">{selectedCar.priceLabel}</div>
                  <div className="flex items-center gap-2 mt-[5px]">
                    <span className="text-[11px] text-t2">{selectedCar.type} · {selectedCar.fuel}</span>
                    <span className="inline-flex items-center gap-1 text-[10px] font-bold text-avail">
                      <span className="w-[6px] h-[6px] rounded-full bg-avail inline-block" />
                      {selectedCar.avail}
                    </span>
                  </div>
                  <p className="text-[10px] text-t3 mt-[3px]">{selectedCar.stock}</p>
                </div>
              ) : selectedCar ? (
                <div className="p-3 bg-white rounded-lg border border-border">
                  <div className="w-full h-[140px] rounded-md flex items-center justify-center overflow-hidden mb-2" style={{ background: selectedCar.bg }}>
                    <img src={selectedCar.img} alt={selectedCar.name} className="max-w-full max-h-full object-contain opacity-60" style={{ filter: 'drop-shadow(0 2px 8px rgba(0,0,0,.1))' }} />
                  </div>
                  <div className="text-[14px] font-extrabold text-t1">{selectedCar.name}</div>
                  <div className="text-[13px] font-extrabold text-t2 mt-[2px]">{selectedCar.priceLabel}</div>
                  <div className="flex items-center gap-2 mt-[5px]">
                    <span className="text-[11px] text-t2">{selectedCar.type} · {selectedCar.fuel}</span>
                    <span className="inline-flex items-center gap-1 text-[10px] font-bold text-transit">
                      <span className="w-[6px] h-[6px] rounded-full bg-transit inline-block" style={{ background: 'currentColor' }} />
                      {selectedCar.avail}
                    </span>
                  </div>
                  <p className="text-[10px] text-t3 mt-[3px]">{selectedCar.stock}</p>
                </div>
              ) : (
                <div className="flex items-center justify-center h-[200px] bg-bg rounded-lg border border-dashed border-border">
                  <div className="text-center">
                    <Icon name="car" size={32} className="text-t3 mx-auto mb-2" />
                    <p className="text-[11px] text-t3">เลือกรุ่นรถเพื่อดูตัวอย่าง</p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* ====== Notes ====== */}
        <div className="card-base">
          <div className="card-hd"><span className="card-title">หมายเหตุ / Notes</span></div>
          <textarea placeholder="บันทึกรายละเอียดเพิ่มเติม..." rows={3} value={notes} onChange={(e) => setNotes(e.target.value)} className="w-full py-3 px-3 bg-white border border-border rounded-md text-[13px] text-t1 outline-none focus:border-primary resize-none" style={inputStyle} />
        </div>

        <button onClick={saveACard} className="btn-p cursor-pointer mb-4">
          <Icon name="check" size={16} /> {editId ? 'บันทึกการแก้ไข / Update A-Card' : 'บันทึก Lead / Save A-Card'}
        </button>
      </div>
    </div>
  );
}
