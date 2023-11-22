import React from 'react';
import { Navigate } from 'react-router-dom';

const ProtectedRoute = ({ hasUser, children }) => {
  if (!hasUser) {
    return <Navigate to="/" />;
  }
  return children;
};


export default ProtectedRoute;