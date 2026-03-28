import React, { useState } from 'react';

const SECTIONS = [
  { key: 'engine', title: 'เครื่องยนต์ / Engine' },
  { key: 'dim', title: 'ขนาด / Dimensions' },
  { key: 'safety', title: 'ความปลอดภัย / Safety' },
  { key: 'features', title: 'ฟีเจอร์ / Features' },
];

export default function SpecAccordion({ specs }) {
  const [openSections, setOpenSections] = useState(new Set(['engine']));

  const toggle = (key) => {
    setOpenSections((prev) => {
      const next = new Set(prev);
      if (next.has(key)) {
        next.delete(key);
      } else {
        next.add(key);
      }
      return next;
    });
  };

  if (!specs) return null;

  return (
    <div>
      {SECTIONS.map((section) => {
        const data = specs[section.key];
        if (!data || data.length === 0) return null;

        const isOpen = openSections.has(section.key);
        const isGrid = section.key === 'engine' || section.key === 'dim';

        return (
          <div key={section.key} className="border-t border-border">
            {/* Header */}
            <button
              onClick={() => toggle(section.key)}
              className="py-[10px] w-full flex justify-between items-center cursor-pointer"
            >
              <span className="text-[12px] font-bold text-t1">{section.title}</span>
              <span className="text-t3 text-xs">{isOpen ? '\u25B2' : '\u25BC'}</span>
            </button>

            {/* Content */}
            {isOpen && (
              <div className="pb-3">
                {isGrid ? (
                  <div>
                    {data.map(([label, value], idx) => (
                      <div key={idx} className="flex justify-between py-[5px] border-b border-border">
                        <span className="text-[11px] text-t3" style={{ flex: '0 0 45%' }}>{label}</span>
                        <span className="text-[11px] font-semibold text-t1 text-right">{value}</span>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="space-y-2">
                    {data.map((item, idx) => (
                      <div key={idx} className="flex items-start gap-2">
                        <span className="text-green-500 text-xs mt-0.5">&#10003;</span>
                        <span className="text-[11px] text-t1">{item}</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
