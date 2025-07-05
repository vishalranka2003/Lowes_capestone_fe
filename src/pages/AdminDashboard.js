import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { Bell, AlertTriangle, Users, Wrench, CheckCircle, Package, Clock } from 'lucide-react';

const API_BASE_URL = process.env.REACT_APP_API_URL;

export const AdminDashboard = () => {
  const [stats, setStats] = useState(null);
  const [recentRequests, setRecentRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [technicianNames, setTechnicianNames] = useState([]);
  const [expiringSoonCount, setExpiringSoonCount] = useState(0);

  useEffect(() => {
    const token = localStorage.getItem('token');

    const headers = {
      Authorization: `Bearer ${token}`
    };

    Promise.all([
      axios.get(`${API_BASE_URL}/admin/stats`, { headers }),
      axios.get(`${API_BASE_URL}/admin/recent-service-requests`, { headers }),
      axios.get(`${API_BASE_URL}/admin/available-technicians`, { headers }),
      axios.get(`${API_BASE_URL}/api/notifications/expiring-soon`, { headers })
    ])
      .then(([statsRes, recentRes, techRes, expiringRes]) => {
        setStats(statsRes.data);
        setRecentRequests(recentRes.data.body);
        const names = techRes.data.map(t => `${t.firstName} ${t.lastName}`);
        setTechnicianNames(names);
        setExpiringSoonCount(expiringRes.data.length);
        setLoading(false)
      })
      .catch((error) => {
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
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-red-600">Failed to load dashboard data.</div>
      </div>
    );
  }

  const summaryData = [
    { 
      title: 'Total Technicians', 
      value: stats.totalTechnicians, 
      icon: Users,
      color: 'bg-blue-500'
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
        return 'bg-yellow-100 text-yellow-800';
      case 'assigned':
        return 'bg-blue-100 text-blue-800';
      case 'in_progress':
        return 'bg-sky-100 text-sky-800';
      case 'completed':
        return 'bg-green-100 text-green-800';
      case 'cancelled':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

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
        <section className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-8">
          <h3 className="text-xl font-semibold text-gray-900 mb-6">Recent Service Requests</h3>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="text-left py-3 px-4 text-sm font-medium text-gray-600">Request ID</th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-gray-600">Created At</th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-gray-600">Homeowner</th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-gray-600">Appliance</th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-gray-600">Technician</th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-gray-600">Status</th>
                </tr>
              </thead>
              <tbody>
                {recentRequests.map((req, idx) => (
                  <tr key={idx} className="border-b border-gray-100 hover:bg-gray-50">
                    <td className="py-3 px-4 text-sm text-gray-900">{req.id}</td>
                    <td className="py-3 px-4 text-sm text-gray-600">
                      {new Date(req.createdAt).toLocaleString('en-IN', {
                        day: '2-digit',
                        month: 'short',
                        year: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit'
                      })}
                    </td>
                    <td className="py-3 px-4 text-sm text-gray-900">{req.homeownerName}</td>
                    <td className="py-3 px-4 text-sm text-gray-600">
                      {req.applianceName} ({req.serialNumber})
                    </td>
                    <td className="py-3 px-4 text-sm text-gray-600">{req.technicianName || '—'}</td>
                    <td className="py-3 px-4">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(req.status)}`}>
                        {req.status.replace('_', ' ').toLowerCase().replace(/\b\w/g, c => c.toUpperCase())}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        {/* Warranties Expiring Soon */}
        {expiringSoonCount > 0 && (
          <section className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-8">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xl font-semibold text-gray-900 flex items-center gap-2">
                <AlertTriangle className="h-5 w-5 text-red-500" />
                Warranties Expiring Soon
              </h3>
              <Link 
                to="/dashboard/admin/notifications" 
                className="flex items-center gap-2 text-blue-600 hover:text-blue-700 font-medium text-sm transition-colors"
              >
                <Bell className="h-4 w-4" />
                View All Notifications
              </Link>
            </div>
            <div className="flex items-center gap-3 p-4 bg-red-50 border border-red-200 rounded-lg">
              <AlertTriangle className="h-5 w-5 text-red-500 flex-shrink-0" />
              <span className="text-red-700">
                {expiringSoonCount} appliance{expiringSoonCount !== 1 ? 's' : ''} have warranties expiring in the next 7 days.
              </span>
            </div>
          </section>
        )}
        
        {/* Technician Availability */}
        <section className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h3 className="text-xl font-semibold text-gray-900 mb-6">Technician Availability</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {technicianNames.map((name, idx) => (
              <div key={idx} className="flex items-center gap-3 p-3 bg-green-50 border border-green-200 rounded-lg">
                <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                <span className="text-green-800 font-medium">{name}</span>
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
};
