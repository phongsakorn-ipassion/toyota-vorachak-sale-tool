import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuthStore } from '../stores/authStore';

export default function ProtectedRoute({ allowedRoles }) {
  const isLoggedIn = useAuthStore((s) => s.isLoggedIn);
  const role = useAuthStore((s) => s.role);

  if (!isLoggedIn) {
    return <Navigate to="/login" replace />;
  }

  if (allowedRoles && !allowedRoles.includes(role)) {
    const defaultPath = role === 'mgr' ? '/mgr-dash' : '/sales-dash';
    return <Navigate to={defaultPath} replace />;
  }

  return <Outlet />;
}
