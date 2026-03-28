import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useUiStore } from '../../stores/uiStore';
import { useAuthStore } from '../../stores/authStore';

export default function DemoBar() {
  const navigate = useNavigate();
  const device = useUiStore((s) => s.device);
  const setDevice = useUiStore((s) => s.setDevice);
  const role = useAuthStore((s) => s.role);
  const login = useAuthStore((s) => s.login);

  const handleRoleChange = (newRole) => {
    if (newRole === role) return;
    login(newRole);
    navigate(newRole === 'mgr' ? '/mgr-dash' : '/sales-dash');
  };

  const handleDeviceChange = (newDevice) => {
    if (newDevice === device) return;
    setDevice(newDevice);
  };

  const pillBase = 'text-xs px-3 py-1 rounded-full transition-colors cursor-pointer';
  const pillActive = 'bg-primary text-white';
  const pillInactive = 'bg-white/10 text-white/70 hover:bg-white/20';

  return (
    <div className="fixed top-0 left-0 right-0 bg-[#1a1a2e] py-2 px-4 flex items-center justify-center gap-4 z-50">
      {/* Device toggle */}
      <div className="flex items-center gap-1">
        <span className="text-xs text-white/50 mr-1">Device:</span>
        <button
          onClick={() => handleDeviceChange('phone')}
          className={`${pillBase} ${device === 'phone' ? pillActive : pillInactive}`}
        >
          iPhone
        </button>
        <button
          onClick={() => handleDeviceChange('tablet')}
          className={`${pillBase} ${device === 'tablet' ? pillActive : pillInactive}`}
        >
          iPad
        </button>
      </div>

      {/* Divider */}
      <div className="w-px h-4 bg-white/20" />

      {/* Role toggle */}
      <div className="flex items-center gap-1">
        <span className="text-xs text-white/50 mr-1">Role:</span>
        <button
          onClick={() => handleRoleChange('sales')}
          className={`${pillBase} ${role === 'sales' ? pillActive : pillInactive}`}
        >
          Sales
        </button>
        <button
          onClick={() => handleRoleChange('mgr')}
          className={`${pillBase} ${role === 'mgr' ? pillActive : pillInactive}`}
        >
          Manager
        </button>
      </div>
    </div>
  );
}
