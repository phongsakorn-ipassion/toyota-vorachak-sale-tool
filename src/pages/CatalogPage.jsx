import React, { useState, useMemo, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import Icon from '../components/icons/Icon';
import { CARS, CARS_LIST, MODEL_FILTERS } from '../lib/mockData';
import { CAR_TYPES, BUDGET_RANGES } from '../lib/constants';
import { useVisibilityRefresh } from '../hooks/useVisibilityRefresh';

export default function CatalogPage() {
  const [, forceUpdate] = useState(0);
  useVisibilityRefresh(useCallback(() => forceUpdate(n => n + 1), []));
  const navigate = useNavigate();
  const [search, setSearch] = useState('');
  const [activeType, setActiveType] = useState('all');
  const [activeModel, setActiveModel] = useState('all');
  const [activeBudget, setActiveBudget] = useState('all');

  const visibleModels = useMemo(() => {
    if (activeType === 'all') return MODEL_FILTERS;
    return MODEL_FILTERS.filter(m => m.cat === null || m.cat === activeType);
  }, [activeType]);

  const filtered = useMemo(() => {
    return CARS_LIST.filter(c => {
      if (activeType !== 'all' && c.cat !== activeType) return false;
      if (activeModel !== 'all' && c.id !== activeModel) return false;
      if (activeBudget !== 'all') {
        const fn = BUDGET_RANGES.find(b => b.id === activeBudget)?.fn;
        if (fn && !fn(c.price)) return false;
      }
      if (search && !c.name.toLowerCase().includes(search.toLowerCase())) return false;
      return true;
    });
  }, [activeType, activeModel, activeBudget, search]);

  const selectCls = "w-full py-2.5 px-3 bg-white border border-border rounded-md text-[12px] text-t1 outline-none focus:border-primary appearance-none cursor-pointer";
  const selectStyle = { fontFamily: "'Sarabun', sans-serif" };

  return (
    <div className="screen-enter flex flex-col h-full">
      {/* Header */}
      <div className="bg-white px-4 py-[13px] flex items-center gap-[11px] border-b border-border flex-shrink-0">
        <button onClick={() => navigate(-1)} className="w-9 h-9 rounded-full flex items-center justify-center bg-bg border border-border text-t1 cursor-pointer"><Icon name="back" size={18} /></button>
        <div className="flex-1"><h2 className="text-[15px] font-extrabold text-t1">รุ่นรถยนต์</h2><p className="text-[11px] text-t2 mt-[1px]">Vehicle Catalog — วรจักร์ยนต์</p></div>
        <span className="text-t2 cursor-pointer"><Icon name="search" size={20} /></span>
      </div>

      <div className="flex-1 overflow-y-auto px-4 pt-3 pb-24" style={{ WebkitOverflowScrolling: 'touch' }}>
        {/* Search */}
        <div className="relative mb-3">
          <span className="absolute left-[13px] top-1/2 -translate-y-1/2 text-t3"><Icon name="search" size={16} /></span>
          <input type="text" value={search} onChange={e => setSearch(e.target.value)} placeholder="ค้นหารุ่นรถ / Search models..." className="w-full py-3 pl-[38px] pr-3 bg-white border border-border rounded-md text-[13px] text-t1 outline-none focus:border-primary" style={selectStyle} />
        </div>

        {/* Filter dropdowns */}
        <div className="grid grid-cols-3 gap-2 mb-4">
          {/* Type */}
          <div>
            <div className="text-[10px] font-bold text-t3 uppercase tracking-wider mb-[6px] flex items-center gap-1">
              <Icon name="car" size={12} className="opacity-60" /> ประเภทรถ / Type
            </div>
            <select
              value={activeType}
              onChange={e => { setActiveType(e.target.value); setActiveModel('all'); }}
              className={selectCls}
              style={selectStyle}
            >
              {CAR_TYPES.map(t => (
                <option key={t.id} value={t.id}>{t.label}</option>
              ))}
            </select>
          </div>

          {/* Model */}
          <div>
            <div className="text-[10px] font-bold text-t3 uppercase tracking-wider mb-[6px] flex items-center gap-1">
              รุ่นรถ / Model
            </div>
            <select
              value={activeModel}
              onChange={e => setActiveModel(e.target.value)}
              className={selectCls}
              style={selectStyle}
            >
              {visibleModels.map(m => (
                <option key={m.id} value={m.id}>{m.label}</option>
              ))}
            </select>
          </div>

          {/* Budget */}
          <div>
            <div className="text-[10px] font-bold text-t3 uppercase tracking-wider mb-[6px] flex items-center gap-1">
              งบประมาณ / Budget
            </div>
            <select
              value={activeBudget}
              onChange={e => setActiveBudget(e.target.value)}
              className={selectCls}
              style={selectStyle}
            >
              {BUDGET_RANGES.map(b => (
                <option key={b.id} value={b.id}>{b.label}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Car List */}
        {filtered.map(car => (
          <div key={car.id} onClick={() => navigate(`/car/${car.id}`)} className="flex items-center gap-3 p-3 bg-white rounded-lg border border-border mb-[10px] cursor-pointer active:opacity-70 transition-opacity">
            <div className="w-[80px] h-[64px] rounded-md border border-border flex items-center justify-center flex-shrink-0 overflow-hidden p-1" style={{ background: car.bg }}>
              <img src={car.img} alt={car.name} className="w-full h-full object-contain" style={{ filter: 'drop-shadow(0 2px 6px rgba(0,0,0,.1))' }} onError={(e) => { e.target.style.display = 'none'; e.target.parentElement.innerHTML = '<div style="display:flex;align-items:center;justify-content:center;width:100%;height:100%;color:#9CA3AF"><svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M5 17h1m12 0h1M6 17H3V12l2.5-5h13L21 12v5h-3M6 17a2 2 0 104 0m4 0a2 2 0 104 0"/></svg></div>'; }} />
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between mb-[2px]">
                <span className="text-[14px] font-extrabold text-t1">{car.name}</span>
                <span className="text-[13px] font-extrabold text-t1 whitespace-nowrap">{car.priceLabel} <span className="text-[10px] text-t2 font-medium"></span></span>
              </div>
              <p className="text-[11px] text-t2 mb-[7px]">{car.type} · {car.fuel}</p>
              <div className="flex gap-[5px] flex-wrap">
                <span className={`inline-flex items-center gap-[5px] text-[11px] font-bold ${car.avail === 'In Stock' ? 'text-avail' : 'text-transit'}`}>
                  <span className="w-[7px] h-[7px] rounded-full inline-block" style={{ background: 'currentColor' }} />
                  {car.avail}
                </span>
                <span className="inline-flex items-center gap-1 px-[9px] py-[2px] rounded-[20px] text-[11px] font-semibold text-t2 bg-bg border border-border"><Icon name="seat" size={10} /> {car.seats}</span>
                <span className="inline-flex items-center gap-1 px-[9px] py-[2px] rounded-[20px] text-[11px] font-semibold text-t2 bg-bg border border-border"><Icon name="fuel" size={10} /> {car.fuel}</span>
              </div>
            </div>
            <button className="flex items-center justify-center text-t3 flex-shrink-0 cursor-pointer" onClick={(e) => { e.stopPropagation(); navigate(`/car/${car.id}`); }}>
              <Icon name="chevronRight" size={16} />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
