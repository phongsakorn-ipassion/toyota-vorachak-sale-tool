import React, { useState, useEffect } from 'react';
import Icon from '../icons/Icon';

export default function ConfirmDialog({
  isOpen,
  onClose,
  onConfirm,
  title = 'ยืนยัน',
  message = '',
  confirmLabel = 'ยืนยัน',
  cancelLabel = 'ยกเลิก',
  showNotes = false,
  requireNotes = false,
  confirmColor = '#DC2626',
  titleIcon = null,
}) {
  const [notes, setNotes] = useState('');

  useEffect(() => {
    if (!isOpen) setNotes('');
  }, [isOpen]);

  if (!isOpen) return null;

  const isConfirmDisabled = requireNotes && !notes.trim();

  // Default icon based on confirmColor (red = alert, otherwise check)
  const resolvedIcon = titleIcon || (confirmColor === '#DC2626' ? 'alert' : 'check');

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center px-6"
      onClick={onClose}
    >
      {/* Overlay */}
      <div className="absolute inset-0 bg-black/40" />

      {/* Dialog */}
      <div
        className="relative bg-white border border-gray-200 rounded-xl w-full max-w-sm shadow-xl overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="p-5">
          <h3 className="text-[15px] font-extrabold text-gray-800 mb-1 flex items-center gap-2">
            <Icon name={resolvedIcon} size={18} className="text-gray-400" />
            {title}
          </h3>
          {message && (
            <p className="text-[12px] text-gray-600 leading-relaxed">{message}</p>
          )}

          {showNotes && (
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="เพิ่มหมายเหตุ..."
              rows={3}
              className="mt-3 w-full px-3 py-2 border border-gray-200 bg-gray-50 rounded-lg text-[12px] text-gray-800 placeholder:text-gray-400 outline-none focus:border-gray-400 resize-none"
              style={{ fontFamily: "'Sarabun', sans-serif" }}
            />
          )}
        </div>

        <div className="flex gap-3 px-5 pb-5">
          <button
            onClick={onClose}
            className="flex-1 py-2.5 text-[13px] font-bold text-gray-600 bg-white border border-gray-300 rounded-lg active:bg-gray-50 cursor-pointer flex items-center justify-center gap-1.5"
          >
            {cancelLabel}
          </button>
          <button
            onClick={() => onConfirm(notes.trim())}
            disabled={isConfirmDisabled}
            className="flex-1 py-2.5 text-[13px] font-bold text-white bg-gray-800 rounded-lg active:opacity-70 cursor-pointer disabled:opacity-30 disabled:cursor-not-allowed flex items-center justify-center gap-1.5"
          >
            {confirmLabel}
          </button>
        </div>
      </div>
    </div>
  );
}
