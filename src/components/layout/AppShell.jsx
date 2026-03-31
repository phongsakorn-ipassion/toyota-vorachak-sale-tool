import React, { useCallback } from 'react';
import { Outlet } from 'react-router-dom';
import BottomNav from './BottomNav';
import { useVisibilityRefresh } from '../../hooks/useVisibilityRefresh';
import { hasSupabase } from '../../lib/supabase';
import { useLeadStore } from '../../stores/leadStore';
import { useBookingStore } from '../../stores/bookingStore';
import { useUiStore } from '../../stores/uiStore';

export default function AppShell() {
  const syncLeads = useLeadStore((s) => s.syncFromServer);
  const syncBookings = useBookingStore((s) => s.syncFromServer);
  const syncNotifications = useUiStore((s) => s.syncFromServer);

  useVisibilityRefresh(useCallback(() => {
    if (hasSupabase) {
      syncLeads();
      syncBookings();
      syncNotifications();
    }
  }, [syncLeads, syncBookings, syncNotifications]));

  return (
    <div className="min-h-screen bg-bg flex flex-col">
      <main className="flex-1 overflow-y-auto" style={{ paddingBottom: 80, WebkitOverflowScrolling: 'touch' }}>
        <Outlet />
      </main>
      <BottomNav />
    </div>
  );
}
