// src/pages/admin/ServiceRequests.jsx
import React from 'react';
import { ServiceRequestCard } from '../../components/ServiceRequestCard';
import '../../styles/ServiceCard.css';

export const ServiceRequests = () => {
  const serviceRequests = [
    {
      id: 1,
      applianceName: 'LG Washing Machine',
      serialNumber: 'SN123456',
      homeownerName: 'John Doe',
      status: 'REQUESTED',
    },
    {
      id: 2,
      applianceName: 'Samsung AC',
      serialNumber: 'SN987654',
      homeownerName: 'Jane Smith',
      status: 'ASSIGNED',
      technicianName: 'Amit Gupta',
    },
  ];

  const availableTechnicians = [
    { id: 101, name: 'Amit Gupta', specialization: 'Washing Machines' },
    { id: 102, name: 'Sneha Rao', specialization: 'Air Conditioners' },
  ];

  const handleAllocate = (requestId, technicianId) => {
    console.log(`Assign technician ${technicianId} to request ${requestId}`);
  };

  return (
    <div className="admin-dashboard">
      <h2 className="dashboard-title">Service Requests</h2>
      <div className="card-grid">
        {serviceRequests.map((req) => (
          <ServiceRequestCard
            key={req.id}
            request={req}
            availableTechnicians={availableTechnicians}
            onAllocate={handleAllocate}
          />
        ))}
      </div>
    </div>
  );
};
