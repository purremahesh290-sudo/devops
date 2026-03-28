/**
 * @fileoverview Authentication context provider for the Construction Progress Tracker.
 * Manages user authentication state, login/logout functionality,
 * and role-based access control (WORKER vs MANAGER).
 * Persists token and user data in localStorage.
 */
import React, { createContext, useState, useContext, useEffect } from 'react';
import api from '../api/axios';

/** @type {React.Context} Authentication context */
const AuthContext = createContext(null);

/**
 * AuthProvider component that wraps the application to provide authentication state.
 * Stores JWT token and user info in localStorage for persistence across page reloads.
 * @param {Object} props - Component props
 * @param {React.ReactNode} props.children - Child components
 * @returns {JSX.Element} Provider wrapping children with auth state
 */
export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(true);

  /**
   * Initialize auth state from localStorage on mount.
   */
  useEffect(() => {
    const storedToken = localStorage.getItem('token');
    const storedUser = localStorage.getItem('user');
    if (storedToken && storedUser) {
      setToken(storedToken);
      try {
        setUser(JSON.parse(storedUser));
      } catch (e) {
        localStorage.removeItem('user');
        localStorage.removeItem('token');
      }
    }
    setLoading(false);
  }, []);

  /**
   * Authenticates a user with username and password.
   * Stores the received JWT token and user data in state and localStorage.
   * @param {string} username - The user's username
   * @param {string} password - The user's password
   * @returns {Promise<Object>} The authenticated user data
   * @throws {Error} Authentication error from the API
   */
  const login = async (username, password) => {
    const response = await api.post('/api/auth/login', { username, password });
    const data = response.data;
    const userData = {
      username: data.username,
      role: data.role,
    };
    setToken(data.token);
    setUser(userData);
    localStorage.setItem('token', data.token);
    localStorage.setItem('user', JSON.stringify(userData));
    return userData;
  };

  /**
   * Logs out the current user by clearing all auth state and localStorage.
   */
  const logout = () => {
    setToken(null);
    setUser(null);
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  };

  /**
   * Checks if the current user has MANAGER role.
   * @returns {boolean} True if the user is a manager
   */
  const isManager = () => {
    return user?.role === 'MANAGER';
  };

  /**
   * Checks if a user is currently authenticated.
   * @returns {boolean} True if authenticated
   */
  const isAuthenticated = () => {
    return !!token;
  };

  const value = {
    user,
    token,
    loading,
    login,
    logout,
    isManager,
    isAuthenticated,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

/**
 * Custom hook to access the authentication context.
 * @returns {Object} Auth context value with user, token, login, logout, isManager, isAuthenticated
 */
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export default AuthContext;
