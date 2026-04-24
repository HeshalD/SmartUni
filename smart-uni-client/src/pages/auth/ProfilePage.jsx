import { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { authApi } from '../../api/authApi';
import { FaUser, FaEnvelope, FaCalendar, FaEdit, FaSave, FaTimes, FaCamera, FaShieldAlt, FaClock, FaCheckCircle, FaTimesCircle } from 'react-icons/fa';

export default function ProfilePage() {
  const { user, refreshUser } = useAuth();

  const [editing, setEditing]   = useState(false);
  const [form, setForm]         = useState({ name: '', profilePictureUrl: '' });
  const [saving, setSaving]     = useState(false);
  const [success, setSuccess]   = useState(false);
  const [error, setError]       = useState('');

  const startEdit = () => {
    setForm({ name: user.name || '', profilePictureUrl: user.profilePictureUrl || '' });
    setEditing(true);
    setSuccess(false);
    setError('');
  };

  const cancelEdit = () => setEditing(false);

  const handleChange = (e) =>
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));

  const handleSave = async (e) => {
    e.preventDefault();
    if (!form.name.trim() || form.name.length < 2) {
      setError('Name must be at least 2 characters.');
      return;
    }
    setSaving(true);
    setError('');
    try {
      await authApi.updateProfile(form);
      await refreshUser();
      setEditing(false);
      setSuccess(true);
      setTimeout(() => setSuccess(false), 3000);
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to update profile.');
    } finally {
      setSaving(false);
    }
  };

  if (!user) return null;

  const initials = user.name
    ? user.name.split(' ').map((w) => w[0]).join('').toUpperCase().slice(0, 2)
    : '?';

  return (
    <div style={{ padding: '28px', maxWidth: '800px', margin: '0 auto' }}>
      
      {/* Header */}
      <div style={{ marginBottom: '32px' }}>
        <h1 style={{ fontSize: '28px', fontWeight: 800, color: '#111827', margin: 0, display: 'flex', alignItems: 'center', gap: '12px' }}>
          <FaUser size={28} color="#4f46e5" />
          My Profile
        </h1>
        <p style={{ fontSize: '16px', color: '#6b7280', margin: '8px 0 0 0' }}>
          Manage your personal information and account settings
        </p>
      </div>

      {/* Success/Error Messages */}
      {success && (
        <div style={{ marginBottom: '20px', padding: '16px 20px', borderRadius: '12px', background: '#d1fae5', color: '#065f46', fontSize: '14px', fontWeight: 600, border: '1px solid #6ee7b7', display: 'flex', alignItems: 'center', gap: '8px' }}>
          <FaCheckCircle size={16} />
          Profile updated successfully.
        </div>
      )}
      {error && (
        <div style={{ marginBottom: '20px', padding: '16px 20px', borderRadius: '12px', background: '#fef2f2', color: '#991b1b', fontSize: '14px', fontWeight: 600, border: '1px solid #fee2e2', display: 'flex', alignItems: 'center', gap: '8px' }}>
          <FaTimesCircle size={16} />
          {error}
        </div>
      )}

      {/* Profile Card */}
      <div style={{
        background: '#fff',
        border: '1px solid #e5e7eb',
        borderRadius: '16px',
        padding: '32px',
        boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
      }}>
        
        {/* Avatar Section */}
        <div style={{ display: 'flex', alignItems: 'flex-start', gap: '24px', marginBottom: '32px', flexWrap: 'wrap' }}>
          <div style={{ position: 'relative' }}>
            {user.profilePictureUrl ? (
              <img
                src={user.profilePictureUrl}
                alt={user.name}
                style={{
                  width: '120px',
                  height: '120px',
                  borderRadius: '50%',
                  objectFit: 'cover',
                  border: '4px solid #e5e7eb',
                }}
              />
            ) : (
              <div style={{
                width: '120px',
                height: '120px',
                borderRadius: '50%',
                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '36px',
                fontWeight: 700,
                color: '#fff',
                border: '4px solid #e5e7eb',
              }}>
                {initials}
              </div>
            )}
            {editing && (
              <div style={{
                position: 'absolute',
                bottom: '4px',
                right: '4px',
                width: '32px',
                height: '32px',
                borderRadius: '50%',
                background: '#4f46e5',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                border: '3px solid #fff',
                cursor: 'pointer',
                transition: 'background 0.15s',
              }}
              onMouseEnter={(e) => { e.currentTarget.style.background = '#4338ca'; }}
              onMouseLeave={(e) => { e.currentTarget.style.background = '#4f46e5'; }}
            >
                <FaCamera size={14} color="#fff" />
              </div>
            )}
          </div>
          
          <div style={{ flex: 1, minWidth: '250px' }}>
            <h2 style={{ fontSize: '24px', fontWeight: 700, color: '#111827', margin: '0 0 8px 0' }}>
              {user.name}
            </h2>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '12px', color: '#6b7280', fontSize: '16px' }}>
              <FaEnvelope size={14} />
              {user.email}
            </div>
            <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', marginBottom: '16px' }}>
              {user.roles?.map((role) => (
                <span
                  key={role}
                  style={{
                    background: role === 'ADMIN' ? '#fef3c7' : role === 'TECHNICIAN' ? '#dbeafe' : '#e0e7ff',
                    color: role === 'ADMIN' ? '#92400e' : role === 'TECHNICIAN' ? '#1e40af' : '#3730a3',
                    fontSize: '12px',
                    fontWeight: 700,
                    padding: '4px 12px',
                    borderRadius: '999px',
                    textTransform: 'uppercase',
                  }}
                >
                  {role}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* Meta Information */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
          gap: '20px',
          padding: '20px 0',
          borderTop: '1px solid #e5e7eb',
          borderBottom: '1px solid #e5e7eb',
          marginBottom: '24px',
        }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px', color: '#6b7280', fontSize: '14px', fontWeight: 600 }}>
              <FaShieldAlt size={12} />
              Provider
            </div>
            <div style={{ fontSize: '16px', fontWeight: 500, color: '#111827' }}>
              {user.provider || 'LOCAL'}
            </div>
          </div>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px', color: '#6b7280', fontSize: '14px', fontWeight: 600 }}>
              <FaCalendar size={12} />
              Member since
            </div>
            <div style={{ fontSize: '16px', fontWeight: 500, color: '#111827' }}>
              {user.createdAt ? new Date(user.createdAt).toLocaleDateString() : 'N/A'}
            </div>
          </div>
        </div>

        {/* Edit/Form Section */}
        {!editing ? (
          <button
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '8px',
              padding: '12px 24px',
              borderRadius: '10px',
              background: '#4f46e5',
              color: '#fff',
              fontSize: '14px',
              fontWeight: 600,
              border: 'none',
              cursor: 'pointer',
              transition: 'background 0.15s',
            }}
            onMouseEnter={(e) => { e.currentTarget.style.background = '#4338ca'; }}
            onMouseLeave={(e) => { e.currentTarget.style.background = '#4f46e5'; }}
            onClick={startEdit}
          >
            <FaEdit size={14} />
            Edit Profile
          </button>
        ) : (
          <form onSubmit={handleSave} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            <div>
              <label style={{ display: 'block', fontSize: '14px', fontWeight: 600, color: '#374151', marginBottom: '8px' }}>
                Full name
              </label>
              <input
                name="name"
                type="text"
                value={form.name}
                onChange={handleChange}
                placeholder="Your name"
                style={{
                  width: '100%',
                  padding: '12px 16px',
                  border: '1px solid #e5e7eb',
                  borderRadius: '10px',
                  fontSize: '14px',
                  outline: 'none',
                  transition: 'border-color 0.15s',
                }}
                onFocus={(e) => { e.currentTarget.style.borderColor = '#4f46e5'; }}
                onBlur={(e) => { e.currentTarget.style.borderColor = '#e5e7eb'; }}
              />
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '14px', fontWeight: 600, color: '#374151', marginBottom: '8px' }}>
                Profile picture URL
              </label>
              <input
                name="profilePictureUrl"
                type="url"
                value={form.profilePictureUrl}
                onChange={handleChange}
                placeholder="https://example.com/photo.jpg"
                style={{
                  width: '100%',
                  padding: '12px 16px',
                  border: '1px solid #e5e7eb',
                  borderRadius: '10px',
                  fontSize: '14px',
                  outline: 'none',
                  transition: 'border-color 0.15s',
                }}
                onFocus={(e) => { e.currentTarget.style.borderColor = '#4f46e5'; }}
                onBlur={(e) => { e.currentTarget.style.borderColor = '#e5e7eb'; }}
              />
            </div>

            <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end' }}>
              <button
                type="submit"
                disabled={saving}
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '8px',
                  padding: '12px 24px',
                  borderRadius: '10px',
                  background: saving ? '#f3f4f6' : '#4f46e5',
                  color: saving ? '#9ca3af' : '#fff',
                  fontSize: '14px',
                  fontWeight: 600,
                  border: 'none',
                  cursor: saving ? 'not-allowed' : 'pointer',
                  transition: 'background 0.15s',
                }}
                onMouseEnter={(e) => { if (!saving) e.currentTarget.style.background = '#4338ca'; }}
                onMouseLeave={(e) => { if (!saving) e.currentTarget.style.background = '#4f46e5'; }}
              >
                <FaSave size={14} />
                {saving ? 'Saving...' : 'Save Changes'}
              </button>
              <button
                type="button"
                onClick={cancelEdit}
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '8px',
                  padding: '12px 24px',
                  borderRadius: '10px',
                  border: '1px solid #e5e7eb',
                  background: '#ffffff',
                  color: '#374151',
                  fontSize: '14px',
                  fontWeight: 600,
                  cursor: 'pointer',
                  transition: 'background 0.15s',
                }}
                onMouseEnter={(e) => { e.currentTarget.style.background = '#f3f4f6'; }}
                onMouseLeave={(e) => { e.currentTarget.style.background = '#ffffff'; }}
              >
                <FaTimes size={14} />
                Cancel
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}