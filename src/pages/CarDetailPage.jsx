import React, { useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import PageHeader from '../components/layout/PageHeader';
import Button from '../components/ui/Button';
import Icon from '../components/icons/Icon';
import CarGallery from '../components/car/CarGallery';
import SpecAccordion from '../components/car/SpecAccordion';
import { useCarStore } from '../stores/carStore';
import { CARS } from '../lib/mockData';

const QUICK_SPECS = [
  { key: 'fuel', icon: 'fuel', label: 'เชื้อเพลิง' },
  { key: 'seats', icon: 'seat', label: 'ที่นั่ง' },
  { key: 'gearbox', icon: 'gear', label: 'เกียร์' },
  { key: 'power', icon: 'power', label: 'กำลัง' },
  { key: 'warranty', icon: 'shield', label: 'รับประกัน' },
  { key: 'eco', icon: 'leaf', label: 'ประหยัด' },
];

export default function CarDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const selectCar = useCarStore((s) => s.selectCar);
  const selectedCar = useCarStore((s) => s.selectedCar);

  useEffect(() => {
    selectCar(id);
  }, [id, selectCar]);

  const car = selectedCar || CARS[id];

  if (!car) {
    return (
      <div className="flex flex-col h-full">
        <PageHeader title="ไม่พบรถ" showBack />
        <div className="flex-1 flex items-center justify-center">
          <p className="text-t3 text-sm">ไม่พบข้อมูลรถยนต์</p>
        </div>
      </div>
    );
  }

  const isAvail = car.avail === 'In Stock';

  return (
    <div className="flex flex-col h-full">
      <PageHeader title={car.name} showBack />

      <div className="flex-1 overflow-y-auto pb-6 screen-enter">
        {/* Gallery */}
        <CarGallery car={car} />

        <div className="px-4 pt-3">
        {/* Quick specs grid */}
        <div className="grid grid-cols-2 gap-[10px] mb-4">
          {QUICK_SPECS.map((spec) => (
            <div key={spec.key} className="flex gap-[10px] py-[10px] px-[11px] bg-bg rounded-md">
              <Icon name={spec.icon} size={16} className="text-primary shrink-0 mt-0.5" />
              <div className="min-w-0">
                <p className="text-[10px] text-t3 leading-tight">{spec.label}</p>
                <p className="text-[12px] font-bold text-t1 truncate">{car[spec.key]}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Availability card */}
        <div className="card-base">
          <div className="flex items-center gap-2">
            <span
              className={`w-2.5 h-2.5 rounded-full ${isAvail ? 'bg-green-500' : 'bg-orange-400'}`}
            />
            <span className="text-sm font-bold text-t1">
              {isAvail ? 'มีสินค้าพร้อมส่ง' : 'อยู่ระหว่างขนส่ง'}
            </span>
          </div>
          <p className="text-xs text-t2 mt-1 ml-[18px]">{car.stock}</p>
        </div>

        {/* Price card */}
        <div className="card-base">
          <p className="text-xs text-t3 mb-1">ราคาเริ่มต้น</p>
          <p className="text-2xl font-extrabold text-primary mb-4">{car.priceLabel}</p>
          <div className="flex gap-[10px] mt-1">
            <Button variant="primary" size="md" fullWidth>
              จองรถ
            </Button>
            <Button
              variant="outline"
              size="md"
              fullWidth
              onClick={() => navigate('/calc')}
            >
              คำนวณผ่อน
            </Button>
          </div>
        </div>

        {/* Specs accordion */}
        <div className="card-base">
          <SpecAccordion specs={car.specs} />
        </div>
        </div>
      </div>
    </div>
  );
}
