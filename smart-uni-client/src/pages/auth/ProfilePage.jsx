import { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { authApi } from '../../api/authApi';

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
    <div className="page-container" style={{ maxWidth: '600px' }}>
      <div className="page-header">
        <h1 className="page-title">My Profile</h1>
      </div>

      {success && <div className="alert alert-success">Profile updated successfully.</div>}
      {error   && <div className="alert alert-error">{error}</div>}

      <div className="profile-card">
        {/* Avatar */}
        <div className="profile-avatar-row">
          {user.profilePictureUrl ? (
            <img
              src={user.profilePictureUrl}
              alt={user.name}
              className="profile-avatar"
            />
          ) : (
            <div className="profile-avatar profile-avatar--initials">{initials}</div>
          )}
          <div>
            <h2 className="profile-name">{user.name}</h2>
            <p className="profile-email">{user.email}</p>
            <div className="role-badges">
              {user.roles?.map((role) => (
                <span key={role} className={`role-badge role-badge--${role.toLowerCase()}`}>
                  {role}
                </span>
              ))}
            </div>
          </div>
        </div>

        <div className="profile-meta">
          <div className="profile-meta__row">
            <span className="profile-meta__label">Provider</span>
            <span className="profile-meta__value">{user.provider || 'LOCAL'}</span>
          </div>
          <div className="profile-meta__row">
            <span className="profile-meta__label">Member since</span>
            <span className="profile-meta__value">
              {user.createdAt
                ? new Date(user.createdAt).toLocaleDateString()
                : '—'}
            </span>
          </div>
        </div>

        {!editing ? (
          <button className="btn btn-primary" onClick={startEdit}>
            Edit profile
          </button>
        ) : (
          <form onSubmit={handleSave} className="profile-form">
            <div className="form-group">
              <label htmlFor="name">Full name</label>
              <input
                id="name" name="name" type="text"
                value={form.name} onChange={handleChange}
                placeholder="Your name"
              />
            </div>

            <div className="form-group">
              <label htmlFor="profilePictureUrl">Profile picture URL</label>
              <input
                id="profilePictureUrl" name="profilePictureUrl" type="url"
                value={form.profilePictureUrl} onChange={handleChange}
                placeholder="https://example.com/photo.jpg"
              />
            </div>

            <div className="form-actions">
              <button type="submit" className="btn btn-primary" disabled={saving}>
                {saving ? 'Saving…' : 'Save changes'}
              </button>
              <button type="button" className="btn btn-outline" onClick={cancelEdit}>
                Cancel
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}