import React, { useState, useRef, useEffect } from 'react';
import { Outlet, useNavigate } from 'react-router-dom';
import BottomNav from './BottomNav';
import Icon from '../icons/Icon';
import { useAuthStore } from '../../stores/authStore';

function RoleSwitcher() {
  const navigate = useNavigate();
  const user = useAuthStore((s) => s.user);
  const role = useAuthStore((s) => s.role);
  const switchRole = useAuthStore((s) => s.switchRole);
  const [open, setOpen] = useState(false);
  const popoverRef = useRef(null);
  const buttonRef = useRef(null);

  useEffect(() => {
    if (!open) return;
    function handleClickOutside(e) {
      if (
        popoverRef.current && !popoverRef.current.contains(e.target) &&
        buttonRef.current && !buttonRef.current.contains(e.target)
      ) {
        setOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('touchstart', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('touchstart', handleClickOutside);
    };
  }, [open]);

  if (!user) return null;

  const initColor = role === 'mgr' ? '#7C3AED' : '#2563EB';
  const roleLabel = role === 'mgr' ? 'ผู้จัดการ' : 'เซลส์';

  const handleSwitch = (newRole) => {
    if (newRole === role) return;
    switchRole(newRole);
    setOpen(false);
    const dest = newRole === 'mgr' ? '/mgr-dash' : '/sales-dash';
    navigate(dest);
  };

  return (
    <div className="flex items-center justify-between px-3 bg-white border-b border-border relative" style={{ height: 40, fontFamily: "'Sarabun', sans-serif" }}>
      <div className="flex items-center gap-2">
        <div
          className="w-6 h-6 rounded-full flex items-center justify-center text-white text-xs font-bold"
          style={{ backgroundColor: initColor }}
        >
          {user.init || user.name?.charAt(0) || '?'}
        </div>
        <span className="text-xs text-t2 font-medium">{user.name}</span>
        <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-gray-100 text-t3 font-medium">{roleLabel}</span>
      </div>

      <div className="relative">
        <button
          ref={buttonRef}
          onClick={() => setOpen(!open)}
          className="text-[10px] px-2 py-1 rounded-md border border-border text-t2 hover:bg-gray-50 transition-colors cursor-pointer"
        >
          สลับบทบาท
        </button>

        {open && (
          <div
            ref={popoverRef}
            className="absolute right-0 top-9 z-50 bg-white border border-border rounded-xl shadow-xl p-3 min-w-[260px]"
            style={{ fontFamily: "'Sarabun', sans-serif" }}
          >
            {/* Arrow triangle */}
            <div className="absolute -top-2 right-4 w-4 h-4 bg-white border-l border-t border-border rotate-45 rounded-sm" />

            <div className="relative grid grid-cols-2 gap-2.5">
              {/* Sales card */}
              <button
                onClick={() => handleSwitch('sales')}
                className={`rounded-xl p-3 text-center transition-all cursor-pointer border-2 ${
                  role === 'sales'
                    ? 'border-primary bg-primary/5'
                    : 'border-border bg-white hover:bg-gray-50'
                }`}
              >
                <div className={`w-9 h-9 rounded-full mx-auto mb-1.5 flex items-center justify-center ${
                  role === 'sales' ? 'bg-primary text-white' : 'bg-gray-100 text-t3'
                }`}>
                  <Icon name="user" size={18} />
                </div>
                <div className={`text-xs font-bold ${role === 'sales' ? 'text-primary' : 'text-t2'}`}>
                  พนักงานขาย
                </div>
                <div className="text-[9px] text-t3 mt-0.5">Sales</div>
                {role === 'sales' && (
                  <div className="mt-1">
                    <span className="text-[8px] font-bold text-primary bg-primary/10 px-1.5 py-0.5 rounded-full">
                      ใช้งานอยู่
                    </span>
                  </div>
                )}
              </button>

              {/* Manager card */}
              <button
                onClick={() => handleSwitch('mgr')}
                className={`rounded-xl p-3 text-center transition-all cursor-pointer border-2 ${
                  role === 'mgr'
                    ? 'border-primary bg-primary/5'
                    : 'border-border bg-white hover:bg-gray-50'
                }`}
              >
                <div className={`w-9 h-9 rounded-full mx-auto mb-1.5 flex items-center justify-center ${
                  role === 'mgr' ? 'bg-primary text-white' : 'bg-gray-100 text-t3'
                }`}>
                  <Icon name="chart" size={18} />
                </div>
                <div className={`text-xs font-bold ${role === 'mgr' ? 'text-primary' : 'text-t2'}`}>
                  ผู้จัดการ
                </div>
                <div className="text-[9px] text-t3 mt-0.5">Manager</div>
                {role === 'mgr' && (
                  <div className="mt-1">
                    <span className="text-[8px] font-bold text-primary bg-primary/10 px-1.5 py-0.5 rounded-full">
                      ใช้งานอยู่
                    </span>
                  </div>
                )}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default function AppShell() {
  return (
    <div className="min-h-screen bg-bg flex flex-col">
      <RoleSwitcher />
      <main
        className="flex-1 overflow-y-auto"
        style={{
          paddingBottom: 80,
          WebkitOverflowScrolling: 'touch',
        }}
      >
        <Outlet />
      </main>

      <BottomNav />
    </div>
  );
}
