import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useNotifications } from '../hooks/useNotifications';
import { FaBuilding, FaCalendarAlt, FaTools, FaBell, FaCog, FaUser, FaEnvelope } from 'react-icons/fa';

export default function DashboardPage() {
  const { user, isAdmin, isTechnician } = useAuth();
  const { unreadCount } = useNotifications();

  const cards = [
    {
      title: 'Resources',
      description: 'Browse and search campus facilities and equipment.',
      icon: <FaBuilding size={22} />,
      link: '/resources',
      accent: '#6366f1',
      bg: '#eef2ff',
    },
    {
      title: 'Bookings',
      description: 'Request and manage your resource bookings.',
      icon: <FaCalendarAlt size={22} />,
      link: '/bookings',
      accent: '#0ea5e9',
      bg: '#f0f9ff',
    },
    {
      title: isTechnician && !isAdmin ? 'My Tickets' : 'Tickets',
      description: 'Report and track maintenance incidents.',
      icon: <FaTools size={22} />,
      link: '/tickets',
      accent: '#f59e0b',
      bg: '#fffbeb',
    },
    {
      title: 'Notifications',
      description: `You have ${unreadCount} unread notification${unreadCount !== 1 ? 's' : ''}.`,
      icon: <FaBell size={22} />,
      link: '/notifications',
      accent: '#10b981',
      bg: '#ecfdf5',
      badge: unreadCount > 0 ? unreadCount : null,
    },
  ];

  if (isAdmin) {
    cards.push({
      title: 'Admin Panel',
      description: 'Manage users, technicians, and access.',
      icon: <FaCog size={22} />,
      link: '/admin',
      accent: '#ef4444',
      bg: '#fef2f2',
    });
  }

  return (
    <div style={{ maxWidth: '1280px', margin: '0 auto', padding: '32px 24px' }}>
      {/* Hero */}
      <section style={{ position: 'relative', overflow: 'hidden', borderRadius: '20px', background: 'linear-gradient(135deg, #4f46e5 0%, #7c3aed 100%)', color: '#fff', boxShadow: '0 20px 40px -10px rgba(79, 70, 229, 0.3)', marginBottom: '48px' }}>
        <div style={{ position: 'absolute', top: '-40px', right: '-40px', width: '280px', height: '280px', background: 'rgba(255,255,255,0.08)', borderRadius: '50%', filter: 'blur(60px)' }} />
        <div style={{ position: 'absolute', bottom: '-60px', left: '-40px', width: '220px', height: '220px', background: 'rgba(255,255,255,0.05)', borderRadius: '50%', filter: 'blur(60px)' }} />
        <div style={{ position: 'relative', padding: '40px', display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', gap: '32px', flexWrap: 'wrap' }}>
          <div>
            <p style={{ color: '#c7d2fe', fontSize: '13px', fontWeight: 600, letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: '10px' }}>
              Smart Campus Operations Hub
            </p>
            <h1 style={{ fontSize: '32px', fontWeight: 700, marginBottom: '12px' }}>
              Welcome back, {user?.name?.split(' ')[0]}
            </h1>
            <p style={{ color: '#c7d2fe', fontSize: '15px', maxWidth: '560px', lineHeight: 1.6 }}>
              {isAdmin
                ? 'Manage platform access, users, and technician operations from one place.'
                : isTechnician
                ? 'Stay on top of assigned maintenance work and notifications.'
                : 'Access resources, track bookings, and follow your maintenance requests.'}
            </p>
          </div>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
            {user?.roles?.map((role) => {
              const roleColors = {
                admin: { bg: 'rgba(239,68,68,0.2)', color: '#fecaca', border: 'rgba(248,113,113,0.35)' },
                technician: { bg: 'rgba(245,158,11,0.2)', color: '#fde68a', border: 'rgba(251,191,36,0.35)' },
                user: { bg: 'rgba(16,185,129,0.2)', color: '#a7f3d0', border: 'rgba(52,211,153,0.35)' },
              };
              const rc = roleColors[role.toLowerCase()] || { bg: 'rgba(255,255,255,0.1)', color: '#fff', border: 'rgba(255,255,255,0.2)' };
              return (
                <span key={role} style={{ padding: '4px 14px', borderRadius: '999px', fontSize: '11px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em', border: `1px solid ${rc.border}`, background: rc.bg, color: rc.color }}>
                  {role}
                </span>
              );
            })}
          </div>
        </div>
      </section>

      {/* Quick Access */}
      <section style={{ marginBottom: '48px' }}>
        <div style={{ marginBottom: '24px' }}>
          <h2 style={{ fontSize: '20px', fontWeight: 700, color: '#111827' }}>Quick access</h2>
          <p style={{ fontSize: '14px', color: '#6b7280', marginTop: '4px' }}>Jump into the most important areas of the system.</p>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '20px' }}>
          {cards.map((card) => (
            <Link
              key={card.title}
              to={card.link}
              style={{ textDecoration: 'none', color: 'inherit' }}
            >
              <div style={{ position: 'relative', background: '#fff', borderRadius: '16px', border: '1px solid #f3f4f6', boxShadow: '0 2px 8px rgba(0,0,0,0.04)', padding: '24px', display: 'flex', flexDirection: 'column', alignItems: 'flex-start', overflow: 'hidden', cursor: 'pointer', transition: 'all 0.25s ease' }}
                onMouseEnter={(e) => { e.currentTarget.style.boxShadow = '0 12px 32px rgba(0,0,0,0.1)'; e.currentTarget.style.transform = 'translateY(-4px)'; }}
                onMouseLeave={(e) => { e.currentTarget.style.boxShadow = '0 2px 8px rgba(0,0,0,0.04)'; e.currentTarget.style.transform = 'translateY(0)'; }}
              >
                <div style={{ width: '48px', height: '48px', borderRadius: '12px', background: card.bg, color: card.accent, display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '16px' }}>
                  {card.icon}
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
                  <h3 style={{ fontSize: '16px', fontWeight: 600, color: '#111827', margin: 0 }}>{card.title}</h3>
                  {card.badge && (
                    <span style={{ background: card.accent, color: '#fff', fontSize: '11px', fontWeight: 700, padding: '2px 10px', borderRadius: '999px' }}>
                      {card.badge > 99 ? '99+' : card.badge}
                    </span>
                  )}
                </div>
                <p style={{ fontSize: '14px', color: '#6b7280', lineHeight: 1.5, margin: 0 }}>{card.description}</p>
                <div style={{ position: 'absolute', bottom: 0, left: 0, height: '3px', width: '0%', background: card.accent, borderBottomLeftRadius: '16px', borderBottomRightRadius: '16px', transition: 'width 0.3s ease' }}
                  className="card-accent-bar"
                />
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* Bottom Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '24px' }}>
        {/* Today's Focus */}
        <div style={{ background: '#fff', borderRadius: '16px', border: '1px solid #f3f4f6', boxShadow: '0 2px 8px rgba(0,0,0,0.04)', padding: '24px' }}>
          <h3 style={{ fontSize: '18px', fontWeight: 700, color: '#111827', marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '10px' }}>
            <span style={{ width: '5px', height: '20px', background: '#6366f1', borderRadius: '999px', display: 'inline-block' }} />
            Today's focus
          </h3>
          <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '14px' }}>
            <li style={{ display: 'flex', alignItems: 'flex-start', gap: '12px', fontSize: '14px', color: '#4b5563' }}>
              <span style={{ width: '22px', height: '22px', borderRadius: '50%', background: '#eef2ff', color: '#4f46e5', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '11px', fontWeight: 700, flexShrink: 0, marginTop: '1px' }}>1</span>
              Check your latest notifications
            </li>
            <li style={{ display: 'flex', alignItems: 'flex-start', gap: '12px', fontSize: '14px', color: '#4b5563' }}>
              <span style={{ width: '22px', height: '22px', borderRadius: '50%', background: '#eef2ff', color: '#4f46e5', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '11px', fontWeight: 700, flexShrink: 0, marginTop: '1px' }}>2</span>
              Review current bookings and tickets
            </li>
            {isAdmin && (
              <li style={{ display: 'flex', alignItems: 'flex-start', gap: '12px', fontSize: '14px', color: '#4b5563' }}>
                <span style={{ width: '22px', height: '22px', borderRadius: '50%', background: '#eef2ff', color: '#4f46e5', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '11px', fontWeight: 700, flexShrink: 0, marginTop: '1px' }}>3</span>
                Open the admin panel to manage users and technicians
              </li>
            )}
            {isTechnician && !isAdmin && (
              <li style={{ display: 'flex', alignItems: 'flex-start', gap: '12px', fontSize: '14px', color: '#4b5563' }}>
                <span style={{ width: '22px', height: '22px', borderRadius: '50%', background: '#eef2ff', color: '#4f46e5', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '11px', fontWeight: 700, flexShrink: 0, marginTop: '1px' }}>3</span>
                Review your assigned tickets
              </li>
            )}
          </ul>
        </div>

        {/* Account Overview */}
        <div style={{ background: '#fff', borderRadius: '16px', border: '1px solid #f3f4f6', boxShadow: '0 2px 8px rgba(0,0,0,0.04)', padding: '24px' }}>
          <h3 style={{ fontSize: '18px', fontWeight: 700, color: '#111827', marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '10px' }}>
            <span style={{ width: '5px', height: '20px', background: '#10b981', borderRadius: '999px', display: 'inline-block' }} />
            Account overview
          </h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', paddingBottom: '14px', borderBottom: '1px solid #f9fafb' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <div style={{ width: '32px', height: '32px', borderRadius: '8px', background: '#f3f4f6', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#6b7280' }}>
                  <FaUser size={13} />
                </div>
                <span style={{ fontSize: '14px', color: '#6b7280' }}>Name</span>
              </div>
              <span style={{ fontSize: '14px', fontWeight: 600, color: '#111827' }}>{user?.name}</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', paddingBottom: '14px', borderBottom: '1px solid #f9fafb' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <div style={{ width: '32px', height: '32px', borderRadius: '8px', background: '#f3f4f6', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#6b7280' }}>
                  <FaEnvelope size={13} />
                </div>
                <span style={{ fontSize: '14px', color: '#6b7280' }}>Email</span>
              </div>
              <span style={{ fontSize: '14px', fontWeight: 600, color: '#111827' }}>{user?.email}</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <div style={{ width: '32px', height: '32px', borderRadius: '8px', background: '#f3f4f6', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#6b7280' }}>
                  <FaBell size={13} />
                </div>
                <span style={{ fontSize: '14px', color: '#6b7280' }}>Unread notifications</span>
              </div>
              <span style={{ fontSize: '14px', fontWeight: 600, color: unreadCount > 0 ? '#e11d48' : '#111827' }}>
                {unreadCount}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}