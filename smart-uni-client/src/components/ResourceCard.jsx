import { Link } from 'react-router-dom'

function ResourceCard({ resource, canManage }) {
  const operationalStatus = resource.status || 'ACTIVE'

  return (
    <article className="resource-card resource-card--enhanced">
      <div className="resource-card__cover">
        {resource.imageUrl ? (
          <img src={resource.imageUrl} alt={resource.name} />
        ) : (
          <div className="resource-card__cover-fallback">No image</div>
        )}
      </div>

      <div className="resource-card__header">
        <h3 className="resource-card__title">{resource.name}</h3>
        <span className={`status ${resource.available ? 'available' : 'unavailable'}`}>
          {resource.available ? 'Available' : 'Unavailable'}
        </span>
      </div>

      <div className="resource-card__status-row">
        <span className={`resource-pill ${operationalStatus === 'ACTIVE' ? 'is-active' : 'is-oos'}`}>
          {operationalStatus === 'ACTIVE' ? 'Active' : 'Out of service'}
        </span>
        <span className="resource-pill">{resource.category}</span>
      </div>

      <p className="resource-card__description">{resource.description || 'No description provided.'}</p>

      <div className="resource-card__meta">
        <span>{resource.location}</span>
        <span>{resource.capacity} seats</span>
      </div>

      <div className="resource-card__actions">
        <Link to={`/resources/${resource.id}`}>View</Link>
        {canManage && <Link to={`/resources/${resource.id}/edit`}>Edit</Link>}
      </div>
    </article>
  )
}

export default ResourceCard
