// src/pages/admin/ServiceRequests.jsx
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { ServiceRequestCard } from '../../components/ServiceRequestCard';
import '../../styles/ServiceCard.css';

const API_BASE_URL = process.env.REACT_APP_API_URL;

export const ServiceRequests = () => {
  const [serviceRequests, setServiceRequests] = useState([]);
  const [availableTechnicians, setAvailableTechnicians] = useState([]);

  const fetchData = async () => {
    const token = localStorage.getItem('token');
    const headers = { Authorization: `Bearer ${token}` };

    try {
      const [requestsRes, techsRes] = await Promise.all([
        axios.get(`${API_BASE_URL}/admin/all-service-requests`, { headers }),
        axios.get(`${API_BASE_URL}/admin/available-technicians`, { headers }),
      ]);

      // API now returns a raw array for service requests
      setServiceRequests(Array.isArray(requestsRes.data.body) ? requestsRes.data.body : []);

      setAvailableTechnicians(
        Array.isArray(techsRes.data)
          ? techsRes.data.map((t) => ({
              id: t.id,
              name: `${t.firstName} ${t.lastName}`,
              specialization: t.specialization,
            }))
          : []
      );
    } catch (err) {
      console.error('Error loading service request data:', err);
      setServiceRequests([]);
      setAvailableTechnicians([]);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <div className="admin-dashboard">
      <h2 className="dashboard-title">Service Requests</h2>
      <div className="card-grid">
        {Array.isArray(serviceRequests) &&
          serviceRequests.map((req) => (
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

  // Allocation handler must be declared inside component
  async function handleAllocate(requestId, technicianId) {
    const token = localStorage.getItem('token');
    const headers = { Authorization: `Bearer ${token}` };

    try {
      await axios.post(
        `${API_BASE_URL}/admin/assign-technician`,
        null,
        { params: { technicianId, requestId }, headers }
      );
      fetchData(); // Refresh after assigning
    } catch (err) {
      console.error('Allocation failed:', err);
      alert('Failed to assign technician.');
    }
  }
};
