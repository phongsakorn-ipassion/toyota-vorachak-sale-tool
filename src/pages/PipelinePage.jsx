import React, { useMemo, useState, useCallback, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import Icon from '../components/icons/Icon';
import { useLeadStore } from '../stores/leadStore';
import { useUiStore } from '../stores/uiStore';
import { CARS } from '../lib/mockData';
import { TEST_DRIVE_STATUSES } from '../lib/constants';
import { formatCurrency } from '../lib/formats';
import { useVisibilityRefresh } from '../hooks/useVisibilityRefresh';

const PURCHASE_COLUMN_CONFIG = {
  hot: { label: 'HOT', color: '#DC2626', bg: '#FEF2F2', border: '#FECACA' },
  warm: { label: 'WARM', color: '#D97706', bg: '#FFFBEB', border: '#FDE68A' },
  cool: { label: 'COOL', color: '#2563EB', bg: '#EFF6FF', border: '#BFDBFE' },
  won: { label: 'WON', color: '#16A34A', bg: '#F0FDF4', border: '#BBF7D0' },
  lost: { label: 'LOST', color: '#6B7280', bg: '#F3F4F6', border: '#D1D5DB' },
};

const TD_COLUMN_CONFIG = {
  scheduled: { label: 'นัดหมาย', color: '#3B82F6', bg: '#EFF6FF', border: '#BFDBFE' },
  confirmed: { label: 'ยืนยัน', color: '#8B5CF6', bg: '#F5F3FF', border: '#DDD6FE' },
  completed: { label: 'เสร็จสิ้น', color: '#10B981', bg: '#ECFDF5', border: '#A7F3D0' },
};

const PURCHASE_LEVELS = ['hot', 'warm', 'cool', 'won', 'lost'];
const TD_LEVELS = ['scheduled', 'confirmed', 'completed'];

export default function PipelinePage() {
  const [, forceUpdate] = useState(0);
  useVisibilityRefresh(useCallback(() => forceUpdate(n => n + 1), []));

  const readTimestamps = useRef({});

  const navigate = useNavigate();
  const leads = useLeadStore((s) => s.leads);
  const getLeadStats = useLeadStore((s) => s.getLeadStats);
  const changeLevel = useLeadStore((s) => s.changeLevel);
  const updateLead = useLeadStore((s) => s.updateLead);
  const addNotification = useUiStore((s) => s.addNotification);
  const [moveMenuId, setMoveMenuId] = useState(null);
  const [pipelineType, setPipelineType] = useState('purchase');

  const stats = getLeadStats();

  const isTestDrive = pipelineType === 'test_drive';
  const LEVELS = isTestDrive ? TD_LEVELS : PURCHASE_LEVELS;
  const COLUMN_CONFIG = isTestDrive ? TD_COLUMN_CONFIG : PURCHASE_COLUMN_CONFIG;

  // Group leads by level filtered by type
  const columns = useMemo(() => {
    const grouped = {};
    LEVELS.forEach(l => { grouped[l] = []; });
    leads.forEach((l) => {
      const lt = l.leadType || 'purchase';
      if (lt !== pipelineType) return;
      if (grouped[l.level]) grouped[l.level].push(l);
      if (!readTimestamps.current[l.id]) readTimestamps.current[l.id] = Date.now();
    });
    return LEVELS.map((level) => ({
      ...COLUMN_CONFIG[level],
      level,
      count: grouped[level].length,
      cards: grouped[level],
      totalValue: grouped[level].reduce((sum, l) => {
        const car = l.car ? CARS[l.car] : null;
        return sum + (car ? car.price : 0);
      }, 0),
    }));
  }, [leads, pipelineType]);

  // Counts for toggle
  const purchaseCount = leads.filter(l => (l.leadType || 'purchase') === 'purchase').length;
  const testDriveCount = leads.filter(l => l.leadType === 'test_drive').length;

  const handleMove = (leadId, newLevel) => {
    const _readAt = readTimestamps.current[leadId] || Date.now();
    let result;
    if (isTestDrive) {
      result = updateLead(leadId, { level: newLevel }, _readAt);
    } else {
      result = changeLevel(leadId, newLevel, undefined, _readAt);
    }
    if (result?.conflict) {
      toast((t) => (
        <div className="flex items-center gap-3">
          <span className="text-sm">{result.message}</span>
          <button onClick={() => { forceUpdate(n => n + 1); toast.dismiss(t.id); }} className="text-xs px-2 py-1 bg-primary text-white rounded whitespace-nowrap">โหลดใหม่</button>
        </div>
      ), { duration: 5000, icon: '\u26A0\uFE0F' });
      setMoveMenuId(null);
      return;
    }
    readTimestamps.current[leadId] = Date.now();
    const lead = leads.find((l) => l.id === leadId);
    const colConfig = COLUMN_CONFIG[newLevel];
    addNotification({
      type: 'info',
      icon: 'target',
      color: colConfig?.color || '#6B7280',
      borderColor: colConfig?.border || '#E5E7EB',
      title: `Lead ย้ายไปยัง ${colConfig?.label || newLevel.toUpperCase()}`,
      body: `${lead?.name || ''} ถูกย้ายไปยังระดับ ${colConfig?.label || newLevel.toUpperCase()}`,
      time: 'เมื่อสักครู่',
    });
    setMoveMenuId(null);
  };

  return (
    <div className="screen-enter flex flex-col h-full">
      <div className="bg-white px-4 py-[13px] flex items-center gap-[11px] border-b border-border flex-shrink-0">
        <button onClick={() => navigate(-1)} className="w-9 h-9 rounded-full flex items-center justify-center bg-bg border border-border text-t1 cursor-pointer"><Icon name="back" size={18} /></button>
        <div className="flex-1"><h2 className="text-[15px] font-extrabold text-t1">Lead Pipeline</h2><p className="text-[11px] text-t2 mt-[1px]">Sales Funnel — มีนาคม 2026</p></div>
        <button onClick={() => navigate('/acard')} className="w-9 h-9 rounded-full flex items-center justify-center bg-primary text-white cursor-pointer">
          <Icon name="clip" size={18} />
        </button>
      </div>

      <div className="flex-1 overflow-y-auto px-4 pt-3 pb-24" style={{ WebkitOverflowScrolling: 'touch' }}>
        {/* Type toggle */}
        <div className="flex gap-2 mb-3">
          <button onClick={() => setPipelineType('purchase')} className={`flex-1 py-2 rounded-lg text-[12px] font-bold text-center cursor-pointer transition-all ${pipelineType === 'purchase' ? 'bg-primary text-white' : 'bg-white border border-border text-t2'}`}>
            ลูกค้า ({purchaseCount})
          </button>
          <button onClick={() => setPipelineType('test_drive')} className={`flex-1 py-2 rounded-lg text-[12px] font-bold text-center cursor-pointer transition-all ${pipelineType === 'test_drive' ? 'bg-primary text-white' : 'bg-white border border-border text-t2'}`}>
            ทดลองขับ ({testDriveCount})
          </button>
        </div>


        {/* Kanban */}
        <div className="flex gap-[10px] overflow-x-auto pb-[10px]" style={{ WebkitOverflowScrolling: 'touch' }}>
          {columns.map(col => (
            <div key={col.label} className="min-w-[158px] flex-shrink-0">
              <div className="flex items-center justify-between px-[10px] py-2 rounded-md mb-2 text-[11px] font-extrabold" style={{ background: col.bg, color: col.color, border: `1px solid ${col.border}` }}>
                {col.label}
                <span className="min-w-[22px] h-[22px] rounded-pill flex items-center justify-center text-[11px] font-extrabold text-white px-[6px]" style={{ background: col.color }}>{col.count}</span>
              </div>
              {col.cards.map((card) => {
                const car = card.car ? CARS[card.car] : null;
                const isWon = card.level === 'won';
                return (
                  <div key={card.id} className={`bg-white border border-border rounded-md p-[11px] mb-2 relative ${isWon ? 'border-l-[3px] border-l-primary' : ''}`}>
                    <div onClick={() => navigate(`/lead/${card.id}`)} className="cursor-pointer">
                      <p className="text-[12px] font-bold text-t1 mb-[2px]">{card.name}</p>
                      <p className="text-[11px] text-t2 mb-[6px]">
                        {car ? car.name : 'N/A'}
                        {card.selectedGrade && car?.subModels && <span className="text-t3"> · {car.subModels.find(g => g.id === card.selectedGrade)?.name || ''}</span>}
                      </p>
                      {isTestDrive && card.testDriveDate && (
                        <p className="text-[10px] text-t3 mb-[4px] flex items-center gap-1">
                          <Icon name="calendar" size={10} /> {card.testDriveDate} {card.testDriveTime && `${card.testDriveTime}`}
                        </p>
                      )}
                      <div className="flex justify-between">
                        <span className="text-[10px] text-t3 flex items-center gap-1"><Icon name="user" size={9} /> {card.assignedTo || 'มาลี ร.'}</span>
                        <span className="text-[10px] font-bold text-primary">{car ? formatCurrency(car.price) : ''}</span>
                      </div>
                    </div>
                    {/* Move button */}
                    <button
                      onClick={(e) => { e.stopPropagation(); setMoveMenuId(moveMenuId === card.id ? null : card.id); }}
                      className="absolute top-[6px] right-[6px] w-[20px] h-[20px] rounded-full flex items-center justify-center bg-bg border border-border text-t3 cursor-pointer text-[10px]"
                    >
                      ↕
                    </button>
                    {moveMenuId === card.id && (
                      <div className="absolute top-[28px] right-[6px] bg-white border border-border rounded-md shadow-lg z-10 overflow-hidden">
                        {LEVELS.filter((lv) => lv !== card.level).map((lv) => (
                          <button
                            key={lv}
                            onClick={(e) => { e.stopPropagation(); handleMove(card.id, lv); }}
                            className="block w-full text-left px-3 py-[6px] text-[10px] font-bold hover:bg-bg cursor-pointer"
                            style={{ color: COLUMN_CONFIG[lv].color }}
                          >
                            → {COLUMN_CONFIG[lv].label}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                );
              })}
              {/* Column footer: total value */}
              <div className="text-center text-[10px] font-bold text-t3 py-1">
                {formatCurrency(col.totalValue)}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
