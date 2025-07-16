// src/pages/admin/Appliances.js
import React, { useEffect, useState } from 'react';
import { AdminApplianceCard } from '../../components/AdminApplianceCard';
import axios from 'axios';
import { Search } from 'lucide-react';

const API_BASE_URL = process.env.REACT_APP_API_URL;

export const Appliances = () => {
  const [appliances, setAppliances] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

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

  const filtered = appliances.filter((appliance) =>
    appliance.brand.toLowerCase().includes(search.toLowerCase()) ||
    appliance.modelNumber.toLowerCase().includes(search.toLowerCase()) ||
    appliance.homeownerName.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <h2 className="text-3xl font-bold text-gray-900 mb-8">Appliances</h2>

        {/* Search Bar */}
        <div className="mb-8">
          <div className="relative max-w-md">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="text"
              placeholder="Search by brand, model, or homeowner..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
        </div>

        {/* Appliances Grid */}
        {loading ? (
          <div className="flex items-center justify-center py-12">
            <div className="text-gray-600">Loading appliances...</div>
          </div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-12">
            <div className="text-gray-500">{search ? 'No appliances found matching your search.' : 'No appliances found.'}</div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filtered.map((appliance) => (
              <AdminApplianceCard key={appliance.id} appliance={appliance} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
