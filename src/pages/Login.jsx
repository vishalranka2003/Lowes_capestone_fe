import React, { useState, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { login } from '../features/auth/authAPI';
import { loginSuccess } from '../features/auth/authSlice';
import { Shield, AlertCircle } from 'lucide-react';
import { motion } from 'framer-motion';
export const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('ROLE_HOMEOWNER');
  const [error, setError] = useState('');
  const [fieldErrors, setFieldErrors] = useState({});
  const [touched, setTouched] = useState({ email: false, password: false });
  const [isLoading, setIsLoading] = useState(true);

  const dispatch = useDispatch();
  const navigate = useNavigate();

  // Animation variants
  const fadeInUp = {
    hidden: { opacity: 0, y: 18 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.54, ease: "easeOut" } }
  };

  const staggerContainer = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.18
      }
    }
  };

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
        localStorage.removeItem('token');
        localStorage.removeItem('username');
        localStorage.removeItem('role');
      }
    }
    setIsLoading(false);
  }, [navigate]);

  // Validation helpers
  const validateEmail = (value) => {
    if (!value.trim()) return 'Email is required';
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(value)) return 'Please enter a valid email address';
    return '';
  };

  const validatePassword = (value) => {
    if (!value.trim()) return 'Password is required';
    return '';
  };

  const handleEmailChange = (e) => {
    setEmail(e.target.value);
  };

  const handleEmailBlur = () => {
    setTouched((prev) => ({ ...prev, email: true }));
    setFieldErrors((prev) => ({
      ...prev,
      email: validateEmail(email)
    }));
  };

  const handlePasswordChange = (e) => {
    setPassword(e.target.value);
  };

  const handlePasswordBlur = () => {
    setTouched((prev) => ({ ...prev, password: true }));
    setFieldErrors((prev) => ({
      ...prev,
      password: validatePassword(password)
    }));
  };

  const validateForm = () => {
    const errors = {
      email: validateEmail(email),
      password: validatePassword(password)
    };
    setFieldErrors(errors);
    setTouched({ email: true, password: true });
    return !errors.email && !errors.password;
  };

  const getFieldClassName = (fieldName) => {
    const baseClass = "w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-lowesBlue-500 focus:border-lowesBlue-500 transition-colors duration-180 text-sm";
    if (touched[fieldName] && fieldErrors[fieldName]) {
      return `${baseClass} border-red-400 bg-red-50`;
    }
    return `${baseClass} border-gray-300`;
  };

  const handleLogin = async () => {
    setError('');
    if (!validateForm()) {
      return;
    }
    try {
      const res = await login(email, password, role);
      if (res.error || !res.token) { // Check for res.error now
        setError(res.message || 'Login failed. Check your role or credentials.'); // Use res.message
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

  if (isLoading) {
    return (
      <motion.div
        className="min-h-screen bg-gray-50 flex items-center justify-center"
        initial="hidden"
        animate="visible"
        variants={fadeInUp}
      >
        <div className="text-gray-600 text-sm">Loading...</div>
      </motion.div>
    );
  }

  return (
    <motion.div
      className="min-h-screen bg-gray-50 flex items-center justify-center py-13 px-5 sm:px-6 lg:px-10"
      initial="hidden"
      animate="visible"
      variants={staggerContainer}
    >
      <motion.div className="max-w-lg w-full space-y-8" variants={fadeInUp}>
        <div className="bg-white rounded-2xl shadow-xl p-8">
          {/* Header */}
          <motion.div className="text-center mb-8" variants={fadeInUp}>
            <h2 className="text-3xl font-bold text-gray-900 mb-3">Welcome to Service Pro</h2>
            <p className="text-sm text-gray-600">Sign in to your account</p>
          </motion.div>

          {/* Role Tabs */}
          <motion.div className="flex space-x-2 mb-6 bg-gray-100 rounded-lg p-2" variants={fadeInUp}>
            {[
              { key: 'ROLE_HOMEOWNER', label: 'Homeowner' },
              { key: 'ROLE_TECHNICIAN', label: 'Technician' },
              { key: 'ROLE_ADMIN', label: 'Admin' }
            ].map((roleOption) => (
              <motion.button
                key={roleOption.key}
                onClick={() => setRole(roleOption.key)}
                className={`flex-1 py-3 px-3 text-sm font-medium rounded-md transition-colors duration-180 ${
                  role === roleOption.key
                    ? 'bg-white text-lowesBlue-500 shadow-sm'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                {roleOption.label}
              </motion.button>
            ))}
          </motion.div>

          {/* Form */}
          <motion.div className="space-y-5" variants={staggerContainer}>
            <motion.div variants={fadeInUp}>
              <label htmlFor="login-email" className="block text-sm font-medium text-gray-700 mb-2">
                Email Address
              </label>
              <input
                id="login-email"
                type="email"
                value={email}
                onChange={handleEmailChange}
                onBlur={handleEmailBlur}
                placeholder="Enter your email"
                className={getFieldClassName('email')}
              />
              {touched.email && fieldErrors.email && (
                <motion.div
                  className="flex items-center mt-2 text-xs text-red-600"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.27 }}
                >
                  <AlertCircle className="h-4 w-4 mr-2" />
                  {fieldErrors.email}
                </motion.div>
              )}
            </motion.div>
            <motion.div variants={fadeInUp}>
              <label htmlFor="login-password" className="block text-sm font-medium text-gray-700 mb-2">
                Password
              </label>
              <input
                id="login-password"
                type="password"
                value={password}
                onChange={handlePasswordChange}
                onBlur={handlePasswordBlur}
                placeholder="Enter your password"
                className={getFieldClassName('password')}
              />
              {touched.password && fieldErrors.password && (
                <motion.div
                  className="flex items-center mt-2 text-xs text-red-600"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.27 }}
                >
                  <AlertCircle className="h-4 w-4 mr-2" />
                  {fieldErrors.password}
                </motion.div>
              )}
            </motion.div>

            <motion.button
              onClick={handleLogin}
              className="w-full bg-lowesBlue-500 hover:bg-lowesBlue-500 text-white font-semibold py-3 px-5 rounded-lg transition-colors duration-180 focus:outline-none focus:ring-2 focus:ring-lowesBlue-500 focus:ring-offset-2 text-sm"
              variants={fadeInUp}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              Sign in
            </motion.button>

            {error && (
              <motion.div
                className="flex items-center justify-center mt-5 p-3 bg-red-50 border border-red-300 rounded-lg"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.27 }}
              >
                <AlertCircle className="h-4 w-4 text-red-600 mr-3" />
                <p className="text-red-600 text-sm">{error}</p>
              </motion.div>
            )}
          </motion.div>

          {/* Forgot Password Link - NEW */}
          <motion.p
            className="text-center text-gray-600 text-sm mt-4"
            variants={fadeInUp}
          >
            <button
              onClick={() => navigate('/forgot-password')}
              className="text-lowesBlue-500 hover:text-lowesBlue-500 font-medium bg-transparent border-none p-0 cursor-pointer"
            >
              Forgot password?
            </button>
          </motion.p>

          {/* Signup Link */}
          <motion.p
            className="text-center text-gray-600 text-sm mt-6"
            variants={fadeInUp}
          >
            Don't have an account?{' '}
            <a href="/signup" className="text-lowesBlue-500 hover:text-lowesBlue-500 font-medium">
              Sign up
            </a>
          </motion.p>
        </div>
      </motion.div>
    </motion.div>
  );
};