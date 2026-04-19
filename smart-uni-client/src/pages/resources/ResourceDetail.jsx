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
    return <p className="page">Loading resource...</p>
  }

  if (error) {
    return <p className="page error">{error}</p>
  }

  if (!resource) {
    return <p className="page">Resource not found.</p>
  }

  return (
    <section className="page resources-page">
      <div className="page-header">
        <div>
          <p className="resources-breadcrumb">Resources / {resource.name}</p>
          <h1>{resource.name}</h1>
        </div>
        <div className="page-actions">
          {isAdmin && (
            <>
              <Link className="secondary-btn" to={`/resources/${resource.id}/edit`}>
                Edit
              </Link>
              <button className="danger-btn" type="button" onClick={() => setConfirmOpen(true)}>
                Delete
              </button>
            </>
          )}
        </div>
      </div>

      <div className="resource-detail-card">
        <div className="resource-detail__hero">
          {resource.imageUrl ? (
            <img src={resource.imageUrl} alt={resource.name} className="resource-detail__image" />
          ) : (
            <div className="resource-detail__image resource-detail__image--fallback">No image</div>
          )}
          <div className="resource-detail__hero-meta">
            <div className="resource-card__status-row">
              <span className={`resource-pill ${(resource.status || 'ACTIVE') === 'ACTIVE' ? 'is-active' : 'is-oos'}`}>
                {(resource.status || 'ACTIVE') === 'ACTIVE' ? 'Active' : 'Out of service'}
              </span>
              <span className={`status ${resource.available ? 'available' : 'unavailable'}`}>
                {resource.available ? 'Available' : 'Unavailable'}
              </span>
            </div>
            <p className="resource-detail__description">{resource.description || 'No description provided.'}</p>
          </div>
        </div>

        <div className="detail-grid">
          <p><strong>Category:</strong> {resource.category}</p>
          <p><strong>Location:</strong> {resource.location}</p>
          <p><strong>Capacity:</strong> {resource.capacity} seats</p>
          <p><strong>Contact:</strong> {resource.contactPerson || 'N/A'}</p>
        </div>

        <div className="resource-detail__section">
          <h3>Amenities</h3>
          <div className="resource-tag-list">
            {resource.amenities?.length
              ? resource.amenities.map((amenity) => <span key={amenity} className="resource-pill">{amenity}</span>)
              : <span className="resource-detail__muted">No amenities listed.</span>}
          </div>
        </div>

        <div className="resource-detail__section">
          <h3>Availability Windows</h3>
          {resource.availabilityWindows?.length ? (
            <ul className="resource-window-list">
              {resource.availabilityWindows.map((window, index) => (
                <li key={`${window.dayOfWeek}-${window.startTime}-${index}`}>
                  <strong>{window.dayOfWeek}</strong>: {window.startTime} - {window.endTime}
                </li>
              ))}
            </ul>
          ) : (
            <p className="resource-detail__muted">No availability windows configured.</p>
          )}
        </div>

        <div className="resource-detail__meta-footer">
          <span>Created: {formatTimestamp(resource.createdAt)}</span>
          <span>Last updated: {formatTimestamp(resource.updatedAt)}</span>
        </div>
      </div>

      <Link className="link-btn" to="/resources">
        Back to list
      </Link>

      {confirmOpen && (
        <div className="confirm-modal__overlay" role="dialog" aria-modal="true">
          <div className="confirm-modal">
            <h3>Delete resource</h3>
            <p>
              This will permanently delete <strong>{resource.name}</strong>. This action cannot be undone.
            </p>
            <div className="confirm-modal__actions">
              <button type="button" className="secondary-btn" onClick={() => setConfirmOpen(false)}>
                Cancel
              </button>
              <button type="button" className="danger-btn" onClick={handleDelete}>
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
