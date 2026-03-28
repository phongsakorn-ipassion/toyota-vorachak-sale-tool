import React from 'react';

export default function FilterPill({ label, active = false, onClick }) {
  return (
    <button
      onClick={onClick}
      className={`pill-filter ${active ? 'on' : ''}`}
    >
      {label}
    </button>
  );
}
