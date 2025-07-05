import React from 'react';
import { render, screen } from '@testing-library/react';
import { Provider } from 'react-redux';
import { BrowserRouter } from 'react-router-dom';
import { configureStore } from '@reduxjs/toolkit';
import { Login } from '../Login';
import authReducer from '../../features/auth/authSlice';

// Create a mock store for testing
const mockStore = configureStore({
    reducer: {
        auth: authReducer,
    },
});

// Test wrapper component with necessary providers
const TestWrapper = ({ children }) => (
    <Provider store={mockStore}>
        <BrowserRouter>
            {children}
        </BrowserRouter>
    </Provider>
);

describe('Login', () => {
    it('should render the login page', () => {
        render(
            <TestWrapper>
                <Login />
            </TestWrapper>
        );
        expect(screen.getByText('Sign In')).toBeInTheDocument();
    });
});