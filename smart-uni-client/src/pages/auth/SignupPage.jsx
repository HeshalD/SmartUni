import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FcGoogle } from 'react-icons/fc';
import { useAuth } from '../../context/AuthContext';
import loginIllustration from '../../assets/loginpage.png';
import './LoginPage.css';

export default function SignupPage() {
  const { signup } = useAuth();
  const navigate = useNavigate();

  const [form, setForm] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: ''
  });

  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  const handleChange = (e) =>
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));

  const validate = () => {
    const errs = {};

    if (!form.name.trim() || form.name.length < 2) {
      errs.name = 'Name must be at least 2 characters';
    }

    if (!form.email) {
      errs.email = 'Email is required';
    }

    if (form.password.length < 8) {
      errs.password = 'Password must be at least 8 characters';
    }

    if (form.password !== form.confirmPassword) {
      errs.confirmPassword = 'Passwords do not match';
    }

    return errs;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const errs = validate();

    if (Object.keys(errs).length) {
      setErrors(errs);
      return;
    }

    setErrors({});
    setLoading(true);

    try {
      await signup({
        name: form.name,
        email: form.email,
        password: form.password
      });

      navigate('/dashboard', { replace: true });
    } catch (err) {
      const serverError = err.response?.data;

      if (serverError?.fields) {
        setErrors(serverError.fields);
      } else {
        setErrors({ general: serverError?.error || 'Signup failed' });
      }
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignup = () => {
    window.location.href = 'http://localhost:8080/oauth2/authorization/google';
  };

  return (
    <div className="login-page">
      <div className="login-modal">
        
        {/* LEFT SIDE */}
        <div className="login-left-panel">
          <div className="login-left-content">
            <div className="login-brand">SmartUni</div>

            <div className="login-illustration-wrapper">
              <img
                src={loginIllustration}
                alt="SmartUni illustration"
                className="login-illustration"
              />
            </div>

            <div className="login-left-text">
              <h2>Create your account</h2>
              <p>Join SmartUni and simplify campus life.</p>
            </div>
          </div>
        </div>

        {/* RIGHT SIDE */}
        <div className="login-right-panel">
          <div className="login-form-card">

            <div className="login-header">
              <h1>Sign up</h1>
              <p>Create your account to get started</p>
            </div>

            {errors.general && (
              <div className="alert alert-error">{errors.general}</div>
            )}

            <form onSubmit={handleSubmit} className="auth-form">

              <div className="form-group">
                <label>Full Name</label>
                <input
                  name="name"
                  type="text"
                  value={form.name}
                  onChange={handleChange}
                  placeholder="Enter your name"
                  required
                />
                {errors.name && <span className="field-error">{errors.name}</span>}
              </div>

              <div className="form-group">
                <label>Email</label>
                <input
                  name="email"
                  type="email"
                  value={form.email}
                  onChange={handleChange}
                  placeholder="Enter your email"
                  required
                />
                {errors.email && <span className="field-error">{errors.email}</span>}
              </div>

              <div className="form-group">
                <label>Password</label>
                <input
                  name="password"
                  type="password"
                  value={form.password}
                  onChange={handleChange}
                  placeholder="Min. 8 characters"
                  required
                />
                {errors.password && <span className="field-error">{errors.password}</span>}
              </div>

              <div className="form-group">
                <label>Confirm Password</label>
                <input
                  name="confirmPassword"
                  type="password"
                  value={form.confirmPassword}
                  onChange={handleChange}
                  placeholder="Re-enter password"
                  required
                />
                {errors.confirmPassword && (
                  <span className="field-error">{errors.confirmPassword}</span>
                )}
              </div>

              <button
                type="submit"
                className="btn btn-primary btn-full login-submit-btn"
                disabled={loading}
              >
                {loading ? 'Creating account...' : 'Sign up'}
              </button>
            </form>

            <div className="divider">
              <span>or</span>
            </div>

            <button
              type="button"
              className="btn btn-google btn-full google-login-btn"
              onClick={handleGoogleSignup}
            >
              <FcGoogle size={20} />
              <span>Continue with Google</span>
            </button>

            <p className="auth-footer">
              Already have an account? <Link to="/login">Login</Link>
            </p>

          </div>
        </div>

      </div>
    </div>
  );
}