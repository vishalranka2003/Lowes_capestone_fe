// src/components/TechnicianCard.jsx
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Eye } from 'lucide-react';

export const TechnicianCard = ({ technician, isAvailable, onViewRequests }) => {
  const navigate = useNavigate();

  const handleClick = () => {
    if (isAvailable) {
      alert('This technician has no assigned requests.');
    } else {
      onViewRequests(technician.id);
    }
  };

  const handleNameClick = () => {
    navigate(`/dashboard/admin/technicians/${technician.id}`, { state: { technician } });
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow duration-200">
      {/* Header */}
      <div className="flex justify-between items-start mb-4">
        <h3 
          className="text-lg font-semibold text-lowesBlue-500 hover:text-lowesBlue-500 cursor-pointer underline transition-colors duration-200"
          onClick={handleNameClick}
        >
          {technician.firstName} {technician.lastName}
        </h3>
        <span className={`px-3 py-1 rounded-full text-xs font-medium ${
          isAvailable 
            ? 'bg-green-100 text-green-800' 
            : 'bg-pink-100 text-pink-800'
        }`}>
          {isAvailable ? 'Available' : 'Assigned'}
        </span>
      </div>

      {/* Info */}
      <div className="space-y-2 mb-6">
        <div className="flex justify-between items-center">
          <span className="text-sm text-gray-600 font-medium">Email:</span>
          <span className="text-sm text-gray-900">{technician.email}</span>
        </div>
        <div className="flex justify-between items-center">
          <span className="text-sm text-gray-600 font-medium">Phone:</span>
          <span className="text-sm text-gray-900">{technician.phoneNumber}</span>
        </div>
        <div className="flex justify-between items-center">
          <span className="text-sm text-gray-600 font-medium">Specialization:</span>
          <span className="text-sm text-gray-900">{technician.specialization}</span>
        </div>
        <div className="flex justify-between items-center">
          <span className="text-sm text-gray-600 font-medium">Experience:</span>
          <span className="text-sm text-gray-900">{technician.experience} years</span>
        </div>
      </div>

      {/* Button */}
      <button
        className={`flex items-center space-x-2 px-4 py-2 rounded-lg font-medium transition-colors duration-200 ${
          isAvailable
            ? 'bg-gray-400 text-white cursor-not-allowed'
            : 'bg-lowesBlue-500 hover:bg-lowesBlue-500 text-white'
        }`}
        onClick={handleClick}
        disabled={isAvailable}
      >
        <Eye className="h-4 w-4" />
        <span>View Assigned Requests</span>
      </button>
    </div>
  );
};
