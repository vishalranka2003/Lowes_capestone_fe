// src/pages/admin/ServiceRequests.jsx
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { ServiceRequestCard } from '../../components/ServiceRequestCard';
import { Search } from 'lucide-react';

const API_BASE_URL = process.env.REACT_APP_API_URL;

export const ServiceRequests = () => {
  const [serviceRequests, setServiceRequests] = useState([]);
  const [availableTechnicians, setAvailableTechnicians] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  const fetchData = async () => {
    const token = localStorage.getItem('token');
    const headers = { Authorization: `Bearer ${token}` };

    try {
      const [requestsRes, techsRes] = await Promise.all([
        axios.get(`${API_BASE_URL}/admin/all-service-requests`, { headers }),
        axios.get(`${API_BASE_URL}/admin/available-technicians`, { headers }),
      ]);

      // API now returns a raw array for service requests
      setServiceRequests(Array.isArray(requestsRes.data) ? requestsRes.data : []);

      setAvailableTechnicians(
        Array.isArray(techsRes.data)
          ? techsRes.data.map((t) => ({
              id: t.id,
              name: `${t.firstName} ${t.lastName}`,
              specialization: t.specialization,
            }))
          : []
      );
      setLoading(false);
    } catch (err) {
      console.error('Error loading service request data:', err);
      setServiceRequests([]);
      setAvailableTechnicians([]);
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

  const filtered = serviceRequests.filter((req) =>
    req.homeownerName.toLowerCase().includes(search.toLowerCase()) ||
    req.applianceName.toLowerCase().includes(search.toLowerCase()) ||
    req.status.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <h2 className="text-3xl font-bold text-gray-900 mb-8">Service Requests</h2>
        {/* Search Bar */}
        <div className="mb-8">
          <div className="relative max-w-md">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="text"
              placeholder="Search by homeowner, appliance, or status..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-2 focus:ring-lowesBlue-500 focus:border-lowesBlue-500"
            />
          </div>
        </div>
        {filtered.length === 0 ? (
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-12 text-center">
            <p className="text-gray-600 text-lg">{search ? 'No service requests found matching your search.' : 'No service requests available at the moment.'}</p>
            <p className="text-gray-500 text-sm mt-2">New requests will appear here when homeowners submit them.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filtered.map((req) => (
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
