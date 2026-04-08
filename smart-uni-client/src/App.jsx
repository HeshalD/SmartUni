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
import ForgotPasswordPage from './pages/auth/ForgotPasswordPage';
import ResetPasswordPage from './pages/auth/ResetPasswordPage';

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
import { Link, Navigate, Route, Routes } from 'react-router-dom'
import ResourceDetail from './pages/resources/ResourceDetail'
import ResourceForm from './pages/resources/ResourceForm'
import ResourceList from './pages/resources/ResourceList'
import './App.css'

function App() {
  return (
    <div className="app-shell">
      <header className="top-nav">
        <Link to="/resources" className="brand">
          SmartUni Facilities
        </Link>
        <nav>
          <Link to="/resources">Resources</Link>
          <Link to="/resources/new">Add Resource</Link>
        </nav>
      </header>

      <main>
        <Routes>
          <Route path="/" element={<Navigate to="/resources" replace />} />
          <Route path="/resources" element={<ResourceList />} />
          <Route path="/resources/new" element={<ResourceForm />} />
          <Route path="/resources/:id" element={<ResourceDetail />} />
          <Route path="/resources/:id/edit" element={<ResourceForm />} />
        </Routes>
      </main>
    </div>
  )
}

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          {/* Public routes */}
          <Route path="/login"           element={<LoginPage />} />
          <Route path="/signup"          element={<SignupPage />} />
          <Route path="/forgot-password" element={<ForgotPasswordPage />} />
          <Route path="/reset-password" element={<ResetPasswordPage />} />
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