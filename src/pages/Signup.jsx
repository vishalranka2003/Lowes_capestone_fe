import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Shield } from 'lucide-react';

export const Signup = () => {
  const [role, setRole] = useState('homeowner');
  const [form, setForm] = useState({
    username: '', email: '', password: '',
    address: '', phoneNumber: '',
    specialization: '', experience: '',
    firstName: '', lastName: ''
  });
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(true);
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
        return '/dashboard/homeowner';
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

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSignup = async () => {
    const endpoint = `${process.env.REACT_APP_API_URL}/api/auth/register/${role}`;
    const body = {
      email: form.email,
      password: form.password,
      username: form.username,
      firstName: form.firstName,
      lastName: form.lastName,
      ...(role === 'homeowner'
        ? { address: form.address, phoneNumber: form.phoneNumber }
        : {
            specialization: form.specialization,
            experience: parseInt(form.experience),
            phoneNumber: form.phoneNumber
          })
    };

    try {
      const res = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body)
      });

      if (res.ok) {
        navigate('/login');
      } else {
        const data = await res.json();
        setError(data.message || 'Signup failed');
      }
    } catch (err) {
      console.error(err);
      setError('Network error');
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
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Create Account</h2>
            <p className="text-gray-600">Choose your account type and fill in your details</p>
          </div>

          {/* Role Tabs */}
          <div className="flex space-x-1 mb-6 bg-gray-100 rounded-lg p-1">
            {[
              { key: 'homeowner', label: 'Homeowner' },
              { key: 'technician', label: 'Technician' }
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
              name="firstName" 
              onChange={handleChange} 
              placeholder="First Name" 
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-200" 
            />
            <input 
              name="lastName" 
              onChange={handleChange} 
              placeholder="Last Name" 
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-200" 
            />
            <input 
              name="username" 
              onChange={handleChange} 
              placeholder="Username" 
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-200" 
            />
            <input 
              name="email" 
              onChange={handleChange} 
              placeholder="Email" 
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-200" 
            />
            <input 
              name="password" 
              onChange={handleChange} 
              placeholder="Password" 
              type="password" 
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-200" 
            />

            {role === 'homeowner' && (
              <>
                <input 
                  name="address" 
                  onChange={handleChange} 
                  placeholder="Address" 
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-200" 
                />
                <input 
                  name="phoneNumber" 
                  onChange={handleChange} 
                  placeholder="Phone Number" 
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-200" 
                />
              </>
            )}

            {role === 'technician' && (
              <>
                <input 
                  name="specialization" 
                  onChange={handleChange} 
                  placeholder="Specialization" 
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-200" 
                />
                <input 
                  name="experience" 
                  onChange={handleChange} 
                  placeholder="Experience (in years)" 
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-200" 
                />
                <input 
                  name="phoneNumber" 
                  onChange={handleChange} 
                  placeholder="Phone Number" 
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-200" 
                />
              </>
            )}

            <button 
              onClick={handleSignup} 
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-4 rounded-lg transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 mt-6"
            >
              Create Account
            </button>

            {error && (
              <p className="text-red-600 text-sm text-center">{error}</p>
            )}
          </div>

          {/* Login Link */}
          <p className="text-center text-gray-600 text-sm mt-6">
            Already have an account?{' '}
            <a href="/login" className="text-blue-600 hover:text-blue-700 font-medium">
              Sign in
            </a>
          </p>
        </div>
      </div>
    </div>
  );
};
