import { useState, useRef, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import NotificationPanel from './NotificationPanel';

const PAGE_TITLES = {
  '/dashboard': 'Dashboard',
  '/resources': 'Resources',
  '/bookings': 'Bookings',
  '/tickets': 'Tickets',
  '/notifications': 'Notifications',
  '/profile': 'Profile',
  '/admin': 'Admin Panel',
};

export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
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

  const pageTitle = PAGE_TITLES[location.pathname] || 'SmartUni';

  return (
    <header className="topbar">
      <div>
        <h1 className="topbar__title">{pageTitle}</h1>
        <p className="topbar__subtitle">Welcome back, {user?.name}</p>
      </div>

      <div className="topbar__right">
        <NotificationPanel />

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
              <button
                className="user-menu__item user-menu__item--danger"
                onClick={handleLogout}
              >
                Sign out
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}