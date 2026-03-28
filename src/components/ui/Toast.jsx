import React, { useEffect } from 'react';

const typeStyles = {
  success: 'bg-green-600',
  error: 'bg-red-600',
  info: 'bg-blue-600',
};

export default function Toast({ message, type = 'success', isVisible, onClose }) {
  useEffect(() => {
    if (isVisible) {
      const timer = setTimeout(() => {
        onClose?.();
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [isVisible, onClose]);

  if (!isVisible) return null;

  return (
    <div className="fixed bottom-20 left-4 right-4 z-50 animate-slideUp">
      <div
        className={`
          ${typeStyles[type] || typeStyles.info}
          text-white text-sm font-medium px-4 py-3 rounded-lg shadow-lg
          flex items-center justify-between
        `.trim()}
      >
        <span>{message}</span>
        <button onClick={onClose} className="ml-3 opacity-80 hover:opacity-100">
          &times;
        </button>
      </div>
    </div>
  );
}
