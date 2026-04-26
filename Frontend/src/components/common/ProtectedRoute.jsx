import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { toast } from 'react-toastify';

/**
 * ProtectedRoute Component
 * A wrapper for routes that require authentication and/or specific user roles.
 * 
 * @param {Array} allowedRoles - List of roles permitted to access this route
 * @param {React.Component} children - The component to render if access is granted
 */
const ProtectedRoute = ({ children, allowedRoles = [] }) => {
  const { isAuthenticated, user } = useSelector((state) => state.auth);
  const location = useLocation();

  // 1. Check if user is logged in
  if (!isAuthenticated) {
    // Redirect to home (or login trigger) and save the attempted location
    return <Navigate to="/" state={{ from: location }} replace />;
  }

  // 2. Check if user has required role
  if (allowedRoles.length > 0 && !allowedRoles.includes(user?.role)) {
    // User is logged in but doesn't have permission
    toast.error('🚫 Access Denied: You do not have permission to view this page.');
    return <Navigate to="/dashboard" replace />;
  }

  // 3. Access granted
  return children;
};

export default ProtectedRoute;
