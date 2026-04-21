import { NavLink } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function AdminSidebar() {
  const { logout } = useAuth();

  const links = [
    { to: '/admin', label: 'Dashboard', icon: '🏠' },
    { to: '/admin/resources', label: 'Resources', icon: '🏛️' },
    { to: '/admin/bookings', label: 'Bookings', icon: '📅' },
    { to: '/admin/tickets', label: 'Tickets', icon: '🔧' },
    { to: '/admin/notifications', label: 'Notifications', icon: '🔔' },
    { to: '/admin/users', label: 'Users', icon: '👥' },
    { to: '/admin/profile', label: 'Profile', icon: '👤' },
  ];

  const handleLogout = () => {
    logout();
  };

  return (
    <aside className="sidebar">
      <div className="sidebar__brand">SmartUni Admin</div>

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
        
        <button 
          onClick={handleLogout}
          className="sidebar__link sidebar__link--logout"
        >
          <span className="sidebar__icon">🚪</span>
          <span>Logout</span>
        </button>
      </nav>
    </aside>
  );
}
