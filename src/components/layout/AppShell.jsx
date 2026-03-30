import React, { useState } from 'react';
import { Outlet, useNavigate } from 'react-router-dom';
import BottomNav from './BottomNav';
import { useAuthStore } from '../../stores/authStore';

function RoleSwitcher() {
  const navigate = useNavigate();
  const user = useAuthStore((s) => s.user);
  const role = useAuthStore((s) => s.role);
  const switchRole = useAuthStore((s) => s.switchRole);
  const [open, setOpen] = useState(false);

  if (!user) return null;

  const initColor = role === 'mgr' ? '#7C3AED' : '#2563EB';
  const roleLabel = role === 'mgr' ? 'ผู้จัดการ' : 'เซลส์';
  const otherRole = role === 'mgr' ? 'sales' : 'mgr';
  const otherLabel = role === 'mgr' ? 'เซลส์' : 'ผู้จัดการ';

  const handleSwitch = () => {
    switchRole(otherRole);
    setOpen(false);
    const dest = otherRole === 'mgr' ? '/mgr-dash' : '/sales-dash';
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
          onClick={() => setOpen(!open)}
          className="text-[10px] px-2 py-1 rounded-md border border-border text-t2 hover:bg-gray-50 transition-colors cursor-pointer"
        >
          สลับบทบาท
        </button>

        {open && (
          <>
            <div className="fixed inset-0 z-40" onClick={() => setOpen(false)} />
            <div className="absolute right-0 top-8 bg-white border border-border rounded-lg shadow-lg z-50 py-1 min-w-[140px]">
              <button
                onClick={handleSwitch}
                className="w-full text-left px-3 py-2 text-xs text-t1 hover:bg-gray-50 transition-colors cursor-pointer"
              >
                เข้าสู่ระบบเป็น {otherLabel}
              </button>
            </div>
          </>
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
