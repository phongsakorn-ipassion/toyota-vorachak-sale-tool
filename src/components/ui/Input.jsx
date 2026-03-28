import React from 'react';
import Icon from '../icons/Icon';

export default function Input({
  label,
  icon,
  placeholder,
  value,
  onChange,
  type = 'text',
  error,
}) {
  return (
    <div className="mb-4">
      {label && (
        <label className="block text-sm font-semibold text-t1 mb-1.5">
          {label}
        </label>
      )}
      <div className="relative">
        {icon && (
          <div className="absolute left-3 top-1/2 -translate-y-1/2 text-t3">
            <Icon name={icon} size={18} />
          </div>
        )}
        <input
          type={type}
          placeholder={placeholder}
          value={value}
          onChange={onChange}
          className={`
            w-full border rounded-sm py-3 text-sm bg-white text-t1
            focus:border-primary focus:outline-none transition-colors
            ${icon ? 'pl-10 pr-3.5' : 'px-3.5'}
            ${error ? 'border-red-500' : 'border-border'}
          `.trim()}
        />
      </div>
      {error && (
        <p className="text-red-500 text-xs mt-1">{error}</p>
      )}
    </div>
  );
}
