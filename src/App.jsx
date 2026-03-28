import React from 'react';
import { HashRouter, Routes, Route, Navigate } from 'react-router-dom';
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

const ProfilePage = () => (
  <div className="p-4 screen-enter">
    <h1 className="text-lg font-bold text-t1">โปรไฟล์</h1>
    <p className="text-t2 mt-2">Coming soon...</p>
  </div>
);

export default function App() {
  return (
    <HashRouter>
      <Routes>
        {/* Public routes */}
        <Route path="/login" element={<LoginPage />} />
        <Route path="/" element={<Navigate to="/login" replace />} />

        {/* Protected routes inside AppShell */}
        <Route element={<AppShell />}>
          {/* Sales + Manager */}
          <Route element={<ProtectedRoute allowedRoles={['sales', 'mgr']} />}>
            <Route path="/sales-dash" element={<SalesDashboard />} />
            <Route path="/catalog" element={<CatalogPage />} />
            <Route path="/car/:id" element={<CarDetailPage />} />
            <Route path="/calc" element={<PaymentCalcPage />} />
            <Route path="/leads" element={<LeadListPage />} />
            <Route path="/lead/:id" element={<LeadDetailPage />} />
            <Route path="/reports" element={<ReportsPage />} />
            <Route path="/notifications" element={<NotificationsPage />} />
            <Route path="/profile" element={<ProfilePage />} />
          </Route>

          {/* Sales only */}
          <Route element={<ProtectedRoute allowedRoles={['sales']} />}>
            <Route path="/acard" element={<ACardPage />} />
            <Route path="/booking" element={<BookingPage />} />
          </Route>

          {/* Manager only */}
          <Route element={<ProtectedRoute allowedRoles={['mgr']} />}>
            <Route path="/mgr-dash" element={<ManagerDashboard />} />
            <Route path="/pipeline" element={<PipelinePage />} />
            <Route path="/targets" element={<TargetsPage />} />
          </Route>
        </Route>

        {/* Catch-all */}
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    </HashRouter>
  );
}
