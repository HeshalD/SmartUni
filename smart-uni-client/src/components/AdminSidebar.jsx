import { NavLink } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { 
  FaHome, 
  FaBuilding, 
  FaCalendarAlt, 
  FaTools, 
  FaBell, 
  FaUsers, 
  FaUser, 
  FaSignOutAlt 
} from 'react-icons/fa';

export default function AdminSidebar() {
  const { logout } = useAuth();

  const links = [
    { to: '/admin', label: 'Dashboard', icon: <FaHome size={18} /> },
    { to: '/admin/resources', label: 'Resources', icon: <FaBuilding size={18} /> },
    { to: '/admin/bookings', label: 'Bookings', icon: <FaCalendarAlt size={18} /> },
    { to: '/admin/tickets', label: 'Tickets', icon: <FaTools size={18} /> },
    { to: '/admin/notifications', label: 'Notifications', icon: <FaBell size={18} /> },
    { to: '/admin/users', label: 'Users', icon: <FaUsers size={18} /> },
  ];

  const handleLogout = () => {
    logout();
  };

  return (
    <aside style={{
      width: '280px',
      height: '100vh',
      background: 'linear-gradient(180deg, #1e293b 0%, #334155 100%)',
      borderRight: '1px solid #475569',
      display: 'flex',
      flexDirection: 'column',
      position: 'fixed',
      left: 0,
      top: 0,
      zIndex: 1000,
    }}>
      {/* Brand */}
      <div style={{
        padding: '24px 20px',
        borderBottom: '1px solid #475569',
        background: 'rgba(15, 23, 42, 0.8)',
        backdropFilter: 'blur(8px)',
      }}>
        <h1 style={{
          fontSize: '20px',
          fontWeight: 800,
          color: '#fff',
          margin: 0,
          display: 'flex',
          alignItems: 'center',
          gap: '10px',
        }}>
          <div style={{
            width: '36px',
            height: '36px',
            borderRadius: '8px',
            background: 'linear-gradient(135deg, #4f46e5 0%, #7c3aed 100%)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '18px',
            color: '#fff',
            fontWeight: 700,
          }}>
            SU
          </div>
          SmartUni Admin
        </h1>
      </div>

      {/* Navigation */}
      <nav style={{
        flex: 1,
        padding: '16px 12px',
        overflowY: 'auto',
      }}>
        {links.map((link) => (
          <NavLink
            key={link.to}
            to={link.to}
            style={({ isActive }) => ({
              display: 'flex',
              alignItems: 'center',
              gap: '12px',
              padding: '12px 16px',
              borderRadius: '10px',
              color: isActive ? '#fff' : '#cbd5e1',
              background: isActive ? '#4f46e5' : 'transparent',
              textDecoration: 'none',
              fontSize: '14px',
              fontWeight: 500,
              transition: 'all 0.15s ease',
              marginBottom: '4px',
              border: isActive ? '1px solid #6366f1' : '1px solid transparent',
            })}
            onMouseEnter={(e) => {
              if (!e.currentTarget.style.background || e.currentTarget.style.background === 'transparent') {
                e.currentTarget.style.background = 'rgba(79, 70, 229, 0.1)';
                e.currentTarget.style.color = '#fff';
              }
            }}
            onMouseLeave={(e) => {
              if (!e.currentTarget.style.background.includes('4f46e5')) {
                e.currentTarget.style.background = 'transparent';
                e.currentTarget.style.color = '#cbd5e1';
              }
            }}
          >
            <span style={{ display: 'flex', alignItems: 'center', minWidth: '24px', justifyContent: 'center' }}>
              {link.icon}
            </span>
            <span>{link.label}</span>
          </NavLink>
        ))}
        
        {/* Logout Button */}
        <button
          onClick={handleLogout}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '12px',
            padding: '12px 16px',
            borderRadius: '10px',
            color: '#f87171',
            background: 'transparent',
            border: '1px solid transparent',
            fontSize: '14px',
            fontWeight: 500,
            cursor: 'pointer',
            transition: 'all 0.15s ease',
            marginTop: '16px',
            width: '100%',
            textAlign: 'left',
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.background = 'rgba(239, 68, 68, 0.1)';
            e.currentTarget.style.borderColor = '#ef4444';
            e.currentTarget.style.color = '#fff';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.background = 'transparent';
            e.currentTarget.style.borderColor = 'transparent';
            e.currentTarget.style.color = '#f87171';
          }}
        >
          <span style={{ display: 'flex', alignItems: 'center', minWidth: '24px', justifyContent: 'center' }}>
            <FaSignOutAlt size={16} />
          </span>
          <span>Logout</span>
        </button>
      </nav>
    </aside>
  );
}
