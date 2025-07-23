import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Users, Wrench, CheckCircle, Package, Clock } from 'lucide-react';
import DataTable from '../components/DataTable';

const API_BASE_URL = process.env.REACT_APP_API_URL;

export const AdminDashboard = () => {
  const [stats, setStats] = useState(null);
  const [recentRequests, setRecentRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [technicianNames, setTechnicianNames] = useState([]);
  const [expiringSoonCount, setExpiringSoonCount] = useState(0);

  useEffect(() => {
    const token = localStorage.getItem('token');
    const headers = { Authorization: `Bearer ${token}` };

    Promise.all([
      axios.get(`${API_BASE_URL}/admin/stats`, { headers }),
      axios.get(`${API_BASE_URL}/admin/recent-service-requests`, { headers }),
      axios.get(`${API_BASE_URL}/admin/available-technicians`, { headers }),
      axios.get(`${API_BASE_URL}/api/notifications/expiring-soon`, { headers })
    ])
      .then(([statsRes, recentRes, techRes, expiringRes]) => {
        setStats(statsRes.data);
        // API now returns a raw array for recent requests
        setRecentRequests(recentRes.data);
        const names = techRes.data.map(t => `${t.firstName} ${t.lastName}`);
        setTechnicianNames(names);
        setExpiringSoonCount(expiringRes.data.length || 0);
        setLoading(false);
      })
      .catch(error => {
        console.error('Error fetching admin dashboard data:', error);
        setLoading(false);
      });
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-gray-600">Loading dashboard data...</div>
      </div>
    );
  }

  if (!stats) {
    return <div className="text-center mt-10 text-red-500">
      Failed to load dashboard data.
    </div>;
  }

  const summaryData = [
    { 
      title: 'Total Technicians', 
      value: stats.totalTechnicians, 
      icon: Users,
      color: 'bg-lowesBlue-500'
    },
    { 
      title: 'Open Service Requests', 
      value: stats.pendingRequests, 
      icon: Wrench,
      color: 'bg-yellow-500'
    },
    { 
      title: 'Completed Requests', 
      value: stats.completedRequests, 
      icon: CheckCircle,
      color: 'bg-green-500'
    },
    { 
      title: 'Supported Appliance Models', 
      value: stats.totalAppliances, 
      icon: Package,
      color: 'bg-purple-500'
    },
    { 
      title: 'Warranties Expiring Soon', 
      value: expiringSoonCount, 
      icon: Clock,
      color: expiringSoonCount > 0 ? 'bg-red-500' : 'bg-gray-500',
      highlight: expiringSoonCount > 0 
    },
  ];

  const getStatusColor = (status) => {
    switch (status.toLowerCase()) {
      case 'requested':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'assigned':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'in_progress':
        return 'bg-sky-100 text-sky-800 border-sky-200';
      case 'completed':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'cancelled':
        return 'bg-red-100 text-red-800 border-red-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const headers = [
    { label: 'Request ID', key: 'id' },
    { label: 'Created At', key: 'createdAt' },
    { label: 'Homeowner', key: 'homeownerName' },
    { label: 'Appliance', key: 'applianceName' },
    { label: 'Technician', key: 'technicianName' },
    { label: 'Status', key: 'status' },
  ];

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <h2 className="text-3xl font-bold text-gray-900 mb-8">Admin Overview</h2>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6 mb-8">
          {summaryData.map((item, idx) => (
            <div 
              key={idx} 
              className={`bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow duration-200 ${
                item.highlight ? 'ring-2 ring-red-200' : ''
              }`}
            >
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-2xl font-bold text-gray-900">{item.value}</div>
                  <div className="text-sm text-gray-600 mt-1">{item.title}</div>
                </div>
                <div className={`p-3 rounded-lg ${item.color} text-white`}>
                  <item.icon className="h-6 w-6" />
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Recent Service Requests */}
        <DataTable 
          title="Recent Service Requests"
          headers={headers}
          
          data={recentRequests.map(request => ({
            ...request,
            createdAt: new Date(request.createdAt).toLocaleString()
          }))}
          getStatusColor={getStatusColor} 
        />

        {/* Technician Availability */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200">
          <div className="px-6 py-4 border-b border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900">Available Technicians</h3>
          </div>
          <div className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {technicianNames.map((name, idx) => (
                <div key={idx} className="flex items-center p-3 bg-gray-50 rounded-lg">
                  <div className="w-3 h-3 bg-green-500 rounded-full mr-3"></div>
                  <span className="text-sm font-medium text-gray-900">{name}</span>
                </div>
              ))}
            </div>
            {technicianNames.length === 0 && (
              <div className="text-center py-8 text-gray-500">
                No technicians available at the moment
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
