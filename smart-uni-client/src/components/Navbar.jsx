import { useState, useRef, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import NotificationPanel from './NotificationPanel';
import { FaUser, FaSignOutAlt, FaChevronDown } from 'react-icons/fa';

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
    <header style={{ height: '72px', background: '#ffffff', borderBottom: '1px solid #f3f4f6', display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 32px', position: 'sticky', top: 0, zIndex: 90, boxShadow: '0 1px 3px rgba(0,0,0,0.04)' }}>
      <div>
        <h1 style={{ fontSize: '22px', fontWeight: 700, color: '#111827', margin: 0, letterSpacing: '-0.02em' }}>{pageTitle}</h1>
        <p style={{ fontSize: '13px', color: '#9ca3af', margin: '2px 0 0 0' }}>Welcome back, {user?.name}</p>
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
        <NotificationPanel />

        <div ref={menuRef} style={{ position: 'relative' }}>
          <button
            onClick={() => setMenuOpen((o) => !o)}
            aria-label="User menu"
            style={{ display: 'flex', alignItems: 'center', gap: '10px', background: 'none', border: '1px solid #f3f4f6', borderRadius: '12px', padding: '6px 12px 6px 6px', cursor: 'pointer', transition: 'all 0.15s ease' }}
            onMouseEnter={(e) => { e.currentTarget.style.borderColor = '#e5e7eb'; e.currentTarget.style.background = '#f9fafb'; }}
            onMouseLeave={(e) => { e.currentTarget.style.borderColor = '#f3f4f6'; e.currentTarget.style.background = 'transparent'; }}
          >
            {user?.profilePictureUrl ? (
              <img
                src={user.profilePictureUrl}
                alt={user.name}
                style={{ width: '34px', height: '34px', borderRadius: '10px', objectFit: 'cover' }}
              />
            ) : (
              <div style={{ width: '34px', height: '34px', borderRadius: '10px', background: 'linear-gradient(135deg, #6366f1, #8b5cf6)', color: '#fff', fontSize: '12px', fontWeight: 700, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                {initials}
              </div>
            )}
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start', lineHeight: 1.2 }}>
              <span style={{ fontSize: '13px', fontWeight: 600, color: '#374151' }}>{user?.name?.split(' ')[0]}</span>
              <span style={{ fontSize: '11px', color: '#9ca3af' }}>{user?.roles?.[0]}</span>
            </div>
            <FaChevronDown size={12} color="#9ca3af" style={{ transform: menuOpen ? 'rotate(180deg)' : 'none', transition: 'transform 0.2s ease' }} />
          </button>

          {menuOpen && (
            <div style={{ position: 'absolute', top: 'calc(100% + 8px)', right: 0, width: '240px', background: '#ffffff', border: '1px solid #f3f4f6', borderRadius: '14px', boxShadow: '0 20px 48px -8px rgba(0,0,0,0.12)', zIndex: 200, overflow: 'hidden', padding: '8px' }}>
              <div style={{ padding: '12px 14px', display: 'flex', flexDirection: 'column', gap: '2px' }}>
                <span style={{ fontWeight: 600, fontSize: '14px', color: '#111827' }}>{user?.name}</span>
                <span style={{ fontSize: '12px', color: '#9ca3af' }}>{user?.email}</span>
              </div>
              <div style={{ height: '1px', background: '#f3f4f6', margin: '4px 0' }} />
              <Link
                to="/profile"
                onClick={() => setMenuOpen(false)}
                style={{ display: 'flex', alignItems: 'center', gap: '10px', width: '100%', padding: '10px 14px', borderRadius: '10px', textAlign: 'left', background: 'none', border: 'none', fontSize: '13px', color: '#374151', textDecoration: 'none', cursor: 'pointer', transition: 'background 0.15s' }}
                onMouseEnter={(e) => { e.currentTarget.style.background = '#f9fafb'; }}
                onMouseLeave={(e) => { e.currentTarget.style.background = 'transparent'; }}
              >
                <FaUser size={13} color="#9ca3af" />
                My profile
              </Link>
              <Link
                to="/notifications"
                onClick={() => setMenuOpen(false)}
                style={{ display: 'flex', alignItems: 'center', gap: '10px', width: '100%', padding: '10px 14px', borderRadius: '10px', textAlign: 'left', background: 'none', border: 'none', fontSize: '13px', color: '#374151', textDecoration: 'none', cursor: 'pointer', transition: 'background 0.15s' }}
                onMouseEnter={(e) => { e.currentTarget.style.background = '#f9fafb'; }}
                onMouseLeave={(e) => { e.currentTarget.style.background = 'transparent'; }}
              >
                <div style={{ position: 'relative' }}>
                  <div style={{ width: '16px', height: '16px', borderRadius: '50%', background: '#f59e0b', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <span style={{ color: '#fff', fontSize: '9px', fontWeight: 700 }}>{(user?.unreadCount || 0) > 0 ? '•' : ''}</span>
                  </div>
                </div>
                Notifications
              </Link>
              <div style={{ height: '1px', background: '#f3f4f6', margin: '4px 0' }} />
              <button
                onClick={handleLogout}
                style={{ display: 'flex', alignItems: 'center', gap: '10px', width: '100%', padding: '10px 14px', borderRadius: '10px', textAlign: 'left', background: 'none', border: 'none', fontSize: '13px', color: '#ef4444', cursor: 'pointer', transition: 'background 0.15s' }}
                onMouseEnter={(e) => { e.currentTarget.style.background = '#fef2f2'; }}
                onMouseLeave={(e) => { e.currentTarget.style.background = 'transparent'; }}
              >
                <FaSignOutAlt size={13} color="#ef4444" />
                Sign out
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}