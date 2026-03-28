import React from 'react';
import { useNavigate } from 'react-router-dom';
import Icon from '../components/icons/Icon';
import { PIPELINE_DATA } from '../lib/mockData';

export default function PipelinePage() {
  const navigate = useNavigate();
  const columns = Object.values(PIPELINE_DATA);

  return (
    <div className="screen-enter flex flex-col h-full">
      <div className="bg-white px-4 py-[13px] flex items-center gap-[11px] border-b border-border flex-shrink-0">
        <button onClick={() => navigate(-1)} className="w-9 h-9 rounded-full flex items-center justify-center bg-bg border border-border text-t1 cursor-pointer"><Icon name="back" size={18} /></button>
        <div className="flex-1"><h2 className="text-[15px] font-extrabold text-t1">Lead Pipeline</h2><p className="text-[11px] text-t2 mt-[1px]">Sales Funnel — มีนาคม 2026</p></div>
        <span className="text-t2"><Icon name="target" size={20} /></span>
      </div>

      <div className="flex-1 overflow-y-auto px-4 pt-3 pb-24" style={{ WebkitOverflowScrolling: 'touch' }}>
        {/* Summary Pills */}
        <div className="flex gap-[7px] flex-wrap mb-[14px]">
          {[
            { label: 'Hot', count: 7, bg: '#FEF2F2', color: '#DC2626' },
            { label: 'Warm', count: 12, bg: '#FFFBEB', color: '#D97706' },
            { label: 'Cool', count: 23, bg: '#EFF6FF', color: '#2563EB' },
            { label: 'Won', count: 45, bg: '#F0FDF4', color: '#1B7A3F' },
            { label: 'Lost', count: 8, bg: '#F1F5F9', color: '#6B7280' },
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
              {col.cards.map((card, i) => (
                <div key={i} className={`bg-white border border-border rounded-md p-[11px] mb-2 ${card.won ? 'border-l-[3px] border-l-primary' : ''}`}>
                  <p className="text-[12px] font-bold text-t1 mb-[2px]">{card.name}</p>
                  <p className="text-[11px] text-t2 mb-[6px]">{card.car}</p>
                  <div className="flex justify-between">
                    <span className="text-[10px] text-t3">{card.rep}</span>
                    <span className="text-[10px] font-bold text-primary">{card.price}</span>
                  </div>
                </div>
              ))}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
