import { useEffect, useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { resourceApi } from '../../api/resourceApi'

function ResourceDetail() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [resource, setResource] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

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
    const confirmed = window.confirm('Delete this resource?')
    if (!confirmed) {
      return
    }

    try {
      await resourceApi.remove(id)
      navigate('/resources')
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to delete resource')
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
    <section className="page">
      <div className="page-header">
        <h1>{resource.name}</h1>
        <div className="page-actions">
          <Link className="secondary-btn" to={`/resources/${resource.id}/edit`}>
            Edit
          </Link>
          <button className="danger-btn" type="button" onClick={handleDelete}>
            Delete
          </button>
        </div>
      </div>

      <div className="detail-grid">
        <p>
          <strong>Category:</strong> {resource.category}
        </p>
        <p>
          <strong>Location:</strong> {resource.location}
        </p>
        <p>
          <strong>Capacity:</strong> {resource.capacity}
        </p>
        <p>
          <strong>Status:</strong> {resource.available ? 'Available' : 'Unavailable'}
        </p>
        <p>
          <strong>Contact:</strong> {resource.contactPerson || 'N/A'}
        </p>
      </div>

      <p className="description">{resource.description || 'No description provided.'}</p>

      <p>
        <strong>Amenities:</strong> {resource.amenities?.length ? resource.amenities.join(', ') : 'None'}
      </p>

      <Link className="link-btn" to="/resources">
        Back to list
      </Link>
    </section>
  )
}

export default ResourceDetail
