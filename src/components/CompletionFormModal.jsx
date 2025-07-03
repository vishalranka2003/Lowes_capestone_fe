import React, { useState } from 'react';
import axios from 'axios';

export default function CompletionFormModal({ requestId, onSuccess, onClose }) {
  const [completionDate, setCompletionDate] = useState('');
  const [completionTime, setCompletionTime] = useState('');
  const [technicianNotes, setTechnicianNotes] = useState('');
  const [confirmed, setConfirmed] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem('token');

    console.log('Raw input date:', completionDate);
    console.log('Raw input time:', completionTime);
    console.log('Technician Notes:', technicianNotes);
    console.log('Confirmed:', confirmed);

    const formattedDate = completionDate;

    let formattedTime = completionTime;
    if (completionTime.length === 5) {
      formattedTime = `${completionTime}:00`;
    }

    const payload = {
      completionDate: formattedDate,
      completionTime: formattedTime,
      technicianNotes: technicianNotes,
      confirmed: confirmed,
    };

    try {
      const response = await axios.post(
        `/technician/service-request/${requestId}/completion`,
        payload,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      alert('Completion form submitted!');
      onSuccess();
    } catch (error) {
      console.error('API Error:', error);
      if (error.response) {
        console.error('Error Response Data:', error.response.data);
        console.error('Error Response Status:', error.response.status);
      }
      alert('Error submitting completion form');
    }
  };

  return (
    <div className="modal-backdrop">
      <div className="modal-content">
        <div className="modal-header">
          <h3 className="modal-title">Complete Request #{requestId}</h3>
          <button type="button" className="modal-close-btn" onClick={onClose}>
            Close
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <label>Date:</label>
          <input
            type="date"
            value={completionDate}
            onChange={(e) => setCompletionDate(e.target.value)}
            required
          />

          <label>Time:</label>
          <input
            type="time"
            value={completionTime}
            onChange={(e) => setCompletionTime(e.target.value)}
            required
          />

          <label>Technician Notes:</label>
          <textarea
            value={technicianNotes}
            onChange={(e) => setTechnicianNotes(e.target.value)}
            required
          />

          <label className="checkbox">
            <input
              type="checkbox"
              checked={confirmed}
              onChange={(e) => setConfirmed(e.target.checked)}
              required
            />{' '}
            Confirmed
          </label>

          <div className="modal-actions">
            <button type="button" className="btn-cancel" onClick={onClose}>
              Cancel
            </button>
            <button type="submit" className="btn-submit">
              Submit & Complete
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
