import * as authAPI from '../../features/auth/authAPI';

describe('authAPI', () => {
  beforeEach(() => {
    global.fetch = jest.fn();
    jest.spyOn(console, 'error').mockImplementation(() => {});
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  describe('login', () => {
    it('should handle successful login for homeowner', async () => {
      global.fetch.mockResolvedValue({
        ok: true,
        json: () => Promise.resolve({ token: 'mock-token', username: 'testuser', role: 'ROLE_HOMEOWNER' }),
      });
      const result = await authAPI.login('test@example.com', 'password', 'ROLE_HOMEOWNER');
      expect(fetch).toHaveBeenCalledWith(
        expect.stringContaining('/login/homeowner'),
        expect.any(Object)
      );
      expect(result).toEqual({ token: 'mock-token', username: 'testuser', role: 'ROLE_HOMEOWNER' });
    });

    it('should handle successful login for technician', async () => {
      global.fetch.mockResolvedValue({
        ok: true,
        json: () => Promise.resolve({ token: 'mock-token', username: 'tech', role: 'ROLE_TECHNICIAN' }),
      });
      const result = await authAPI.login('tech@example.com', 'password', 'ROLE_TECHNICIAN');
      expect(fetch).toHaveBeenCalledWith(
        expect.stringContaining('/login/technician'),
        expect.any(Object)
      );
      expect(result).toEqual({ token: 'mock-token', username: 'tech', role: 'ROLE_TECHNICIAN' });
    });

    it('should handle successful login for admin', async () => {
      global.fetch.mockResolvedValue({
        ok: true,
        json: () => Promise.resolve({ token: 'mock-token', username: 'admin', role: 'ROLE_ADMIN' }),
      });
      const result = await authAPI.login('admin@example.com', 'password', 'ROLE_ADMIN');
      expect(fetch).toHaveBeenCalledWith(
        expect.stringContaining('/login/admin'),
        expect.any(Object)
      );
      expect(result).toEqual({ token: 'mock-token', username: 'admin', role: 'ROLE_ADMIN' });
    });

    it('should fallback to homeowner endpoint for unknown role', async () => {
      global.fetch.mockResolvedValue({
        ok: true,
        json: () => Promise.resolve({ token: 'mock-token', username: 'unknown', role: 'ROLE_UNKNOWN' }),
      });
      const result = await authAPI.login('unknown@example.com', 'password', 'ROLE_UNKNOWN');
      expect(fetch).toHaveBeenCalledWith(
        expect.stringContaining('/login/homeowner'),
        expect.any(Object)
      );
      expect(result).toEqual({ token: 'mock-token', username: 'unknown', role: 'ROLE_UNKNOWN' });
    });

    it('should handle login failure with error message', async () => {
      global.fetch.mockResolvedValue({
        ok: false,
        status: 401,
        text: () => Promise.resolve('Invalid credentials'),
      });
      const result = await authAPI.login('test@example.com', 'wrong', 'ROLE_HOMEOWNER');
      expect(result).toEqual({ error: true, status: 401, message: 'Invalid credentials' });
    });

    it('should handle login failure with empty error message', async () => {
      global.fetch.mockResolvedValue({
        ok: false,
        status: 500,
        text: () => Promise.resolve(''),
      });
      const result = await authAPI.login('test@example.com', 'password', 'ROLE_HOMEOWNER');
      expect(result).toEqual({ error: true, status: 500, message: 'Login failed. Unknown error.' });
    });

    it('should handle network error', async () => {
      global.fetch.mockRejectedValue(new Error('Network error'));
      const result = await authAPI.login('test@example.com', 'password', 'ROLE_HOMEOWNER');
      expect(console.error).toHaveBeenCalled();
      expect(result).toEqual({ error: true, status: 500, message: 'Network error or server unreachable.' });
    });
  });

  describe('signup', () => {
    it('should handle successful homeowner signup', async () => {
      global.fetch.mockResolvedValue({
        ok: true,
        json: () => Promise.resolve({ message: 'Registration successful' }),
      });
      const data = {
        role: 'ROLE_HOMEOWNER',
        email: 'test@example.com',
        password: 'Password123!',
        firstName: 'John',
        lastName: 'Doe',
        address: '123 Main St',
        phoneNumber: '1234567890',
      };
      const result = await authAPI.signup(data);
      expect(fetch).toHaveBeenCalledWith(
        expect.stringContaining('/register/homeowner'),
        expect.any(Object)
      );
      expect(result).toEqual({ message: 'Registration successful' });
    });

    it('should handle successful technician signup', async () => {
      global.fetch.mockResolvedValue({
        ok: true,
        json: () => Promise.resolve({ message: 'Registration successful' }),
      });
      const data = {
        role: 'ROLE_TECHNICIAN',
        email: 'tech@example.com',
        password: 'Password123!',
        firstName: 'Jane',
        lastName: 'Doe',
        phoneNumber: '1234567890',
        specialization: ['refrigerator', 'hvac'],
        experience: '5',
      };
      const result = await authAPI.signup(data);
      expect(fetch).toHaveBeenCalledWith(
        expect.stringContaining('/register/technician'),
        expect.objectContaining({
          body: JSON.stringify(data),
        })
      );
      expect(result).toEqual({ message: 'Registration successful' });
    });

    it('should fallback to homeowner endpoint for unknown role', async () => {
      global.fetch.mockResolvedValue({
        ok: true,
        json: () => Promise.resolve({ message: 'Registration successful' }),
      });
      const data = {
        role: 'ROLE_UNKNOWN',
        email: 'unknown@example.com',
        password: 'Password123!',
      };
      const result = await authAPI.signup(data);
      expect(fetch).toHaveBeenCalledWith(
        expect.stringContaining('/register/homeowner'),
        expect.any(Object)
      );
      expect(result).toEqual({ message: 'Registration successful' });
    });

    it('should handle signup failure with error message', async () => {
      global.fetch.mockResolvedValue({
        ok: false,
        status: 400,
        text: () => Promise.resolve('Email already exists'),
      });
      const result = await authAPI.signup({ role: 'ROLE_HOMEOWNER', email: 'test@example.com' });
      expect(result).toEqual({ error: true, status: 400, message: 'Email already exists' });
    });

    it('should handle signup failure with empty error message', async () => {
      global.fetch.mockResolvedValue({
        ok: false,
        status: 500,
        text: () => Promise.resolve(''),
      });
      const result = await authAPI.signup({ role: 'ROLE_HOMEOWNER', email: 'test@example.com' });
      expect(result).toEqual({ error: true, status: 500, message: 'Registration failed. Unknown error.' });
    });

    it('should handle network error', async () => {
      global.fetch.mockRejectedValue(new Error('Network error'));
      const result = await authAPI.signup({ role: 'ROLE_HOMEOWNER' });
      expect(console.error).toHaveBeenCalled();
      expect(result).toEqual({ error: true, status: 500, message: 'Network error or server unreachable.' });
    });
  });

  describe('forgotPasswordRequest', () => {
    it('should handle successful forgot password request', async () => {
      global.fetch.mockResolvedValue({
        ok: true,
        text: () => Promise.resolve('Reset link sent'),
      });
      const result = await authAPI.forgotPasswordRequest('test@example.com');
      expect(fetch).toHaveBeenCalledWith(
        expect.stringContaining('/forgot-password'),
        expect.objectContaining({
          method: 'POST',
          headers: { 'Content-Type': 'text/plain' },
          body: 'test@example.com',
        })
      );
      expect(result).toEqual({ success: true, message: 'Reset link sent' });
    });

    it('should handle forgot password failure with error message', async () => {
      global.fetch.mockResolvedValue({
        ok: false,
        status: 400,
        text: () => Promise.resolve('Invalid email'),
      });
      const result = await authAPI.forgotPasswordRequest('invalid@example.com');
      expect(result).toEqual({ error: true, status: 400, message: 'Invalid email' });
    });

    it('should handle forgot password failure with empty error message', async () => {
      global.fetch.mockResolvedValue({
        ok: false,
        status: 500,
        text: () => Promise.resolve(''),
      });
      const result = await authAPI.forgotPasswordRequest('test@example.com');
      expect(result).toEqual({ error: true, status: 500, message: 'Failed to send reset link.' });
    });

    it('should handle network error', async () => {
      global.fetch.mockRejectedValue(new Error('Network error'));
      const result = await authAPI.forgotPasswordRequest('test@example.com');
      expect(console.error).toHaveBeenCalled();
      expect(result).toEqual({ error: true, status: 500, message: 'Network error or server unreachable.' });
    });
  });

  describe('resetPasswordConfirm', () => {
    it('should handle successful password reset', async () => {
      global.fetch.mockResolvedValue({
        ok: true,
        text: () => Promise.resolve('Password reset successful'),
      });
      const result = await authAPI.resetPasswordConfirm('mock-token', 'NewPassword123!');
      expect(fetch).toHaveBeenCalledWith(
        expect.stringContaining('/reset-password'),
        expect.any(Object)
      );
      expect(result).toEqual({ success: true, message: 'Password reset successful' });
    });

    it('should handle password reset failure with error message', async () => {
      global.fetch.mockResolvedValue({
        ok: false,
        status: 400,
        text: () => Promise.resolve('Invalid or expired token'),
      });
      const result = await authAPI.resetPasswordConfirm('invalid-token', 'NewPassword123!');
      expect(result).toEqual({ error: true, status: 400, message: 'Invalid or expired token' });
    });

    it('should handle password reset failure with empty error message', async () => {
      global.fetch.mockResolvedValue({
        ok: false,
        status: 500,
        text: () => Promise.resolve(''),
      });
      const result = await authAPI.resetPasswordConfirm('mock-token', 'NewPassword123!');
      expect(result).toEqual({ error: true, status: 500, message: 'Failed to reset password.' });
    });

    it('should handle network error', async () => {
      global.fetch.mockRejectedValue(new Error('Network error'));
      const result = await authAPI.resetPasswordConfirm('mock-token', 'NewPassword123!');
      expect(console.error).toHaveBeenCalled();
      expect(result).toEqual({ error: true, status: 500, message: 'Network error or server unreachable.' });
    });
  });
});
