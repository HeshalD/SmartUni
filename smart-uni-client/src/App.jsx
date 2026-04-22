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
import AdminTicketsPage from './pages/admin/AdminTicketsPage';
import AdminResourcesPage from './pages/admin/AdminResourcesPage';
import AdminNotificationsPage from './pages/admin/AdminNotificationsPage';
import AdminUsersPage from './pages/admin/AdminUsersPage';

// Tickets pages
import TicketsPage       from './pages/tickets/TicketsPage';
import CreateTicketPage  from './pages/tickets/CreateTicketPage';
import TicketDetailPage  from './pages/tickets/TicketDetailPage';


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


              {/* Other modules (replace placeholders with real pages) */}
              <Route path="/bookings"   element={<MyBookingsPage />} />
              <Route path="/bookings/new" element={<CreateBookingPage />} />
              <Route path="/bookings/:id" element={<BookingDetailPage />} />
            
            {/* Resource routes */}
            <Route path="/resources"       element={<ResourceList />} />
            <Route path="/resources/:id"   element={<ResourceDetail />} />
            <Route element={<AdminRoute />}>
              <Route path="/resources/new"   element={<ResourceForm />} />
              <Route path="/resources/:id/edit" element={<ResourceForm />} />
            </Route>
            
            <Route path="/tickets"          element={<TicketsPage />} />
            <Route path="/tickets/new"      element={<CreateTicketPage />} />
            <Route path="/tickets/:id"      element={<TicketDetailPage />} />
            </Route>

            {/* Admin-only routes */}
            <Route element={<AdminRoute />}>
              <Route element={<AdminLayout />}>
                <Route path="/admin" element={<AdminPage />} />
                <Route path="/admin/bookings" element={<AdminBookingsPage />} />
                <Route path="/admin/tickets" element={<AdminTicketsPage />} />
                <Route path="/admin/resources" element={<AdminResourcesPage />} />
                <Route path="/admin/notifications" element={<AdminNotificationsPage />} />
                <Route path="/admin/users" element={<AdminUsersPage />} />
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