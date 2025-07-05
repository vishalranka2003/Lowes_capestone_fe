// src/pages/admin/ServiceRequests.jsx
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { ServiceRequestCard } from '../../components/ServiceRequestCard';

const API_BASE_URL = process.env.REACT_APP_API_URL;

export const ServiceRequests = () => {
  const [serviceRequests, setServiceRequests] = useState([]);
  const [availableTechnicians, setAvailableTechnicians] = useState([]);
  const [loading, setLoading] = useState(true);

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
    } finally {
      setLoading(false);
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

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-gray-600">Loading service requests...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <h2 className="text-3xl font-bold text-gray-900 mb-8">Service Requests</h2>
        
        {serviceRequests.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-600">No service requests available.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {serviceRequests.map((req) => (
              <ServiceRequestCard
                key={req.id}
                request={req}
                availableTechnicians={availableTechnicians}
                onAllocate={handleAllocate}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
