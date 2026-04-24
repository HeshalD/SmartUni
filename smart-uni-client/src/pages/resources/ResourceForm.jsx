import { useEffect, useMemo, useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { resourceApi } from '../../api/resourceApi'

const dayOptions = ['MONDAY', 'TUESDAY', 'WEDNESDAY', 'THURSDAY', 'FRIDAY', 'SATURDAY', 'SUNDAY']

const emptyForm = {
  name: '',
  category: '',
  location: '',
  description: '',
  capacity: 1,
  available: true,
  status: 'ACTIVE',
  amenities: [],
  availabilityWindows: [],
  imageUrl: '',
  contactPerson: '',
}

function ResourceForm() {
  const { id } = useParams()
  const navigate = useNavigate()
  const isEdit = useMemo(() => Boolean(id), [id])

  const [formData, setFormData] = useState(emptyForm)
  const [loading, setLoading] = useState(isEdit)
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState('')
  const [fieldError, setFieldError] = useState('')
  const [amenityInput, setAmenityInput] = useState('')

  useEffect(() => {
    if (!isEdit) {
      return
    }

    const fetchResource = async () => {
      try {
        const response = await resourceApi.getById(id)
        const data = response.data
        setFormData({
          name: data.name || '',
          category: data.category || '',
          location: data.location || '',
          description: data.description || '',
          capacity: data.capacity || 1,
          available: Boolean(data.available),
          status: data.status || 'ACTIVE',
          amenities: data.amenities || [],
          availabilityWindows: data.availabilityWindows || [],
          imageUrl: data.imageUrl || '',
          contactPerson: data.contactPerson || '',
        })
      } catch (err) {
        setError(err.response?.data?.error || 'Failed to load resource')
      } finally {
        setLoading(false)
      }
    }

    fetchResource()
  }, [id, isEdit])

  const handleChange = (event) => {
    const { name, value, type, checked } = event.target
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : name === 'capacity' ? Number(value) : value,
    }))
  }

  const addAmenity = () => {
    const value = amenityInput.trim()
    if (!value) return
    if (formData.amenities.includes(value)) {
      setAmenityInput('')
      return
    }
    setFormData((prev) => ({ ...prev, amenities: [...prev.amenities, value] }))
    setAmenityInput('')
  }

  const removeAmenity = (amenity) => {
    setFormData((prev) => ({
      ...prev,
      amenities: prev.amenities.filter((item) => item !== amenity),
    }))
  }

  const addWindow = () => {
    setFormData((prev) => ({
      ...prev,
      availabilityWindows: [...prev.availabilityWindows, { dayOfWeek: 'MONDAY', startTime: '08:00', endTime: '17:00' }],
    }))
  }

  const updateWindow = (index, field, value) => {
    setFormData((prev) => {
      const windows = [...prev.availabilityWindows]
      windows[index] = { ...windows[index], [field]: value }
      return { ...prev, availabilityWindows: windows }
    })
  }

  const removeWindow = (index) => {
    setFormData((prev) => ({
      ...prev,
      availabilityWindows: prev.availabilityWindows.filter((_, i) => i !== index),
    }))
  }

  const validateWindows = () => {
    for (const window of formData.availabilityWindows) {
      if (!window.dayOfWeek || !window.startTime || !window.endTime) {
        return 'Each availability window must include day, start time, and end time.'
      }
      if (window.startTime >= window.endTime) {
        return 'Availability window start time must be earlier than end time.'
      }
    }
    return ''
  }

  const handleSubmit = async (event) => {
    event.preventDefault()
    setSubmitting(true)
    setError('')
    setFieldError('')

    const windowValidationError = validateWindows()
    if (windowValidationError) {
      setFieldError(windowValidationError)
      setSubmitting(false)
      return
    }

    const payload = {
      ...formData,
      capacity: Number(formData.capacity),
      amenities: formData.amenities,
      availabilityWindows: formData.availabilityWindows,
    }

    try {
      if (isEdit) {
        await resourceApi.update(id, payload)
        navigate(`/resources/${id}`)
      } else {
        const response = await resourceApi.create(payload)
        navigate(`/resources/${response.data.id}`)
      }
    } catch (err) {
      const details = err.response?.data?.details
      if (details && typeof details === 'object') {
        setError(Object.values(details).join(', '))
      } else {
        setError(err.response?.data?.error || 'Failed to save resource')
      }
    } finally {
      setSubmitting(false)
    }
  }

  if (loading) {
    return <p className="page">Loading form...</p>
  }

  return (
    <section className="page resources-page">
      <h1>{isEdit ? 'Edit Resource' : 'Create Resource'}</h1>

      {error && <p className="error">{error}</p>}
      {fieldError && <p className="error">{fieldError}</p>}

      <form className="resource-form resource-form--enhanced" onSubmit={handleSubmit}>
        <input required name="name" placeholder="Name" value={formData.name} onChange={handleChange} />
        <input required name="category" placeholder="Category" value={formData.category} onChange={handleChange} />
        <input required name="location" placeholder="Location" value={formData.location} onChange={handleChange} />
        <input
          required
          min="1"
          type="number"
          name="capacity"
          placeholder="Capacity"
          value={formData.capacity}
          onChange={handleChange}
        />
        <select name="status" value={formData.status} onChange={handleChange}>
          <option value="ACTIVE">Active</option>
          <option value="OUT_OF_SERVICE">Out of service</option>
        </select>
        <input name="contactPerson" placeholder="Contact Person" value={formData.contactPerson} onChange={handleChange} />
        <input name="imageUrl" placeholder="Image URL" value={formData.imageUrl} onChange={handleChange} />
        <textarea
          name="description"
          placeholder="Description"
          rows="4"
          value={formData.description}
          onChange={handleChange}
        />

        {formData.imageUrl && (
          <div className="resource-form__preview" role="presentation">
            <img src={formData.imageUrl} alt="Resource preview" />
          </div>
        )}

        <div className="resource-form__section">
          <h3>Amenities</h3>
          <div className="resource-tag-input">
            <input
              type="text"
              placeholder="Add amenity"
              value={amenityInput}
              onChange={(event) => setAmenityInput(event.target.value)}
              onKeyDown={(event) => {
                if (event.key === 'Enter') {
                  event.preventDefault()
                  addAmenity()
                }
              }}
            />
            <button type="button" className="secondary-btn" onClick={addAmenity}>
              Add
            </button>
          </div>
          <div className="resource-tag-list">
            {formData.amenities.length === 0 && (
              <span className="resource-detail__muted">No amenities added yet.</span>
            )}
            {formData.amenities.map((amenity) => (
              <button
                key={amenity}
                type="button"
                className="resource-pill resource-pill--remove"
                onClick={() => removeAmenity(amenity)}
              >
                {amenity} x
              </button>
            ))}
          </div>
        </div>

        <div className="resource-form__section">
          <div className="resource-form__section-header">
            <h3>Availability Windows</h3>
            <button type="button" className="secondary-btn" onClick={addWindow}>Add window</button>
          </div>
          {formData.availabilityWindows.length === 0 && (
            <p className="resource-detail__muted">No availability windows configured.</p>
          )}
          {formData.availabilityWindows.map((window, index) => (
            <div key={`${window.dayOfWeek}-${index}`} className="resource-window-editor">
              <select
                value={window.dayOfWeek}
                onChange={(event) => updateWindow(index, 'dayOfWeek', event.target.value)}
              >
                {dayOptions.map((day) => (
                  <option key={day} value={day}>{day}</option>
                ))}
              </select>
              <input
                type="time"
                value={window.startTime}
                onChange={(event) => updateWindow(index, 'startTime', event.target.value)}
              />
              <input
                type="time"
                value={window.endTime}
                onChange={(event) => updateWindow(index, 'endTime', event.target.value)}
              />
              <button type="button" className="danger-btn" onClick={() => removeWindow(index)}>
                Remove
              </button>
            </div>
          ))}
        </div>

        <label className="checkbox-row">
          <input
            type="checkbox"
            name="available"
            checked={formData.available}
            onChange={handleChange}
          />
          Available
        </label>

        <div className="page-actions">
          <button className="primary-btn" type="submit" disabled={submitting}>
            {submitting ? 'Saving...' : 'Save'}
          </button>
          <Link className="secondary-btn" to={isEdit ? `/resources/${id}` : '/resources'}>
            Cancel
          </Link>
        </div>
      </form>
    </section>
  )
}

export default ResourceForm
