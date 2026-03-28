import React from 'react';
import { useNavigate } from 'react-router-dom';
import Icon from '../icons/Icon';

export default function PageHeader({ title, showBack = false, rightAction = null }) {
  const navigate = useNavigate();

  return (
    <header className="bg-white py-[13px] px-4 flex items-center gap-[11px] border-b border-border shrink-0">
      {/* Back button */}
      {showBack && (
        <button
          onClick={() => navigate(-1)}
          className="w-9 h-9 rounded-full bg-bg border border-border flex items-center justify-center text-t1 cursor-pointer shrink-0"
        >
          <Icon name="back" size={18} />
        </button>
      )}

      {/* Title */}
      <h1 className="flex-1 text-[15px] font-extrabold text-t1 truncate">
        {title}
      </h1>

      {/* Right action */}
      <div className="shrink-0 text-t2">
        {rightAction}
      </div>
    </header>
  );
}
