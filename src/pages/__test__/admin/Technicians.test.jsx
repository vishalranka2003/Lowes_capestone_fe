// src/pages/admin/TechnicianList.test.jsx
import React from 'react';
import { render, screen, waitFor, fireEvent } from '@testing-library/react';
import { Technicians } from '../../admin/Technicians';
import axios from 'axios';
import { MemoryRouter } from 'react-router-dom';

jest.mock('axios');

const mockTechnicians = [
  {
    id: 1,
    firstName: 'Alice',
    lastName: 'Smith',
    specialization: 'AC Repair',
    email: 'alice@example.com',
    phoneNumber: '1234567890',
    experience: 5,
  },
  {
    id: 2,
    firstName: 'Bob',
    lastName: 'Jones',
    specialization: 'Refrigerator Repair',
    email: 'bob@example.com',
    phoneNumber: '9876543210',
    experience: 3,
  }
];

describe('TechnicianList', () => {
  const availableTechIds = [{ id: 1 }];

  beforeEach(() => {
    localStorage.setItem('token', 'mock-token');
    axios.get.mockImplementation((url) => {
      if (url.includes('all-technicians')) {
        return Promise.resolve({ data: mockTechnicians });
      }
      if (url.includes('available-technicians')) {
        return Promise.resolve({ data: availableTechIds });
      }
      if (url.includes('technician-assigned-requests')) {
        return Promise.resolve({
          data: [
            {
              id: 123,
              status: 'ASSIGNED',
              applianceInfo: 'Whirlpool AC',
              homeownerName: 'John Doe'
            }
          ]
        });
      }
    });
  });

  afterEach(() => {
    jest.clearAllMocks();
    localStorage.clear();
  });

  it('renders technicians after fetch', async () => {
    render(<Technicians />, { wrapper: MemoryRouter });

    await waitFor(() => {
      expect(screen.getByText('Alice Smith')).toBeInTheDocument();
      expect(screen.getByText('Bob Jones')).toBeInTheDocument();
    });
  });

  it('filters technicians by search', async () => {
    render(<Technicians />, { wrapper: MemoryRouter });

    await waitFor(() => screen.getByText('Alice Smith'));

    const input = screen.getByPlaceholderText(/search by name/i);
    fireEvent.change(input, { target: { value: 'Alice' } });

    expect(screen.getByText('Alice Smith')).toBeInTheDocument();
    expect(screen.queryByText('Bob Jones')).not.toBeInTheDocument();
  });

  it('shows empty state when no search results', async () => {
    render(<Technicians />, { wrapper: MemoryRouter });

    await waitFor(() => screen.getByText('Alice Smith'));

    const input = screen.getByPlaceholderText(/search by name/i);
    fireEvent.change(input, { target: { value: 'xyz' } });

    expect(screen.getByText(/no technicians found/i)).toBeInTheDocument();
  });

  it('shows modal when view requests clicked', async () => {
    render(<Technicians />, { wrapper: MemoryRouter });

    await waitFor(() => screen.getByText('Alice Smith'));

    const viewButtons = screen.getAllByRole('button', { name: /view assigned requests/i });
    fireEvent.click(viewButtons[0]);

    await waitFor(() => {
      expect(screen.getByText(/whirlpool ac/i)).toBeInTheDocument();
      expect(screen.getByText(/john doe/i)).toBeInTheDocument();
    });
  });

  it('handles error when fetching assigned requests fails', async () => {
    axios.get.mockImplementation((url) => {
      if (url.includes('technician-assigned-requests')) {
        return Promise.reject(new Error('Network Error'));
      }
      return Promise.resolve({ data: mockTechnicians });
    });

    window.alert = jest.fn();
    const consoleSpy = jest.spyOn(console, 'error').mockImplementation(() => {});

    render(<Technicians />, { wrapper: MemoryRouter });

    await waitFor(() => screen.getByText('Alice Smith'));

    const viewButtons = screen.getAllByRole('button', { name: /view assigned requests/i });
    fireEvent.click(viewButtons[0]);

    await waitFor(() => {
      expect(window.alert).toHaveBeenCalledWith('Could not load assigned requests.');
      expect(consoleSpy).toHaveBeenCalled();
    });

    consoleSpy.mockRestore();
  });

  it('shows message when no technicians available', async () => {
    axios.get.mockImplementation((url) => {
      if (url.includes('all-technicians')) return Promise.resolve({ data: [] });
      if (url.includes('available-technicians')) return Promise.resolve({ data: [] });
    });

    render(<Technicians />, { wrapper: MemoryRouter });

    await waitFor(() => {
      expect(screen.getByText('No technicians available.')).toBeInTheDocument();
    });
  });
});
