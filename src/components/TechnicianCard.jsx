// src/components/TechnicianCard.jsx
import React from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/TechnicianCard.css';

export const TechnicianCard = ({ technician, isAvailable, onViewRequests }) => {
  const navigate = useNavigate();

  const handleClick = () => {
    if (isAvailable) {
      alert('This technician has no assigned requests.');
    } else {
      onViewRequests(technician.id);
    }
  };

  const handleNameClick = () => {
    navigate(`/dashboard/admin/technicians/${technician.id}`, { state: { technician } });
  };

  return (
    <div className="technician-card">
      <div className="appliance-header">
        <h3 className="appliance-title technician-name-clickable" onClick={handleNameClick}>
          {technician.firstName} {technician.lastName}
        </h3>
        <span className={`status-badge ${isAvailable ? 'status-available' : 'status-assigned'}`}>
          {isAvailable ? 'Available' : 'Assigned'}
        </span>
      </div>
      <div className="appliance-info">
        <p><strong>Email:</strong> {technician.email}</p>
        <p><strong>Phone:</strong> {technician.phoneNumber}</p>
        <p><strong>Specialization:</strong> {technician.specialization}</p>
        <p><strong>Experience:</strong> {technician.experience} years</p>
      </div>
      <button
        className={`btn-primary ${isAvailable ? 'btn-disabled' : ''}`}
        onClick={handleClick}
        disabled={isAvailable}
      >
        View Assigned Requests
      </button>
    </div>
  );
};
