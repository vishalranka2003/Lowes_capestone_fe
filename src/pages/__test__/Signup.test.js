import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { Signup } from '../Signup';

const mockNavigate = jest.fn();
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: () => mockNavigate,
}));

describe('Signup Component', () => {
  beforeEach(() => {
    global.fetch = jest.fn();
    mockNavigate.mockClear();
  });

  it('renders signup form correctly', () => {
    render(
      <BrowserRouter>
        <Signup />
      </BrowserRouter>
    );
    expect(screen.getByRole('heading', { name: /create account/i })).toBeInTheDocument();
    expect(screen.getByLabelText('First Name')).toBeInTheDocument();
    expect(screen.getByLabelText('Last Name')).toBeInTheDocument();
    expect(screen.getByLabelText('Email Address')).toBeInTheDocument();
    expect(screen.getByLabelText('Password')).toBeInTheDocument();
    expect(screen.getByLabelText('Address')).toBeInTheDocument();
    expect(screen.getByLabelText('Phone Number')).toBeInTheDocument();
    expect(screen.getByText('Homeowner')).toBeInTheDocument();
    expect(screen.getByText('Technician')).toBeInTheDocument();
    expect(screen.getByText('Sign in')).toBeInTheDocument();
  });

  it('handles role selection and shows technician fields', async () => {
    render(
      <BrowserRouter>
        <Signup />
      </BrowserRouter>
    );
    fireEvent.click(screen.getByText('Technician'));
    await waitFor(() => {
      expect(screen.getByText('Specializations (max 2)')).toBeInTheDocument();
      expect(screen.getByLabelText('Experience (Years)')).toBeInTheDocument();
      expect(screen.queryByLabelText('Address')).not.toBeInTheDocument();
    });
  });

  it('shows password strength indicator on focus', async () => {
    render(
      <BrowserRouter>
        <Signup />
      </BrowserRouter>
    );
    const passwordInput = screen.getByLabelText('Password');
    fireEvent.focus(passwordInput);
    fireEvent.change(passwordInput, { target: { value: 'Pass123!' } });
    await waitFor(() => {
      expect(screen.getAllByText((_, node) => node.textContent.includes('Password strength:')).length).toBeGreaterThan(0);
      expect(screen.getByText('At least 8 characters')).toBeInTheDocument();
    });
  });

  it('validates form fields on submit', async () => {
    render(
      <BrowserRouter>
        <Signup />
      </BrowserRouter>
    );
    fireEvent.click(screen.getByRole('button', { name: /create account/i }));
    await waitFor(() => {
      expect(screen.getAllByText(/this field is required/i).length).toBeGreaterThan(0);
      expect(screen.getByText('Email is required')).toBeInTheDocument();
      expect(screen.getByText('Password is required')).toBeInTheDocument();
      expect(screen.getByText('Address is required')).toBeInTheDocument();
      expect(screen.getByText('Phone number is required')).toBeInTheDocument();
    });
  });

  it('validates invalid inputs', async () => {
    render(
      <BrowserRouter>
        <Signup />
      </BrowserRouter>
    );
    fireEvent.change(screen.getByLabelText('Email Address'), { target: { value: 'invalid' } });
    fireEvent.blur(screen.getByLabelText('Email Address'));
    fireEvent.change(screen.getByLabelText('Phone Number'), { target: { value: '123' } });
    fireEvent.blur(screen.getByLabelText('Phone Number'));
    fireEvent.change(screen.getByLabelText('First Name'), { target: { value: 'J' } });
    fireEvent.blur(screen.getByLabelText('First Name'));
    fireEvent.change(screen.getByLabelText('Password'), { target: { value: 'weak' } });
    fireEvent.blur(screen.getByLabelText('Password'));
    await waitFor(() => {
      expect(screen.getByText('Please enter a valid email address')).toBeInTheDocument();
      expect(screen.getByText('Please enter exactly 10 digits')).toBeInTheDocument();
      expect(screen.getByText('Must be at least 2 characters')).toBeInTheDocument();
      expect(screen.getByText('Password is too weak')).toBeInTheDocument();
    });
  });

  it('handles successful homeowner signup', async () => {
    global.fetch.mockResolvedValue({
      ok: true,
      json: () => Promise.resolve({ message: 'Registration successful' }),
    });
    render(
      <BrowserRouter>
        <Signup />
      </BrowserRouter>
    );
    fireEvent.change(screen.getByLabelText('First Name'), { target: { value: 'John' } });
    fireEvent.change(screen.getByLabelText('Last Name'), { target: { value: 'Doe' } });
    fireEvent.change(screen.getByLabelText('Email Address'), { target: { value: 'test@example.com' } });
    fireEvent.change(screen.getByLabelText('Password'), { target: { value: 'Password123!' } });
    fireEvent.change(screen.getByLabelText('Address'), { target: { value: '123 Main St' } });
    fireEvent.change(screen.getByLabelText('Phone Number'), { target: { value: '1234567890' } });
    fireEvent.click(screen.getByRole('button', { name: /create account/i }));
    await waitFor(() => {
      expect(mockNavigate).toHaveBeenCalledWith('/login');
      expect(fetch).toHaveBeenCalledWith(
        expect.stringContaining('/register/homeowner'),
        expect.any(Object)
      );
    });
  });

  it('handles successful technician signup with specializations', async () => {
    global.fetch.mockResolvedValue({
      ok: true,
      json: () => Promise.resolve({ message: 'Registration successful' }),
    });
    render(
      <BrowserRouter>
        <Signup />
      </BrowserRouter>
    );
    fireEvent.click(screen.getByText('Technician'));
    fireEvent.change(screen.getByLabelText('First Name'), { target: { value: 'Jane' } });
    fireEvent.change(screen.getByLabelText('Last Name'), { target: { value: 'Doe' } });
    fireEvent.change(screen.getByLabelText('Email Address'), { target: { value: 'tech@example.com' } });
    fireEvent.change(screen.getByLabelText('Password'), { target: { value: 'Password123!' } });
    fireEvent.change(screen.getByLabelText('Phone Number'), { target: { value: '1234567890' } });
    fireEvent.change(screen.getByLabelText('Experience (Years)'), { target: { value: '5' } });
    fireEvent.click(screen.getByText('Add specializations'));
    fireEvent.click(screen.getByLabelText('Refrigerator Service'));
    fireEvent.click(screen.getByRole('button', { name: /create account/i }));
    await waitFor(() => {
      expect(mockNavigate).toHaveBeenCalledWith('/login');
      expect(fetch).toHaveBeenCalledWith(
        expect.stringContaining('/register/technician'),
        expect.objectContaining({
          body: expect.stringContaining('Refrigerator'),
        })
      );
    });
  });

  it('validates technician experience', async () => {
    render(
      <BrowserRouter>
        <Signup />
      </BrowserRouter>
    );
    fireEvent.click(screen.getByText('Technician'));
    fireEvent.change(screen.getByLabelText('Experience (Years)'), { target: { value: '-1' } });
    fireEvent.blur(screen.getByLabelText('Experience (Years)'));
    await waitFor(() => {
      expect(screen.getByText('Please enter a valid number')).toBeInTheDocument();
    });
  });

  it('limits specialization to max 2', async () => {
    render(
      <BrowserRouter>
        <Signup />
      </BrowserRouter>
    );
    fireEvent.click(screen.getByText('Technician'));
    fireEvent.click(screen.getByText('Add specializations'));
    fireEvent.click(screen.getByLabelText('Refrigerator Service'));
    fireEvent.click(screen.getByLabelText('Washing Machine Service'));
    fireEvent.click(screen.getByLabelText('Dishwasher Service'));
    await waitFor(() => {
      expect(screen.getByText('Maximum 2 specializations reached')).toBeInTheDocument();
    });
  });

  it('handles specialization search', async () => {
    render(
      <BrowserRouter>
        <Signup />
      </BrowserRouter>
    );
    fireEvent.click(screen.getByText('Technician'));
    fireEvent.click(screen.getByText('Add specializations'));
    fireEvent.change(screen.getByPlaceholderText('Search specializations...'), { target: { value: 'refrig' } });
    await waitFor(() => {
      expect(screen.getByText('Refrigerator Service')).toBeInTheDocument();
      expect(screen.queryByText('Washing Machine Service')).not.toBeInTheDocument();
    });
  });

  it('handles signup failure (text error)', async () => {
    global.fetch.mockResolvedValue({
      ok: false,
      status: 400,
      headers: { get: () => '' },
      text: () => Promise.resolve('Email already exists'),
    });
    render(
      <BrowserRouter>
        <Signup />
      </BrowserRouter>
    );
    fireEvent.change(screen.getByLabelText('First Name'), { target: { value: 'John' } });
    fireEvent.change(screen.getByLabelText('Last Name'), { target: { value: 'Doe' } });
    fireEvent.change(screen.getByLabelText('Email Address'), { target: { value: 'test@example.com' } });
    fireEvent.change(screen.getByLabelText('Password'), { target: { value: 'Password123!' } });
    fireEvent.change(screen.getByLabelText('Address'), { target: { value: '123 Main St' } });
    fireEvent.change(screen.getByLabelText('Phone Number'), { target: { value: '1234567890' } });
    fireEvent.click(screen.getByRole('button', { name: /create account/i }));
    await waitFor(() => {
      expect(screen.getByText('Email already exists')).toBeInTheDocument();
      expect(mockNavigate).not.toHaveBeenCalled();
    });
  });

  it('handles signup failure (json error)', async () => {
    global.fetch.mockResolvedValue({
      ok: false,
      status: 400,
      headers: { get: () => 'application/json' },
      json: () => Promise.resolve({ message: 'JSON error' }),
    });
    render(
      <BrowserRouter>
        <Signup />
      </BrowserRouter>
    );
    fireEvent.change(screen.getByLabelText('First Name'), { target: { value: 'John' } });
    fireEvent.change(screen.getByLabelText('Last Name'), { target: { value: 'Doe' } });
    fireEvent.change(screen.getByLabelText('Email Address'), { target: { value: 'test@example.com' } });
    fireEvent.change(screen.getByLabelText('Password'), { target: { value: 'Password123!' } });
    fireEvent.change(screen.getByLabelText('Address'), { target: { value: '123 Main St' } });
    fireEvent.change(screen.getByLabelText('Phone Number'), { target: { value: '1234567890' } });
    fireEvent.click(screen.getByRole('button', { name: /create account/i }));
    await waitFor(() => {
      expect(screen.getByText('JSON error')).toBeInTheDocument();
      expect(mockNavigate).not.toHaveBeenCalled();
    });
  });

  it('handles signup network error', async () => {
    global.fetch.mockRejectedValue(new Error('Network error'));
    render(
      <BrowserRouter>
        <Signup />
      </BrowserRouter>
    );
    fireEvent.change(screen.getByLabelText('First Name'), { target: { value: 'John' } });
    fireEvent.change(screen.getByLabelText('Last Name'), { target: { value: 'Doe' } });
    fireEvent.change(screen.getByLabelText('Email Address'), { target: { value: 'test@example.com' } });
    fireEvent.change(screen.getByLabelText('Password'), { target: { value: 'Password123!' } });
    fireEvent.change(screen.getByLabelText('Address'), { target: { value: '123 Main St' } });
    fireEvent.change(screen.getByLabelText('Phone Number'), { target: { value: '1234567890' } });
    fireEvent.click(screen.getByRole('button', { name: /create account/i }));
    await waitFor(() => {
      expect(screen.findByText((_, node) => node.textContent.includes('Network error. Please try again.'))).resolves.toBeTruthy();
    });
  });

  it('toggles password visibility', async () => {
    render(
      <BrowserRouter>
        <Signup />
      </BrowserRouter>
    );
    const passwordInput = screen.getByLabelText('Password');
    expect(passwordInput).toHaveAttribute('type', 'password');
    // Find the toggle button by its icon (Eye/EyeOff) or by order (first button in password field)
    const allButtons = screen.getAllByRole('button');
    // The first button in the DOM is likely the Homeowner/Technician tab, so find the button next to the password input
    const toggleButton = allButtons.find(btn => btn.querySelector('svg'));
    fireEvent.click(toggleButton);
    expect(passwordInput).toHaveAttribute('type', 'text');
  });

  it('closes specialization dropdown on outside click', async () => {
    render(
      <BrowserRouter>
        <Signup />
      </BrowserRouter>
    );
    fireEvent.click(screen.getByText('Technician'));
    fireEvent.click(screen.getByText('Add specializations'));
    expect(screen.getByText('Refrigerator Service')).toBeInTheDocument();
    fireEvent.mouseDown(document.body);
    await waitFor(() => {
      expect(screen.queryByText('Refrigerator Service')).not.toBeInTheDocument();
    });
  });

  it('renders sign in link', () => {
    render(
      <BrowserRouter>
        <Signup />
      </BrowserRouter>
    );
    expect(screen.getByText('Sign in')).toBeInTheDocument();
  });

  it('shows error when technician submits with no specializations', async () => {
    render(
      <BrowserRouter>
        <Signup />
      </BrowserRouter>
    );
    fireEvent.click(screen.getByText('Technician'));
    // Do not select any specialization
    fireEvent.click(screen.getByRole('button', { name: /create account/i }));
    await waitFor(() => {
      expect(screen.getAllByText((_, node) => node.textContent && node.textContent.toLowerCase().includes('please select at least one specialization')).length).toBeGreaterThan(0);
    });
  });
});
