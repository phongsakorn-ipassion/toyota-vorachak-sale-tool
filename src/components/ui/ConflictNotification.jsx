import React, { useEffect } from 'react'
import Icon from '../icons/Icon'

/**
 * ConflictNotification — toast/popup for concurrent save conflicts
 * Props: message, onRefresh, onDismiss
 */
export default function ConflictNotification({ message, onRefresh, onDismiss }) {
  useEffect(() => {
    const timer = setTimeout(() => {
      if (onDismiss) onDismiss()
    }, 5000)
    return () => clearTimeout(timer)
  }, [onDismiss])

  return (
    <div className="fixed top-4 left-4 right-4 z-[9999] animate-slide-down">
      <div className="bg-white border-l-4 border-orange-500 rounded-lg shadow-lg p-4 flex items-start gap-3">
        <div className="w-8 h-8 rounded-full bg-orange-100 flex items-center justify-center flex-shrink-0">
          <Icon name="alert" size={18} className="text-orange-600" />
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-[13px] font-bold text-t1 mb-1">ข้อมูลขัดแย้ง</p>
          <p className="text-[12px] text-t2 leading-relaxed">{message}</p>
          {onRefresh && (
            <button
              onClick={onRefresh}
              className="mt-2 text-[12px] font-bold text-primary underline"
            >
              โหลดข้อมูลใหม่
            </button>
          )}
        </div>
        {onDismiss && (
          <button
            onClick={onDismiss}
            className="text-t3 hover:text-t1 flex-shrink-0"
          >
            <Icon name="close" size={16} />
          </button>
        )}
      </div>
    </div>
  )
}
