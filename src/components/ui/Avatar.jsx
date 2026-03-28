import React from 'react';

const sizeClasses = {
  sm: 'w-8 h-8 text-xs',
  md: 'w-10 h-10 text-sm',
  lg: 'w-14 h-14 text-lg',
};

export default function Avatar({ initial, color = '#EB0A1E', size = 'md' }) {
  return (
    <div
      className={`
        ${sizeClasses[size] || sizeClasses.md}
        rounded-full flex items-center justify-center font-extrabold text-white shrink-0
      `.trim()}
      style={{ backgroundColor: color }}
    >
      {initial}
    </div>
  );
}
