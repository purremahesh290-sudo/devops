/**
 * @fileoverview Add Task page for the Construction Progress Tracker.
 * Provides a form to add a new task to a project with fields for
 * title, description, assigned to, due date, status, and progress slider.
 */
import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../api/axios';
import './AddTask.css';

/**
 * AddTask page component with task creation form.
 * Includes a progress slider for visual progress input.
 * @returns {JSX.Element} The add task page
 */
const AddTask = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    assignedTo: '',
    dueDate: '',
    status: 'PENDING',
    progress: 0,
    notes: '',
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
   * Handles progress slider changes.
   * @param {React.ChangeEvent} e - The range input change event
   */
  const handleProgressChange = (e) => {
    setFormData((prev) => ({ ...prev, progress: parseInt(e.target.value, 10) }));
  };

  /**
   * Handles form submission to create a new task.
   * Sends task data to the API and navigates back to project detail.
   * @param {React.FormEvent} e - The form submit event
   */
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const payload = {
        ...formData,
        progress: parseInt(formData.progress, 10),
      };
      await api.post(`/api/projects/${id}/tasks`, payload);
      navigate(`/projects/${id}`);
    } catch (err) {
      setError(
        err.response?.data?.detail ||
        err.response?.data?.message ||
        'Failed to create task.'
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="add-task-page">
      <div className="add-task-header">
        <h1>&#x2795; Add Task</h1>
        <p>Create a new task for this project</p>
      </div>

      <div className="add-task-card">
        {error && <div className="add-task-error">{error}</div>}

        <form className="add-task-form" onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="title">Task Title</label>
            <input
              id="title"
              type="text"
              name="title"
              placeholder="Enter task title"
              value={formData.title}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="description">Description</label>
            <textarea
              id="description"
              name="description"
              placeholder="Describe the task"
              value={formData.description}
              onChange={handleChange}
            />
          </div>

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="assignedTo">Assigned To</label>
              <input
                id="assignedTo"
                type="text"
                name="assignedTo"
                placeholder="Worker name"
                value={formData.assignedTo}
                onChange={handleChange}
              />
            </div>
            <div className="form-group">
              <label htmlFor="dueDate">Due Date</label>
              <input
                id="dueDate"
                type="date"
                name="dueDate"
                value={formData.dueDate}
                onChange={handleChange}
              />
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="status">Status</label>
            <select
              id="status"
              name="status"
              value={formData.status}
              onChange={handleChange}
            >
              <option value="PENDING">Pending</option>
              <option value="IN_PROGRESS">In Progress</option>
              <option value="COMPLETED">Completed</option>
              <option value="BLOCKED">Blocked</option>
            </select>
          </div>

          <div className="form-group progress-slider-group">
            <div className="progress-slider-header">
              <label>Progress</label>
              <span className="progress-slider-value">{formData.progress}%</span>
            </div>
            <input
              type="range"
              className="progress-slider"
              min="0"
              max="100"
              step="5"
              value={formData.progress}
              onChange={handleProgressChange}
            />
          </div>

          <div className="form-group">
            <label htmlFor="notes">Notes</label>
            <textarea
              id="notes"
              name="notes"
              placeholder="Additional notes"
              value={formData.notes}
              onChange={handleChange}
            />
          </div>

          <div className="add-task-actions">
            <button type="submit" className="add-task-submit" disabled={loading}>
              {loading ? 'Adding...' : 'Add Task'}
            </button>
            <button
              type="button"
              className="add-task-cancel"
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

export default AddTask;
