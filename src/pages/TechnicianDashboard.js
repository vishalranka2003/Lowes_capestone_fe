// src/pages/TechnicianDashboard.js

import React, { useEffect, useState } from 'react';
import axios from 'axios';

const TechnicianDashboard = () => {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState('assigned');

  useEffect(() => {
    const token = localStorage.getItem('token');

    axios.get('/technician/assigned-requests', {
      headers: { Authorization: `Bearer ${token}` }
    })
      .then(res => {
        console.log('✅ Data:', res.data);
        setRequests(res.data);
        setLoading(false);
      })
      .catch(err => {
        console.error('❌ Error fetching:', err);
        setError(err.message);
        setLoading(false);
      });
  }, []);

  const handleStatusUpdate = (requestId, newStatus) => {
    const token = localStorage.getItem('token');

    axios.put('/technician/update-status',
      { requestId, status: newStatus },
      { headers: { Authorization: `Bearer ${token}` } }
    )
      .then(() => {
        // ✅ After update, refetch requests
        return axios.get('/technician/assigned-requests', {
          headers: { Authorization: `Bearer ${token}` }
        });
      })
      .then(res => {
        setRequests(res.data);
      })
      .catch(err => {
        console.error('❌ Error updating:', err);
      });
  };

  const getRequestsForTab = () => {
    return requests.filter((req) => {
      if (activeTab === 'assigned') return req.status === 'ASSIGNED';
      if (activeTab === 'in-progress') return req.status === 'IN_PROGRESS';
      if (activeTab === 'completed') return req.status === 'COMPLETED';
      return false;
    });
  };

  return (
    <div className="service-requests-wrapper">
      <h2>Technician Dashboard</h2>
      <p>Manage your assigned service requests</p>

      <div>
        <button onClick={() => setActiveTab('assigned')} disabled={activeTab === 'assigned'}>Assigned</button>
        <button onClick={() => setActiveTab('in-progress')} disabled={activeTab === 'in-progress'}>In Progress</button>
        <button onClick={() => setActiveTab('completed')} disabled={activeTab === 'completed'}>Completed</button>
      </div>

      {loading && <div>Loading...</div>}
      {error && <div>Error: {error}</div>}

      <div>
        {getRequestsForTab().length === 0 && !loading ? (
          <div>No requests to show.</div>
        ) : (
          getRequestsForTab().map((request) => (
            <div key={request.id}>
              <h4>Request #{request.id} - {request.status}</h4>
              <p>{request.applianceInfo}</p>
              <p>{request.issueDescription}</p>
              <p>{new Date(request.preferredSlot).toLocaleString()}</p>

              {request.status !== 'COMPLETED' && (
                <div>
                  {request.status === 'ASSIGNED' && (
                    <button onClick={() => handleStatusUpdate(request.id, 'IN_PROGRESS')}>
                      Mark In Progress
                    </button>
                  )}
                  {request.status === 'IN_PROGRESS' && (
                    <button onClick={() => handleStatusUpdate(request.id, 'COMPLETED')}>
                      Mark Completed
                    </button>
                  )}
                </div>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default TechnicianDashboard;
