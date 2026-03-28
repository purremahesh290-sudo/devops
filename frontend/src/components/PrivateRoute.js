/**
 * @fileoverview Private route guard component for the Construction Progress Tracker.
 * Prevents unauthenticated users from accessing protected routes
 * by redirecting them to the login page.
 */
import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

/**
 * PrivateRoute component that wraps protected routes.
 * Checks authentication status and redirects to login if not authenticated.
 * Shows a loading indicator while auth state is being initialized.
 * @param {Object} props - Component props
 * @param {React.ReactNode} props.children - Protected child components to render
 * @returns {JSX.Element} Children if authenticated, redirect to /login otherwise
 */
const PrivateRoute = ({ children }) => {
  const { isAuthenticated, loading } = useAuth();

  if (loading) {
    return (
      <div style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        height: '100vh',
        color: '#e65100',
        fontSize: '1.2rem',
        fontWeight: 600
      }}>
        Loading...
      </div>
    );
  }

  if (!isAuthenticated()) {
    return <Navigate to="/login" replace />;
  }

  return children;
};

export default PrivateRoute;
