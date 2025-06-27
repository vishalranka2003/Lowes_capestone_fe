import { useState } from 'react';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { login } from '../features/auth/authAPI';
import { loginSuccess } from '../features/auth/authSlice';
import '../styles/Login.css'; // ✅ Import the CSS

export const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('ROLE_HOMEOWNER');
  const [error, setError] = useState('');

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleLogin = async () => {
    try {
      const res = await login(email, password, role);
      if (!res || res.error || !res.token) {
        setError('Login failed. Check your role or credentials.');
        return;
      }
      dispatch(loginSuccess({
        token: res.token,
        username: res.username,
        role: res.role,
      }));
      navigate('/dashboard');
    } catch (err) {
      console.error(err);
      setError('Something went wrong. Please try again later.');
    }
  };

  return (
    <div className="login-wrapper">
      <div className="login-card">
        <h1 className="brand-title">🔵 WarrantyWise</h1>
        <h2 className="welcome-msg">Welcome Back</h2>
        <p className="instruction-text">Sign in to your account</p>

        <div className="role-tabs">
          <button className={role === 'ROLE_HOMEOWNER' ? 'active' : ''} onClick={() => setRole('ROLE_HOMEOWNER')}>Homeowner</button>
          <button className={role === 'ROLE_TECHNICIAN' ? 'active' : ''} onClick={() => setRole('ROLE_TECHNICIAN')}>Technician</button>
          <button className={role === 'ROLE_ADMIN' ? 'active' : ''} onClick={() => setRole('ROLE_ADMIN')}>Admin</button>
        </div>

        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Enter your email"
          className="input-field"
        />
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Enter your password"
          className="input-field"
        />

        <div className="options-row">
          <label><input type="checkbox" /> Remember me</label>
          <a href="#">Forgot password?</a>
        </div>

        <button onClick={handleLogin} className="login-btn">Sign In</button>
        {error && <p className="error-text">{error}</p>}

        <p className="signup-redirect">
          Don't have an account? <a href="/signup">Sign up</a>
        </p>
      </div>
    </div>
  );
};
