// src/__tests__/TechnicianDetails.test.jsx
import React from 'react';
import { render, screen, waitFor, fireEvent } from '@testing-library/react';
import { TechnicianDetails } from '../../admin/TechnicianDetails';
import { MemoryRouter } from 'react-router-dom';
import axios from 'axios';

// Mocks
jest.mock('axios');
const mockNavigate = jest.fn();
const mockUseParams = jest.fn(() => ({ id: '1' }));
const mockUseLocation = jest.fn(() => ({
  state: {
    technician: {
      id: 1,
      firstName: 'Alice',
      lastName: 'Smith',
      email: 'alice@example.com',
      phoneNumber: '1234567890',
      specialization: 'AC Repair',
      experience: 5,
    },
  },
}));

jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useParams: () => mockUseParams(),
  useLocation: () => mockUseLocation(),
  useNavigate: () => mockNavigate,
}));

describe('TechnicianDetails', () => {
  beforeEach(() => {
    localStorage.setItem('token', 'test-token');
    axios.get.mockImplementation((url, { params }) => {
      if (url.includes('assigned')) {
        return Promise.resolve({
          data: [
            {
              id: 101,
              status: 'ASSIGNED',
              applianceInfo: 'Whirlpool Washer',
              homeownerName: 'John Doe',
            },
          ],
        });
      }
      if (url.includes('in-progress')) {
        return Promise.resolve({
          data: [
            {
              id: 102,
              status: 'IN_PROGRESS',
              applianceInfo: 'LG AC',
              homeownerName: 'Jane Doe',
            },
          ],
        });
      }
      if (url.includes('completed')) {
        return Promise.resolve({
          data: [
            {
              id: 103,
              status: 'COMPLETED',
              applianceInfo: 'Samsung Fridge',
              homeownerName: 'Mark Lee',
            },
          ],
        });
      }
    });
  });

  afterEach(() => {
    jest.clearAllMocks();
    localStorage.clear();
  });

  it('renders technician details and all requests with pie chart', async () => {
    render(
      <MemoryRouter>
        <TechnicianDetails />
      </MemoryRouter>
    );

    // Wait for async data
    await waitFor(() => {
      expect(axios.get).toHaveBeenCalledTimes(3);
    });

    // Technician Info
    expect(screen.getByText('Technician: Alice Smith')).toBeInTheDocument();
    expect(screen.getByText('alice@example.com')).toBeInTheDocument();
    expect(screen.getByText('1234567890')).toBeInTheDocument();
    expect(screen.getByText('AC Repair')).toBeInTheDocument();
    expect(screen.getByText('5 years')).toBeInTheDocument();

    // Request Cards
    expect(screen.getByText('Assigned Requests')).toBeInTheDocument();
    expect(screen.getByText('In Progress')).toBeInTheDocument();
    expect(screen.getByText('Completed')).toBeInTheDocument();

    // Assigned request
    expect(screen.getByText(/Whirlpool Washer/)).toBeInTheDocument();
    expect(screen.getByText(/John Doe/)).toBeInTheDocument();

    // In Progress request
    expect(screen.getByText(/LG AC/)).toBeInTheDocument();
    expect(screen.getByText(/Jane Doe/)).toBeInTheDocument();

    // Completed request
    expect(screen.getByText(/Samsung Fridge/)).toBeInTheDocument();
    expect(screen.getByText(/Mark Lee/)).toBeInTheDocument();

    // Chart renders via SVG
    expect(document.querySelector('svg')).toBeInTheDocument();
  });

  it('navigates back when Go Back is clicked', async () => {
    render(
      <MemoryRouter>
        <TechnicianDetails />
      </MemoryRouter>
    );

    await waitFor(() => expect(axios.get).toHaveBeenCalledTimes(3));
    const goBackBtn = screen.getByRole('button', { name: /go back/i });
    fireEvent.click(goBackBtn);
    expect(mockNavigate).toHaveBeenCalledWith(-1);
  });

  it('shows fallback messages when request arrays are empty', async () => {
    axios.get.mockResolvedValueOnce({ data: [] }); // assigned
    axios.get.mockResolvedValueOnce({ data: [] }); // in-progress
    axios.get.mockResolvedValueOnce({ data: [] }); // completed

    render(
      <MemoryRouter>
        <TechnicianDetails />
      </MemoryRouter>
    );

    await waitFor(() => expect(axios.get).toHaveBeenCalledTimes(3));

    expect(screen.getByText('No assigned requests.')).toBeInTheDocument();
    expect(screen.getByText('No requests in progress.')).toBeInTheDocument();
    expect(screen.getByText('No completed requests.')).toBeInTheDocument();
  });

  it('handles fetch error gracefully', async () => {
    axios.get.mockRejectedValueOnce(new Error('Network error'));
    axios.get.mockRejectedValueOnce(new Error('Network error'));
    axios.get.mockRejectedValueOnce(new Error('Network error'));

    const consoleSpy = jest.spyOn(console, 'error').mockImplementation(() => {});

    render(
      <MemoryRouter>
        <TechnicianDetails />
      </MemoryRouter>
    );

    await waitFor(() => {
      expect(consoleSpy).toHaveBeenCalledWith(
        'Error fetching technician data:',
        expect.any(Error)
      );
    });

    consoleSpy.mockRestore();
  });
});
