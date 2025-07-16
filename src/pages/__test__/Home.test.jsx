import React from 'react';
import { render, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { Home } from '../Home';

// Mock router
const MockRouter = ({ children }) => (
  <BrowserRouter>{children}</BrowserRouter>
);

describe('Home Component', () => {
  test('renders main heading correctly', () => {
    render(
      <MockRouter>
        <Home />
      </MockRouter>
    );
    
    expect(screen.getByText('Welcome to')).toBeInTheDocument();
    expect(screen.getByText('Service Pro')).toBeInTheDocument();
  });

  test('renders hero description', () => {
    render(
      <MockRouter>
        <Home />
      </MockRouter>
    );
    
    expect(screen.getByText(/Track your appliances, manage service requests/)).toBeInTheDocument();
  });

  test('renders Get Started Free button with correct link', () => {
    render(
      <MockRouter>
        <Home />
      </MockRouter>
    );
    
    const getStartedButton = screen.getByRole('link', { name: /get started free/i });
    expect(getStartedButton).toBeInTheDocument();
    expect(getStartedButton).toHaveAttribute('href', '/signup');
  });

  test('renders all feature cards', () => {
    render(
      <MockRouter>
        <Home />
      </MockRouter>
    );
    
    expect(screen.getByText('Warranty Protection')).toBeInTheDocument();
    expect(screen.getByText('Smart Reminders')).toBeInTheDocument();
    expect(screen.getByText('Easy Service Booking')).toBeInTheDocument();
    expect(screen.getByText('Expert Support')).toBeInTheDocument();
  });

  test('renders feature descriptions', () => {
    render(
      <MockRouter>
        <Home />
      </MockRouter>
    );
    
    expect(screen.getByText(/Never lose track of your appliance warranties/)).toBeInTheDocument();
    expect(screen.getByText(/Get notified before your warranties expire/)).toBeInTheDocument();
    expect(screen.getByText(/Schedule maintenance and repairs/)).toBeInTheDocument();
    expect(screen.getByText(/Access to verified professionals/)).toBeInTheDocument();
  });

  test('renders hero visual with appliance example', () => {
    render(
      <MockRouter>
        <Home />
      </MockRouter>
    );
    
    expect(screen.getByText('Samsung Refrigerator')).toBeInTheDocument();
    expect(screen.getByText('Warranty expires in 45 days')).toBeInTheDocument();
    expect(screen.getByText('Active')).toBeInTheDocument();
  });

  test('renders Why Choose Service Pro section', () => {
    render(
      <MockRouter>
        <Home />
      </MockRouter>
    );
    
    expect(screen.getByText('Why Choose Service Pro?')).toBeInTheDocument();
  });
});