// src/pages/admin/AdminServiceHistory.js
import React, { useState } from "react";
import axios from "axios";
import DataTable from '../../components/DataTable';

const API_BASE_URL = process.env.REACT_APP_API_URL;

const getStatusColor = (status) => {
  switch (status.toLowerCase()) {
    case 'completed':
      return 'bg-green-100 text-green-800';
    case 'cancelled':
      return 'bg-red-100 text-red-800';
    default:
      return 'bg-gray-100 text-gray-800';
  }
};

export const AdminServiceHistory = () => {
  const [historyData, setHistoryData] = useState([]);
  const [type, setType] = useState("homeowner");
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);

  const [hasSearched, setHasSearched] = useState(false);
  const token = localStorage.getItem("token");

  const fetchHistory = async () => {
    if (!input || !type) return;

    setLoading(true);
    let url = "";

    if (type === "homeowner")
      url = `${API_BASE_URL}/admin/service-history/homeowner/${input}`;
    if (type === "technician")
      url = `${API_BASE_URL}/admin/service-history/technician/${input}`;
    if (type === "appliance")
      url = `${API_BASE_URL}/admin/service-history/appliance/${input}`;

    try {
      const response = await axios.get(url, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = Array.isArray(response.data)
       ? response.data
       : response.data.body || [];
      setHistoryData(data);
      setHasSearched(true);
    } catch (error) {
      console.error("Error fetching service history:", error);
      setHistoryData([]);
      setHasSearched(true);
    } finally {
      setLoading(false);
    }
  };

  const headers = [
    { label: 'ID', key: 'id' },
    { label: 'Date & Time', key: 'serviceDate' },
    { label: 'Homeowner', key: 'homeownerName' },
    { label: 'Appliance', key: 'applianceInfo' },
    { label: 'Status', key: 'status' },
  ];

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8 ">
      <div className="max-w-7xl mx-auto">

      <div className="mb-8">
      <h2 className="text-3xl font-bold text-gray-900 mb-2 flex items-center gap-2">Service History</h2>
      </div>
     

      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-8">
      <div className="flex space-x-4">
        <button
          className={`px-4 py-2 rounded transition-colors duration-200 ${type === "homeowner" ? "bg-lowesBlue-500 text-white" : "bg-gray-100 hover:bg-gray-200"}`}
          onClick={() => {
            setType("homeowner");
            setInput("");
            setHistoryData([]);
            setHasSearched(false);
          }}
        >
          Homeowner
        </button>

        <button
          className={`px-4 py-2 rounded transition-colors duration-200 ${type === "technician" ? "bg-lowesBlue-500 text-white" : "bg-gray-100 hover:bg-gray-200"}`}
          onClick={() => {
            setType("technician");
            setInput("");
            setHistoryData([]);
            setHasSearched(false);
          }}
        >
          Technician
        </button>

        <button
          className={`px-4 py-2 rounded transition-colors duration-200 ${type === "appliance" ? "bg-lowesBlue-500 text-white" : "bg-gray-100 hover:bg-gray-200"}`}
          onClick={() => {
            setType("appliance");
            setInput("");
            setHistoryData([]);
            setHasSearched(false);
          }}
        >
          Appliance
        </button>
      </div>
      </div>

      {type && (
        <div className="newflex items-center space-x-2 mb-4 w-full max-w-md">
        <form onSubmit={(e) => { e.preventDefault(); fetchHistory(); }} className="flex items-center space-x-2 mb-4">
          <input
            type="text"
            placeholder={`Enter ${type === "homeowner" ? "username" : "ID"}`}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            className="border rounded px-3 py-2 flex-1 focus:outline-none focus:ring-2 focus:ring-lowesBlue-500"
          />
          <button type="submit" className="btn-primary px-4 py-2 bg-lowesBlue-500 text-white rounded hover:bg-lowesBlue-500 transition-colors duration-200">
            Search
          </button>
        </form>
        </div>
      )}

      {loading && <p className="text-center text-gray-500">Loading...</p>}

      {historyData.length > 0 && (
        <DataTable 
          title={`Service History for ${type.charAt(0).toUpperCase() + type.slice(1)}`}
          headers={headers}
          data={historyData.map(item => ({
            ...item,
            serviceDate: new Date(item.serviceDate).toLocaleString()
          }))}
          
          getStatusColor={getStatusColor} 
        />
      )}

      {!loading && historyData.length === 0 && type && hasSearched && (
        <p className="text-center text-gray-500">No history found for this {type}.</p>
      )}
    </div>
    </div>

  );
};
