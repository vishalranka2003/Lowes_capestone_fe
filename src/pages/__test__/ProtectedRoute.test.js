import React from 'react';
import { render, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import { act } from 'react';
import { ProtectedRoute } from '../../components/ProtectedRoute';

// Mock Navigate component
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  Navigate: jest.fn(({ to, replace }) => (
    <div data-testid="navigate" data-to={to} data-replace={replace}>
      Navigate to {to}
    </div>
  ))
}));

// Mock auth reducer
const mockAuthReducer = (state = { token: null, role: null }, action) => {
  switch (action.type) {
    case 'SET_AUTH':
      return action.payload;
    default:
      return state;
  }
};

// Helper function to create mock store
const createMockStore = (authState) => {
  return configureStore({
    reducer: {
      auth: mockAuthReducer
    },
    preloadedState: {
      auth: authState
    }
  });
};

// Test wrapper component
const TestWrapper = ({ children, authState }) => {
  const store = createMockStore(authState);
  return (
    <Provider store={store}>
      <BrowserRouter>
        {children}
      </BrowserRouter>
    </Provider>
  );
};

describe('ProtectedRoute', () => {
  const MockChildComponent = () => <div data-testid="protected-content">Protected Content</div>;

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('Access Control', () => {
    it('should render children when user has valid token and allowed role', () => {
      const authState = {
        token: 'valid-token',
        role: 'ROLE_HOMEOWNER'
      };

      render(
        <TestWrapper authState={authState}>
          <ProtectedRoute allowedRoles={['ROLE_HOMEOWNER']}>
            <MockChildComponent />
          </ProtectedRoute>
        </TestWrapper>
      );

      expect(screen.getByTestId('protected-content')).toBeInTheDocument();
      expect(screen.queryByTestId('navigate')).not.toBeInTheDocument();
    });
  });

  describe('Redirect to Login', () => {
    it('should redirect to login when user has no token', () => {
      const authState = {
        token: null,
        role: 'ROLE_HOMEOWNER'
      };

      render(
        <TestWrapper authState={authState}>
          <ProtectedRoute allowedRoles={['ROLE_HOMEOWNER']}>
            <MockChildComponent />
          </ProtectedRoute>
        </TestWrapper>
      );

      expect(screen.getByTestId('navigate')).toBeInTheDocument();
      expect(screen.getByTestId('navigate')).toHaveAttribute('data-to', '/login');
      expect(screen.getByTestId('navigate')).toHaveAttribute('data-replace', 'true');
      expect(screen.queryByTestId('protected-content')).not.toBeInTheDocument();
    });

    it('should redirect to login when user has token but role is not allowed', () => {
      const authState = {
        token: 'valid-token',
        role: 'ROLE_HOMEOWNER'
      };

      render(
        <TestWrapper authState={authState}>
          <ProtectedRoute allowedRoles={['ROLE_ADMIN']}>
            <MockChildComponent />
          </ProtectedRoute>
        </TestWrapper>
      );

      expect(screen.getByTestId('navigate')).toBeInTheDocument();
      expect(screen.getByTestId('navigate')).toHaveAttribute('data-to', '/login');
      expect(screen.getByTestId('navigate')).toHaveAttribute('data-replace', 'true');
      expect(screen.queryByTestId('protected-content')).not.toBeInTheDocument();
    });
  });

  describe('Edge Cases', () => {
    it('should handle empty allowedRoles array', () => {
      const authState = {
        token: 'valid-token',
        role: 'ROLE_HOMEOWNER'
      };

      render(
        <TestWrapper authState={authState}>
          <ProtectedRoute allowedRoles={[]}>
            <MockChildComponent />
          </ProtectedRoute>
        </TestWrapper>
      );

      expect(screen.getByTestId('navigate')).toBeInTheDocument();
      expect(screen.getByTestId('navigate')).toHaveAttribute('data-to', '/login');
      expect(screen.getByTestId('navigate')).toHaveAttribute('data-replace', 'true');
      expect(screen.queryByTestId('protected-content')).not.toBeInTheDocument();
    });
  });

  describe('Children Rendering', () => {
    it('should render children when access is granted', () => {
      const authState = {
        token: 'valid-token',
        role: 'ROLE_HOMEOWNER'
      };

      render(
        <TestWrapper authState={authState}>
          <ProtectedRoute allowedRoles={['ROLE_HOMEOWNER']}>
            <div data-testid="child-1">Child 1</div>
            <div data-testid="child-2">Child 2</div>
          </ProtectedRoute>
        </TestWrapper>
      );

      expect(screen.getByTestId('child-1')).toBeInTheDocument();
      expect(screen.getByTestId('child-2')).toBeInTheDocument();
      expect(screen.queryByTestId('navigate')).not.toBeInTheDocument();
    });
  });

  describe('Redux Integration', () => {
    it('should handle store updates correctly', async () => {
      const initialAuthState = {
        token: null,
        role: null
      };

      const store = createMockStore(initialAuthState);

      const { rerender } = render(
        <Provider store={store}>
          <BrowserRouter>
            <ProtectedRoute allowedRoles={['ROLE_HOMEOWNER']}>
              <MockChildComponent />
            </ProtectedRoute>
          </BrowserRouter>
        </Provider>
      );

      // Initially should redirect
      expect(screen.getByTestId('navigate')).toBeInTheDocument();
      expect(screen.queryByTestId('protected-content')).not.toBeInTheDocument();

      // Update store - WRAP IN ACT
      await act(async () => {
        store.dispatch({
          type: 'SET_AUTH',
          payload: {
            token: 'new-token',
            role: 'ROLE_HOMEOWNER'
          }
        });
      });

      // Rerender with updated store - WRAP IN ACT
      await act(async () => {
        rerender(
          <Provider store={store}>
            <BrowserRouter>
              <ProtectedRoute allowedRoles={['ROLE_HOMEOWNER']}>
                <MockChildComponent />
              </ProtectedRoute>
            </BrowserRouter>
          </Provider>
        );
      });

      // Should now show content
      expect(screen.getByTestId('protected-content')).toBeInTheDocument();
      expect(screen.queryByTestId('navigate')).not.toBeInTheDocument();
    });
  });
});