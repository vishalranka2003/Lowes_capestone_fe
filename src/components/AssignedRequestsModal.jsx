import React from 'react';
import { X, Wrench, Calendar, User, Package } from 'lucide-react';

export const AssignedRequestsModal = ({ requests, onClose }) => {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-xl shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h3 className="text-xl font-bold text-gray-900 flex items-center gap-2">
            <Wrench className="h-5 w-5 text-lowesBlue-500" />
            Assigned Service Requests
          </h3>
          <button 
            className="text-gray-400 hover:text-gray-600 transition-colors"
            onClick={onClose}
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="p-6">
          {requests.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-gray-600">No assigned requests found.</p>
            </div>
          ) : (
            <div className="space-y-4">
              {requests.map(req => (
                <div key={req.id} className="bg-gray-50 border border-gray-200 rounded-lg p-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-medium text-gray-600">ID:</span>
                        <span className="text-sm text-gray-900">{req.id}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-medium text-gray-600">Issue:</span>
                        <span className="text-sm text-gray-900">{req.issueDescription}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-medium text-gray-600">Status:</span>
                        <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-xs font-medium">
                          {req.status.replace(/_/g, ' ').toLowerCase()
                            .replace(/\b\w/g, c => c.toUpperCase())}
                        </span>
                      </div>
                    </div>
                    <div className="space-y-2">
                      <div className="flex items-center gap-2">
                        <Package className="h-4 w-4 text-gray-400" />
                        <span className="text-sm font-medium text-gray-600">Appliance:</span>
                        <span className="text-sm text-gray-900">{req.applianceInfo}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <User className="h-4 w-4 text-gray-400" />
                        <span className="text-sm font-medium text-gray-600">Homeowner:</span>
                        <span className="text-sm text-gray-900">{req.homeownerName}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Calendar className="h-4 w-4 text-gray-400" />
                        <span className="text-sm font-medium text-gray-600">Preferred Slot:</span>
                        <span className="text-sm text-gray-900">{new Date(req.preferredSlot).toLocaleString()}</span>
                      </div>
                    </div>
                  </div>
                  <div className="mt-3 pt-3 border-t border-gray-200">
                    <div className="flex items-center gap-2">
                      <Calendar className="h-4 w-4 text-gray-400" />
                      <span className="text-sm font-medium text-gray-600">Created At:</span>
                      <span className="text-sm text-gray-900">{new Date(req.createdAt).toLocaleString()}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
