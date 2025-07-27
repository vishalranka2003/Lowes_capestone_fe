import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { Login } from '../Login';
import * as authAPI from '../../features/auth/authAPI';
import * as authSlice from '../../features/auth/authSlice';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';

jest.mock('react-redux', () => ({ useDispatch: jest.fn() }));
jest.mock('react-router-dom', () => ({ useNavigate: jest.fn() }));
jest.mock('../../features/auth/authAPI');
jest.mock('../../features/auth/authSlice');

const mockDispatch = jest.fn();
const mockNavigate = jest.fn();

describe('Login.jsx', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    jest.spyOn(console, 'error').mockImplementation(() => {});
    useDispatch.mockReturnValue(mockDispatch);
    useNavigate.mockReturnValue(mockNavigate);
    // Clear localStorage
    window.localStorage.clear();
  });

  it('redirects if already logged in', () => {
    window.localStorage.setItem('token', 't');
    window.localStorage.setItem('username', 'u');
    window.localStorage.setItem('role', 'ROLE_TECHNICIAN');
    render(<Login />);
    expect(mockNavigate).toHaveBeenCalledWith('/dashboard/technician');
  });

  it('renders login form after loading', async () => {
    render(<Login />);
    await waitFor(() => expect(screen.getByText(/sign in to your account/i)).toBeInTheDocument());
    expect(screen.getByLabelText(/email address/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/password/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /sign in/i })).toBeInTheDocument();
  });

  it('validates empty email and password', async () => {
    render(<Login />);
    await waitFor(() => screen.getByLabelText(/email address/i));
    fireEvent.blur(screen.getByLabelText(/email address/i));
    fireEvent.blur(screen.getByLabelText(/password/i));
    expect(await screen.findByText(/email is required/i)).toBeInTheDocument();
    expect(await screen.findByText(/password is required/i)).toBeInTheDocument();
  });

  it('validates invalid email format', async () => {
    render(<Login />);
    await waitFor(() => screen.getByLabelText(/email address/i));
    fireEvent.change(screen.getByLabelText(/email address/i), { target: { value: 'invalid' } });
    fireEvent.blur(screen.getByLabelText(/email address/i));
    expect(await screen.findByText(/please enter a valid email address/i)).toBeInTheDocument();
  });

  it('can change role tabs', async () => {
    render(<Login />);
    await waitFor(() => screen.getByText(/homeowner/i));
    fireEvent.click(screen.getByText(/technician/i));
    fireEvent.click(screen.getByText(/admin/i));
    expect(screen.getByText(/admin/i)).toBeInTheDocument();
  });

  it('shows error if login API returns error', async () => {
    authAPI.login.mockResolvedValue({ error: true, message: 'Invalid credentials' });
    render(<Login />);
    await waitFor(() => screen.getByLabelText(/email address/i));
    fireEvent.change(screen.getByLabelText(/email address/i), { target: { value: 'test@example.com' } });
    fireEvent.change(screen.getByLabelText(/password/i), { target: { value: 'password' } });
    fireEvent.click(screen.getByRole('button', { name: /sign in/i }));
    expect(await screen.findByText(/invalid credentials/i)).toBeInTheDocument();
  });

  it('shows error if login API returns no token', async () => {
    authAPI.login.mockResolvedValue({});
    render(<Login />);
    await waitFor(() => screen.getByLabelText(/email address/i));
    fireEvent.change(screen.getByLabelText(/email address/i), { target: { value: 'test@example.com' } });
    fireEvent.change(screen.getByLabelText(/password/i), { target: { value: 'password' } });
    fireEvent.click(screen.getByRole('button', { name: /sign in/i }));
    expect(await screen.findByText(/login failed/i)).toBeInTheDocument();
  });

  it('shows error if login throws (network error)', async () => {
    authAPI.login.mockRejectedValue(new Error('Network error'));
    render(<Login />);
    await waitFor(() => screen.getByLabelText(/email address/i));
    fireEvent.change(screen.getByLabelText(/email address/i), { target: { value: 'test@example.com' } });
    fireEvent.change(screen.getByLabelText(/password/i), { target: { value: 'password' } });
    fireEvent.click(screen.getByRole('button', { name: /sign in/i }));
    expect(await screen.findByText(/something went wrong/i)).toBeInTheDocument();
  });

  it('dispatches loginSuccess and navigates on successful login', async () => {
    authAPI.login.mockResolvedValue({ token: 't', username: 'u', role: 'ROLE_ADMIN' });
    authSlice.loginSuccess.mockReturnValue({ type: 'LOGIN_SUCCESS' });
    render(<Login />);
    await waitFor(() => screen.getByLabelText(/email address/i));
    fireEvent.change(screen.getByLabelText(/email address/i), { target: { value: 'test@example.com' } });
    fireEvent.change(screen.getByLabelText(/password/i), { target: { value: 'password' } });
    fireEvent.click(screen.getByRole('button', { name: /sign in/i }));
    await waitFor(() => {
      expect(mockDispatch).toHaveBeenCalledWith({ type: 'LOGIN_SUCCESS' });
      expect(mockNavigate).toHaveBeenCalledWith('/dashboard/admin');
    });
  });

  it('navigates to forgot password page', async () => {
    render(<Login />);
    await waitFor(() => screen.getByText(/forgot password/i));
    fireEvent.click(screen.getByText(/forgot password/i));
    expect(mockNavigate).toHaveBeenCalledWith('/forgot-password');
  });

  it('renders signup link', async () => {
    render(<Login />);
    await waitFor(() => screen.getByText(/sign up/i));
    expect(screen.getByText(/sign up/i)).toBeInTheDocument();
  });
});
