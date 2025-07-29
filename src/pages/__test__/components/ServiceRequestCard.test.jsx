import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { ServiceRequestCard } from '../../../components/ServiceRequestCard'; // adjust path if needed

const mockRequestAssigned = {
  id: 1,
  applianceName: 'AC',
  serialNumber: 'XYZ123',
  homeownerName: 'John Doe',
  technicianName: 'Jane Smith',
  status: 'ASSIGNED'
};

const mockRequestRequested = {
  id: 2,
  applianceName: 'Washing Machine',
  serialNumber: null,
  homeownerName: 'Alice',
  technicianName: null,
  status: 'REQUESTED'
};

const mockTechnicians = [
  { id: 101, name: 'Tech A', specialization: 'Cooling' },
  { id: 102, name: 'Tech B', specialization: 'Heating' }
];

describe('ServiceRequestCard', () => {
  test('renders assigned request correctly', () => {
    render(
      <ServiceRequestCard
        request={mockRequestAssigned}
        availableTechnicians={mockTechnicians}
        onAllocate={jest.fn()}
      />
    );

    expect(screen.getByText('AC XYZ123')).toBeInTheDocument();
    expect(screen.getByText(/assigned/i)).toBeInTheDocument();
    expect(screen.getByText('John Doe')).toBeInTheDocument();
    expect(screen.getByText('Jane Smith')).toBeInTheDocument();
    expect(screen.queryByText(/allocate technician/i)).not.toBeInTheDocument();
  });

  test('renders requested request with dropdown and confirm button', () => {
    render(
      <ServiceRequestCard
        request={mockRequestRequested}
        availableTechnicians={mockTechnicians}
        onAllocate={jest.fn()}
      />
    );

    expect(screen.getByText('Washing Machine')).toBeInTheDocument();
    expect(screen.getByText(/requested/i)).toBeInTheDocument();
    expect(screen.getByText('Alice')).toBeInTheDocument();

    // Instead of getByLabelText, check label and select presence
    expect(screen.getByText(/allocate technician/i)).toBeInTheDocument();
    expect(screen.getByRole('combobox')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /confirm/i })).toBeDisabled();
  });

  test('enables confirm button after technician selection', () => {
    render(
      <ServiceRequestCard
        request={mockRequestRequested}
        availableTechnicians={mockTechnicians}
        onAllocate={jest.fn()}
      />
    );

    const dropdown = screen.getByRole('combobox');
    const confirmButton = screen.getByRole('button', { name: /confirm/i });

    fireEvent.change(dropdown, { target: { value: '101' } });
    expect(confirmButton).not.toBeDisabled();
  });

  test('calls onAllocate with correct values', () => {
    const onAllocateMock = jest.fn();

    render(
      <ServiceRequestCard
        request={mockRequestRequested}
        availableTechnicians={mockTechnicians}
        onAllocate={onAllocateMock}
      />
    );

    fireEvent.change(screen.getByRole('combobox'), { target: { value: '101' } });
    fireEvent.click(screen.getByRole('button', { name: /confirm/i }));

    expect(onAllocateMock).toHaveBeenCalledWith(2, '101');
  });
});
