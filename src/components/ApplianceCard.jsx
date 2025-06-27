import React from 'react';

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

  return (
    <div className={`appliance-card status-${status}`}>
      <div className="flex-space-between">
        <h2
          className="appliance-name"
          style={{ color: 'black', fontWeight: 'bold', fontSize: '18px' }}
        >
          {brand} {category}
        </h2>

        <span className={`status-badge ${status}`}>
          {status.charAt(0).toUpperCase() + status.slice(1)}
        </span>
      </div>

      <p className="appliance-detail">Model: {appliance.modelNumber}</p>

      <div className="warranty-header">
        <span className="appliance-detail">Warranty Status</span>
        <span
          className={`warranty-days-left ${
            status === 'active'
              ? 'text-green'
              : status === 'expiring'
              ? 'text-orange'
              : 'text-red'
          }`}
        >
          {isExpired
            ? `Expired ${Math.abs(daysLeft)} days ago`
            : `${daysLeft} day(s) left`}
        </span>
      </div>

      <div className="progress-bar-bg">
        <div
          className="progress-bar-fill"
          style={{ width: `${progressPercentage}%` }}
        />
      </div>

      <div className="purchase-expiry-row">
        <span className="appliance-detail">Purchased:</span>
        <span className="appliance-detail">
          {purchaseDate.toLocaleDateString()}
        </span>
      </div>
      <div className="purchase-expiry-row">
        <span className="appliance-detail">Warranty Expires:</span>
        <span className="appliance-detail">
          {expiryDate.toLocaleDateString()}
        </span>
      </div>

      <div className="action-buttons">
        <button className="btn-outline" onClick={() => onEdit && onEdit(appliance)}>
          ✏️ Edit
        </button>
        
        <button
          className="btn-outline delete-btn"
          onClick={() => onDelete && onDelete(appliance.id)}
        >
          🗑️ Delete
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
