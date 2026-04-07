import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

/** Requires authenticated user. Redirects to /login otherwise. */
export function PrivateRoute() {
  const { isAuthenticated, loading } = useAuth();
  const location = useLocation();

  if (loading) return <div className="loading-spinner">Loading…</div>;

  return isAuthenticated
    ? <Outlet />
    : <Navigate to="/login" state={{ from: location }} replace />;
}

/** Requires ADMIN role. Redirects to /dashboard for non-admins. */
export function AdminRoute() {
  const { isAuthenticated, isAdmin, loading } = useAuth();
  const location = useLocation();

  if (loading) return <div className="loading-spinner">Loading…</div>;
  if (!isAuthenticated) return <Navigate to="/login" state={{ from: location }} replace />;
  if (!isAdmin) return <Navigate to="/dashboard" replace />;

  return <Outlet />;
}

/** Requires TECHNICIAN or ADMIN role. */
export function TechnicianRoute() {
  const { isAuthenticated, hasRole, loading } = useAuth();
  const location = useLocation();

  if (loading) return <div className="loading-spinner">Loading…</div>;
  if (!isAuthenticated) return <Navigate to="/login" state={{ from: location }} replace />;
  if (!hasRole('TECHNICIAN') && !hasRole('ADMIN'))
    return <Navigate to="/dashboard" replace />;

  return <Outlet />;
}