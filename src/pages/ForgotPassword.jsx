import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { forgotPasswordRequest } from '../features/auth/authAPI';
import { AlertCircle, CheckCircle } from 'lucide-react';
import { motion } from 'framer-motion';

export const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [touched, setTouched] = useState(false);
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

  const validateEmail = (value) => {
    if (!value.trim()) return 'Email is required';
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(value)) return 'Please enter a valid email address';
    return '';
  };

  const handleEmailChange = (e) => {
    setEmail(e.target.value);
    if (touched) {
      setError(validateEmail(e.target.value));
    }
  };

  const handleEmailBlur = () => {
    setTouched(true);
    setError(validateEmail(email));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage('');
    setError('');
    setTouched(true); // Ensure validation runs on submit
    const emailError = validateEmail(email);

    if (emailError) {
      setError(emailError);
      return;
    }

    setIsLoading(true);
    try {
      const res = await forgotPasswordRequest(email);
      if (res.error) {
        // Backend might return a generic success message even for non-existent emails for security
        // So, if it's not a 200, we show the error from the backend.
        setError(res.message || 'Failed to send reset link. Please try again.');
        setMessage(''); // Clear any previous success message
      } else {
        setMessage(res.message || 'If an account with that email exists, a password reset link has been sent.');
        setEmail(''); // Clear the email field on success
        setError(''); // Clear any previous error
      }
    } catch (err) {
      console.error('Forgot password submission error:', err);
      setError('An unexpected error occurred. Please try again later.');
      setMessage('');
    } finally {
      setIsLoading(false);
    }
  };

  const getFieldClassName = () => {
    const baseClass = "w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-lowesBlue-500 focus:border-lowesBlue-500 transition-colors duration-180 text-sm";
    if (touched && error) {
      return `${baseClass} border-red-400 bg-red-50`;
    }
    return `${baseClass} border-gray-300`;
  };

  return (
    <motion.div
      className="min-h-screen bg-gray-50 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8"
      initial="hidden"
      animate="visible"
      variants={staggerContainer}
    >
      <motion.div className="max-w-md w-full space-y-8" variants={fadeInUp}>
        <div className="bg-white rounded-2xl shadow-xl p-8">
          <motion.div className="text-center mb-8" variants={fadeInUp}>
            <h2 className="text-3xl font-bold text-gray-900 mb-3">Forgot Your Password?</h2>
            <p className="text-sm text-gray-600">
              Enter your email address and we'll send you a link to reset your password.
            </p>
          </motion.div>

          <form className="space-y-6" onSubmit={handleSubmit}>
            <motion.div variants={fadeInUp}>
              <label htmlFor="email-address" className="block text-sm font-medium text-gray-700 mb-2">
                Email Address
              </label>
              <input
                id="email-address"
                name="email"
                type="email"
                autoComplete="email"
                required
                value={email}
                onChange={handleEmailChange}
                onBlur={handleEmailBlur}
                className={getFieldClassName()}
                placeholder="you@example.com"
              />
              {touched && error && (
                <motion.div
                  className="flex items-center mt-2 text-xs text-red-600"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.27 }}
                >
                  <AlertCircle className="h-4 w-4 mr-2" />
                  {error}
                </motion.div>
              )}
            </motion.div>

            <motion.button
              type="submit"
              className="w-full bg-lowesBlue-500 hover:bg-lowesBlue-500 text-white font-semibold py-3 px-5 rounded-lg transition-colors duration-180 focus:outline-none focus:ring-2 focus:ring-lowesBlue-500 focus:ring-offset-2 text-sm"
              variants={fadeInUp}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              disabled={isLoading}
            >
              {isLoading ? 'Sending...' : 'Send Reset Link'}
            </motion.button>
          </form>

          {message && (
            <motion.div
              className="flex items-center justify-center mt-5 p-3 bg-green-50 border border-green-300 rounded-lg"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.27 }}
            >
              <CheckCircle className="h-4 w-4 text-green-600 mr-3" />
              <p className="text-green-600 text-sm">{message}</p>
            </motion.div>
          )}

          {error && !message && ( // Only show error if no success message
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

          <motion.p
            className="text-center text-gray-600 text-sm mt-6"
            variants={fadeInUp}
          >
            Remembered your password?{' '}
            <button
              onClick={() => navigate('/login')}
              className="text-lowesBlue-500 hover:text-lowesBlue-500 font-medium bg-transparent border-none p-0 cursor-pointer"
            >
              Back to Login
            </button>
          </motion.p>
        </div>
      </motion.div>
    </motion.div>
  );
};
