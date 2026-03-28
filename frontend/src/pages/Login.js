/**
 * @fileoverview Login page for the Construction Progress Tracker.
 * Features a split layout with a construction-themed left panel and
 * login form on the right. Includes examiner demo credentials box
 * with one-click login functionality. Uses orange/amber theme.
 */
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import './Login.css';

/**
 * Login page component with split-panel design.
 * Left panel shows branding with construction imagery.
 * Right panel contains the login form and demo access box.
 * @returns {JSX.Element} The login page
 */
const Login = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  /**
   * Handles the login form submission.
   * Authenticates the user and redirects to dashboard on success.
   * @param {React.FormEvent} e - The form submit event
   */
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await login(username, password);
      navigate('/dashboard');
    } catch (err) {
      setError(
        err.response?.data?.detail ||
        err.response?.data?.message ||
        'Login failed. Please check your credentials.'
      );
    } finally {
      setLoading(false);
    }
  };

  /**
   * Handles one-click demo login with examiner credentials.
   * Uses pre-configured demo username and password.
   */
  const handleDemoLogin = async () => {
    setError('');
    setLoading(true);
    try {
      await login('examiner', 'ConstructTrack2024');
      navigate('/dashboard');
    } catch (err) {
      setError(
        err.response?.data?.detail ||
        err.response?.data?.message ||
        'Demo login failed. Please try again.'
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-page">
      <div className="login-left">
        <div className="login-left-content">
          
          <h1 className="login-hero-title">ConstructTrack</h1>
          <p className="login-hero-subtitle">
            Your all-in-one construction project management solution.
            Track progress, manage tasks, and keep your projects on schedule and under budget.
          </p>
        </div>
      </div>

      <div className="login-right">
        <div className="login-form-container">
          <div className="login-form-header">
            <h2>Sign In</h2>
            <p>Enter your credentials to access your </p>
          </div>

          {error && <div className="login-error">{error}</div>}

          <form className="login-form" onSubmit={handleSubmit}>
            <div className="form-group">
              <label htmlFor="username">Username</label>
              <input
                id="username"
                type="text"
                placeholder="Enter your username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="password">Password</label>
              <input
                id="password"
                type="password"
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>

            <button type="submit" className="login-btn" disabled={loading}>
              {loading ? 'Signing in...' : 'Sign In'}
            </button>
          </form>

          <div className="login-demo-box">
            <h4>Examiner Access</h4>
            <div className="demo-credentials">
              <p>Username: <code>examiner</code></p>
              <p>Password: <code>ConstructTrack2024</code></p>
            </div>
            <button
              className="demo-login-btn"
              onClick={handleDemoLogin}
              disabled={loading}
            >
              {loading ? 'Signing in...' : 'Login as Examiner'}
            </button>
          </div>

          <div className="login-signup-link">
            Don't have an account? <Link to="/signup">Create Account</Link>
          </div>

          <div className="login-footer">
            <p>MSc Cloud DevOpsSec - National College of Ireland</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
