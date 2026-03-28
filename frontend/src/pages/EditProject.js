/**
 * @fileoverview Edit Project page for the Construction Progress Tracker.
 * Provides a pre-populated form to edit an existing construction project.
 * Fetches current project data and submits updates to the API.
 */
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../api/axios';
import './EditProject.css';

/**
 * EditProject page component with pre-populated edit form.
 * Loads existing project data and allows users to modify all fields.
 * @returns {JSX.Element} The edit project page
 */
const EditProject = () => {
  const { id } = useParams();
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
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  /**
   * Fetches the existing project data to pre-populate the form.
   */
  useEffect(() => {
    const fetchProject = async () => {
      try {
        const response = await api.get(`/api/projects/${id}`);
        const project = response.data;
        setFormData({
          name: project.name || '',
          description: project.description || '',
          location: project.location || '',
          startDate: project.startDate ? project.startDate.split('T')[0] : '',
          expectedEndDate: project.expectedEndDate ? project.expectedEndDate.split('T')[0] : '',
          budget: project.budget || '',
          status: project.status || 'PLANNING',
        });
      } catch (err) {
        setError(
          err.response?.data?.detail ||
          'Failed to load project data.'
        );
      } finally {
        setLoading(false);
      }
    };
    fetchProject();
  }, [id]);

  /**
   * Handles input field changes and updates form state.
   * @param {React.ChangeEvent} e - The input change event
   */
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  /**
   * Handles form submission to update the project.
   * Sends updated data to the API and navigates back to project detail.
   * @param {React.FormEvent} e - The form submit event
   */
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSaving(true);

    try {
      const payload = {
        ...formData,
        budget: formData.budget ? parseFloat(formData.budget) : 0,
      };
      await api.put(`/api/projects/${id}`, payload);
      navigate(`/projects/${id}`);
    } catch (err) {
      setError(
        err.response?.data?.detail ||
        err.response?.data?.message ||
        'Failed to update project.'
      );
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return <div className="edit-project-loading">Loading project data...</div>;
  }

  return (
    <div className="edit-project-page">
      <div className="edit-project-header">
        <h1>&#x270F; Edit Project</h1>
        <p>Update project details</p>
      </div>

      <div className="edit-project-card">
        {error && <div className="edit-project-error">{error}</div>}

        <form className="edit-project-form" onSubmit={handleSubmit}>
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

          <div className="edit-project-actions">
            <button type="submit" className="edit-project-submit" disabled={saving}>
              {saving ? 'Saving...' : 'Save Changes'}
            </button>
            <button
              type="button"
              className="edit-project-cancel"
              onClick={() => navigate(`/projects/${id}`)}
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditProject;
