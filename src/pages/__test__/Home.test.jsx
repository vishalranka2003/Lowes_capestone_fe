import React from 'react';
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { Home } from '../Home';

describe('Home', () => {
  

  it('Get Started button links to /signup', () => {
    render(
      <MemoryRouter>
        <Home />
      </MemoryRouter>
    );
    const getStarted = screen.getByRole('link', { name: /get started free/i });
    expect(getStarted).toHaveAttribute('href', '/signup');
  });

  it('renders the hero visual with image and product info', () => {
    render(
      <MemoryRouter>
        <Home />
      </MemoryRouter>
    );
    expect(screen.getByAltText(/modern tv/i)).toBeInTheDocument();
    expect(screen.getByText(/Apple iPhone 16 Pro/i)).toBeInTheDocument();
    expect(screen.getByText(/Active/i)).toBeInTheDocument();
    expect(screen.getByText(/Model:/i)).toBeInTheDocument();
    expect(screen.getByText(/Warranty Start:/i)).toBeInTheDocument();
    expect(screen.getByText(/Warranty Expires:/i)).toBeInTheDocument();
  });

  it('renders the features section heading and divider', () => {
    render(
      <MemoryRouter>
        <Home />
      </MemoryRouter>
    );
    expect(screen.getByRole('heading', { name: /why choose service pro/i })).toBeInTheDocument();
    // Divider is a styled div, so we check for its presence by class
    expect(document.querySelector('.w-24.h-1.bg-lowesBlue-500')).toBeInTheDocument();
  });

  it('renders all features with correct titles and descriptions', () => {
    render(
      <MemoryRouter>
        <Home />
      </MemoryRouter>
    );
    expect(screen.getByText(/warranty protection/i)).toBeInTheDocument();
    expect(screen.getByText(/never lose track of your appliance warranties/i)).toBeInTheDocument();
    expect(screen.getByText(/smart reminders/i)).toBeInTheDocument();
    expect(screen.getByText(/get notified before your warranties expire/i)).toBeInTheDocument();
    expect(screen.getByText(/easy service booking/i)).toBeInTheDocument();
    expect(screen.getByText(/schedule maintenance and repairs/i)).toBeInTheDocument();
    expect(screen.getByText(/expert support/i)).toBeInTheDocument();
    expect(screen.getByText(/access to verified professionals/i)).toBeInTheDocument();
  });
}); 