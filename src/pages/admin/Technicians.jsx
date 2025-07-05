// src/pages/admin/TechnicianList.js
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { TechnicianCard } from '../../components/TechnicianCard';
import { AssignedRequestsModal } from '../../components/AssignedRequestsModal';
import { Search } from 'lucide-react';

const API_BASE_URL = process.env.REACT_APP_API_URL;

export const Technicians = () => {
  const [search, setSearch] = useState('');
  const [technicians, setTechnicians] = useState([]);
  const [availableIds, setAvailableIds] = useState([]);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [assignedRequests, setAssignedRequests] = useState([]);

  const token = localStorage.getItem('token');
  const headers = { Authorization: `Bearer ${token}` };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [allTechsRes, availableTechsRes] = await Promise.all([
          axios.get(`${API_BASE_URL}/admin/all-technicians`, { headers }),
          axios.get(`${API_BASE_URL}/admin/available-technicians`, { headers })
        ]);

        setTechnicians(allTechsRes.data);
        setAvailableIds(availableTechsRes.data.map(t => t.id));
      } catch (err) {
        console.error('Failed to load technician data:', err);
      }
    };

    fetchData();
  }, []);

  const handleViewRequests = async (technicianId) => {
    try {
      const res = await axios.get(`${API_BASE_URL}/admin/technician-assigned-requests`, {
        headers,
        params: { technicianId }
      });
      setAssignedRequests(res.data);
      setIsModalOpen(true);
    } catch (err) {
      console.error('Error fetching assigned requests:', err);
      alert('Could not load assigned requests.');
    }
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setAssignedRequests([]);
  };

  const filtered = technicians.filter((tech) =>
    `${tech.firstName} ${tech.lastName}`.toLowerCase().includes(search.toLowerCase()) ||
    tech.specialization.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <h2 className="text-3xl font-bold text-gray-900 mb-8">Technicians</h2>

        {/* Search Bar */}
        <div className="mb-8">
          <div className="relative max-w-md">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="text"
              placeholder="Search by name or specialization..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
        </div>

        {/* Technicians Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filtered.map((tech) => (
            <TechnicianCard
              key={tech.id}
              technician={tech}
              isAvailable={availableIds.includes(tech.id)}
              onViewRequests={handleViewRequests}
            />
          ))}
        </div>

        {/* Empty State */}
        {filtered.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-600">
              {search ? 'No technicians found matching your search.' : 'No technicians available.'}
            </p>
          </div>
        )}

        {/* Modal */}
        {isModalOpen && (
          <AssignedRequestsModal
            requests={assignedRequests}
            onClose={closeModal}
          />
        )}
      </div>
    </div>
  );
};
