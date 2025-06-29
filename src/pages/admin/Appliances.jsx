// src/pages/admin/Appliances.js
import React, { useEffect, useState } from 'react';
import { AdminApplianceCard } from '../../components/AdminApplianceCard';
import '../../styles/ApplianceCard.css';
import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_API_URL;

export const Appliances = () => {
  const [appliances, setAppliances] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('token');

    axios.get(`${API_BASE_URL}/admin/all-appliances`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
    .then((response) => {
      setAppliances(response.data); // ✅ assumes response is the array
      setLoading(false);
    })
    .catch((error) => {
      console.error('Error fetching appliances:', error);
      setLoading(false);
    });
  }, []);

  return (
    <div className="admin-dashboard">
      <h2 className="dashboard-title">Appliances</h2>

      {loading ? (
        <div className="text-center mt-10">Loading appliances...</div>
      ) : appliances.length === 0 ? (
        <div className="text-center mt-10 text-gray-500">No appliances found.</div>
      ) : (
        <div className="card-grid">
          {appliances.map((appliance) => (
            <AdminApplianceCard key={appliance.id} appliance={appliance} />
          ))}
        </div>
      )}
    </div>
  );
};
