/**
 * @fileoverview Project Detail page for the Construction Progress Tracker.
 * Displays comprehensive project information including overall progress,
 * project metadata, description, and a list of tasks with their individual
 * progress bars. Provides Edit/Delete project and Add/Edit/Delete task actions.
 */
import React, { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../api/axios';
import './ProjectDetail.css';

/**
 * Formats a number as currency (USD).
 * @param {number} amount - The amount to format
 * @returns {string} Formatted currency string
 */
const formatBudget = (amount) => {
  if (!amount && amount !== 0) return '$0';
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
};

/**
 * Formats a date string to a readable format.
 * @param {string} dateStr - ISO date string
 * @returns {string} Formatted date or 'Not set'
 */
const formatDate = (dateStr) => {
  if (!dateStr) return 'Not set';
  return new Date(dateStr).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
};

/**
 * Formats status enum to a readable display label.
 * @param {string} status - The status enum value
 * @returns {string} Human-readable status text
 */
const formatStatus = (status) => {
  if (!status) return 'Unknown';
  return status.replace(/_/g, ' ');
};

/**
 * ProjectDetail page component showing full project information and tasks.
 * Fetches project data and tasks from the API.
 * @returns {JSX.Element} The project detail page
 */
const ProjectDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [project, setProject] = useState(null);
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  /**
   * Fetches project details and tasks from the API.
   */
  const fetchData = useCallback(async () => {
    try {
      const [projectRes, tasksRes] = await Promise.all([
        api.get(`/api/projects/${id}`),
        api.get(`/api/projects/${id}/tasks`),
      ]);
      setProject(projectRes.data);
      setTasks(tasksRes.data);
    } catch (err) {
      setError(
        err.response?.data?.detail ||
        'Failed to load project details.'
      );
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  /**
   * Handles project deletion after user confirmation.
   * Redirects to dashboard on successful deletion.
   */
  const handleDeleteProject = async () => {
    if (!window.confirm('Are you sure you want to delete this project? This cannot be undone.')) {
      return;
    }
    try {
      await api.delete(`/api/projects/${id}`);
      navigate('/dashboard');
    } catch (err) {
      setError(
        err.response?.data?.detail ||
        'Failed to delete project.'
      );
    }
  };

  /**
   * Handles task deletion after user confirmation.
   * Refreshes the task list on successful deletion.
   * @param {number} taskId - The ID of the task to delete
   */
  const handleDeleteTask = async (taskId) => {
    if (!window.confirm('Are you sure you want to delete this task?')) {
      return;
    }
    try {
      await api.delete(`/api/projects/${id}/tasks/${taskId}`);
      fetchData();
    } catch (err) {
      setError(
        err.response?.data?.detail ||
        'Failed to delete task.'
      );
    }
  };

  if (loading) {
    return <div className="project-detail-loading">Loading project details...</div>;
  }

  if (error && !project) {
    return <div className="project-detail-error">{error}</div>;
  }

  if (!project) {
    return <div className="project-detail-error">Project not found.</div>;
  }

  return (
    <div className="project-detail-page">
      <button className="project-detail-back" onClick={() => navigate('/dashboard')}>
        &#x2190; Back to Dashboard
      </button>

      {error && <div className="project-detail-error" style={{ marginBottom: 16 }}>{error}</div>}

      <div className="project-detail-card">
        <div className="project-detail-top">
          <div>
            <h1 className="project-detail-title">{project.name}</h1>
            <div className="project-detail-location">
              &#x1F4CD; {project.location || 'No location set'}
            </div>
          </div>
          <div className="project-detail-actions">
            <span className={`status-badge ${project.status}`}>
              {formatStatus(project.status)}
            </span>
            <button
              className="project-edit-btn"
              onClick={() => navigate(`/projects/${id}/edit`)}
            >
              Edit
            </button>
            <button
              className="project-delete-btn"
              onClick={handleDeleteProject}
            >
              Delete
            </button>
          </div>
        </div>

        <div className="project-detail-progress-section">
          <div className="project-detail-progress-header">
            <span className="project-detail-progress-label">Overall Progress</span>
            <span className="project-detail-progress-value">
              {project.overallProgress || 0}%
            </span>
          </div>
          <div className="project-detail-progress-bar">
            <div
              className="project-detail-progress-fill"
              style={{ width: `${project.overallProgress || 0}%` }}
            />
          </div>
        </div>

        <div className="project-detail-info-grid">
          <div className="project-info-item">
            <span className="project-info-label">Start Date</span>
            <span className="project-info-value">{formatDate(project.startDate)}</span>
          </div>
          <div className="project-info-item">
            <span className="project-info-label">Expected End Date</span>
            <span className="project-info-value">{formatDate(project.expectedEndDate)}</span>
          </div>
          <div className="project-info-item">
            <span className="project-info-label">Budget</span>
            <span className="project-info-value">{formatBudget(project.budget)}</span>
          </div>
          <div className="project-info-item">
            <span className="project-info-label">Tasks</span>
            <span className="project-info-value">
              {project.completedTaskCount || 0} / {project.taskCount || 0} completed
            </span>
          </div>
        </div>

        {project.description && (
          <div className="project-description">
            <h3>Description</h3>
            <p>{project.description}</p>
          </div>
        )}
      </div>

      <div className="tasks-section">
        <div className="tasks-header">
          <h2>Tasks ({tasks.length})</h2>
          <button
            className="add-task-btn"
            onClick={() => navigate(`/projects/${id}/tasks/add`)}
          >
            + Add Task
          </button>
        </div>

        {tasks.length === 0 ? (
          <div className="tasks-empty">
            <p>No tasks yet. Add your first task to start tracking progress.</p>
          </div>
        ) : (
          <div className="task-list">
            {tasks.map((task) => (
              <div key={task.id} className="task-item">
                <div className="task-item-top">
                  <div className="task-item-info">
                    <h4>{task.title}</h4>
                    {task.assignedTo && (
                      <span className="task-item-assigned">Assigned to: {task.assignedTo}</span>
                    )}
                  </div>
                  <span className={`task-status-badge ${task.status}`}>
                    {formatStatus(task.status)}
                  </span>
                </div>

                <div className="task-item-progress">
                  <div className="task-progress-track">
                    <div
                      className="task-progress-fill"
                      style={{ width: `${task.progress || 0}%` }}
                    />
                  </div>
                </div>

                <div className="task-item-bottom">
                  <div className="task-item-meta">
                    <span>Progress: {task.progress || 0}%</span>
                    {task.dueDate && <span>Due: {formatDate(task.dueDate)}</span>}
                  </div>
                  <div className="task-item-actions">
                    <button
                      className="task-edit-btn"
                      onClick={() => navigate(`/projects/${id}/tasks/${task.id}/edit`)}
                    >
                      Edit
                    </button>
                    <button
                      className="task-delete-btn"
                      onClick={() => handleDeleteTask(task.id)}
                    >
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default ProjectDetail;
