import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Shield, Eye, EyeOff, Check, X, AlertCircle, ChevronDown } from 'lucide-react';
import { motion } from 'framer-motion';

export const Signup = () => {
  const [role, setRole] = useState('homeowner');
  const [form, setForm] = useState({
    email: '', password: '',
    address: '', phoneNumber: '',
    specialization: [], experience: '',
    firstName: '', lastName: ''
  });
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [passwordFocused, setPasswordFocused] = useState(false);
  const [fieldErrors, setFieldErrors] = useState({});
  const [showSpecializationDropdown, setShowSpecializationDropdown] = useState(false);
  const [passwordStrength, setPasswordStrength] = useState({
    score: 0,
    feedback: []
  });
  const [searchQuery, setSearchQuery] = useState('');

  const dropdownRef = useRef(null);
  const navigate = useNavigate();

  // Animation variants
  const fadeInUp = {
    hidden: { opacity: 0, y: 16 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" } }
  };

  const staggerContainer = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.16
      }
    }
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowSpecializationDropdown(false);
        setSearchQuery('');
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const validatePhoneNumber = (phone) => {
    const phoneRegex = /^\d{10}$/;
    return phoneRegex.test(phone);
  };

  const validateName = (name) => {
    const nameRegex = /^[a-zA-Z]+$/;
    return nameRegex.test(name);
  };

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

  const validateField = (name, value, currentForm = form) => {
    const errors = {};
    switch (name) {
      case 'firstName':
      case 'lastName':
        if (!value.trim()) errors[name] = 'This field is required';
        else if (value.length < 2) errors[name] = 'Must be at least 2 characters';
        else if (!validateName(value)) errors[name] = 'Only letters are allowed';
        break;
      case 'email':
        if (!value.trim()) errors[name] = 'Email is required';
        else if (!validateEmail(value)) errors[name] = 'Please enter a valid email address';
        break;
      case 'password':
        if (!value.trim()) errors[name] = 'Password is required';
        else {
          const strength = checkPasswordStrength(value);
          setPasswordStrength(strength);
          if (strength.score < 3) errors[name] = 'Password is too weak';
        }
        break;
      case 'address':
        if (role === 'homeowner' && !value.trim()) errors[name] = 'Address is required';
        break;
      case 'phoneNumber':
        if (!value.trim()) errors[name] = 'Phone number is required';
        else if (!validatePhoneNumber(value)) errors[name] = 'Please enter exactly 10 digits';
        break;
      case 'specialization':
        if (role === 'technician' && (!value || value.length === 0)) {
          errors[name] = 'Please select at least one specialization';
        } else if (role === 'technician' && value.length > 2) {
          errors[name] = 'Maximum 2 specializations allowed';
        }
        break;
      case 'experience':
        if (role === 'technician') {
          if (!value.trim()) errors[name] = 'Experience is required';
          else if (isNaN(value) || parseInt(value) < 0) errors[name] = 'Please enter a valid number';
        }
        break;
    }
    return errors;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    const updatedForm = { ...form, [name]: value };
    setForm(updatedForm);

    setFieldErrors(prev => ({ ...prev, [name]: '' }));

    const errors = validateField(name, value, updatedForm);
    if (errors[name]) {
      setFieldErrors(prev => ({ ...prev, ...errors }));
    }
  };

  const handleSpecializationChange = (specializationValue) => {
    const currentSpecializations = form.specialization || [];
    let updatedSpecializations;

    if (currentSpecializations.includes(specializationValue)) {
      updatedSpecializations = currentSpecializations.filter(spec => spec !== specializationValue);
    } else {
      if (currentSpecializations.length < 2) {
        updatedSpecializations = [...currentSpecializations, specializationValue];
      } else {
        updatedSpecializations = [...currentSpecializations];
      }
    }

    const updatedForm = { ...form, specialization: updatedSpecializations };
    setForm(updatedForm);

    const errors = validateField('specialization', updatedSpecializations, updatedForm);
    setFieldErrors(prev => ({ ...prev, specialization: errors.specialization || '' }));
  };

  const handleBlur = (e) => {
    const { name, value } = e.target;
    const errors = validateField(name, value);
    setFieldErrors(prev => ({ ...prev, ...errors }));

    if (name === 'password') {
      setPasswordFocused(false);
    }
  };

  const handleFocus = (e) => {
    const { name } = e.target;
    if (name === 'password') {
      setPasswordFocused(true);
    }
  };

  const validateForm = () => {
    const errors = {};
    Object.keys(form).forEach(key => {
      const fieldErrors = validateField(key, form[key]);
      Object.assign(errors, fieldErrors);
    });
    setFieldErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSignup = async () => {
    if (!validateForm()) {
      setError('Please enter details correctly');
      return;
    }
    setIsSubmitting(true);
    setError('');

    const apiUrl = process.env.REACT_APP_API_URL || 'http://localhost:8080';
    const endpoint = `${apiUrl}/api/auth/register/${role}`;

    const body = {
      email: form.email,
      password: form.password,
      username: form.firstName,
      firstName: form.firstName,
      lastName: form.lastName,
      ...(role === 'homeowner'
        ? { address: form.address, phoneNumber: form.phoneNumber }
        : {
            specialization: form.specialization
              .map(spec => spec.charAt(0).toUpperCase() + spec.slice(1))
              .join(', '),
            experience: parseInt(form.experience),
            phoneNumber: form.phoneNumber
          })
    };

    try {
      const response = await fetch(endpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(body),
      });

      if (!response.ok) {
        let errorMessage = 'Registration failed';
        const contentType = response.headers.get('content-type');
        if (contentType && contentType.includes('application/json')) {
          const errorData = await response.json();
          errorMessage = errorData.message || errorMessage;
        } else {
          errorMessage = await response.text();
        }
        throw new Error(errorMessage);
      }

      setError('');
      navigate('/login');
    } catch (err) {
      setError(err.message || 'Network error. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleRoleChange = (newRole) => {
    setRole(newRole);
    setForm(prev => ({ ...prev, specialization: [] }));
    setFieldErrors(prev => {
      const newErrors = { ...prev };
      delete newErrors.address;
      delete newErrors.specialization;
      delete newErrors.experience;
      return newErrors;
    });
    setSearchQuery('');
  };

  const getFieldClassName = (fieldName) => {
    const baseClass = "w-full px-3.5 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 focus:border-blue-500 dark:focus:border-blue-400 transition-colors duration-160 text-sm";
    if (fieldErrors[fieldName]) {
      return `${baseClass} border-red-400 bg-red-50 dark:border-red-500 dark:bg-red-900/30`;
    }
    return `${baseClass} border-gray-300 dark:border-gray-600`;
  };

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

  const specializationOptions = [
    { value: 'refrigerator', label: 'Refrigerator Service', shortLabel: 'Refrigerator' },
    { value: 'washing_machine', label: 'Washing Machine Service', shortLabel: 'Washing Machine' },
    { value: 'dishwasher', label: 'Dishwasher Service', shortLabel: 'Dishwasher' },
    { value: 'microwave', label: 'Microwave Service', shortLabel: 'Microwave' },
    { value: 'oven', label: 'Oven Service', shortLabel: 'Oven' },
    { value: 'water_heater', label: 'Water Heater Service', shortLabel: 'Water Heater' },
    { value: 'hvac', label: 'HVAC Service', shortLabel: 'HVAC' },
    { value: 'television', label: 'Television Service', shortLabel: 'Television' },
    { value: 'computer', label: 'Computer Service', shortLabel: 'Computer' },
    { value: 'mobile', label: 'Mobile Device Service', shortLabel: 'Mobile Device' },
    { value: 'small_appliances', label: 'Small Appliances', shortLabel: 'Small Appliances' },
    { value: 'installation', label: 'Installation', shortLabel: 'Installation' },
    { value: 'inspection', label: 'Warranty Inspection', shortLabel: 'Inspection' },
    { value: 'claims', label: 'Warranty Claims', shortLabel: 'Claims' },
    { value: 'other', label: 'Other', shortLabel: 'Other' }
  ];

  const filteredSpecializations = specializationOptions.filter(option =>
    option.label.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (isLoading) {
    return (
      <motion.div
        className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center"
        initial="hidden"
        animate="visible"
        variants={fadeInUp}
      >
        <div className="text-gray-600 dark:text-gray-300 text-base">Loading...</div>
      </motion.div>
    );
  }

  return (
    <motion.div
      className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center py-8 px-4 sm:px-6 lg:px-8"
      initial="hidden"
      animate="visible"
      variants={staggerContainer}
    >
      <motion.div className="max-w-xl w-full space-y-7" variants={fadeInUp}>
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-7 sm:p-8">
          {/* Header */}
          <motion.div className="text-center mb-8" variants={fadeInUp}>
            <div className="flex justify-center mb-5">
              {/* <div className="flex items-center space-x-3 text-blue-600 dark:text-blue-400">
                <Shield className="h-10 w-10" />
                <span className="text-3xl font-bold text-gray-900 dark:text-white">Service Pro</span>
              </div> */}
            </div>
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-3">Create Account</h2>
            <p className="text-sm text-gray-600 dark:text-gray-300">Choose your account type and fill in your details</p>
          </motion.div>

          {/* Role Tabs */}
          <motion.div className="flex space-x-2 mb-7 bg-gray-100 dark:bg-gray-700 rounded-lg p-2" variants={fadeInUp}>
            {[
              { key: 'homeowner', label: 'Homeowner' },
              { key: 'technician', label: 'Technician' }
            ].map((roleOption) => (
              <motion.button
                key={roleOption.key}
                onClick={() => handleRoleChange(roleOption.key)}
                className={`flex-1 py-2.5 px-3.5 text-sm font-medium rounded-md transition-colors duration-160 ${
                  role === roleOption.key
                    ? 'bg-white dark:bg-gray-600 text-blue-600 dark:text-blue-400 shadow-sm'
                    : 'text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white'
                }`}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                disabled={isSubmitting}
              >
                {roleOption.label}
              </motion.button>
            ))}
          </motion.div>

          {/* Form */}
          <motion.div className="space-y-5" variants={staggerContainer}>
            <motion.div className="grid grid-cols-1 sm:grid-cols-2 gap-5" variants={fadeInUp}>
              <div>
                <label htmlFor="firstName" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
                  First Name
                </label>
                <input
                  id="firstName"
                  name="firstName"
                  value={form.firstName}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  placeholder="Enter your first name"
                  className={getFieldClassName('firstName')}
                  disabled={isSubmitting}
                />
                {fieldErrors.firstName && (
                  <motion.div
                    className="flex items-center mt-1.5 text-sm text-red-600 dark:text-red-400"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.25 }}
                  >
                    <AlertCircle className="h-4 w-4 mr-1.5" />
                    {fieldErrors.firstName}
                  </motion.div>
                )}
              </div>
              <div>
                <label htmlFor="lastName" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
                  Last Name
                </label>
                <input
                  id="lastName"
                  name="lastName"
                  value={form.lastName}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  placeholder="Enter your last name"
                  className={getFieldClassName('lastName')}
                  disabled={isSubmitting}
                />
                {fieldErrors.lastName && (
                  <motion.div
                    className="flex items-center mt-1.5 text-sm text-red-600 dark:text-red-400"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.25 }}
                  >
                    <AlertCircle className="h-4 w-4 mr-1.5" />
                    {fieldErrors.lastName}
                  </motion.div>
                )}
              </div>
            </motion.div>

            <motion.div variants={fadeInUp}>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
                Email Address
              </label>
              <input
                id="email"
                name="email"
                type="email"
                value={form.email}
                onChange={handleChange}
                onBlur={handleBlur}
                placeholder="Enter your email"
                className={getFieldClassName('email')}
                disabled={isSubmitting}
              />
              {fieldErrors.email && (
                <motion.div
                  className="flex items-center mt-1.5 text-sm text-red-600 dark:text-red-400"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.25 }}
                >
                  <AlertCircle className="h-4 w-4 mr-1.5" />
                  {fieldErrors.email}
                </motion.div>
              )}
            </motion.div>

            <motion.div variants={fadeInUp}>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
                Password
              </label>
              <div className="relative">
                <input
                  id="password"
                  name="password"
                  type={showPassword ? 'text' : 'password'}
                  value={form.password}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  onFocus={handleFocus}
                  placeholder="Create a strong password"
                  className={getFieldClassName('password')}
                  disabled={isSubmitting}
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
              {form.password && passwordFocused && (
                <PasswordStrengthIndicator strength={passwordStrength} />
              )}
              {fieldErrors.password && (
                <motion.div
                  className="flex items-center mt-1.5 text-sm text-red-600 dark:text-red-400"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.25 }}
                >
                  <AlertCircle className="h-4 w-4 mr-1.5" />
                  {fieldErrors.password}
                </motion.div>
              )}
            </motion.div>

            {role === 'homeowner' && (
              <>
                <motion.div variants={fadeInUp}>
                  <label htmlFor="address" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
                    Address
                  </label>
                  <input
                    id="address"
                    name="address"
                    value={form.address}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    placeholder="Enter your address"
                    className={getFieldClassName('address')}
                    disabled={isSubmitting}
                  />
                  {fieldErrors.address && (
                    <motion.div
                      className="flex items-center mt-1.5 text-sm text-red-600 dark:text-red-400"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ duration: 0.25 }}
                    >
                      <AlertCircle className="h-4 w-4 mr-1.5" />
                      {fieldErrors.address}
                    </motion.div>
                  )}
                </motion.div>
                <motion.div variants={fadeInUp}>
                  <label htmlFor="phoneNumber" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
                    Phone Number
                  </label>
                  <input
                    id="phoneNumber"
                    name="phoneNumber"
                    value={form.phoneNumber}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    placeholder="Enter your phone number"
                    className={getFieldClassName('phoneNumber')}
                    disabled={isSubmitting}
                  />
                  {fieldErrors.phoneNumber && (
                    <motion.div
                      className="flex items-center mt-1.5 text-sm text-red-600 dark:text-red-400"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ duration: 0.25 }}
                    >
                      <AlertCircle className="h-4 w-4 mr-1.5" />
                      {fieldErrors.phoneNumber}
                    </motion.div>
                  )}
                </motion.div>
              </>
            )}

            {role === 'technician' && (
              <>
                <motion.div variants={fadeInUp}>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
                    Specializations (max 2)
                  </label>
                  <div ref={dropdownRef} className="relative">
                    <button
                      type="button"
                      className={`w-full px-3.5 py-3 border rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 focus:border-blue-500 dark:focus:border-blue-400 transition-colors duration-160 flex justify-between items-center bg-white dark:bg-gray-700 text-sm ${
                        fieldErrors.specialization ? 'border-red-400 bg-red-50 dark:border-red-500 dark:bg-red-900/30' : 'border-gray-300 dark:border-gray-600'
                      }`}
                      onClick={() => setShowSpecializationDropdown(!showSpecializationDropdown)}
                      disabled={isSubmitting}
                      aria-expanded={showSpecializationDropdown}
                    >
                      <span className="text-gray-600 dark:text-gray-300">Add specializations</span>
                      <ChevronDown
                        className={`h-4 w-4 text-gray-400 dark:text-gray-300 transition-transform duration-160 ml-auto ${
                          showSpecializationDropdown ? 'rotate-180' : ''
                        }`}
                      />
                    </button>
                    {showSpecializationDropdown && (
                      <div className="relative z-10 w-full mt-2 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg shadow-xl max-h-80 overflow-y-auto">
                        <div className="sticky top-0 z-10 bg-white dark:bg-gray-800 p-3.5 border-b border-gray-300 dark:border-gray-600">
                          <input
                            type="text"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            placeholder="Search specializations..."
                            className="w-full px-3.5 py-3 text-sm border rounded-lg border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400"
                          />
                        </div>
                        <div className="px-3.5 py-3">
                          {filteredSpecializations.length === 0 ? (
                            <div className="px-3.5 py-3 text-sm text-gray-500 dark:text-gray-400">
                              No results found
                            </div>
                          ) : (
                            filteredSpecializations.map((option) => (
                              <label
                                key={option.value}
                                className={`flex items-center px-3.5 py-3 cursor-pointer transition-colors duration-150 hover:bg-gray-50 dark:hover:bg-gray-700 text-sm ${
                                  form.specialization.includes(option.value) ? 'bg-blue-50 dark:bg-blue-900/50' : ''
                                } ${
                                  isSubmitting ||
                                  (!form.specialization.includes(option.value) &&
                                    form.specialization.length >= 2)
                                    ? 'cursor-not-allowed opacity-50'
                                    : ''
                                }`}
                              >
                                <input
                                  type="checkbox"
                                  checked={form.specialization.includes(option.value)}
                                  onChange={() => handleSpecializationChange(option.value)}
                                  disabled={
                                    isSubmitting ||
                                    (!form.specialization.includes(option.value) &&
                                      form.specialization.length >= 2)
                                  }
                                  className="mr-2.5 h-4 w-4 text-blue-600 dark:text-blue-400 border-gray-300 dark:border-gray-600 rounded focus:ring-blue-500 dark:focus:ring-blue-400"
                                />
                                <span className="text-gray-700 dark:text-gray-200">{option.label}</span>
                              </label>
                            ))
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                  {form.specialization.length > 0 && (
                    <motion.div
                      className="mt-2.5 flex flex-wrap gap-2.5"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ duration: 0.25 }}
                    >
                      {form.specialization.map((value) => {
                        const option = specializationOptions.find((opt) => opt.value === value);
                        return (
                          <div
                            key={value}
                            className="group relative flex items-center bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 text-sm font-medium px-3 py-1.5 rounded-full hover:bg-blue-200 dark:hover:bg-blue-800 transition-colors duration-150"
                          >
                            <span>{option?.shortLabel}</span>
                            <button
                              type="button"
                              onClick={() => handleSpecializationChange(value)}
                              className="ml-1.5 text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-200"
                              disabled={isSubmitting}
                              aria-label={`Remove ${option?.label}`}
                            >
                              <X className="h-4 w-4" />
                            </button>
                            <span className="absolute hidden group-hover:block -top-10 left-1/2 transform -translate-x-1/2 bg-gray-800 dark:bg-gray-700 text-white text-sm rounded py-1.5 px-2.5 whitespace-nowrap">
                              {option?.label}
                            </span>
                          </div>
                        );
                      })}
                    </motion.div>
                  )}
                  {form.specialization.length >= 2 && (
                    <motion.p
                      className="mt-2.5 text-sm text-gray-500 dark:text-gray-400"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ duration: 0.25 }}
                    >
                      Maximum 2 specializations reached
                    </motion.p>
                  )}
                  {fieldErrors.specialization && (
                    <motion.div
                      className="flex items-center mt-2.5 text-sm text-red-600 dark:text-red-400"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ duration: 0.25 }}
                    >
                      <AlertCircle className="h-4 w-4 mr-1.5" />
                      {fieldErrors.specialization}
                    </motion.div>
                  )}
                </motion.div>
                <motion.div variants={fadeInUp} className="mt-6">
                  <label htmlFor="experience" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
                    Experience (Years)
                  </label>
                  <input
                    id="experience"
                    name="experience"
                    type="number"
                    min="0"
                    value={form.experience}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    placeholder="Years of experience"
                    className={getFieldClassName('experience')}
                    disabled={isSubmitting}
                  />
                  {fieldErrors.experience && (
                    <motion.div
                      className="flex items-center mt-1.5 text-sm text-red-600 dark:text-red-400"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ duration: 0.25 }}
                    >
                      <AlertCircle className="h-4 w-4 mr-1.5" />
                      {fieldErrors.experience}
                    </motion.div>
                  )}
                </motion.div>
                <motion.div variants={fadeInUp} className="mt-6">
                  <label htmlFor="phoneNumber" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
                    Phone Number
                  </label>
                  <input
                    id="phoneNumber"
                    name="phoneNumber"
                    value={form.phoneNumber}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    placeholder="Enter your phone number"
                    className={getFieldClassName('phoneNumber')}
                    disabled={isSubmitting}
                  />
                  {fieldErrors.phoneNumber && (
                    <motion.div
                      className="flex items-center mt-1.5 text-sm text-red-600 dark:text-red-400"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ duration: 0.25 }}
                    >
                      <AlertCircle className="h-4 w-4 mr-1.5" />
                      {fieldErrors.phoneNumber}
                    </motion.div>
                  )}
                </motion.div>
              </>
            )}

            <motion.button
              onClick={handleSignup}
              disabled={
                isSubmitting ||
                (role === 'technician' && form.specialization.length > 2)
              }
              className={`w-full font-semibold py-3.5 px-5 rounded-lg transition-colors duration-160 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 focus:ring-offset-2 dark:focus:ring-offset-gray-800 text-base ${
                isSubmitting || (role === 'technician' && form.specialization.length > 2)
                  ? 'bg-gray-400 dark:bg-gray-600 cursor-not-allowed text-white'
                  : 'bg-blue-600 dark:bg-blue-500 hover:bg-blue-700 dark:hover:bg-blue-600 text-white'
              }`}
              variants={fadeInUp}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              {isSubmitting ? 'Creating Account...' : 'Create Account'}
            </motion.button>

            {error && (
              <motion.div
                className="flex items-center justify-center mt-5 p-3.5 bg-red-50 dark:bg-red-900/30 border border-red-300 dark:border-red-700 rounded-lg"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.25 }}
              >
                <AlertCircle className="h-4 w-4 text-red-600 dark:text-red-400 mr-2.5" />
                <p className="text-red-600 dark:text-red-400 text-sm">{error}</p>
              </motion.div>
            )}
          </motion.div>

          {/* Login Link */}
          <motion.p
            className="text-center text-gray-600 dark:text-gray-300 text-sm mt-7"
            variants={fadeInUp}
          >
            Already have an account?{' '}
            <a href="/login" className="text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 font-medium">
              Sign in
            </a>
          </motion.p>
        </div>
      </motion.div>
    </motion.div>
  );
};