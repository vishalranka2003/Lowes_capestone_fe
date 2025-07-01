// src/pages/admin/TechnicianDetails.jsx
import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';
import '../../styles/TechnicianDetailsAdmin.css';

const API_BASE_URL = process.env.REACT_APP_API_URL;
const COLORS = ['#facc15', '#3b82f6', '#22c55e'];

export const TechnicianDetails = () => {
  const { id } = useParams();
  const { state } = useLocation();
  const navigate = useNavigate();
  const technician = state?.technician;

  const [assigned, setAssigned] = useState([]);
  const [inProgress, setInProgress] = useState([]);
  const [completed, setCompleted] = useState([]);

  const token = localStorage.getItem('token');
  const headers = { Authorization: `Bearer ${token}` };

  useEffect(() => {
    const fetchRequests = async () => {
      try {
        const [assignedRes, inProgressRes, completedRes] = await Promise.all([
          axios.get(`${API_BASE_URL}/admin/technician-assigned-requests`, {
            headers,
            params: { technicianId: technician.id },
          }),
          axios.get(`${API_BASE_URL}/admin/technician/in-progress`, {
            headers,
            params: { technicianEmail: technician.email },
          }),
          axios.get(`${API_BASE_URL}/admin/technician/completed`, {
            headers,
            params: { technicianEmail: technician.email },
          }),
        ]);

        setAssigned(assignedRes.data);
        setInProgress(inProgressRes.data);
        setCompleted(completedRes.data);
      } catch (err) {
        console.error('Error fetching technician data:', err);
      }
    };

    if (technician) fetchRequests();
  }, [id, technician]);

  const chartData = [
    { name: 'Assigned', value: assigned.length },
    { name: 'In Progress', value: inProgress.length },
    { name: 'Completed', value: completed.length },
  ];

  return (
    <div className="details-container">
      <button onClick={() => navigate(-1)} className="back-btn">← Go Back</button>

      <h2 className="details-title">
        Technician: {technician?.firstName} {technician?.lastName}
      </h2>

      <div className="details-section">
        <div className="technician-card-box">
          <div className="info-row">
            <span className="info-label">Email:</span>
            <span className="info-value">{technician.email}</span>
          </div>
          <div className="info-row">
            <span className="info-label">Phone:</span>
            <span className="info-value">{technician.phoneNumber}</span>
          </div>
          <div className="info-row">
            <span className="info-label">Specialization:</span>
            <span className="info-value">{technician.specialization}</span>
          </div>
          <div className="info-row">
            <span className="info-label">Experience:</span>
            <span className="info-value">{technician.experience} years</span>
          </div>
        </div>

        <div className="chart-box">
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={chartData}
                cx="50%"
                cy="50%"
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
                label
              >
                {chartData.map((_, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={COLORS[index % COLORS.length]}
                  />
                ))}
              </Pie>
              <Tooltip />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      <section className="section-block">
        <h3 className="section-heading">Assigned Requests</h3>
        {assigned.length === 0 ? (
          <p>No assigned requests.</p>
        ) : (
          assigned.map((req) => (
            <div key={req.id} className="request-card">
              <div><strong>ID:</strong> {req.id}</div>
              <div><strong>Status:</strong> {req.status}</div>
              <div><strong>Appliance:</strong> {req.applianceInfo}</div>
              <div><strong>Homeowner:</strong> {req.homeownerName}</div>
            </div>
          ))
        )}
      </section>

      <section className="section-block">
        <h3 className="section-heading">In Progress</h3>
        {inProgress.length === 0 ? (
          <p>No requests in progress.</p>
        ) : (
          inProgress.map((req) => (
            <div key={req.id} className="request-card">
              <div><strong>ID:</strong> {req.id}</div>
              <div><strong>Status:</strong> {req.status}</div>
              <div><strong>Appliance:</strong> {req.applianceInfo}</div>
              <div><strong>Homeowner:</strong> {req.homeownerName}</div>
            </div>
          ))
        )}
      </section>

      <section className="section-block">
        <h3 className="section-heading">Completed</h3>
        {completed.length === 0 ? (
          <p>No completed requests.</p>
        ) : (
          completed.map((req) => (
            <div key={req.id} className="request-card">
              <div><strong>ID:</strong> {req.id}</div>
              <div><strong>Status:</strong> {req.status}</div>
              <div><strong>Appliance:</strong> {req.applianceInfo}</div>
              <div><strong>Homeowner:</strong> {req.homeownerName}</div>
            </div>
          ))
        )}
      </section>
    </div>
  );
};
