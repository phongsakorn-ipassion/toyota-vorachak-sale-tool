import React, { useState } from 'react';
import Badge from '../ui/Badge';

export default function CarListItem({ car, onClick }) {
  const [imgError, setImgError] = useState(false);

  const availBadge = car.avail === 'In Stock' ? 'avail' : 'transit';
  const availLabel = car.avail === 'In Stock' ? 'In Stock' : 'In Transit';

  const fuelBadge = car.fuel === 'Hybrid' || car.fuel === 'Electric' ? 'won' : 'cool';

  return (
    <div className="card-base cursor-pointer flex gap-3" onClick={onClick}>
      {/* Car image */}
      <div
        className="w-24 h-[72px] rounded-md overflow-hidden shrink-0 flex items-center justify-center"
        style={{ backgroundColor: car.bg }}
      >
        {!imgError ? (
          <img
            src={car.img}
            alt={car.name}
            className="w-full h-full object-cover"
            onError={() => setImgError(true)}
          />
        ) : (
          <span className="text-xs font-bold text-t2">{car.type}</span>
        )}
      </div>

      {/* Car info */}
      <div className="flex flex-col justify-between flex-1 min-w-0">
        <div>
          <p className="text-sm font-bold text-t1 truncate">{car.name}</p>
          <p className="text-xs text-t2">{car.type}</p>
        </div>

        <div className="flex items-center gap-1.5">
          <Badge level={availBadge}>{availLabel}</Badge>
          <Badge level={fuelBadge}>{car.fuel}</Badge>
        </div>

        <p className="text-base font-extrabold text-primary">{car.priceLabel}</p>
      </div>
    </div>
  );
}
