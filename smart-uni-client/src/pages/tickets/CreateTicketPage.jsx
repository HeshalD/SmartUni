import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const API = 'http://localhost:8080/api/tickets';

const CATEGORIES = ['ELECTRICAL','PLUMBING','IT_EQUIPMENT','FURNITURE','HVAC','SAFETY','OTHER'];
const PRIORITIES = ['LOW','MEDIUM','HIGH','CRITICAL'];

export default function CreateTicketPage() {
  const token = localStorage.getItem('token');
  const navigate  = useNavigate();

  const [form, setForm] = useState({
    title:          '',
    description:    '',
    category:       '',
    priority:       '',
    location:       '',
    resourceId:     '',
    contactDetails: '',
    imageUrls:      [],
  });

  const [imageInput, setImageInput] = useState('');
  const [error,      setError]      = useState('');
  const [loading,    setLoading]    = useState(false);

  function handleChange(e) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  function addImage() {
    if (!imageInput.trim()) return;
    if (form.imageUrls.length >= 3) {
      setError('Maximum 3 images allowed');
      return;
    }
    setForm({ ...form, imageUrls: [...form.imageUrls, imageInput.trim()] });
    setImageInput('');
    setError('');
  }

  function removeImage(index) {
    setForm({ ...form, imageUrls: form.imageUrls.filter((_, i) => i !== index) });
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setError('');

    if (!form.title || !form.description || !form.category || !form.priority || !form.location || !form.contactDetails) {
      setError('Please fill in all required fields');
      return;
    }

    setLoading(true);
    try {
      const res = await fetch(API, {
        method:  'POST',
        headers: {
          'Content-Type':  'application/json',
          Authorization:   `Bearer ${token}`,
        },
        body: JSON.stringify(form),
      });

      if (!res.ok) throw new Error('Failed to create ticket');
      const data = await res.json();
      navigate(`/tickets/${data.id}`);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="page-container">
      <div className="page-header">
        <div>
          <h1 className="page-title">New Maintenance Ticket</h1>
          <p className="page-subtitle">Report a maintenance issue or incident</p>
        </div>
      </div>

      {error && <div className="alert alert-error">{error}</div>}

      <form onSubmit={handleSubmit} style={{
        background: '#fff',
        border: '1px solid #e5e7eb',
        borderRadius: '12px',
        padding: '2rem',
        display: 'flex',
        flexDirection: 'column',
        gap: '1.25rem',
        maxWidth: '700px',
      }}>

        {/* Title */}
        <div className="form-group">
          <label>Title *</label>
          <input
            name="title"
            value={form.title}
            onChange={handleChange}
            placeholder="e.g. Projector not working in Lab 1"
          />
        </div>

        {/* Description */}
        <div className="form-group">
          <label>Description *</label>
          <textarea
            name="description"
            value={form.description}
            onChange={handleChange}
            placeholder="Describe the issue in detail..."
            rows={4}
            style={{
              padding: '0.6rem 0.9rem',
              border: '1px solid #e5e7eb',
              borderRadius: '6px',
              resize: 'vertical',
            }}
          />
        </div>

        {/* Category & Priority */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
          <div className="form-group">
            <label>Category *</label>
            <select
              name="category"
              value={form.category}
              onChange={handleChange}
              style={{ padding: '0.6rem 0.9rem', border: '1px solid #e5e7eb', borderRadius: '6px' }}
            >
              <option value="">Select category</option>
              {CATEGORIES.map(c => <option key={c} value={c}>{c.replace('_', ' ')}</option>)}
            </select>
          </div>

          <div className="form-group">
            <label>Priority *</label>
            <select
              name="priority"
              value={form.priority}
              onChange={handleChange}
              style={{ padding: '0.6rem 0.9rem', border: '1px solid #e5e7eb', borderRadius: '6px' }}
            >
              <option value="">Select priority</option>
              {PRIORITIES.map(p => <option key={p} value={p}>{p}</option>)}
            </select>
          </div>
        </div>

        {/* Location */}
        <div className="form-group">
          <label>Location *</label>
          <input
            name="location"
            value={form.location}
            onChange={handleChange}
            placeholder="e.g. Lab 1, Block A"
          />
        </div>

        {/* Resource ID (optional) */}
        <div className="form-group">
          <label>Resource ID <span style={{ color: '#9ca3af' }}>(optional)</span></label>
          <input
            name="resourceId"
            value={form.resourceId}
            onChange={handleChange}
            placeholder="e.g. resource mongo id"
          />
        </div>

        {/* Contact Details */}
        <div className="form-group">
          <label>Contact Details *</label>
          <input
            name="contactDetails"
            value={form.contactDetails}
            onChange={handleChange}
            placeholder="e.g. your email or phone number"
          />
        </div>

        {/* Image URLs */}
        <div className="form-group">
          <label>Image URLs <span style={{ color: '#9ca3af' }}>(max 3)</span></label>
          <div style={{ display: 'flex', gap: '0.5rem' }}>
            <input
              value={imageInput}
              onChange={e => setImageInput(e.target.value)}
              placeholder="Paste image URL here"
              style={{ flex: 1 }}
            />
            <button
              type="button"
              className="btn btn-outline"
              onClick={addImage}
              disabled={form.imageUrls.length >= 3}
            >
              Add
            </button>
          </div>

          {form.imageUrls.length > 0 && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem', marginTop: '0.5rem' }}>
              {form.imageUrls.map((url, i) => (
                <div key={i} style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                  background: '#f9fafb',
                  padding: '0.4rem 0.75rem',
                  borderRadius: '6px',
                  fontSize: '0.85rem',
                }}>
                  <span style={{ flex: 1, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                    🖼️ {url}
                  </span>
                  <button
                    type="button"
                    className="btn-icon btn-icon--danger"
                    onClick={() => removeImage(i)}
                  >
                    ✕
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Actions */}
        <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'flex-end' }}>
          <button
            type="button"
            className="btn btn-outline"
            onClick={() => navigate('/tickets')}
          >
            Cancel
          </button>
          <button
            type="submit"
            className="btn btn-primary"
            disabled={loading}
          >
            {loading ? 'Submitting...' : 'Submit Ticket'}
          </button>
        </div>
      </form>
    </div>
  );
}