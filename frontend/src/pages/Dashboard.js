/**
 * @fileoverview Dashboard page for the Construction Progress Tracker.
 * Displays a stats summary (total projects, in progress, completed, total budget)
 * at the top and a grid of ProjectCards below. Fetches projects from the API.
 */
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../api/axios';
import ProjectCard from '../components/ProjectCard';
import './Dashboard.css';

/**
 * Formats a number as currency (USD).
 * @param {number} amount - The amount to format
 * @returns {string} Formatted currency string
 */
const formatBudget = (amount) => {
  if (!amount && amount !== 0) return '$0';
  if (amount >= 1000000) {
    return `$${(amount / 1000000).toFixed(1)}M`;
  }
  if (amount >= 1000) {
    return `$${(amount / 1000).toFixed(0)}K`;
  }
  return `$${amount}`;
};

/**
 * Dashboard page component displaying project overview and statistics.
 * Shows summary stats at the top and a responsive grid of project cards.
 * @returns {JSX.Element} The dashboard page
 */
const Dashboard = () => {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  /**
   * Fetches all projects from the API on component mount.
   */
  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const response = await api.get('/api/projects');
        setProjects(response.data);
      } catch (err) {
        setError(
          err.response?.data?.detail ||
          'Failed to load projects. Please try again.'
        );
      } finally {
        setLoading(false);
      }
    };
    fetchProjects();
  }, []);

  /** @type {number} Total number of projects */
  const totalProjects = projects.length;

  /** @type {number} Number of projects currently in progress */
  const inProgressCount = projects.filter((p) => p.status === 'IN_PROGRESS').length;

  /** @type {number} Number of completed projects */
  const completedCount = projects.filter((p) => p.status === 'COMPLETED').length;

  /** @type {number} Sum of all project budgets */
  const totalBudget = projects.reduce((sum, p) => sum + (p.budget || 0), 0);

  if (loading) {
    return <div className="dashboard-loading">Loading projects...</div>;
  }

  return (
    <div className="dashboard-page">
      <div className="dashboard-header">
        <h1>Project Dashboard</h1>
        <p>Overview of all construction projects</p>
      </div>

      {error && <div className="dashboard-error">{error}</div>}

      <div className="dashboard-stats">
        <div className="stat-card">
          <div className="stat-icon total"></div>
          <div className="stat-info">
            <h3>{totalProjects}</h3>
            <p>Total Projects</p>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon progress"></div>
          <div className="stat-info">
            <h3>{inProgressCount}</h3>
            <p>In Progress</p>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon completed"></div>
          <div className="stat-info">
            <h3>{completedCount}</h3>
            <p>Completed</p>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon budget"></div>
          <div className="stat-info">
            <h3>{formatBudget(totalBudget)}</h3>
            <p>Total Budget</p>
          </div>
        </div>
      </div>

      <div className="dashboard-projects-header">
        <h2>All Projects</h2>
        <Link to="/projects/create" className="dashboard-create-btn">
          + New Project
        </Link>
      </div>

      {projects.length === 0 ? (
        <div className="dashboard-empty">
          
          <h3>No Projects Yet</h3>
          <p>Create your first construction project to get started.</p>
          <Link to="/projects/create" className="dashboard-create-btn">
            Create Project
          </Link>
        </div>
      ) : (
        <div className="dashboard-projects-grid">
          {projects.map((project) => (
            <ProjectCard key={project.id} project={project} />
          ))}
        </div>
      )}
    </div>
  );
};

export default Dashboard;
