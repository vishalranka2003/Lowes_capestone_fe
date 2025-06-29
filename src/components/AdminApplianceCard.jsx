import React from 'react';
import '../styles/ApplianceCard.css';

export const AdminApplianceCard = ({ appliance }) => {
  const currentDate = new Date();
  const purchaseDate = new Date(appliance.purchaseDate);
  const expiryDate = new Date(appliance.warrantyExpiryDate);

  const daysLeft = Math.ceil((expiryDate - currentDate) / (1000 * 60 * 60 * 24));
  const isExpired = daysLeft < 0;

  let status = 'active';
  if (isExpired) status = 'expired';
  else if (daysLeft < 30) status = 'expiring';

  return (
    <div className="appliance-card">
      <div className="appliance-header">
        <h3 className="appliance-title">
          {appliance.brand} - {appliance.modelNumber}
        </h3>
        <span className={`badge ${status}`}>
          {isExpired ? 'Expired' : status === 'expiring' ? 'Expiring Soon' : 'Active'}
        </span>
      </div>
      <div className="appliance-info">
        <p><strong>Serial:</strong> {appliance.serialNumber}</p>
        <p><strong>Homeowner:</strong> {appliance.homeownerName}</p>
        <p><strong>Purchased:</strong> {purchaseDate.toLocaleDateString()}</p>
        <p><strong>Warranty Expires:</strong> {expiryDate.toLocaleDateString()}</p>
      </div>
    </div>
  );
};
