// __tests__/AdminDashboard.test.jsx
import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import { AdminDashboard } from '../AdminDashboard';
import axios from 'axios';
import '@testing-library/jest-dom';

jest.mock('axios');

const mockStats = {
  totalTechnicians: 5,
  pendingRequests: 3,
  completedRequests: 10,
  totalAppliances: 20,
};

const mockRequests = [
  {
    id: 1,
    createdAt: new Date().toISOString(),
    homeownerName: 'John Doe',
    applianceName: 'Whirlpool Fridge',
    technicianName: 'Jane Smith',
    status: 'REQUESTED',
  },
];

const mockTechnicians = [
  { firstName: 'Jane', lastName: 'Smith' },
  { firstName: 'Bob', lastName: 'Builder' },
];

const mockExpiringSoon = [{ id: 101 }, { id: 102 }];

describe('AdminDashboard', () => {
  beforeEach(() => {
    localStorage.setItem('token', 'test-token');
    axios.get.mockImplementation((url) => {
      if (url.includes('/admin/stats')) return Promise.resolve({ data: mockStats });
      if (url.includes('/admin/recent-service-requests')) return Promise.resolve({ data: mockRequests });
      if (url.includes('/admin/available-technicians')) return Promise.resolve({ data: mockTechnicians });
      if (url.includes('/api/notifications/expiring-soon')) return Promise.resolve({ data: mockExpiringSoon });
    });
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('renders loading state initially', () => {
    render(<AdminDashboard />);
    expect(screen.getByText(/Loading dashboard data/i)).toBeInTheDocument();
  });

  it('renders summary cards and recent requests after data loads', async () => {
    render(<AdminDashboard />);
    
    await waitFor(() => {
      expect(screen.getByText(/Total Technicians/i)).toBeInTheDocument();
    });

    expect(screen.getByText('5')).toBeInTheDocument(); // Total Technicians
    expect(screen.getByText('3')).toBeInTheDocument(); // Pending Requests
    expect(screen.getByText('10')).toBeInTheDocument(); // Completed
    expect(screen.getByText('20')).toBeInTheDocument(); // Appliance Models
    expect(screen.getByText('2')).toBeInTheDocument(); // Expiring soon

    expect(screen.getByText(/Recent Service Requests/i)).toBeInTheDocument();
    expect(screen.getByText(/John Doe/)).toBeInTheDocument();
    expect(screen.getByText(/Whirlpool Fridge/)).toBeInTheDocument();
  });

  it('renders available technicians list', async () => {
    render(<AdminDashboard />);
    await waitFor(() => {
      expect(screen.getByText('Jane Smith')).toBeInTheDocument();
    });
    expect(screen.getByText('Bob Builder')).toBeInTheDocument();
  });

  it('handles API error gracefully', async () => {
    axios.get.mockRejectedValueOnce(new Error('API failure'));
    render(<AdminDashboard />);
    await waitFor(() => {
      expect(screen.getByText(/Failed to load dashboard/i)).toBeInTheDocument();
    });
  });

  it('renders empty technician message if none available', async () => {
    axios.get.mockImplementation((url) => {
      if (url.includes('/admin/stats')) return Promise.resolve({ data: mockStats });
      if (url.includes('/admin/recent-service-requests')) return Promise.resolve({ data: mockRequests });
      if (url.includes('/admin/available-technicians')) return Promise.resolve({ data: [] }); // no techs
      if (url.includes('/api/notifications/expiring-soon')) return Promise.resolve({ data: [] });
    });

    render(<AdminDashboard />);
    await waitFor(() => {
      expect(screen.getByText(/No technicians available/i)).toBeInTheDocument();
    });
  });
});
