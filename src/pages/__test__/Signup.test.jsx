import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { Signup } from '../Signup';

// Mock environment variables
process.env.REACT_APP_API_URL = 'http://localhost:3000';

const mockNavigate = jest.fn();
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: () => mockNavigate
}));

// Mock localStorage
const mockLocalStorage = {
  getItem: jest.fn(),
  setItem: jest.fn(),
  removeItem: jest.fn(),
  clear: jest.fn()
};
Object.defineProperty(window, 'localStorage', { value: mockLocalStorage });

// Mock fetch
global.fetch = jest.fn();

const MockRouter = ({ children }) => (
  <BrowserRouter>{children}</BrowserRouter>
);

describe('Signup Component', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockLocalStorage.getItem.mockReturnValue(null);
    fetch.mockClear();
  });

  test('renders signup form with all fields', () => {
    render(
      <MockRouter>
        <Signup />
      </MockRouter>
    );
    
    expect(screen.getByRole('heading', { name: 'Create Account' })).toBeInTheDocument();
    expect(screen.getByPlaceholderText('First Name')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Last Name')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Username')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Email')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Password')).toBeInTheDocument();
  });

  test('renders role selection tabs', () => {
    render(
      <MockRouter>
        <Signup />
      </MockRouter>
    );
    
    expect(screen.getByText('Homeowner')).toBeInTheDocument();
    expect(screen.getByText('Technician')).toBeInTheDocument();
  });

  test('shows homeowner-specific fields by default', () => {
    render(
      <MockRouter>
        <Signup />
      </MockRouter>
    );
    
    expect(screen.getByPlaceholderText('Address')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Phone Number')).toBeInTheDocument();
  });

  test('shows technician-specific fields when technician role is selected', () => {
    render(
      <MockRouter>
        <Signup />
      </MockRouter>
    );
    
    fireEvent.click(screen.getByText('Technician'));
    
    expect(screen.getByPlaceholderText('Specialization')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Experience (in years)')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Phone Number')).toBeInTheDocument();
  });

  test('handles form input changes', () => {
    render(
      <MockRouter>
        <Signup />
      </MockRouter>
    );
    
    const firstNameInput = screen.getByPlaceholderText('First Name');
    fireEvent.change(firstNameInput, { target: { value: 'John' } });
    
    expect(firstNameInput.value).toBe('John');
  });

  test('handles successful homeowner signup', async () => {
    fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({ message: 'Success' })
    });
    
    render(
      <MockRouter>
        <Signup />
      </MockRouter>
    );
    
    // Fill form
    fireEvent.change(screen.getByPlaceholderText('First Name'), { target: { value: 'John' } });
    fireEvent.change(screen.getByPlaceholderText('Last Name'), { target: { value: 'Doe' } });
    fireEvent.change(screen.getByPlaceholderText('Username'), { target: { value: 'johndoe' } });
    fireEvent.change(screen.getByPlaceholderText('Email'), { target: { value: 'john@example.com' } });
    fireEvent.change(screen.getByPlaceholderText('Password'), { target: { value: 'password123' } });
    fireEvent.change(screen.getByPlaceholderText('Address'), { target: { value: '123 Main St' } });
    fireEvent.change(screen.getByPlaceholderText('Phone Number'), { target: { value: '1234567890' } });
    
    fireEvent.click(screen.getByRole('button', { name: 'Create Account' }));
    
    await waitFor(() => {
      expect(fetch).toHaveBeenCalledWith('http://localhost:3000/api/auth/register/homeowner', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: 'john@example.com',
          password: 'password123',
          username: 'johndoe',
          firstName: 'John',
          lastName: 'Doe',
          address: '123 Main St',
          phoneNumber: '1234567890'
        })
      });
    });
    
    expect(mockNavigate).toHaveBeenCalledWith('/login');
  });

  test('handles successful technician signup', async () => {
    fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({ message: 'Success' })
    });
    
    render(
      <MockRouter>
        <Signup />
      </MockRouter>
    );
    
    // Switch to technician role
    fireEvent.click(screen.getByText('Technician'));
    
    // Fill form
    fireEvent.change(screen.getByPlaceholderText('First Name'), { target: { value: 'Jane' } });
    fireEvent.change(screen.getByPlaceholderText('Last Name'), { target: { value: 'Smith' } });
    fireEvent.change(screen.getByPlaceholderText('Username'), { target: { value: 'janesmith' } });
    fireEvent.change(screen.getByPlaceholderText('Email'), { target: { value: 'jane@example.com' } });
    fireEvent.change(screen.getByPlaceholderText('Password'), { target: { value: 'password123' } });
    fireEvent.change(screen.getByPlaceholderText('Specialization'), { target: { value: 'Plumbing' } });
    fireEvent.change(screen.getByPlaceholderText('Experience (in years)'), { target: { value: '5' } });
    fireEvent.change(screen.getByPlaceholderText('Phone Number'), { target: { value: '9876543210' } });
    
    fireEvent.click(screen.getByRole('button', { name: 'Create Account' }));
    
    await waitFor(() => {
      expect(fetch).toHaveBeenCalledWith('http://localhost:3000/api/auth/register/technician', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: 'jane@example.com',
          password: 'password123',
          username: 'janesmith',
          firstName: 'Jane',
          lastName: 'Smith',
          specialization: 'Plumbing',
          experience: 5,
          phoneNumber: '9876543210'
        })
      });
    });
    
    expect(mockNavigate).toHaveBeenCalledWith('/login');
  });

  test('handles signup error with message', async () => {
    fetch.mockResolvedValueOnce({
      ok: false,
      json: async () => ({ message: 'Email already exists' })
    });
    
    render(
      <MockRouter>
        <Signup />
      </MockRouter>
    );
    
    fireEvent.click(screen.getByRole('button', { name: 'Create Account' }));
    
    await waitFor(() => {
      expect(screen.getByText('Email already exists')).toBeInTheDocument();
    });
  });

  test('handles signup error without message', async () => {
    fetch.mockResolvedValueOnce({
      ok: false,
      json: async () => ({})
    });
    
    render(
      <MockRouter>
        <Signup />
      </MockRouter>
    );
    
    fireEvent.click(screen.getByRole('button', { name: 'Create Account' }));
    
    await waitFor(() => {
      expect(screen.getByText('Signup failed')).toBeInTheDocument();
    });
  });

  test('handles network error', async () => {
    const consoleSpy = jest.spyOn(console, 'error').mockImplementation(() => {});
    
    fetch.mockRejectedValueOnce(new Error('Network error'));
    
    render(
      <MockRouter>
        <Signup />
      </MockRouter>
    );
    
    fireEvent.click(screen.getByRole('button', { name: 'Create Account' }));
    
    await waitFor(() => {
      expect(screen.getByText('Network error')).toBeInTheDocument();
    });
    
    expect(consoleSpy).toHaveBeenCalledWith(new Error('Network error'));
    consoleSpy.mockRestore();
  });

  test('redirects to homeowner dashboard if homeowner is already logged in', () => {
    mockLocalStorage.getItem.mockImplementation((key) => {
      if (key === 'token') return 'mock-token';
      if (key === 'username') return 'mockuser';
      if (key === 'role') return 'ROLE_HOMEOWNER';
      return null;
    });
    
    render(
      <MockRouter>
        <Signup />
      </MockRouter>
    );
    
    expect(mockNavigate).toHaveBeenCalledWith('/dashboard/homeowner');
  });

  test('redirects to technician dashboard if technician is already logged in', () => {
    mockLocalStorage.getItem.mockImplementation((key) => {
      if (key === 'token') return 'mock-token';
      if (key === 'username') return 'mockuser';
      if (key === 'role') return 'ROLE_TECHNICIAN';
      return null;
    });
    
    render(
      <MockRouter>
        <Signup />
      </MockRouter>
    );
    
    expect(mockNavigate).toHaveBeenCalledWith('/dashboard/technician');
  });

  test('redirects to admin dashboard if admin is already logged in', () => {
    mockLocalStorage.getItem.mockImplementation((key) => {
      if (key === 'token') return 'mock-token';
      if (key === 'username') return 'mockuser';
      if (key === 'role') return 'ROLE_ADMIN';
      return null;
    });
    
    render(
      <MockRouter>
        <Signup />
      </MockRouter>
    );
    
    expect(mockNavigate).toHaveBeenCalledWith('/dashboard/admin');
  });

  test('handles unknown role and defaults to homeowner dashboard', () => {
    mockLocalStorage.getItem.mockImplementation((key) => {
      if (key === 'token') return 'mock-token';
      if (key === 'username') return 'mockuser';
      if (key === 'role') return 'ROLE_UNKNOWN';
      return null;
    });
    
    render(
      <MockRouter>
        <Signup />
      </MockRouter>
    );
    
    expect(mockNavigate).toHaveBeenCalledWith('/dashboard/homeowner');
  });



  test('renders login link', () => {
    render(
      <MockRouter>
        <Signup />
      </MockRouter>
    );
    
    const loginLink = screen.getByText('Sign in');
    expect(loginLink).toBeInTheDocument();
    expect(loginLink.closest('a')).toHaveAttribute('href', '/login');
  });

  test('renders all form elements correctly', () => {
    render(
      <MockRouter>
        <Signup />
      </MockRouter>
    );
    
    // Check logo and title
    expect(screen.getByText('Service Pro')).toBeInTheDocument();
    expect(screen.getByText('Choose your account type and fill in your details')).toBeInTheDocument();
    
    // Check form structure
    expect(screen.getByRole('button', { name: 'Create Account' })).toBeInTheDocument();
    expect(screen.getByText('Already have an account?')).toBeInTheDocument();
  });

  test('handles role switching between homeowner and technician', () => {
    render(
      <MockRouter>
        <Signup />
      </MockRouter>
    );
    
    // Initially homeowner fields should be visible
    expect(screen.getByPlaceholderText('Address')).toBeInTheDocument();
    expect(screen.queryByPlaceholderText('Specialization')).not.toBeInTheDocument();
    
    // Switch to technician
    fireEvent.click(screen.getByText('Technician'));
    
    // Technician fields should be visible
    expect(screen.getByPlaceholderText('Specialization')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Experience (in years)')).toBeInTheDocument();
    expect(screen.queryByPlaceholderText('Address')).not.toBeInTheDocument();
    
    // Switch back to homeowner
    fireEvent.click(screen.getByText('Homeowner'));
    
    // Homeowner fields should be visible again
    expect(screen.getByPlaceholderText('Address')).toBeInTheDocument();
    expect(screen.queryByPlaceholderText('Specialization')).not.toBeInTheDocument();
  });

  test('handles all form field changes', () => {
    render(
      <MockRouter>
        <Signup />
      </MockRouter>
    );
    
    // Test all common fields
    const fields = [
      { placeholder: 'First Name', value: 'John' },
      { placeholder: 'Last Name', value: 'Doe' },
      { placeholder: 'Username', value: 'johndoe' },
      { placeholder: 'Email', value: 'john@example.com' },
      { placeholder: 'Password', value: 'password123' },
      { placeholder: 'Address', value: '123 Main St' },
      { placeholder: 'Phone Number', value: '1234567890' }
    ];
    
    fields.forEach(field => {
      const input = screen.getByPlaceholderText(field.placeholder);
      fireEvent.change(input, { target: { value: field.value } });
      expect(input.value).toBe(field.value);
    });
    
    // Test technician-specific fields
    fireEvent.click(screen.getByText('Technician'));
    
    const techFields = [
      { placeholder: 'Specialization', value: 'Plumbing' },
      { placeholder: 'Experience (in years)', value: '5' }
    ];
    
    techFields.forEach(field => {
      const input = screen.getByPlaceholderText(field.placeholder);
      fireEvent.change(input, { target: { value: field.value } });
      expect(input.value).toBe(field.value);
    });
  });

  test('shows loading state when user data exists', () => {
    mockLocalStorage.getItem.mockImplementation((key) => {
      if (key === 'token') return 'mock-token';
      if (key === 'username') return 'mockuser';
      if (key === 'role') return 'ROLE_HOMEOWNER';
      return null;
    });
    
    render(
      <MockRouter>
        <Signup />
      </MockRouter>
    );
    
    // Should navigate to dashboard instead of showing loading
    expect(mockNavigate).toHaveBeenCalledWith('/dashboard/homeowner');
  });
});