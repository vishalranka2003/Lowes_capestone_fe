import { configureStore } from '@reduxjs/toolkit';
import { store } from '../../app/store';
import authReducer from '../../features/auth/authSlice';

// Mock the authSlice to avoid dependency issues
jest.mock('../../features/auth/authSlice', () => ({
  __esModule: true,
  default: jest.fn((state = { token: null, user: null, isAuthenticated: false }, action) => {
    switch (action.type) {
      case 'auth/login':
        return { ...state, token: action.payload.token, isAuthenticated: true };
      case 'auth/logout':
        return { token: null, user: null, isAuthenticated: false };
      default:
        return state;
    }
  })
}));

describe('Redux Store', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('Store Configuration', () => {
    it('should create store with correct initial state', () => {
      expect(store).toBeDefined();
      expect(store.getState()).toEqual({
        auth: {
          token: null,
          user: null,
          isAuthenticated: false
        }
      });
    });

    it('should have auth reducer configured', () => {
      expect(store.getState().auth).toBeDefined();
      expect(typeof store.getState().auth).toBe('object');
    });
  });

  describe('Store Functionality', () => {
    it('should handle dispatching actions', () => {
      const action = {
        type: 'auth/login',
        payload: { token: 'test-token' }
      };

      store.dispatch(action);

      expect(store.getState().auth.token).toBe('test-token');
      expect(store.getState().auth.isAuthenticated).toBe(true);
    });

    it('should handle multiple state updates', () => {
      // Login action
      store.dispatch({
        type: 'auth/login',
        payload: { token: 'test-token' }
      });

      expect(store.getState().auth.isAuthenticated).toBe(true);

      // Logout action
      store.dispatch({ type: 'auth/logout' });

      expect(store.getState().auth.token).toBe(null);
      expect(store.getState().auth.isAuthenticated).toBe(false);
    });
  });

  describe('Store Creation', () => {
    it('should create a new store instance with same configuration', () => {
      const newStore = configureStore({
        reducer: { auth: authReducer }
      });

      expect(newStore).toBeDefined();
      expect(newStore.getState()).toEqual({
        auth: {
          token: null,
          user: null,
          isAuthenticated: false
        }
      });
    });
  });
});