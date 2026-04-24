import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { FaTools, FaMapMarkerAlt, FaTags, FaUser, FaArrowRight, FaCheckCircle } from 'react-icons/fa';

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

  if (loading)
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '50vh' }}>
        <div style={{ width: '40px', height: '40px', border: '3px solid #e5e7eb', borderTop: '3px solid #4f46e5', borderRadius: '50%', animation: 'spin 1s linear infinite' }} />
      </div>
    );

  return (
    <div style={{ padding: '28px', maxWidth: '1200px', margin: '0 auto' }}>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: '16px', flexWrap: 'wrap', marginBottom: '24px' }}>
        <div>
          <h1 style={{ fontSize: '22px', fontWeight: 800, color: '#111827', margin: 0, display: 'flex', alignItems: 'center', gap: '10px' }}>
            
            Maintenance Tickets 
          </h1>
          <p style={{ fontSize: '14px', color: '#6b7280', margin: '4px 0 0 0' }}>
            {isAdmin ? 'All submitted incident tickets' : 'Your submitted tickets'}
          </p>
        </div>
        <Link
          to="/tickets/new"
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '6px',
            padding: '10px 18px',
            borderRadius: '10px',
            background: '#4f46e5',
            color: '#fff',
            fontSize: '13px',
            fontWeight: 600,
            textDecoration: 'none',
            transition: 'background 0.15s',
          }}
          onMouseEnter={(e) => { e.currentTarget.style.background = '#4338ca'; }}
          onMouseLeave={(e) => { e.currentTarget.style.background = '#4f46e5'; }}
        >
          + New Ticket
        </Link>
      </div>

      {/* Error */}
      {error && (
        <div style={{ marginBottom: '16px', padding: '12px 16px', borderRadius: '10px', background: '#fef2f2', color: '#991b1b', fontSize: '14px', fontWeight: 500, border: '1px solid #fee2e2' }}>
          {error}
        </div>
      )}

      {/* Filter */}
      <div style={{ marginBottom: '20px', display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
        {['', 'OPEN', 'IN_PROGRESS', 'RESOLVED', 'CLOSED', 'REJECTED'].map((s) => {
          const active = statusFilter === s;
          return (
            <button
              key={s}
              onClick={() => setStatusFilter(s)}
              style={{
                fontSize: '13px',
                padding: '6px 14px',
                borderRadius: '8px',
                border: active ? 'none' : '1px solid #e5e7eb',
                background: active ? '#4f46e5' : '#ffffff',
                color: active ? '#fff' : '#374151',
                fontWeight: 600,
                cursor: 'pointer',
                transition: 'background 0.15s, color 0.15s',
              }}
              onMouseEnter={(e) => {
                if (!active) {
                  e.currentTarget.style.background = '#f3f4f6';
                }
              }}
              onMouseLeave={(e) => {
                if (!active) {
                  e.currentTarget.style.background = '#ffffff';
                }
              }}
            >
              {s.replace('_', ' ') || 'All'}
            </button>
          );
        })}
      </div>

      {/* Ticket list */}
      {filtered.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '48px 20px', color: '#9ca3af' }}>
          <FaCheckCircle size={40} color="#d1d5db" style={{ marginBottom: '16px' }} />
          <h3 style={{ fontSize: '18px', fontWeight: 700, color: '#374151', margin: '0 0 8px 0' }}>No tickets found</h3>
          <p style={{ fontSize: '14px', color: '#6b7280', margin: 0 }}>No tickets match the selected filter.</p>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
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
                  padding: '16px 20px',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  gap: '16px',
                  flexWrap: 'wrap',
                  boxShadow: '0 1px 3px rgba(0,0,0,0.05)',
                  transition: 'box-shadow 0.2s',
                }}
                onMouseEnter={e => e.currentTarget.style.boxShadow = '0 4px 12px rgba(0,0,0,0.1)'}
                onMouseLeave={e => e.currentTarget.style.boxShadow = '0 1px 3px rgba(0,0,0,0.05)'}
              >
                <div style={{ flex: 1 }}>
                  <div style={{ fontWeight: 600, fontSize: '16px', marginBottom: '4px' }}>
                    {ticket.title}
                  </div>
                  <div style={{ fontSize: '14px', color: '#6b7280', display: 'flex', alignItems: 'center', gap: '6px', flexWrap: 'wrap' }}>
                    <FaMapMarkerAlt size={12} /> {ticket.location}
                    <span style={{ color: '#d1d5db' }}>·</span>
                    <FaTags size={12} /> {ticket.category}
                    <span style={{ color: '#d1d5db' }}>·</span>
                    <FaUser size={12} /> {ticket.reporterName}
                  </div>
                </div>

                <div style={{ display: 'flex', gap: '8px', alignItems: 'center', flexWrap: 'wrap' }}>
                  {/* Priority badge */}
                  <span style={{
                    background: priorityColor(ticket.priority) + '22',
                    color: priorityColor(ticket.priority),
                    fontSize: '12px',
                    fontWeight: 700,
                    padding: '3px 10px',
                    borderRadius: '5px',
                  }}>
                    {ticket.priority}
                  </span>

                  {/* Status badge */}
                  <span style={{
                    background: statusColor(ticket.status) + '22',
                    color: statusColor(ticket.status),
                    fontSize: '12px',
                    fontWeight: 700,
                    padding: '3px 10px',
                    borderRadius: '5px',
                  }}>
                    {ticket.status.replace('_', ' ')}
                  </span>

                  <FaArrowRight size={14} color="#9ca3af" />
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}