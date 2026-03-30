import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Icon from '../components/icons/Icon';
import InlineCalculator from '../components/car/InlineCalculator';
import { CARS, GALLERY_VIEWS, COLOR_OPTIONS } from '../lib/mockData';
import { useBookingStore } from '../stores/bookingStore';
import { useCarStore } from '../stores/carStore';

export default function CarDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const car = CARS[id];
  const [galleryIdx, setGalleryIdx] = useState(0);
  const [color, setColor] = useState('Pearl White');
  const [openSpec, setOpenSpec] = useState('engine');

  const setCarId = useBookingStore((s) => s.setCarId);
  const selectCar = useCarStore((s) => s.selectCar);

  useEffect(() => {
    if (id) selectCar(id);
  }, [id]);

  if (!car) return <div className="p-4 text-t2">Car not found</div>;

  const views = GALLERY_VIEWS;
  const currentView = views[galleryIdx];
  const isVideo = currentView.id === 'vid';

  const handleBook = () => {
    setCarId(id);
    navigate('/booking');
  };

  const handleCalc = () => {
    const el = document.getElementById('calculator');
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div className="screen-enter flex flex-col h-full">
      {/* Header */}
      <div className="bg-white px-4 py-[13px] flex items-center gap-[11px] border-b border-border flex-shrink-0">
        <button onClick={() => navigate(-1)} className="w-9 h-9 rounded-full flex items-center justify-center bg-bg border border-border text-t1 cursor-pointer"><Icon name="back" size={18} /></button>
        <div className="flex-1"><h2 className="text-[15px] font-extrabold text-t1">{car.name}</h2><p className="text-[11px] text-t2 mt-[1px]">Toyota — Vehicle Detail</p></div>
        <span className="text-t2 cursor-pointer"><Icon name="share" size={20} /></span>
      </div>

      <div className="flex-1 overflow-y-auto pb-24" style={{ WebkitOverflowScrolling: 'touch' }}>
        {/* Gallery */}
        <div className="relative flex-shrink-0 overflow-hidden" style={{ background: isVideo ? '#111827' : currentView.bg }}>
          <div className="w-full h-[210px] flex items-center justify-center relative">
            {isVideo ? (
              <iframe src={`https://www.youtube.com/embed/${car.video}?autoplay=0`} className="w-full h-full border-none" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowFullScreen />
            ) : (
              <img src={car.imgs?.[currentView.id] || car.img} alt={currentView.label} className="w-[85%] max-w-[340px] h-auto object-contain transition-opacity" style={{ filter: 'drop-shadow(0 8px 24px rgba(0,0,0,.15))' }} />
            )}
          </div>
          {!isVideo && (
            <>
              <span className="absolute bottom-[10px] left-[14px] text-[11px] font-bold text-t2 bg-white/[.85] px-[10px] py-[3px] rounded-pill backdrop-blur">{currentView.label}</span>
              <span className="absolute bottom-[10px] right-[14px] text-[11px] font-semibold text-t3 bg-white/[.85] px-[10px] py-[3px] rounded-pill backdrop-blur">{galleryIdx + 1}/{views.length}</span>
              <button onClick={() => alert('360° view coming soon')} className="absolute top-3 right-3 text-[11px] font-bold text-primary bg-white/90 border border-primary-medium px-3 py-1 rounded-pill cursor-pointer flex items-center gap-1 backdrop-blur">
                <Icon name="rotate" size={12} /> 360°
              </button>
            </>
          )}
        </div>

        {/* Thumbnail strip */}
        <div className="flex gap-2 px-[14px] py-[10px] overflow-x-auto bg-white border-b border-border" style={{ WebkitOverflowScrolling: 'touch' }}>
          {views.map((v, i) => (
            <button key={v.id} onClick={() => setGalleryIdx(i)} className={`flex-shrink-0 w-[68px] h-[52px] rounded-sm flex flex-col items-center justify-center gap-[2px] cursor-pointer transition-all border-2 ${i === galleryIdx ? 'border-primary' : 'border-transparent'} ${v.id === 'vid' ? 'bg-t1' : 'bg-bg'}`}>
              {v.id === 'vid' ? <Icon name="play" size={18} className="text-white/70" /> : <Icon name="image" size={18} className="text-t3" />}
              <span className={`text-[8px] font-bold tracking-wider ${v.id === 'vid' ? 'text-white/50' : 'text-t3'}`}>{v.label}</span>
            </button>
          ))}
        </div>

        {/* Info bar */}
        <div className="px-4 py-[14px] bg-white border-b border-border">
          <p className="text-[10px] text-t3 font-semibold uppercase tracking-wider mb-[6px]">TOYOTA</p>
          <div className="flex gap-4 flex-wrap">
            <div><p className="text-[10px] text-t2 font-semibold">Model</p><p className="text-[15px] font-extrabold text-t1 leading-tight">{car.name}</p></div>
            <div><p className="text-[10px] text-t2 font-semibold">Type</p><p className="text-[15px] font-extrabold text-t1 leading-tight">{car.type}</p></div>
            <div><p className="text-[10px] text-t2 font-semibold">Price</p><p className="text-[15px] font-extrabold text-primary">{car.priceLabel}</p></div>
          </div>
        </div>

        <div className="px-4 pt-4">
          {/* Advisory */}
          <div className="flex items-start gap-[9px] p-[11px] bg-primary-light rounded-md border border-primary-medium mb-[14px]">
            <span className="w-[7px] h-[7px] rounded-full bg-avail flex-shrink-0 mt-1" />
            <p className="text-[11px] text-primary font-medium leading-relaxed">ก่อนจอง กรุณาตรวจสอบสต็อคและสีที่ต้องการก่อนทำการจอง</p>
          </div>

          {/* Spec Grid */}
          <div className="card-base">
            <div className="card-hd"><span className="card-title">Car Specifications</span></div>
            <div className="grid grid-cols-2 gap-[10px] mb-3">
              {[
                { icon: 'fuel', label: 'Fuel', val: car.fuel },
                { icon: 'seat', label: 'Capacity', val: `${car.seats} ที่นั่ง` },
                { icon: 'gear', label: 'Gearbox', val: car.gearbox },
                { icon: 'power', label: 'Power', val: car.power },
              ].map(s => (
                <div key={s.label} className="flex items-center gap-[10px] p-[10px] bg-bg rounded-md">
                  <span className="text-primary flex-shrink-0"><Icon name={s.icon} size={18} /></span>
                  <div><p className="text-[10px] text-t3">{s.label}</p><p className="text-[12px] font-bold text-t1">{s.val}</p></div>
                </div>
              ))}
            </div>

            {/* Spec Accordion */}
            {[
              { key: 'engine', label: 'เครื่องยนต์ / Engine', icon: 'power', type: 'kv' },
              { key: 'dim', label: 'มิติตัวถัง / Dimensions', icon: 'car', type: 'kv' },
              { key: 'safety', label: 'ความปลอดภัย / Safety', icon: 'shield', type: 'tags', tagClass: 'bg-emerald-50 border-emerald-200 text-emerald-700' },
              { key: 'features', label: 'ฟีเจอร์ / Features', icon: 'star', type: 'tags', tagClass: 'bg-bg border-border text-t2' },
            ].map(sec => (
              <div key={sec.key} className="border-t border-border mt-1">
                <button onClick={() => setOpenSpec(openSpec === sec.key ? '' : sec.key)} className="flex items-center justify-between w-full py-[10px] cursor-pointer select-none">
                  <span className="text-[12px] font-bold text-t1 flex items-center gap-[6px]"><Icon name={sec.icon} size={14} className="text-primary" /> {sec.label}</span>
                  <Icon name="chevronDown" size={14} className={`text-t3 transition-transform ${openSpec === sec.key ? 'rotate-180' : ''}`} />
                </button>
                {openSpec === sec.key && (
                  <div className="pb-2">
                    {sec.type === 'kv' ? (
                      car.specs[sec.key].map(([lbl, val], i) => (
                        <div key={i} className="flex justify-between items-start py-[5px] border-b border-border last:border-b-0">
                          <span className="text-[11px] text-t3" style={{ flex: '0 0 45%' }}>{lbl}</span>
                          <span className="text-[11px] font-semibold text-t1 text-right flex-1">{val}</span>
                        </div>
                      ))
                    ) : (
                      <div className="flex flex-wrap gap-1">
                        {car.specs[sec.key].map((tag, i) => (
                          <span key={i} className={`inline-block rounded-[20px] text-[10px] font-semibold px-2 py-[2px] border ${sec.tagClass}`}>{tag}</span>
                        ))}
                      </div>
                    )}
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* Color Picker */}
          <div className="card-base">
            <div className="card-hd"><span className="card-title">เลือกสี | Choose Color</span></div>
            <div className="flex gap-[10px] flex-wrap">
              {COLOR_OPTIONS.map(c => (
                <button key={c.name} onClick={() => setColor(c.name)} className={`w-7 h-7 rounded-full cursor-pointer transition-all border-2 ${color === c.name ? 'border-primary scale-[1.2]' : 'border-transparent'}`} style={{ background: c.hex }} />
              ))}
            </div>
            <p className="text-[11px] text-t2 mt-2">{color}</p>
          </div>

          {/* Stock */}
          <div className="card-base">
            <div className="card-hd"><span className="card-title">Stock & Availability</span></div>
            <p className={`inline-flex items-center gap-[5px] text-[11px] font-bold mb-3 ${car.avail === 'In Stock' ? 'text-avail' : 'text-transit'}`}>
              <span className="w-[7px] h-[7px] rounded-full" style={{ background: 'currentColor' }} /> {car.avail}
            </p>
            <p className="text-[11px] text-t2 mb-3">{car.stock}</p>
            {[
              { icon: 'shield', label: 'ประกัน / Warranty', val: car.warranty },
              { icon: 'wrench', label: 'ฟรีเซอร์วิส / Free Service', val: '5 ครั้ง / 5 times' },
              { icon: 'leaf', label: 'อัตราสิ้นเปลือง / Economy', val: car.eco },
            ].map(p => (
              <div key={p.label} className="flex items-center gap-3 py-3 border-b border-border last:border-b-0">
                <div className="w-9 h-9 bg-primary-light rounded-sm flex items-center justify-center text-primary flex-shrink-0"><Icon name={p.icon} size={16} /></div>
                <div className="flex-1"><p className="text-[13px] font-bold text-t1">{p.label}</p><p className="text-[11px] text-t2 mt-[1px]">{p.val}</p></div>
                <span className="text-t3 cursor-pointer"><Icon name="chevronRight" size={16} /></span>
              </div>
            ))}
          </div>

          {/* CTA */}
          <div className="flex gap-[10px] mt-1 mb-4">
            <button onClick={handleCalc} className="btn-g flex-1 cursor-pointer flex items-center justify-center gap-2"><Icon name="calc" size={16} /> คำนวณผ่อน</button>
            <button onClick={handleBook} className="btn-p flex-1 cursor-pointer"><Icon name="book" size={16} /> Book Now</button>
          </div>

          {/* Inline Calculator */}
          <div id="calculator" className="card-base">
            <div className="card-hd"><span className="card-title">คำนวณสินเชื่อ / Calculate Installment</span></div>
            <InlineCalculator carPrice={car.price} carName={car.name} />
          </div>
        </div>
      </div>
    </div>
  );
}
