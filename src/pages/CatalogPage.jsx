import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import Icon from '../components/icons/Icon';
import { CARS, CARS_LIST, MODEL_FILTERS } from '../lib/mockData';
import { CAR_TYPES, BUDGET_RANGES } from '../lib/constants';

export default function CatalogPage() {
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
          <input type="text" value={search} onChange={e => setSearch(e.target.value)} placeholder="ค้นหารุ่นรถ / Search models..." className="w-full py-3 pl-[38px] pr-3 bg-white border border-border rounded-md text-[13px] text-t1 outline-none focus:border-primary" style={{ fontFamily: "'Sarabun', sans-serif" }} />
        </div>

        {/* Level 1: Type */}
        <div className="mb-[10px]">
          <div className="text-[10px] font-bold text-t3 uppercase tracking-wider mb-[6px] flex items-center gap-1">
            <Icon name="car" size={12} className="opacity-60" /> ประเภทรถ / Type
          </div>
          <div className="flex gap-2 overflow-x-auto pb-1" style={{ WebkitOverflowScrolling: 'touch' }}>
            {CAR_TYPES.map(t => (
              <button key={t.id} onClick={() => { setActiveType(t.id); setActiveModel('all'); }} className={`pill-filter flex items-center gap-1 ${activeType === t.id ? 'on' : ''}`}>
                {t.icon && <Icon name={t.icon} size={12} />} {t.label}
              </button>
            ))}
          </div>
        </div>

        {/* Level 2: Model */}
        <div className="mb-[10px]">
          <div className="text-[10px] font-bold text-t3 uppercase tracking-wider mb-[6px] flex items-center gap-1">
            รุ่นรถ / Model
          </div>
          <div className="flex gap-2 overflow-x-auto pb-1" style={{ WebkitOverflowScrolling: 'touch' }}>
            {visibleModels.map(m => (
              <button key={m.id} onClick={() => setActiveModel(m.id)} className={`pill-filter ${activeModel === m.id ? 'on' : ''}`}>{m.label}</button>
            ))}
          </div>
        </div>

        {/* Level 3: Budget */}
        <div className="mb-4">
          <div className="text-[10px] font-bold text-t3 uppercase tracking-wider mb-[6px] flex items-center gap-1">
            งบประมาณ / Budget
          </div>
          <div className="flex gap-2 overflow-x-auto pb-1" style={{ WebkitOverflowScrolling: 'touch' }}>
            {BUDGET_RANGES.map(b => (
              <button key={b.id} onClick={() => setActiveBudget(b.id)} className={`pill-filter ${activeBudget === b.id ? 'on' : ''}`}>{b.label}</button>
            ))}
          </div>
        </div>

        {/* Car List */}
        {filtered.map(car => (
          <div key={car.id} onClick={() => navigate(`/car/${car.id}`)} className="flex items-center gap-3 p-3 bg-white rounded-lg border border-border mb-[10px] cursor-pointer active:opacity-70 transition-opacity">
            <div className="w-[80px] h-[64px] rounded-md border border-border flex items-center justify-center flex-shrink-0 overflow-hidden p-1" style={{ background: car.bg }}>
              <img src={car.img} alt={car.name} className="w-full h-full object-contain" style={{ filter: 'drop-shadow(0 2px 6px rgba(0,0,0,.1))' }} />
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between mb-[2px]">
                <span className="text-[14px] font-extrabold text-t1">{car.name}</span>
                <span className="text-[13px] font-extrabold text-t1 whitespace-nowrap">{car.priceLabel} <span className="text-[10px] text-t2 font-medium">฿</span></span>
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
            <span className="text-[12px] font-bold text-primary flex-shrink-0 self-center">Details</span>
          </div>
        ))}
      </div>
    </div>
  );
}
