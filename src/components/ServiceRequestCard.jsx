// src/components/ServiceRequestCard.jsx
import React, { useState } from 'react';
import '../styles/ServiceCard.css';

export const ServiceRequestCard = ({ request, availableTechnicians, onAllocate }) => {
  const [selectedTechnician, setSelectedTechnician] = useState('');

  const handleAllocate = () => {
    if (selectedTechnician) {
      onAllocate(request.id, selectedTechnician);
    }
  };

  return (
    <div className="service-card">
      <div className="service-header">
        <h2 className="service-title">
          {request.applianceName}{' '}
          <span style={{ fontWeight: 'normal' }}>({request.serialNumber})</span>
        </h2>
        <span className={`status-badge status-${request.status.toLowerCase()}`}>
          {request.status.replace('_', ' ').toLowerCase()}
        </span>
      </div>

      <div className="service-body">
        <div className="service-row">
          <span>Homeowner:</span>
          <span>{request.homeownerName}</span>
        </div>

        {request.status !== 'REQUESTED' ? (
          <div className="service-row">
            <span>Technician:</span>
            <span>{request.technicianName || 'N/A'}</span>
          </div>
        ) : (
          <div className="allocate-section">
            <label>Allocate Technician</label>
            <select
              className="allocate-select"
              value={selectedTechnician}
              onChange={(e) => setSelectedTechnician(e.target.value)}
            >
              <option value="">-- Select Technician --</option>
              {availableTechnicians.map((tech) => (
                <option key={tech.id} value={tech.id}>
                  {tech.name} ({tech.specialization})
                </option>
              ))}
            </select>
            <button
              className="allocate-button"
              onClick={handleAllocate}
              disabled={!selectedTechnician}
            >
              ✅ Confirm
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
