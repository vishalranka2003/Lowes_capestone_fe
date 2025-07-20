import { loginSuccess } from './authSlice';

const BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:8080'; // Fallback for local development
const API_URL = `${BASE_URL}/api/auth`;

// Role-based Login API
export const login = async (email, password, role) => {
  let endpoint = '/login/homeowner';
  if (role === 'ROLE_TECHNICIAN') endpoint = '/login/technician';
  if (role === 'ROLE_ADMIN') endpoint = '/login/admin';

  try {
    const res = await fetch(`${API_URL}${endpoint}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password })
    });

    if (!res.ok) {
      // If response is not OK, attempt to read it as plain text for the error message.
      // The backend now sends a String body for errors.
      const errorText = await res.text();
      return { error: true, status: res.status, message: errorText || 'Login failed. Unknown error.' };
    }

    // If response is OK, it should be JSON AuthResponse
    return res.json();
  } catch (err) {
    console.error("Login API call failed:", err);
    return { error: true, status: 500, message: 'Network error or server unreachable.' };
  }
};

// Role-based Signup API
export const signup = async (data) => {
  let endpoint = '/register/homeowner';
  if (data.role === 'ROLE_TECHNICIAN') {
    endpoint = '/register/technician';
  }

  try {
    const res = await fetch(`${API_URL}${endpoint}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });

    if (!res.ok) {
      const errorText = await res.text(); // Assuming error messages are plain text
      return { error: true, status: res.status, message: errorText || 'Registration failed. Unknown error.' };
    }

    return res.json(); // assuming your backend returns a success message
  } catch (err) {
    console.error("Signup API call failed:", err);
    return { error: true, status: 500, message: 'Network error or server unreachable.' };
  }
};

// New: API call to request password reset link
export const forgotPasswordRequest = async (email) => {
  try {
    // The backend expects a raw string email, not a JSON object
    const res = await fetch(`${API_URL}/forgot-password`, {
      method: 'POST',
      headers: { 'Content-Type': 'text/plain' }, // IMPORTANT: Set Content-Type to text/plain
      body: email // Send the email directly as the body
    });

    if (!res.ok) {
      // Backend might return a generic message even for non-existent emails for security
      const errorText = await res.text(); // Get raw text response
      return { error: true, status: res.status, message: errorText || 'Failed to send reset link.' };
    }

    return { success: true, message: await res.text() }; // Backend returns a string message
  } catch (err) {
    console.error("Forgot password request API call failed:", err);
    return { error: true, status: 500, message: 'Network error or server unreachable.' };
  }
};

// New: API call to confirm password reset with token and new password
export const resetPasswordConfirm = async (token, newPassword) => {
  try {
    const res = await fetch(`${API_URL}/reset-password`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ token, newPassword })
    });

    if (!res.ok) {
      const errorText = await res.text(); // Get raw text response
      return { error: true, status: res.status, message: errorText || 'Failed to reset password.' };
    }

    return { success: true, message: await res.text() }; // Backend returns a string message
  } catch (err) {
    console.error("Reset password confirmation API call failed:", err);
    return { error: true, status: 500, message: 'Network error or server unreachable.' };
  }
};