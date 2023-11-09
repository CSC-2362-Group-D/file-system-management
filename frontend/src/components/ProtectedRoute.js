import React from 'react';
import { Navigate } from 'react-router-dom';

const ProtectedRoute = ({ children }) => {
  const token = localStorage.getItem('token');
  if (!token) {
    // User is not authenticated
    return <Navigate to="/" />;
  }
  return children;
};

export default ProtectedRoute;