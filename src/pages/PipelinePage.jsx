import React, { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Icon from '../components/icons/Icon';
import { useLeadStore } from '../stores/leadStore';
import { useUiStore } from '../stores/uiStore';
import { CARS } from '../lib/mockData';
import { formatCurrency } from '../lib/formats';

const COLUMN_CONFIG = {
  hot: { label: 'HOT', color: '#DC2626', bg: '#FEF2F2', border: '#FECACA' },
  warm: { label: 'WARM', color: '#D97706', bg: '#FFFBEB', border: '#FDE68A' },
  cool: { label: 'COOL', color: '#2563EB', bg: '#EFF6FF', border: '#BFDBFE' },
  won: { label: 'WON', color: '#16A34A', bg: '#F0FDF4', border: '#BBF7D0' },
  lost: { label: 'LOST', color: '#6B7280', bg: '#F3F4F6', border: '#D1D5DB' },
};

const LEVELS = ['hot', 'warm', 'cool', 'won', 'lost'];

export default function PipelinePage() {
  const navigate = useNavigate();
  const leads = useLeadStore((s) => s.leads);
  const getLeadStats = useLeadStore((s) => s.getLeadStats);
  const changeLevel = useLeadStore((s) => s.changeLevel);
  const addNotification = useUiStore((s) => s.addNotification);
  const [moveMenuId, setMoveMenuId] = useState(null);

  const stats = getLeadStats();

  // Group leads by level
  const columns = useMemo(() => {
    const grouped = { hot: [], warm: [], cool: [], won: [], lost: [] };
    leads.forEach((l) => {
      if (grouped[l.level]) grouped[l.level].push(l);
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
  }, [leads]);

  const handleMove = (leadId, newLevel) => {
    changeLevel(leadId, newLevel);
    const lead = leads.find((l) => l.id === leadId);
    addNotification({
      type: 'info',
      icon: 'target',
      color: COLUMN_CONFIG[newLevel]?.color || '#6B7280',
      borderColor: COLUMN_CONFIG[newLevel]?.border || '#E5E7EB',
      title: `Lead ย้ายไปยัง ${newLevel.toUpperCase()}`,
      body: `${lead?.name || ''} ถูกย้ายไปยังระดับ ${newLevel.toUpperCase()}`,
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
        {/* Summary Pills */}
        <div className="flex gap-[7px] flex-wrap mb-[14px]">
          {[
            { label: 'Hot', count: stats.hot, bg: '#FEF2F2', color: '#DC2626' },
            { label: 'Warm', count: stats.warm, bg: '#FFFBEB', color: '#D97706' },
            { label: 'Cool', count: stats.cool, bg: '#EFF6FF', color: '#2563EB' },
            { label: 'Won', count: stats.won, bg: '#F0FDF4', color: '#1B7A3F' },
            { label: 'Lost', count: stats.lost, bg: '#F1F5F9', color: '#6B7280' },
          ].map(p => (
            <span key={p.label} className="px-3 py-[6px] rounded-pill text-[11px] font-bold flex items-center gap-1" style={{ background: p.bg, color: p.color }}>
              {p.label} {p.count}
            </span>
          ))}
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
                      <p className="text-[11px] text-t2 mb-[6px]">{car ? car.name : 'N/A'}</p>
                      <div className="flex justify-between">
                        <span className="text-[10px] text-t3">{card.assignedTo || ''}</span>
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
