import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import { logout } from '../features/auth/authSlice';
import { Shield, User, LogOut } from 'lucide-react';

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
    <nav className="bg-white shadow-sm border-b border-gray-100 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Brand Section */}
          <Link to="/" className="flex items-center space-x-2 text-blue-600 hover:text-blue-700 transition-colors">
            <Shield className="h-8 w-8" />
            <span className="text-xl font-semibold text-gray-900">Service Pro</span>
          </Link>

          {/* Menu Section */}
          <div className="flex items-center space-x-6">
            {username ? (
              // If logged in
              <div className="flex items-center space-x-4">
                <div className="flex items-center space-x-2 text-gray-600">
                  <User className="h-5 w-5 text-blue-600" />
                  <span className="font-medium">Hello, {username}</span>
                </div>

                {/* Dashboard Button */}
                <Link 
                  to="/dashboard" 
                  className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium transition-colors duration-200"
                >
                  Dashboard
                </Link>

                <button 
                  onClick={handleLogout} 
                  className="flex items-center space-x-2 px-3 py-2 text-gray-600 hover:text-gray-800 hover:bg-gray-50 rounded-lg transition-colors duration-200"
                >
                  <LogOut className="h-4 w-4" />
                  <span>Logout</span>
                </button>
              </div>
            ) : (
              // If not logged in
              <div className="flex items-center space-x-3">
                <Link 
                  to="/login" 
                  className="text-blue-600 hover:text-blue-700 font-medium px-4 py-2 rounded-lg border border-blue-600 hover:bg-blue-50 transition-colors duration-200"
                >
                  Login
                </Link>
                <Link 
                  to="/signup" 
                  className="bg-blue-600 hover:bg-blue-700 text-white font-medium px-4 py-2 rounded-lg transition-colors duration-200"
                >
                  Signup
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};
