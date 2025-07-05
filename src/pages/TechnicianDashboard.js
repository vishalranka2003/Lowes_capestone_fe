import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Wrench, Clock, CheckCircle, List, User, Calendar } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { logout } from '../features/auth/authSlice';

const TechnicianDashboard = () => {
  const [stats, setStats] = useState(null);
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState('overview');
  const navigate = useNavigate();

  // Get user data from localStorage
  const username = localStorage.getItem('username') || 'User';
  const role = localStorage.getItem('role') || 'Technician';
  const dispatch = useDispatch();

  const handleLogout = () => {
    localStorage.clear();
    dispatch(logout());
    navigate('/');
  };

  useEffect(() => {
    const token = localStorage.getItem('token');
    const headers = { Authorization: `Bearer ${token}` };

    Promise.all([
      axios.get('/technician/stats', { headers }),
      axios.get('/technician/assigned-requests', { headers }),
    ])
      .then(([statsRes, requestsRes]) => {
        setStats(statsRes.data);
        setRequests(requestsRes.data);
        setLoading(false);
      })
      .catch(err => {
        console.error(err);
        setError(err.message);
        setLoading(false);
      });
  }, []);

  const handleStatusUpdate = (requestId, newStatus) => {
    const token = localStorage.getItem('token');

    axios
      .put(
        '/technician/update-status',
        { requestId, status: newStatus },
        { headers: { Authorization: `Bearer ${token}` } }
      )
      .then(() => {
        return axios.get('/technician/assigned-requests', {
          headers: { Authorization: `Bearer ${token}` },
        });
      })
      .then(res => {
        setRequests(res.data);
      })
      .catch(err => {
        console.error(err);
      });
  };

  const getRequestsForTab = () => {
    return requests.filter(req => {
      if (activeTab === 'assigned') return req.status === 'ASSIGNED';
      if (activeTab === 'in-progress') return req.status === 'IN_PROGRESS';
      if (activeTab === 'completed') return req.status === 'COMPLETED';
      return false;
    });
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'ASSIGNED':
        return 'bg-yellow-100 text-yellow-800';
      case 'IN_PROGRESS':
        return 'bg-blue-100 text-blue-800';
      case 'COMPLETED':
        return 'bg-green-100 text-green-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Sidebar */}
      <aside className="w-64 bg-white shadow-lg border-r border-gray-200 flex flex-col justify-between">
        <div>
          <div className="p-6">
            <div className="flex items-center space-x-2 mb-8">
              <Wrench className="h-8 w-8 text-blue-600" />
              <h2 className="text-xl font-bold text-gray-900">Service Pro</h2>
            </div>
            <h3 className="text-sm font-medium text-gray-500 uppercase tracking-wider mb-4">Technician Panel</h3>
          </div>
          <nav className="px-4">
            <button
              className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg mb-2 transition-colors duration-200 ${
                activeTab === 'overview' 
                  ? 'bg-blue-50 text-blue-700 border-r-2 border-blue-600' 
                  : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
              }`}
              onClick={() => setActiveTab('overview')}
            >
              <List className="h-5 w-5" />
              <span className="font-medium">Requests Overview</span>
            </button>
            <button
              className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg mb-2 transition-colors duration-200 ${
                activeTab === 'assigned' 
                  ? 'bg-blue-50 text-blue-700 border-r-2 border-blue-600' 
                  : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
              }`}
              onClick={() => setActiveTab('assigned')}
            >
              <Clock className="h-5 w-5" />
              <span className="font-medium">Assigned</span>
            </button>
            <button
              className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg mb-2 transition-colors duration-200 ${
                activeTab === 'in-progress' 
                  ? 'bg-blue-50 text-blue-700 border-r-2 border-blue-600' 
                  : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
              }`}
              onClick={() => setActiveTab('in-progress')}
            >
              <Wrench className="h-5 w-5" />
              <span className="font-medium">In Progress</span>
            </button>
            <button
              className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg mb-2 transition-colors duration-200 ${
                activeTab === 'completed' 
                  ? 'bg-blue-50 text-blue-700 border-r-2 border-blue-600' 
                  : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
              }`}
              onClick={() => setActiveTab('completed')}
            >
              <CheckCircle className="h-5 w-5" />
              <span className="font-medium">Completed</span>
            </button>
          </nav>
        </div>
        {/* User Info at bottom */}
        <div className="p-6 border-t border-gray-100">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-bold text-lg">
              {username.charAt(0).toUpperCase()}
            </div>
            <div>
              <div className="text-sm font-semibold text-gray-900">{username}</div>
              <div className="text-xs text-gray-500">{role}</div>
            </div>
          </div>
          <button 
            onClick={handleLogout}
            className="mt-4 w-full px-3 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg text-sm font-medium transition-colors"
          >
            Logout
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col overflow-hidden">
        <div className="flex-1 overflow-auto p-6">
          {activeTab === 'overview' && stats && (
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-8">
              <h3 className="text-xl font-semibold text-gray-900 mb-6">Requests Overview</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="text-2xl font-bold text-yellow-800">{stats.assignedCount ?? 0}</div>
                      <div className="text-sm text-yellow-600">Assigned</div>
                    </div>
                    <Clock className="h-8 w-8 text-yellow-600" />
                  </div>
                </div>
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="text-2xl font-bold text-blue-800">{stats.inProgressCount ?? 0}</div>
                      <div className="text-sm text-blue-600">In Progress</div>
                    </div>
                    <Wrench className="h-8 w-8 text-blue-600" />
                  </div>
                </div>
                <div className="bg-green-50 border border-green-200 rounded-lg p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="text-2xl font-bold text-green-800">{stats.completedCount ?? 0}</div>
                      <div className="text-sm text-green-600">Completed</div>
                    </div>
                    <CheckCircle className="h-8 w-8 text-green-600" />
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab !== 'overview' && (
            <>
              {loading && (
                <div className="flex items-center justify-center py-12">
                  <div className="text-gray-600">Loading...</div>
                </div>
              )}
              {error && (
                <div className="bg-red-50 border border-red-200 text-red-800 p-4 rounded-lg mb-6">
                  Error: {error}
                </div>
              )}

              <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-gray-200 bg-gray-50">
                        <th className="text-left py-3 px-4 text-sm font-medium text-gray-600">ID</th>
                        <th className="text-left py-3 px-4 text-sm font-medium text-gray-600">Appliance</th>
                        <th className="text-left py-3 px-4 text-sm font-medium text-gray-600">Issue</th>
                        <th className="text-left py-3 px-4 text-sm font-medium text-gray-600">Homeowner</th>
                        <th className="text-left py-3 px-4 text-sm font-medium text-gray-600">Status</th>
                        <th className="text-left py-3 px-4 text-sm font-medium text-gray-600">Preferred Slot</th>
                        <th className="text-left py-3 px-4 text-sm font-medium text-gray-600">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {getRequestsForTab().length === 0 && !loading ? (
                        <tr>
                          <td colSpan="7" className="text-center py-8 text-gray-500">
                            No requests to show.
                          </td>
                        </tr>
                      ) : (
                        getRequestsForTab().map(request => (
                          <tr key={request.id} className="border-b border-gray-100 hover:bg-gray-50">
                            <td className="py-3 px-4 text-sm text-gray-900">{request.id}</td>
                            <td className="py-3 px-4 text-sm text-gray-600">{request.applianceInfo}</td>
                            <td className="py-3 px-4 text-sm text-gray-600">{request.issueDescription}</td>
                            <td className="py-3 px-4 text-sm text-gray-600">{request.homeownerName}</td>
                            <td className="py-3 px-4">
                              <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(request.status)}`}>
                                {request.status}
                              </span>
                            </td>
                            <td className="py-3 px-4 text-sm text-gray-600">
                              {new Date(request.preferredSlot).toLocaleString()}
                            </td>
                            <td className="py-3 px-4">
                              {request.status !== 'COMPLETED' && (
                                <>
                                  {request.status === 'ASSIGNED' && (
                                    <button
                                      className="px-3 py-1 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm"
                                      onClick={() => handleStatusUpdate(request.id, 'IN_PROGRESS')}
                                    >
                                      Mark In Progress
                                    </button>
                                  )}
                                  {request.status === 'IN_PROGRESS' && (
                                    <button
                                      className="px-3 py-1 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors text-sm"
                                      onClick={() => handleStatusUpdate(request.id, 'COMPLETED')}
                                    >
                                      Mark Completed
                                    </button>
                                  )}
                                </>
                              )}
                            </td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </>
          )}
        </div>
      </main>
    </div>
  );
};

export default TechnicianDashboard;
