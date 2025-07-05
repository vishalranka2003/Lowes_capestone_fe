import { useState, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { login } from '../features/auth/authAPI';
import { loginSuccess } from '../features/auth/authSlice';
import { Shield } from 'lucide-react';

export const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('ROLE_HOMEOWNER');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(true);

  const dispatch = useDispatch();
  const navigate = useNavigate();

  // Helper function to get dashboard route based on role
  const getDashboardRoute = (userRole) => {
    switch (userRole) {
      case 'ROLE_ADMIN':
        return '/dashboard/admin';
      case 'ROLE_TECHNICIAN':
        return '/dashboard/technician';
      case 'ROLE_HOMEOWNER':
        return '/dashboard/homeowner';
      default:
        return '/dashboard';
    }
  };

  // Check if user is already logged in
  useEffect(() => {
    const token = localStorage.getItem('token');
    const username = localStorage.getItem('username');
    const role = localStorage.getItem('role');
    
    if (token && username && role) {
      try {
        const dashboardRoute = getDashboardRoute(role);
        navigate(dashboardRoute);
        return;
      } catch (error) {
        console.error('Error parsing user info:', error);
        // Clear invalid data
        localStorage.removeItem('token');
        localStorage.removeItem('username');
        localStorage.removeItem('role');
      }
    }
    
    setIsLoading(false);
  }, [navigate]);

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
      
      const dashboardRoute = getDashboardRoute(res.role);
      navigate(dashboardRoute);
    } catch (err) {
      console.error(err);
      setError('Something went wrong. Please try again later.');
    }
  };

  // Show loading state while checking authentication
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-gray-600">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div className="bg-white rounded-xl shadow-lg p-8">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="flex justify-center mb-4">
              <div className="flex items-center space-x-2 text-blue-600">
                <Shield className="h-8 w-8" />
                <span className="text-2xl font-bold text-gray-900">Service Pro</span>
              </div>
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Welcome Back</h2>
            <p className="text-gray-600">Sign in to your account</p>
          </div>

          {/* Role Tabs */}
          <div className="flex space-x-1 mb-6 bg-gray-100 rounded-lg p-1">
            {[
              { key: 'ROLE_HOMEOWNER', label: 'Homeowner' },
              { key: 'ROLE_TECHNICIAN', label: 'Technician' },
              { key: 'ROLE_ADMIN', label: 'Admin' }
            ].map((roleOption) => (
              <button
                key={roleOption.key}
                onClick={() => setRole(roleOption.key)}
                className={`flex-1 py-2 px-3 text-sm font-medium rounded-md transition-colors duration-200 ${
                  role === roleOption.key
                    ? 'bg-white text-blue-600 shadow-sm'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                {roleOption.label}
              </button>
            ))}
          </div>

          {/* Form */}
          <div className="space-y-4">
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-200"
            />
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter your password"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-200"
            />

            <div className="flex items-center justify-between text-sm">
              <label className="flex items-center text-gray-600">
                <input type="checkbox" className="mr-2 rounded border-gray-300 text-blue-600 focus:ring-blue-500" />
                Remember me
              </label>
              {/* <a href="#" className="text-blue-600 hover:text-blue-700 font-medium">
                Forgot password?
              </a> */}
            </div>

            <button 
              onClick={handleLogin} 
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-4 rounded-lg transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
            >
              Sign In
            </button>

            {error && (
              <p className="text-red-600 text-sm text-center">{error}</p>
            )}
          </div>

          {/* Signup Link */}
          <p className="text-center text-gray-600 text-sm mt-6">
            Don't have an account?{' '}
            <a href="/signup" className="text-blue-600 hover:text-blue-700 font-medium">
              Sign up
            </a>
          </p>
        </div>
      </div>
    </div>
  );
};
