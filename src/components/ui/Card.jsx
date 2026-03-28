import React from 'react';

export default function Card({ children, className = '', onClick }) {
  return (
    <div
      onClick={onClick}
      className={`bg-card rounded-lg border border-border p-4 mb-3 ${onClick ? 'cursor-pointer' : ''} ${className}`}
    >
      {children}
    </div>
  );
}
