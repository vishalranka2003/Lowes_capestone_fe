import React from 'react';
import { render } from '@testing-library/react';
import { Provider } from 'react-redux';
import { BrowserRouter } from 'react-router-dom';
import { configureStore } from '@reduxjs/toolkit';
import authReducer from '../../features/auth/authSlice';
import { Dashboard } from '../Dashboard';

const mockNavigate = jest.fn();
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  Navigate: ({ to, replace }) => {
    mockNavigate(to, replace);
    return <div data-testid="navigate" data-to={to} data-replace={replace} />;
  }
}));

const createMockStore = (role) => {
  return configureStore({
    reducer: {
      auth: authReducer
    },
    preloadedState: {
      auth: {
        token: 'mock-token',
        username: 'mockuser',
        role: role
      }
    }
  });
};

const MockProvider = ({ children, store }) => (
  <Provider store={store}>
    <BrowserRouter>{children}</BrowserRouter>
  </Provider>
);

describe('Dashboard Component', () => {
  beforeEach(() => {
    mockNavigate.mockClear();
  });

  test('redirects to homeowner dashboard when role is ROLE_HOMEOWNER', () => {
    const store = createMockStore('ROLE_HOMEOWNER');
    
    render(
      <MockProvider store={store}>
        <Dashboard />
      </MockProvider>
    );
    
    const navigate = document.querySelector('[data-testid="navigate"]');
    expect(navigate).toHaveAttribute('data-to', '/dashboard/homeowner');
    expect(navigate).toHaveAttribute('data-replace', 'true');
  });

  test('redirects to technician dashboard when role is ROLE_TECHNICIAN', () => {
    const store = createMockStore('ROLE_TECHNICIAN');
    
    render(
      <MockProvider store={store}>
        <Dashboard />
      </MockProvider>
    );
    
    const navigate = document.querySelector('[data-testid="navigate"]');
    expect(navigate).toHaveAttribute('data-to', '/dashboard/technician');
    expect(navigate).toHaveAttribute('data-replace', 'true');
  });

  test('redirects to admin dashboard when role is ROLE_ADMIN', () => {
    const store = createMockStore('ROLE_ADMIN');
    
    render(
      <MockProvider store={store}>
        <Dashboard />
      </MockProvider>
    );
    
    const navigate = document.querySelector('[data-testid="navigate"]');
    expect(navigate).toHaveAttribute('data-to', '/dashboard/admin');
    expect(navigate).toHaveAttribute('data-replace', 'true');
  });

  test('redirects to home when role is unknown', () => {
    const store = createMockStore('UNKNOWN_ROLE');
    
    render(
      <MockProvider store={store}>
        <Dashboard />
      </MockProvider>
    );
    
    const navigate = document.querySelector('[data-testid="navigate"]');
    expect(navigate).toHaveAttribute('data-to', '/');
    expect(navigate).toHaveAttribute('data-replace', 'true');
  });
});