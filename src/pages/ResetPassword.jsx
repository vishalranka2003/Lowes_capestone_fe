import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { resetPasswordConfirm } from '../features/auth/authAPI'; // Adjust path as needed
import { motion } from 'framer-motion';
import { AlertCircle, CheckCircle, Eye, EyeOff, Check, X } from 'lucide-react';

export const ResetPassword = () => {
  const [newPassword, setNewPassword] = useState('');
  // Removed confirmPassword state
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [token, setToken] = useState(null);
  const [fieldErrors, setFieldErrors] = useState({}); // To store specific field errors
  const [touched, setTouched] = useState({ newPassword: false }); // Removed confirmPassword from touched
  const [showPassword, setShowPassword] = useState(false);
  const [passwordFocused, setPasswordFocused] = useState(false); // To show strength indicator
  const [passwordStrength, setPasswordStrength] = useState({ // For password strength feedback
    score: 0,
    feedback: []
  });

  const navigate = useNavigate();
  const location = useLocation();

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

  useEffect(() => {
    // Extract token from URL query parameters
    const queryParams = new URLSearchParams(location.search);
    const tokenFromUrl = queryParams.get('token');
    if (tokenFromUrl) {
      setToken(tokenFromUrl);
    } else {
      setError('Password reset token is missing from the URL.');
    }
  }, [location.search]);

  // Helper function for password strength check (copied from Signup.jsx)
  const checkPasswordStrength = (password) => {
    const checks = [
      { test: password.length >= 8, message: 'At least 8 characters' },
      { test: /[a-z]/.test(password), message: 'One lowercase letter' },
      { test: /[A-Z]/.test(password), message: 'One uppercase letter' },
      { test: /\d/.test(password), message: 'One number' },
      { test: /[!@#$%^&*(),.?":{}|<>]/.test(password), message: 'One special character' }
    ];
    const passedChecks = checks.filter(check => check.test).length;
    const feedback = checks.map(check => ({ ...check, passed: check.test }));
    return {
      score: passedChecks,
      feedback
    };
  };

  // Validation functions
  const validateNewPassword = (value) => {
    if (!value.trim()) return 'New password is required';
    const strength = checkPasswordStrength(value);
    setPasswordStrength(strength); // Update strength feedback
    if (strength.score < 3) return 'Password is too weak. Please meet at least 3 criteria.';
    return '';
  };

  // Removed validateConfirmPassword function

  // Generic field validation for blur/change
  const validateField = (name, value) => {
    let errorMessage = '';
    if (name === 'newPassword') {
      errorMessage = validateNewPassword(value);
    }
    // Removed confirmPassword validation from here
    setFieldErrors(prev => ({ ...prev, [name]: errorMessage }));
    return errorMessage;
  };

  const handleNewPasswordChange = (e) => {
    const { value } = e.target;
    setNewPassword(value);
    // Always update strength feedback
    setPasswordStrength(checkPasswordStrength(value));
    // Validate and show error immediately if already touched
    if (touched.newPassword) {
      validateField('newPassword', value);
    }
    // Removed re-validation of confirm password
  };

  const handleNewPasswordBlur = () => {
    setTouched((prev) => ({ ...prev, newPassword: true }));
    validateField('newPassword', newPassword);
    setPasswordFocused(false);
  };

  // Removed handleConfirmPasswordChange
  // Removed handleConfirmPasswordBlur

  const handleFocus = (e) => {
    const { name } = e.target;
    if (name === 'newPassword') {
      setPasswordFocused(true);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage(''); // Clear any previous success message
    setError('');   // Clear any previous error message

    // Mark newPassword field as touched to show validation errors on submit
    setTouched({ newPassword: true });

    // Perform client-side validation for newPassword only
    const newPasswordError = validateNewPassword(newPassword);

    // Update fieldErrors state based on current validation
    setFieldErrors({
      newPassword: newPasswordError,
      // Removed confirmPassword from fieldErrors
    });

    if (newPasswordError) { // Only check newPasswordError
      setError('Please correct the errors in the form.');
      return; // Stop submission if client-side validation fails
    }

    if (!token) {
      setError('Invalid or missing reset token. Please ensure you clicked the link from your email.');
      return;
    }

    setIsLoading(true);
    try {
      const res = await resetPasswordConfirm(token, newPassword);
      if (res.error) {
        setError(res.message || 'Failed to reset password. The token might be invalid or expired.');
      } else {
        setMessage(res.message || 'Your password has been reset successfully!');
        setNewPassword('');
        // Removed setConfirmPassword('')
        setFieldErrors({}); // Clear field errors on success
        setTouched({ newPassword: false }); // Reset touched state for newPassword
        setError(''); // Ensure no general error is shown
        // Optionally redirect to login after a short delay
        setTimeout(() => {
          navigate('/login');
        }, 3000);
      }
    } catch (err) {
      console.error('Reset password submission error:', err);
      setError('An unexpected error occurred. Please try again later.');
    } finally {
      setIsLoading(false);
    }
  };

  const getFieldClassName = (fieldName) => {
    const baseClass = "w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 focus:border-blue-500 dark:focus:border-blue-400 transition-colors duration-180 text-sm";
    if (touched[fieldName] && fieldErrors[fieldName]) {
      return `${baseClass} border-red-400 bg-red-50 dark:border-red-500 dark:bg-red-900/30`;
    }
    return `${baseClass} border-gray-300 dark:border-gray-600`;
  };

  // Password Strength Indicator Component (Copied from Signup.jsx)
  const PasswordStrengthIndicator = ({ strength }) => {
    const colors = ['bg-red-500', 'bg-orange-500', 'bg-yellow-500', 'bg-lime-500', 'bg-green-500'];
    const labels = ['Very Weak', 'Weak', 'Fair', 'Good', 'Strong'];
    return (
      <motion.div
        className="mt-2.5"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.25 }}
      >
        <div className="flex space-x-1.5 mb-2.5">
          {[...Array(5)].map((_, i) => (
            <div
              key={i}
              className={`h-2.5 flex-1 rounded ${
                i < strength.score ? colors[Math.min(strength.score - 1, 4)] : 'bg-gray-200 dark:bg-gray-600'
              }`}
            />
          ))}
        </div>
        <div className="text-sm text-gray-600 dark:text-gray-300">
          Password strength: {labels[Math.min(strength.score, 4)]}
        </div>
        <div className="mt-1.5 space-y-1.5">
          {strength.feedback.map((item, i) => (
            <div key={i} className="flex items-center space-x-1.5 text-sm">
              {item.passed ? (
                <Check className="h-4 w-4 text-green-500 dark:text-green-400" />
              ) : (
                <X className="h-4 w-4 text-red-500 dark:text-red-400" />
              )}
              <span className={item.passed ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}>
                {item.message}
              </span>
            </div>
          ))}
        </div>
      </motion.div>
    );
  };


  return (
    <motion.div
      className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8"
      initial="hidden"
      animate="visible"
      variants={staggerContainer}
    >
      <motion.div className="max-w-md w-full space-y-8" variants={fadeInUp}>
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8">
          <motion.div className="text-center mb-8" variants={fadeInUp}>
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-3">Set New Password</h2>
            <p className="text-sm text-gray-600 dark:text-gray-300">
              Enter your new password below.
            </p>
          </motion.div>

          {/* Initial error if token is missing */}
          {error && !token && (
            <motion.div
              className="flex items-center justify-center mt-5 p-3 bg-red-50 dark:bg-red-900/30 border border-red-300 dark:border-red-700 rounded-lg"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.27 }}
            >
              <AlertCircle className="h-4 w-4 text-red-600 dark:text-red-400 mr-3" />
              <p className="text-red-600 dark:text-red-400 text-sm">{error}</p>
            </motion.div>
          )}

          {token && ( // Only show form if token is present
            <form className="space-y-6" onSubmit={handleSubmit}>
              <motion.div variants={fadeInUp}>
                <label htmlFor="new-password" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  New Password
                </label>
                <div className="relative">
                  <input
                    id="new-password"
                    name="newPassword"
                    type={showPassword ? 'text' : 'password'}
                    autoComplete="new-password"
                    required
                    value={newPassword}
                    onChange={handleNewPasswordChange}
                    onBlur={handleNewPasswordBlur}
                    onFocus={handleFocus}
                    className={getFieldClassName('newPassword')}
                    placeholder="Enter your new password"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute inset-y-0 right-0 pr-3.5 flex items-center"
                  >
                    {showPassword ? (
                      <EyeOff className="h-5 w-5 text-gray-400 dark:text-gray-300" />
                    ) : (
                      <Eye className="h-5 w-5 text-gray-400 dark:text-gray-300" />
                    )}
                  </button>
                </div>
                {newPassword && passwordFocused && (
                  <PasswordStrengthIndicator strength={passwordStrength} />
                )}
                {touched.newPassword && fieldErrors.newPassword && (
                  <motion.div
                    className="flex items-center mt-2 text-xs text-red-600 dark:text-red-400"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.27 }}
                  >
                    <AlertCircle className="h-4 w-4 mr-2" />
                    {fieldErrors.newPassword}
                  </motion.div>
                )}
              </motion.div>

              {/* Removed Confirm New Password field */}

              <motion.button
                type="submit"
                className="w-full bg-blue-600 dark:bg-blue-500 hover:bg-blue-700 dark:hover:bg-blue-600 text-white font-semibold py-3 px-5 rounded-lg transition-colors duration-180 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 focus:ring-offset-2 dark:focus:ring-offset-gray-800 text-sm"
                variants={fadeInUp}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                disabled={isLoading}
              >
                {isLoading ? 'Resetting...' : 'Reset Password'}
              </motion.button>
            </form>
          )}

          {message && (
            <motion.div
              className="flex items-center justify-center mt-5 p-3 bg-green-50 dark:bg-green-900/30 border border-green-300 dark:border-green-700 rounded-lg"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.27 }}
            >
              <CheckCircle className="h-4 w-4 text-green-600 dark:text-green-400 mr-3" />
              <p className="text-green-600 dark:text-green-400 text-sm">{message}</p>
            </motion.div>
          )}

          {error && ( // Show general error if present (e.g., API error or validation summary)
            <motion.div
              className="flex items-center justify-center mt-5 p-3 bg-red-50 dark:bg-red-900/30 border border-red-300 dark:border-red-700 rounded-lg"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.27 }}
            >
              <AlertCircle className="h-4 w-4 text-red-600 dark:text-red-400 mr-3" />
              <p className="text-red-600 dark:text-red-400 text-sm">{error}</p>
            </motion.div>
          )}

          <motion.p
            className="text-center text-gray-600 dark:text-gray-300 text-sm mt-6"
            variants={fadeInUp}
          >
            <button
              onClick={() => navigate('/login')}
              className="text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 font-medium bg-transparent border-none p-0 cursor-pointer"
            >
              Back to Login
            </button>
          </motion.p>
        </div>
      </motion.div>
    </motion.div>
  );
};