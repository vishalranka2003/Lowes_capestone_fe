// src/components/ViewCompletionFormModal.jsx
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import '../styles/TechnicianDashboard.css'; // ✅ make sure your modal inherits your base styles

export default function ViewCompletionFormModal({ requestId, onClose }) {
  const [completionForm, setCompletionForm] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchCompletionForm = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await axios.get(
          `/technician/service-request/${requestId}/completion`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        setCompletionForm(response.data);
      } catch (error) {
        console.error('Error fetching completion form:', error);
        setError('No completion form found.');
      }
    };

    fetchCompletionForm();
  }, [requestId]);

  return (
    <div className="modal-backdrop">
      <div className="modal-content">
        <div className="modal-header">
          <h3 className="modal-title">📄 Completion Form Details</h3>
          <button className="modal-close-btn" onClick={onClose}>Close ✖</button>
        </div>

        {error && (
          <p style={{ color: 'red' }}>{error}</p>
        )}
        {!error && !completionForm && (
          <p>Loading...</p>
        )}
        {completionForm && (
          <div className="modal-body">
            <p><strong>Date:</strong> {completionForm.completionDate}</p>
            <p><strong>Time:</strong> {completionForm.completionTime}</p>
            <p><strong>Notes:</strong> {completionForm.technicianNotes}</p>
            <p><strong>Confirmed:</strong> {completionForm.confirmed ? 'Yes' : 'No'}</p>
          </div>
        )}
      </div>
    </div>
  );
}
