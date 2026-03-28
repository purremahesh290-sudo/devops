/**
 * @fileoverview Main application component for the Construction Progress Tracker.
 * Sets up React Router with all application routes and wraps the app
 * in AuthProvider for global authentication state management.
 * Public routes: /login, /signup
 * Private routes: /dashboard, /projects/create, /projects/:id, /projects/:id/edit,
 *   /projects/:id/tasks/add, /projects/:id/tasks/:taskId/edit
 * Root (/) redirects to /dashboard.
 */
import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import Navbar from './components/Navbar';
import PrivateRoute from './components/PrivateRoute';
import Login from './pages/Login';
import Signup from './pages/Signup';
import Dashboard from './pages/Dashboard';
import CreateProject from './pages/CreateProject';
import ProjectDetail from './pages/ProjectDetail';
import EditProject from './pages/EditProject';
import AddTask from './pages/AddTask';
import EditTask from './pages/EditTask';
import './App.css';

/**
 * Layout component that wraps private pages with the Navbar.
 * Provides consistent navigation across all authenticated pages.
 * @param {Object} props - Component props
 * @param {React.ReactNode} props.children - Child page components
 * @returns {JSX.Element} Layout with navbar and page content
 */
const Layout = ({ children }) => {
  return (
    <div className="app-container">
      <Navbar />
      <div className="page-content">{children}</div>
    </div>
  );
};

/**
 * Root App component that configures routing and authentication.
 * Wraps all routes in AuthProvider and uses PrivateRoute for protected pages.
 * @returns {JSX.Element} The complete application
 */
const App = () => {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          {/* Public Routes */}
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />

          {/* Private Routes */}
          <Route
            path="/dashboard"
            element={
              <PrivateRoute>
                <Layout>
                  <Dashboard />
                </Layout>
              </PrivateRoute>
            }
          />
          <Route
            path="/projects/create"
            element={
              <PrivateRoute>
                <Layout>
                  <CreateProject />
                </Layout>
              </PrivateRoute>
            }
          />
          <Route
            path="/projects/:id"
            element={
              <PrivateRoute>
                <Layout>
                  <ProjectDetail />
                </Layout>
              </PrivateRoute>
            }
          />
          <Route
            path="/projects/:id/edit"
            element={
              <PrivateRoute>
                <Layout>
                  <EditProject />
                </Layout>
              </PrivateRoute>
            }
          />
          <Route
            path="/projects/:id/tasks/add"
            element={
              <PrivateRoute>
                <Layout>
                  <AddTask />
                </Layout>
              </PrivateRoute>
            }
          />
          <Route
            path="/projects/:id/tasks/:taskId/edit"
            element={
              <PrivateRoute>
                <Layout>
                  <EditTask />
                </Layout>
              </PrivateRoute>
            }
          />

          {/* Root redirect */}
          <Route path="/" element={<Navigate to="/dashboard" replace />} />

          {/* Catch-all redirect */}
          <Route path="*" element={<Navigate to="/dashboard" replace />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
};

export default App;
