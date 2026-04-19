import { Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { PrivateRoute, AdminRoute } from './components/PrivateRoute';
import AppLayout from './components/AppLayout';
import AdminLayout from './components/AdminLayout';
import AdminPage from './pages/admin/AdminPage';
import { NotificationProvider } from './context/NotificationContext';
import './App.css';

// Auth pages
import LoginPage          from './pages/auth/LoginPage';
import SignupPage         from './pages/auth/SignupPage';
import OAuth2CallbackPage from './pages/auth/OAuth2CallbackPage';
import ProfilePage        from './pages/auth/ProfilePage';
import ForgotPasswordPage from './pages/auth/ForgotPasswordPage';
import ResetPasswordPage  from './pages/auth/ResetPasswordPage';

// App pages
import DashboardPage      from './pages/DashboardPage';
import NotificationsPage  from './pages/notifications/NotificationsPage';

// Resource pages
import ResourceDetail from './pages/resources/ResourceDetail';
import ResourceForm from './pages/resources/ResourceForm';
import ResourceList from './pages/resources/ResourceList';

// Booking pages
import CreateBookingPage from './pages/bookings/CreateBooking';
import MyBookingsPage from './pages/bookings/MyBookingsPage';
import BookingDetailPage from './pages/bookings/BookingDetails';

//Admin pages
import AdminBookingsPage from './pages/admin/AdminBookingsPage';

// Placeholder pages (implemented by other team members)
// import BookingsPage    from './pages/bookings/BookingsPage';
// import TicketsPage     from './pages/tickets/TicketsPage';

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
    <AppLayout />
  );
}

export default function App() {
  return (
    <NotificationProvider>
      <AuthProvider>
        <Routes>
          {/* Public routes */}
          <Route path="/login"           element={<LoginPage />} />
          <Route path="/signup"          element={<SignupPage />} />
          <Route path="/forgot-password" element={<ForgotPasswordPage />} />
          <Route path="/reset-password"  element={<ResetPasswordPage />} />
          <Route path="/oauth2/callback" element={<OAuth2CallbackPage />} />

          {/* Authenticated routes – wrapped in layout with Navbar */}
          <Route element={<PrivateRoute />}>
            <Route element={<AppLayout />}>
              <Route path="/dashboard"     element={<DashboardPage />} />
              <Route path="/notifications" element={<NotificationsPage />} />
              <Route path="/profile"       element={<ProfilePage />} />

              {/* Resource routes */}
              <Route path="/resources"       element={<ResourceList />} />
              <Route path="/resources/new"   element={<ResourceForm />} />
              <Route path="/resources/:id"   element={<ResourceDetail />} />
              <Route path="/resources/:id/edit" element={<ResourceForm />} />

              {/* Other modules (replace placeholders with real pages) */}
              <Route path="/bookings"   element={<MyBookingsPage />} />
              <Route path="/bookings/new" element={<CreateBookingPage />} />
              <Route path="/bookings/:id" element={<BookingDetailPage />} />

              <Route path="/tickets"    element={<PlaceholderPage name="Tickets" />} />
            </Route>

            {/* Admin-only routes */}
            <Route element={<AdminRoute />}>
              <Route element={<AdminLayout />}>
                <Route path="/admin" element={<AdminPage />} />
                <Route path="/admin/bookings" element={<AdminBookingsPage />} />
              </Route>
            </Route>
          </Route>

          {/* Default redirect */}
          <Route path="/"   element={<Navigate to="/dashboard" replace />} />
          <Route path="*"   element={<Navigate to="/dashboard" replace />} />
        </Routes>
      </AuthProvider>
    </NotificationProvider>
  );
}