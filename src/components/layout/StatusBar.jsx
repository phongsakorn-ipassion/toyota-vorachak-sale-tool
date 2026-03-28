import React, { useState, useEffect } from 'react';

export default function StatusBar() {
  const [time, setTime] = useState(() => formatTime(new Date()));

  useEffect(() => {
    const id = setInterval(() => setTime(formatTime(new Date())), 60_000);
    return () => clearInterval(id);
  }, []);

  return (
    <div className="h-[50px] bg-white border-b border-border flex items-center justify-between shrink-0" style={{ padding: '0 24px' }}>
      {/* Time */}
      <span className="text-[14px] font-bold text-t1">{time}</span>

      {/* Right icons */}
      <div className="flex items-center gap-[6px]">
        {/* Signal bars */}
        <div className="flex items-end gap-[1.5px] h-3">
          <div className="w-[3px] h-[3px] rounded-[1px] bg-t1" />
          <div className="w-[3px] h-[5px] rounded-[1px] bg-t1" />
          <div className="w-[3px] h-[8px] rounded-[1px] bg-t1" />
          <div className="w-[3px] h-[12px] rounded-[1px] bg-t1" />
        </div>

        {/* Wifi */}
        <svg width="16" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-t1">
          <path d="M5 12.55a11 11 0 0 1 14.08 0" />
          <path d="M1.42 9a16 16 0 0 1 21.16 0" />
          <path d="M8.53 16.11a6 6 0 0 1 6.95 0" />
          <circle cx="12" cy="20" r="1" fill="currentColor" />
        </svg>

        {/* Battery */}
        <svg width="26" height="12" viewBox="0 0 26 12" fill="none" className="text-t1">
          <rect x="0.5" y="0.5" width="22" height="11" rx="2" stroke="currentColor" strokeWidth="1" />
          <rect x="2" y="2" width="18" height="8" rx="1" fill="currentColor" />
          <rect x="23.5" y="3.5" width="2" height="5" rx="1" fill="currentColor" />
        </svg>
      </div>
    </div>
  );
}

function formatTime(date) {
  return date.toLocaleTimeString('th-TH', {
    hour: '2-digit',
    minute: '2-digit',
    hour12: false,
  });
}
