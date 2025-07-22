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
import { ArrowLeft, User, Mail, Phone, Wrench, Clock } from 'lucide-react';

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
    <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <button 
          onClick={() => navigate(-1)} 
          className="flex items-center space-x-2 text-lowesBlue-500 hover:text-lowesBlue-500 font-medium mb-6 transition-colors"
        >
          <ArrowLeft className="h-4 w-4" />
          <span>Go Back</span>
        </button>

        <h2 className="text-3xl font-bold text-gray-900 mb-8">
          Technician: {technician?.firstName} {technician?.lastName}
        </h2>

        {/* Technician Info and Chart */}
        <div className="grid lg:grid-cols-2 gap-8 mb-8">
          {/* Technician Info Card */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
              <User className="h-5 w-5 text-lowesBlue-500" />
              Technician Information
            </h3>
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <Mail className="h-4 w-4 text-gray-400" />
                <span className="text-gray-600">Email:</span>
                <span className="text-gray-900 font-medium">{technician.email}</span>
              </div>
              <div className="flex items-center gap-3">
                <Phone className="h-4 w-4 text-gray-400" />
                <span className="text-gray-600">Phone:</span>
                <span className="text-gray-900 font-medium">{technician.phoneNumber}</span>
              </div>
              <div className="flex items-center gap-3">
                <Wrench className="h-4 w-4 text-gray-400" />
                <span className="text-gray-600">Specialization:</span>
                <span className="text-gray-900 font-medium">{technician.specialization}</span>
              </div>
              <div className="flex items-center gap-3">
                <Clock className="h-4 w-4 text-gray-400" />
                <span className="text-gray-600">Experience:</span>
                <span className="text-gray-900 font-medium">{technician.experience} years</span>
              </div>
            </div>
          </div>

          {/* Chart */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Request Statistics</h3>
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

        {/* Request Sections */}
        <div className="grid lg:grid-cols-3 gap-6">
          {/* Assigned Requests */}
          <section className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Assigned Requests</h3>
            {assigned.length === 0 ? (
              <p className="text-gray-500">No assigned requests.</p>
            ) : (
              <div className="space-y-3">
                {assigned.map((req) => (
                  <div key={req.id} className="p-3 bg-gray-50 rounded-lg border border-gray-200">
                    <div className="text-sm"><span className="font-medium">ID:</span> {req.id}</div>
                    <div className="text-sm"><span className="font-medium">Status:</span> {req.status}</div>
                    <div className="text-sm"><span className="font-medium">Appliance:</span> {req.applianceInfo}</div>
                    <div className="text-sm"><span className="font-medium">Homeowner:</span> {req.homeownerName}</div>
                  </div>
                ))}
              </div>
            )}
          </section>

          {/* In Progress */}
          <section className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">In Progress</h3>
            {inProgress.length === 0 ? (
              <p className="text-gray-500">No requests in progress.</p>
            ) : (
              <div className="space-y-3">
                {inProgress.map((req) => (
                  <div key={req.id} className="p-3 bg-blue-50 rounded-lg border border-blue-200">
                    <div className="text-sm"><span className="font-medium">ID:</span> {req.id}</div>
                    <div className="text-sm"><span className="font-medium">Status:</span> {req.status}</div>
                    <div className="text-sm"><span className="font-medium">Appliance:</span> {req.applianceInfo}</div>
                    <div className="text-sm"><span className="font-medium">Homeowner:</span> {req.homeownerName}</div>
                  </div>
                ))}
              </div>
            )}
          </section>

          {/* Completed */}
          <section className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Completed</h3>
            {completed.length === 0 ? (
              <p className="text-gray-500">No completed requests.</p>
            ) : (
              <div className="space-y-3">
                {completed.map((req) => (
                  <div key={req.id} className="p-3 bg-green-50 rounded-lg border border-green-200">
                    <div className="text-sm"><span className="font-medium">ID:</span> {req.id}</div>
                    <div className="text-sm"><span className="font-medium">Status:</span> {req.status}</div>
                    <div className="text-sm"><span className="font-medium">Appliance:</span> {req.applianceInfo}</div>
                    <div className="text-sm"><span className="font-medium">Homeowner:</span> {req.homeownerName}</div>
                  </div>
                ))}
              </div>
            )}
          </section>
        </div>
      </div>
    </div>
  );
};
