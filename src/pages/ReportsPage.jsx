import React, { useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import Icon from '../components/icons/Icon';
import { TOP_MODELS, WEEKLY_DATA } from '../lib/mockData';
import { Chart, LineElement, PointElement, CategoryScale, LinearScale, LineController, Filler } from 'chart.js';

Chart.register(LineElement, PointElement, CategoryScale, LinearScale, LineController, Filler);

export default function ReportsPage() {
  const navigate = useNavigate();
  const chartRef = useRef(null);
  const chartInst = useRef(null);

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
            { num: '245', label: 'Units Sold' },
            { num: '฿231M', label: 'Revenue', green: true },
            { num: '฿943K', label: 'Avg Deal' },
          ].map(s => (
            <div key={s.label} className="text-center p-4 bg-white border border-border rounded-lg">
              <p className={`text-[22px] font-extrabold leading-none ${s.green ? 'text-primary' : 'text-t1'}`}>{s.num}</p>
              <p className="text-[11px] text-t2 mt-[3px]">{s.label}</p>
            </div>
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
          {TOP_MODELS.map((m, i) => (
            <div key={m.name} className="flex items-center gap-[10px] py-[10px] border-b border-border last:border-b-0">
              <span className="text-[11px] font-extrabold text-t3 w-5">{i + 1}</span>
              <span className="flex-1 text-[13px] font-bold text-t1">{m.name}</span>
              <span className="text-[13px] font-extrabold text-primary">{m.units}</span>
            </div>
          ))}
        </div>

        {/* Export */}
        <div className="card-base">
          <div className="card-hd"><span className="card-title">Export</span></div>
          <div className="flex gap-2">
            <button onClick={() => alert('Generating PDF...')} className="flex-1 flex items-center justify-center gap-[6px] p-3 bg-bg border border-border rounded-md text-[12px] font-bold text-t1 cursor-pointer active:opacity-70">
              <Icon name="download" size={16} /> PDF Report
            </button>
            <button onClick={() => alert('Generating Excel...')} className="flex-1 flex items-center justify-center gap-[6px] p-3 bg-bg border border-border rounded-md text-[12px] font-bold text-t1 cursor-pointer active:opacity-70">
              <Icon name="download" size={16} /> Excel
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
