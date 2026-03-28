import React from 'react';

export default function KPICard({ label, value, target, unit = '', color = '#EB0A1E' }) {
  const percentage = target > 0 ? Math.min((value / target) * 100, 100) : 0;

  return (
    <div className="bg-white rounded-lg border border-border p-[14px]">
      <div className="text-[26px] font-extrabold text-t1">
        {typeof value === 'number' ? value.toLocaleString() : value}
        {unit && <span className="text-sm font-normal text-t3 ml-1">{unit}</span>}
      </div>
      <div className="text-[12px] text-t2 mt-[3px]">{label}</div>
      {target > 0 && (
        <div className="mt-3">
          <div className="flex justify-between text-[10px] text-t3 mt-[2px] mb-1">
            <span>{Math.round(percentage)}%</span>
            <span>Target: {target.toLocaleString()}{unit}</span>
          </div>
          <div className="w-full h-[5px] bg-border rounded-[3px] overflow-hidden">
            <div
              className="h-full rounded-[3px] transition-all duration-500"
              style={{ width: `${percentage}%`, backgroundColor: color }}
            />
          </div>
        </div>
      )}
    </div>
  );
}
