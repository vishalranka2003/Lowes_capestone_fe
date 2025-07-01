import React from 'react';
import '../styles/AssignedRequestModal.css';

export const AssignedRequestsModal = ({ requests, onClose }) => {
  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <div className="modal-header">
          <h3>Assigned Service Requests</h3>
          <button className="close-button" onClick={onClose}>✖</button>
        </div>

        <div className="modal-body">
          {requests.length === 0 ? (
            <p>No assigned requests found.</p>
          ) : (
            requests.map(req => (
              <div key={req.id} className="request-card">
                <p><strong>ID:</strong> {req.id}</p>
                <p><strong>Issue:</strong> {req.issueDescription}</p>
                <p><strong>Status:</strong> {req.status}</p>
                <p><strong>Appliance:</strong> {req.applianceInfo}</p>
                <p><strong>Homeowner:</strong> {req.homeownerName}</p>
                <p><strong>Preferred Slot:</strong> {new Date(req.preferredSlot).toLocaleString()}</p>
                <p><strong>Created At:</strong> {new Date(req.createdAt).toLocaleString()}</p>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};
