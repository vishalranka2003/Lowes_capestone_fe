import React from 'react';
import { render, screen, waitFor, fireEvent } from '@testing-library/react';
import { TechnicianDetails } from '../../admin/TechnicianDetails';
import axios from 'axios';
import { MemoryRouter, Route, Routes } from 'react-router-dom';

// Mock useNavigate at the top level so it works for all tests
const mockNavigate = jest.fn();
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: () => mockNavigate,
}));

jest.mock('axios');
const mockedAxios = axios;

const technicianMock = {
  id: 1,
  firstName: 'John',
  lastName: 'Doe',
  email: 'john@example.com',
  phoneNumber: '1234567890',
  specialization: 'Refrigerator Repair',
  experience: 5,
};

const assignedMock = [
  {
    id: 101,
    status: 'ASSIGNED',
    applianceInfo: 'LG Fridge - LG1234',
    homeownerName: 'Alice Smith',
  },
];
const inProgressMock = [
  {
    id: 102,
    status: 'IN_PROGRESS',
    applianceInfo: 'Samsung AC - SA5678',
    homeownerName: 'Bob Johnson',
  },
];
const completedMock = [
  {
    id: 103,
    status: 'COMPLETED',
    applianceInfo: 'Whirlpool Washer - WW4321',
    homeownerName: 'Carol Lee',
  },
];

describe('TechnicianDetails Component', () => {
  beforeEach(() => {
    mockedAxios.get.mockImplementation((url) => {
      if (url.includes('assigned-requests')) {
        return Promise.resolve({ data: assignedMock });
      } else if (url.includes('in-progress')) {
        return Promise.resolve({ data: inProgressMock });
      } else if (url.includes('completed')) {
        return Promise.resolve({ data: completedMock });
      }
    });

    localStorage.setItem('token', 'fake-token');
  });

  afterEach(() => {
    jest.clearAllMocks();
    localStorage.clear();
  });

  const renderComponent = () =>
    render(
      <MemoryRouter
        initialEntries={[
          {
            pathname: '/admin/technician/1',
            state: { technician: technicianMock },
          },
        ]}
      >
        <Routes>
          <Route path="/admin/technician/:id" element={<TechnicianDetails />} />
        </Routes>
      </MemoryRouter>
    );

  it('renders technician info and request sections correctly', async () => {
    renderComponent();

    expect(screen.getByText(/Go Back/i)).toBeInTheDocument();
    expect(
      screen.getByText(/Technician: John Doe/i)
    ).toBeInTheDocument();

    // Use findByText/findAllByText for async queries
    expect(await screen.findByText(/Assigned Requests/i)).toBeInTheDocument();
    expect(await screen.findByText(/LG Fridge - LG1234/)).toBeInTheDocument();
    expect(await screen.findByText(/In Progress/i)).toBeInTheDocument();
    expect(await screen.findByText(/Samsung AC - SA5678/)).toBeInTheDocument();
    // There are multiple 'Completed' (header and status), so use findAllByText
    const completedHeaders = await screen.findAllByText(/Completed/i);
    expect(completedHeaders.length).toBeGreaterThan(0);
    expect(await screen.findByText(/Whirlpool Washer - WW4321/)).toBeInTheDocument();
  });

  it('displays fallback message when all request arrays are empty', async () => {
    mockedAxios.get.mockResolvedValueOnce({ data: [] });
    mockedAxios.get.mockResolvedValueOnce({ data: [] });
    mockedAxios.get.mockResolvedValueOnce({ data: [] });

    renderComponent();

    await waitFor(() => {
      expect(screen.getByText(/No assigned requests/i)).toBeInTheDocument();
      expect(screen.getByText(/No requests in progress/i)).toBeInTheDocument();
      expect(screen.getByText(/No completed requests/i)).toBeInTheDocument();
    });
  });

  it('clicking Go Back button calls navigate(-1)', async () => {
    renderComponent();
    fireEvent.click(screen.getByText(/Go Back/i));
    expect(mockNavigate).toHaveBeenCalledWith(-1);
  });
});
