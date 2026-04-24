import { Link } from 'react-router-dom'

function ResourceCard({ resource, canManage }) {
  const operationalStatus = resource.status || 'ACTIVE'

  const pillBase = {
    display: 'inline-flex',
    alignItems: 'center',
    padding: '3px 10px',
    borderRadius: '999px',
    fontSize: '11px',
    fontWeight: 600,
  }

  const activePill = { ...pillBase, background: '#d1fae5', color: '#065f46', border: '1px solid #a7f3d0' }
  const oosPill = { ...pillBase, background: '#fef2f2', color: '#991b1b', border: '1px solid #fecaca' }
  const categoryPill = { ...pillBase, background: '#eef2ff', color: '#4338ca', border: '1px solid #e0e7ff' }

  const availableBadge = {
    display: 'inline-flex',
    alignItems: 'center',
    padding: '2px 8px',
    borderRadius: '6px',
    fontSize: '11px',
    fontWeight: 600,
    background: resource.available ? '#d1fae5' : '#fef2f2',
    color: resource.available ? '#065f46' : '#991b1b',
  }

  return (
    <article
      style={{
        background: '#ffffff',
        borderRadius: '14px',
        border: '1px solid #f3f4f6',
        boxShadow: '0 1px 4px rgba(0,0,0,0.03)',
        overflow: 'hidden',
        display: 'flex',
        flexDirection: 'column',
        transition: 'box-shadow 0.2s, transform 0.2s',
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.boxShadow = '0 8px 24px rgba(0,0,0,0.08)'
        e.currentTarget.style.transform = 'translateY(-2px)'
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.boxShadow = '0 1px 4px rgba(0,0,0,0.03)'
        e.currentTarget.style.transform = 'translateY(0)'
      }}
    >
      {/* Cover */}
      <div style={{ width: '100%', height: '140px', background: '#f3f4f6', overflow: 'hidden', flexShrink: 0 }}>
        {resource.imageUrl ? (
          <img
            src={resource.imageUrl}
            alt={resource.name}
            style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
          />
        ) : (
          <div
            style={{
              width: '100%',
              height: '100%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#9ca3af',
              fontSize: '13px',
              fontWeight: 500,
            }}
          >
            No image
          </div>
        )}
      </div>

      {/* Content */}
      <div style={{ padding: '16px', display: 'flex', flexDirection: 'column', gap: '10px', flex: 1 }}>
        {/* Header */}
        <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: '8px' }}>
          <h3 style={{ fontSize: '15px', fontWeight: 700, color: '#111827', margin: 0, lineHeight: 1.3, flex: 1 }}>
            {resource.name}
          </h3>
          <span style={availableBadge}>
            {resource.available ? 'Available' : 'Unavailable'}
          </span>
        </div>

        {/* Status row */}
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px', alignItems: 'center' }}>
          <span style={operationalStatus === 'ACTIVE' ? activePill : oosPill}>
            {operationalStatus === 'ACTIVE' ? 'Active' : 'Out of service'}
          </span>
          <span style={categoryPill}>{resource.category}</span>
        </div>

        {/* Description */}
        <p style={{ fontSize: '13px', color: '#6b7280', lineHeight: 1.5, margin: 0, display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
          {resource.description || 'No description provided.'}
        </p>

        {/* Meta */}
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '12px', fontSize: '12px', color: '#9ca3af', marginTop: 'auto', paddingTop: '6px', borderTop: '1px solid #f9fafb' }}>
          <span>{resource.location}</span>
          <span>{resource.capacity} seats</span>
        </div>

        {/* Actions */}
        <div style={{ display: 'flex', gap: '8px', marginTop: '4px' }}>
          <Link
            to={`/resources/${resource.id}`}
            style={{
              flex: 1,
              textAlign: 'center',
              padding: '8px 12px',
              borderRadius: '8px',
              background: '#4f46e5',
              color: '#fff',
              fontSize: '13px',
              fontWeight: 600,
              textDecoration: 'none',
              transition: 'background 0.15s',
            }}
            onMouseEnter={(e) => { e.currentTarget.style.background = '#4338ca' }}
            onMouseLeave={(e) => { e.currentTarget.style.background = '#4f46e5' }}
          >
            View
          </Link>
          {canManage && (
            <Link
              to={`/resources/${resource.id}/edit`}
              style={{
                flex: 1,
                textAlign: 'center',
                padding: '8px 12px',
                borderRadius: '8px',
                background: '#f3f4f6',
                color: '#374151',
                fontSize: '13px',
                fontWeight: 600,
                textDecoration: 'none',
                border: '1px solid #e5e7eb',
                transition: 'background 0.15s',
              }}
              onMouseEnter={(e) => { e.currentTarget.style.background = '#e5e7eb' }}
              onMouseLeave={(e) => { e.currentTarget.style.background = '#f3f4f6' }}
            >
              Edit
            </Link>
          )}
        </div>
      </div>
    </article>
  )
}

export default ResourceCard
