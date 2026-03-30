import React, { useState, useEffect } from 'react';

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
}) {
  const [notes, setNotes] = useState('');

  useEffect(() => {
    if (!isOpen) setNotes('');
  }, [isOpen]);

  if (!isOpen) return null;

  const isConfirmDisabled = requireNotes && !notes.trim();

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center px-6"
      onClick={onClose}
    >
      {/* Overlay */}
      <div className="absolute inset-0 bg-black/40" />

      {/* Dialog */}
      <div
        className="relative bg-white rounded-2xl w-full max-w-sm shadow-xl overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="px-5 pt-5 pb-4">
          <h3 className="text-[15px] font-extrabold text-t1 mb-1">{title}</h3>
          {message && (
            <p className="text-[12px] text-t2 leading-relaxed">{message}</p>
          )}

          {showNotes && (
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="เพิ่มหมายเหตุ..."
              rows={3}
              className="mt-3 w-full px-3 py-2 bg-bg border border-border rounded-lg text-[12px] text-t1 placeholder:text-t3 outline-none focus:border-primary resize-none"
              style={{ fontFamily: "'Sarabun', sans-serif" }}
            />
          )}
        </div>

        <div className="flex border-t border-border">
          <button
            onClick={onClose}
            className="flex-1 py-3 text-[13px] font-bold text-t2 border-r border-border active:bg-gray-50 cursor-pointer"
          >
            {cancelLabel}
          </button>
          <button
            onClick={() => onConfirm(notes.trim())}
            disabled={isConfirmDisabled}
            className="flex-1 py-3 text-[13px] font-bold active:opacity-70 cursor-pointer disabled:opacity-30 disabled:cursor-not-allowed"
            style={{ color: isConfirmDisabled ? '#9CA3AF' : confirmColor }}
          >
            {confirmLabel}
          </button>
        </div>
      </div>
    </div>
  );
}
