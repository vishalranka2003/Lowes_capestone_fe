// __tests__/AdminDashboard.test.jsx
import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import { AdminDashboard } from '../AdminDashboard';
import axios from 'axios';
import '@testing-library/jest-dom';
import { act } from 'react-dom/test-utils';

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
    localStorage.clear();
  });

  it('renders loading state initially', () => {
    render(<AdminDashboard />);
    expect(screen.getByText(/Loading dashboard data/i)).toBeInTheDocument();
  });

  it('renders summary cards and recent requests after data loads', async () => {
    await act(async () => {
      render(<AdminDashboard />);
    });
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

  it('renders available technicians list (handles multiple elements)', async () => {
    await act(async () => {
      render(<AdminDashboard />);
    });
    // There are two Jane Smiths (table and card), so use findAllByText
    const janeSmiths = await screen.findAllByText('Jane Smith');
    expect(janeSmiths.length).toBeGreaterThan(1);
    expect(screen.getByText('Bob Builder')).toBeInTheDocument();
  });

  it('handles API error gracefully', async () => {
    axios.get.mockRejectedValueOnce(new Error('API failure'));
    await act(async () => {
      render(<AdminDashboard />);
    });
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
    await act(async () => {
      render(<AdminDashboard />);
    });
    await waitFor(() => {
      expect(screen.getByText(/No technicians available/i)).toBeInTheDocument();
    });
  });

  it('renders empty requests table if no recent requests', async () => {
    axios.get.mockImplementation((url) => {
      if (url.includes('/admin/stats')) return Promise.resolve({ data: mockStats });
      if (url.includes('/admin/recent-service-requests')) return Promise.resolve({ data: [] }); // no requests
      if (url.includes('/admin/available-technicians')) return Promise.resolve({ data: mockTechnicians });
      if (url.includes('/api/notifications/expiring-soon')) return Promise.resolve({ data: mockExpiringSoon });
    });
    await act(async () => {
      render(<AdminDashboard />);
    });
    // Should still render the table header
    expect(screen.getByText(/Recent Service Requests/i)).toBeInTheDocument();
    // Should not find any request row
    expect(screen.queryByText('John Doe')).not.toBeInTheDocument();
  });

  it('renders all status color badges', async () => {
    const allStatuses = ['REQUESTED', 'ASSIGNED', 'IN_PROGRESS', 'COMPLETED', 'CANCELLED', 'UNKNOWN'];
    const requests = allStatuses.map((status, i) => ({
      id: i + 1,
      createdAt: new Date().toISOString(),
      homeownerName: `User${i}`,
      applianceName: `Appliance${i}`,
      technicianName: `Tech${i}`,
      status,
    }));
    axios.get.mockImplementation((url) => {
      if (url.includes('/admin/stats')) return Promise.resolve({ data: mockStats });
      if (url.includes('/admin/recent-service-requests')) return Promise.resolve({ data: requests });
      if (url.includes('/admin/available-technicians')) return Promise.resolve({ data: mockTechnicians });
      if (url.includes('/api/notifications/expiring-soon')) return Promise.resolve({ data: mockExpiringSoon });
    });
    await act(async () => {
      render(<AdminDashboard />);
    });
    for (const status of allStatuses) {
      // Status badge text is capitalized and spaces
      const badgeText = status.replace(/_/g, ' ').toLowerCase().replace(/\b\w/g, c => c.toUpperCase());
      expect(screen.getByText(badgeText)).toBeInTheDocument();
    }
  });

  it('renders fallback if no stats (null)', async () => {
    axios.get.mockImplementation((url) => {
      if (url.includes('/admin/stats')) return Promise.resolve({ data: null });
      if (url.includes('/admin/recent-service-requests')) return Promise.resolve({ data: mockRequests });
      if (url.includes('/admin/available-technicians')) return Promise.resolve({ data: mockTechnicians });
      if (url.includes('/api/notifications/expiring-soon')) return Promise.resolve({ data: mockExpiringSoon });
    });
    await act(async () => {
      render(<AdminDashboard />);
    });
    expect(screen.getByText(/Failed to load dashboard/i)).toBeInTheDocument();
  });
});
