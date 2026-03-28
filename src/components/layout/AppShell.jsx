import React from 'react';
import { Outlet } from 'react-router-dom';
import BottomNav from './BottomNav';

export default function AppShell() {
  return (
    <div className="min-h-screen bg-bg flex flex-col">
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
