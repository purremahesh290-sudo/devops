/**
 * @fileoverview Edit Task page for the Construction Progress Tracker.
 * Provides a pre-populated form to edit an existing task with
 * title, description, assigned to, due date, status, progress slider, and notes.
 */
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../api/axios';
import './EditTask.css';

/**
 * EditTask page component with pre-populated task edit form.
 * Loads existing task data and allows users to modify all fields.
 * Features an orange-themed progress slider.
 * @returns {JSX.Element} The edit task page
 */
const EditTask = () => {
  const { id, taskId } = useParams();
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
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  /**
   * Fetches the existing task data to pre-populate the form.
   */
  useEffect(() => {
    const fetchTask = async () => {
      try {
        const response = await api.get(`/api/projects/${id}/tasks`);
        const task = response.data.find((t) => String(t.id) === String(taskId));
        if (task) {
          setFormData({
            title: task.title || '',
            description: task.description || '',
            assignedTo: task.assignedTo || '',
            dueDate: task.dueDate ? task.dueDate.split('T')[0] : '',
            status: task.status || 'PENDING',
            progress: task.progress || 0,
            notes: task.notes || '',
          });
        } else {
          setError('Task not found.');
        }
      } catch (err) {
        setError(
          err.response?.data?.detail ||
          'Failed to load task data.'
        );
      } finally {
        setLoading(false);
      }
    };
    fetchTask();
  }, [id, taskId]);

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
   * Handles form submission to update the task.
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
        progress: parseInt(formData.progress, 10),
      };
      await api.put(`/api/projects/${id}/tasks/${taskId}`, payload);
      navigate(`/projects/${id}`);
    } catch (err) {
      setError(
        err.response?.data?.detail ||
        err.response?.data?.message ||
        'Failed to update task.'
      );
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return <div className="edit-task-loading">Loading task data...</div>;
  }

  return (
    <div className="edit-task-page">
      <div className="edit-task-header">
        <h1>Edit Task</h1>
        <p>Update task details and progress</p>
      </div>

      <div className="edit-task-card">
        {error && <div className="edit-task-error">{error}</div>}

        <form className="edit-task-form" onSubmit={handleSubmit}>
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

          <div className="edit-task-actions">
            <button type="submit" className="edit-task-submit" disabled={saving}>
              {saving ? 'Saving...' : 'Save Changes'}
            </button>
            <button
              type="button"
              className="edit-task-cancel"
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

export default EditTask;
