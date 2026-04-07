import { useState, useRef, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import NotificationPanel from './NotificationPanel';

export default function Navbar() {
  const { user, logout, isAdmin, isTechnician } = useAuth();
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef(null);

  useEffect(() => {
    const handler = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const initials = user?.name
    ? user.name.split(' ').map((w) => w[0]).join('').toUpperCase().slice(0, 2)
    : '?';

  return (
    <nav className="navbar">
      <div className="navbar__inner">
        {/* Brand */}
        <Link to="/dashboard" className="navbar__brand">
          SmartUni
        </Link>

        {/* Nav links */}
        <div className="navbar__links">
          <Link to="/resources"     className="navbar__link">Resources</Link>
          <Link to="/bookings"      className="navbar__link">Bookings</Link>
          <Link to="/tickets"       className="navbar__link">Tickets</Link>
          {isAdmin && (
            <Link to="/admin" className="navbar__link navbar__link--admin">Admin</Link>
            )}
          {isTechnician && !isAdmin && (
            <Link to="/tickets" className="navbar__link navbar__link--tech">My tickets</Link>
          )}
        </div>

        {/* Right side */}
        <div className="navbar__right">
          <NotificationPanel />

          {/* User avatar / dropdown */}
          <div className="user-menu" ref={menuRef}>
            <button
              className="user-menu__trigger"
              onClick={() => setMenuOpen((o) => !o)}
              aria-label="User menu"
            >
              {user?.profilePictureUrl ? (
                <img
                  src={user.profilePictureUrl}
                  alt={user.name}
                  className="user-menu__avatar"
                />
              ) : (
                <div className="user-menu__avatar user-menu__avatar--initials">
                  {initials}
                </div>
              )}
            </button>

            {menuOpen && (
              <div className="user-menu__dropdown">
                <div className="user-menu__info">
                  <span className="user-menu__name">{user?.name}</span>
                  <span className="user-menu__email">{user?.email}</span>
                </div>
                <hr className="user-menu__divider" />
                <Link
                  to="/profile"
                  className="user-menu__item"
                  onClick={() => setMenuOpen(false)}
                >
                  My profile
                </Link>
                <Link
                  to="/notifications"
                  className="user-menu__item"
                  onClick={() => setMenuOpen(false)}
                >
                  Notifications
                </Link>
                <hr className="user-menu__divider" />
                <button className="user-menu__item user-menu__item--danger" onClick={handleLogout}>
                  Sign out
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}