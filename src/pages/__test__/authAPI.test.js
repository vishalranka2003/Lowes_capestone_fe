// Mock fetch globally
global.fetch = jest.fn();

// Mock process.env before importing the module
const originalEnv = process.env;

beforeAll(() => {
  jest.resetModules();
  process.env = {
    ...originalEnv,
    REACT_APP_API_URL: 'http://localhost:3000',
  };
});

afterAll(() => {
  process.env = originalEnv;
});

// Import after setting env
import { login, signup } from '../../features/auth/authAPI';

describe('Auth API', () => {
  beforeEach(() => {
    fetch.mockClear();
  });

  afterEach(() => {
    jest.resetAllMocks();
  });

  // =================== ENVIRONMENT TESTS ===================
  
  test('handles missing API URL environment variable', async () => {
    // Temporarily remove the env var
    const originalApiUrl = process.env.REACT_APP_API_URL;
    delete process.env.REACT_APP_API_URL;
    
    // Re-import the module with missing env var
    jest.resetModules();
    const { login: loginWithoutEnv } = require('../../features/auth/authAPI');
    
    fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({ token: 'test' })
    });

    await loginWithoutEnv('test@example.com', 'password123', 'ROLE_HOMEOWNER');

    expect(fetch).toHaveBeenCalledWith('undefined/api/auth/login/homeowner', expect.any(Object));
    
    // Restore env var
    process.env.REACT_APP_API_URL = originalApiUrl;
  });

  // =================== LOGIN TESTS ===================

  test('returns user data when login is successful', async () => {
    const mockResponse = {
      token: 'abc123',
      username: 'Test User',
      role: 'ROLE_HOMEOWNER'
    };

    fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => mockResponse
    });

    const result = await login('test@example.com', 'password123', 'ROLE_HOMEOWNER');
    expect(result).toEqual(mockResponse);
  });

  test('makes correct API call for login', async () => {
    const mockResponse = {
      token: 'abc123',
      username: 'Test User',
      role: 'ROLE_HOMEOWNER'
    };

    fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => mockResponse
    });

    await login('test@example.com', 'password123', 'ROLE_HOMEOWNER');

    expect(fetch).toHaveBeenCalledWith('http://localhost:3000/api/auth/login/homeowner', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email: 'test@example.com',
        password: 'password123'
      }),
    });
  });

  test('returns error object when fetch fails with 401', async () => {
    fetch.mockResolvedValueOnce({
      ok: false,
      status: 401,
    });

    const result = await login('test@example.com', 'wrongpassword', 'ROLE_HOMEOWNER');
    expect(result).toEqual({ error: true, status: 401 });
  });

  test('returns error object when fetch fails with 404', async () => {
    fetch.mockResolvedValueOnce({
      ok: false,
      status: 404,
    });

    const result = await login('test@example.com', 'password123', 'ROLE_HOMEOWNER');
    expect(result).toEqual({ error: true, status: 404 });
  });

  test('returns error object when fetch fails with 500', async () => {
    fetch.mockResolvedValueOnce({
      ok: false,
      status: 500,
    });

    const result = await login('test@example.com', 'password123', 'ROLE_HOMEOWNER');
    expect(result).toEqual({ error: true, status: 500 });
  });

  test('handles network errors gracefully for login', async () => {
    fetch.mockRejectedValueOnce(new Error('Network error'));

    await expect(login('test@example.com', 'password123', 'ROLE_HOMEOWNER'))
      .rejects
      .toThrow('Network error');
  });

  test('handles JSON parsing errors in login', async () => {
    fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => {
        throw new Error('Invalid JSON');
      }
    });

    await expect(login('test@example.com', 'password123', 'ROLE_HOMEOWNER'))
      .rejects
      .toThrow('Invalid JSON');
  });

  // =================== SIGNUP TESTS ===================

  test('returns response data when signup is successful', async () => {
    const mockUserData = {
      email: 'new@example.com',
      password: 'password123',
      name: 'Test User',
      role: 'ROLE_HOMEOWNER'
    };

    const mockResponse = {
      message: 'Signup successful',
      userId: 123
    };

    fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => mockResponse
    });

    const result = await signup(mockUserData);
    expect(result).toEqual(mockResponse);
  });

  test('makes correct API call for signup', async () => {
    const mockUserData = {
      email: 'new@example.com',
      password: 'password123',
      name: 'Test User',
      role: 'ROLE_HOMEOWNER'
    };

    const mockResponse = {
      message: 'Signup successful',
      userId: 123
    };

    fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => mockResponse
    });

    await signup(mockUserData);

    expect(fetch).toHaveBeenCalledWith('http://localhost:3000/api/auth/register/homeowner', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email: 'new@example.com',
        password: 'password123',
        name: 'Test User',
        role: 'ROLE_HOMEOWNER'
      }),
    });
  });

  test('returns error object when signup fails with 400', async () => {
    const mockUserData = {
      email: 'invalid-email',
      password: '123',
      name: 'Test User',
      role: 'ROLE_HOMEOWNER',
    };

    fetch.mockResolvedValueOnce({
      ok: false,
      status: 400,
    });

    const result = await signup(mockUserData);
    expect(result).toEqual({ error: true, status: 400 });
  });

  test('returns error object when signup fails with 409 (conflict)', async () => {
    const mockUserData = {
      email: 'existing@example.com',
      password: 'password123',
      name: 'Test User',
      role: 'ROLE_HOMEOWNER',
    };

    fetch.mockResolvedValueOnce({
      ok: false,
      status: 409,
    });

    const result = await signup(mockUserData);
    expect(result).toEqual({ error: true, status: 409 });
  });

  test('returns error object when signup fails with 500', async () => {
    const mockUserData = {
      email: 'test@example.com',
      password: 'password123',
      name: 'Test User',
      role: 'ROLE_HOMEOWNER',
    };

    fetch.mockResolvedValueOnce({
      ok: false,
      status: 500,
    });

    const result = await signup(mockUserData);
    expect(result).toEqual({ error: true, status: 500 });
  });

  test('handles network errors gracefully for signup', async () => {
    const mockUserData = {
      email: 'test@example.com',
      password: 'password123',
      name: 'Test User',
      role: 'ROLE_HOMEOWNER',
    };

    fetch.mockRejectedValueOnce(new Error('Network error'));

    await expect(signup(mockUserData)).rejects.toThrow('Network error');
  });

  test('handles JSON parsing errors in signup', async () => {
    const mockUserData = {
      email: 'test@example.com',
      password: 'password123',
      name: 'Test User',
      role: 'ROLE_HOMEOWNER',
    };

    fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => {
        throw new Error('Invalid JSON');
      }
    });

    await expect(signup(mockUserData)).rejects.toThrow('Invalid JSON');
  });

  // =================== EDGE CASES ===================

  test('handles different role types in login', async () => {
    const mockResponse = {
      token: 'abc123',
      username: 'Admin User',
      role: 'ROLE_ADMIN'
    };

    fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => mockResponse
    });

    const result = await login('admin@example.com', 'password123', 'ROLE_ADMIN');
    expect(result).toEqual(mockResponse);
    expect(fetch).toHaveBeenCalledWith('http://localhost:3000/api/auth/login/admin', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email: 'admin@example.com',
        password: 'password123'
      }),
    });
  });

  test('handles different role types in signup', async () => {
    const mockUserData = {
      email: 'tech@example.com',
      password: 'password123',
      name: 'Tech User',
      role: 'ROLE_TECHNICIAN'
    };

    const mockResponse = {
      message: 'Signup successful',
      userId: 456
    };

    fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => mockResponse
    });

    const result = await signup(mockUserData);
    expect(result).toEqual(mockResponse);
    expect(fetch).toHaveBeenCalledWith('http://localhost:3000/api/auth/register/technician', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email: 'tech@example.com',
        password: 'password123',
        name: 'Tech User',
        role: 'ROLE_TECHNICIAN'
      }),
    });
  });

  test('handles empty response body gracefully', async () => {
    fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => null
    });

    const result = await login('test@example.com', 'password123', 'ROLE_HOMEOWNER');
    expect(result).toBeNull();
  });

  test('handles undefined response gracefully', async () => {
    fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => undefined
    });

    const result = await signup({
      email: 'test@example.com',
      password: 'password123',
      name: 'Test User',
      role: 'ROLE_HOMEOWNER'
    });
    expect(result).toBeUndefined();
  });
});