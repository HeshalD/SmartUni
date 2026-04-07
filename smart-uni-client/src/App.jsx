import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { PrivateRoute, AdminRoute } from './components/PrivateRoute';
import AppLayout from './components/AppLayout';
import AdminPage from './pages/admin/AdminPage';
import { NotificationProvider } from './context/NotificationContext';
import './App.css';

// Auth pages
import LoginPage          from './pages/auth/LoginPage';
import SignupPage         from './pages/auth/SignupPage';
import OAuth2CallbackPage from './pages/auth/OAuth2CallbackPage';
import ProfilePage        from './pages/auth/ProfilePage';

// App pages
import DashboardPage      from './pages/DashboardPage';
import NotificationsPage  from './pages/notifications/NotificationsPage';

// Placeholder pages (implemented by other team members)
// import ResourcesPage   from './pages/resources/ResourcesPage';
// import BookingsPage    from './pages/bookings/BookingsPage';
// import TicketsPage     from './pages/tickets/TicketsPage';
// import AdminPage       from './pages/admin/AdminPage';

function PlaceholderPage({ name }) {
  return (
    <div className="page-container">
      <h1 className="page-title">{name}</h1>
      <p style={{ color: '#6b7280' }}>This section is implemented by another team member.</p>
    </div>
  );
}

function ProtectedAppLayout() {
  return (
    <NotificationProvider>
      <AppLayout />
    </NotificationProvider>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          {/* Public routes */}
          <Route path="/login"           element={<LoginPage />} />
          <Route path="/signup"          element={<SignupPage />} />
          <Route path="/oauth2/callback" element={<OAuth2CallbackPage />} />

          {/* Authenticated routes – wrapped in layout with Navbar */}
          <Route element={<PrivateRoute />}>
            <Route element={<ProtectedAppLayout />}>
              <Route path="/dashboard"     element={<DashboardPage />} />
              <Route path="/notifications" element={<NotificationsPage />} />
              <Route path="/profile"       element={<ProfilePage />} />

              {/* Other modules (replace placeholders with real pages) */}
              <Route path="/resources"  element={<PlaceholderPage name="Resources" />} />
              <Route path="/bookings"   element={<PlaceholderPage name="Bookings" />} />
              <Route path="/tickets"    element={<PlaceholderPage name="Tickets" />} />

              {/* Admin-only routes */}
              <Route element={<AdminRoute />}>
                <Route path="/admin" element={<AdminPage />} />
              </Route>
            </Route>
          </Route>

          {/* Default redirect */}
          <Route path="/"   element={<Navigate to="/dashboard" replace />} />
          <Route path="*"   element={<Navigate to="/dashboard" replace />} />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
}