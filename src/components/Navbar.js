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
    <nav className="bg-white shadow-lg border-b border-gray-200 sticky top-0 z-50">
      <div className="max-w-8xl mx-auto px-6 sm:px-8 lg:px-12">
        <div className="flex justify-between items-center h-20">
          {/* Brand Section */}
          <Link to="/" className="flex items-center space-x-3 text-blue-600 hover:text-blue-700 transition-colors duration-200">
            <Shield className="h-10 w-10" />
            <span className="text-2xl font-bold text-gray-900">Service Pro</span>
          </Link>

          {/* Menu Section */}
          <div className="flex items-center space-x-8">
            {username ? (
              // If logged in
              <div className="flex items-center space-x-6">
                <div className="flex items-center space-x-3 text-gray-600">
                  <User className="h-6 w-6 text-blue-600" />
                  <span className="text-lg font-medium">Hello, {username}</span>
                </div>

                {/* Dashboard Button */}
                <Link 
                  to="/dashboard" 
                  className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-3 rounded-lg font-medium text-lg transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                >
                  Dashboard
                </Link>

                <button 
                  onClick={handleLogout} 
                  className="flex items-center space-x-3 px-5 py-3 text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-lg text-lg font-medium transition-colors duration-200"
                >
                  <LogOut className="h-6 w-6" />
                  <span>Logout</span>
                </button>
              </div>
            ) : (
              // If not logged in
              <div className="flex items-center space-x-4">
                <Link 
                  to="/login" 
                  className="text-blue-600 hover:text-blue-700 font-medium px-5 py-3 rounded-lg border border-blue-600 hover:bg-blue-50 text-lg transition-colors duration-200"
                >
                  Sign in
                </Link>
                <Link 
                  to="/signup" 
                  className="bg-blue-600 hover:bg-blue-700 text-white font-medium px-5 py-3 rounded-lg text-lg transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                >
                  Sign up
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};