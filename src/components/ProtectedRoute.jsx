import React, { useState, useEffect } from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuthStore } from '../stores/authStore';

export default function ProtectedRoute({ allowedRoles }) {
  const isLoggedIn = useAuthStore((s) => s.isLoggedIn);
  const role = useAuthStore((s) => s.role);

  // Brief delay to allow Zustand persist to rehydrate from localStorage
  const [ready, setReady] = useState(false);
  useEffect(() => {
    const t = setTimeout(() => setReady(true), 50);
    return () => clearTimeout(t);
  }, []);

  if (!ready && !isLoggedIn) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-bg">
        <div className="w-8 h-8 border-3 border-primary border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!isLoggedIn) {
    return <Navigate to="/login" replace />;
  }

  if (allowedRoles && !allowedRoles.includes(role)) {
    const defaultPath = role === 'mgr' ? '/mgr-dash' : '/sales-dash';
    return <Navigate to={defaultPath} replace />;
  }

  return <Outlet />;
}
