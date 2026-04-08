import { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { authApi } from '../../api/authApi';

export default function OAuth2CallbackPage() {
  const [searchParams] = useSearchParams();
  const { setUser } = useAuth();
  const navigate = useNavigate();
  const [error, setError] = useState('');

  useEffect(() => {
    const handleCallback = async () => {
      const token = searchParams.get('token');
      const err   = searchParams.get('error');

      if (err || !token) {
        setError(err ? 'Google login failed. Please try again.' : 'No token received.');
        setTimeout(() => navigate('/login'), 3000);
        return;
      }

      // Set token in localStorage FIRST
      localStorage.setItem('token', token);

      try {
        // Call getMe directly - axios interceptor will pick up token from localStorage
        const res = await authApi.getMe();
        // Set user in context
        setUser(res.data);
        // Navigate to dashboard
        navigate('/dashboard', { replace: true });
      } catch (e) {
        console.error('OAuth callback error:', e.response?.status, e.response?.data);
        localStorage.removeItem('token');
        setError('Failed to load your profile. Please try again.');
        setTimeout(() => navigate('/login'), 3000);
      }
    };

    handleCallback();
  }, [searchParams, navigate, setUser]);

  if (error) {
    return (
      <div className="auth-container">
        <div className="auth-card">
          <div className="alert alert-error">{error}</div>
          <p style={{ textAlign: 'center', marginTop: '1rem', color: '#6b7280' }}>
            Redirecting to login…
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="auth-container">
      <div className="auth-card" style={{ textAlign: 'center' }}>
        <div className="spinner" />
        <p style={{ marginTop: '1rem', color: '#6b7280' }}>Completing sign-in…</p>
      </div>
    </div>
  );
}