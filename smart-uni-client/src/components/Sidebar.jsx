import { NavLink } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import {
  FaHome,
  FaBuilding,
  FaCalendarAlt,
  FaTools,
  FaBell,
  FaUser,
  FaCog,
  FaShieldAlt,
} from 'react-icons/fa';

export default function Sidebar() {
  const { isAdmin, isTechnician } = useAuth();

  const links = [
    { to: '/dashboard', label: 'Dashboard', icon: <FaHome size={18} /> },
    { to: '/resources', label: 'Resources', icon: <FaBuilding size={18} /> },
    { to: '/bookings', label: 'Bookings', icon: <FaCalendarAlt size={18} /> },
    { to: '/tickets', label: isTechnician && !isAdmin ? 'My Tickets' : 'Tickets', icon: <FaTools size={18} /> },
    { to: '/notifications', label: 'Notifications', icon: <FaBell size={18} /> },
    { to: '/profile', label: 'Profile', icon: <FaUser size={18} /> },
    { to: '/settings', label: 'Settings', icon: <FaCog size={18} /> },
  ];

  if (isAdmin) {
    links.splice(4, 0, {
      to: '/admin',
      label: 'Admin Panel',
      icon: <FaShieldAlt size={18} />,
    });
  }

  const sidebarBg = '#0f172a';
  const sidebarText = '#94a3b8';
  const sidebarHover = 'rgba(255,255,255,0.06)';
  const activeBg = 'rgba(99,102,241,0.15)';
  const activeText = '#e0e7ff';
  const activeBorder = '#6366f1';

  return (
    <aside
      style={{
        width: '260px',
        minHeight: '100vh',
        background: sidebarBg,
        color: sidebarText,
        display: 'flex',
        flexDirection: 'column',
        padding: '28px 16px',
        position: 'sticky',
        top: 0,
      }}
    >
      {/* Brand */}
      <div
        style={{
          fontSize: '22px',
          fontWeight: 800,
          color: '#fff',
          padding: '0 12px 20px',
          borderBottom: '1px solid rgba(255,255,255,0.06)',
          marginBottom: '24px',
          letterSpacing: '-0.02em',
        }}
      >
        SmartUni
      </div>

      {/* Nav */}
      <nav style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
        {links.map((link) => (
          <NavLink
            key={link.to}
            to={link.to}
            style={({ isActive }) => ({
              display: 'flex',
              alignItems: 'center',
              gap: '14px',
              padding: '12px 14px',
              borderRadius: '12px',
              color: isActive ? activeText : sidebarText,
              background: isActive ? activeBg : 'transparent',
              borderLeft: isActive ? `3px solid ${activeBorder}` : '3px solid transparent',
              textDecoration: 'none',
              fontSize: '14px',
              fontWeight: 500,
              transition: 'all 0.15s ease',
              marginLeft: isActive ? '-3px' : '0',
            })}
            onMouseEnter={(e) => {
              if (!e.currentTarget.classList.contains('active')) {
                e.currentTarget.style.background = sidebarHover;
                e.currentTarget.style.color = '#fff';
              }
            }}
            onMouseLeave={(e) => {
              const isActive = e.currentTarget.getAttribute('aria-current') === 'page';
              if (!isActive) {
                e.currentTarget.style.background = 'transparent';
                e.currentTarget.style.color = sidebarText;
              }
            }}
          >
            <span style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: '22px' }}>
              {link.icon}
            </span>
            <span>{link.label}</span>
          </NavLink>
        ))}
      </nav>

      {/* Bottom spacer / subtle footer */}
      <div style={{ marginTop: 'auto', padding: '16px 14px 0' }}>
        <div
          style={{
            fontSize: '11px',
            color: 'rgba(148,163,184,0.5)',
            textAlign: 'center',
            paddingTop: '16px',
            borderTop: '1px solid rgba(255,255,255,0.04)',
          }}
        >
          SmartUni v1.0
        </div>
      </div>
    </aside>
  );
}