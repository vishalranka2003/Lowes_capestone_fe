import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import axios from 'axios';
import '../styles/MyServiceRequests.css';

const API_URL = 'http://localhost:8080/homeowner';

const ServiceRequestForm = ({ onClose, onSubmit, initialData, applianceOptions }) => {
  const [form, setForm] = useState(
    initialData || {
      serialNumber: '',
      issueDescription: '',
      preferredSlot: '',
    }
  );
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setError('');
    try {
      await onSubmit(form);
      onClose();
    } catch (err) {
      setError('Failed to submit request.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="service-request-modal-overlay">
      <div className="service-request-modal-container">
        <button 
          className="service-request-modal-close" 
          onClick={onClose}
        >
          ×
        </button>
        
        <h2 className="service-request-modal-title">
          {initialData ? 'Update Service Request' : 'Create Service Request'}
        </h2>
        <p className="service-request-modal-desc">
          Submit a new service request for your appliance.
        </p>

        <form onSubmit={handleSubmit} className="service-request-modal-form">
          <div className="service-request-modal-field">
            <label className="service-request-modal-label">Appliance</label>
            <select
              name="serialNumber"
              value={form.serialNumber}
              onChange={handleChange}
              className="service-request-modal-input"
              required
              disabled={!!initialData}
            >
              <option value="">Select appliance</option>
              {applianceOptions.map((appl) => (
                <option key={appl.serialNumber} value={appl.serialNumber}>
                  {appl.brand} - {appl.modelNumber} ({appl.serialNumber})
                </option>
              ))}
            </select>
          </div>

          <div className="service-request-modal-field">
            <label className="service-request-modal-label">Preferred Date</label>
            <input
              type="date"
              name="preferredSlot"
              value={form.preferredSlot ? form.preferredSlot.split('T')[0] : ''}
              onChange={(e) => {
                const date = e.target.value;
                const time = form.preferredSlot ? form.preferredSlot.split('T')[1] || '09:00' : '09:00';
                setForm(prev => ({ ...prev, preferredSlot: `${date}T${time}` }));
              }}
              className="service-request-modal-input"
              required
            />
          </div>

          <div className="service-request-modal-field">
            <label className="service-request-modal-label">Preferred Time</label>
            <select
              name="preferredTime"
              value={form.preferredSlot ? form.preferredSlot.split('T')[1] || '09:00' : '09:00'}
              onChange={(e) => {
                const date = form.preferredSlot ? form.preferredSlot.split('T')[0] : new Date().toISOString().split('T')[0];
                setForm(prev => ({ ...prev, preferredSlot: `${date}T${e.target.value}` }));
              }}
              className="service-request-modal-input"
              required
            >
              <option value="">Select time slot</option>
              <option value="09:00">09:00 AM</option>
              <option value="10:00">10:00 AM</option>
              <option value="11:00">11:00 AM</option>
              <option value="12:00">12:00 PM</option>
              <option value="13:00">01:00 PM</option>
              <option value="14:00">02:00 PM</option>
              <option value="15:00">03:00 PM</option>
              <option value="16:00">04:00 PM</option>
              <option value="17:00">05:00 PM</option>
            </select>
          </div>

          <div className="service-request-modal-field">
            <label className="service-request-modal-label">Issue Description</label>
            <textarea
              name="issueDescription"
              value={form.issueDescription}
              onChange={handleChange}
              className="service-request-modal-input textarea"
              required
              placeholder="Describe the problem..."
            />
          </div>

          {error && <div className="service-request-modal-error">{error}</div>}
          
          <div className="service-request-modal-actions">
            <button
              type="button"
              onClick={onClose}
              className="service-request-modal-btn cancel"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="service-request-modal-btn submit"
              disabled={submitting}
            >
              {submitting ? 'Submitting...' : 'Submit Request'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

const MyServiceRequests = () => {
  const token = useSelector((state) => state.auth.token);
  const [requests, setRequests] = useState([]);
  const [filteredRequests, setFilteredRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [editRequest, setEditRequest] = useState(null);
  const [appliances, setAppliances] = useState([]);
  const [activeFilter, setActiveFilter] = useState('All');

  const filters = ['All', 'Requested', 'Completed', 'Cancelled'];

  const fetchRequests = async () => {
    setLoading(true);
    try {
      const res = await axios.get(`${API_URL}/service-requests`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setRequests(res.data);
      setFilteredRequests(res.data);
    } catch (err) {
      setError('Failed to load service requests.');
    } finally {
      setLoading(false);
    }
  };

  const fetchAppliances = async () => {
    try {
      const res = await axios.get(`${API_URL}/appliances`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setAppliances(res.data);
    } catch (err) {
      // ignore
    }
  };

  useEffect(() => {
    fetchRequests();
    fetchAppliances();
    // eslint-disable-next-line
  }, []);

  useEffect(() => {
    if (activeFilter === 'All') {
      setFilteredRequests(requests);
    } else {
      const filtered = requests.filter(req => 
        (req.status || 'requested').toLowerCase() === activeFilter.toLowerCase()
      );
      setFilteredRequests(filtered);
    }
  }, [activeFilter, requests]);

  const handleCreate = async (form) => {
    await axios.post(`${API_URL}/service-request`, form, {
      headers: { Authorization: `Bearer ${token}` },
    });
    fetchRequests();
  };

  const handleUpdate = async (form) => {
    await axios.put(`${API_URL}/service-request/${editRequest.id}`, form, {
      headers: { Authorization: `Bearer ${token}` },
    });
    fetchRequests();
  };

  const handleCancel = async (id) => {
    if (!window.confirm('Cancel this service request?')) return;
    await axios.delete(`${API_URL}/service-request/${id}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    fetchRequests();
  };

  const getStatusColor = (status) => {
    const statusLower = (status || 'requested').toLowerCase();
    switch (statusLower) {
      case 'requested': return 'bg-yellow-100 text-yellow-800';
      case 'completed': return 'bg-green-100 text-green-800';
      case 'cancelled': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'Not scheduled';
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'numeric',
      day: 'numeric'
    });
  };

  const formatDateTime = (dateString) => {
    if (!dateString) return 'Not scheduled';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'numeric',
      day: 'numeric'
    }) + ' at ' + date.toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: true
    });
  };

  return (
    <div className="service-requests-bg">
      <div className="service-requests-wrapper">
        {/* Header */}
        <div className="service-requests-header">
          <div className="service-requests-header-row">
            <div>
              <h1 className="service-requests-title">Service Requests</h1>
              <p className="service-requests-desc">Manage your appliance service requests and appointments.</p>
            </div>
            <button
              className="service-requests-new-btn"
              onClick={() => {
                setEditRequest(null);
                setShowForm(true);
              }}
            >
              <span className="service-requests-new-btn-plus">+</span>
              New Request
            </button>
          </div>
        </div>

        {/* Filter Tabs */}
        <div className="service-requests-tabs">
          <nav className="service-requests-tabs-nav">
            {filters.map((filter) => (
              <button
                key={filter}
                onClick={() => setActiveFilter(filter)}
                className={`service-requests-tab${activeFilter === filter ? ' active' : ''}`}
              >
                {filter}
              </button>
            ))}
          </nav>
        </div>

        {/* Content */}
        {loading ? (
          <div className="service-requests-loading">Loading service requests...</div>
        ) : error ? (
          <div className="service-requests-error">{error}</div>
        ) : filteredRequests.length === 0 ? (
          <div className="service-requests-empty">No service requests found for "{activeFilter}" status.</div>
        ) : (
          <div className="service-requests-list">
            {filteredRequests.map((req) => {
              const appl = appliances.find((a) =>
                a.serialNumber === req.serialNumber
              );
              return (
                <div key={req.id} className="service-request-card">
                  <div className="service-request-card-row">
                    <div className="service-request-card-main">
                      <div className="service-request-card-header">
                        <h3 className="service-request-card-title">
                          Request #{req.id || `SR${String(req.id).padStart(3, '0')}`}
                        </h3>
                        <span className={`service-request-status status-${(req.status === 'Scheduled' ? 'requested' : (req.status || 'requested')).toLowerCase().replace(/\s/g, '-')}`}>{req.status === 'Scheduled' ? 'Requested' : (req.status || 'Requested')}</span>
                      </div>
                      <div className="service-request-appliance-details">
                        <strong>Appliance:</strong> {req.applianceInfo || req.serialNumber}
                      </div>
                      <div className="service-request-details-grid">
                        <div>
                          <h4 className="service-request-detail-label">Issue</h4>
                          <p className="service-request-detail-value">{req.issueDescription}</p>
                        </div>
                        <div>
                          <h4 className="service-request-detail-label">Request Date</h4>
                          <p className="service-request-detail-value">{formatDate(req.createdAt || req.preferredSlot)}</p>
                        </div>
                        <div>
                          <h4 className="service-request-detail-label">Scheduled Date</h4>
                          <p className="service-request-detail-value">{formatDateTime(req.preferredSlot)}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="service-request-card-actions">
                    {req.status?.toLowerCase() !== 'cancelled' && (
                      <>
                        <button
                          onClick={() => {
                            setEditRequest(req);
                            setShowForm(true);
                          }}
                          className="service-request-action-btn"
                        >
                          Reschedule
                        </button>
                        <button
                          onClick={() => handleCancel(req.id)}
                          className="service-request-action-btn cancel"
                        >
                          Cancel
                        </button>
                      </>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
        

        {showForm && (
          <ServiceRequestForm
            onClose={() => setShowForm(false)}
            onSubmit={editRequest ? handleUpdate : handleCreate}
            initialData={editRequest}
            applianceOptions={appliances}
          />
        )}
      </div>
    </div>
  );
};

export { ServiceRequestForm };
export default MyServiceRequests;