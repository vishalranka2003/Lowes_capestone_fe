import React from 'react';
import { Outlet, NavLink, useNavigate } from 'react-router-dom';
import { Home, Package, Wrench, LogOut } from 'lucide-react';
import { useDispatch } from 'react-redux';
import { logout } from '../features/auth/authSlice';

export const HomeownerDashboard = () => {
  const navigate = useNavigate();
  
  // Get user data from localStorage
  const username = localStorage.getItem('username') || 'User';
  const role = localStorage.getItem('role') || 'Homeowner';
  const dispatch = useDispatch();
  
  const handleLogout = () => {
    localStorage.clear();
    dispatch(logout());
    navigate('/');
  };

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Sidebar */}
      <aside className="w-64 bg-white shadow-lg border-r border-gray-200 flex flex-col justify-between">
        <div>
          <div className="p-6">
            <div className="flex items-center space-x-2 mb-8">
              <Home className="h-8 w-8 text-blue-600" />
              <h2 className="text-xl font-bold text-gray-900">Service Pro</h2>
            </div>
            <h3 className="text-sm font-medium text-gray-500 uppercase tracking-wider mb-4">Homeowner Panel</h3>
          </div>
          
          <nav className="px-4">
            <NavLink 
              to="/dashboard/homeowner" 
              end 
              className={({ isActive }) => 
                `flex items-center space-x-3 px-4 py-3 rounded-lg mb-2 transition-colors duration-200 ${
                  isActive 
                    ? 'bg-blue-50 text-blue-700 border-r-2 border-blue-600' 
                    : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                }`
              }
            >
              <Package className="h-5 w-5" />
              <span className="font-medium">My Appliances</span>
            </NavLink>

            
            <NavLink 
              to="/dashboard/homeowner/service-requests" 
              className={({ isActive }) => 
                `flex items-center space-x-3 px-4 py-3 rounded-lg mb-2 transition-colors duration-200 ${
                  isActive 
                    ? 'bg-blue-50 text-blue-700 border-r-2 border-blue-600' 
                    : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                }`
              }
            >
              <Wrench className="h-5 w-5" />
              <span className="font-medium">Service Requests</span>
            </NavLink>
            
          </nav>
        </div>
        
        {/* User Info at bottom */}
        <div className="p-6 border-t border-gray-100">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-bold text-lg">
              {username.charAt(0).toUpperCase()}
            </div>
            <div>
              <div className="text-sm font-semibold text-gray-900">{username}</div>
              <div className="text-xs text-gray-500">{role}</div>
            </div>
          </div>
          <button 
            onClick={handleLogout}
            className="mt-4 w-full px-3 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg text-sm font-medium transition-colors flex items-center justify-center gap-2"
          >
            <LogOut className="h-4 w-4" />
            Logout
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col overflow-hidden">
        <div className="flex-1 overflow-auto">
          <Outlet />
        </div>
      </main>
    </div>
  );
};
