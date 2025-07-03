// src/pages/admin/AdminServiceHistory.js
import React, { useState } from "react";
import axios from "axios";

const API_BASE_URL = process.env.REACT_APP_API_URL;

export const AdminServiceHistory = () => {
  const [historyData, setHistoryData] = useState([]);
  const [type, setType] = useState(null);
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
    <div className="admin-service-history">
      <h2 className="dashboard-title">Service History</h2>

      <div className="button-group">
        <button
          className={type === "homeowner" ? "selected" : ""}
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
          className={type === "technician" ? "selected" : ""}
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
          className={type === "appliance" ? "selected" : ""}
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

      {type && (
        <div className="history-search">
          <input
            type="text"
            placeholder={`Enter ${type === "homeowner" ? "username" : "ID"}`}
            value={input}
            onChange={(e) => setInput(e.target.value)}
          />
          <button onClick={fetchHistory} className="btn-primary">
            Fetch History
          </button>
        </div>
      )}

      {loading && <p>Loading...</p>}

      {historyData.length > 0 && (
        <div className="history-table">
          <div className="dashboard-row dashboard-header">
            <div>ID</div>
            <div>Date & Time</div>
            <div>Homeowner</div>
            <div>Appliance</div>
            {/* <div>Technician</div> */}
            <div>Status</div>
          </div>
          {historyData.map((item, idx) => (
            <div className="dashboard-row" key={idx}>
              <div>{item.id}</div>
              <div>{new Date(item.serviceDate).toLocaleString("en-IN")}</div>
              <div>{item.homeownerName}</div>
              <div>{item.applianceInfo}</div>
              {/* <div>{item.technicianName || "—"}</div> */}
              <div>{item.status}</div>
            </div>
          ))}
        </div>
      )}

      {!loading && historyData.length === 0 && type && hasSearched && (
        <p>No history found for this {type}.</p>
      )}
    </div>
  );
};
