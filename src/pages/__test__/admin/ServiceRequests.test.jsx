// src/pages/admin/__tests__/ServiceRequests.test.jsx

import React from 'react';
import { render, screen, waitFor, fireEvent } from '@testing-library/react';
import axios from 'axios';
import { ServiceRequests } from '../../admin/ServiceRequests';
import { MemoryRouter } from 'react-router-dom';

jest.mock('axios');
jest.mock('../../../components/ServiceRequestCard', () => ({
  ServiceRequestCard: ({ request, availableTechnicians, onAllocate }) => (
    <div>
      <p>{request.applianceName} - {request.homeownerName}</p>
      <button onClick={() => onAllocate(request.id, availableTechnicians[0]?.id)}>Allocate</button>
    </div>
  ),
}));

describe('ServiceRequests Page', () => {
  const mockRequests = [
    {
      id: 1,
      applianceName: 'Washing Machine',
      homeownerName: 'John Doe',
      status: 'REQUESTED',
    },
    {
      id: 2,
      applianceName: 'Dishwasher',
      homeownerName: 'Jane Smith',
      status: 'IN_PROGRESS',
    },
  ];

  const mockTechnicians = [
    {
      id: 101,
      firstName: 'Alice',
      lastName: 'Johnson',
      specialization: 'Electrical',
    },
  ];

  beforeEach(() => {
    localStorage.setItem('token', 'mock-token');
    jest.clearAllMocks();
  });

  it('shows loading initially', () => {
    axios.get.mockReturnValue(new Promise(() => {})); // never resolves
    render(<ServiceRequests />, { wrapper: MemoryRouter });
    expect(screen.getByText(/loading service requests/i)).toBeInTheDocument();
  });

  it('displays service request cards after fetch', async () => {
    axios.get
      .mockResolvedValueOnce({ data: mockRequests }) // service requests
      .mockResolvedValueOnce({ data: mockTechnicians }); // technicians

    render(<ServiceRequests />, { wrapper: MemoryRouter });

    await waitFor(() => {
      expect(screen.getByText(/Washing Machine - John Doe/)).toBeInTheDocument();
      expect(screen.getByText(/Dishwasher - Jane Smith/)).toBeInTheDocument();
    });
  });

  it('filters requests by search', async () => {
    axios.get
      .mockResolvedValueOnce({ data: mockRequests })
      .mockResolvedValueOnce({ data: mockTechnicians });

    render(<ServiceRequests />, { wrapper: MemoryRouter });

    await waitFor(() => screen.getByText(/Washing Machine - John Doe/));

    const input = screen.getByPlaceholderText(/search by homeowner/i);
    fireEvent.change(input, { target: { value: 'jane' } });

    expect(screen.getByText(/Dishwasher - Jane Smith/)).toBeInTheDocument();
    expect(screen.queryByText(/Washing Machine - John Doe/)).toBeNull();
  });

  it('shows no results message when search yields nothing', async () => {
    axios.get
      .mockResolvedValueOnce({ data: mockRequests })
      .mockResolvedValueOnce({ data: mockTechnicians });

    render(<ServiceRequests />, { wrapper: MemoryRouter });

    await waitFor(() => screen.getByText(/Washing Machine - John Doe/));

    fireEvent.change(screen.getByPlaceholderText(/search by homeowner/i), {
      target: { value: 'nonexistent' },
    });

    expect(screen.getByText(/no service requests found matching your search/i)).toBeInTheDocument();
  });

  it('handles API error gracefully', async () => {
    axios.get.mockRejectedValue(new Error('API failed'));

    const consoleSpy = jest.spyOn(console, 'error').mockImplementation(() => {});

    render(<ServiceRequests />, { wrapper: MemoryRouter });

    await waitFor(() =>
      screen.getByText(/no service requests available at the moment/i)
    );

    expect(consoleSpy).toHaveBeenCalledWith(
      expect.stringContaining('Error loading service request data:'),
      expect.any(Error)
    );

    consoleSpy.mockRestore();
  });

  it('calls handleAllocate when Allocate button is clicked', async () => {
    axios.get
      .mockResolvedValueOnce({ data: mockRequests })
      .mockResolvedValueOnce({ data: mockTechnicians });

    axios.post.mockResolvedValue({}); // mock allocation

    render(<ServiceRequests />, { wrapper: MemoryRouter });

    await waitFor(() => screen.getByText(/Washing Machine - John Doe/));

    const allocateButton = screen.getAllByText('Allocate')[0];
    fireEvent.click(allocateButton);

    await waitFor(() => {
      expect(axios.post).toHaveBeenCalledWith(
        expect.stringContaining('/assign-technician'),
        null,
        expect.objectContaining({
          params: {
            technicianId: 101,
            requestId: 1,
          },
        })
      );
    });
  });
});
