import React, { useMemo, useEffect, useRef, useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../stores/authStore';
import { useDashboardStore } from '../stores/dashboardStore';
import { useLeadStore } from '../stores/leadStore';
import { useBookingStore } from '../stores/bookingStore';
import Icon from '../components/icons/Icon';
import { useVisibilityRefresh } from '../hooks/useVisibilityRefresh';
import { Chart, BarElement, CategoryScale, LinearScale, BarController } from 'chart.js';

Chart.register(BarElement, CategoryScale, LinearScale, BarController);

export default function ManagerDashboard() {
  const [, forceUpdate] = useState(0);
  useVisibilityRefresh(useCallback(() => forceUpdate(n => n + 1), []));
  const navigate = useNavigate();
  const user = useAuthStore((s) => s.user);
  const selectedBranch = useDashboardStore((s) => s.selectedBranch);
  const setSelectedBranch = useDashboardStore((s) => s.setSelectedBranch);
  const teamMembers = useDashboardStore((s) => s.teamMembers);
  const leads = useLeadStore((s) => s.leads);
  const getLeadStats = useLeadStore((s) => s.getLeadStats);
  const bookings = useBookingStore((s) => s.bookings);
  const chartRef = useRef(null);
  const chartInst = useRef(null);

  // Month/Year filter
  const now = new Date();
  const [filterMonth, setFilterMonth] = useState(now.getMonth());
  const [filterYear, setFilterYear] = useState(now.getFullYear());
  const thaiMonths = ['มกราคม','กุมภาพันธ์','มีนาคม','เมษายน','พฤษภาคม','มิถุนายน','กรกฎาคม','สิงหาคม','กันยายน','ตุลาคม','พฤศจิกายน','ธันวาคม'];
  const filterLabel = `${thaiMonths[filterMonth]} ${filterYear + 543}`;

  const stats = getLeadStats();

  // Filter leads by branch
  const filteredLeads = useMemo(() => {
    if (selectedBranch === 'all') return leads;
    return leads.filter((l) => {
      const src = (l.source || '').toLowerCase();
      if (selectedBranch === 'lp') return src.includes('ลาดพร้าว');
      if (selectedBranch === 'on') return src.includes('อ่อนนุช');
      if (selectedBranch === 'bn') return src.includes('บางนา');
      return true;
    });
  }, [leads, selectedBranch]);

  // Computed KPIs
  const kpis = useMemo(() => {
    const wonCount = filteredLeads.filter((l) => l.level === 'won').length;
    const teamTotal = teamMembers.reduce((s, m) => s + m.units, 0) + wonCount;
    const teamTarget = teamMembers.reduce((s, m) => s + m.target, 0);
    const pct = teamTarget > 0 ? Math.round((teamTotal / teamTarget) * 100) : 0;
    const remainingUnits = Math.max(0, teamTarget - teamTotal);
    const newLeads = filteredLeads.filter((l) => l.stage === 'new').length;
    const hotLeads = filteredLeads.filter((l) => l.level === 'hot').length;
    return { teamTotal, teamTarget, pct, remainingUnits, newLeads, hotLeads };
  }, [filteredLeads, teamMembers]);

  // Sorted leaderboard
  const sortedTeam = useMemo(() => [...teamMembers].sort((a, b) => b.units - a.units), [teamMembers]);

  // Dynamic insights
  const insights = useMemo(() => {
    const result = [];
    // Underperformer alert
    const worst = [...teamMembers].sort((a, b) => (a.units / a.target) - (b.units / b.target))[0];
    if (worst) {
      const worstPct = Math.round((worst.units / worst.target) * 100);
      if (worstPct < 60) {
        result.push({ type: 'alert', bg: '#FEF2F2', color: '#991B1B', border: '#FECACA', iconName: 'alert', text: `${worst.name} ยังต่ำกว่าเป้า ${100 - worstPct}% — ควรนัดพูดคุยเพื่อสนับสนุน` });
      }
    }
    // Hot leads aging
    const hotCount = filteredLeads.filter((l) => l.level === 'hot').length;
    if (hotCount > 0) {
      result.push({ type: 'warn', bg: '#FFFBEB', color: '#92400E', border: '#FDE68A', iconName: 'flame', text: `Hot Lead ${hotCount} รายการ รอการติดตามนานกว่า 24 ชั่วโมง` });
    }
    // Best seller
    const best = sortedTeam[0];
    if (best) {
      result.push({ type: 'info', bg: '#EBF7EF', color: '#1B7A3F', border: '#C4E3CE', iconName: 'star', text: `${best.name} ขายดีที่สุดเดือนนี้ — ${best.units} คัน` });
    }
    return result;
  }, [teamMembers, filteredLeads, sortedTeam]);

  // Chart
  useEffect(() => {
    if (!chartRef.current) return;
    if (chartInst.current) chartInst.current.destroy();
    chartInst.current = new Chart(chartRef.current, {
      type: 'bar',
      data: {
        labels: sortedTeam.map(m => m.name.split(' ')[0]),
        datasets: [{
          data: sortedTeam.map(m => m.units),
          backgroundColor: sortedTeam.map(m => {
            const pct = m.units / m.target * 100;
            return pct >= 70 ? '#1B7A3F' : pct >= 50 ? '#D97706' : '#DC2626';
          }),
          borderRadius: 6,
        }],
      },
      options: {
        responsive: true, maintainAspectRatio: false,
        plugins: { legend: { display: false } },
        scales: { y: { beginAtZero: true, max: 80 }, x: { grid: { display: false } } },
      },
    });
    return () => { if (chartInst.current) chartInst.current.destroy(); };
  }, [sortedTeam]);

  const rankColors = ['#FEF3C7', '#F1F5F9', '#FEF2EE'];
  const rankTextColors = ['#B45309', '#475569', '#C2410C'];

  return (
    <div className="screen-enter">
      <div className="bg-white px-4 py-[13px] flex items-center gap-[11px] border-b border-border">
        <div className="w-[42px] h-[42px] rounded-full bg-t1 flex items-center justify-center text-[15px] font-extrabold text-white flex-shrink-0">{user?.init || 'ว'}</div>
        <div className="flex-1">
          <h2 className="text-[15px] font-extrabold text-t1">Manager Dashboard</h2>
          <p className="text-[11px] text-t2 mt-[1px]">วรจักร์ยนต์ · {filterLabel}</p>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto px-4 pt-4 pb-24" style={{ WebkitOverflowScrolling: 'touch' }}>
        {/* Branch Filter */}
        <div className="flex gap-2 overflow-x-auto pb-2 mb-3" style={{ WebkitOverflowScrolling: 'touch' }}>
          {[{ id: 'lp', label: 'ลาดพร้าว' }, { id: 'on', label: 'อ่อนนุช' }, { id: 'bn', label: 'บางนา' }, { id: 'all', label: 'ทุกสาขา' }].map(b => (
            <button key={b.id} onClick={() => setSelectedBranch(b.id)} className={`pill-filter ${selectedBranch === b.id ? 'on' : ''}`}>{b.label}</button>
          ))}
        </div>

        {/* Month/Year Filter */}
        <div className="flex gap-2 mb-3">
          <select value={filterMonth} onChange={(e) => setFilterMonth(Number(e.target.value))} className="flex-1 h-[38px] bg-white border border-border rounded-md px-3 text-[12px] text-t1 font-bold outline-none focus:border-primary cursor-pointer">
            {thaiMonths.map((m, i) => <option key={i} value={i}>{m}</option>)}
          </select>
          <select value={filterYear} onChange={(e) => setFilterYear(Number(e.target.value))} className="w-[100px] h-[38px] bg-white border border-border rounded-md px-3 text-[12px] text-t1 font-bold outline-none focus:border-primary cursor-pointer">
            {[2024, 2025, 2026, 2027].map(y => <option key={y} value={y}>{y + 543}</option>)}
          </select>
        </div>

        {/* KPI Grid */}
        <div className="grid grid-cols-2 gap-[10px] mb-3">
          {[
            { num: String(kpis.teamTotal), label: 'ยอดขายเดือนนี้', sub: `เป้า ${kpis.teamTarget} units` },
            { num: `${kpis.pct}%`, label: 'ความคืบหน้า', sub: `เหลือ ${kpis.remainingUnits} units`, green: true },
            { num: String(kpis.newLeads), label: 'Lead ใหม่วันนี้', sub: 'ลีดที่เปิดอยู่', green: true },
            { num: String(kpis.hotLeads), label: 'Hot Lead', sub: 'รอการติดตาม', warm: true },
          ].map(k => (
            <div key={k.label} className="bg-white rounded-lg border border-border p-[14px]">
              <p className={`text-[26px] font-extrabold leading-none ${k.green ? 'text-primary' : k.warm ? 'text-warm' : 'text-t1'}`}>{k.num}</p>
              <p className="text-[12px] text-t2 mt-[3px]">{k.label}</p>
              <p className="text-[10px] text-t3 mt-[2px]">{k.sub}</p>
            </div>
          ))}
        </div>

        {/* Team Chart */}
        <div className="card-base">
          <div className="card-hd"><span className="card-title">Team Performance</span><span className="text-[12px] font-bold text-primary cursor-pointer">{filterLabel}</span></div>
          <div style={{ height: 180 }}><canvas ref={chartRef} /></div>
        </div>

        {/* Leaderboard */}
        <div className="card-base">
          <div className="card-hd">
            <span className="card-title"><Icon name="trophy" size={16} className="text-warm" /> Leaderboard</span>
            <button onClick={() => navigate('/pipeline')} className="text-[12px] font-bold text-primary cursor-pointer">Pipeline →</button>
          </div>
          {sortedTeam.map((m, i) => {
            const pct = Math.round(m.units / m.target * 100);
            const barColor = pct >= 70 ? '#1B7A3F' : pct >= 50 ? '#D97706' : '#DC2626';
            return (
              <div key={m.id} className="flex items-center gap-[10px] py-[9px] border-b border-border last:border-b-0">
                <div className="w-[27px] h-[27px] rounded-full flex items-center justify-center text-[11px] font-extrabold flex-shrink-0" style={{ background: i < 3 ? rankColors[i] : '#F5F7F5', color: i < 3 ? rankTextColors[i] : '#6B7280' }}>{i + 1}</div>
                <div className="flex-1 min-w-0">
                  <p className="text-[13px] font-bold text-t1">{m.name}</p>
                  <div className="h-[5px] bg-border rounded-[3px] mt-[5px]"><div className="h-full rounded-[3px]" style={{ width: `${pct}%`, background: barColor }} /></div>
                </div>
                <div className="text-right">
                  <p className="text-[13px] font-extrabold text-t1">{m.units}</p>
                  <p className="text-[10px] text-t3">/ {m.target}</p>
                </div>
              </div>
            );
          })}
        </div>

        {/* Insights */}
        <div className="sec-lbl">Insights & Alerts</div>
        {insights.map((ins, i) => (
          <div key={i} className="rounded-md p-[11px] text-[12px] font-semibold mb-2 leading-relaxed flex items-start gap-2" style={{ background: ins.bg, color: ins.color, border: `1px solid ${ins.border}` }}>
            <Icon name={ins.iconName || 'bell'} size={14} />{ins.text}
          </div>
        ))}
      </div>
    </div>
  );
}
