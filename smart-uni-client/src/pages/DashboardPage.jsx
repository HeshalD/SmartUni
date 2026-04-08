import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useNotifications } from '../hooks/useNotifications';

export default function DashboardPage() {
  const { user, isAdmin, isTechnician } = useAuth();
  const { unreadCount } = useNotifications();

  const cards = [
    {
      title: 'Resources',
      description: 'Browse and search campus facilities and equipment.',
      icon: '🏛️',
      link: '/resources',
      color: '#6366f1',
    },
    {
      title: 'Bookings',
      description: 'Request and manage your resource bookings.',
      icon: '📅',
      link: '/bookings',
      color: '#0ea5e9',
    },
    {
      title: isTechnician && !isAdmin ? 'My Tickets' : 'Tickets',
      description: 'Report and track maintenance incidents.',
      icon: '🔧',
      link: '/tickets',
      color: '#f59e0b',
    },
    {
      title: 'Notifications',
      description: `You have ${unreadCount} unread notification${unreadCount !== 1 ? 's' : ''}.`,
      icon: '🔔',
      link: '/notifications',
      color: '#10b981',
      badge: unreadCount > 0 ? unreadCount : null,
    },
  ];

  if (isAdmin) {
    cards.push({
      title: 'Admin Panel',
      description: 'Manage users, technicians, and access.',
      icon: '⚙️',
      link: '/admin',
      color: '#ef4444',
    });
  }

  return (
    <div className="page-container">
      <section className="dashboard-hero">
        <div>
          <p className="dashboard-hero__eyebrow">Smart Campus Operations Hub</p>
          <h2 className="dashboard-hero__title">
            Welcome back, {user?.name?.split(' ')[0]} 👋
          </h2>
          <p className="dashboard-hero__text">
            {isAdmin
              ? 'Manage platform access, users, and technician operations from one place.'
              : isTechnician
              ? 'Stay on top of assigned maintenance work and notifications.'
              : 'Access resources, track bookings, and follow your maintenance requests.'}
          </p>
        </div>

        <div className="role-badges">
          {user?.roles?.map((role) => (
            <span key={role} className={`role-badge role-badge--${role.toLowerCase()}`}>
              {role}
            </span>
          ))}
        </div>
      </section>

      <section className="dashboard-section">
        <div className="section-heading">
          <h3>Quick access</h3>
          <p>Jump into the most important areas of the system.</p>
        </div>

        <div className="dashboard-grid">
          {cards.map((card) => (
            <Link
              to={card.link}
              key={card.title}
              className="dashboard-card"
              style={{ '--card-accent': card.color }}
            >
              <div className="dashboard-card__icon">{card.icon}</div>
              <div className="dashboard-card__body">
                <div className="dashboard-card__title-row">
                  <h2 className="dashboard-card__title">{card.title}</h2>
                  {card.badge && (
                    <span className="badge-count">{card.badge > 99 ? '99+' : card.badge}</span>
                  )}
                </div>
                <p className="dashboard-card__desc">{card.description}</p>
              </div>
            </Link>
          ))}
        </div>
      </section>

      <section className="dashboard-bottom-grid">
        <div className="info-panel">
          <h3>Today’s focus</h3>
          <ul className="info-list">
            <li>Check your latest notifications</li>
            <li>Review current bookings and tickets</li>
            {isAdmin && <li>Open the admin panel to manage users and technicians</li>}
            {isTechnician && !isAdmin && <li>Review your assigned tickets</li>}
          </ul>
        </div>

        <div className="info-panel">
          <h3>Account overview</h3>
          <div className="overview-item">
            <span>Name</span>
            <strong>{user?.name}</strong>
          </div>
          <div className="overview-item">
            <span>Email</span>
            <strong>{user?.email}</strong>
          </div>
          <div className="overview-item">
            <span>Unread notifications</span>
            <strong>{unreadCount}</strong>
          </div>
        </div>
      </section>
    </div>
  );
}