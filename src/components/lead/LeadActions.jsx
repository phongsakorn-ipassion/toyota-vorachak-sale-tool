import React from 'react';
import Icon from '../icons/Icon';

const actions = [
  { type: 'call', label: 'โทร', icon: 'phone', bg: 'bg-blue-50', text: 'text-blue-600' },
  { type: 'line', label: 'LINE', icon: 'line', bg: 'bg-green-50', text: 'text-green-600' },
  { type: 'appointment', label: 'นัดหมาย', icon: 'calendar', bg: 'bg-amber-50', text: 'text-amber-600' },
  { type: 'note', label: 'บันทึก', icon: 'note', bg: 'bg-purple-50', text: 'text-purple-600' },
];

export default function LeadActions({ lead, onAction }) {
  const handleClick = (type) => {
    if (onAction) {
      onAction(type);
    } else {
      console.log(`Action: ${type} for lead ${lead?.name}`);
    }
  };

  return (
    <div className="grid grid-cols-4 gap-2 my-4">
      {actions.map((action) => (
        <button
          key={action.type}
          onClick={() => handleClick(action.type)}
          className="flex flex-col items-center justify-center gap-1 py-3 px-[6px] rounded-lg border border-border bg-white cursor-pointer transition-all duration-150 active:scale-95"
        >
          <Icon name={action.icon} size={20} className="text-primary" />
          <span className="text-[10px] font-bold text-t2">
            {action.label}
          </span>
        </button>
      ))}
    </div>
  );
}
