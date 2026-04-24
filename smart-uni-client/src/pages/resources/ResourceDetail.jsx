import { useEffect, useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { resourceApi } from '../../api/resourceApi'
import { useAuth } from '../../context/AuthContext'

function formatTimestamp(timestamp) {
  if (!timestamp) return 'N/A'
  const date = new Date(timestamp)
  if (Number.isNaN(date.getTime())) return 'N/A'
  return date.toLocaleString()
}

function ResourceDetail() {
  const { isAdmin } = useAuth()
  const { id } = useParams()
  const navigate = useNavigate()
  const [resource, setResource] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [confirmOpen, setConfirmOpen] = useState(false)

  useEffect(() => {
    const fetchResource = async () => {
      try {
        setLoading(true)
        const response = await resourceApi.getById(id)
        setResource(response.data)
      } catch (err) {
        setError(err.response?.data?.error || 'Failed to load resource')
      } finally {
        setLoading(false)
      }
    }

    fetchResource()
  }, [id])

  const handleDelete = async () => {
    try {
      await resourceApi.remove(id)
      navigate('/resources')
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to delete resource')
    } finally {
      setConfirmOpen(false)
    }
  }

  if (loading) {
    return (
      <div style={{ maxWidth: '1280px', margin: '0 auto', padding: '24px', color: '#6b7280', fontSize: '14px' }}>
        Loading resource...
      </div>
    )
  }

  if (error) {
    return (
      <div style={{ maxWidth: '1280px', margin: '0 auto', padding: '24px', color: '#ef4444', fontSize: '14px', background: '#fef2f2', borderRadius: '10px', border: '1px solid #fee2e2' }}>
        {error}
      </div>
    )
  }

  if (!resource) {
    return (
      <div style={{ maxWidth: '1280px', margin: '0 auto', padding: '24px', color: '#6b7280', fontSize: '14px' }}>
        Resource not found.
      </div>
    )
  }

  const pillBase = { display: 'inline-flex', alignItems: 'center', padding: '4px 12px', borderRadius: '999px', fontSize: '12px', fontWeight: 600 }
  const activePill = { ...pillBase, background: '#d1fae5', color: '#065f46', border: '1px solid #a7f3d0' }
  const oosPill = { ...pillBase, background: '#fef2f2', color: '#991b1b', border: '1px solid #fecaca' }
  const availPill = { ...pillBase, background: '#e0e7ff', color: '#3730a3', border: '1px solid #c7d2fe' }
  const unavailPill = { ...pillBase, background: '#fef3c7', color: '#92400e', border: '1px solid #fde68a' }

  return (
    <section style={{ maxWidth: '1280px', margin: '0 auto', padding: '24px' }}>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '16px', marginBottom: '28px' }}>
        <div>
          <p style={{ fontSize: '12px', color: '#9ca3af', margin: '0 0 6px 0', fontWeight: 500 }}>Resources / {resource.name}</p>
          <h1 style={{ fontSize: '24px', fontWeight: 700, color: '#111827', margin: 0 }}>{resource.name}</h1>
        </div>
        <div style={{ display: 'flex', gap: '10px' }}>
          {isAdmin && (
            <>
              <Link
                to={`/resources/${resource.id}/edit`}
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  padding: '9px 16px',
                  borderRadius: '10px',
                  background: '#f3f4f6',
                  color: '#374151',
                  fontSize: '13px',
                  fontWeight: 600,
                  textDecoration: 'none',
                  border: '1px solid #e5e7eb',
                  transition: 'background 0.15s',
                }}
                onMouseEnter={(e) => { e.currentTarget.style.background = '#e5e7eb'; }}
                onMouseLeave={(e) => { e.currentTarget.style.background = '#f3f4f6'; }}
              >
                Edit
              </Link>
              <button
                type="button"
                onClick={() => setConfirmOpen(true)}
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  padding: '9px 16px',
                  borderRadius: '10px',
                  background: '#ef4444',
                  color: '#fff',
                  fontSize: '13px',
                  fontWeight: 600,
                  border: 'none',
                  cursor: 'pointer',
                  transition: 'background 0.15s',
                }}
                onMouseEnter={(e) => { e.currentTarget.style.background = '#dc2626'; }}
                onMouseLeave={(e) => { e.currentTarget.style.background = '#ef4444'; }}
              >
                Delete
              </button>
            </>
          )}
        </div>
      </div>

      {/* Main card */}
      <div style={{ background: '#ffffff', borderRadius: '16px', border: '1px solid #f3f4f6', boxShadow: '0 2px 8px rgba(0,0,0,0.04)', overflow: 'hidden', marginBottom: '24px' }}>
        {/* Hero */}
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '24px', padding: '24px', borderBottom: '1px solid #f9fafb' }}>
          {resource.imageUrl ? (
            <img
              src={resource.imageUrl}
              alt={resource.name}
              style={{ width: '220px', height: '160px', borderRadius: '12px', objectFit: 'cover', flexShrink: 0 }}
            />
          ) : (
            <div style={{ width: '220px', height: '160px', borderRadius: '12px', background: '#f3f4f6', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#9ca3af', fontSize: '13px', fontWeight: 500, flexShrink: 0 }}>
              No image
            </div>
          )}
          <div style={{ flex: 1, minWidth: '200px', display: 'flex', flexDirection: 'column', gap: '12px', justifyContent: 'center' }}>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', alignItems: 'center' }}>
              <span style={(resource.status || 'ACTIVE') === 'ACTIVE' ? activePill : oosPill}>
                {(resource.status || 'ACTIVE') === 'ACTIVE' ? 'Active' : 'Out of service'}
              </span>
              <span style={resource.available ? availPill : unavailPill}>
                {resource.available ? 'Available' : 'Unavailable'}
              </span>
            </div>
            <p style={{ color: '#4b5563', fontSize: '14px', lineHeight: 1.6, margin: 0 }}>
              {resource.description || 'No description provided.'}
            </p>
          </div>
        </div>

        {/* Detail grid */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px', padding: '24px', borderBottom: '1px solid #f9fafb' }}>
          <div>
            <p style={{ margin: 0, fontSize: '13px', color: '#9ca3af', fontWeight: 500 }}>Category</p>
            <p style={{ margin: '4px 0 0 0', fontSize: '14px', fontWeight: 600, color: '#111827' }}>{resource.category}</p>
          </div>
          <div>
            <p style={{ margin: 0, fontSize: '13px', color: '#9ca3af', fontWeight: 500 }}>Location</p>
            <p style={{ margin: '4px 0 0 0', fontSize: '14px', fontWeight: 600, color: '#111827' }}>{resource.location}</p>
          </div>
          <div>
            <p style={{ margin: 0, fontSize: '13px', color: '#9ca3af', fontWeight: 500 }}>Capacity</p>
            <p style={{ margin: '4px 0 0 0', fontSize: '14px', fontWeight: 600, color: '#111827' }}>{resource.capacity} seats</p>
          </div>
          <div>
            <p style={{ margin: 0, fontSize: '13px', color: '#9ca3af', fontWeight: 500 }}>Contact</p>
            <p style={{ margin: '4px 0 0 0', fontSize: '14px', fontWeight: 600, color: '#111827' }}>{resource.contactPerson || 'N/A'}</p>
          </div>
        </div>

        {/* Amenities */}
        <div style={{ padding: '24px', borderBottom: '1px solid #f9fafb' }}>
          <h3 style={{ fontSize: '14px', fontWeight: 700, color: '#111827', margin: '0 0 12px 0' }}>Amenities</h3>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
            {resource.amenities?.length ? (
              resource.amenities.map((amenity) => (
                <span key={amenity} style={{ display: 'inline-flex', alignItems: 'center', padding: '5px 12px', borderRadius: '999px', fontSize: '12px', fontWeight: 500, background: '#eef2ff', color: '#4338ca', border: '1px solid #e0e7ff' }}>
                  {amenity}
                </span>
              ))
            ) : (
              <span style={{ fontSize: '13px', color: '#9ca3af' }}>No amenities listed.</span>
            )}
          </div>
        </div>

        {/* Availability Windows */}
        <div style={{ padding: '24px', borderBottom: '1px solid #f9fafb' }}>
          <h3 style={{ fontSize: '14px', fontWeight: 700, color: '#111827', margin: '0 0 12px 0' }}>Availability Windows</h3>
          {resource.availabilityWindows?.length ? (
            <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '10px' }}>
              {resource.availabilityWindows.map((window, index) => (
                <li key={`${window.dayOfWeek}-${window.startTime}-${index}`} style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '14px', color: '#374151', padding: '10px 14px', background: '#f9fafb', borderRadius: '10px' }}>
                  <span style={{ fontWeight: 700, color: '#111827', minWidth: '100px' }}>{window.dayOfWeek}</span>
                  <span style={{ color: '#9ca3af' }}>—</span>
                  <span>{window.startTime} - {window.endTime}</span>
                </li>
              ))}
            </ul>
          ) : (
            <p style={{ fontSize: '13px', color: '#9ca3af', margin: 0 }}>No availability windows configured.</p>
          )}
        </div>

        {/* Footer meta */}
        <div style={{ padding: '16px 24px', display: 'flex', flexWrap: 'wrap', gap: '16px', fontSize: '12px', color: '#9ca3af', background: '#fafafa' }}>
          <span>Created: {formatTimestamp(resource.createdAt)}</span>
          <span>Last updated: {formatTimestamp(resource.updatedAt)}</span>
        </div>
      </div>

      {/* Back link */}
      <Link
        to="/resources"
        style={{
          display: 'inline-flex',
          alignItems: 'center',
          fontSize: '14px',
          fontWeight: 500,
          color: '#4f46e5',
          textDecoration: 'none',
          transition: 'color 0.15s',
        }}
        onMouseEnter={(e) => { e.currentTarget.style.color = '#3730a3'; }}
        onMouseLeave={(e) => { e.currentTarget.style.color = '#4f46e5'; }}
      >
        Back to list
      </Link>

      {/* Delete confirmation modal */}
      {confirmOpen && (
        <div
          role="dialog"
          aria-modal="true"
          style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.45)', zIndex: 300, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px' }}
          onClick={() => setConfirmOpen(false)}
        >
          <div
            style={{ background: '#ffffff', borderRadius: '16px', boxShadow: '0 20px 48px -8px rgba(0,0,0,0.2)', width: '100%', maxWidth: '420px', padding: '24px' }}
            onClick={(e) => e.stopPropagation()}
          >
            <h3 style={{ fontSize: '18px', fontWeight: 700, color: '#111827', margin: '0 0 8px 0' }}>Delete resource</h3>
            <p style={{ fontSize: '14px', color: '#4b5563', lineHeight: 1.6, margin: '0 0 24px 0' }}>
              This will permanently delete <strong>{resource.name}</strong>. This action cannot be undone.
            </p>
            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px' }}>
              <button
                type="button"
                onClick={() => setConfirmOpen(false)}
                style={{
                  padding: '9px 16px',
                  borderRadius: '10px',
                  background: '#f3f4f6',
                  color: '#374151',
                  fontSize: '13px',
                  fontWeight: 600,
                  border: '1px solid #e5e7eb',
                  cursor: 'pointer',
                  transition: 'background 0.15s',
                }}
                onMouseEnter={(e) => { e.currentTarget.style.background = '#e5e7eb'; }}
                onMouseLeave={(e) => { e.currentTarget.style.background = '#f3f4f6'; }}
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleDelete}
                style={{
                  padding: '9px 16px',
                  borderRadius: '10px',
                  background: '#ef4444',
                  color: '#fff',
                  fontSize: '13px',
                  fontWeight: 600,
                  border: 'none',
                  cursor: 'pointer',
                  transition: 'background 0.15s',
                }}
                onMouseEnter={(e) => { e.currentTarget.style.background = '#dc2626'; }}
                onMouseLeave={(e) => { e.currentTarget.style.background = '#ef4444'; }}
              >
                Delete resource
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  )
}

export default ResourceDetail
