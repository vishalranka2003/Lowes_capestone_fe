import { useSelector, useDispatch } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import { logout } from '../features/auth/authSlice';
import { Shield, User, LogOut } from 'lucide-react';
import '../styles/Navbar.css';

export const Navbar = () => {
  const { username } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.clear();
    dispatch(logout());
    navigate('/');
  };

  return (
    <nav className="navbar">
      <div className="navbar-container">
        {/* Brand Section */}
        <Link to="/" className="navbar-brand">
          <Shield className="brand-icon" />
          <span className="brand-text">WarrantyTracker</span>
        </Link>

        {/* Menu Section */}
        <div className="navbar-menu">
          {username ? (
            // If logged in
            <div className="user-section">
              <div className="user-greeting">
                <User className="user-icon" />
                <span className="username">Hello, {username}</span>
              </div>

              {/* 🚀 Dashboard Button */}
              <Link to="/dashboard" className="dashboard-button">
                Dashboard
              </Link>

              <button onClick={handleLogout} className="logout-button">
                <LogOut className="logout-icon" />
                Logout
              </button>
            </div>
          ) : (
            // If not logged in
            <div className="auth-links">
              <Link to="/login" className="auth-link login-link">
                Login
              </Link>
              <Link to="/signup" className="auth-link signup-link">
                Signup
              </Link>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
};
