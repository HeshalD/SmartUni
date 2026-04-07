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
      title: 'Tickets',
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
    title: 'Admin panel',
    description: 'Manage users, roles, bookings and tickets.',
    icon: '⚙️',
    link: '/admin',
    color: '#ef4444',
  });
}

if (isTechnician && !isAdmin) {
  cards.push({
    title: 'Assigned tickets',
    description: 'View and update tickets assigned to you.',
    icon: '🔧',
    link: '/tickets',
    color: '#f59e0b',
  });
}

  return (
    <div className="page-container">
      <div className="page-header">
        <div>
          <h1 className="page-title">
            Welcome back, {user?.name?.split(' ')[0]} 👋
          </h1>
          <p className="page-subtitle">{user?.email}</p>
        </div>
        <div className="role-badges">
          {user?.roles?.map((role) => (
            <span key={role} className={`role-badge role-badge--${role.toLowerCase()}`}>
              {role}
            </span>
          ))}
        </div>
      </div>

      <div className="dashboard-grid">
        {cards.map((card) => (
          <Link to={card.link} key={card.title} className="dashboard-card" style={{ '--card-accent': card.color }}>
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
    </div>
  );
}