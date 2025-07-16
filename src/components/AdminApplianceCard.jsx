import React from 'react';
import { Package, User, Calendar, AlertTriangle, CheckCircle, Clock } from 'lucide-react';

export const AdminApplianceCard = ({ appliance }) => {
  const currentDate = new Date();
  const purchaseDate = new Date(appliance.purchaseDate);
  const expiryDate = new Date(appliance.warrantyExpiryDate);

  const daysLeft = Math.ceil((expiryDate - currentDate) / (1000 * 60 * 60 * 24));
  const isExpired = daysLeft < 0;

  let status = 'active';
  if (isExpired) status = 'expired';
  else if (daysLeft < 30) status = 'expiring';

  const getStatusInfo = (status) => {
    switch (status) {
      case 'expired':
        return {
          text: 'Expired',
          color: 'bg-red-100 text-red-800',
          icon: AlertTriangle,
          iconColor: 'text-red-500'
        };
      case 'expiring':
        return {
          text: 'Expiring Soon',
          color: 'bg-yellow-100 text-yellow-800',
          icon: Clock,
          iconColor: 'text-yellow-500'
        };
      default:
        return {
          text: 'Active',
          color: 'bg-green-100 text-green-800',
          icon: CheckCircle,
          iconColor: 'text-green-500'
        };
    }
  };

  const statusInfo = getStatusInfo(status);
  const StatusIcon = statusInfo.icon;

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow duration-200">
      <div className="flex items-start justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
          <Package className="h-5 w-5 text-blue-600" />
          {appliance.brand} - {appliance.modelNumber}
        </h3>
        <span className={`px-2 py-1 rounded-full text-xs font-medium flex items-center gap-1 ${statusInfo.color}`}>
          <StatusIcon className={`h-3 w-3 ${statusInfo.iconColor}`} />
          {statusInfo.text}
        </span>
      </div>
      
      <div className="space-y-3">
        <div className="flex items-center gap-2">
          <span className="text-sm font-medium text-gray-600">Serial:</span>
          <span className="text-sm text-gray-900">{appliance.serialNumber}</span>
        </div>
        
        <div className="flex items-center gap-2">
          <User className="h-4 w-4 text-gray-400" />
          <span className="text-sm font-medium text-gray-600">Homeowner:</span>
          <span className="text-sm text-gray-900">{appliance.homeownerName}</span>
        </div>
        
        <div className="flex items-center gap-2">
          <Calendar className="h-4 w-4 text-gray-400" />
          <span className="text-sm font-medium text-gray-600">Purchased:</span>
          <span className="text-sm text-gray-900">{purchaseDate.toLocaleDateString()}</span>
        </div>
        
        <div className="flex items-center gap-2">
          <Calendar className="h-4 w-4 text-gray-400" />
          <span className="text-sm font-medium text-gray-600">Warranty Expires:</span>
          <span className={`text-sm font-medium ${statusInfo.color.replace('bg-', 'text-').replace('100', '800')}`}>
            {expiryDate.toLocaleDateString()}
          </span>
        </div>
      </div>
    </div>
  );
};
