import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import axios from 'axios';
import { X, Plus } from 'lucide-react';

const API_URL = `${process.env.REACT_APP_API_URL}/homeowner`;

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
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-xl max-w-md w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          <div className="flex justify-between items-center mb-6">
            <div>
              <h2 className="text-xl font-semibold text-gray-900">
                {initialData ? 'Update Service Request' : 'Create Service Request'}
              </h2>
              <p className="text-gray-600 mt-1">
                Submit a new service request for your appliance.
              </p>
            </div>
            <button 
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 transition-colors"
            >
              <X className="h-6 w-6" />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Appliance
              </label>
              <select
                name="serialNumber"
                value={form.serialNumber}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-lowesBlue-500 focus:border-lowesBlue-500"
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

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Preferred Date
              </label>
              <input
                type="date"
                name="preferredSlot"
                value={form.preferredSlot ? form.preferredSlot.split('T')[0] : ''}
                onChange={(e) => {
                  const date = e.target.value;
                  const time = form.preferredSlot ? form.preferredSlot.split('T')[1] || '09:00' : '09:00';
                  setForm(prev => ({ ...prev, preferredSlot: `${date}T${time}` }));
                }}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-lowesBlue-500 focus:border-lowesBlue-500"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Preferred Time
              </label>
              <select
                name="preferredTime"
                value={form.preferredSlot ? form.preferredSlot.split('T')[1] || '09:00' : '09:00'}
                onChange={(e) => {
                  const date = form.preferredSlot ? form.preferredSlot.split('T')[0] : new Date().toISOString().split('T')[0];
                  setForm(prev => ({ ...prev, preferredSlot: `${date}T${e.target.value}` }));
                }}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-lowesBlue-500 focus:border-lowesBlue-500"
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

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Issue Description
              </label>
              <textarea
                name="issueDescription"
                value={form.issueDescription}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-lowesBlue-500 focus:border-lowesBlue-500 resize-none"
                rows="4"
                required
                placeholder="Describe the problem..."
              />
            </div>

            {error && (
              <div className="text-red-600 text-sm">{error}</div>
            )}
            
            <div className="flex space-x-3 pt-4">
              <button
                type="button"
                onClick={onClose}
                className="flex-1 px-4 py-2 text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg font-medium transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="flex-1 px-4 py-2 bg-lowesBlue-500 text-white rounded-lg font-medium hover:bg-lowesBlue-500 disabled:bg-gray-400 transition-colors"
                disabled={submitting}
              >
                {submitting ? 'Submitting...' : 'Submit Request'}
              </button>
            </div>
          </form>
        </div>
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

  const filters = ['All', 'Requested','Assigned', 'In Progress', 'Completed', 'Cancelled'];

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
      const filterMap = {
        'Requested': 'REQUESTED',
        'Assigned': 'ASSIGNED',
        'In Progress': 'IN_PROGRESS',
        'Completed': 'COMPLETED',
        'Cancelled': 'CANCELLED',
        'Rescheduled': 'RESCHEDULED',
      };
              const statusToMatch = filterMap[activeFilter] || activeFilter.toUpperCase();
        const filtered = requests.filter(req => 
          (req.status || 'REQUESTED').toUpperCase() === statusToMatch
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
    const statusUpper = (status || 'REQUESTED').toUpperCase();
    switch (statusUpper) {
      case 'REQUESTED': 
        return 'bg-amber-100 text-amber-800 border border-amber-200';
      case 'ASSIGNED':
        return 'bg-blue-100 text-blue-800 border border-blue-200';
      case 'IN_PROGRESS': 
        return 'bg-indigo-100 text-indigo-800 border border-indigo-200';
      case 'COMPLETED': 
        return 'bg-green-100 text-green-800 border border-green-200';
      case 'CANCELLED': 
        return 'bg-red-100 text-red-800 border border-red-200';
      case 'RESCHEDULED':
        return 'bg-purple-100 text-purple-800 border border-purple-200';
      default: 
        return 'bg-gray-100 text-gray-800 border border-gray-200';
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
    <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Service Requests</h1>
              <p className="text-gray-600 mt-1">Manage your appliance service requests and appointments.</p>
            </div>
            <button
              className="flex items-center space-x-2 px-6 py-3 bg-lowesBlue-500 text-white font-medium rounded-lg hover:bg-lowesBlue-500 transition-colors duration-200"
              onClick={() => {
                setEditRequest(null);
                setShowForm(true);
              }}
            >
              <Plus className="h-5 w-5" />
              <span>New Request</span>
            </button>
          </div>
        </div>

        {/* Filter Tabs */}
        <div className="border-b border-gray-200 mb-6">
          <nav className="flex space-x-8">
            {filters.map((filter) => (
              <button
                key={filter}
                onClick={() => setActiveFilter(filter)}
                className={`py-3 px-1 border-b-2 font-medium text-sm transition-colors duration-200 ${
                  activeFilter === filter
                    ? 'border-lowesBlue-500 text-lowesBlue-500'
                    : 'border-transparent text-gray-500 hover:text-gray-700'
                }`}
              >
                {filter}
              </button>
            ))}
          </nav>
        </div>

        {/* Content */}
        {loading ? (
          <div className="text-center py-12">
            <p className="text-gray-600">Loading service requests...</p>
          </div>
        ) : error ? (
          <div className="text-center py-12">
            <p className="text-red-600">{error}</p>
          </div>
        ) : filteredRequests.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-600">No service requests found for "{activeFilter}" status.</p>
          </div>
        ) : (
          <div className="space-y-6">
            {filteredRequests.map((req) => {
              const appl = appliances.find((a) =>
                a.serialNumber === req.serialNumber
              );
              return (
                <div key={req.id} className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                  <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-4">
                        <h3 className="text-lg font-semibold text-gray-900">
                          Request #{req.id || `SR${String(req.id).padStart(3, '0')}`}
                        </h3>
                        <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(req.status || 'REQUESTED')}`}>
                          {req.status ? req.status.replace('_', ' ').toLowerCase().replace(/\b\w/g, c => c.toUpperCase()) : 'Requested'}
                        </span>
                      </div>
                      <div className="text-gray-600 mb-4">
                        <strong>Appliance:</strong> {req.applianceInfo || req.serialNumber}
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div>
                          <h4 className="text-sm font-medium text-gray-500 mb-1">Issue</h4>
                          <p className="text-gray-900">{req.issueDescription}</p>
                        </div>
                        <div>
                          <h4 className="text-sm font-medium text-gray-500 mb-1">Request Date</h4>
                          <p className="text-gray-900">{formatDate(req.createdAt || req.preferredSlot)}</p>
                        </div>
                        <div>
                          <h4 className="text-sm font-medium text-gray-500 mb-1">Scheduled Date</h4>
                          <p className="text-gray-900">{formatDateTime(req.preferredSlot)}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="flex gap-3 mt-4 pt-4 border-t border-gray-200">
                    {(() => {
                      const status = (req.status || '').toUpperCase();
                      if (status === 'CANCELLED' || status === 'IN_PROGRESS' || status === 'COMPLETED') {
                        return null;
                      }
                      return (
                        <>
                          <button
                            onClick={() => {
                              setEditRequest(req);
                              setShowForm(true);
                            }}
                            className="px-4 py-2 bg-lowesBlue-500 text-white rounded-lg hover:bg-lowesBlue-500 transition-colors font-medium text-sm"
                          >
                            Reschedule
                          </button>
                          <button
                            onClick={() => handleCancel(req.id)}
                            className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors font-medium text-sm"
                          >
                            Cancel
                          </button>
                        </>
                      );
                    })()}
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