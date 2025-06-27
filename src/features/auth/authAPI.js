const BASE_URL = process.env.REACT_APP_API_URL;
const API_URL = `${BASE_URL}/api/auth`;

// Role-based Login API
export const login = async (email, password, role) => {
  let endpoint = '/login/homeowner';
  if (role === 'ROLE_TECHNICIAN') endpoint = '/login/technician';
  if (role === 'ROLE_ADMIN') endpoint = '/login/admin';

  const res = await fetch(`${API_URL}${endpoint}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password })
  });

  if (!res.ok) {
    return { error: true, status: res.status };
  }

  return res.json(); // Only if res.ok is true
};

// Role-based Signup API
export const signup = async (data) => {
  let endpoint = '/register/homeowner';
  if (data.role === 'ROLE_TECHNICIAN') {
    endpoint = '/register/technician';
  }

  const res = await fetch(`${API_URL}${endpoint}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data)
  });

  if (!res.ok) {
    return { error: true, status: res.status };
  }

  return res.json(); // assuming your backend returns a success message
};
