import React, { useEffect, useState } from 'react';
import axios from 'axios';
import '../../styles/TechnicianDashboard.css'; // or create a new CSS file if needed

const API_BASE_URL = process.env.REACT_APP_API_URL;

const TechnicianServiceHistory = () => {
  const [serviceHistory, setServiceHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchServiceHistory = async () => {
      const token = localStorage.getItem('token');
      const headers = { Authorization: `Bearer ${token}` };

      try {
        const profileRes = await axios.get(`${API_BASE_URL}/technician/profile`, { headers });
        const technicianId = profileRes.data.id;

        const historyRes = await axios.get(`${API_BASE_URL}/technician/service-history/${technicianId}`, {
          headers,
        });

        setServiceHistory(historyRes.data);
      } catch (err) {
        console.error('Error fetching service history:', err);
        setError('Failed to load service history.');
      } finally {
        setLoading(false);
      }
    };

    fetchServiceHistory();
  }, []);

  if (loading) return <div>Loading service history...</div>;
  if (error) return <div className="text-red-500">{error}</div>;

  return (
    <div className="technician-service-history">
      <h3 className="dashboard-title">Your Service History</h3>
      {serviceHistory.length === 0 ? (
        <p>No past services found.</p>
      ) : (
        <div className="technician-requests-table">
          <div className="technician-row technician-header-row">
            <div>ID</div>
            <div>Service Date</div>
            <div>Homeowner</div>
            <div>Appliance</div>
            <div>Status</div>
          </div>

          {serviceHistory.map((item, idx) => (
            <div className="technician-row" key={idx}>
              <div>{item.id}</div>
              <div>{new Date(item.serviceDate).toLocaleString('en-IN')}</div>
              <div>{item.homeownerName}</div>
              <div>{item.applianceInfo}</div>
              <div>{item.status}</div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default TechnicianServiceHistory;
