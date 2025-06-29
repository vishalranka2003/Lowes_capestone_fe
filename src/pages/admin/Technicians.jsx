// src/pages/admin/TechnicianList.js
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import '../../styles/AdminDashboard.css';

const API_BASE_URL = process.env.REACT_APP_API_URL;

export const Technicians = () => {
  const [search, setSearch] = useState('');
  const [technicians, setTechnicians] = useState([]);

  useEffect(() => {
    const token = localStorage.getItem('token');
    const headers = { Authorization: `Bearer ${token}` };

    axios.get(`${API_BASE_URL}/admin/all-technicians`, { headers })
      .then((res) => {
        setTechnicians(res.data); // assuming res.data is the array of technicians
      })
      .catch((err) => {
        console.error('Failed to fetch technicians:', err);
      });
  }, []);

  const filteredTechnicians = technicians.filter((tech) =>
    (`${tech.firstName} ${tech.lastName}`.toLowerCase().includes(search.toLowerCase()) ||
    tech.specialization.toLowerCase().includes(search.toLowerCase()))
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

      <div className="requests-table">
        <div className="dashboard-row dashboard-header">
          <div>Name</div>
          <div>Email</div>
          <div>Phone Number</div>
          <div>Specialization</div>
        </div>

        {filteredTechnicians.map((tech, idx) => (
          <div className="dashboard-row" key={idx}>
            <div>{tech.firstName} {tech.lastName}</div>
            <div>{tech.email}</div>
            <div>{tech.phoneNumber}</div>
            <div>
              {tech.specialization}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
