/**
 * @fileoverview Create Project page for the Construction Progress Tracker.
 * Provides a form to create a new construction project with fields for
 * name, description, location, start date, expected end date, and budget.
 */
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api/axios';
import './CreateProject.css';

/**
 * CreateProject page component with project creation form.
 * Submits new project data to the API and redirects to dashboard on success.
 * @returns {JSX.Element} The create project page
 */
const CreateProject = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    location: '',
    startDate: '',
    expectedEndDate: '',
    budget: '',
    status: 'PLANNING',
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  /**
   * Handles input field changes and updates form state.
   * @param {React.ChangeEvent} e - The input change event
   */
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  /**
   * Handles form submission to create a new project.
   * Sends project data to the API and navigates to dashboard on success.
   * @param {React.FormEvent} e - The form submit event
   */
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const payload = {
        ...formData,
        budget: formData.budget ? parseFloat(formData.budget) : 0,
      };
      await api.post('/api/projects', payload);
      navigate('/dashboard');
    } catch (err) {
      setError(
        err.response?.data?.detail ||
        err.response?.data?.message ||
        'Failed to create project. Please try again.'
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="create-project-page">
      <div className="create-project-header">
        <h1>New Project</h1>
        <p>Create a new construction project</p>
      </div>

      <div className="create-project-card">
        {error && <div className="create-project-error">{error}</div>}

        <form className="create-project-form" onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="name">Project Name</label>
            <input
              id="name"
              type="text"
              name="name"
              placeholder="Enter project name"
              value={formData.name}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="description">Description</label>
            <textarea
              id="description"
              name="description"
              placeholder="Describe the project"
              value={formData.description}
              onChange={handleChange}
            />
          </div>

          <div className="form-group">
            <label htmlFor="location">Location</label>
            <input
              id="location"
              type="text"
              name="location"
              placeholder="Project location"
              value={formData.location}
              onChange={handleChange}
            />
          </div>

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="startDate">Start Date</label>
              <input
                id="startDate"
                type="date"
                name="startDate"
                value={formData.startDate}
                onChange={handleChange}
              />
            </div>
            <div className="form-group">
              <label htmlFor="expectedEndDate">Expected End Date</label>
              <input
                id="expectedEndDate"
                type="date"
                name="expectedEndDate"
                value={formData.expectedEndDate}
                onChange={handleChange}
              />
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="budget">Budget ($)</label>
              <input
                id="budget"
                type="number"
                name="budget"
                placeholder="0"
                min="0"
                step="100"
                value={formData.budget}
                onChange={handleChange}
              />
            </div>
            <div className="form-group">
              <label htmlFor="status">Status</label>
              <select
                id="status"
                name="status"
                value={formData.status}
                onChange={handleChange}
              >
                <option value="PLANNING">Planning</option>
                <option value="IN_PROGRESS">In Progress</option>
                <option value="ON_HOLD">On Hold</option>
                <option value="COMPLETED">Completed</option>
                <option value="CANCELLED">Cancelled</option>
              </select>
            </div>
          </div>

          <div className="create-project-actions">
            <button type="submit" className="create-project-submit" disabled={loading}>
              {loading ? 'Creating...' : 'Create Project'}
            </button>
            <button
              type="button"
              className="create-project-cancel"
              onClick={() => navigate('/dashboard')}
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateProject;
