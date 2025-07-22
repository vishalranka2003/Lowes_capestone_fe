import React, { useState } from 'react';
import axios from 'axios';
import { X, CheckCircle, Calendar, Clock, FileText, AlertCircle } from 'lucide-react';

const API_BASE_URL = process.env.REACT_APP_API_URL;

export default function CompletionFormModal({ requestId, onSuccess, onClose }) {
  const [completionDate, setCompletionDate] = useState('');
  const [completionTime, setCompletionTime] = useState('');
  const [technicianNotes, setTechnicianNotes] = useState('');
  const [confirmed, setConfirmed] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    const token = localStorage.getItem('token');

    console.log('Raw input date:', completionDate);
    console.log('Raw input time:', completionTime);
    console.log('Technician Notes:', technicianNotes);
    console.log('Confirmed:', confirmed);

    const formattedDate = completionDate;

    let formattedTime = completionTime;
    if (completionTime.length === 5) {
      formattedTime = `${completionTime}:00`;
    }

    const payload = {
      completionDate: formattedDate,
      completionTime: formattedTime,
      technicianNotes: technicianNotes,
      confirmed: confirmed,
    };

    try {
      const response = await axios.post(
        `${API_BASE_URL}/technician/service-request/${requestId}/completion`,
        payload,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      alert('Completion form submitted successfully!');
      onSuccess();
    } catch (error) {
      console.error('API Error:', error);
      if (error.response) {
        console.error('Error Response Data:', error.response.data);
        console.error('Error Response Status:', error.response.status);
      }
      alert('Error submitting completion form. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50 flex items-center justify-center">
      <div className="relative bg-white rounded-xl shadow-xl max-w-lg w-full mx-4">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-green-100 rounded-lg">
              <CheckCircle className="h-5 w-5 text-green-600" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900">
              Complete Request #{requestId}
            </h3>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X className="h-5 w-5 text-gray-500" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6">
          <div className="space-y-6">
            {/* Date Input */}
            <div>
              <label className="flex items-center space-x-2 text-sm font-medium text-gray-700 mb-2">
                <Calendar className="h-4 w-4" />
                <span>Completion Date</span>
              </label>
              <input
                type="date"
                value={completionDate}
                onChange={(e) => setCompletionDate(e.target.value)}
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-lowesBlue-500 focus:border-lowesBlue-500 transition-colors"
              />
            </div>

            {/* Time Input */}
            <div>
              <label className="flex items-center space-x-2 text-sm font-medium text-gray-700 mb-2">
                <Clock className="h-4 w-4" />
                <span>Completion Time</span>
              </label>
              <input
                type="time"
                value={completionTime}
                onChange={(e) => setCompletionTime(e.target.value)}
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-lowesBlue-500 focus:border-lowesBlue-500 transition-colors"
              />
            </div>

            {/* Technician Notes */}
            <div>
              <label className="flex items-center space-x-2 text-sm font-medium text-gray-700 mb-2">
                <FileText className="h-4 w-4" />
                <span>Technician Notes</span>
              </label>
              <textarea
                value={technicianNotes}
                onChange={(e) => setTechnicianNotes(e.target.value)}
                required
                rows={4}
                placeholder="Describe the work performed, any issues encountered, and recommendations..."
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-lowesBlue-500 focus:border-lowesBlue-500 transition-colors resize-none"
              />
            </div>

            {/* Confirmation Checkbox */}
            <div className="flex items-center space-x-3 p-4 bg-gray-50 rounded-lg">
              <input
                type="checkbox"
                id="confirmed"
                checked={confirmed}
                onChange={(e) => setConfirmed(e.target.checked)}
                required
                className="w-4 h-4 text-lowesBlue-500 border-gray-300 rounded focus:ring-lowesBlue-500"
              />
              <label htmlFor="confirmed" className="text-sm font-medium text-gray-700">
                I confirm that the service request has been completed successfully
              </label>
            </div>
          </div>

          {/* Actions */}
          <div className="flex justify-end space-x-3 mt-6 pt-6 border-t border-gray-200">
            <button
              type="button"
              onClick={onClose}
              disabled={isSubmitting}
              className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg font-medium transition-colors disabled:opacity-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg font-medium transition-colors disabled:opacity-50 flex items-center space-x-2"
            >
              {isSubmitting ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  <span>Submitting...</span>
                </>
              ) : (
                <>
                  <CheckCircle className="h-4 w-4" />
                  <span>Submit</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
