import React from 'react';
import { Outlet } from 'react-router-dom';
import { useUiStore } from '../../stores/uiStore';
import StatusBar from './StatusBar';
import BottomNav from './BottomNav';
import DemoBar from './DemoBar';

const DEVICE_CONFIG = {
  phone: { width: 390, height: 844, borderRadius: 46 },
  tablet: { width: 768, height: 960, borderRadius: 24 },
};

export default function AppShell() {
  const device = useUiStore((s) => s.device);
  const config = DEVICE_CONFIG[device] || DEVICE_CONFIG.phone;

  return (
    <div className="min-h-screen bg-[#1a1a2e] flex flex-col items-center">
      <DemoBar />

      {/* Device frame */}
      <div
        className="relative mt-16 mb-8"
        style={{
          width: config.width,
          height: config.height,
          borderRadius: config.borderRadius,
          boxShadow:
            '0 40px 100px rgba(0,0,0,.7), 0 0 0 1px rgba(255,255,255,.05)',
        }}
      >
        {/* Device inner */}
        <div
          className="bg-bg overflow-hidden flex flex-col relative"
          style={{
            width: config.width,
            height: config.height,
            borderRadius: config.borderRadius,
          }}
        >
          <StatusBar />

          <main
            className="flex-1 overflow-y-auto"
            style={{
              paddingBottom: device === 'tablet' ? 96 : 88,
              WebkitOverflowScrolling: 'touch',
            }}
          >
            <Outlet />
          </main>

          <BottomNav />
        </div>
      </div>
    </div>
  );
}
