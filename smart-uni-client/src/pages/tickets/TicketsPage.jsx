import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const API = 'http://localhost:8080/api/tickets';

function statusColor(status) {
  switch (status) {
    case 'OPEN':        return '#f59e0b';
    case 'IN_PROGRESS': return '#6366f1';
    case 'RESOLVED':    return '#10b981';
    case 'CLOSED':      return '#6b7280';
    case 'REJECTED':    return '#ef4444';
    default:            return '#6b7280';
  }
}

function priorityColor(priority) {
  switch (priority) {
    case 'LOW':      return '#10b981';
    case 'MEDIUM':   return '#f59e0b';
    case 'HIGH':     return '#ef4444';
    case 'CRITICAL': return '#7f1d1d';
    default:         return '#6b7280';
  }
}

export default function TicketsPage() {
  const { user, isAdmin, isTechnician } = useAuth();
  const token = localStorage.getItem('token');
  const [tickets, setTickets]   = useState([]);
  const [loading, setLoading]   = useState(true);
  const [error, setError]       = useState('');
  const [statusFilter, setStatusFilter] = useState('');

  useEffect(() => {
    fetchTickets();
  }, []);

  async function fetchTickets() {
    setLoading(true);
    try {
      const url = isAdmin
        ? API
        : `${API}/reporter/${user.id}`;

      const res = await fetch(url, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!res.ok) throw new Error('Failed to fetch tickets');
      const data = await res.json();
      setTickets(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  const filtered = statusFilter
    ? tickets.filter((t) => t.status === statusFilter)
    : tickets;

  if (loading) return <div className="loading-spinner"><div className="spinner" /></div>;

  return (
    <div className="page-container">
      {/* Header */}
      <div className="page-header">
        <div>
          <h1 className="page-title">🔧 Maintenance Tickets</h1>
          <p className="page-subtitle">
            {isAdmin ? 'All submitted incident tickets' : 'Your submitted tickets'}
          </p>
        </div>
        <Link to="/tickets/new" className="btn btn-primary">
          + New Ticket
        </Link>
      </div>

      {/* Error */}
      {error && <div className="alert alert-error">{error}</div>}

      {/* Filter */}
      <div style={{ marginBottom: '1.25rem', display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
        {['', 'OPEN', 'IN_PROGRESS', 'RESOLVED', 'CLOSED', 'REJECTED'].map((s) => (
          <button
            key={s}
            onClick={() => setStatusFilter(s)}
            className={`btn ${statusFilter === s ? 'btn-primary' : 'btn-outline'}`}
            style={{ fontSize: '0.8rem', padding: '0.35rem 0.9rem' }}
          >
            {s || 'All'}
          </button>
        ))}
      </div>

      {/* Ticket list */}
      {filtered.length === 0 ? (
        <div className="empty-state">
          <span style={{ fontSize: '2.5rem' }}>🎉</span>
          <h3>No tickets found</h3>
          <p>No tickets match the selected filter.</p>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
          {filtered.map((ticket) => (
            <Link
              to={`/tickets/${ticket.id}`}
              key={ticket.id}
              style={{ textDecoration: 'none', color: 'inherit' }}
            >
              <div
                style={{
                  background: '#fff',
                  border: '1px solid #e5e7eb',
                  borderLeft: `4px solid ${statusColor(ticket.status)}`,
                  borderRadius: '10px',
                  padding: '1rem 1.25rem',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  gap: '1rem',
                  flexWrap: 'wrap',
                  boxShadow: '0 1px 3px rgba(0,0,0,0.05)',
                  transition: 'box-shadow 0.2s',
                }}
                onMouseEnter={e => e.currentTarget.style.boxShadow = '0 4px 12px rgba(0,0,0,0.1)'}
                onMouseLeave={e => e.currentTarget.style.boxShadow = '0 1px 3px rgba(0,0,0,0.05)'}
              >
                <div style={{ flex: 1 }}>
                  <div style={{ fontWeight: 600, fontSize: '1rem', marginBottom: '0.25rem' }}>
                    {ticket.title}
                  </div>
                  <div style={{ fontSize: '0.85rem', color: '#6b7280' }}>
                    📍 {ticket.location} &nbsp;·&nbsp; 🗂️ {ticket.category}
                    &nbsp;·&nbsp; 👤 {ticket.reporterName}
                  </div>
                </div>

                <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center', flexWrap: 'wrap' }}>
                  {/* Priority badge */}
                  <span style={{
                    background: priorityColor(ticket.priority) + '22',
                    color: priorityColor(ticket.priority),
                    fontSize: '0.75rem',
                    fontWeight: 700,
                    padding: '0.2rem 0.6rem',
                    borderRadius: '999px',
                  }}>
                    {ticket.priority}
                  </span>

                  {/* Status badge */}
                  <span style={{
                    background: statusColor(ticket.status) + '22',
                    color: statusColor(ticket.status),
                    fontSize: '0.75rem',
                    fontWeight: 700,
                    padding: '0.2rem 0.6rem',
                    borderRadius: '999px',
                  }}>
                    {ticket.status.replace('_', ' ')}
                  </span>

                  <span style={{ color: '#9ca3af', fontSize: '0.8rem' }}>→</span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}