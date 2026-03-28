/**
 * @fileoverview Navigation bar component for the Construction Progress Tracker.
 * Displays the brand logo, navigation links (Dashboard, Create Project),
 * welcome message with username, and logout button.
 * Uses the orange/amber construction theme.
 */
import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import './Navbar.css';

/**
 * Navbar component providing site-wide navigation.
 * Shows navigation links for authenticated users and handles logout.
 * @returns {JSX.Element} The navigation bar
 */
const Navbar = () => {
  const { user, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  /**
   * Handles user logout by clearing auth state and redirecting to login.
   */
  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <nav className="navbar">
      <Link to="/dashboard" className="navbar-brand">
        
        <span>ConstructTrack</span>
      </Link>

      <div className="navbar-links">
        <Link
          to="/dashboard"
          className={`navbar-link ${location.pathname === '/dashboard' ? 'active' : ''}`}
        >
          Dashboard
        </Link>
        <Link
          to="/projects/create"
          className={`navbar-link ${location.pathname === '/projects/create' ? 'active' : ''}`}
        >
          Create Project
        </Link>
      </div>

      <div className="navbar-right">
        <span className="navbar-welcome">Welcome, {user?.username}</span>
        <button className="navbar-logout" onClick={handleLogout}>
          Logout
        </button>
      </div>
    </nav>
  );
};

export default Navbar;
