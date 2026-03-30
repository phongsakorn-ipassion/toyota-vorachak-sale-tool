import React from 'react';
import { HashRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import AppShell from './components/layout/AppShell';
import ProtectedRoute from './components/ProtectedRoute';
import LoginPage from './pages/LoginPage';
import CatalogPage from './pages/CatalogPage';
import CarDetailPage from './pages/CarDetailPage';
import LeadListPage from './pages/LeadListPage';
import LeadDetailPage from './pages/LeadDetailPage';
import ACardPage from './pages/ACardPage';
import PaymentCalcPage from './pages/PaymentCalcPage';
import BookingPage from './pages/BookingPage';
import SalesDashboard from './pages/SalesDashboard';
import ManagerDashboard from './pages/ManagerDashboard';
import PipelinePage from './pages/PipelinePage';
import TargetsPage from './pages/TargetsPage';
import ReportsPage from './pages/ReportsPage';
import NotificationsPage from './pages/NotificationsPage';
import ProfilePage from './pages/ProfilePage';
import { useAuthStore } from './stores/authStore';

function SmartRedirect() {
  const isLoggedIn = useAuthStore((s) => s.isLoggedIn);
  const role = useAuthStore((s) => s.role);
  const hasHydrated = useAuthStore((s) => s._hasHydrated);

  if (!hasHydrated) {
    return null; // Wait for hydration
  }

  if (isLoggedIn) {
    const dest = role === 'mgr' ? '/mgr-dash' : '/sales-dash';
    return <Navigate to={dest} replace />;
  }

  return <Navigate to="/login" replace />;
}

export default function App() {
  return (
    <HashRouter>
      <Toaster position="top-center" toastOptions={{ style: { fontFamily: "'Sarabun', sans-serif", fontSize: '13px' } }} />
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/" element={<SmartRedirect />} />

        <Route element={<AppShell />}>
          {/* Sales + Manager shared */}
          <Route element={<ProtectedRoute allowedRoles={['sales', 'mgr']} />}>
            <Route path="/sales-dash" element={<SalesDashboard />} />
            <Route path="/calc" element={<PaymentCalcPage />} />
            <Route path="/catalog" element={<CatalogPage />} />
            <Route path="/car/:id" element={<CarDetailPage />} />
            <Route path="/leads" element={<LeadListPage />} />
            <Route path="/lead/:id" element={<LeadDetailPage />} />
            <Route path="/acard" element={<ACardPage />} />
            <Route path="/notifications" element={<NotificationsPage />} />
            <Route path="/reports" element={<ReportsPage />} />
            <Route path="/profile" element={<ProfilePage />} />
          </Route>

          {/* Sales only */}
          <Route element={<ProtectedRoute allowedRoles={['sales']} />}>
            <Route path="/booking" element={<BookingPage />} />
          </Route>

          {/* Manager only */}
          <Route element={<ProtectedRoute allowedRoles={['mgr']} />}>
            <Route path="/mgr-dash" element={<ManagerDashboard />} />
            <Route path="/pipeline" element={<PipelinePage />} />
            <Route path="/targets" element={<TargetsPage />} />
          </Route>
        </Route>

        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    </HashRouter>
  );
}
