import React from 'react';
import { render, screen } from '@testing-library/react';
import { AdminApplianceCard } from '../../../components/AdminApplianceCard';
import '@testing-library/jest-dom';

// Helper to format date the same way as .toLocaleDateString()
const getFormattedDate = (dateString) => new Date(dateString).toLocaleDateString();

describe('AdminApplianceCard', () => {
  const baseAppliance = {
    brand: 'Samsung',
    modelNumber: 'SMG-1234',
    serialNumber: 'SN-001122',
    homeownerName: 'Jane Doe',
    purchaseDate: '2023-07-15',
    warrantyExpiryDate: '', // We’ll set this in each test
  };

  test('shows Active warranty status', () => {
    const appliance = { ...baseAppliance, warrantyExpiryDate: '2026-12-31' };
    render(<AdminApplianceCard appliance={appliance} />);

    expect(screen.getByText(/Samsung - SMG-1234/)).toBeInTheDocument();
    expect(screen.getByText(/SN-001122/)).toBeInTheDocument();
    expect(screen.getByText(/Jane Doe/)).toBeInTheDocument();
    expect(screen.getByText(getFormattedDate(appliance.purchaseDate))).toBeInTheDocument();
    expect(screen.getByText(getFormattedDate(appliance.warrantyExpiryDate))).toBeInTheDocument();
    expect(screen.getByText(/Active/)).toBeInTheDocument();
  });

  test('shows Expiring Soon status when less than 30 days remain', () => {
    const expiringSoonDate = new Date();
    expiringSoonDate.setDate(expiringSoonDate.getDate() + 10);
    const appliance = { ...baseAppliance, warrantyExpiryDate: expiringSoonDate.toISOString() };
    render(<AdminApplianceCard appliance={appliance} />);

    expect(screen.getByText(/Expiring Soon/)).toBeInTheDocument();
    expect(screen.getByText(getFormattedDate(expiringSoonDate.toISOString()))).toBeInTheDocument();
  });

  test('shows Expired status when warranty has passed', () => {
    const expiredDate = new Date();
    expiredDate.setDate(expiredDate.getDate() - 10);
    const appliance = { ...baseAppliance, warrantyExpiryDate: expiredDate.toISOString() };
    render(<AdminApplianceCard appliance={appliance} />);

    expect(screen.getByText(/Expired/)).toBeInTheDocument();
    expect(screen.getByText(getFormattedDate(expiredDate.toISOString()))).toBeInTheDocument();
  });
});
