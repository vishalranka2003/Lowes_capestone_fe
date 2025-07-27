import React from 'react';
import { render, screen, fireEvent, waitFor, act } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router-dom';
import { ResetPassword } from '../ResetPassword';
import * as authAPI from '../../features/auth/authAPI';

jest.mock('../../features/auth/authAPI');


const mockNavigate = jest.fn();
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: () => mockNavigate,
  useLocation: jest.fn(), // Mock useLocation directly
}));


const renderWithRouter = (ui, { initialEntries = ['/reset-password?token=mock-token'] } = {}) => {
  return render(
    <MemoryRouter initialEntries={initialEntries}>
      {ui}
    </MemoryRouter>
  );
};

// Increased timeout for waitFor, as rendering animations might take slightly longer
const extendedTimeout = 2000; // 2 seconds

describe('ResetPassword', () => {
  const originalConsoleError = console.error;

  beforeEach(() => {
    jest.clearAllMocks();
    console.error = jest.fn(); // Suppress console.error in tests
    authAPI.resetPasswordConfirm.mockReset();
    mockNavigate.mockReset();
    require('react-router-dom').useLocation.mockReturnValue({ search: '?token=mock-token' });
  });

  afterAll(() => {
    console.error = originalConsoleError; // Restore console.error
  });

  // --- Rendering Tests ---
  it('renders the form and static text when token is present', () => {
    renderWithRouter(<ResetPassword />, { initialEntries: ['/reset-password?token=valid-token'] });

    expect(screen.getByRole('heading', { name: /set new password/i })).toBeInTheDocument();
    expect(screen.getByLabelText(/new password/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /reset password/i })).toBeInTheDocument();
    expect(screen.getByText(/back to login/i)).toBeInTheDocument();
    expect(screen.queryByText(/password reset token is missing/i)).not.toBeInTheDocument();
  });

  it('shows error when token is missing from URL', async () => {
    require('react-router-dom').useLocation.mockReturnValue({ search: '' });

    await act(async () => {
      renderWithRouter(<ResetPassword />, { initialEntries: ['/reset-password'] });
    });

    const errorElements = await screen.findAllByText(
      /password reset token is missing from the url\./i,
      { selector: 'p.text-red-600.text-sm' },
      { timeout: extendedTimeout }
    );
    expect(errorElements).toHaveLength(2); 
    expect(screen.queryByLabelText(/new password/i)).not.toBeInTheDocument();
    expect(screen.queryByRole('button', { name: /reset password/i })).not.toBeInTheDocument();
  });

  // --- Validation Tests ---
  it('validates empty password on blur', async () => {
    renderWithRouter(<ResetPassword />);

    const passwordInput = screen.getByLabelText(/new password/i);
    await act(async () => {
      await userEvent.clear(passwordInput);
      fireEvent.blur(passwordInput);
    });

    expect(screen.getByText(/new password is required/i)).toBeInTheDocument();
  });

  it('does not call API with invalid password on submit', async () => {
    renderWithRouter(<ResetPassword />);

    const passwordInput = screen.getByLabelText(/new password/i);
    const resetButton = screen.getByRole('button', { name: /reset password/i });

    await act(async () => {
      await userEvent.type(passwordInput, 'weak');
      await userEvent.click(resetButton);
    });

    expect(screen.getByText(/password is too weak/i)).toBeInTheDocument();
    expect(await screen.findByText(/please correct the errors in the form\./i, { selector: 'p.text-red-600.text-sm', timeout: extendedTimeout })).toBeInTheDocument();
    expect(authAPI.resetPasswordConfirm).not.toHaveBeenCalled();
    expect(resetButton).not.toBeDisabled();
    expect(resetButton).toHaveTextContent(/reset password/i);
  });

  // --- Loading State Tests ---
  it('disables submit button and shows loading state when submitting', async () => {
    let resolvePromise;
    const apiPromise = new Promise((resolve) => {
      resolvePromise = resolve;
    });
    authAPI.resetPasswordConfirm.mockReturnValue(apiPromise);

    renderWithRouter(<ResetPassword />);

    const passwordInput = screen.getByLabelText(/new password/i);
    const resetButton = screen.getByRole('button', { name: /reset password/i });

    await act(async () => {
      await userEvent.type(passwordInput, 'ValidPassword1!');
      await userEvent.click(resetButton);
    });

    await waitFor(() => {
      expect(resetButton).toHaveTextContent(/resetting\.\.\./i);
      expect(resetButton).toBeDisabled();
    }, { timeout: extendedTimeout });

    await act(async () => {
      resolvePromise({ success: true, message: 'Password reset successful' });
    });

    await waitFor(() => {
      expect(resetButton).toHaveTextContent(/reset password/i);
      expect(resetButton).not.toBeDisabled();
    }, { timeout: extendedTimeout });
  });

  it('does not call API again if already loading', async () => {
    let resolvePromise;
    const apiPromise = new Promise((resolve) => {
      resolvePromise = resolve;
    });
    authAPI.resetPasswordConfirm.mockReturnValue(apiPromise);

    renderWithRouter(<ResetPassword />);

    const passwordInput = screen.getByLabelText(/new password/i);
    const resetButton = screen.getByRole('button', { name: /reset password/i });

    await act(async () => {
      await userEvent.type(passwordInput, 'ValidPassword1!');
      await userEvent.click(resetButton);
    });

    await waitFor(() => {
      expect(resetButton).toHaveTextContent(/resetting\.\.\./i);
      expect(resetButton).toBeDisabled();
      expect(authAPI.resetPasswordConfirm).toHaveBeenCalledTimes(1);
    }, { timeout: extendedTimeout });

    await act(async () => {
      await userEvent.click(resetButton);
    });
    expect(authAPI.resetPasswordConfirm).toHaveBeenCalledTimes(1);

    await act(async () => {
      resolvePromise({ success: true, message: 'Password reset successful' });
    });
  });

  // --- API Response Handling Tests ---
  it('submits with valid password and handles API error', async () => {
    authAPI.resetPasswordConfirm.mockResolvedValue({ error: true, status: 400, message: 'Invalid or expired token' });

    renderWithRouter(<ResetPassword />);

    const passwordInput = screen.getByLabelText(/new password/i);
    const resetButton = screen.getByRole('button', { name: /reset password/i });

    await act(async () => {
      await userEvent.type(passwordInput, 'Password123!');
      await userEvent.click(resetButton);
    });

    await waitFor(() => {
      expect(screen.getByText(/invalid or expired token/i)).toBeInTheDocument();
      expect(screen.queryByText(/your password has been reset successfully!/i, { selector: 'p.text-green-600.text-sm' })).not.toBeInTheDocument();
    }, { timeout: extendedTimeout });
  });

  it('submits with valid password and handles network error (rejected promise)', async () => {
    authAPI.resetPasswordConfirm.mockRejectedValue(new Error('Network error occurred'));

    renderWithRouter(<ResetPassword />);

    const passwordInput = screen.getByLabelText(/new password/i);
    const resetButton = screen.getByRole('button', { name: /reset password/i });

    await act(async () => {
      await userEvent.type(passwordInput, 'Password123!');
      await userEvent.click(resetButton);
    });

    await waitFor(() => {
      expect(screen.getByText(/an unexpected error occurred\. please try again later\./i)).toBeInTheDocument();
      expect(console.error).toHaveBeenCalledWith('Reset password submission error:', expect.any(Error));
      expect(screen.queryByText(/your password has been reset successfully!/i, { selector: 'p.text-green-600.text-sm' })).not.toBeInTheDocument();
    }, { timeout: extendedTimeout });
  });

  // --- Password Strength Indicator & Visibility Tests ---
  it('shows password strength indicator when focused and typing', async () => {
    renderWithRouter(<ResetPassword />);

    const passwordInput = screen.getByLabelText(/new password/i);

    await act(async () => {
      passwordInput.focus();
      await userEvent.type(passwordInput, 'Pass123!');
    });

    await waitFor(() => {
      const strengthTextElement = screen.getByText((content, element) => {
        return element.classList.contains('text-gray-600') && element.textContent.toLowerCase().includes('password strength:');
      }, { selector: 'div.text-sm.text-gray-600', timeout: extendedTimeout });
      expect(strengthTextElement).toHaveTextContent(/password strength: strong/i);
      expect(screen.getByText(/at least 8 characters/i)).toBeInTheDocument();
      expect(screen.getByText(/one lowercase letter/i)).toBeInTheDocument();
      expect(screen.getByText(/one uppercase letter/i)).toBeInTheDocument();
      expect(screen.getByText(/one number/i)).toBeInTheDocument();
      expect(screen.getByText(/one special character/i)).toBeInTheDocument();
    });
  });

  it('toggles password visibility', async () => {
    renderWithRouter(<ResetPassword />);

    const passwordInput = screen.getByLabelText(/new password/i);
    expect(passwordInput).toHaveAttribute('type', 'password');

    const toggleButton = passwordInput.nextElementSibling;

    expect(toggleButton).toBeInTheDocument();
    expect(toggleButton).toBeEnabled();

    await act(async () => {
      await userEvent.click(toggleButton);
    });
    expect(passwordInput).toHaveAttribute('type', 'text');

    await act(async () => {
      await userEvent.click(toggleButton);
    });
    expect(passwordInput).toHaveAttribute('type', 'password');
  });

  // --- Navigation Test ---
  it('navigates to login when clicking Back to Login button', async () => {
    renderWithRouter(<ResetPassword />);

    const backToLoginButton = screen.getByRole('button', { name: /back to login/i });
    await act(async () => {
      await userEvent.click(backToLoginButton);
    });

    expect(mockNavigate).toHaveBeenCalledWith('/login');
  });

  // --- Specific Coverage & Edge Cases ---
  it('clears form and errors on successful submission', async () => {
    jest.useFakeTimers();
    authAPI.resetPasswordConfirm.mockResolvedValue({ success: true, message: 'Password reset successful' });

    renderWithRouter(<ResetPassword />);

    const passwordInput = screen.getByLabelText(/new password/i);
    const resetButton = screen.getByRole('button', { name: /reset password/i });

    await act(async () => {
      await userEvent.type(passwordInput, 'Password123!');
      fireEvent.blur(passwordInput); // Ensure field errors are triggered before submission
      await userEvent.click(resetButton);
    });

    expect(await screen.findByText(/password reset successful/i, { selector: 'p.text-green-600.text-sm', timeout: extendedTimeout })).toBeInTheDocument();
    expect(passwordInput).toHaveValue('');
    expect(screen.queryByText(/password is too weak/i)).not.toBeInTheDocument();
    expect(screen.queryByText(/new password is required/i)).not.toBeInTheDocument();
    expect(screen.queryByText(/please correct the errors in the form\./i, { selector: 'p.text-red-600.text-sm' })).not.toBeInTheDocument();

    jest.useRealTimers();
  });

  it('handles empty message from API error response gracefully', async () => {
    authAPI.resetPasswordConfirm.mockResolvedValue({ error: true, status: 400, message: '' });

    renderWithRouter(<ResetPassword />);

    const passwordInput = screen.getByLabelText(/new password/i);
    const resetButton = screen.getByRole('button', { name: /reset password/i });

    await act(async () => {
      await userEvent.type(passwordInput, 'Password123!');
      await userEvent.click(resetButton);
    });

    await waitFor(() => {
      expect(screen.getByText(/failed to reset password\./i)).toBeInTheDocument();
    }, { timeout: extendedTimeout });
  });
});