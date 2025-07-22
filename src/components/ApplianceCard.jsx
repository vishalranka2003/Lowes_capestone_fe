import React from 'react';
import { Edit, Trash2 } from 'lucide-react';

export const ApplianceCard = ({ appliance, onEdit, onDelete }) => {
  const currentDate = new Date();
  const purchaseDate = new Date(appliance.purchaseDate);
  const expiryDate = new Date(appliance.warrantyExpiryDate);

  const totalDuration = expiryDate - purchaseDate;
  const timeUsed = currentDate - purchaseDate;
  const progressPercentage = Math.max(
    0,
    Math.min(100, (timeUsed / totalDuration) * 100)
  );

  const daysLeft = Math.ceil((expiryDate - currentDate) / (1000 * 60 * 60 * 24));
  const isExpired = daysLeft < 0;

  let status = 'active';
  if (isExpired) {
    status = 'expired';
  } else if (daysLeft < 30) {
    status = 'expiring';
  }

  const capitalize = (str) =>
    typeof str === 'string' && str.length > 0
      ? str.charAt(0).toUpperCase() + str.slice(1).toLowerCase()
      : '';

  const brand = capitalize(appliance.brand || 'Unknown');
  const category = capitalize(appliance.category || '');

  const getStatusColors = (status) => {
    switch (status) {
      case 'active':
        return 'bg-green-100 text-green-800';
      case 'expiring':
        return 'bg-yellow-100 text-yellow-800';
      case 'expired':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getProgressColors = (status) => {
    switch (status) {
      case 'active':
        return 'bg-green-500';
      case 'expiring':
        return 'bg-yellow-500';
      case 'expired':
        return 'bg-red-500';
      default:
        return 'bg-gray-500';
    }
  };

  const getDaysLeftColor = (status) => {
    switch (status) {
      case 'active':
        return 'text-green-600';
      case 'expiring':
        return 'text-yellow-600';
      case 'expired':
        return 'text-red-600';
      default:
        return 'text-gray-600';
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow duration-200">
      {/* Header */}
      <div className="flex justify-between items-start mb-4">
        <h3 className="text-lg font-semibold text-gray-900">
          {brand}: {category}
        </h3>
        <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColors(status)}`}>
          {status.charAt(0).toUpperCase() + status.slice(1)}
        </span>
      </div>

      {/* Model */}
      <p className="text-gray-600 text-sm mb-4">Model: {appliance.modelNumber}</p>

      {/* Warranty Status */}
      <div className="flex justify-between items-center mb-3">
        <span className="text-sm text-gray-600">Warranty Status</span>
        <span className={`text-sm font-medium ${getDaysLeftColor(status)}`}>
          {isExpired
            ? `Expired ${Math.abs(daysLeft)} days ago`
            : `${daysLeft} day(s) left`}
        </span>
      </div>

      {/* Progress Bar */}
      <div className="w-full bg-gray-200 rounded-full h-2 mb-4">
        <div
          className={`h-2 rounded-full transition-all duration-300 ${getProgressColors(status)}`}
          style={{ width: `${progressPercentage}%` }}
        />
      </div>

      {/* Dates */}
      <div className="space-y-2 mb-6">
        <div className="flex justify-between text-sm">
          <span className="text-gray-600">Purchased:</span>
          <span className="text-gray-900 font-medium">
            {purchaseDate.toLocaleDateString()}
          </span>
        </div>
        <div className="flex justify-between text-sm">
          <span className="text-gray-600">Warranty Expires:</span>
          <span className="text-gray-900 font-medium">
            {expiryDate.toLocaleDateString()}
          </span>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex space-x-3">
        <button 
          onClick={() => onEdit && onEdit(appliance)}
          className="flex-1 flex items-center justify-center space-x-2 px-4 py-2 text-lowesBlue-500 border border-lowesBlue-500 rounded-lg hover:bg-blue-50 transition-colors duration-200"
        >
          <Edit className="h-4 w-4" />
          <span>Edit</span>
        </button>
        
        <button
          onClick={() => onDelete && onDelete(appliance.id)}
          className="flex-1 flex items-center justify-center space-x-2 px-4 py-2 text-red-600 border border-red-600 rounded-lg hover:bg-red-50 transition-colors duration-200"
        >
          <Trash2 className="h-4 w-4" />
          <span>Delete</span>
        </button>
      </div>
    </div>
  );
};




// import React from 'react';

// export const ApplianceCard = ({ appliance, onEdit }) => {
//   const currentDate = new Date();
//   const purchaseDate = new Date(appliance.purchaseDate);
//   const expiryDate = new Date(appliance.warrantyExpiryDate);

//   const totalDuration = expiryDate - purchaseDate;
//   const timeUsed = currentDate - purchaseDate;
//   const progressPercentage = Math.max(
//     0,
//     Math.min(100, (timeUsed / totalDuration) * 100)
//   );

//   const daysLeft = Math.ceil((expiryDate - currentDate) / (1000 * 60 * 60 * 24));
//   const isExpired = daysLeft < 0;

//   let status = 'active';
//   if (isExpired) {
//     status = 'expired';
//   } else if (daysLeft < 30) {
//     status = 'expiring';
//   }

//   return (

//     <div className={`appliance-card status-${status}`}>
//       <div className="flex-space-between">
//         {/* <h2 className="appliance-name">{appliance.brand}</h2> */}
//         {/* <h2 className="appliance-name"
//         style={{ color: 'black', fontWeight: 'bold', fontSize: '18px' }}
//         >
//          {appliance.brand}</h2> */}

//         <h2
//           className="appliance-name"
//           style={{ color: 'black', fontWeight: 'bold', fontSize: '18px' }}
//         >
//           {appliance.brand} <span style={{ fontWeight: 'normal', fontSize: '14px', color: '#666' }}>
//             ({appliance.category})
//           </span>
//         </h2>

//         <span className={`status-badge ${status}`}>
//           {status.charAt(0).toUpperCase() + status.slice(1)}
//         </span>
//       </div>

//       <p className="appliance-detail">Model: {appliance.modelNumber}</p>

//       <div className="warranty-header">
//         <span className="appliance-detail">Warranty Status</span>
//         <span
//           className={`warranty-days-left ${status === 'active'
//               ? 'text-green'
//               : status === 'expiring'
//                 ? 'text-orange'
//                 : 'text-red'
//             }`}
//         >
//           {isExpired
//             ? `Expired ${Math.abs(daysLeft)} days ago`
//             : `${daysLeft} day(s) left`}
//         </span>
//       </div>

//       <div className="progress-bar-bg">
//         <div
//           className="progress-bar-fill"
//           style={{ width: `${progressPercentage}%` }}
//         />
//       </div>

//       <div className="purchase-expiry-row">
//         <span className="appliance-detail">Purchased:</span>
//         <span className="appliance-detail">
//           {purchaseDate.toLocaleDateString()}
//         </span>
//       </div>
//       <div className="purchase-expiry-row">
//         <span className="appliance-detail">Warranty Expires:</span>
//         <span className="appliance-detail">
//           {expiryDate.toLocaleDateString()}
//         </span>
//       </div>

//       <div className="action-buttons">
//         <button className="btn-outline" onClick={() => onEdit && onEdit(appliance)}>
//           ✏️ Edit
//         </button>
//         <button className="btn-outline">🔧 Service</button>
//       </div>
//     </div>
//   );
// };



// // src/components/ApplianceCard.jsx
// import React from 'react';

// export const ApplianceCard = ({ appliance }) => {
//   const currentDate = new Date();
//   const purchaseDate = new Date(appliance.purchaseDate);
//   const expiryDate = new Date(appliance.warrantyExpiryDate);

//   const totalDuration = expiryDate - purchaseDate;
//   const timeUsed = currentDate - purchaseDate;
//   const progressPercentage = Math.max(
//     0,
//     Math.min(100, (timeUsed / totalDuration) * 100)
//   );

//   const daysLeft = Math.ceil((expiryDate - currentDate) / (1000 * 60 * 60 * 24));
//   const isExpired = daysLeft < 0;

//   let status = 'active';
//   if (isExpired) {
//     status = 'expired';
//   } else if (daysLeft < 30) {
//     status = 'expiring';
//   }

//   return (
//     // ✅ This is the only change – add status-[status] class
//     <div className={`appliance-card status-${status}`}>
//       <div className="flex-space-between">
//         <h2 className="appliance-name">{appliance.brand}</h2>
//         <span className={`status-badge ${status}`}>
//           {status.charAt(0).toUpperCase() + status.slice(1)}
//         </span>
//       </div>

//       <p className="appliance-detail">Model: {appliance.modelNumber}</p>

//       <div className="warranty-header">
//         <span className="appliance-detail">Warranty Status</span>
//         <span className={`warranty-days-left ${status === 'active' ? 'text-green' : status === 'expiring' ? 'text-orange' : 'text-red'}`}>
//           {isExpired
//             ? `Expired ${Math.abs(daysLeft)} days ago`
//             : `${daysLeft} day(s) left`}
//         </span>
//       </div>

//       <div className="progress-bar-bg">
//         <div
//           className="progress-bar-fill"
//           style={{ width: `${progressPercentage}%` }}
//         />
//       </div>

//       {/* ✅ Right-aligned, bold dates (CSS handles styling) */}
//       <div className="purchase-expiry-row">
//         <span className="appliance-detail">Purchased:</span>
//         <span className="appliance-detail">
//           {purchaseDate.toLocaleDateString()}
//         </span>
//       </div>
//       <div className="purchase-expiry-row">
//         <span className="appliance-detail">Warranty Expires:</span>
//         <span className="appliance-detail">
//           {expiryDate.toLocaleDateString()}
//         </span>
//       </div>

//       <div className="action-buttons">
//         <button className="btn-outline">Edit</button>
//         <button className="btn-outline">Service</button>
//       </div>
//     </div>
//   );
// };



// // src/components/ApplianceCard.jsx
// import React from 'react';

// export const ApplianceCard = ({ appliance }) => {
//   const currentDate = new Date();
//   const purchaseDate = new Date(appliance.purchaseDate);
//   const expiryDate = new Date(appliance.warrantyExpiryDate);

//   const totalDuration = expiryDate - purchaseDate;
//   const timeUsed = currentDate - purchaseDate;
//   const progressPercentage = Math.max(
//     0,
//     Math.min(100, (timeUsed / totalDuration) * 100)
//   );

//   const daysLeft = Math.ceil((expiryDate - currentDate) / (1000 * 60 * 60 * 24));
//   const isExpired = daysLeft < 0;

//   let status = 'active';
//   if (isExpired) {
//     status = 'expired';
//   } else if (daysLeft < 30) {
//     status = 'expiring';
//   }

//   return (
//     <div className="appliance-card">
//       <div className="flex-space-between">
//         <h2 className="appliance-name">{appliance.brand}</h2>
//         <span className={`status-badge ${status}`}>
//           {status.charAt(0).toUpperCase() + status.slice(1)}
//         </span>
//       </div>

//       <p className="appliance-detail">Model: {appliance.modelNumber}</p>

//       <p className="appliance-detail">Warranty Status</p>
//       <div className="progress-bar-bg">
//         <div
//           className="progress-bar-fill"
//           style={{ width: `${progressPercentage}%` }}
//         />
//       </div>

//       <p className="appliance-detail">
//         {isExpired
//           ? `Expired ${Math.abs(daysLeft)} days ago`
//           : `${daysLeft} day(s) left`}
//       </p>

//       <p className="appliance-detail">
//         Purchased: {new Date(appliance.purchaseDate).toLocaleDateString()}
//       </p>
//       <p className="appliance-detail">
//         Warranty Expires: {new Date(appliance.warrantyExpiryDate).toLocaleDateString()}
//       </p>

//       <div className="action-buttons">
//         <button className="btn-outline">Details</button>
//         <button className="btn-outline">Service</button>
//       </div>
//     </div>
//   );
// };
