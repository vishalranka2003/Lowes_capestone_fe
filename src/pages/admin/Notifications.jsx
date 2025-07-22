import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Bell, Calendar, AlertTriangle, CheckCircle, Clock, RefreshCw } from 'lucide-react';

const API_BASE_URL = process.env.REACT_APP_API_URL;

export const Notifications = () => {
  const [expiringSoon, setExpiringSoon] = useState([]);
  const [expiringNextMonth, setExpiringNextMonth] = useState([]);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [messageType, setMessageType] = useState('');
  const [customDays, setCustomDays] = useState(7);
  const [customExpiring, setCustomExpiring] = useState([]);

  useEffect(() => {
    fetchExpiringSoon();
    fetchExpiringNextMonth();
  }, []);

  const fetchExpiringSoon = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(`${API_BASE_URL}/api/notifications/expiring-soon`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setExpiringSoon(response.data);
    } catch (error) {
      console.error('Error fetching expiring soon appliances:', error);
      showMessage('Failed to fetch expiring soon appliances', 'error');
    } finally {
      setLoading(false);
    }
  };

  const fetchExpiringNextMonth = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(`${API_BASE_URL}/api/notifications/expiring-next-month`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setExpiringNextMonth(response.data);
    } catch (error) {
      console.error('Error fetching expiring next month appliances:', error);
      showMessage('Failed to fetch expiring next month appliances', 'error');
    }
  };

  const fetchCustomDays = async () => {
    if (customDays < 1 || customDays > 365) {
      showMessage('Please enter a valid number of days (1-365)', 'error');
      return;
    }

    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(`${API_BASE_URL}/api/notifications/expiring-in/${customDays}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setCustomExpiring(response.data);
    } catch (error) {
      console.error('Error fetching custom days appliances:', error);
      showMessage('Failed to fetch appliances expiring in custom days', 'error');
    } finally {
      setLoading(false);
    }
  };

  const triggerWarrantyCheck = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      const response = await axios.post(`${API_BASE_URL}/api/notifications/check-warranty-expiry`, {}, {
        headers: { Authorization: `Bearer ${token}` }
      });
      showMessage(response.data, 'success');
      // Refresh the data after triggering
      fetchExpiringSoon();
      fetchExpiringNextMonth();
    } catch (error) {
      console.error('Error triggering warranty check:', error);
      showMessage('Failed to trigger warranty check', 'error');
    } finally {
      setLoading(false);
    }
  };

  const triggerCustomWarrantyCheck = async () => {
    if (customDays < 1 || customDays > 365) {
      showMessage('Please enter a valid number of days (1-365)', 'error');
      return;
    }

    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      const response = await axios.post(`${API_BASE_URL}/api/notifications/check-warranty-expiry/${customDays}`, {}, {
        headers: { Authorization: `Bearer ${token}` }
      });
      showMessage(response.data, 'success');
      // Refresh the data after triggering
      fetchExpiringSoon();
      fetchExpiringNextMonth();
      fetchCustomDays();
    } catch (error) {
      console.error('Error triggering custom warranty check:', error);
      showMessage('Failed to trigger custom warranty check', 'error');
    } finally {
      setLoading(false);
    }
  };

  const showMessage = (msg, type) => {
    setMessage(msg);
    setMessageType(type);
    setTimeout(() => {
      setMessage('');
      setMessageType('');
    }, 5000);
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const getDaysUntilExpiry = (expiryDate) => {
    const today = new Date();
    const expiry = new Date(expiryDate);
    const diffTime = expiry - today;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  const getExpiryStatus = (expiryDate) => {
    const days = getDaysUntilExpiry(expiryDate);
    if (days < 0) return { status: 'expired', color: 'red', icon: AlertTriangle };
    if (days <= 7) return { status: 'critical', color: 'orange', icon: AlertTriangle };
    if (days <= 30) return { status: 'warning', color: 'yellow', icon: Clock };
    return { status: 'normal', color: 'green', icon: CheckCircle };
  };

  const renderApplianceCard = (appliance) => {
    const expiryStatus = getExpiryStatus(appliance.warrantyExpiryDate);
    const daysUntilExpiry = getDaysUntilExpiry(appliance.warrantyExpiryDate);
    const StatusIcon = expiryStatus.icon;

    const getStatusColors = (status) => {
      switch (status) {
        case 'expired':
          return 'bg-red-50 border-red-200 text-red-800';
        case 'critical':
          return 'bg-orange-50 border-orange-200 text-orange-800';
        case 'warning':
          return 'bg-yellow-50 border-yellow-200 text-yellow-800';
        default:
          return 'bg-green-50 border-green-200 text-green-800';
      }
    };

    return (
      <div key={appliance.id} className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <div className="flex justify-between items-start mb-4">
          <div className="flex-1">
            <h4 className="text-lg font-semibold text-gray-900 mb-1">
              {appliance.brand} {appliance.modelNumber}
            </h4>
            <p className="text-sm text-gray-600 mb-1">SN: {appliance.serialNumber}</p>
            <p className="text-sm text-gray-600">Owner: {appliance.homeownerName}</p>
          </div>
          <div className={`p-2 rounded-lg ${getStatusColors(expiryStatus.status)}`}>
            <StatusIcon className="h-5 w-5" />
          </div>
        </div>
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span className="text-gray-600">Purchase Date:</span>
            <span className="text-gray-900">{formatDate(appliance.purchaseDate)}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-gray-600">Warranty Expires:</span>
            <span className={`font-medium ${getStatusColors(expiryStatus.status).replace('bg-', 'text-').replace('border-', 'text-').replace('50', '800').replace('200', '800')}`}>
              {formatDate(appliance.warrantyExpiryDate)}
            </span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-gray-600">Days Remaining:</span>
            <span className={`font-medium ${getStatusColors(expiryStatus.status).replace('bg-', 'text-').replace('border-', 'text-').replace('50', '800').replace('border-', 'text-').replace('200', '800')}`}>
              {daysUntilExpiry < 0 ? 'Expired' : `${daysUntilExpiry} days`}
            </span>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Page Header */}
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-2 flex items-center gap-2">
            {/* <Bell className="h-8 w-8 text-lowesBlue-500" /> */}
            Warranty Notifications
          </h2>
          <p className="text-gray-600">
            Manage warranty expiry notifications and monitor appliances with expiring warranties
          </p>
        </div>

        {/* Message */}
        {message && (
          <div className={`mb-6 p-4 rounded-lg ${
            messageType === 'success' 
              ? 'bg-green-50 border border-green-200 text-green-800' 
              : 'bg-red-50 border border-red-200 text-red-800'
          }`}>
            {message}
          </div>
        )}

        {/* Action Buttons */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-8">
          <div className="flex flex-col sm:flex-row gap-4 items-center">
            <button 
              className="flex items-center space-x-2 px-4 py-2 bg-lowesBlue-500 text-white rounded-lg hover:bg-lowesBlue-500 disabled:bg-gray-400 transition-colors"
              onClick={triggerWarrantyCheck}
              disabled={loading}
            >
              <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
              <span>Trigger 7-Day Check</span>
            </button>
            
            <div className="flex items-center space-x-2">
              <input
                type="number"
                min="1"
                max="365"
                value={customDays}
                onChange={(e) => setCustomDays(parseInt(e.target.value) || 7)}
                className="w-20 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-lowesBlue-500 focus:border-lowesBlue-500"
                placeholder="Days"
              />
              <button 
                className="flex items-center space-x-2 px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 disabled:bg-gray-400 transition-colors"
                onClick={triggerCustomWarrantyCheck}
                disabled={loading}
              >
                <Calendar className="h-4 w-4" />
                <span>Check Custom Days</span>
              </button>
            </div>
          </div>
        </div>

        {/* Expiring Soon Section */}
        <section className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-8">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-xl font-semibold text-gray-900 flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-red-500" />
              Expiring in 7 Days
            </h3>
            <span className="px-3 py-1 bg-red-100 text-red-800 rounded-full text-sm font-medium">
              {expiringSoon.length}
            </span>
          </div>
          
          {loading ? (
            <div className="text-center py-8">
              <div className="text-gray-600">Loading...</div>
            </div>
          ) : expiringSoon.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {expiringSoon.map(renderApplianceCard)}
            </div>
          ) : (
            <div className="text-center py-8">
              <CheckCircle className="h-12 w-12 text-green-500 mx-auto mb-4" />
              <p className="text-gray-600">No appliances expiring in the next 7 days</p>
            </div>
          )}
        </section>

        {/* Custom Days Section */}
        {customExpiring.length > 0 && (
          <section className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-8">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-semibold text-gray-900 flex items-center gap-2">
                <Clock className="h-5 w-5 text-yellow-500" />
                Expiring in {customDays} Days
              </h3>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {customExpiring.map(renderApplianceCard)}
            </div>
          </section>
        )}

        {/* Expiring Next Month Section */}
        <section className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-xl font-semibold text-gray-900 flex items-center gap-2">
              <Calendar className="h-5 w-5 text-lowesBlue-500" />
              Expiring Next Month (30 Days)
            </h3>
            <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm font-medium">
              {expiringNextMonth.length}
            </span>
          </div>
          
          {expiringNextMonth.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {expiringNextMonth.map(renderApplianceCard)}
            </div>
          ) : (
            <div className="text-center py-8">
              <CheckCircle className="h-12 w-12 text-green-500 mx-auto mb-4" />
              <p className="text-gray-600">No appliances expiring in the next 30 days</p>
            </div>
          )}
        </section>
      </div>
    </div>
  );
}; 