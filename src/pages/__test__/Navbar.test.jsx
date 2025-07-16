// src/pages/__test__/Navbar.test.jsx
import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { Provider } from 'react-redux';
import { BrowserRouter } from 'react-router-dom';
import { configureStore } from '@reduxjs/toolkit';

// Mock localStorage BEFORE importing authSlice
const mockLocalStorage = {
  getItem: jest.fn(() => null),
  setItem: jest.fn(),
  removeItem: jest.fn(),
  clear: jest.fn(),
};

Object.defineProperty(window, 'localStorage', {
  value: mockLocalStorage,
  writable: true,
});

// Now import authSlice after localStorage is mocked
import authReducer, { logout } from '../../features/auth/authSlice';
import { Navbar } from '../../components/Navbar';

const mockNavigate = jest.fn();
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: () => mockNavigate
}));

const createMockStore = (authState) => {
  return configureStore({
    reducer: {
      auth: authReducer
    },
    preloadedState: {
      auth: authState
    }
  });
};

const MockProvider = ({ children, store }) => (
  <Provider store={store}>
    <BrowserRouter>{children}</BrowserRouter>
  </Provider>
);

describe('Navbar Component', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('renders brand logo and name', () => {
    const store = createMockStore({
      token: null,
      username: null,
      role: null
    });
    
    render(
      <MockProvider store={store}>
        <Navbar />
      </MockProvider>
    );
    
    expect(screen.getByText('Service Pro')).toBeInTheDocument();
    const brandLink = screen.getByText('Service Pro').closest('a');
    expect(brandLink).toHaveAttribute('href', '/');
  });

  test('shows login and signup buttons when not logged in', () => {
    const store = createMockStore({
      token: null,
      username: null,
      role: null
    });
    
    render(
      <MockProvider store={store}>
        <Navbar />
      </MockProvider>
    );
    
    expect(screen.getByText('Login')).toBeInTheDocument();
    expect(screen.getByText('Signup')).toBeInTheDocument();
  });

  test('shows user info and dashboard button when logged in', () => {
    const store = createMockStore({
      token: 'mock-token',
      username: 'johndoe',
      role: 'ROLE_HOMEOWNER'
    });
    
    render(
      <MockProvider store={store}>
        <Navbar />
      </MockProvider>
    );
    
    expect(screen.getByText('Hello, johndoe')).toBeInTheDocument();
    expect(screen.getByText('Dashboard')).toBeInTheDocument();
    expect(screen.getByText('Logout')).toBeInTheDocument();
  });

  test('handles logout correctly', () => {
    const store = createMockStore({
      token: 'mock-token',
      username: 'johndoe',
      role: 'ROLE_HOMEOWNER'
    });
    
    // Spy on store.dispatch to verify logout action is dispatched
    const dispatchSpy = jest.spyOn(store, 'dispatch');
    
    render(
      <MockProvider store={store}>
        <Navbar />
      </MockProvider>
    );
    
    fireEvent.click(screen.getByText('Logout'));
    
    // Verify localStorage.clear was called
    expect(mockLocalStorage.clear).toHaveBeenCalled();
    
    // Verify logout action was dispatched
    expect(dispatchSpy).toHaveBeenCalledWith(logout());
    
    // Verify navigation occurred
    expect(mockNavigate).toHaveBeenCalledWith('/');
  });

  test('login link has correct href', () => {
    const store = createMockStore({
      token: null,
      username: null,
      role: null
    });
    
    render(
      <MockProvider store={store}>
        <Navbar />
      </MockProvider>
    );
    
    const loginLink = screen.getByText('Login').closest('a');
    expect(loginLink).toHaveAttribute('href', '/login');
  });

  test('signup link has correct href', () => {
    const store = createMockStore({
      token: null,
      username: null,
      role: null
    });
    
    render(
      <MockProvider store={store}>
        <Navbar />
      </MockProvider>
    );
    
    const signupLink = screen.getByText('Signup').closest('a');
    expect(signupLink).toHaveAttribute('href', '/signup');
  });

  test('dashboard link has correct href', () => {
    const store = createMockStore({
      token: 'mock-token',
      username: 'johndoe',
      role: 'ROLE_HOMEOWNER'
    });
    
    render(
      <MockProvider store={store}>
        <Navbar />
      </MockProvider>
    );
    
    const dashboardLink = screen.getByText('Dashboard').closest('a');
    expect(dashboardLink).toHaveAttribute('href', '/dashboard');
  });
});