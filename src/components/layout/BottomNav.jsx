import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useUiStore } from '../../stores/uiStore';
import { useAuthStore } from '../../stores/authStore';
import Icon from '../icons/Icon';

const SALES_TABS = [
  { label: 'หน้าหลัก', path: '/sales-dash', icon: 'home' },
  { label: 'รถยนต์', path: '/catalog', icon: 'car' },
  { label: 'Leads', path: '/leads', icon: 'users' },
  { label: 'รายงาน', path: '/reports', icon: 'chart' },
  { label: 'โปรไฟล์', path: '/profile', icon: 'profile' },
];

const MGR_TABS = [
  { label: 'หน้าหลัก', path: '/mgr-dash', icon: 'home' },
  { label: 'รถยนต์', path: '/catalog', icon: 'car' },
  { label: 'Leads', path: '/pipeline', icon: 'pipeline' },
  { label: 'รายงาน', path: '/reports', icon: 'chart' },
  { label: 'โปรไฟล์', path: '/profile', icon: 'profile' },
];

export default function BottomNav() {
  const navigate = useNavigate();
  const location = useLocation();
  const role = useAuthStore((s) => s.role);
  const tabs = role === 'mgr' ? MGR_TABS : SALES_TABS;

  const currentPath = location.pathname;

  return (
    <nav className="fixed bottom-0 left-0 right-0 h-[78px] bg-white border-t border-border flex items-start pt-[11px] shrink-0 z-50" style={{ paddingBottom: 'env(safe-area-inset-bottom, 0px)' }}>
      {tabs.map((tab) => {
        const isActive = currentPath === tab.path;
        return (
          <button
            key={tab.path}
            onClick={() => navigate(tab.path)}
            className={`
              flex-1 flex flex-col items-center gap-[3px] relative
              text-[10px] font-bold transition-colors cursor-pointer
              ${isActive ? 'text-primary' : 'text-t3'}
            `.trim()}
          >
            <div className="w-6 h-6 flex items-center justify-center relative">
              <Icon name={tab.icon} size={22} />
              {tab.icon === 'bell' && (
                <span className="absolute top-0 right-[-4px] w-[7px] h-[7px] rounded-full bg-hot" style={{ border: '1.5px solid white' }} />
              )}
            </div>
            <span>{tab.label}</span>
            {isActive && (
              <span className="absolute bottom-[-9px] left-1/2 -translate-x-1/2 w-[5px] h-[5px] rounded-full bg-primary" />
            )}
          </button>
        );
      })}
    </nav>
  );
}
