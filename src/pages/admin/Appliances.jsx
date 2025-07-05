// src/pages/admin/Appliances.js
import React, { useEffect, useState } from 'react';
import { AdminApplianceCard } from '../../components/AdminApplianceCard';
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
    <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <h2 className="text-3xl font-bold text-gray-900 mb-8">Appliances</h2>

        {loading ? (
          <div className="flex items-center justify-center py-12">
            <div className="text-gray-600">Loading appliances...</div>
          </div>
        ) : appliances.length === 0 ? (
          <div className="text-center py-12">
            <div className="text-gray-500">No appliances found.</div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {appliances.map((appliance) => (
              <AdminApplianceCard key={appliance.id} appliance={appliance} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
