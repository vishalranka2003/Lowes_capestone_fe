import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useDispatch } from 'react-redux';
import { logout } from '../features/auth/authSlice';
import CompletionFormModal from '../components/CompletionFormModal.jsx';
import ViewCompletionFormModal from '../components/ViewCompletionFormModal.jsx';
import { Clock, List, Wrench, CheckCircle, History, Package, User, Calendar } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const TechnicianDashboard = () => {
  const navigate = useNavigate();
  const [stats, setStats] = useState(null);
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState('service-history');

  const [showFormForRequest, setShowFormForRequest] = useState(null);
  const [showViewModal, setShowViewModal] = useState(false);
  const [selectedRequestId, setSelectedRequestId] = useState(null);
  const username = localStorage.getItem('username') || 'User';
  const role = localStorage.getItem('role') || 'Homeowner';
  const dispatch = useDispatch();
  const [serviceHistory, setServiceHistory] = useState([]);

  useEffect(() => {
    const token = localStorage.getItem('token');
    const headers = { Authorization: `Bearer ${token}` };
    const API_BASE_URL = process.env.REACT_APP_API_URL;

    Promise.all([
      axios.get(`${API_BASE_URL}/technician/stats`, { headers }),
      axios.get(`${API_BASE_URL}/technician/assigned-requests`, { headers }),
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

  useEffect(() => {
    if (activeTab !== 'service-history') return;

    const token = localStorage.getItem('token');
    const headers = { Authorization: `Bearer ${token}` };

    const fetchServiceHistory = async () => {
      try {
        const profileRes = await axios.get('/technician/profile', { headers });
        const technicianId = profileRes.data.id;

        const historyRes = await axios.get(
          `/technician/service-history/${technicianId}`,
          { headers }
        );

        setServiceHistory(Array.isArray(historyRes.data) ? historyRes.data : []);
      } catch (err) {
        console.error('Failed to load service history:', err);
        setServiceHistory([]);
      }
    };

    fetchServiceHistory();
  }, [activeTab]);

  const handleStatusUpdate = (requestId, newStatus) => {
    const token = localStorage.getItem('token');
    const API_BASE_URL = process.env.REACT_APP_API_URL;

    axios
      .put(
        `${API_BASE_URL}/technician/update-status`,
        { requestId, status: newStatus },
        { headers: { Authorization: `Bearer ${token}` } }
      )
      .then(() => {
        return axios.get(`${API_BASE_URL}/technician/assigned-requests`, {
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


  const handleLogout = () => {
    localStorage.clear();
    dispatch(logout());
    navigate('/');
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
                activeTab === 'service-history' 
                  ? 'bg-blue-50 text-blue-700 border-r-2 border-blue-600' 
                  : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
              }`}
              onClick={() => setActiveTab('service-history')}
            >
              <History className="h-5 w-5" />
              <span className="font-medium">Service History</span>
            </button>
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

          {activeTab !== 'overview' && activeTab !== 'service-history' && (
            <>
              {loading && (
                <div className="flex items-center justify-center py-12">
                  <div className="text-gray-600">Loading requests...</div>
                </div>
              )}
              {error && (
                <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
                  <div className="text-red-800">Error: {error}</div>
                </div>
              )}

              <div className="mb-6">
                <h2 className="text-2xl font-bold text-gray-900 mb-2">
                  {activeTab === 'assigned' && 'Assigned Requests'}
                  {activeTab === 'in-progress' && 'In Progress Requests'}
                  {activeTab === 'completed' && 'Completed Requests'}
                </h2>
                <p className="text-gray-600">
                  {activeTab === 'assigned' && 'Requests that have been assigned to you by the admin.'}
                  {activeTab === 'in-progress' && 'Requests that you are currently working on.'}
                  {activeTab === 'completed' && 'Requests that you have completed.'}
                </p>
              </div>
              
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ID</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Appliance</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Issue Description</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Homeowner</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Preferred Slot</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {getRequestsForTab().length === 0 && !loading ? (
                        <tr>
                          <td colSpan="7" className="px-6 py-8 text-center text-gray-500">
                            No requests to show.
                          </td>
                        </tr>
                      ) : (
                        getRequestsForTab().map(request => (
                          <tr key={request.id} className="hover:bg-gray-50">
                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                              #{request.id}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                              {request.applianceInfo}
                            </td>
                            <td className="px-6 py-4 text-sm text-gray-900 max-w-xs">
                              <div className="truncate" title={request.issueDescription}>
                                {request.issueDescription}
                              </div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                              {request.homeownerName}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <span
                                className={`px-3 py-1 rounded-full text-xs font-medium ${
                                  request.status === 'ASSIGNED'
                                    ? 'bg-blue-100 text-blue-800 border border-blue-200'
                                    : request.status === 'IN_PROGRESS'
                                    ? 'bg-indigo-100 text-indigo-800 border border-indigo-200'
                                    : request.status === 'COMPLETED'
                                    ? 'bg-green-100 text-green-800 border border-green-200'
                                    : 'bg-gray-100 text-gray-800 border border-gray-200'
                                }`}
                              >
                                {request.status.replace('_', ' ')}
                              </span>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                              {new Date(request.preferredSlot).toLocaleString()}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                              <div className="flex gap-2">
                                {request.status === 'ASSIGNED' && (
                                  <button
                                    className="px-3 py-1 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-xs font-medium"
                                    onClick={() =>
                                      handleStatusUpdate(request.id, 'IN_PROGRESS')
                                    }
                                  >
                                    Start Work
                                  </button>
                                )}

                                {request.status === 'IN_PROGRESS' && (
                                  <button
                                    className="px-3 py-1 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors text-xs font-medium"
                                    onClick={() => setShowFormForRequest(request.id)}
                                  >
                                    Complete
                                  </button>
                                )}

                                {request.status === 'COMPLETED' && (
                                  <button
                                    className="px-3 py-1 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors text-xs font-medium"
                                    onClick={() => {
                                      setSelectedRequestId(request.id);
                                      setShowViewModal(true);
                                    }}
                                  >
                                    View Details
                                  </button>
                                )}
                              </div>
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
          
          {activeTab === 'service-history' && (
            <div className="p-6">
              <h3 className="text-2xl font-bold mb-4 text-gray-800">My Service History</h3>
              {serviceHistory.length > 0 ? (
                <div className="space-y-4">
                  {serviceHistory.map((item, idx) => (
                    <div key={idx} className="bg-gray-50 border border-gray-200 rounded-lg p-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <div className="flex items-center gap-2">
                            <span className="text-sm font-medium text-gray-600">ID:</span>
                            <span className="text-sm text-gray-900">{item.id}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <span className="text-sm font-medium text-gray-600">Issue:</span>
                            <span className="text-sm text-gray-900">{item.issueDescription}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <span className="text-sm font-medium text-gray-600">Status:</span>
                            <span className={`px-2 py-1 text-xs font-semibold rounded-full ${
                              item.status === 'COMPLETED' ? 'bg-green-100 text-green-800' :
                              item.status === 'CANCELLED' ? 'bg-red-100 text-red-800' :
                              'bg-gray-100 text-gray-800'
                            }`}>
                              {item.status.charAt(0).toUpperCase() + item.status.slice(1).toLowerCase()}
                            </span>
                          </div>
                        </div>
                        <div className="space-y-2">
                          <div className="flex items-center gap-2">
                            <Package className="h-4 w-4 text-gray-400" />
                            <span className="text-sm font-medium text-gray-600">Appliance:</span>
                            <span className="text-sm text-gray-900">{item.applianceInfo}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <User className="h-4 w-4 text-gray-400" />
                            <span className="text-sm font-medium text-gray-600">Homeowner:</span>
                            <span className="text-sm text-gray-900">{item.homeownerName}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <Calendar className="h-4 w-4 text-gray-400" />
                            <span className="text-sm font-medium text-gray-600">Date:</span>
                            <span className="text-sm text-gray-900">{new Date(item.serviceDate).toLocaleString('en-IN')}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <p className="text-gray-600">No service history found.</p>
                </div>
              )}
            </div>
          )}
        </div>
      </main>

      {showFormForRequest && (
        <CompletionFormModal
          requestId={showFormForRequest}
          onSuccess={() => {
            handleStatusUpdate(showFormForRequest, 'COMPLETED');
            setShowFormForRequest(null);
          }}
          onClose={() => setShowFormForRequest(null)}
        />
      )}

      {showViewModal && selectedRequestId && (
        <ViewCompletionFormModal
          requestId={selectedRequestId}
          onClose={() => setShowViewModal(false)}
        />
      )}
    </div>
  );
};

export default TechnicianDashboard;
