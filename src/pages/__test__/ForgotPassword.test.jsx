import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { ForgotPassword } from '../ForgotPassword';
import * as authAPI from '../../features/auth/authAPI';

jest.mock('../../features/auth/authAPI');

const mockNavigate = jest.fn();
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: () => mockNavigate,
}));

describe('ForgotPassword', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    jest.spyOn(console, 'error').mockImplementation(() => {});
  });

  it('renders the form and static text', () => {
    render(
      <BrowserRouter>
        <ForgotPassword />
      </BrowserRouter>
    );
    expect(screen.getByText(/forgot your password/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/email address/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /send reset link/i })).toBeInTheDocument();
  });

  it('validates empty email', async () => {
    render(
      <BrowserRouter>
        <ForgotPassword />
      </BrowserRouter>
    );
    fireEvent.blur(screen.getByLabelText(/email address/i));
    expect((await screen.findAllByText(/email is required/i)).length).toBeGreaterThan(0);
  });

  it('validates invalid email format', async () => {
    render(
      <BrowserRouter>
        <ForgotPassword />
      </BrowserRouter>
    );
    fireEvent.change(screen.getByLabelText(/email address/i), { target: { value: 'invalid' } });
    fireEvent.blur(screen.getByLabelText(/email address/i));
    expect((await screen.findAllByText(/please enter a valid email address/i)).length).toBeGreaterThan(0);
  });

  it('submits with blank email and does not call API', async () => {
    render(
      <BrowserRouter>
        <ForgotPassword />
      </BrowserRouter>
    );
    fireEvent.click(screen.getByRole('button', { name: /send reset link/i }));
    fireEvent.blur(screen.getByLabelText(/email address/i));
    expect((await screen.findAllByText(/email is required/i)).length).toBeGreaterThan(0);
    expect(authAPI.forgotPasswordRequest).not.toHaveBeenCalled();
  });

  it('submits with invalid email and does not call API', async () => {
    render(
      <BrowserRouter>
        <ForgotPassword />
      </BrowserRouter>
    );
    fireEvent.change(screen.getByLabelText(/email address/i), { target: { value: 'invalid' } });
    fireEvent.click(screen.getByRole('button', { name: /send reset link/i }));
    fireEvent.blur(screen.getByLabelText(/email address/i));
    expect((await screen.findAllByText(/please enter a valid email address/i)).length).toBeGreaterThan(0);
    expect(authAPI.forgotPasswordRequest).not.toHaveBeenCalled();
  });

  it('submits with valid email and handles success', async () => {
    authAPI.forgotPasswordRequest.mockResolvedValue({ success: true, message: 'Reset link sent' });
    render(
      <BrowserRouter>
        <ForgotPassword />
      </BrowserRouter>
    );
    fireEvent.change(screen.getByLabelText(/email address/i), { target: { value: 'test@example.com' } });
    fireEvent.click(screen.getByRole('button', { name: /send reset link/i }));
    expect((await screen.findAllByText(/reset link sent/i)).length).toBeGreaterThan(0);
    expect(screen.getByLabelText(/email address/i)).toHaveValue('');
  });

  it('submits with valid email and handles backend error', async () => {
    authAPI.forgotPasswordRequest.mockResolvedValue({ error: true, message: 'Invalid email' });
    render(
      <BrowserRouter>
        <ForgotPassword />
      </BrowserRouter>
    );
    fireEvent.change(screen.getByLabelText(/email address/i), { target: { value: 'test@example.com' } });
    fireEvent.click(screen.getByRole('button', { name: /send reset link/i }));
    expect((await screen.findAllByText(/invalid email/i)).length).toBeGreaterThan(0);
  });

  it('submits with valid email and handles network error', async () => {
    authAPI.forgotPasswordRequest.mockRejectedValue(new Error('Network error'));
    render(
      <BrowserRouter>
        <ForgotPassword />
      </BrowserRouter>
    );
    fireEvent.change(screen.getByLabelText(/email address/i), { target: { value: 'test@example.com' } });
    fireEvent.click(screen.getByRole('button', { name: /send reset link/i }));
    expect((await screen.findAllByText(/unexpected error/i)).length).toBeGreaterThan(0);
  });

  it('shows only message if both error and message are set', async () => {
    // Simulate both error and message being set
    render(
      <BrowserRouter>
        <ForgotPassword />
      </BrowserRouter>
    );
    // Set state directly via fireEvent (simulate success then error)
    fireEvent.change(screen.getByLabelText(/email address/i), { target: { value: 'test@example.com' } });
    authAPI.forgotPasswordRequest.mockResolvedValue({ success: true, message: 'Reset link sent' });
    fireEvent.click(screen.getByRole('button', { name: /send reset link/i }));
    await waitFor(() => {
      expect((screen.getAllByText(/reset link sent/i)).length).toBeGreaterThan(0);
    });
    // Now simulate error
    authAPI.forgotPasswordRequest.mockResolvedValue({ error: true, message: 'Invalid email' });
    fireEvent.change(screen.getByLabelText(/email address/i), { target: { value: 'test2@example.com' } });
    fireEvent.click(screen.getByRole('button', { name: /send reset link/i }));
    await waitFor(() => {
      expect((screen.getAllByText(/invalid email/i)).length).toBeGreaterThan(0);
    });
  });

  it('navigates to login when clicking Back to Login', async () => {
    render(
      <BrowserRouter>
        <ForgotPassword />
      </BrowserRouter>
    );
    fireEvent.click(screen.getByText(/back to login/i));
    expect(mockNavigate).toHaveBeenCalledWith('/login');
  });

  it('does not call API again if already loading', async () => {
    let resolvePromise;
    authAPI.forgotPasswordRequest.mockImplementation(() => new Promise((resolve) => { resolvePromise = resolve; }));
    render(
      <BrowserRouter>
        <ForgotPassword />
      </BrowserRouter>
    );
    fireEvent.change(screen.getByLabelText(/email address/i), { target: { value: 'test@example.com' } });
    fireEvent.click(screen.getByRole('button', { name: /send reset link/i }));
    fireEvent.click(screen.getByRole('button', { name: /send reset link|sending/i }));
    expect(authAPI.forgotPasswordRequest).toHaveBeenCalledTimes(1);
    resolvePromise({ success: true, message: 'Reset link sent' });
  });

  it('shows fallback error message if API returns error with no message', async () => {
    authAPI.forgotPasswordRequest.mockResolvedValue({ error: true, message: '' });
    render(
      <BrowserRouter>
        <ForgotPassword />
      </BrowserRouter>
    );
    fireEvent.change(screen.getByLabelText(/email address/i), { target: { value: 'test@example.com' } });
    fireEvent.click(screen.getByRole('button', { name: /send reset link/i }));
    expect((await screen.findAllByText(/failed to send reset link\. please try again\./i)).length).toBeGreaterThan(0);
  });

  it('shows fallback success message if API returns success with no message', async () => {
    authAPI.forgotPasswordRequest.mockResolvedValue({ success: true, message: '' });
    render(
      <BrowserRouter>
        <ForgotPassword />
      </BrowserRouter>
    );
    fireEvent.change(screen.getByLabelText(/email address/i), { target: { value: 'test@example.com' } });
    fireEvent.click(screen.getByRole('button', { name: /send reset link/i }));
    expect((await screen.findAllByText(/if an account with that email exists, a password reset link has been sent\./i)).length).toBeGreaterThan(0);
  });
}); 