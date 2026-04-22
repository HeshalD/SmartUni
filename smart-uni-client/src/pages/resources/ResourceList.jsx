import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import ResourceCard from '../../components/ResourceCard'
import { resourceApi } from '../../api/resourceApi'
import { useAuth } from '../../context/AuthContext'

const PAGE_SIZE = 6

const initialFilters = {
  category: '',
  available: '',
  status: '',
  minCapacity: '',
  location: '',
}

function ResourceList() {
  const { isAdmin } = useAuth()
  const [resources, setResources] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [filters, setFilters] = useState(initialFilters)
  const [page, setPage] = useState(1)

  const fetchResources = async () => {
    try {
      setLoading(true)
      setError('')

      const params = {}
      if (filters.category.trim()) {
        params.category = filters.category.trim()
      }
      if (filters.available !== '') {
        params.available = filters.available === 'true'
      }
      if (filters.status) {
        params.status = filters.status
      }
      if (filters.minCapacity.trim()) {
        params.minCapacity = Number(filters.minCapacity)
      }
      if (filters.location.trim()) {
        params.location = filters.location.trim()
      }

      const response = await resourceApi.getAll(params)
      setResources(response.data)
      setPage(1)
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to load resources')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchResources()
    // Initial load only; subsequent loads are explicit via Apply/Clear actions.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const onFilterSubmit = (event) => {
    event.preventDefault()
    fetchResources()
  }

  const onFilterChange = (event) => {
    const { name, value } = event.target
    setFilters((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  const clearFilters = () => {
    setFilters(initialFilters)
    setPage(1)
  }

  const activeFilters = [
    filters.category && `Category: ${filters.category}`,
    filters.available && `Availability: ${filters.available === 'true' ? 'Available' : 'Unavailable'}`,
    filters.status && `Status: ${filters.status === 'ACTIVE' ? 'Active' : 'Out of service'}`,
    filters.minCapacity && `Capacity >= ${filters.minCapacity}`,
    filters.location && `Location: ${filters.location}`,
  ].filter(Boolean)

  const totalPages = Math.max(1, Math.ceil(resources.length / PAGE_SIZE))
  const paginatedResources = resources.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE)

  const goPrevious = () => setPage((prev) => Math.max(1, prev - 1))
  const goNext = () => setPage((prev) => Math.min(totalPages, prev + 1))

  return (
    <section style={{ maxWidth: '1280px', margin: '0 auto', padding: '24px' }}>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '16px', marginBottom: '28px' }}>
        <div>
          <h1 style={{ fontSize: '24px', fontWeight: 700, color: '#111827', margin: 0 }}>Facilities and Assets</h1>
          <p style={{ fontSize: '14px', color: '#6b7280', margin: '4px 0 0 0' }}>Manage campus spaces with full operational details.</p>
        </div>
        {isAdmin && (
          <Link
            to="/resources/new"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '8px',
              padding: '10px 18px',
              borderRadius: '10px',
              background: '#4f46e5',
              color: '#fff',
              fontSize: '14px',
              fontWeight: 600,
              textDecoration: 'none',
              transition: 'all 0.15s',
              border: 'none',
              cursor: 'pointer',
            }}
            onMouseEnter={(e) => { e.currentTarget.style.background = '#4338ca'; }}
            onMouseLeave={(e) => { e.currentTarget.style.background = '#4f46e5'; }}
          >
            Add Resource
          </Link>
        )}
      </div>

      {/* Filters */}
      <form
        onSubmit={onFilterSubmit}
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(170px, 1fr))',
          gap: '12px',
          alignItems: 'end',
          marginBottom: '20px',
          padding: '18px',
          border: '1px solid #f3f4f6',
          borderRadius: '14px',
          background: '#fff',
          boxShadow: '0 1px 3px rgba(0,0,0,0.03)',
        }}
      >
        <input
          name="category"
          type="text"
          placeholder="Filter by category"
          value={filters.category}
          onChange={onFilterChange}
          style={{ padding: '10px 12px', borderRadius: '10px', border: '1px solid #e5e7eb', fontSize: '13px', outline: 'none', background: '#fff', color: '#374151' }}
        />
        <input
          name="location"
          type="text"
          placeholder="Filter by location"
          value={filters.location}
          onChange={onFilterChange}
          style={{ padding: '10px 12px', borderRadius: '10px', border: '1px solid #e5e7eb', fontSize: '13px', outline: 'none', background: '#fff', color: '#374151' }}
        />
        <input
          name="minCapacity"
          type="number"
          min="1"
          placeholder="Minimum capacity"
          value={filters.minCapacity}
          onChange={onFilterChange}
          style={{ padding: '10px 12px', borderRadius: '10px', border: '1px solid #e5e7eb', fontSize: '13px', outline: 'none', background: '#fff', color: '#374151' }}
        />
        <select
          name="status"
          value={filters.status}
          onChange={onFilterChange}
          style={{ padding: '10px 12px', borderRadius: '10px', border: '1px solid #e5e7eb', fontSize: '13px', outline: 'none', background: '#fff', color: '#374151' }}
        >
          <option value="">All status</option>
          <option value="ACTIVE">Active</option>
          <option value="OUT_OF_SERVICE">Out of service</option>
        </select>
        <select
          name="available"
          value={filters.available}
          onChange={onFilterChange}
          style={{ padding: '10px 12px', borderRadius: '10px', border: '1px solid #e5e7eb', fontSize: '13px', outline: 'none', background: '#fff', color: '#374151' }}
        >
          <option value="">All availability</option>
          <option value="true">Available</option>
          <option value="false">Unavailable</option>
        </select>
        <div style={{ display: 'flex', gap: '10px' }}>
          <button
            type="submit"
            style={{
              padding: '10px 18px',
              borderRadius: '10px',
              background: '#4f46e5',
              color: '#fff',
              fontSize: '13px',
              fontWeight: 600,
              border: 'none',
              cursor: 'pointer',
              transition: 'background 0.15s',
            }}
            onMouseEnter={(e) => { e.currentTarget.style.background = '#4338ca'; }}
            onMouseLeave={(e) => { e.currentTarget.style.background = '#4f46e5'; }}
          >
            Apply
          </button>
          <button
            type="button"
            onClick={clearFilters}
            style={{
              padding: '10px 18px',
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
            Clear
          </button>
        </div>
      </form>

      {/* Active chips */}
      {activeFilters.length > 0 && (
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', marginBottom: '16px' }}>
          {activeFilters.map((label) => (
            <span
              key={label}
              style={{
                padding: '5px 12px',
                borderRadius: '999px',
                fontSize: '12px',
                fontWeight: 500,
                background: '#eef2ff',
                color: '#4338ca',
                border: '1px solid #e0e7ff',
              }}
            >
              {label}
            </span>
          ))}
        </div>
      )}

      {/* Skeleton loading */}
      {loading && (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: '20px' }}>
          {Array.from({ length: 6 }).map((_, index) => (
            <article
              key={index}
              style={{
                height: '180px',
                borderRadius: '14px',
                background: '#f3f4f6',
                animation: 'pulse 2s infinite',
              }}
            />
          ))}
        </div>
      )}
      {error && <p style={{ color: '#ef4444', fontSize: '14px', padding: '16px', background: '#fef2f2', borderRadius: '10px', border: '1px solid #fee2e2' }}>{error}</p>}

      {/* Empty state */}
      {!loading && !error && resources.length === 0 && (
        <div style={{ textAlign: 'center', padding: '60px 20px', color: '#6b7280' }}>
          <h3 style={{ fontSize: '18px', fontWeight: 600, color: '#374151', marginBottom: '8px' }}>No resources found</h3>
          <p style={{ fontSize: '14px', color: '#9ca3af', margin: 0 }}>Try adjusting your filters or add a new resource if you are an admin.</p>
        </div>
      )}

      {/* Results */}
      {!loading && !error && resources.length > 0 && (
        <>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '13px', color: '#6b7280', marginBottom: '16px', padding: '0 4px' }}>
            <span>{resources.length} resources found</span>
            <span>Page {page} of {totalPages}</span>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: '20px', marginBottom: '24px' }}>
            {paginatedResources.map((resource) => (
              <ResourceCard key={resource.id} resource={resource} canManage={isAdmin} />
            ))}
          </div>
          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px' }}>
            <button
              type="button"
              onClick={goPrevious}
              disabled={page === 1}
              style={{
                padding: '8px 16px',
                borderRadius: '10px',
                background: page === 1 ? '#f9fafb' : '#f3f4f6',
                color: page === 1 ? '#d1d5db' : '#374151',
                fontSize: '13px',
                fontWeight: 500,
                border: '1px solid #e5e7eb',
                cursor: page === 1 ? 'not-allowed' : 'pointer',
                transition: 'background 0.15s',
              }}
              onMouseEnter={(e) => { if (page !== 1) e.currentTarget.style.background = '#e5e7eb'; }}
              onMouseLeave={(e) => { if (page !== 1) e.currentTarget.style.background = '#f3f4f6'; }}
            >
              Previous
            </button>
            <button
              type="button"
              onClick={goNext}
              disabled={page === totalPages}
              style={{
                padding: '8px 16px',
                borderRadius: '10px',
                background: page === totalPages ? '#f9fafb' : '#f3f4f6',
                color: page === totalPages ? '#d1d5db' : '#374151',
                fontSize: '13px',
                fontWeight: 500,
                border: '1px solid #e5e7eb',
                cursor: page === totalPages ? 'not-allowed' : 'pointer',
                transition: 'background 0.15s',
              }}
              onMouseEnter={(e) => { if (page !== totalPages) e.currentTarget.style.background = '#e5e7eb'; }}
              onMouseLeave={(e) => { if (page !== totalPages) e.currentTarget.style.background = '#f3f4f6'; }}
            >
              Next
            </button>
          </div>
        </>
      )}
    </section>
  )
}

export default ResourceList
