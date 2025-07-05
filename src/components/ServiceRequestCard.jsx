import React, { useState } from 'react';
import { Check } from 'lucide-react';

export const ServiceRequestCard = ({ request, availableTechnicians, onAllocate }) => {
  const [selectedTechnician, setSelectedTechnician] = useState('');

  const handleAllocate = () => {
    if (selectedTechnician) {
      onAllocate(request.id, selectedTechnician);
    }
  };

  // Format appliance display text
  const formattedApplianceTitle = request.serialNumber
    ? `${request.applianceName} ${request.serialNumber}`
    : request.applianceName;

  const getStatusColors = (status) => {
    switch (status.toLowerCase()) {
      case 'requested':
        return 'bg-yellow-100 text-yellow-800';
      case 'assigned':
        return 'bg-blue-100 text-blue-800';
      case 'in_progress':
        return 'bg-sky-100 text-sky-800';
      case 'completed':
        return 'bg-green-100 text-green-800';
      case 'cancelled':
        return 'bg-red-100 text-red-800';
      case 'rescheduled':
        return 'bg-purple-100 text-purple-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow duration-200">
      {/* Header */}
      <div className="flex justify-between items-start mb-4">
        <h3 className="text-lg font-semibold text-gray-900">
          {formattedApplianceTitle}
        </h3>
        <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColors(request.status)}`}>
          {request.status.replace('_', ' ').toLowerCase()}
        </span>
      </div>

      {/* Body */}
      <div className="space-y-3">
        <div className="flex justify-between items-center">
          <span className="text-sm text-gray-600 font-medium">Homeowner:</span>
          <span className="text-sm text-gray-900">{request.homeownerName}</span>
        </div>

        {request.status !== 'REQUESTED' ? (
          <div className="flex justify-between items-center">
            <span className="text-sm text-gray-600 font-medium">Technician:</span>
            <span className="text-sm text-gray-900">{request.technicianName || 'N/A'}</span>
          </div>
        ) : (
          <div className="space-y-3 pt-2 border-t border-gray-100">
            <label className="block text-sm font-medium text-gray-700">
              Allocate Technician
            </label>
            <select
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-200"
              value={selectedTechnician}
              onChange={(e) => setSelectedTechnician(e.target.value)}
            >
              <option value="">-- Select Technician --</option>
              {availableTechnicians.map((tech) => (
                <option key={tech.id} value={tech.id}>
                  {tech.name} ({tech.specialization})
                </option>
              ))}
            </select>
            <button
              className="w-full flex items-center justify-center space-x-2 px-4 py-2 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors duration-200"
              onClick={handleAllocate}
              disabled={!selectedTechnician}
            >
              <Check className="h-4 w-4" />
              <span>Confirm</span>
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
