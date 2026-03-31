import React, { useState } from 'react';
import Icon from '../icons/Icon';

const VIEWS = [
  { id: 'ext', label: 'หน้า' },
  { id: 'side', label: 'ข้าง' },
  { id: 'rear', label: 'หลัง' },
  { id: 'int', label: 'ภายใน' },
  { id: 'vid', label: 'วิดีโอ' },
];

export default function CarGallery({ car }) {
  const [activeView, setActiveView] = useState('ext');
  const [imgError, setImgError] = useState({});

  const handleImgError = (viewId) => {
    setImgError((prev) => ({ ...prev, [viewId]: true }));
  };

  return (
    <div>
      {/* Main image area */}
      <div
        className="w-full h-[210px] overflow-hidden flex items-center justify-center"
        style={{ background: 'linear-gradient(160deg, #F0FAF3, #E2F2E8)' }}
      >
        {activeView === 'vid' ? (
          <iframe
            src={`https://www.youtube.com/embed/${car.video}?autoplay=0&rel=0`}
            className="w-full h-full"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope"
            allowFullScreen
            title={`${car.name} video`}
          />
        ) : imgError[activeView] || !car.imgs?.[activeView] ? (
          <span className="text-sm font-bold text-t2">{car.name}</span>
        ) : (
          <img
            src={car.imgs[activeView]}
            alt={`${car.name} - ${activeView}`}
            className="w-[85%] max-w-[340px] h-auto object-cover drop-shadow-lg"
            onError={() => handleImgError(activeView)}
          />
        )}
      </div>

      {/* Thumbnail strip */}
      <div className="flex gap-2 py-[10px] px-[14px] bg-white border-b border-border overflow-x-auto">
        {VIEWS.map((view) => (
          <button
            key={view.id}
            onClick={() => setActiveView(view.id)}
            className={`
              w-[68px] h-[52px] rounded-sm cursor-pointer shrink-0 overflow-hidden
              flex items-center justify-center text-[10px] font-bold
              ${activeView === view.id ? 'border-2 border-primary' : 'border border-border'}
            `.trim()}
            style={{ backgroundColor: view.id === 'vid' ? '#1a1a2e' : car.bg }}
          >
            {view.id === 'vid' ? (
              <Icon name="play" size={14} className="text-white" />
            ) : car.imgs?.[view.id] && !imgError[view.id] ? (
              <img
                src={car.imgs[view.id]}
                alt={view.label}
                className="w-full h-full object-cover"
                onError={() => handleImgError(view.id)}
              />
            ) : (
              <span className="text-t3">{view.label}</span>
            )}
          </button>
        ))}
      </div>
    </div>
  );
}
