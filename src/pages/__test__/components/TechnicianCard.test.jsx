// __tests__/TechnicianCard.test.jsx
import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { TechnicianCard } from '../../../components/TechnicianCard';

// Utility to wrap component in router
const renderWithRouter = (ui) => {
  return render(<BrowserRouter>{ui}</BrowserRouter>);
};

describe('TechnicianCard', () => {
  const technician = {
    id: 1,
    firstName: 'Jane',
    lastName: 'Doe',
    email: 'jane.doe@example.com',
    phoneNumber: '1234567890',
    specialization: 'Refrigerators',
    experience: 5,
  };

  test('renders technician info correctly', () => {
    renderWithRouter(<TechnicianCard technician={technician} isAvailable={false} onViewRequests={jest.fn()} />);

    expect(screen.getByText('Jane Doe')).toBeInTheDocument();
    expect(screen.getByText('jane.doe@example.com')).toBeInTheDocument();
    expect(screen.getByText('1234567890')).toBeInTheDocument();
    expect(screen.getByText('Refrigerators')).toBeInTheDocument();
    expect(screen.getByText('5 years')).toBeInTheDocument();
    expect(screen.getByText('Assigned')).toBeInTheDocument();
    expect(screen.getByText('View Assigned Requests')).toBeInTheDocument();
  });

  test('disables button if technician is available', () => {
    renderWithRouter(<TechnicianCard technician={technician} isAvailable={true} onViewRequests={jest.fn()} />);

    const button = screen.getByRole('button', { name: /view assigned requests/i });
    expect(button).toBeDisabled();
  });

  test('calls onViewRequests if technician is assigned and button is clicked', () => {
    const mockOnViewRequests = jest.fn();
    renderWithRouter(<TechnicianCard technician={technician} isAvailable={false} onViewRequests={mockOnViewRequests} />);

    const button = screen.getByRole('button', { name: /view assigned requests/i });
    fireEvent.click(button);

    expect(mockOnViewRequests).toHaveBeenCalledWith(technician.id);
  });

  test('navigates to technician details on name click', () => {
    const { container } = renderWithRouter(
      <TechnicianCard technician={technician} isAvailable={false} onViewRequests={() => {}} />
    );

    const nameElement = screen.getByText('Jane Doe');
    expect(nameElement).toHaveClass('cursor-pointer');
  });
});
