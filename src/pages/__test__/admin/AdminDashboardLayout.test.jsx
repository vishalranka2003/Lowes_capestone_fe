// src/pages/admin/__tests__/AdminDashboardLayout.test.js
import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { AdminDashboardLayout } from '../../admin/AdminDashboardLayout';
import { useDispatch } from 'react-redux';
import { logout } from '../../../features/auth/authSlice';
import { MemoryRouter } from 'react-router-dom';

jest.mock('react-redux', () => ({
  useDispatch: jest.fn(),
}));

jest.mock('../../../features/auth/authSlice', () => ({
  logout: jest.fn(() => ({ type: 'LOGOUT' })),
}));

// Mock Outlet to simulate nested route content
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: () => jest.fn(),
  Outlet: () => <div data-testid="mock-outlet">Outlet Content</div>,
}));

describe('AdminDashboardLayout', () => {
  const mockDispatch = jest.fn();

  beforeEach(() => {
    useDispatch.mockReturnValue(mockDispatch);
    localStorage.clear();
    localStorage.setItem('username', 'AdminUser');
    localStorage.setItem('role', 'ROLE_ADMIN');
  });

  it('renders the layout with sidebar and user info', () => {
    render(<AdminDashboardLayout />, { wrapper: MemoryRouter });

    // Sidebar headings and icons
    expect(screen.getByText(/admin panel/i)).toBeInTheDocument();
    expect(screen.getByText(/dashboard/i)).toBeInTheDocument();
    expect(screen.getByText(/technicians/i)).toBeInTheDocument();
    expect(screen.getByText(/service requests/i)).toBeInTheDocument();
    expect(screen.getByText(/appliances/i)).toBeInTheDocument();
    expect(screen.getByText(/notifications/i)).toBeInTheDocument();
    expect(screen.getByText(/service history/i)).toBeInTheDocument();

    // User initials and role
    expect(screen.getByText('A')).toBeInTheDocument(); // From 'AdminUser'
    expect(screen.getByText('AdminUser')).toBeInTheDocument();
    expect(screen.getByText('ROLE_ADMIN')).toBeInTheDocument();

    // Logout button
    expect(screen.getByRole('button', { name: /logout/i })).toBeInTheDocument();

    // Mocked outlet
    expect(screen.getByTestId('mock-outlet')).toBeInTheDocument();
  });

  it('calls dispatch and clears localStorage on logout', () => {
    render(<AdminDashboardLayout />, { wrapper: MemoryRouter });

    const logoutButton = screen.getByRole('button', { name: /logout/i });
    fireEvent.click(logoutButton);

    expect(localStorage.getItem('username')).toBeNull();
    expect(localStorage.getItem('role')).toBeNull();
    expect(mockDispatch).toHaveBeenCalledWith({ type: 'LOGOUT' });
  });
});
