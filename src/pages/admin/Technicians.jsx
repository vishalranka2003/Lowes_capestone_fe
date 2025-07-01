// src/pages/admin/TechnicianList.js
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { TechnicianCard } from '../../components/TechnicianCard';
import { AssignedRequestsModal } from '../../components/AssignedRequestsModal';
import '../../styles/TechnicianCard.css';

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
    <div className="admin-dashboard">
      <h2 className="dashboard-title">Technicians</h2>

      <div className="search-bar">
        <input
          type="text"
          placeholder="Search by name or specialization..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      <div className="card-grid">
        {filtered.map((tech) => (
          <TechnicianCard
            key={tech.id}
            technician={tech}
            isAvailable={availableIds.includes(tech.id)}
            onViewRequests={handleViewRequests}
          />
        ))}
      </div>

      {/* Modal */}
      {isModalOpen && (
        <AssignedRequestsModal
          requests={assignedRequests}
          onClose={closeModal}
        />
      )}
    </div>
  );
};
