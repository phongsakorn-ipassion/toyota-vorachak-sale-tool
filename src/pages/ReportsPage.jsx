import React, { useMemo, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import Icon from '../components/icons/Icon';
import { useLeadStore } from '../stores/leadStore';
import { useBookingStore } from '../stores/bookingStore';
import { CARS, WEEKLY_DATA } from '../lib/mockData';
import { formatCurrency, formatNumber } from '../lib/formats';
import { Chart, LineElement, PointElement, CategoryScale, LinearScale, LineController, Filler } from 'chart.js';

Chart.register(LineElement, PointElement, CategoryScale, LinearScale, LineController, Filler);

export default function ReportsPage() {
  const navigate = useNavigate();
  const leads = useLeadStore((s) => s.leads);
  const getLeadStats = useLeadStore((s) => s.getLeadStats);
  const bookings = useBookingStore((s) => s.bookings);
  const chartRef = useRef(null);
  const chartInst = useRef(null);

  const stats = getLeadStats();

  // Computed stats
  const wonLeads = useMemo(() => leads.filter((l) => l.level === 'won'), [leads]);
  const unitsSold = wonLeads.length;
  const revenue = useMemo(() => {
    return wonLeads.reduce((sum, l) => {
      const car = l.car ? CARS[l.car] : null;
      return sum + (car ? car.price : 0);
    }, 0);
  }, [wonLeads]);
  const avgDeal = unitsSold > 0 ? Math.round(revenue / unitsSold) : 0;

  // Top models: group won leads by car, count, sort desc
  const topModels = useMemo(() => {
    const map = {};
    wonLeads.forEach((l) => {
      const car = l.car ? CARS[l.car] : null;
      if (car) {
        if (!map[car.name]) map[car.name] = 0;
        map[car.name]++;
      }
    });
    // Also count all leads by interest car for richer data
    leads.forEach((l) => {
      const car = l.car ? CARS[l.car] : null;
      if (car && !map[car.name]) map[car.name] = 0;
    });
    return Object.entries(map)
      .map(([name, units]) => ({ name, units }))
      .sort((a, b) => b.units - a.units);
  }, [wonLeads, leads]);

  // Chart
  useEffect(() => {
    if (!chartRef.current) return;
    if (chartInst.current) chartInst.current.destroy();
    chartInst.current = new Chart(chartRef.current, {
      type: 'line',
      data: {
        labels: WEEKLY_DATA.labels,
        datasets: [{
          data: WEEKLY_DATA.units,
          borderColor: '#1B7A3F',
          backgroundColor: 'rgba(27,122,63,.12)',
          fill: true,
          tension: 0.35,
          pointRadius: 4,
          pointBackgroundColor: '#1B7A3F',
        }],
      },
      options: {
        responsive: true, maintainAspectRatio: false,
        plugins: { legend: { display: false } },
        scales: { y: { beginAtZero: true }, x: { grid: { display: false } } },
      },
    });
    return () => { if (chartInst.current) chartInst.current.destroy(); };
  }, []);

  // Export CSV
  const exportCsv = () => {
    const BOM = '\uFEFF';
    const header = 'ชื่อ,ระดับ,รถที่สนใจ,ราคา,สถานะ\n';
    const rows = leads.map((l) => {
      const car = l.car ? CARS[l.car] : null;
      return `"${l.name}","${l.level}","${car ? car.name : ''}","${car ? car.price : ''}","${l.stage || ''}"`;
    }).join('\n');
    const blob = new Blob([BOM + header + rows], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'report_march_2026.csv';
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="screen-enter flex flex-col h-full">
      <div className="bg-white px-4 py-[13px] flex items-center gap-[11px] border-b border-border flex-shrink-0">
        <button onClick={() => navigate(-1)} className="w-9 h-9 rounded-full flex items-center justify-center bg-bg border border-border text-t1 cursor-pointer"><Icon name="back" size={18} /></button>
        <div className="flex-1"><h2 className="text-[15px] font-extrabold text-t1">รายงานเดือน</h2><p className="text-[11px] text-t2 mt-[1px]">Monthly Report — มีนาคม 2026</p></div>
      </div>

      <div className="flex-1 overflow-y-auto px-4 pt-4 pb-24" style={{ WebkitOverflowScrolling: 'touch' }}>
        {/* Stats */}
        <div className="grid grid-cols-3 gap-[10px] mb-3">
          {[
            { num: String(unitsSold), label: 'Units Sold' },
            { num: formatCurrency(revenue), label: 'Revenue', green: true },
            { num: formatCurrency(avgDeal), label: 'Avg Deal' },
          ].map(s => (
            <div key={s.label} className="text-center p-4 bg-white border border-border rounded-lg">
              <p className={`text-[22px] font-extrabold leading-none ${s.green ? 'text-primary' : 'text-t1'}`}>{s.num}</p>
              <p className="text-[11px] text-t2 mt-[3px]">{s.label}</p>
            </div>
          ))}
        </div>

        {/* Lead Level Pills */}
        <div className="flex gap-[7px] flex-wrap mb-3">
          {[
            { label: 'Hot', count: stats.hot, bg: '#FEF2F2', color: '#DC2626' },
            { label: 'Warm', count: stats.warm, bg: '#FFFBEB', color: '#D97706' },
            { label: 'Cool', count: stats.cool, bg: '#EFF6FF', color: '#2563EB' },
            { label: 'Won', count: stats.won, bg: '#F0FDF4', color: '#1B7A3F' },
          ].map(p => (
            <span key={p.label} className="px-3 py-[6px] rounded-pill text-[11px] font-bold flex items-center gap-1" style={{ background: p.bg, color: p.color }}>
              {p.label} {p.count}
            </span>
          ))}
        </div>

        {/* Weekly Chart */}
        <div className="card-base">
          <div className="card-hd"><span className="card-title">Weekly Trend</span></div>
          <div style={{ height: 160 }}><canvas ref={chartRef} /></div>
        </div>

        {/* Top Models */}
        <div className="card-base">
          <div className="card-hd"><span className="card-title">Top Models</span></div>
          {topModels.length > 0 ? topModels.map((m, i) => (
            <div key={m.name} className="flex items-center gap-[10px] py-[10px] border-b border-border last:border-b-0">
              <span className="text-[11px] font-extrabold text-t3 w-5">{i + 1}</span>
              <span className="flex-1 text-[13px] font-bold text-t1">{m.name}</span>
              <span className="text-[13px] font-extrabold text-primary">{m.units}</span>
            </div>
          )) : (
            <p className="text-[12px] text-t3 py-3 text-center">ยังไม่มีข้อมูล</p>
          )}
        </div>

        {/* Export */}
        <div className="card-base">
          <div className="card-hd"><span className="card-title">Export</span></div>
          <div className="flex gap-2">
            <button onClick={() => window.print()} className="flex-1 flex items-center justify-center gap-[6px] p-3 bg-bg border border-border rounded-md text-[12px] font-bold text-t1 cursor-pointer active:opacity-70">
              <Icon name="download" size={16} /> PDF Report
            </button>
            <button onClick={exportCsv} className="flex-1 flex items-center justify-center gap-[6px] p-3 bg-bg border border-border rounded-md text-[12px] font-bold text-t1 cursor-pointer active:opacity-70">
              <Icon name="download" size={16} /> Excel
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
