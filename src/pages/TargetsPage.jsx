import React, { useState, useMemo, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import Icon from '../components/icons/Icon';
import { useDashboardStore } from '../stores/dashboardStore';
import { useLeadStore } from '../stores/leadStore';
import { useAuthStore } from '../stores/authStore';
import { BRANCH_TARGETS } from '../lib/mockData';
import { useVisibilityRefresh } from '../hooks/useVisibilityRefresh';

export default function TargetsPage() {
  const [, forceUpdate] = useState(0);
  useVisibilityRefresh(useCallback(() => forceUpdate(n => n + 1), []));
  const navigate = useNavigate();
  const role = useAuthStore((s) => s.role);
  const teamMembers = useDashboardStore((s) => s.teamMembers);
  const updateTeamMemberTarget = useDashboardStore((s) => s.updateTeamMemberTarget);
  const kpis = useDashboardStore((s) => s.kpis);
  const leads = useLeadStore((s) => s.leads);

  const [editMode, setEditMode] = useState(false);
  const [editTargets, setEditTargets] = useState({});

  // Compute real stats
  const wonCount = useMemo(() => leads.filter((l) => l.stage === 'close_won').length, [leads]);
  const totalUnits = useMemo(() => teamMembers.reduce((s, m) => s + m.units, 0) + wonCount, [teamMembers, wonCount]);
  const totalTarget = useMemo(() => teamMembers.reduce((s, m) => s + m.target, 0), [teamMembers]);
  const remaining = Math.max(0, totalTarget - totalUnits);
  const progressPct = totalTarget > 0 ? Math.round((totalUnits / totalTarget) * 100) : 0;

  // Days left in month
  const daysLeft = useMemo(() => {
    const now = new Date();
    const endOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0);
    return Math.max(0, endOfMonth.getDate() - now.getDate());
  }, []);

  const startEdit = () => {
    const targets = {};
    teamMembers.forEach((m) => { targets[m.id] = m.target; });
    setEditTargets(targets);
    setEditMode(true);
  };

  const cancelEdit = () => {
    setEditMode(false);
    setEditTargets({});
  };

  const saveEdit = () => {
    Object.entries(editTargets).forEach(([id, target]) => {
      updateTeamMemberTarget(id, Number(target));
    });
    setEditMode(false);
    setEditTargets({});
  };

  const TargetCard = ({ name, units, target, memberId }) => {
    const pct = target > 0 ? Math.round(units / target * 100) : 0;
    const barColor = pct >= 70 ? '#1B7A3F' : pct >= 50 ? '#D97706' : '#DC2626';
    const textColor = pct >= 70 ? 'text-primary' : pct >= 50 ? 'text-warm' : 'text-hot';
    const displayTarget = editMode && memberId && editTargets[memberId] !== undefined ? editTargets[memberId] : target;
    return (
      <div className="bg-white border border-border rounded-lg p-[14px] mb-[10px]">
        <div className="flex items-center justify-between mb-[10px]">
          <span className="text-[13px] font-bold text-t1">{name}</span>
          {editMode && memberId ? (
            <input
              type="number"
              value={editTargets[memberId] ?? target}
              onChange={(e) => setEditTargets((prev) => ({ ...prev, [memberId]: e.target.value }))}
              className="w-16 text-right text-[13px] font-extrabold border border-border rounded px-1 py-[2px]"
            />
          ) : (
            <span className={`text-[13px] font-extrabold ${textColor}`}>{pct}%</span>
          )}
        </div>
        <div className="h-[6px] bg-border rounded-[3px]"><div className="h-full rounded-[3px]" style={{ width: `${Math.min(pct, 100)}%`, background: barColor }} /></div>
        <div className="flex justify-between mt-[6px] text-[10px] text-t3">
          <span>{units} / {displayTarget} units</span>
          <span>เหลือ {Math.max(0, displayTarget - units)}</span>
        </div>
      </div>
    );
  };

  return (
    <div className="screen-enter flex flex-col h-full">
      <div className="bg-white px-4 py-[13px] flex items-center gap-[11px] border-b border-border flex-shrink-0">
        <button onClick={() => navigate(-1)} className="w-9 h-9 rounded-full flex items-center justify-center bg-bg border border-border text-t1 cursor-pointer"><Icon name="back" size={18} /></button>
        <div className="flex-1"><h2 className="text-[15px] font-extrabold text-t1">เป้าหมายรายบุคคล</h2><p className="text-[11px] text-t2 mt-[1px]">Individual Targets — มีนาคม 2026</p></div>
        {role === 'mgr' && !editMode && (
          <button onClick={startEdit} className="text-[12px] font-bold text-primary cursor-pointer">แก้ไข</button>
        )}
        {editMode && (
          <div className="flex gap-2">
            <button onClick={cancelEdit} className="text-[12px] font-bold text-t3 cursor-pointer">ยกเลิก</button>
            <button onClick={saveEdit} className="text-[12px] font-bold text-primary cursor-pointer">บันทึก</button>
          </div>
        )}
      </div>

      <div className="flex-1 overflow-y-auto px-4 pt-4 pb-24" style={{ WebkitOverflowScrolling: 'touch' }}>
        {/* Total Target */}
        <div className="bg-primary rounded-lg p-[18px] mb-3 relative overflow-hidden">
          <div className="absolute -top-5 -right-5 w-[120px] h-[120px] rounded-full bg-white/[.07]" />
          <p className="text-[11px] text-white/65 font-semibold">เป้าหมายรวมทุกสาขา / Total Target</p>
          <p className="text-[34px] font-extrabold text-white leading-none">{totalUnits} <span className="text-[14px]">/ {totalTarget} units</span></p>
          <div className="h-[5px] bg-white/20 rounded-[3px] mt-[11px] mb-[10px]"><div className="h-full bg-white rounded-[3px]" style={{ width: `${Math.min(progressPct, 100)}%` }} /></div>
          <div className="flex gap-6">
            <div><p className="text-[18px] font-extrabold text-white">{progressPct}%</p><p className="text-[10px] text-white/60">สำเร็จ</p></div>
            <div><p className="text-[18px] font-extrabold text-white">{remaining}</p><p className="text-[10px] text-white/60">เหลืออีก</p></div>
            <div><p className="text-[18px] font-extrabold text-white">{daysLeft}</p><p className="text-[10px] text-white/60">วันที่เหลือ</p></div>
          </div>
        </div>

        {/* Staff Targets */}
        <div className="sec-lbl">Staff Targets</div>
        {teamMembers.map(m => <TargetCard key={m.id} name={m.name} units={m.units} target={m.target} memberId={m.id} />)}

        {/* Branch Targets */}
        <div className="sec-lbl mt-2">Branch Targets</div>
        {BRANCH_TARGETS.map(b => <TargetCard key={b.name} name={b.name} units={b.units} target={b.target} />)}
      </div>
    </div>
  );
}
