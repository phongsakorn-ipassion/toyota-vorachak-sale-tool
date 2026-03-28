import React from 'react';

const variantClasses = {
  primary: 'bg-primary text-white rounded-pill font-bold',
  outline: 'bg-transparent text-primary border border-primary rounded-pill font-bold',
  ghost: 'bg-transparent text-t2 border border-border rounded-pill font-bold',
};

const sizeClasses = {
  sm: 'py-2 px-4 text-xs',
  md: 'py-3 px-5 text-sm',
  lg: 'py-4 px-5 text-sm',
};

export default function Button({
  children,
  variant = 'primary',
  size = 'md',
  className = '',
  onClick,
  disabled = false,
  fullWidth = false,
}) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`
        ${variantClasses[variant] || variantClasses.primary}
        ${sizeClasses[size] || sizeClasses.md}
        ${fullWidth ? 'w-full' : ''}
        ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
        transition-all duration-200 inline-flex items-center justify-center gap-2
        ${className}
      `.trim()}
    >
      {children}
    </button>
  );
}
