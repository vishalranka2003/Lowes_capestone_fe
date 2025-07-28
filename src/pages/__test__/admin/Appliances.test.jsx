// src/pages/admin/__tests__/Appliances.test.js

import React from 'react';
import { render, screen, waitFor, fireEvent } from '@testing-library/react';
import axios from 'axios';
import { Appliances } from '../../admin/Appliances';
import { MemoryRouter } from 'react-router-dom';

jest.mock('axios');
jest.mock('../../../components/AdminApplianceCard', () => ({
  AdminApplianceCard: ({ appliance }) => <div>{appliance.brand} - {appliance.modelNumber} - {appliance.homeownerName}</div>,
}));

describe('Appliances Page', () => {
  const mockAppliances = [
    {
      id: 1,
      brand: 'LG',
      modelNumber: 'LG123',
      homeownerName: 'John Doe',
    },
    {
      id: 2,
      brand: 'Samsung',
      modelNumber: 'S456',
      homeownerName: 'Alice Smith',
    },
  ];

  beforeEach(() => {
    localStorage.setItem('token', 'mock-token');
    jest.clearAllMocks();
  });

  it('shows loading text initially', async () => {
    axios.get.mockReturnValue(new Promise(() => {})); // never resolves
    render(<Appliances />, { wrapper: MemoryRouter });
    expect(screen.getByText(/loading appliances/i)).toBeInTheDocument();
  });

  it('displays appliance cards after successful fetch', async () => {
    axios.get.mockResolvedValue({ data: mockAppliances });

    render(<Appliances />, { wrapper: MemoryRouter });

    await waitFor(() => {
      expect(screen.getByText('LG - LG123 - John Doe')).toBeInTheDocument();
      expect(screen.getByText('Samsung - S456 - Alice Smith')).toBeInTheDocument();
    });
  });

  it('filters appliances based on search input', async () => {
    axios.get.mockResolvedValue({ data: mockAppliances });

    render(<Appliances />, { wrapper: MemoryRouter });

    await waitFor(() => screen.getByText('LG - LG123 - John Doe'));

    const input = screen.getByPlaceholderText(/search by brand/i);
    fireEvent.change(input, { target: { value: 'lg' } });

    expect(screen.getByText('LG - LG123 - John Doe')).toBeInTheDocument();
    expect(screen.queryByText('Samsung - S456 - Alice Smith')).not.toBeInTheDocument();
  });

  it('shows message when no appliances match search', async () => {
    axios.get.mockResolvedValue({ data: mockAppliances });

    render(<Appliances />, { wrapper: MemoryRouter });

    await waitFor(() => screen.getByText('LG - LG123 - John Doe'));

    const input = screen.getByPlaceholderText(/search by brand/i);
    fireEvent.change(input, { target: { value: 'whirlpool' } });

    expect(screen.getByText(/no appliances found matching your search/i)).toBeInTheDocument();
  });

  it('shows message when no appliances are returned from API', async () => {
    axios.get.mockResolvedValue({ data: [] });

    render(<Appliances />, { wrapper: MemoryRouter });

    await waitFor(() => screen.getByText(/no appliances found/i));
  });

  it('handles API error gracefully', async () => {
    axios.get.mockRejectedValue(new Error('API failed'));

    const consoleSpy = jest.spyOn(console, 'error').mockImplementation(() => {});

    render(<Appliances />, { wrapper: MemoryRouter });

    await waitFor(() => screen.getByText(/no appliances found/i));
    expect(consoleSpy).toHaveBeenCalledWith(expect.stringContaining('Error fetching appliances'), expect.any(Error));

    consoleSpy.mockRestore();
  });
});
