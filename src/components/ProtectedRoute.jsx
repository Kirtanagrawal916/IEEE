import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function ProtectedRoute({ user, allowedRoles, redirectTo = '/dashboard', children }) {
  const { loading } = useAuth();
  const location = useLocation();
  const token = localStorage.getItem('herearn_jwt_token');
  const savedUserStr = localStorage.getItem('herearn_user');
  const isAdminAuth = sessionStorage.getItem('herearn_admin_authenticated') === 'true' || localStorage.getItem('herearn_admin_authenticated') === 'true';

  let savedUser = null;
  try {
    savedUser = savedUserStr ? JSON.parse(savedUserStr) : null;
  } catch {
    savedUser = null;
  }

  const effectiveUser = user || savedUser;

  // If session is currently verifying in background, wait for resolution before redirecting
  if (loading && (token || savedUser)) {
    return (
      <div className="min-h-[50vh] flex flex-col items-center justify-center gap-3">
        <div className="w-8 h-8 border-3 border-purple-600 border-t-transparent rounded-full animate-spin" />
        <p className="text-xs font-semibold text-slate-500 dark:text-slate-400">Verifying access session...</p>
      </div>
    );
  }

  if (!effectiveUser && !token && !isAdminAuth) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // Check role restrictions if specified
  if (allowedRoles && allowedRoles.length > 0 && effectiveUser) {
    const userRole = String(effectiveUser.role || 'LEARNER').toUpperCase();
    const hasRole = allowedRoles.some(r => r.toUpperCase() === userRole) || isAdminAuth || userRole === 'ADMIN';
    if (!hasRole) {
      return <Navigate to={redirectTo} replace />;
    }
  }

  return children;
}

