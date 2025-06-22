import { createSlice } from '@reduxjs/toolkit';

const token = localStorage.getItem('token');
const username = localStorage.getItem('username');
const role = localStorage.getItem('role');

const authSlice = createSlice({
  name: 'auth',
  initialState: {
    token: token || null,
    username: username || null,
    role: role || null,
  },
  reducers: {
    loginSuccess: (state, action) => {
      state.token = action.payload.token;
      state.username = action.payload.username;
      state.role = action.payload.role;

      // ✅ Save to localStorage
      localStorage.setItem('token', action.payload.token);
      localStorage.setItem('username', action.payload.username);
      localStorage.setItem('role', action.payload.role);
    },
    logout: (state) => {
      state.token = null;
      state.username = null;
      state.role = null;

      // ✅ Clear localStorage
      localStorage.removeItem('token');
      localStorage.removeItem('username');
      localStorage.removeItem('role');
    },
  },
});

export const { loginSuccess, logout } = authSlice.actions;
export default authSlice.reducer;
