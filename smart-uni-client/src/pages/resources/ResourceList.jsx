import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import ResourceCard from '../../components/ResourceCard'
import { resourceApi } from '../../api/resourceApi'

function ResourceList() {
  const [resources, setResources] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [category, setCategory] = useState('')
  const [available, setAvailable] = useState('')

  const fetchResources = async () => {
    try {
      setLoading(true)
      setError('')

      const params = {}
      if (category.trim()) {
        params.category = category.trim()
      }
      if (available !== '') {
        params.available = available === 'true'
      }

      const response = await resourceApi.getAll(params)
      setResources(response.data)
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to load resources')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchResources()
  }, [])

  const onFilterSubmit = (event) => {
    event.preventDefault()
    fetchResources()
  }

  return (
    <section className="page">
      <div className="page-header">
        <h1>Facilities and Assets</h1>
        <Link className="primary-btn" to="/resources/new">
          Add Resource
        </Link>
      </div>

      <form className="filter-form" onSubmit={onFilterSubmit}>
        <input
          type="text"
          placeholder="Filter by category"
          value={category}
          onChange={(e) => setCategory(e.target.value)}
        />
        <select value={available} onChange={(e) => setAvailable(e.target.value)}>
          <option value="">All availability</option>
          <option value="true">Available</option>
          <option value="false">Unavailable</option>
        </select>
        <button type="submit">Apply</button>
      </form>

      {loading && <p>Loading resources...</p>}
      {error && <p className="error">{error}</p>}

      {!loading && !error && resources.length === 0 && <p>No resources found.</p>}

      <div className="resource-grid">
        {resources.map((resource) => (
          <ResourceCard key={resource.id} resource={resource} />
        ))}
      </div>
    </section>
  )
}

export default ResourceList
