import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { AssignedRequestsModal } from '../../../components/AssignedRequestsModal';
import '@testing-library/jest-dom';

describe('AssignedRequestsModal', () => {
  const sampleRequests = [
    {
      id: 123,
      issueDescription: 'Leaking pipe',
      status: 'IN_PROGRESS',
      applianceInfo: 'Bosch Dishwasher',
      homeownerName: 'John Doe',
      preferredSlot: '2025-08-01T10:30:00',
      createdAt: '2025-07-27T15:00:00',
    },
  ];

  test('renders modal with assigned requests', () => {
    render(<AssignedRequestsModal requests={sampleRequests} onClose={jest.fn()} />);

    expect(screen.getByText(/Assigned Service Requests/i)).toBeInTheDocument();
    expect(screen.getByText(/Leaking pipe/i)).toBeInTheDocument();
    expect(screen.getByText(/John Doe/i)).toBeInTheDocument();
    expect(screen.getByText(/Bosch Dishwasher/i)).toBeInTheDocument();
    expect(screen.getByText(/In Progress/i)).toBeInTheDocument();
  });

  test('renders message when no requests are present', () => {
    render(<AssignedRequestsModal requests={[]} onClose={jest.fn()} />);

    expect(screen.getByText(/No assigned requests found/i)).toBeInTheDocument();
  });

  test('calls onClose when X button is clicked', () => {
    const onCloseMock = jest.fn();
    render(<AssignedRequestsModal requests={sampleRequests} onClose={onCloseMock} />);

    const closeButton = screen.getByRole('button'); // The only button (X)
    fireEvent.click(closeButton);

    expect(onCloseMock).toHaveBeenCalledTimes(1);
  });

  test('renders correct date formats', () => {
    render(<AssignedRequestsModal requests={sampleRequests} onClose={jest.fn()} />);

    expect(screen.getByText(new Date(sampleRequests[0].preferredSlot).toLocaleString())).toBeInTheDocument();
    expect(screen.getByText(new Date(sampleRequests[0].createdAt).toLocaleString())).toBeInTheDocument();
  });
});
