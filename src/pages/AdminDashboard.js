import React, { useEffect, useState } from 'react';
import axios from 'axios';
import '../styles/AdminDashboard.css';

const API_BASE_URL = process.env.REACT_APP_API_URL;

export const AdminDashboard = () => {
  const [stats, setStats] = useState(null);
  const [recentRequests, setRecentRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [technicianNames, setTechnicianNames] = useState([]);


  useEffect(() => {
    const token = localStorage.getItem('token');

    const headers = {
      Authorization: `Bearer ${token}`
    };

    Promise.all([
      axios.get(`${API_BASE_URL}/admin/stats`, { headers }),
      axios.get(`${API_BASE_URL}/admin/recent-service-requests`, { headers }),
      axios.get(`${API_BASE_URL}/admin/available-technicians`, { headers })
    ])
      .then(([statsRes, recentRes, techRes]) => {
      setStats(statsRes.data);
      setRecentRequests(recentRes.data.body);
      const names = techRes.data.map(t => `${t.firstName} ${t.lastName}`);
      setTechnicianNames(names);
      setLoading(false)
      })
      .catch((error) => {
        console.error('Error fetching admin dashboard data:', error);
        setLoading(false);
      });
  }, []);

  if (loading) {
    return <div className="text-center mt-10">Loading dashboard data...</div>;
  }

  if (!stats) {
    return <div className="text-center mt-10 text-red-500">Failed to load dashboard data.</div>;
  }

  const summaryData = [
    { title: 'Total Technicians', value: stats.totalTechnicians },
    { title: 'Open Service Requests', value: stats.pendingRequests },
    { title: 'Completed Requests', value: stats.completedRequests },
    { title: 'Supported Appliance Models', value: stats.totalAppliances },
  ];

  const technicians = [
    { name: 'Sneha Iyer', available: true },
    { name: 'Aman Verma', available: false },
    { name: 'Raj Malhotra', available: true },
  ];

  return (
    <div className="admin-dashboard">
      <h2 className="dashboard-title">Admin Overview</h2>

      <div className="summary-grid">
        {summaryData.map((item, idx) => (
          <div className="summary-card" key={idx}>
            <div className="summary-value">{item.value}</div>
            <div className="summary-title">{item.title}</div>
          </div>
        ))}
      </div>

      <section className="dashboard-section">
        <h3 className="section-title">Recent Service Requests</h3>
        <div className="requests-table">
          <div className="table-row table-header">
            <div>Request Id</div>
            <div>Created At</div>
            <div>Homeowner</div>
            <div>Appliance</div>
            <div>Technician</div>
            <div>Status</div>
          </div>
          {recentRequests.map((req, idx) => (
            <div className="table-row" key={idx}>
              <div>{req.id}</div> {/* ✅ Request ID */}
              <div>
                {new Date(req.createdAt).toLocaleString('en-IN', {
                  day: '2-digit',
                  month: 'short',
                  year: 'numeric',
                  hour: '2-digit',
                  minute: '2-digit'
                })}
              </div> {/* ✅ Created At */}
              <div>{req.homeownerName}</div>
              <div>{req.applianceName} ({req.serialNumber})</div>
              <div>{req.technicianName || '—'}</div>
              <div>
                <span className={`status-badge status-${req.status.toLowerCase()}`}>
                  {req.status.replace('_', ' ').toLowerCase().replace(/\b\w/g, c => c.toUpperCase())}
                </span>
              </div>
            </div>
          ))}

        </div>
      </section>
      <section className="dashboard-section">
        <h3 className="section-title">Technician Availability</h3>
        <div className="tech-list">
          {technicianNames.map((name, idx) => (
            <div className="tech-item" key={idx}>
              <span className="tech-status available"></span>
              {name}
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};
