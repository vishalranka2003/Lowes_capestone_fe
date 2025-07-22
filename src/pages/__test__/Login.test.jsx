import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { Provider } from 'react-redux';
import { BrowserRouter } from 'react-router-dom';
import { configureStore } from '@reduxjs/toolkit';
import authReducer from '../../features/auth/authSlice';
import { Login } from '../Login';
import * as authAPI from '../../features/auth/authAPI';

// Mock the authAPI
jest.mock('../../features/auth/authAPI');

const mockNavigate = jest.fn();
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: () => mockNavigate,
}));

const createMockStore = (initialState = {}) => {
  return configureStore({
    reducer: {
      auth: authReducer
    },
    preloadedState: {
      auth: {
        token: null,
        username: null,
        role: null,
        ...initialState
      }
    }
  });
};

const MockProvider = ({ children, store }) => (
  <Provider store={store}>
    <BrowserRouter>{children}</BrowserRouter>
  </Provider>
);

describe('Login Component', () => {
  let mockStore;

  beforeEach(() => {
    mockStore = createMockStore();
    mockNavigate.mockClear();
    jest.clearAllMocks();
    
    // Clear localStorage
    localStorage.clear();
    
    // Mock console.error to avoid noise in tests
    jest.spyOn(console, 'error').mockImplementation(() => {});
  });

  afterEach(() => {
    console.error.mockRestore();
  });

  test('renders login form with all elements', () => {
    render(
      <MockProvider store={mockStore}>
        <Login />
      </MockProvider>
    );

    expect(screen.getByText('Welcome Back')).toBeInTheDocument();
    expect(screen.getByText('Sign in to your account')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Enter your email')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Enter your password')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Sign In' })).toBeInTheDocument();
    expect(screen.getByText('Homeowner')).toBeInTheDocument();
    expect(screen.getByText('Technician')).toBeInTheDocument();
    expect(screen.getByText('Admin')).toBeInTheDocument();
  });

  test('updates email and password input values', () => {
    render(
      <MockProvider store={mockStore}>
        <Login />
      </MockProvider>
    );

    const emailInput = screen.getByPlaceholderText('Enter your email');
    const passwordInput = screen.getByPlaceholderText('Enter your password');

    fireEvent.change(emailInput, { target: { value: 'test@example.com' } });
    fireEvent.change(passwordInput, { target: { value: 'password123' } });

    expect(emailInput.value).toBe('test@example.com');
    expect(passwordInput.value).toBe('password123');
  });

  test('changes role when role tabs are clicked', () => {
    render(
      <MockProvider store={mockStore}>
        <Login />
      </MockProvider>
    );

    const technicianTab = screen.getByText('Technician');
    const adminTab = screen.getByText('Admin');

    fireEvent.click(technicianTab);
    expect(technicianTab).toHaveClass('bg-white text-lowesBlue-500');

    fireEvent.click(adminTab);
    expect(adminTab).toHaveClass('bg-white text-lowesBlue-500');
  });

  test('shows loading state initially when checking authentication', () => {
    // Set up localStorage to simulate logged in user
    localStorage.setItem('token', 'test-token');
    localStorage.setItem('username', 'testuser');
    localStorage.setItem('role', 'ROLE_HOMEOWNER');

    render(
      <MockProvider store={mockStore}>
        <Login />
      </MockProvider>
    );

    expect(screen.getByText('Loading...')).toBeInTheDocument();
  });

  test('redirects to appropriate dashboard when user is already logged in', async () => {
    localStorage.setItem('token', 'test-token');
    localStorage.setItem('username', 'testuser');
    localStorage.setItem('role', 'ROLE_TECHNICIAN');

    render(
      <MockProvider store={mockStore}>
        <Login />
      </MockProvider>
    );

    await waitFor(() => {
      expect(mockNavigate).toHaveBeenCalledWith('/dashboard/technician');
    });
  });

 

  test('handles successful login for homeowner', async () => {
    const mockLoginResponse = {
      token: 'mock-token',
      username: 'testuser',
      role: 'ROLE_HOMEOWNER'
    };

    authAPI.login.mockResolvedValue(mockLoginResponse);

    render(
      <MockProvider store={mockStore}>
        <Login />
      </MockProvider>
    );

    fireEvent.change(screen.getByPlaceholderText('Enter your email'), {
      target: { value: 'test@example.com' }
    });
    fireEvent.change(screen.getByPlaceholderText('Enter your password'), {
      target: { value: 'password123' }
    });

    fireEvent.click(screen.getByRole('button', { name: 'Sign In' }));

    await waitFor(() => {
      expect(authAPI.login).toHaveBeenCalledWith('test@example.com', 'password123', 'ROLE_HOMEOWNER');
      expect(mockNavigate).toHaveBeenCalledWith('/dashboard/homeowner');
    });
  });

  test('handles successful login for technician', async () => {
    const mockLoginResponse = {
      token: 'mock-token',
      username: 'testuser',
      role: 'ROLE_TECHNICIAN'
    };

    authAPI.login.mockResolvedValue(mockLoginResponse);

    render(
      <MockProvider store={mockStore}>
        <Login />
      </MockProvider>
    );

    fireEvent.click(screen.getByText('Technician'));
    fireEvent.change(screen.getByPlaceholderText('Enter your email'), {
      target: { value: 'tech@example.com' }
    });
    fireEvent.change(screen.getByPlaceholderText('Enter your password'), {
      target: { value: 'password123' }
    });

    fireEvent.click(screen.getByRole('button', { name: 'Sign In' }));

    await waitFor(() => {
      expect(authAPI.login).toHaveBeenCalledWith('tech@example.com', 'password123', 'ROLE_TECHNICIAN');
      expect(mockNavigate).toHaveBeenCalledWith('/dashboard/technician');
    });
  });

  test('handles successful login for admin', async () => {
    const mockLoginResponse = {
      token: 'mock-token',
      username: 'testuser',
      role: 'ROLE_ADMIN'
    };

    authAPI.login.mockResolvedValue(mockLoginResponse);

    render(
      <MockProvider store={mockStore}>
        <Login />
      </MockProvider>
    );

    fireEvent.click(screen.getByText('Admin'));
    fireEvent.change(screen.getByPlaceholderText('Enter your email'), {
      target: { value: 'admin@example.com' }
    });
    fireEvent.change(screen.getByPlaceholderText('Enter your password'), {
      target: { value: 'password123' }
    });

    fireEvent.click(screen.getByRole('button', { name: 'Sign In' }));

    await waitFor(() => {
      expect(authAPI.login).toHaveBeenCalledWith('admin@example.com', 'password123', 'ROLE_ADMIN');
      expect(mockNavigate).toHaveBeenCalledWith('/dashboard/admin');
    });
  });

  test('displays error when login fails with error response', async () => {
    authAPI.login.mockResolvedValue({ error: true });

    render(
      <MockProvider store={mockStore}>
        <Login />
      </MockProvider>
    );

    fireEvent.change(screen.getByPlaceholderText('Enter your email'), {
      target: { value: 'test@example.com' }
    });
    fireEvent.change(screen.getByPlaceholderText('Enter your password'), {
      target: { value: 'wrongpassword' }
    });

    fireEvent.click(screen.getByRole('button', { name: 'Sign In' }));

    await waitFor(() => {
      expect(screen.getByText('Login failed. Check your role or credentials.')).toBeInTheDocument();
    });
  });

  test('displays error when login response is empty', async () => {
    authAPI.login.mockResolvedValue(null);

    render(
      <MockProvider store={mockStore}>
        <Login />
      </MockProvider>
    );

    fireEvent.change(screen.getByPlaceholderText('Enter your email'), {
      target: { value: 'test@example.com' }
    });
    fireEvent.change(screen.getByPlaceholderText('Enter your password'), {
      target: { value: 'password' }
    });

    fireEvent.click(screen.getByRole('button', { name: 'Sign In' }));

    await waitFor(() => {
      expect(screen.getByText('Login failed. Check your role or credentials.')).toBeInTheDocument();
    });
  });

  test('displays error when login response has no token', async () => {
    authAPI.login.mockResolvedValue({ username: 'test', role: 'ROLE_HOMEOWNER' });

    render(
      <MockProvider store={mockStore}>
        <Login />
      </MockProvider>
    );

    fireEvent.change(screen.getByPlaceholderText('Enter your email'), {
      target: { value: 'test@example.com' }
    });
    fireEvent.change(screen.getByPlaceholderText('Enter your password'), {
      target: { value: 'password' }
    });

    fireEvent.click(screen.getByRole('button', { name: 'Sign In' }));

    await waitFor(() => {
      expect(screen.getByText('Login failed. Check your role or credentials.')).toBeInTheDocument();
    });
  });

  test('displays generic error when login throws exception', async () => {
    authAPI.login.mockRejectedValue(new Error('Network error'));

    render(
      <MockProvider store={mockStore}>
        <Login />
      </MockProvider>
    );

    fireEvent.change(screen.getByPlaceholderText('Enter your email'), {
      target: { value: 'test@example.com' }
    });
    fireEvent.change(screen.getByPlaceholderText('Enter your password'), {
      target: { value: 'password' }
    });

    fireEvent.click(screen.getByRole('button', { name: 'Sign In' }));

    await waitFor(() => {
      expect(screen.getByText('Something went wrong. Please try again later.')).toBeInTheDocument();
    });
  });

  test('getDashboardRoute returns correct routes for different roles', () => {
    // This tests the helper function indirectly through the successful login tests
    // but we can also test edge cases
    localStorage.setItem('token', 'test-token');
    localStorage.setItem('username', 'testuser');
    localStorage.setItem('role', 'UNKNOWN_ROLE');

    render(
      <MockProvider store={mockStore}>
        <Login />
      </MockProvider>
    );

    // The component should handle unknown roles gracefully
    expect(mockNavigate).toHaveBeenCalledWith('/dashboard');
  });

  test('renders signup link correctly', () => {
    render(
      <MockProvider store={mockStore}>
        <Login />
      </MockProvider>
    );

    const signupLink = screen.getByText('Sign up');
    expect(signupLink).toBeInTheDocument();
    expect(signupLink).toHaveAttribute('href', '/signup');
  });
});