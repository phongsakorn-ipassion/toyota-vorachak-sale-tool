import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuthStore } from '../../stores/authStore';
import Icon from '../icons/Icon';

// Prototype: Sales has 4 tabs: หน้าหลัก / Leads / รุ่นรถ / ผ่อน
const SALES_TABS = [
  { label: 'หน้าหลัก', path: '/sales-dash', icon: 'home' },
  { label: 'Leads', path: '/leads', icon: 'users', badge: true },
  { label: 'รุ่นรถ', path: '/catalog', icon: 'car' },
  { label: 'ผ่อน', path: '/calc', icon: 'calc' },
];

// Prototype: Manager has 4 tabs: Dashboard / Pipeline / Targets / Reports
const MGR_TABS = [
  { label: 'Dashboard', path: '/mgr-dash', icon: 'chart' },
  { label: 'Pipeline', path: '/pipeline', icon: 'pipeline', badge: true },
  { label: 'Targets', path: '/targets', icon: 'target' },
  { label: 'Reports', path: '/reports', icon: 'report' },
];

export default function BottomNav() {
  const navigate = useNavigate();
  const location = useLocation();
  const role = useAuthStore((s) => s.role);
  const tabs = role === 'mgr' ? MGR_TABS : SALES_TABS;
  const currentPath = location.pathname;

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-border flex items-start z-50" style={{ height: 78, paddingTop: 11, paddingBottom: 'env(safe-area-inset-bottom, 0px)' }}>
      {tabs.map((tab) => {
        const isActive = currentPath === tab.path;
        return (
          <button
            key={tab.path}
            onClick={() => navigate(tab.path)}
            className={`flex-1 flex flex-col items-center gap-[3px] relative cursor-pointer transition-colors ${isActive ? 'text-primary' : 'text-t3'}`}
            style={{ fontFamily: "'Sarabun', sans-serif", padding: '2px 4px' }}
          >
            <div className="w-6 h-6 flex items-center justify-center relative">
              <Icon name={tab.icon} size={22} />
              {tab.badge && (
                <span className="absolute top-0 right-[-4px] w-[7px] h-[7px] rounded-full bg-hot" style={{ border: '1.5px solid white' }} />
              )}
            </div>
            <span className="text-[10px] font-bold">{tab.label}</span>
            {isActive && (
              <span className="absolute bottom-[-9px] left-1/2 -translate-x-1/2 w-[5px] h-[5px] rounded-full bg-primary" />
            )}
          </button>
        );
      })}
    </nav>
  );
}
