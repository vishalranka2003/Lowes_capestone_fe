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

      setServiceRequests(requestsRes.data.body);
      setAvailableTechnicians(
        techsRes.data.map((t) => ({
          id: t.id,
          name: `${t.firstName} ${t.lastName}`,
          specialization: t.specialization,
        }))
      );
    } catch (err) {
      console.error('Error loading service request data:', err);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleAllocate = async (requestId, technicianId) => {
    const token = localStorage.getItem('token');
    const headers = { Authorization: `Bearer ${token}` };

    try {
      await axios.post(`${API_BASE_URL}/admin/assign-technician`, null, {
        params: { technicianId, requestId },
        headers,
      });
      fetchData(); // Refresh after assigning
    } catch (err) {
      console.error('Allocation failed:', err);
      alert('Failed to assign technician.');
    }
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
