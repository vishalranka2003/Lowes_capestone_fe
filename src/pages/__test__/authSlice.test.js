import authReducer, { loginSuccess, logout } from '../../features/auth/authSlice';

// Mock localStorage
const mockLocalStorage = {
  getItem: jest.fn(),
  setItem: jest.fn(),
  removeItem: jest.fn()
};
Object.defineProperty(window, 'localStorage', { value: mockLocalStorage });

describe('authSlice', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('should return initial state', () => {
    mockLocalStorage.getItem.mockReturnValue(null);
    const initialState = {
      token: null,
      username: null,
      role: null
    };
    
    expect(authReducer(undefined, { type: 'unknown' })).toEqual(initialState);
  });

  test('should handle loginSuccess', () => {
    const previousState = {
      token: null,
      username: null,
      role: null
    };
    
    const loginData = {
      token: 'mock-token',
      username: 'johndoe',
      role: 'ROLE_HOMEOWNER'
    };
    
    const newState = authReducer(previousState, loginSuccess(loginData));
    
    expect(newState).toEqual(loginData);
    expect(mockLocalStorage.setItem).toHaveBeenCalledWith('token', 'mock-token');
    expect(mockLocalStorage.setItem).toHaveBeenCalledWith('username', 'johndoe');
    expect(mockLocalStorage.setItem).toHaveBeenCalledWith('role', 'ROLE_HOMEOWNER');
  });

  test('should handle logout', () => {
    const previousState = {
      token: 'mock-token',
      username: 'johndoe',
      role: 'ROLE_HOMEOWNER'
    };
    
    const newState = authReducer(previousState, logout());
    
    expect(newState).toEqual({
      token: null,
      username: null,
      role: null
    });
    expect(mockLocalStorage.removeItem).toHaveBeenCalledWith('token');
    expect(mockLocalStorage.removeItem).toHaveBeenCalledWith('username');
    expect(mockLocalStorage.removeItem).toHaveBeenCalledWith('role');
  });

  test('should initialize state from localStorage', () => {
    mockLocalStorage.getItem.mockImplementation((key) => {
      if (key === 'token') return 'stored-token';
      if (key === 'username') return 'stored-username';
      if (key === 'role') return 'ROLE_TECHNICIAN';
      return null;
    });
    
    // Re-import to test initialization
    jest.resetModules();
    const { default: freshAuthReducer } = require('../../../src/features/auth/authSlice');
    
    const initialState = freshAuthReducer(undefined, { type: 'unknown' });
    
    expect(initialState).toEqual({
      token: 'stored-token',
      username: 'stored-username',
      role: 'ROLE_TECHNICIAN'
    });
  });
});