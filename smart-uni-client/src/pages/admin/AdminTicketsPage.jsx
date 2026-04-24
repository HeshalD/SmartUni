import { useState, useEffect } from "react";
import { ticketsApi } from "../../api/ticketApi";
import { 
  FaSpinner, 
  FaEdit, 
  FaComment, 
  FaTimes, 
  FaCheck, 
  FaExclamationTriangle,
  FaTicketAlt
} from 'react-icons/fa';

const STATUS_OPTIONS = ["ALL", "OPEN", "IN_PROGRESS", "RESOLVED", "CLOSED", "REJECTED"];

const STATUS_STYLES = {
  OPEN: { background: "#fef3c7", color: "#92400e" },
  IN_PROGRESS: { background: "#dbeafe", color: "#1e40af" },
  RESOLVED: { background: "#d1fae5", color: "#065f46" },
  CLOSED: { background: "#f3f4f6", color: "#6b7280" },
};

const PRIORITY_STYLES = {
  LOW: { background: "#f0fdf4", color: "#166534" },
  MEDIUM: { background: "#fef3c7", color: "#92400e" },
  HIGH: { background: "#fee2e2", color: "#991b1b" },
  URGENT: { background: "#fecaca", color: "#7f1d1d" },
};

export default function AdminTicketsPage() {
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [statusFilter, setStatusFilter] = useState("ALL");
  const [selectedTicket, setSelectedTicket] = useState(null);
  const [showCommentModal, setShowCommentModal] = useState(false);
  const [showUpdateModal, setShowUpdateModal] = useState(false);
  const [comment, setComment] = useState("");
  const [updateStatus, setUpdateStatus] = useState("");
  const [technicianName, setTechnicianName] = useState("");  
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    fetchTickets();
  }, [statusFilter]);

  const fetchTickets = async () => {
    try {
      setLoading(true);
      const response = statusFilter === "ALL" 
        ? await ticketsApi.getAllTickets()
        : await ticketsApi.getAllTickets(statusFilter);
      setTickets(response.data);
      setError(null);
    } catch (err) {
      setError("Failed to fetch tickets");
      console.error("Error fetching tickets:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateTicket = async () => {
    if (!selectedTicket || !updateStatus) return;
    
    try {
      setIsSubmitting(true);
      await ticketsApi.updateTicket(selectedTicket.id, { 
          status: updateStatus,
          assignedTechnicianName: technicianName 
  });
      await fetchTickets();
      setShowUpdateModal(false);
      setSelectedTicket(null);
      setUpdateStatus("");
      setTechnicianName("");
    } catch (err) {
      setError("Failed to update ticket");
      console.error("Error updating ticket:", err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleAddComment = async () => {
    if (!selectedTicket || !comment.trim()) return;
    
    try {
      setIsSubmitting(true);
      await ticketsApi.addComment(selectedTicket.id, { content: comment });
      await fetchTickets();
      setShowCommentModal(false);
      setSelectedTicket(null);
      setComment("");
    } catch (err) {
      setError("Failed to add comment");
      console.error("Error adding comment:", err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleString();
  };

  const openUpdateModal = (ticket) => {
    setSelectedTicket(ticket);
    setUpdateStatus(ticket.status);
    setShowUpdateModal(true);
  };

  const openCommentModal = (ticket) => {
    setSelectedTicket(ticket);
    setShowCommentModal(true);
  };

  if (loading) {
    return (
      <div style={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        height: '50vh',
        flexDirection: 'column',
        gap: '16px'
      }}>
        <FaSpinner size={32} color="#4f46e5" style={{ animation: 'spin 1s linear infinite' }} />
        <p style={{ color: '#6b7280', fontSize: '16px' }}>Loading tickets...</p>
      </div>
    );
  }

  return (
    <div style={{ padding: '16px' }}>
      <div style={{ marginBottom: '16px' }}>
        <h1 style={{ fontSize: '20px', fontWeight: 'bold', color: '#111827', marginBottom: '12px', display: 'flex', alignItems: 'center', gap: '6px' }}>
          <FaTicketAlt size={20} /> Ticket Management
        </h1>
        
        {/* Status Filter */}
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px', marginBottom: '16px' }}>
          {STATUS_OPTIONS.map((status) => (
            <button
              key={status}
              onClick={() => setStatusFilter(status)}
              style={{
                padding: '6px 12px',
                borderRadius: '6px',
                fontWeight: '500',
                fontSize: '13px',
                border: 'none',
                cursor: 'pointer',
                transition: 'all 0.15s',
                background: statusFilter === status ? '#2563eb' : '#f3f4f6',
                color: statusFilter === status ? '#ffffff' : '#374151'
              }}
              onMouseEnter={(e) => {
                if (statusFilter !== status) {
                  e.currentTarget.style.background = '#e5e7eb';
                }
              }}
              onMouseLeave={(e) => {
                if (statusFilter !== status) {
                  e.currentTarget.style.background = '#f3f4f6';
                }
              }}
            >
              {status.replace("_", " ")}
            </button>
          ))}
        </div>

        {error && (
          <div style={{
            marginBottom: '12px',
            padding: '12px',
            background: '#fef2f2',
            border: '1px solid #fecaca',
            borderRadius: '6px',
            color: '#991b1b',
            display: 'flex',
            alignItems: 'center',
            gap: '6px'
          }}>
            <FaExclamationTriangle size={14} /> {error}
          </div>
        )}

        {/* Tickets Table */}
        <div style={{
          background: '#ffffff',
          borderRadius: '8px',
          boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1)',
          overflow: 'hidden'
        }}>
          <div style={{ overflowX: 'auto' }}>
            <table style={{
              minWidth: '100%',
              borderCollapse: 'collapse',
              border: 'none'
            }}>
              <thead>
                <tr style={{ background: '#f9fafb' }}>
                  <th style={{
                    padding: '8px 12px',
                    textAlign: 'left',
                    fontSize: '11px',
                    fontWeight: '500',
                    color: '#6b7280',
                    textTransform: 'uppercase',
                    letterSpacing: '0.05em',
                    borderBottom: '1px solid #e5e7eb'
                  }}>
                    ID
                  </th>
                  <th style={{
                    padding: '8px 12px',
                    textAlign: 'left',
                    fontSize: '11px',
                    fontWeight: '500',
                    color: '#6b7280',
                    textTransform: 'uppercase',
                    letterSpacing: '0.05em',
                    borderBottom: '1px solid #e5e7eb'
                  }}>
                    Title
                  </th>
                  <th style={{
                    padding: '8px 12px',
                    textAlign: 'left',
                    fontSize: '11px',
                    fontWeight: '500',
                    color: '#6b7280',
                    textTransform: 'uppercase',
                    letterSpacing: '0.05em',
                    borderBottom: '1px solid #e5e7eb'
                  }}>
                    Reporter
                  </th>
                  <th style={{
                    padding: '8px 12px',
                    textAlign: 'left',
                    fontSize: '11px',
                    fontWeight: '500',
                    color: '#6b7280',
                    textTransform: 'uppercase',
                    letterSpacing: '0.05em',
                    borderBottom: '1px solid #e5e7eb'
                  }}>
                    Category
                  </th>
                  <th style={{
                    padding: '8px 12px',
                    textAlign: 'left',
                    fontSize: '11px',
                    fontWeight: '500',
                    color: '#6b7280',
                    textTransform: 'uppercase',
                    letterSpacing: '0.05em',
                    borderBottom: '1px solid #e5e7eb'
                  }}>
                    Priority
                  </th>
                  <th style={{
                    padding: '8px 12px',
                    textAlign: 'left',
                    fontSize: '11px',
                    fontWeight: '500',
                    color: '#6b7280',
                    textTransform: 'uppercase',
                    letterSpacing: '0.05em',
                    borderBottom: '1px solid #e5e7eb'
                  }}>
                    Status
                  </th>
                  <th style={{
                    padding: '8px 12px',
                    textAlign: 'left',
                    fontSize: '11px',
                    fontWeight: '500',
                    color: '#6b7280',
                    textTransform: 'uppercase',
                    letterSpacing: '0.05em',
                    borderBottom: '1px solid #e5e7eb'
                  }}>
                    Created
                  </th>
                  <th style={{
                    padding: '8px 12px',
                    textAlign: 'left',
                    fontSize: '11px',
                    fontWeight: '500',
                    color: '#6b7280',
                    textTransform: 'uppercase',
                    letterSpacing: '0.05em',
                    borderBottom: '1px solid #e5e7eb'
                  }}>
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody style={{ background: '#ffffff' }}>
                {tickets.length === 0 ? (
                  <tr>
                    <td colSpan="8" style={{
                      padding: '32px 12px',
                      textAlign: 'center',
                      color: '#6b7280',
                      fontSize: '14px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: '6px'
                    }}>
                      <FaTicketAlt size={20} /> No tickets found
                    </td>
                  </tr>
                ) : (
                  tickets.map((ticket) => (
                    <tr 
                      key={ticket.id} 
                      style={{
                        borderBottom: '1px solid #e5e7eb',
                        transition: 'background 0.15s'
                      }}
                      onMouseEnter={(e) => e.currentTarget.style.background = '#f9fafb'}
                      onMouseLeave={(e) => e.currentTarget.style.background = '#ffffff'}
                    >
                      <td style={{
                        padding: '10px 12px',
                        whiteSpace: 'nowrap',
                        fontSize: '13px',
                        fontWeight: '500',
                        color: '#111827'
                      }}>
                        #{ticket.id}
                      </td>
                      <td style={{ padding: '10px 12px' }}>
                        <div style={{
                          fontSize: '13px',
                          fontWeight: '500',
                          color: '#111827',
                          marginBottom: '2px'
                        }}>
                          {ticket.title}
                        </div>
                        <div style={{
                          fontSize: '12px',
                          color: '#6b7280',
                          maxWidth: '180px',
                          overflow: 'hidden',
                          textOverflow: 'ellipsis',
                          whiteSpace: 'nowrap'
                        }}>
                          {ticket.description}
                        </div>
                      </td>
                      <td style={{
                        padding: '10px 12px',
                        whiteSpace: 'nowrap',
                        fontSize: '13px',
                        color: '#111827'
                      }}>
                        {ticket.reporterName}
                      </td>
                      <td style={{
                        padding: '10px 12px',
                        whiteSpace: 'nowrap',
                        fontSize: '13px',
                        color: '#111827'
                      }}>
                        {ticket.category}
                      </td>
                      <td style={{
                        padding: '10px 12px',
                        whiteSpace: 'nowrap'
                      }}>
                        <span
                          style={{
                            display: 'inline-flex',
                            padding: '3px 6px',
                            fontSize: '11px',
                            fontWeight: '600',
                            borderRadius: '999px',
                            background: PRIORITY_STYLES[ticket.priority]?.background || "#f3f4f6",
                            color: PRIORITY_STYLES[ticket.priority]?.color || "#374151"
                          }}
                        >
                          {ticket.priority}
                        </span>
                      </td>
                      <td style={{
                        padding: '10px 12px',
                        whiteSpace: 'nowrap'
                      }}>
                        <span
                          style={{
                            display: 'inline-flex',
                            padding: '3px 6px',
                            fontSize: '11px',
                            fontWeight: '600',
                            borderRadius: '999px',
                            background: STATUS_STYLES[ticket.status]?.background || "#f3f4f6",
                            color: STATUS_STYLES[ticket.status]?.color || "#374151"
                          }}
                        >
                          {ticket.status.replace("_", " ")}
                        </span>
                      </td>
                      <td style={{
                        padding: '10px 12px',
                        whiteSpace: 'nowrap',
                        fontSize: '12px',
                        color: '#6b7280'
                      }}>
                        {formatDate(ticket.createdAt)}
                      </td>
                      <td style={{
                        padding: '10px 12px',
                        whiteSpace: 'nowrap',
                        fontSize: '13px',
                        fontWeight: '500'
                      }}>
                        <div style={{ display: 'flex', gap: '6px' }}>
                          <button
                            onClick={() => openUpdateModal(ticket)}
                            style={{
                              padding: '4px 8px',
                              borderRadius: '4px',
                              border: '1px solid #dbeafe',
                              background: '#eff6ff',
                              color: '#2563eb',
                              cursor: 'pointer',
                              fontSize: '11px',
                              display: 'inline-flex',
                              alignItems: 'center',
                              gap: '3px',
                              transition: 'all 0.15s'
                            }}
                            onMouseEnter={(e) => {
                              e.currentTarget.style.background = '#dbeafe';
                              e.currentTarget.style.borderColor = '#93c5fd';
                            }}
                            onMouseLeave={(e) => {
                              e.currentTarget.style.background = '#eff6ff';
                              e.currentTarget.style.borderColor = '#dbeafe';
                            }}
                          >
                            <FaEdit size={10} /> Update
                          </button>
                          <button
                            onClick={() => openCommentModal(ticket)}
                            style={{
                              padding: '4px 8px',
                              borderRadius: '4px',
                              border: '1px solid #d1fae5',
                              background: '#ecfdf5',
                              color: '#059669',
                              cursor: 'pointer',
                              fontSize: '11px',
                              display: 'inline-flex',
                              alignItems: 'center',
                              gap: '3px',
                              transition: 'all 0.15s'
                            }}
                            onMouseEnter={(e) => {
                              e.currentTarget.style.background = '#d1fae5';
                              e.currentTarget.style.borderColor = '#6ee7b7';
                            }}
                            onMouseLeave={(e) => {
                              e.currentTarget.style.background = '#ecfdf5';
                              e.currentTarget.style.borderColor = '#d1fae5';
                            }}
                          >
                            <FaComment size={10} /> Comment
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Update Ticket Modal */}
      {showUpdateModal && selectedTicket && (
        <>
          {/* Backdrop */}
          <div
            onClick={() => {
              setShowUpdateModal(false);
              setSelectedTicket(null);
              setUpdateStatus("");
              setTechnicianName("");
            }}
            style={{
              position: 'fixed',
              inset: 0,
              background: 'rgba(0,0,0,0.5)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              zIndex: 50
            }}
          />
          
          {/* Modal */}
          <div style={{
            position: 'fixed',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            background: '#ffffff',
            borderRadius: '6px',
            padding: '16px',
            width: '100%',
            maxWidth: '380px',
            zIndex: 60,
            boxShadow: '0 10px 25px rgba(0,0,0,0.1)'
          }}>
            <h2 style={{ fontSize: '16px', fontWeight: '600', marginBottom: '12px', display: 'flex', alignItems: 'center', gap: '6px' }}>
              <FaEdit size={16} /> Update Ticket Status
            </h2>
            
            <div style={{ marginBottom: '12px' }}>
              <p style={{ fontSize: '13px', color: '#6b7280', marginBottom: '6px' }}>
                Ticket: <span style={{ fontWeight: '500' }}>#{selectedTicket.id} - {selectedTicket.title}</span>
              </p>
              <p style={{ fontSize: '13px', color: '#6b7280', marginBottom: '12px' }}>
                Current Status: <span style={{ fontWeight: '500' }}>{selectedTicket.status.replace("_", " ")}</span>
              </p>
            </div>

            <div style={{ marginBottom: '12px' }}>
              <label style={{ display: 'block', fontSize: '13px', fontWeight: '500', color: '#374151', marginBottom: '6px' }}>
                New Status
              </label>
              <select
                value={updateStatus}
                onChange={(e) => setUpdateStatus(e.target.value)}
                style={{
                  width: '100%',
                  padding: '8px',
                  border: '1px solid #d1d5db',
                  borderRadius: '6px',
                  fontSize: '13px',
                  outline: 'none',
                  transition: 'border-color 0.15s'
                }}
                onFocus={(e) => e.currentTarget.style.borderColor = '#2563eb'}
                onBlur={(e) => e.currentTarget.style.borderColor = '#d1d5db'}
              >
                <option value="">Select status</option>
                <option value="OPEN">Open</option>
                <option value="IN_PROGRESS">In Progress</option>
                <option value="RESOLVED">Resolved</option>
                <option value="CLOSED">Closed</option>
                <option value="REJECTED">Rejected</option>
              </select>
            </div>

            <div style={{ marginBottom: '12px' }}>
             <label style={{ display: 'block', fontSize: '13px', fontWeight: '500', color: '#374151', marginBottom: '6px' }}>
                 Assign Technician
             </label>
             <input
               value={technicianName}
               onChange={(e) => setTechnicianName(e.target.value)}
               placeholder="Enter technician name"
               style={{
                 width: '100%',
                 padding: '8px',
                 border: '1px solid #d1d5db',
                 borderRadius: '6px',
                 fontSize: '13px',
                 outline: 'none',}}
              />
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '8px' }}>
              <button
                onClick={() => {
                  setShowUpdateModal(false);
                  setSelectedTicket(null);
                  setUpdateStatus("");
                }}
                style={{
                  padding: '6px 12px',
                  color: '#374151',
                  background: '#f3f4f6',
                  borderRadius: '6px',
                  border: 'none',
                  cursor: 'pointer',
                  fontSize: '13px',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '4px',
                  transition: 'background 0.15s'
                }}
                onMouseEnter={(e) => e.currentTarget.style.background = '#e5e7eb'}
                onMouseLeave={(e) => e.currentTarget.style.background = '#f3f4f6'}
              >
                <FaTimes size={12} /> Cancel
              </button>
              <button
                onClick={handleUpdateTicket}
                disabled={!updateStatus || isSubmitting}
                style={{
                  padding: '6px 12px',
                  background: '#2563eb',
                  color: '#ffffff',
                  borderRadius: '6px',
                  border: 'none',
                  cursor: 'pointer',
                  fontSize: '13px',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '4px',
                  transition: 'background 0.15s',
                  opacity: (!updateStatus || isSubmitting) ? 0.5 : 1
                }}
                onMouseEnter={(e) => {
                  if (updateStatus && !isSubmitting) {
                    e.currentTarget.style.background = '#1d4ed8';
                  }
                }}
                onMouseLeave={(e) => {
                  if (updateStatus && !isSubmitting) {
                    e.currentTarget.style.background = '#2563eb';
                  }
                }}
              >
                {isSubmitting ? <><FaSpinner size={12} style={{ animation: 'spin 1s linear infinite' }} /> Updating...</> : <><FaCheck size={12} /> Update</>}
              </button>
            </div>
          </div>
        </>
      )}

      {/* Add Comment Modal */}
      {showCommentModal && selectedTicket && (
        <>
          {/* Backdrop */}
          <div
            onClick={() => {
              setShowCommentModal(false);
              setSelectedTicket(null);
              setComment("");
            }}
            style={{
              position: 'fixed',
              inset: 0,
              background: 'rgba(0,0,0,0.5)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              zIndex: 50
            }}
          />
          
          {/* Modal */}
          <div style={{
            position: 'fixed',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            background: '#ffffff',
            borderRadius: '6px',
            padding: '16px',
            width: '100%',
            maxWidth: '380px',
            zIndex: 60,
            boxShadow: '0 10px 25px rgba(0,0,0,0.1)'
          }}>
            <h2 style={{ fontSize: '16px', fontWeight: '600', marginBottom: '12px', display: 'flex', alignItems: 'center', gap: '6px' }}>
              <FaComment size={16} /> Add Comment
            </h2>
            
            <div style={{ marginBottom: '12px' }}>
              <p style={{ fontSize: '13px', color: '#6b7280', marginBottom: '12px' }}>
                Ticket: <span style={{ fontWeight: '500' }}>#{selectedTicket.id} - {selectedTicket.title}</span>
              </p>
            </div>

            <div style={{ marginBottom: '12px' }}>
              <label style={{ display: 'block', fontSize: '13px', fontWeight: '500', color: '#374151', marginBottom: '6px' }}>
                Comment
              </label>
              <textarea
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                rows={3}
                style={{
                  width: '100%',
                  padding: '8px',
                  border: '1px solid #d1d5db',
                  borderRadius: '6px',
                  fontSize: '13px',
                  outline: 'none',
                  transition: 'border-color 0.15s',
                  resize: 'vertical',
                  minHeight: '80px'
                }}
                onFocus={(e) => e.currentTarget.style.borderColor = '#2563eb'}
                onBlur={(e) => e.currentTarget.style.borderColor = '#d1d5db'}
                placeholder="Enter your comment..."
              />
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '8px' }}>
              <button
                onClick={() => {
                  setShowCommentModal(false);
                  setSelectedTicket(null);
                  setComment("");
                }}
                style={{
                  padding: '6px 12px',
                  color: '#374151',
                  background: '#f3f4f6',
                  borderRadius: '6px',
                  border: 'none',
                  cursor: 'pointer',
                  fontSize: '13px',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '4px',
                  transition: 'background 0.15s'
                }}
                onMouseEnter={(e) => e.currentTarget.style.background = '#e5e7eb'}
                onMouseLeave={(e) => e.currentTarget.style.background = '#f3f4f6'}
              >
                <FaTimes size={12} /> Cancel
              </button>
              <button
                onClick={handleAddComment}
                disabled={!comment.trim() || isSubmitting}
                style={{
                  padding: '6px 12px',
                  background: '#059669',
                  color: '#ffffff',
                  borderRadius: '6px',
                  border: 'none',
                  cursor: 'pointer',
                  fontSize: '13px',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '4px',
                  transition: 'background 0.15s',
                  opacity: (!comment.trim() || isSubmitting) ? 0.5 : 1
                }}
                onMouseEnter={(e) => {
                  if (comment.trim() && !isSubmitting) {
                    e.currentTarget.style.background = '#047857';
                  }
                }}
                onMouseLeave={(e) => {
                  if (comment.trim() && !isSubmitting) {
                    e.currentTarget.style.background = '#059669';
                  }
                }}
              >
                {isSubmitting ? <><FaSpinner size={12} style={{ animation: 'spin 1s linear infinite' }} /> Adding...</> : <><FaCheck size={12} /> Add Comment</>}
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
