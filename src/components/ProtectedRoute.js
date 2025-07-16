import React from 'react';
import { Navigate } from 'react-router-dom';
import { useSelector } from 'react-redux';

export const ProtectedRoute = ({ children, allowedRoles }) => {
  const { token, role } = useSelector((state) => state.auth);

  if (!token || !allowedRoles.includes(role)) {
    return <Navigate to="/login" replace />;
  }

  return children;
};
