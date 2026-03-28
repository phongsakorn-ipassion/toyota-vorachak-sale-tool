import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import PageHeader from '../components/layout/PageHeader';
import Input from '../components/ui/Input';
import Button from '../components/ui/Button';
import FilterPill from '../components/ui/FilterPill';
import Toast from '../components/ui/Toast';
import { useLeadStore } from '../stores/leadStore';
import { CARS_LIST } from '../lib/mockData';
import { LEAD_SOURCES } from '../lib/constants';

const LEVEL_OPTIONS = [
  { key: 'hot', emoji: '🔥', label: 'ร้อน', bg: 'bg-red-50', border: 'border-red-200', activeBorder: 'border-red-500' },
  { key: 'warm', emoji: '🌡️', label: 'อุ่น', bg: 'bg-amber-50', border: 'border-amber-200', activeBorder: 'border-amber-500' },
  { key: 'cool', emoji: '❄️', label: 'เย็น', bg: 'bg-blue-50', border: 'border-blue-200', activeBorder: 'border-blue-500' },
];

const INITIALS_COLORS = ['#DC2626', '#8B5CF6', '#F59E0B', '#10B981', '#4D96FF', '#FF6B6B', '#6BCB77', '#9B59B6'];

export default function ACardPage() {
  const navigate = useNavigate();
  const addLead = useLeadStore((s) => s.addLead);

  const [level, setLevel] = useState('hot');
  const [source, setSource] = useState('Walk-in');
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [car, setCar] = useState('');
  const [notes, setNotes] = useState('');
  const [errors, setErrors] = useState({});
  const [toast, setToast] = useState({ visible: false, message: '', type: 'success' });

  const validate = () => {
    const newErrors = {};
    if (!name.trim()) newErrors.name = 'กรุณากรอกชื่อลูกค้า';
    if (!phone.trim()) newErrors.phone = 'กรุณากรอกเบอร์โทรศัพท์';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSave = () => {
    if (!validate()) return;

    const initial = name.trim().charAt(0);
    const color = INITIALS_COLORS[Math.floor(Math.random() * INITIALS_COLORS.length)];
    const id = `lead_${Date.now()}`;

    const newLead = {
      id,
      name: name.trim(),
      init: initial,
      color,
      level,
      source,
      car: car || undefined,
      phone: phone.trim(),
      email: email.trim() || undefined,
      createdAt: new Date().toISOString(),
      activities: notes.trim()
        ? [{
            id: `a${Date.now()}`,
            type: 'note',
            title: 'บันทึกจาก A-Card',
            content: notes.trim(),
            time: new Date().toISOString(),
          }]
        : [],
    };

    addLead(newLead);
    setToast({ visible: true, message: 'บันทึก Lead สำเร็จ!', type: 'success' });
    setTimeout(() => navigate('/leads'), 800);
  };

  return (
    <div className="flex flex-col h-full bg-surface">
      <PageHeader title="สร้าง Lead ใหม่" showBack />

      <div className="flex-1 overflow-y-auto px-4 py-4">
        {/* Interest level */}
        <div className="mb-5">
          <label className="block text-sm font-semibold text-t1 mb-2">
            ระดับความสนใจ
          </label>
          <div className="grid grid-cols-3 gap-3">
            {LEVEL_OPTIONS.map((opt) => {
              const isActive = level === opt.key;
              return (
                <button
                  key={opt.key}
                  onClick={() => setLevel(opt.key)}
                  className={`
                    flex flex-col items-center justify-center gap-1 p-3 rounded-lg border-2
                    transition-all duration-150 cursor-pointer
                    ${opt.bg}
                    ${isActive ? `${opt.activeBorder} scale-105` : `${opt.border} scale-100`}
                  `.trim()}
                >
                  <span className="text-xl">{opt.emoji}</span>
                  <span className="text-xs font-bold text-t1">{opt.label}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Lead source */}
        <div className="mb-5">
          <label className="block text-sm font-semibold text-t1 mb-2">
            แหล่งที่มา
          </label>
          <div className="flex gap-2 overflow-x-auto no-scrollbar">
            {LEAD_SOURCES.map((src) => (
              <FilterPill
                key={src}
                label={src}
                active={source === src}
                onClick={() => setSource(src)}
              />
            ))}
          </div>
        </div>

        {/* Form fields */}
        <Input
          label="ชื่อลูกค้า"
          icon="profile"
          placeholder="กรอกชื่อ-นามสกุล"
          value={name}
          onChange={(e) => setName(e.target.value)}
          error={errors.name}
        />

        <Input
          label="โทรศัพท์"
          icon="phone"
          type="tel"
          placeholder="08x-xxx-xxxx"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          error={errors.phone}
        />

        <Input
          label="อีเมล (ไม่บังคับ)"
          icon="mail"
          type="email"
          placeholder="email@example.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        {/* Car selector */}
        <div className="mb-4">
          <label className="block text-sm font-semibold text-t1 mb-1.5">
            รุ่นรถที่สนใจ
          </label>
          <select
            value={car}
            onChange={(e) => setCar(e.target.value)}
            className="w-full border border-border rounded-sm py-3 px-3.5 text-sm bg-white text-t1 focus:border-primary focus:outline-none transition-colors"
          >
            <option value="">-- เลือกรุ่นรถ --</option>
            {CARS_LIST.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name} ({c.priceLabel})
              </option>
            ))}
          </select>
        </div>

        {/* Notes */}
        <div className="mb-4">
          <label className="block text-sm font-semibold text-t1 mb-1.5">
            หมายเหตุ
          </label>
          <textarea
            rows={3}
            placeholder="บันทึกข้อมูลเพิ่มเติม..."
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            className="w-full border border-border rounded-sm py-3 px-3.5 text-sm bg-white text-t1 focus:border-primary focus:outline-none transition-colors resize-none"
          />
        </div>

        {/* Buttons */}
        <div className="flex gap-3 mt-2 pb-4">
          <Button
            variant="outline"
            fullWidth
            onClick={() => navigate(-1)}
          >
            ยกเลิก
          </Button>
          <Button
            variant="primary"
            fullWidth
            onClick={handleSave}
          >
            บันทึก Lead
          </Button>
        </div>
      </div>

      <Toast
        message={toast.message}
        type={toast.type}
        isVisible={toast.visible}
        onClose={() => setToast((t) => ({ ...t, visible: false }))}
      />
    </div>
  );
}
