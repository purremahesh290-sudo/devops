/**
 * @fileoverview Project card component for the Construction Progress Tracker.
 * Displays a summary of a project including name, location, status badge,
 * progress bar, budget, and task count in a clickable card format.
 */
import React from 'react';
import { useNavigate } from 'react-router-dom';
import './ProjectCard.css';

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
 * ProjectCard component displaying a project summary in a card layout.
 * Clicking the card navigates to the project detail page.
 * @param {Object} props - Component props
 * @param {Object} props.project - The project data object
 * @param {number} props.project.id - Project unique identifier
 * @param {string} props.project.name - Project name
 * @param {string} props.project.location - Project location
 * @param {string} props.project.status - Project status (PLANNING, IN_PROGRESS, etc.)
 * @param {number} props.project.overallProgress - Progress percentage (0-100)
 * @param {number} props.project.budget - Project budget amount
 * @param {number} props.project.taskCount - Total number of tasks
 * @param {number} props.project.completedTaskCount - Number of completed tasks
 * @returns {JSX.Element} The project card
 */
const ProjectCard = ({ project }) => {
  const navigate = useNavigate();

  /**
   * Formats status enum to a readable display label.
   * @param {string} status - The status enum value
   * @returns {string} Human-readable status text
   */
  const formatStatus = (status) => {
    if (!status) return 'Unknown';
    return status.replace(/_/g, ' ');
  };

  return (
    <div className="project-card" onClick={() => navigate(`/projects/${project.id}`)}>
      <div className="project-card-header">
        <div>
          <h3 className="project-card-name">{project.name}</h3>
          <div className="project-card-location">
            {project.location || 'No location'}
          </div>
        </div>
        <span className={`status-badge ${project.status}`}>
          {formatStatus(project.status)}
        </span>
      </div>

      <div className="project-card-progress">
        <div className="progress-header">
          <span className="progress-label">Progress</span>
          <span className="progress-value">{project.overallProgress || 0}%</span>
        </div>
        <div className="progress-bar-track">
          <div
            className="progress-bar-fill"
            style={{ width: `${project.overallProgress || 0}%` }}
          />
        </div>
      </div>

      <div className="project-card-footer">
        <span className="project-card-budget">{formatBudget(project.budget)}</span>
        <span className="project-card-tasks">
          <span>{project.completedTaskCount || 0}</span>/{project.taskCount || 0} tasks
        </span>
      </div>
    </div>
  );
};

export default ProjectCard;
