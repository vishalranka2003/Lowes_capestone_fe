// src/components/ViewCompletionFormModal.jsx
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { X, FileText, Calendar, Clock, CheckCircle, AlertCircle } from 'lucide-react';

const API_BASE_URL = process.env.REACT_APP_API_URL;

export default function ViewCompletionFormModal({ requestId, onClose }) {
  const [completionForm, setCompletionForm] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCompletionForm = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await axios.get(
          `${API_BASE_URL}/technician/service-request/${requestId}/completion`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        setCompletionForm(response.data);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching completion form:', error);
        setError('No completion form found.');
        setLoading(false);
      }
    };

    fetchCompletionForm();
  }, [requestId]);

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50 flex items-center justify-center">
      <div className="relative bg-white rounded-xl shadow-xl max-w-md w-full mx-4">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-blue-100 rounded-lg">
              <FileText className="h-5 w-5 text-lowesBlue-500" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900">
              Completion Form Details
            </h3>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X className="h-5 w-5 text-gray-500" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6">
          {loading && (
            <div className="flex items-center justify-center py-8">
              <div className="text-gray-600">Loading completion details...</div>
            </div>
          )}

          {error && (
            <div className="flex items-center space-x-3 p-4 bg-red-50 border border-red-200 rounded-lg">
              <AlertCircle className="h-5 w-5 text-red-600" />
              <p className="text-red-700">{error}</p>
            </div>
          )}

          {completionForm && (
            <div className="space-y-4">
              <div className="flex items-center space-x-3 p-4 bg-gray-50 rounded-lg">
                <Calendar className="h-5 w-5 text-gray-600" />
                <div>
                  <div className="text-sm font-medium text-gray-900">Completion Date</div>
                  <div className="text-sm text-gray-600">{completionForm.completionDate}</div>
                </div>
              </div>

              <div className="flex items-center space-x-3 p-4 bg-gray-50 rounded-lg">
                <Clock className="h-5 w-5 text-gray-600" />
                <div>
                  <div className="text-sm font-medium text-gray-900">Completion Time</div>
                  <div className="text-sm text-gray-600">{completionForm.completionTime}</div>
                </div>
              </div>

              <div className="flex items-start space-x-3 p-4 bg-gray-50 rounded-lg">  
                <FileText className="h-5 w-5 text-gray-600 mt-1" />
                  <div>
                    <div className="text-sm font-medium text-gray-900 mb-1">Technician Notes</div>
                      <div className="text-sm text-gray-600 whitespace-pre-wrap">
                        {completionForm.technicianNotes}
                      </div>
                    </div>
                  </div>


              <div className="flex items-center space-x-3 p-4 bg-gray-50 rounded-lg">
                <CheckCircle className={`h-5 w-5 ${completionForm.confirmed ? 'text-green-600' : 'text-gray-400'}`} />
                <div>
                  <div className="text-sm font-medium text-gray-900">Status</div>
                  <div className={`text-sm font-medium ${completionForm.confirmed ? 'text-green-600' : 'text-gray-600'}`}>
                    {completionForm.confirmed ? 'Confirmed' : 'Pending Confirmation'}
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex justify-end p-6 border-t border-gray-200">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg font-medium transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
