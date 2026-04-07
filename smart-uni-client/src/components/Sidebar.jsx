import { NavLink } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Sidebar() {
  const { isAdmin, isTechnician } = useAuth();

  const links = [
    { to: '/dashboard', label: 'Dashboard', icon: '🏠' },
    { to: '/resources', label: 'Resources', icon: '🏛️' },
    { to: '/bookings', label: 'Bookings', icon: '📅' },
    { to: '/tickets', label: isTechnician && !isAdmin ? 'My Tickets' : 'Tickets', icon: '🔧' },
    { to: '/notifications', label: 'Notifications', icon: '🔔' },
    { to: '/profile', label: 'Profile', icon: '👤' },
    { to: '/settings', label: 'Settings', icon: '⚙️' },
  ];

  if (isAdmin) {
    links.splice(4, 0, { to: '/admin', label: 'Admin Panel', icon: '⚙️' });
  }

  return (
    <aside className="sidebar">
      <div className="sidebar__brand">SmartUni</div>

      <nav className="sidebar__nav">
        {links.map((link) => (
          <NavLink
            key={link.to}
            to={link.to}
            className={({ isActive }) =>
              `sidebar__link ${isActive ? 'sidebar__link--active' : ''}`
            }
          >
            <span className="sidebar__icon">{link.icon}</span>
            <span>{link.label}</span>
          </NavLink>
        ))}
      </nav>
    </aside>
  );
}