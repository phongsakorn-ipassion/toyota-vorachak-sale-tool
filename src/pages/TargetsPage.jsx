import React from 'react';
import { useNavigate } from 'react-router-dom';
import Icon from '../components/icons/Icon';
import { TEAM_MEMBERS, BRANCH_TARGETS } from '../lib/mockData';

export default function TargetsPage() {
  const navigate = useNavigate();

  const TargetCard = ({ name, units, target }) => {
    const pct = Math.round(units / target * 100);
    const barColor = pct >= 70 ? '#1B7A3F' : pct >= 50 ? '#D97706' : '#DC2626';
    const textColor = pct >= 70 ? 'text-primary' : pct >= 50 ? 'text-warm' : 'text-hot';
    return (
      <div className="bg-white border border-border rounded-lg p-[14px] mb-[10px]">
        <div className="flex items-center justify-between mb-[10px]">
          <span className="text-[13px] font-bold text-t1">{name}</span>
          <span className={`text-[13px] font-extrabold ${textColor}`}>{pct}%</span>
        </div>
        <div className="h-[6px] bg-border rounded-[3px]"><div className="h-full rounded-[3px]" style={{ width: `${pct}%`, background: barColor }} /></div>
        <div className="flex justify-between mt-[6px] text-[10px] text-t3">
          <span>{units} / {target} units</span>
          <span>เหลือ {target - units}</span>
        </div>
      </div>
    );
  };

  return (
    <div className="screen-enter flex flex-col h-full">
      <div className="bg-white px-4 py-[13px] flex items-center gap-[11px] border-b border-border flex-shrink-0">
        <button onClick={() => navigate(-1)} className="w-9 h-9 rounded-full flex items-center justify-center bg-bg border border-border text-t1 cursor-pointer"><Icon name="back" size={18} /></button>
        <div className="flex-1"><h2 className="text-[15px] font-extrabold text-t1">เป้าหมายรายบุคคล</h2><p className="text-[11px] text-t2 mt-[1px]">Individual Targets — มีนาคม 2026</p></div>
      </div>

      <div className="flex-1 overflow-y-auto px-4 pt-4 pb-24" style={{ WebkitOverflowScrolling: 'touch' }}>
        {/* Total Target */}
        <div className="bg-primary rounded-lg p-[18px] mb-3 relative overflow-hidden">
          <div className="absolute -top-5 -right-5 w-[120px] h-[120px] rounded-full bg-white/[.07]" />
          <p className="text-[11px] text-white/65 font-semibold">เป้าหมายรวมทุกสาขา / Total Target</p>
          <p className="text-[34px] font-extrabold text-white leading-none">245 <span className="text-[14px]">/ 350 units</span></p>
          <div className="h-[5px] bg-white/20 rounded-[3px] mt-[11px] mb-[10px]"><div className="h-full bg-white rounded-[3px]" style={{ width: '70%' }} /></div>
          <div className="flex gap-6">
            <div><p className="text-[18px] font-extrabold text-white">70%</p><p className="text-[10px] text-white/60">สำเร็จ</p></div>
            <div><p className="text-[18px] font-extrabold text-white">105</p><p className="text-[10px] text-white/60">เหลืออีก</p></div>
            <div><p className="text-[18px] font-extrabold text-white">3</p><p className="text-[10px] text-white/60">วันที่เหลือ</p></div>
          </div>
        </div>

        {/* Staff Targets */}
        <div className="sec-lbl">Staff Targets</div>
        {TEAM_MEMBERS.map(m => <TargetCard key={m.id} name={m.name} units={m.units} target={m.target} />)}

        {/* Branch Targets */}
        <div className="sec-lbl mt-2">Branch Targets</div>
        {BRANCH_TARGETS.map(b => <TargetCard key={b.name} name={b.name} units={b.units} target={b.target} />)}
      </div>
    </div>
  );
}
