import React, { useEffect, useState } from 'react';
import axios from 'axios';
import '../styles/TechnicianDashboard.css';

const TechnicianDashboard = () => {
  const [stats, setStats] = useState(null);
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState('overview');

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

  return (
    <div className="technician-layout">
      <aside className="technician-sidebar">
        <nav className="sidebar-nav">
          <button
            className={`nav-link ${activeTab === 'overview' ? 'active' : ''}`}
            onClick={() => setActiveTab('overview')}
          >
            Requests Overview
          </button>
          <button
            className={`nav-link ${activeTab === 'assigned' ? 'active' : ''}`}
            onClick={() => setActiveTab('assigned')}
          >
            Assigned
          </button>
          <button
            className={`nav-link ${activeTab === 'in-progress' ? 'active' : ''}`}
            onClick={() => setActiveTab('in-progress')}
          >
            In Progress
          </button>
          <button
            className={`nav-link ${activeTab === 'completed' ? 'active' : ''}`}
            onClick={() => setActiveTab('completed')}
          >
            Completed
          </button>
        </nav>
      </aside>

      <main className="technician-main">
        <header className="technician-header">
          <h2>Welcome, Technician</h2>
          <p>Manage your assigned service requests</p>
        </header>

        <div className="technician-content">
          {activeTab === 'overview' && stats && (
            <div className="overview-panel">
              <h3 className="dashboard-title">Requests Overview</h3>
              <div className="summary-grid">
                <div className="summary-card">
                  <div className="summary-value">{stats.assignedCount ?? 0}</div>
                  <div className="summary-title">Assigned</div>
                </div>
                <div className="summary-card">
                  <div className="summary-value">{stats.inProgressCount ?? 0}</div>
                  <div className="summary-title">In Progress</div>
                </div>
                <div className="summary-card">
                  <div className="summary-value">{stats.completedCount ?? 0}</div>
                  <div className="summary-title">Completed</div>
                </div>
              </div>
            </div>
          )}

          {activeTab !== 'overview' && (
            <>
              {loading && <div>Loading...</div>}
              {error && <div>Error: {error}</div>}

              <div className="technician-requests-table">
                <div className="technician-row technician-header-row">
                  <div>ID</div>
                  <div>Appliance</div>
                  <div>Issue</div>
                  <div>Homeowner</div>
                  <div>Status</div>
                  <div>Preferred Slot</div>
                  <div>Actions</div>
                </div>

                {getRequestsForTab().length === 0 && !loading ? (
                  <div className="technician-row">No requests to show.</div>
                ) : (
                  getRequestsForTab().map(request => (
                    <div key={request.id} className="technician-row">
                      <div>{request.id}</div>
                      <div>{request.applianceInfo}</div>
                      <div>{request.issueDescription}</div>
                      <div>{request.homeownerName}</div>
                      <div>
                        <span
                          className={`tech-status-badge ${
                            request.status === 'ASSIGNED'
                              ? 'tech-status-assigned'
                              : request.status === 'IN_PROGRESS'
                              ? 'tech-status-in-progress'
                              : request.status === 'COMPLETED'
                              ? 'tech-status-completed'
                              : ''
                          }`}
                        >
                          {request.status}
                        </span>
                      </div>
                      <div>{new Date(request.preferredSlot).toLocaleString()}</div>
                      <div>
                        {request.status !== 'COMPLETED' && (
                          <>
                            {request.status === 'ASSIGNED' && (
                              <button
                                className="tech-button"
                                onClick={() =>
                                  handleStatusUpdate(request.id, 'IN_PROGRESS')
                                }
                              >
                                Mark In Progress
                              </button>
                            )}
                            {request.status === 'IN_PROGRESS' && (
                              <button
                                className="tech-button"
                                onClick={() =>
                                  handleStatusUpdate(request.id, 'COMPLETED')
                                }
                              >
                                Mark Completed
                              </button>
                            )}
                          </>
                        )}
                      </div>
                    </div>
                  ))
                )}
              </div>
            </>
          )}
        </div>
      </main>
    </div>
  );
};

export default TechnicianDashboard;
