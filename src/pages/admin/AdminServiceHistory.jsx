// src/pages/admin/AdminServiceHistory.js
import React, { useState } from "react";
import axios from "axios";

const API_BASE_URL = process.env.REACT_APP_API_URL;

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

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="mb-8">
      <h2 className="text-3xl font-bold text-gray-900 mb-2 flex items-center gap-2">Service History</h2>
      </div>
     

      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-8">
      <div className="flex space-x-4">
        <button
          className={`px-4 py-2 rounded transition-colors duration-200 ${type === "homeowner" ? "bg-blue-600 text-white" : "bg-gray-100 hover:bg-gray-200"}`}
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
          className={`px-4 py-2 rounded transition-colors duration-200 ${type === "technician" ? "bg-blue-600 text-white" : "bg-gray-100 hover:bg-gray-200"}`}
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
          className={`px-4 py-2 rounded transition-colors duration-200 ${type === "appliance" ? "bg-blue-600 text-white" : "bg-gray-100 hover:bg-gray-200"}`}
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
            className="border rounded px-3 py-2 flex-1 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <button type="submit" className="btn-primary px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors duration-200">
            Search
          </button>
        </form>
        </div>
      )}

      {loading && <p className="text-center text-gray-500">Loading...</p>}

      {historyData.length > 0 && (
        <table className="min-w-full bg-white">
          <thead>
            <tr className="w-full bg-gray-100 text-left">
              <th className="py-2 px-4">ID</th>
              <th className="py-2 px-4">Date & Time</th>
              <th className="py-2 px-4">Homeowner</th>
              <th className="py-2 px-4">Appliance</th>
              <th className="py-2 px-4">Status</th>
            </tr>
          </thead>
          <tbody>
            {historyData.map((item, idx) => (
              <tr key={idx} className="border-t">
                <td className="py-2 px-4">{item.id}</td>
                <td className="py-2 px-4">{new Date(item.serviceDate).toLocaleString("en-IN")}</td>
                <td className="py-2 px-4">{item.homeownerName}</td>
                <td className="py-2 px-4">{item.applianceInfo}</td>
                <td className="py-2 px-4">
  <span className={`px-2 py-1 text-xs font-semibold rounded-full ${
    item.status === 'COMPLETED' ? 'bg-green-100 text-green-800' :
    item.status === 'CANCELLED' ? 'bg-red-100 text-red-800' :
    'bg-gray-100 text-gray-800'
  }`}>
    {item.status.charAt(0).toUpperCase() + item.status.slice(1).toLowerCase()}
  </span>
</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      {!loading && historyData.length === 0 && type && hasSearched && (
        <p className="text-center text-gray-500">No history found for this {type}.</p>
      )}
    </div>
  );
};
