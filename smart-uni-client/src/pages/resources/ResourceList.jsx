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
    <section className="page resources-page">
      <div className="page-header">
        <div>
          <h1>Facilities and Assets</h1>
          <p className="resources-page__subtitle">Manage campus spaces with full operational details.</p>
        </div>
        {isAdmin && (
          <Link className="primary-btn" to="/resources/new">
            Add Resource
          </Link>
        )}
      </div>

      <form className="filter-form filter-form--resources" onSubmit={onFilterSubmit}>
        <input
          name="category"
          type="text"
          placeholder="Filter by category"
          value={filters.category}
          onChange={onFilterChange}
        />
        <input
          name="location"
          type="text"
          placeholder="Filter by location"
          value={filters.location}
          onChange={onFilterChange}
        />
        <input
          name="minCapacity"
          type="number"
          min="1"
          placeholder="Minimum capacity"
          value={filters.minCapacity}
          onChange={onFilterChange}
        />
        <select name="status" value={filters.status} onChange={onFilterChange}>
          <option value="">All status</option>
          <option value="ACTIVE">Active</option>
          <option value="OUT_OF_SERVICE">Out of service</option>
        </select>
        <select name="available" value={filters.available} onChange={onFilterChange}>
          <option value="">All availability</option>
          <option value="true">Available</option>
          <option value="false">Unavailable</option>
        </select>
        <div className="filter-form__actions">
          <button type="submit">Apply</button>
          <button type="button" className="secondary-btn" onClick={clearFilters}>
            Clear
          </button>
        </div>
      </form>

      {activeFilters.length > 0 && (
        <div className="active-filter-chips">
          {activeFilters.map((label) => (
            <span key={label} className="filter-chip">{label}</span>
          ))}
        </div>
      )}

      {loading && (
        <div className="resource-grid">
          {Array.from({ length: 6 }).map((_, index) => (
            <article key={index} className="resource-card resource-card--skeleton" />
          ))}
        </div>
      )}
      {error && <p className="error resources-feedback">{error}</p>}

      {!loading && !error && resources.length === 0 && (
        <div className="resources-feedback resources-feedback--empty">
          <h3>No resources found</h3>
          <p>Try adjusting your filters or add a new resource if you are an admin.</p>
        </div>
      )}

      {!loading && !error && resources.length > 0 && (
        <>
          <div className="resources-list-meta">
            <span>{resources.length} resources found</span>
            <span>Page {page} of {totalPages}</span>
          </div>
          <div className="resource-grid">
            {paginatedResources.map((resource) => (
              <ResourceCard key={resource.id} resource={resource} canManage={isAdmin} />
            ))}
          </div>
          <div className="pagination-controls">
            <button type="button" className="secondary-btn" onClick={goPrevious} disabled={page === 1}>
              Previous
            </button>
            <button type="button" className="secondary-btn" onClick={goNext} disabled={page === totalPages}>
              Next
            </button>
          </div>
        </>
      )}
    </section>
  )
}

export default ResourceList
