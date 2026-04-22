import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { FaArrowLeft, FaTrashAlt, FaMapMarkerAlt, FaUser, FaPhone, FaWrench, FaCalendar, FaSync, FaCheckCircle, FaTimesCircle, FaImage, FaCog, FaComments, FaEdit, FaSave, FaTimes } from 'react-icons/fa';

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

const STATUSES = ['OPEN','IN_PROGRESS','RESOLVED','CLOSED','REJECTED'];

export default function TicketDetailPage() {
  const { id }       = useParams();
  const { user, isAdmin, isTechnician } = useAuth();
  const token = localStorage.getItem('token');
  const navigate     = useNavigate();

  const [ticket,          setTicket]          = useState(null);
  const [loading,         setLoading]         = useState(true);
  const [error,           setError]           = useState('');

  // Update ticket state
  const [updateForm,      setUpdateForm]      = useState({ status: '', assignedTechnicianId: '', assignedTechnicianName: '', resolutionNotes: '', rejectionReason: '' });
  const [updating,        setUpdating]        = useState(false);

  // Comment state
  const [commentText,     setCommentText]     = useState('');
  const [addingComment,   setAddingComment]   = useState(false);
  const [editingComment,  setEditingComment]  = useState(null);
  const [editText,        setEditText]        = useState('');

  useEffect(() => { fetchTicket(); }, [id]);

  async function fetchTicket() {
    setLoading(true);
    try {
      const res = await fetch(`${API}/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) throw new Error('Ticket not found');
      const data = await res.json();
      setTicket(data);
      setUpdateForm({
        status:                data.status,
        assignedTechnicianId:  data.assignedTechnicianId   || '',
        assignedTechnicianName:data.assignedTechnicianName || '',
        resolutionNotes:       data.resolutionNotes        || '',
        rejectionReason:       data.rejectionReason        || '',
      });
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  async function handleUpdate(e) {
    e.preventDefault();
    setUpdating(true);
    try {
      const res = await fetch(`${API}/${id}`, {
        method:  'PUT',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body:    JSON.stringify(updateForm),
      });
      if (!res.ok) throw new Error('Failed to update ticket');
      await fetchTicket();
    } catch (err) {
      setError(err.message);
    } finally {
      setUpdating(false);
    }
  }

  async function handleAddComment(e) {
    e.preventDefault();
    if (!commentText.trim()) return;
    setAddingComment(true);
    try {
      const res = await fetch(`${API}/${id}/comments`, {
        method:  'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body:    JSON.stringify({ content: commentText, authorId: user.id, authorName: user.name }),
      });
      if (!res.ok) throw new Error('Failed to add comment');
      setCommentText('');
      await fetchTicket();
    } catch (err) {
      setError(err.message);
    } finally {
      setAddingComment(false);
    }
  }

  async function handleEditComment(commentId) {
    if (!editText.trim()) return;
    try {
      const res = await fetch(`${API}/${id}/comments/${commentId}`, {
        method:  'PUT',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body:    JSON.stringify({ content: editText, authorId: user.id, authorName: user.name }),
      });
      if (!res.ok) throw new Error('Failed to edit comment');
      setEditingComment(null);
      setEditText('');
      await fetchTicket();
    } catch (err) {
      setError(err.message);
    }
  }

  async function handleDeleteComment(commentId) {
    if (!window.confirm('Delete this comment?')) return;
    try {
      const res = await fetch(`${API}/${id}/comments/${commentId}?authorId=${user.id}`, {
        method:  'DELETE',
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) throw new Error('Failed to delete comment');
      await fetchTicket();
    } catch (err) {
      setError(err.message);
    }
  }

  async function handleDelete() {
    if (!window.confirm('Are you sure you want to delete this ticket?')) return;
    try {
      await fetch(`${API}/${id}`, {
        method:  'DELETE',
        headers: { Authorization: `Bearer ${token}` },
      });
      navigate('/tickets');
    } catch (err) {
      setError(err.message);
    }
  }

  if (loading)
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '50vh' }}>
        <div style={{ width: '40px', height: '40px', border: '3px solid #e5e7eb', borderTop: '3px solid #4f46e5', borderRadius: '50%', animation: 'spin 1s linear infinite' }} />
      </div>
    );
  if (error)
    return (
      <div style={{ padding: '28px', maxWidth: '1200px', margin: '0 auto' }}>
        <div style={{ marginBottom: '16px', padding: '12px 16px', borderRadius: '10px', background: '#fef2f2', color: '#991b1b', fontSize: '14px', fontWeight: 500, border: '1px solid #fee2e2' }}>
          {error}
        </div>
      </div>
    );
  if (!ticket) return null;

  const canManage = isAdmin || isTechnician;

  return (
    <div style={{ padding: '28px', maxWidth: '1200px', margin: '0 auto' }}>

      {/* Back button */}
      <button
        style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: '6px',
          padding: '8px 16px',
          borderRadius: '8px',
          border: '1px solid #e5e7eb',
          background: '#ffffff',
          color: '#374151',
          fontSize: '13px',
          fontWeight: 600,
          cursor: 'pointer',
          marginBottom: '16px',
          transition: 'background 0.15s',
        }}
        onMouseEnter={(e) => { e.currentTarget.style.background = '#f3f4f6'; }}
        onMouseLeave={(e) => { e.currentTarget.style.background = '#ffffff'; }}
        onClick={() => navigate('/tickets')}
      >
        <FaArrowLeft size={12} />
        Back to Tickets
      </button>

      {/* Ticket Header */}
      <div style={{
        background: '#fff',
        border: '1px solid #e5e7eb',
        borderLeft: `5px solid ${statusColor(ticket.status)}`,
        borderRadius: '12px',
        padding: '1.5rem',
        marginBottom: '1.25rem',
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '1rem' }}>
          <div>
            <h1 style={{ fontSize: '1.5rem', fontWeight: 700, marginBottom: '0.5rem' }}>{ticket.title}</h1>
            <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
              <span style={{
                background: statusColor(ticket.status) + '22',
                color: statusColor(ticket.status),
                fontSize: '0.8rem', fontWeight: 700,
                padding: '0.25rem 0.75rem', borderRadius: '999px',
              }}>
                {ticket.status.replace('_', ' ')}
              </span>
              <span style={{
                background: '#f3f4f6', color: '#374151',
                fontSize: '0.8rem', fontWeight: 600,
                padding: '0.25rem 0.75rem', borderRadius: '999px',
              }}>
                {ticket.priority}
              </span>
              <span style={{
                background: '#ede9fe', color: '#5b21b6',
                fontSize: '0.8rem', fontWeight: 600,
                padding: '0.25rem 0.75rem', borderRadius: '999px',
              }}>
                {ticket.category.replace('_', ' ')}
              </span>
            </div>
          </div>

          {isAdmin && (
            <button
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '6px',
                padding: '8px 16px',
                borderRadius: '8px',
                border: '1px solid #ef4444',
                background: '#ffffff',
                color: '#ef4444',
                fontSize: '13px',
                fontWeight: 600,
                cursor: 'pointer',
                transition: 'background 0.15s',
              }}
              onMouseEnter={(e) => { e.currentTarget.style.background = '#fef2f2'; }}
              onMouseLeave={(e) => { e.currentTarget.style.background = '#ffffff'; }}
              onClick={handleDelete}
            >
              <FaTrashAlt size={12} />
              Delete Ticket
            </button>
          )}
        </div>

        <p style={{ marginTop: '1rem', color: '#4b5563', lineHeight: 1.7 }}>{ticket.description}</p>

        {/* Meta info */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '0.75rem', marginTop: '1.25rem' }}>
          {[
            { label: <><FaMapMarkerAlt size={12} /> Location</>, value: ticket.location },
            { label: <><FaUser size={12} /> Reporter</>, value: ticket.reporterName },
            { label: <><FaPhone size={12} /> Contact</>, value: ticket.contactDetails },
            { label: <><FaWrench size={12} /> Technician</>, value: ticket.assignedTechnicianName || 'Not assigned' },
            { label: <><FaCalendar size={12} /> Created</>, value: new Date(ticket.createdAt).toLocaleDateString() },
            { label: <><FaSync size={12} /> Updated</>, value: new Date(ticket.updatedAt).toLocaleDateString() },
          ].map(({ label, value }, index) => (
            <div key={index} style={{ background: '#f9fafb', padding: '0.75rem', borderRadius: '8px' }}>
              <div style={{ fontSize: '0.75rem', color: '#9ca3af', marginBottom: '0.2rem' }}>{label}</div>
              <div style={{ fontSize: '0.9rem', fontWeight: 500 }}>{value}</div>
            </div>
          ))}
        </div>

        {/* Resolution notes */}
        {ticket.resolutionNotes && (
          <div style={{ marginTop: '1rem', background: '#d1fae5', border: '1px solid #6ee7b7', borderRadius: '8px', padding: '0.75rem 1rem' }}>
            <div style={{ fontSize: '12px', fontWeight: 700, color: '#065f46', marginBottom: '4px', display: 'flex', alignItems: 'center', gap: '6px' }}><FaCheckCircle size={12} /> Resolution Notes</div>
            <p style={{ color: '#065f46', fontSize: '0.9rem' }}>{ticket.resolutionNotes}</p>
          </div>
        )}

        {/* Rejection reason */}
        {ticket.rejectionReason && (
          <div style={{ marginTop: '1rem', background: '#fee2e2', border: '1px solid #fca5a5', borderRadius: '8px', padding: '0.75rem 1rem' }}>
            <div style={{ fontSize: '12px', fontWeight: 700, color: '#991b1b', marginBottom: '4px', display: 'flex', alignItems: 'center', gap: '6px' }}><FaTimesCircle size={12} /> Rejection Reason</div>
            <p style={{ color: '#991b1b', fontSize: '0.9rem' }}>{ticket.rejectionReason}</p>
          </div>
        )}

        {/* Images */}
        {ticket.imageUrls?.length > 0 && (
          <div style={{ marginTop: '1rem' }}>
            <div style={{ fontSize: '13px', fontWeight: 600, marginBottom: '8px', color: '#374151', display: 'flex', alignItems: 'center', gap: '6px' }}><FaImage size={12} /> Attachments</div>
            <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
              {ticket.imageUrls.map((url, i) => (
                <a key={i} href={url} target="_blank" rel="noreferrer"
                  style={{ fontSize: '0.8rem', color: '#6366f1', background: '#eef2ff', padding: '0.3rem 0.75rem', borderRadius: '6px' }}>
                  Image {i + 1} ↗
                </a>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Update Status Panel (Admin/Technician only) */}
      {canManage && (
        <div style={{
          background: '#fff', border: '1px solid #e5e7eb',
          borderRadius: '12px', padding: '1.5rem', marginBottom: '1.25rem',
        }}>
          <h2 style={{ fontSize: '16px', fontWeight: 700, marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}><FaCog size={16} /> Update Ticket</h2>
          <form onSubmit={handleUpdate} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
              <div className="form-group">
                <label>Status</label>
                <select
                  value={updateForm.status}
                  onChange={e => setUpdateForm({ ...updateForm, status: e.target.value })}
                  style={{ padding: '0.6rem 0.9rem', border: '1px solid #e5e7eb', borderRadius: '6px' }}
                >
                  {STATUSES.map(s => <option key={s} value={s}>{s.replace('_', ' ')}</option>)}
                </select>
              </div>

              <div className="form-group">
                <label>Technician Name</label>
                <input
                  value={updateForm.assignedTechnicianName}
                  onChange={e => setUpdateForm({ ...updateForm, assignedTechnicianName: e.target.value })}
                  placeholder="Assign technician name"
                />
              </div>
            </div>

            <div className="form-group">
              <label>Resolution Notes</label>
              <textarea
                value={updateForm.resolutionNotes}
                onChange={e => setUpdateForm({ ...updateForm, resolutionNotes: e.target.value })}
                placeholder="Add resolution notes..."
                rows={3}
                style={{ padding: '0.6rem 0.9rem', border: '1px solid #e5e7eb', borderRadius: '6px', resize: 'vertical' }}
              />
            </div>

            {updateForm.status === 'REJECTED' && (
              <div className="form-group">
                <label>Rejection Reason</label>
                <input
                  value={updateForm.rejectionReason}
                  onChange={e => setUpdateForm({ ...updateForm, rejectionReason: e.target.value })}
                  placeholder="Reason for rejection..."
                />
              </div>
            )}

            <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
              <button type="submit" className="btn btn-primary" disabled={updating}>
                {updating ? 'Updating...' : 'Update Ticket'}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Comments Section */}
      <div style={{ background: '#fff', border: '1px solid #e5e7eb', borderRadius: '12px', padding: '1.5rem' }}>
        <h2 style={{ fontSize: '16px', fontWeight: 700, marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
          <FaComments size={16} /> Comments ({ticket.comments?.length || 0})
        </h2>

        {/* Add comment */}
        <form onSubmit={handleAddComment} style={{ marginBottom: '1.25rem', display: 'flex', gap: '0.75rem' }}>
          <input
            value={commentText}
            onChange={e => setCommentText(e.target.value)}
            placeholder="Write a comment..."
            style={{ flex: 1, padding: '0.6rem 0.9rem', border: '1px solid #e5e7eb', borderRadius: '6px' }}
          />
          <button type="submit" className="btn btn-primary" disabled={addingComment || !commentText.trim()}>
            {addingComment ? '...' : 'Post'}
          </button>
        </form>

        {/* Comment list */}
        {ticket.comments?.length === 0 ? (
          <p style={{ color: '#9ca3af', fontSize: '0.9rem', textAlign: 'center', padding: '1rem' }}>
            No comments yet. Be the first to comment!
          </p>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            {ticket.comments.map((comment) => (
              <div key={comment.id} style={{
                background: '#f9fafb', border: '1px solid #e5e7eb',
                borderRadius: '8px', padding: '0.875rem 1rem',
              }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.4rem' }}>
                  <span style={{ fontWeight: 600, fontSize: '0.9rem' }}>{comment.authorName}</span>
                  <div style={{ display: 'flex', gap: '0.4rem', alignItems: 'center' }}>
                    <span style={{ fontSize: '0.75rem', color: '#9ca3af' }}>
                      {new Date(comment.createdAt).toLocaleDateString()}
                    </span>
                    {comment.authorId === user?.id && (
                      <>
                        <button
                          style={{
                            padding: '4px 8px',
                            borderRadius: '4px',
                            border: 'none',
                            background: '#f3f4f6',
                            color: '#6b7280',
                            cursor: 'pointer',
                            fontSize: '12px',
                            transition: 'background 0.15s',
                          }}
                          onMouseEnter={(e) => { e.currentTarget.style.background = '#e5e7eb'; }}
                          onMouseLeave={(e) => { e.currentTarget.style.background = '#f3f4f6'; }}
                          onClick={() => { setEditingComment(comment.id); setEditText(comment.content); }}
                        >
                          <FaEdit size={10} />
                        </button>
                        <button
                          style={{
                            padding: '4px 8px',
                            borderRadius: '4px',
                            border: 'none',
                            background: '#fef2f2',
                            color: '#ef4444',
                            cursor: 'pointer',
                            fontSize: '12px',
                            transition: 'background 0.15s',
                          }}
                          onMouseEnter={(e) => { e.currentTarget.style.background = '#fee2e2'; }}
                          onMouseLeave={(e) => { e.currentTarget.style.background = '#fef2f2'; }}
                          onClick={() => handleDeleteComment(comment.id)}
                        >
                          <FaTrashAlt size={10} />
                        </button>
                      </>
                    )}
                  </div>
                </div>

                {editingComment === comment.id ? (
                  <div style={{ display: 'flex', gap: '0.5rem', marginTop: '0.5rem' }}>
                    <input
                      value={editText}
                      onChange={e => setEditText(e.target.value)}
                      style={{ flex: 1, padding: '0.5rem 0.75rem', border: '1px solid #e5e7eb', borderRadius: '6px' }}
                    />
                    <button
                      style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        padding: '6px 12px',
                        borderRadius: '6px',
                        background: '#4f46e5',
                        color: '#fff',
                        fontSize: '12px',
                        fontWeight: 600,
                        border: 'none',
                        cursor: 'pointer',
                        transition: 'background 0.15s',
                      }}
                      onMouseEnter={(e) => { e.currentTarget.style.background = '#4338ca'; }}
                      onMouseLeave={(e) => { e.currentTarget.style.background = '#4f46e5'; }}
                      onClick={() => handleEditComment(comment.id)}
                    >
                      <FaSave size={10} style={{ marginRight: '4px' }} />
                      Save
                    </button>
                    <button
                      style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        padding: '6px 12px',
                        borderRadius: '6px',
                        border: '1px solid #e5e7eb',
                        background: '#ffffff',
                        color: '#374151',
                        fontSize: '12px',
                        fontWeight: 600,
                        cursor: 'pointer',
                        transition: 'background 0.15s',
                      }}
                      onMouseEnter={(e) => { e.currentTarget.style.background = '#f3f4f6'; }}
                      onMouseLeave={(e) => { e.currentTarget.style.background = '#ffffff'; }}
                      onClick={() => setEditingComment(null)}
                    >
                      <FaTimes size={10} style={{ marginRight: '4px' }} />
                      Cancel
                    </button>
                  </div>
                ) : (
                  <p style={{ fontSize: '0.9rem', color: '#4b5563' }}>{comment.content}</p>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}