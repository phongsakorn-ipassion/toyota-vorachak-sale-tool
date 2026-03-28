import React from 'react';
import { useNavigate } from 'react-router-dom';
import PageHeader from '../components/layout/PageHeader';
import Input from '../components/ui/Input';
import FilterPill from '../components/ui/FilterPill';
import Icon from '../components/icons/Icon';
import CarListItem from '../components/car/CarListItem';
import { useCarStore } from '../stores/carStore';
import { CAR_TYPES, BUDGET_RANGES } from '../lib/constants';

export default function CatalogPage() {
  const navigate = useNavigate();
  const filters = useCarStore((s) => s.filters);
  const setFilter = useCarStore((s) => s.setFilter);
  const getFilteredCars = useCarStore((s) => s.getFilteredCars);

  const cars = getFilteredCars();

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <PageHeader
        title="รถยนต์ทั้งหมด"
        rightAction={
          <button
            onClick={() => navigate('/notifications')}
            className="p-1 cursor-pointer"
          >
            <Icon name="bell" size={22} className="text-t1" />
          </button>
        }
      />

      {/* Scrollable content */}
      <div className="flex-1 overflow-y-auto px-4 pt-3 pb-4">
        {/* Search bar */}
        <Input
          icon="search"
          placeholder="ค้นหารถยนต์..."
          value={filters.search}
          onChange={(e) => setFilter('search', e.target.value)}
        />

        {/* Filter: Type */}
        <div className="mb-3">
          <p className="sec-lbl">ประเภท</p>
          <div className="flex gap-2 overflow-x-auto pb-[6px]">
            {CAR_TYPES.map((t) => (
              <FilterPill
                key={t.id}
                label={t.label}
                active={filters.type === t.id}
                onClick={() => setFilter('type', t.id)}
              />
            ))}
          </div>
        </div>

        {/* Filter: Budget */}
        <div className="mb-4">
          <p className="sec-lbl">งบประมาณ</p>
          <div className="flex gap-2 overflow-x-auto pb-[6px]">
            {BUDGET_RANGES.map((b) => (
              <FilterPill
                key={b.id}
                label={b.label}
                active={filters.budget === b.id}
                onClick={() => setFilter('budget', b.id)}
              />
            ))}
          </div>
        </div>

        {/* Car list */}
        {cars.length > 0 ? (
          <div>
            {cars.map((car) => (
              <CarListItem
                key={car.id}
                car={car}
                onClick={() => navigate(`/car/${car.id}`)}
              />
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-16 text-t3">
            <Icon name="car" size={48} className="mb-3 opacity-30" />
            <p className="text-sm">ไม่พบรถที่ตรงกับการค้นหา</p>
          </div>
        )}
      </div>
    </div>
  );
}
